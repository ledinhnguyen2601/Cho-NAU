// File: src/components/brand/NauLoadingLogo.jsx
import React from 'react';

/**
 * NauLoadingLogo - Component hiển thị Logo động chuẩn nhận diện Trường Đại học Nghệ An (NAU)
 * Thiết kế chính xác theo thực tế:
 * - 3 cánh sen Làng Sen (quê Bác Hồ) uốn lượn mềm mại vươn lên thành đóa sen hé nở, chuyển động tuần tự
 * - Khối chữ "NAU" in hoa nghiêng bằng font Times New Roman Bold Italic với chân chữ cong nhẹ nhàng
 * - Không có chữ phụ, chỉ tập trung vào biểu tượng cánh sen và logo NAU
 */
export const NauLoadingLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'fullscreen'
  text = 'Đang tải dữ liệu...',
  className = ''
}) => {
  const sizeMap = {
    sm: { width: 120, height: 48, fontSize: 'text-[11px]' },
    md: { width: 175, height: 68, fontSize: 'text-xs' },
    lg: { width: 230, height: 88, fontSize: 'text-sm' },
    fullscreen: { width: 210, height: 80, fontSize: 'text-sm' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Keyframe Styles cho chuyển động cánh sen mềm mại tự nhiên */}
      <style>{`
        @keyframes nau-lotus-wave-1 {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          50% { transform: scale(1.06) rotate(-1.5deg); opacity: 1; filter: drop-shadow(0 2px 6px rgba(220,38,38,0.4)); }
        }
        @keyframes nau-lotus-wave-2 {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.92; }
          50% { transform: scale(1.08) rotate(2deg); opacity: 1; filter: drop-shadow(0 2px 7px rgba(220,38,38,0.5)); }
        }
        @keyframes nau-lotus-wave-3 {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          50% { transform: scale(1.07) rotate(1.5deg); opacity: 1; filter: drop-shadow(0 2px 6px rgba(220,38,38,0.45)); }
        }
        @keyframes nau-logo-breath {
          0%, 100% { transform: translateY(0); opacity: 0.95; }
          50% { transform: translateY(-1.5px); opacity: 1; }
        }
        @keyframes nau-dot-blink {
          0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
          40% { transform: scale(1.1); opacity: 1; }
        }
        .nau-petal-anim-1 {
          transform-origin: 20px 65px;
          animation: nau-lotus-wave-1 2s ease-in-out infinite;
        }
        .nau-petal-anim-2 {
          transform-origin: 25px 45px;
          animation: nau-lotus-wave-2 2s ease-in-out 0.3s infinite;
        }
        .nau-petal-anim-3 {
          transform-origin: 45px 25px;
          animation: nau-lotus-wave-3 2s ease-in-out 0.6s infinite;
        }
        .nau-text-anim {
          animation: nau-logo-breath 2.4s ease-in-out infinite;
        }
        .nau-dot-anim-1 { animation: nau-dot-blink 1.4s infinite ease-in-out both; }
        .nau-dot-anim-2 { animation: nau-dot-blink 1.4s infinite ease-in-out 0.2s both; }
        .nau-dot-anim-3 { animation: nau-dot-blink 1.4s infinite ease-in-out 0.4s both; }
      `}</style>

      {/* SVG Vector Logo NAU Chuẩn Font Times New Roman Bold Italic */}
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 240 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="nauLoadingPetalGrad" x1="0%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="#B91C1C" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>

          <linearGradient id="nauLoadingBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="60%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>

          <linearGradient id="nauLoadingRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>

          <filter id="nauLoadingShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* 3 Cánh Sen Nghệ An Chuyển Động Tuần Tự */}
        <g id="lotus-petals-loading" filter="url(#nauLoadingShadow)">
          {/* Cánh sen 1 (Dưới) */}
          <path
            className="nau-petal-anim-1"
            d="M 16 68 C 14 62, 18 52, 28 48 C 36 45, 48 48, 62 60 C 50 63, 38 65, 26 73 C 20 77, 16 74, 16 68 Z"
            fill="url(#nauLoadingPetalGrad)"
          />

          {/* Cánh sen 2 (Giữa) */}
          <path
            className="nau-petal-anim-2"
            d="M 23 52 C 20 38, 28 26, 44 20 C 56 16, 68 22, 74 34 C 64 36, 52 42, 42 56 C 34 66, 26 62, 23 52 Z"
            fill="url(#nauLoadingPetalGrad)"
            opacity="0.96"
          />

          {/* Cánh sen 3 (Trên) */}
          <path
            className="nau-petal-anim-3"
            d="M 44 24 C 44 14, 52 6, 64 4 C 74 2, 82 8, 86 16 C 80 24, 70 32, 58 38 C 50 42, 46 34, 44 24 Z"
            fill="url(#nauLoadingPetalGrad)"
          />

          {/* Chân uốn lượn */}
          <path
            d="M 22 73 C 35 73, 55 74, 84 74"
            stroke="url(#nauLoadingPetalGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* Chữ NAU Font Times New Roman Bold Italic */}
        <g id="letters-nau-loading" className="nau-text-anim" filter="url(#nauLoadingShadow)">
          <text
            x="92"
            y="66"
            style={{
              fontFamily: "'Times New Roman', Times, 'Playfair Display', serif",
              fontStyle: 'italic',
              fontWeight: 'bold',
              fontSize: '56px',
              letterSpacing: '-1px'
            }}
          >
            <tspan fill="url(#nauLoadingBlueGrad)">N</tspan>
            <tspan fill="url(#nauLoadingRedGrad)">A</tspan>
            <tspan fill="url(#nauLoadingBlueGrad)">U</tspan>
          </text>
        </g>
      </svg>

      {/* Thông báo tải trang */}
      {text && (
        <div className={`flex items-center gap-1.5 mt-2.5 text-slate-600 dark:text-slate-300 font-semibold tracking-wide ${currentSize.fontSize}`}>
          <span>{text}</span>
          <div className="flex items-center gap-1 ml-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-nau-red nau-dot-anim-1" />
            <span className="w-1.5 h-1.5 rounded-full bg-nau-blue nau-dot-anim-2" />
            <span className="w-1.5 h-1.5 rounded-full bg-nau-red nau-dot-anim-3" />
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
