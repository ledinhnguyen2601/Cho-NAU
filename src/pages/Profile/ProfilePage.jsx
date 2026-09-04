// File: src/pages/Profile/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getUserProducts } from '../../services/productService';
import { getUserRatings } from '../../services/ratingService';
import { getAllUsers } from '../../services/adminService';
import { ProductCard } from '../../components/product/ProductCard';
import { RatingStars } from '../../components/common/RatingStars';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { getVerificationBadgeInfo, formatDateTime } from '../../utils/formatters';
import { 
  User, 
  CheckCircle, 
  GraduationCap, 
  Mail, 
  Phone, 
  Calendar, 
  Package, 
  Star, 
  Edit3, 
  ShieldCheck,
  Building2
} from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const queryUserId = searchParams.get('userId');
  const toast = useToast();

  const isViewingSelf = !queryUserId || queryUserId === currentUser?.id;

  const [profileUser, setProfileUser] = useState(currentUser);
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [activeTab, setActiveTab] = useState('active_products'); // 'active_products' | 'sold_products' | 'ratings' | 'edit'
  const [isLoading, setIsLoading] = useState(true);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editFaculty, setEditFaculty] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        let targetUser = currentUser;
        if (!isViewingSelf) {
          const all = await getAllUsers();
          targetUser = all.find(u => u.id === queryUserId) || currentUser;
        }

        setProfileUser(targetUser);
        if (targetUser) {
          setEditName(targetUser.name || '');
          setEditPhone(targetUser.phone || '');
          setEditFaculty(targetUser.faculty || '');

          const userProds = await getUserProducts(targetUser.id);
          setProducts(userProds);

          const userRates = await getUserRatings(targetUser.id);
          setRatings(userRates);
        }
      } catch (err) {
        console.error('Load profile error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [queryUserId, currentUser, isViewingSelf]);

  if (!profileUser) {
    return (
      <div className="p-12 text-center text-nau-text-muted">
        Không tìm thấy thông tin người dùng.
      </div>
    );
  }

  const badgeInfo = getVerificationBadgeInfo(profileUser.verificationStatus);
  const activeProducts = products.filter(p => p.status === 'active');
  const soldProducts = products.filter(p => p.status === 'sold');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      faculty: editFaculty
    });
    toast.success('Cập nhật hồ sơ cá nhân thành công!');
    setActiveTab('active_products');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Profile Header Banner */}
      <div className="bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border p-6 sm:p-8 shadow-sm relative overflow-hidden">
        
        {/* Decorative background accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-nau-primary/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
          <img
            src={profileUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={profileUser.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-nau-primary shadow-md shrink-0"
          />

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-nau-text dark:text-nau-text truncate">
                {profileUser.name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeInfo.bg} ${badgeInfo.text} ${badgeInfo.border}`}>
                {badgeInfo.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-nau-text-muted dark:text-nau-text-muted">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-nau-primary" />
                {profileUser.faculty || 'Đại học Nghệ An'}
              </span>
              {profileUser.studentId && (
                <span>• Mã SV: <strong>{profileUser.studentId}</strong></span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Gia nhập {formatDateTime(profileUser.joinedDate || '2024-01-01')}
              </span>
            </div>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-2 text-xs pt-1">
              <RatingStars rating={profileUser.rating || 5.0} size="sm" />
              <span className="font-bold text-nau-text dark:text-nau-text">
                {profileUser.rating || 5.0} ★
              </span>
              <span className="text-slate-400">
                ({profileUser.ratingCount || ratings.length} lượt đánh giá uy tín)
              </span>
            </div>
          </div>

          {/* Action on Header */}
          {isViewingSelf && (
            <div className="shrink-0 flex gap-2">
              <Button
                variant={activeTab === 'edit' ? 'primary' : 'outline'}
                size="sm"
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                onClick={() => setActiveTab(activeTab === 'edit' ? 'active_products' : 'edit')}
              >
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          )}
        </div>

      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b border-nau-border dark:border-nau-border pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('active_products')}
          className={`px-4 py-2 rounded-xl transition-colors shrink-0 ${
            activeTab === 'active_products'
              ? 'bg-nau-primary text-white'
              : 'text-nau-text-secondary dark:text-nau-text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Đang bán ({activeProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('sold_products')}
          className={`px-4 py-2 rounded-xl transition-colors shrink-0 ${
            activeTab === 'sold_products'
              ? 'bg-nau-primary text-white'
              : 'text-nau-text-secondary dark:text-nau-text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Đã bán ({soldProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('ratings')}
          className={`px-4 py-2 rounded-xl transition-colors shrink-0 ${
            activeTab === 'ratings'
              ? 'bg-nau-primary text-white'
              : 'text-nau-text-secondary dark:text-nau-text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Đánh giá uy tín ({ratings.length})
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'active_products' && (
          <div>
            {activeProducts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Người dùng hiện không có sản phẩm nào đang rao bán.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sold_products' && (
          <div>
            {soldProducts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Chưa có sản phẩm nào đã bán.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {soldProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'ratings' && (
          <div className="space-y-4">
            {ratings.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Chưa có nhận xét nào từ các bạn sinh viên khác.
              </div>
            ) : (
              <div className="space-y-3">
                {ratings.map(r => (
                  <div key={r.id} className="bg-nau-surface dark:bg-nau-background rounded-2xl border border-nau-border dark:border-nau-border p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={r.reviewerAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-nau-text dark:text-nau-text">{r.reviewerName}</p>
                          <p className="text-[10px] text-slate-400">{formatDateTime(r.createdAt)}</p>
                        </div>
                      </div>
                      <RatingStars rating={r.stars} size="sm" />
                    </div>
                    <p className="text-xs text-nau-text dark:text-nau-text-secondary pl-10">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'edit' && isViewingSelf && (
          <form onSubmit={handleSaveProfile} className="bg-nau-surface dark:bg-nau-background rounded-3xl border border-nau-border dark:border-nau-border p-6 shadow-sm space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-nau-text dark:text-nau-text">
              Cập nhật thông tin tài khoản
            </h3>

            <Input
              label="Họ và tên hiển thị"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />

            <Input
              label="Số điện thoại / Zalo"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />

            <Input
              label="Khoa / Viện trực thuộc"
              value={editFaculty}
              onChange={(e) => setEditFaculty(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setActiveTab('active_products')}>
                Hủy
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Lưu thay đổi
              </Button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};
