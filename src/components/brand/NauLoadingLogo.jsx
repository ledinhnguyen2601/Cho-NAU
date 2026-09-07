// File: src/components/brand/NauLoadingLogo.jsx
import React from 'react';

/**
 * NauLoadingLogo - Component hiển thị Logo động chuẩn nhận diện Trường Đại học Nghệ An (NAU)
 * Thiết kế chính xác theo biển hiệu trường:
 * - 3 cánh sen đỏ bên trái chuyển động vươn nở (staggered petal wave)
 * - Chữ NAU cách điệu in nghiêng (N xanh, A đỏ, U xanh)
 * - Tên trường "TRƯỜNG ĐẠI HỌC NGHỆ AN - NGHE AN UNIVERSITY"
 * - Hoàn toàn độc lập, có thể sao chép sang dự án web khác để tái sử dụng ngay.
 * 
 * Props:
 * @param {'sm' | 'md' | 'lg' | 'fullscreen'} size - Kích cỡ hiển thị
 * @param {string} text - Dòng chữ thông báo tải (mặc định: 'Đang tải dữ liệu...')
 * @param {boolean} showSubtitle - Hiển thị tên trường bên dưới logo
 * @param {string} className - Lớp CSS tùy biến bao ngoài
 */
export const NauLoadingLogo = ({
  size = 'md',
  text = 'Đang tải dữ liệu...',
  showSubtitle = true,
  className = ''
}) => {
  // Quy đổi kích cỡ
  const sizeMap = {
    sm: { width: 150, height: 52, fontSize: 'text-[11px]' },
    md: { width: 220, height: 76, fontSize: 'text-xs' },
    lg: { width: 300, height: 104, fontSize: 'text-sm' },
    fullscreen: { width: 260, height: 90, fontSize: 'text-sm' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Keyframe Styles nhúng trực tiếp để component hoàn toàn độc lập khi tái sử dụng */}
      <style>{`
        @keyframes nau-petal-wave-1 {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.85; filter: drop-shadow(0 0 0px rgba(220,38,38,0)); }
          50% { transform: scale(1.08) rotate(-2deg); opacity: 1; filter: drop-shadow(0 2px 6px rgba(220,38,38,0.5)); }
        }
        @keyframes nau-petal-wave-2 {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; filter: drop-shadow(0 0 0px rgba(220,38,38,0)); }
          50% { transform: scale(1.12) rotate(3deg); opacity: 1; filter: drop-shadow(0 2px 8px rgba(220,38,38,0.6)); }
        }
        @keyframes nau-petal-wave-3 {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.85; filter: drop-shadow(0 0 0px rgba(220,38,38,0)); }
          50% { transform: scale(1.1) rotate(2deg); opacity: 1; filter: drop-shadow(0 2px 7px rgba(220,38,38,0.5)); }
        }
        @keyframes nau-shimmer-pulse {
          0%, 100% { opacity: 0.92; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-1.5px); }
        }
        @keyframes nau-dots-bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        .nau-petal-1 {
          transform-origin: 25px 65px;
          animation: nau-petal-wave-1 1.8s ease-in-out infinite;
        }
        .nau-petal-2 {
          transform-origin: 30px 48px;
          animation: nau-petal-wave-2 1.8s ease-in-out 0.25s infinite;
        }
        .nau-petal-3 {
          transform-origin: 40px 30px;
          animation: nau-petal-wave-3 1.8s ease-in-out 0.5s infinite;
        }
        .nau-text-brand {
          animation: nau-shimmer-pulse 2s ease-in-out infinite;
        }
        .nau-dot-1 { animation: nau-dots-bounce 1.4s infinite ease-in-out both; }
        .nau-dot-2 { animation: nau-dots-bounce 1.4s infinite ease-in-out 0.2s both; }
        .nau-dot-3 { animation: nau-dots-bounce 1.4s infinite ease-in-out 0.4s both; }
      `}</style>

      {/* SVG Vector Logo NAU Chuẩn */}
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 340 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Gradient Cánh Sen Đỏ NAU */}
          <linearGradient id="nauRedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* Gradient Xanh Dương NAU */}
          <linearGradient id="nauBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0B3C9B" />
          </linearGradient>

          {/* Bóng nổi cho các khối chữ */}
          <filter id="nauEmboss" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* ========================================================
            3 CÁNH SEN NGHỆ AN (TRÁI) - CHUYỂN ĐỘNG VƯƠN NỞ TUẦN TỰ
            ======================================================== */}
        <g id="nau-lotus-petals">
          {/* Cánh Sen 1 (Dưới cùng: vươn lượn từ đáy sang phải) */}
          <path
            className="nau-petal-1"
            d="M 12 78 C 22 72, 38 68, 56 74 C 42 82, 28 84, 12 78 Z"
            fill="url(#nauRedGradient)"
          />
          <path
            className="nau-petal-1"
            d="M 14 77 C 28 65, 48 64, 66 70 C 48 76, 32 79, 14 77 Z"
            fill="url(#nauRedGradient)"
            opacity="0.9"
          />

          {/* Cánh Sen 2 (Ở giữa: to bản, uốn cánh hình ngọn lửa hoa sen) */}
          <path
            className="nau-petal-2"
            d="M 22 62 C 24 45, 36 34, 52 28 C 50 44, 42 56, 28 66 C 24 64, 22 63, 22 62 Z"
            fill="url(#nauRedGradient)"
            filter="url(#nauEmboss)"
          />

          {/* Cánh Sen 3 (Trên cùng: vút cao kiêu hãnh) */}
          <path
            className="nau-petal-3"
            d="M 46 24 C 54 8, 70 2, 80 4 C 74 18, 64 28, 52 32 C 48 29, 46 26, 46 24 Z"
            fill="url(#nauRedGradient)"
            filter="url(#nauEmboss)"
          />

          {/* Đường chân uốn lượn liên kết từ cánh sen sang chữ NAU */}
          <path
            d="M 35 77 Q 75 79 120 78"
            stroke="url(#nauRedGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* ========================================================
            CHỮ "NAU" IN HOA NGHIÊNG CÁCH ĐIỆU (N xanh - A đỏ - U xanh)
            ======================================================== */}
        <g id="nau-letters" className="nau-text-brand" filter="url(#nauEmboss)">
          {/* Chữ N (Xanh dương) */}
          <path
            d="M 88 74 L 110 18 L 126 18 L 138 52 L 148 18 L 164 18 L 142 74 L 126 74 L 114 40 L 104 74 Z"
            fill="url(#nauBlueGradient)"
          />

          {/* Chữ A (Màu đỏ son) */}
          <path
            d="M 152 74 L 176 18 L 194 18 L 216 74 L 199 74 L 193 58 L 172 58 L 166 74 Z M 176 46 L 189 46 L 184 32 Z"
            fill="url(#nauRedGradient)"
          />

          {/* Chữ U (Xanh dương) */}
          <path
            d="M 214 18 L 230 18 L 222 54 C 220 64, 226 74, 240 74 C 254 74, 262 64, 264 54 L 272 18 L 288 18 L 280 54 C 276 72, 260 86, 238 86 C 216 86, 204 72, 208 54 Z"
            fill="url(#nauBlueGradient)"
          />
        </g>

        {/* ========================================================
            DÒNG TÊN TRƯỜNG: TRƯỜNG ĐẠI HỌC NGHỆ AN - NGHE AN UNIVERSITY
            ======================================================== */}
        {showSubtitle && (
          <g id="nau-subtitles">
            {/* TRƯỜNG ĐẠI HỌC NGHỆ AN (Màu đỏ) */}
            <text
              x="130"
              y="94"
              fill="#DC2626"
              fontSize="12"
              fontWeight="800"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              letterSpacing="0.8"
            >
              TRƯỜNG ĐẠI HỌC NGHỆ AN
            </text>

            {/* NGHE AN UNIVERSITY (Màu xanh dương) */}
            <text
              x="130"
              y="107"
              fill="#1D4ED8"
              fontSize="9.5"
              fontWeight="700"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              letterSpacing="2"
            >
              NGHE AN UNIVERSITY
            </text>
          </g>
        )}
      </svg>

      {/* Thông điệp tải trang với 3 chấm nhịp nhàng */}
      {text && (
        <div className={`flex items-center gap-1.5 mt-3 text-slate-600 dark:text-slate-300 font-semibold tracking-wide ${currentSize.fontSize}`}>
          <span>{text}</span>
          <div className="flex items-center gap-1 ml-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-nau-red nau-dot-1" />
            <span className="w-1.5 h-1.5 rounded-full bg-nau-blue nau-dot-2" />
            <span className="w-1.5 h-1.5 rounded-full bg-nau-red nau-dot-3" />
          </div>
        </div>
      )}
    </div>
  );

  if (size === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};

export default NauLoadingLogo;
