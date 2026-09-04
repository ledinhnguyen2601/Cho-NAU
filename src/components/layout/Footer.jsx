// File: src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-nau-border dark:border-nau-border bg-nau-surface dark:bg-nau-background text-nau-text-secondary dark:text-nau-text-muted mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: About NAU Market */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-nau-primary flex items-center justify-center text-white font-black text-sm">
                NAU
              </div>
              <span className="text-lg font-black text-nau-text dark:text-nau-text">
                CHỢ NAU
              </span>
            </div>
            <p className="text-xs text-nau-text-muted dark:text-nau-text-muted leading-relaxed mb-4">
              Nền tảng thương mại điện tử mua bán, trao đổi đồ cũ uy tín, an toàn, đã xác thực danh tính dành riêng cho sinh viên Đại học Nghệ An.
            </p>
            <div className="flex items-center gap-2 text-xs text-nau-success dark:text-nau-success font-semibold bg-nau-success/10 dark:bg-nau-success/20 p-2.5 rounded-xl border border-nau-success/30 dark:border-nau-success/40">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% người bán được duyệt thẻ SV / CCCD</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-nau-text dark:text-nau-text uppercase tracking-wider mb-4">
              Danh mục phổ biến
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/?category=sach-giao-trinh" className="hover:text-nau-primary dark:hover:text-nau-primary transition-colors">
                  Sách & Giáo trình Đại học
                </Link>
              </li>
              <li>
                <Link to="/?category=laptop" className="hover:text-nau-primary dark:hover:text-nau-primary transition-colors">
                  Laptop học tập & Đồ hoạ
                </Link>
              </li>
              <li>
                <Link to="/?category=xe-phuong-tien" className="hover:text-nau-primary dark:hover:text-nau-primary transition-colors">
                  Xe đạp, Xe máy đi học
                </Link>
              </li>
              <li>
                <Link to="/?category=phong-tro" className="hover:text-nau-primary dark:hover:text-nau-primary transition-colors">
                  Phòng trọ & Ở ghép gần trường
                </Link>
              </li>
              <li>
                <Link to="/?category=do-gia-dung" className="hover:text-nau-primary dark:hover:text-nau-primary transition-colors">
                  Đồ gia dụng, Nồi cơm, Quạt
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Support */}
          <div>
            <h4 className="text-xs font-bold text-nau-text dark:text-nau-text uppercase tracking-wider mb-4">
              Hỗ trợ sinh viên
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/verification" className="hover:text-nau-primary dark:hover:text-nau-primary transition-colors">
                  Hướng dẫn xác thực Thẻ SV
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-nau-primary dark:hover:text-nau-primary transition-colors">
                  Quy trình giao dịch an toàn
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Chính sách chống lừa đảo (Zero-Fraud)</span>
              </li>
              <li>
                <span className="text-slate-400">Mẹo kiểm tra đồ điện tử cũ</span>
              </li>
              <li>
                <span className="text-slate-400">Phí dịch vụ: Miễn phí 100% cho SV</span>
              </li>
            </ul>
          </div>

          {/* Col 4: University Info & Contact */}
          <div>
            <h4 className="text-xs font-bold text-nau-text dark:text-nau-text uppercase tracking-wider mb-4">
              Đại học Nghệ An (NAU)
            </h4>
            <ul className="space-y-2.5 text-xs text-nau-text-muted dark:text-nau-text-muted">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>TP. Vinh, Tỉnh Nghệ An, Việt Nam</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>support.chonau@nau.edu.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Hotline CLB SV: (0238) 3888 999</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-100 dark:border-nau-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-nau-text-muted dark:text-nau-text-muted">
          <p>© {new Date().getFullYear()} CHỢ NAU - Đồ Án Sáng Tạo Khoa Học Kỹ Thuật Sinh Viên NAU.</p>
          <p className="flex items-center gap-1">
            <span>Phát triển vì cộng đồng sinh viên NAU</span>
            <Heart className="w-3.5 h-3.5 text-nau-red fill-nau-red inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
