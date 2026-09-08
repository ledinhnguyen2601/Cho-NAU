// File: src/pages/Guide/CommunityRulesPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  BookOpen, 
  Laptop, 
  HelpCircle, 
  MapPin, 
  Sparkles, 
  Clock, 
  FileText, 
  ChevronRight, 
  ArrowRight, 
  Lock,
  Eye,
  BadgeCheck,
  Building2,
  Users,
  AlertCircle,
  ThumbsUp,
  Cpu,
  Bike,
  Coffee,
  HeartHandshake
} from 'lucide-react';

export const CommunityRulesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'verification';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['verification', 'trading', 'zero-fraud', 'rules', 'tips'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'verification', label: 'Xác Thực Thẻ SV', icon: ShieldCheck, desc: 'Quy trình & đặc quyền duyệt thẻ SV' },
    { id: 'trading', label: 'Giao Dịch An Toàn', icon: HeartHandshake, desc: '4 bước mua bán tận tay trong trường' },
    { id: 'zero-fraud', label: 'Chống Lừa Đảo (Zero-Fraud)', icon: Lock, desc: 'Quy tắc vàng bảo vệ tài chính SV' },
    { id: 'rules', label: 'Tiêu Chuẩn & Quy Chế', icon: FileText, desc: 'Quy tắc ứng xử & danh mục cấm' },
    { id: 'tips', label: 'Mẹo Kiểm Tra Đồ Cũ', icon: Laptop, desc: 'Cẩm nang test Laptop, Xe cộ, Thiết bị' }
  ];

  return (
    <div className="min-h-screen pb-16 bg-slate-50/60 dark:bg-nau-background text-nau-text dark:text-nau-text transition-colors">
      
      {/* Header Banner - Thiết kế hiện đại, chuẩn nhận diện Đại Học Nghệ An */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-10 sm:py-14 px-4 sm:px-6 shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tiêu Chuẩn Cộng Đồng Sinh Viên NAU</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Hướng Dẫn Giao Dịch & Quy Chế Hoạt Động
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Hệ thống quy định bảo vệ an toàn 100% cho sinh viên Đại học Nghệ An. Mua bán văn minh, minh bạch, nói KHÔNG với gian lận và lừa đảo.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        
        {/* Navigation Tabs - Vuốt ngang trơn tru trên Smartphone */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer shadow-xs border ${
                  isActive
                    ? 'bg-nau-red text-white border-nau-red shadow-md shadow-nau-red/20 scale-[1.02]'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="mt-6">

          {/* TAB 1: HƯỚNG DẪN XÁC THỰC THẺ SV */}
          {activeTab === 'verification' && (
            <div className="space-y-6 animate-fade-in">
              {/* Giới thiệu */}
              <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-nau-text dark:text-white">
                      Tại sao cần xác thực Thẻ Sinh Viên?
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cơ chế bảo vệ cốt lõi tạo nên sự khác biệt giữa Chợ NAU và các mạng xã hội bên ngoài.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      01
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Tích xanh SV chính chủ</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Nhận huy hiệu xác minh uy tín bên cạnh tên hiển thị, người mua hoàn toàn tin tưởng khi giao dịch.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      02
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Đăng tin không giới hạn</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Mở khóa toàn bộ quyền đăng bán giáo trình, laptop, xe cộ, đồ dùng sinh viên hoàn toàn miễn phí.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center font-bold text-xs">
                      03
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Loại bỏ tài khoản ảo</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Hệ thống tự động ngăn chặn các đối tượng xấu ngoài xã hội tạo tài khoản lừa đảo sinh viên trường.
                    </p>
                  </div>
                </div>
              </div>

              {/* Các bước xác thực */}
              <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700/80 space-y-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-nau-red" />
                  <span>Quy trình xác thực 3 bước cực kỳ đơn giản</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-nau-red text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      1
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Chuẩn bị ảnh thẻ SV hoặc CCCD</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Chụp rõ nét mặt trước Thẻ sinh viên Đại học Nghệ An (hoặc mặt trước CCCD kèm ảnh chụp cổng thông tin sinh viên/sổ tay sinh viên nếu mất thẻ). Chú ý không để lóa đèn flash, không cắt góc.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-nau-red text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      2
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Gửi hồ sơ trực tuyến</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Vào mục <Link to="/verification" className="text-nau-primary dark:text-blue-400 font-semibold underline">Xác thực tài khoản</Link>, điền đầy đủ Họ tên, Mã số sinh viên (MSSV), Khoa/Ngành đào tạo và tải ảnh thẻ lên.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-nau-red text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      3
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Admin đối soát & Kích hoạt tích xanh</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Ban quản trị Chợ NAU sẽ đối chiếu thông tin với dữ liệu sinh viên trường. Quá trình duyệt diễn ra nhanh chóng trong <strong>1 - 2 giờ làm việc</strong>. Sau khi duyệt, bạn sẽ nhận được thông báo ngay lập tức.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/verification"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-nau-red hover:bg-nau-red-hover text-white text-xs sm:text-sm font-bold shadow-md shadow-nau-red/25 transition-all"
                  >
                    <span>Gửi hồ sơ xác thực ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/create-product"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all"
                  >
                    <span>Xem trang đăng tin</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUY TRÌNH GIAO DỊCH AN TOÀN */}
          {activeTab === 'trading' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-nau-text dark:text-white">
                      Quy trình giao dịch an toàn 4 bước
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Nguyên tắc "Xem tận mắt - Cầm tận tay" giúp sinh viên không bao giờ bị thiệt thòi.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Step 1 */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-nau-red font-bold text-xs uppercase tracking-wider">
                      <span>Bước 01</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-nau-red" />
                      <span>Trao đổi qua Chat NAU</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Thương lượng trực tiếp trên sàn</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Sử dụng công cụ Chat trên Chợ NAU để hỏi chi tiết về tình trạng đồ vật, xin thêm ảnh/video nếu cần. Lịch sử trò chuyện trên web là bằng chứng bảo vệ bạn khi có phát sinh khiếu nại.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                      <span>Bước 02</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <span>Hẹn gặp trong khuôn viên trường</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Chọn địa điểm công khai an toàn</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Ưu tiên hẹn gặp tại các điểm đông người trong trường NAU: <strong>Căn tin, Sảnh nhà A/B, Thư viện, Khuôn viên sân thể thao, Ký túc xá</strong>. Tránh hẹn ở những nơi vắng vẻ hoặc ngõ hẻm vào đêm muộn.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                      <span>Bước 03</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      <span>Kiểm tra hàng tận tay</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Bật nguồn, thử tính năng</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Đối với đồ điện tử (Laptop, điện thoại): Mở máy, test sạc, kết nối wifi, màn hình, bàn phím. Đối với xe cộ: Thử phanh, lốp, đề máy. Với sách vở: Kiểm tra đủ trang, không rách nát.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                      <span>Bước 04</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>Thanh toán & Chốt đơn</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Tiền mặt hoặc Chuyển khoản tại chỗ</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Chỉ thanh toán khi đã hoàn toàn hài lòng với món đồ. Người bán vào mục Đơn hàng bấm <strong>"Xác nhận đã giao"</strong> để hệ thống đóng giao dịch và ghi nhận lịch sử uy tín.
                    </p>
                  </div>
                </div>
              </div>

              {/* Địa điểm khuyến nghị tại NAU */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/60 dark:to-slate-900/60 rounded-3xl p-6 border border-blue-100 dark:border-slate-700">
                <h4 className="font-bold text-sm text-blue-950 dark:text-blue-300 flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Các tọa độ giao dịch lý tưởng trong Trường Đại học Nghệ An</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 bg-white/80 dark:bg-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300 text-center shadow-xs">
                    ☕ Căn tin trung tâm NAU
                  </div>
                  <div className="p-3 bg-white/80 dark:bg-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300 text-center shadow-xs">
                    📚 Sảnh Thư viện trường
                  </div>
                  <div className="p-3 bg-white/80 dark:bg-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300 text-center shadow-xs">
                    🏛️ Sảnh tòa nhà Hiệu bộ
                  </div>
                  <div className="p-3 bg-white/80 dark:bg-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300 text-center shadow-xs">
                    🏢 Cổng Ký túc xá NAU
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHÍNH SÁCH CHỐNG LỪA ĐẢO (ZERO-FRAUD) */}
          {activeTab === 'zero-fraud' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-nau-text dark:text-white">
                      Chính sách bảo vệ Zero-Fraud (Không khoan nhượng với lừa đảo)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ngăn ngừa rủi ro tài chính, bảo vệ túi tiền sinh viên bằng công nghệ và quy chế nghiêm ngặt.
                    </p>
                  </div>
                </div>

                {/* 3 Nguyên tắc vàng */}
                <div className="space-y-3 mt-6">
                  <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3.5">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-rose-900 dark:text-rose-300">
                        1. TUYỆT ĐỐI KHÔNG CHUYỂN TIỀN CỌC TRƯỚC
                      </h4>
                      <p className="text-xs text-rose-800 dark:text-rose-400 mt-1 leading-relaxed">
                        99% các trường hợp lừa đảo trên mạng bắt đầu bằng chiêu trò: <i>"Đồ tốt giá rẻ, chuyển cọc 100k-200k để giữ hàng vì có nhiều người hỏi"</i>. Sau khi bạn chuyển cọc, kẻ xấu sẽ chặn liên lạc. <strong>Trên Chợ NAU, không một ai có quyền bắt bạn cọc tiền trước!</strong>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300">
                        2. CẢNH GIÁC VỚI CÁC LIÊN KẾT LẠ & MÃ OTP
                      </h4>
                      <p className="text-xs text-amber-800 dark:text-amber-400 mt-1 leading-relaxed">
                        Không bao giờ nhấn vào các đường link lạ gửi qua tin nhắn yêu cầu đăng nhập ngân hàng hoặc mã OTP xác thực nhận tiền. Ban quản trị Chợ NAU <strong>không bao giờ</strong> yêu cầu cung cấp mật khẩu ngân hàng của bạn.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3.5">
                    <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300">
                        3. BÁO CÁO NGAY KHI PHÁT HIỆN TÀI KHOẢN KHẢ NGHI
                      </h4>
                      <p className="text-xs text-blue-800 dark:text-blue-400 mt-1 leading-relaxed">
                        Nếu gặp tin đăng bán đồ bất thường (giá rẻ phi lý, hình ảnh lấy từ mạng, giục cọc tiền), hãy bấm nút <strong>"Báo cáo vi phạm"</strong> trên tin đăng hoặc liên hệ ngay với Hotline/Email hỗ trợ của Chợ NAU để khóa tài khoản ngay lập tức.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chế tài xử lý */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Ban className="w-4 h-4 text-nau-red" />
                    <span>Chế tài xử phạt vi phạm</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                    <li>Khóa tài khoản vĩnh viễn, đưa Mã số sinh viên (MSSV) vào danh sách đen (Blacklist).</li>
                    <li>Gỡ bỏ vĩnh viễn toàn bộ tin đăng của tài khoản vi phạm.</li>
                    <li>Đối với các hành vi cố ý chiếm đoạt tài sản của bạn học: Ban quản trị sẽ xuất toàn bộ nhật ký dữ liệu IP, số điện thoại, MSSV và chuyển hồ sơ sang <strong>Phòng Công tác Chính trị & Quản lý Học sinh Sinh viên trường Đại học Nghệ An</strong> để xử lý kỷ luật theo quy chế trường.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TIÊU CHUẨN CỘNG ĐỒNG & QUY CHẾ */}
          {activeTab === 'rules' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700/80 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-nau-text dark:text-white">
                      Quy chế hoạt động & Tiêu chuẩn cộng đồng Chợ NAU
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Áp dụng cho 100% người dùng, sinh viên, cán bộ tham gia trên sàn Chợ NAU.
                    </p>
                  </div>
                </div>

                {/* Điều khoản 1 */}
                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-black flex items-center justify-center">1</span>
                    <span>Tôn chỉ & Mục đích</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                    Chợ NAU là nền tảng trao đổi, mua bán đồ dùng học tập, phương tiện, sinh hoạt cũ nội bộ phi thương mại dành cho sinh viên Đại học Nghệ An. Nghiêm cấm các đối tượng gian thương bên ngoài lợi dụng sàn để xả hàng hỏng, hàng lỗi nhằm trục lợi từ sinh viên.
                  </p>
                </div>

                {/* Điều khoản 2 */}
                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-black flex items-center justify-center">2</span>
                    <span>Danh mục hàng hóa CẤM ĐĂNG TẢI tuyệt đối</span>
                  </h3>
                  <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-2">
                      <Ban className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Đề thi, đáp án thi cử chưa công bố của trường NAU</span>
                    </div>
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-2">
                      <Ban className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Vũ khí, hung khí, vật liệu nổ, đồ chơi nguy hiểm</span>
                    </div>
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-2">
                      <Ban className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Thuốc lá điện tử, chất gây nghiện, rượu bia có cồn</span>
                    </div>
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-2">
                      <Ban className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Các tài liệu văn hóa phẩm đồi trụy, vi phạm pháp luật</span>
                    </div>
                  </div>
                </div>

                {/* Điều khoản 3 */}
                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-black flex items-center justify-center">3</span>
                    <span>Văn hóa ứng xử sinh viên</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                    Giao tiếp lịch sự, hòa nhã, đúng chuẩn mực sinh viên Đại học Nghệ An. Không sử dụng ngôn từ tục tĩu, xúc phạm danh dự nhân phẩm người khác trong khung chat hoặc phần nhận xét sản phẩm. Không spam tin nhắn hoặc ép giá một cách thô bạo.
                  </p>
                </div>

                {/* Điều khoản 4 */}
                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-black flex items-center justify-center">4</span>
                    <span>Tính xác thực của thông tin sản phẩm</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-7">
                    Người bán có trách nhiệm mô tả đúng 100% tình trạng thực tế của sản phẩm (mới bao nhiêu %, có vết xước hay lỗi nhỏ nào không). Không được lấy ảnh trên mạng để giả mạo hàng thật của mình.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MẸO KIỂM TRA ĐỒ CŨ */}
          {activeTab === 'tips' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-nau-text dark:text-white">
                      Cẩm nang kiểm tra đồ cũ (Kinh nghiệm dành cho Sinh viên)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Bí quyết từ các kỹ thuật viên giúp bạn chọn được đồ cũ bền, rẻ, đúng giá trị.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  {/* Laptop */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <span>1. Kiểm tra Laptop cũ học tập & đồ họa</span>
                    </h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                      <li><strong>Màn hình:</strong> Mở nền trắng toàn màn hình để kiểm tra điểm chết (dead pixel) hoặc vết ố vàng.</li>
                      <li><strong>Bàn phím:</strong> Vào trang <i>keyboardtester.com</i> để gõ thử từng phím xem có phím nào bị liệt.</li>
                      <li><strong>Pin:</strong> Nhấn nút Windows gõ <code>cmd</code>, chạy lệnh <code>powercfg /batteryreport</code> để xem dung lượng pin thiết kế và dung lượng thực tế còn lại.</li>
                      <li><strong>Cấu hình & Nhiệt độ:</strong> Kiểm tra đúng chip Core i5/i7, RAM, SSD trong Task Manager. Chạy thử 1 video 4K xem máy có bị nóng tắt đột ngột không.</li>
                    </ul>
                  </div>

                  {/* Xe cộ */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Bike className="w-4 h-4 text-emerald-600" />
                      <span>2. Kiểm tra Xe đạp, Xe máy đi học</span>
                    </h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                      <li><strong>Giấy tờ (với xe máy):</strong> Đối chiếu số khung, số máy dập trên xe xem có trùng khớp với Cà-vẹt (Giấy đăng ký xe) không.</li>
                      <li><strong>Hệ thống an toàn:</strong> Bóp thử phanh trước và phanh sau, kiểm tra độ mòn của lốp, đèn pha, đèn xi nhan, còi.</li>
                      <li><strong>Động cơ:</strong> Đề máy khi xe nguội xem có khói đen/khói trắng thoát ra từ ống xả không. Chạy thử một vòng quanh trường để cảm nhận độ êm của phuộc nhún.</li>
                    </ul>
                  </div>

                  {/* Đồ gia dụng */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-amber-600" />
                      <span>3. Kiểm tra Tủ lạnh, Quạt điện, Nồi cơm</span>
                    </h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                      <li><strong>Nồi cơm điện:</strong> Cho một ít nước cắm thử xem mâm nhiệt có nóng đều và rơ-le có nảy sang nút giữ ấm (Warm) khi sôi không.</li>
                      <li><strong>Quạt điện:</strong> Bật số nhỏ nhất xem trục quay có bị nghẽn đơ không, nghe tiếng gió xem có tiếng rít lạ do mòn bạc đạn không.</li>
                      <li><strong>Tủ lạnh mini:</strong> Cắm điện 10-15 phút xem dàn lạnh có bám tuyết sương lạnh đều không, kiểm tra gioăng cao su cửa tủ có hít chặt không.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default CommunityRulesPage;
