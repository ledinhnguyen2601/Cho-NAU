// File: src/components/brand/NauBrandLogo.jsx
import React from 'react';

/**
 * NauBrandLogo - Logo chuẩn nhận diện Trường Đại học Nghệ An (NAU)
 * Thiết kế chính xác theo thực tế:
 * - Bên trái: 3 cánh sen Làng Sen (quê Bác Hồ) uốn lượn mềm mại vươn lên thành đóa sen hé nở
 * - Bên phải: Khối chữ "NAU" in hoa nghiêng bằng font Times New Roman Bold Italic với chân chữ cong nhẹ nhàng
 * - Không có dòng chữ phụ bên dưới theo yêu cầu của nhà trường
 */
export const NauBrandLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  showShadow = true
}) => {
  const sizeMap = {
    sm: { width: 110, height: 42, textSize: 36, petalsScale: 0.8 },
    md: { width: 145, height: 55, textSize: 48, petalsScale: 1 },
    lg: { width: 190, height: 72, textSize: 62, petalsScale: 1.3 },
    xl: { width: 240, height: 90, textSize: 78, petalsScale: 1.6 }
  };

  const { width, height } = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 240 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Gradient Cánh Sen Nghệ An (Màu đỏ thắm Làng Sen) */}
          <linearGradient id="nauBrandPetalGrad" x1="0%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="#B91C1C" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>

          {/* Gradient Xanh Dương NAU */}
          <linearGradient id="nauBrandBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="60%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>

          {/* Gradient Đỏ Son cho chữ A */}
          <linearGradient id="nauBrandRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>

          {/* Bóng nổi tinh tế */}
          {showShadow && (
            <filter id="nauBrandShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.22" />
            </filter>
          )}
        </defs>

        {/* 
          =======================================================
          3 CÁNH SEN NGHỆ AN - BIỂU TƯỢNG QUÊ BÁC HỒ
          Uốn lượn mềm mại, vươn nở tự nhiên từ góc trái lên cao
          =======================================================
        */}
        <g id="lotus-petals-nau" filter={showShadow ? 'url(#nauBrandShadow)' : undefined}>
          {/* Cánh sen 1 (Dưới cùng: Bầu tròn ở dưới, uốn lượn vươn nhọn sang phải) */}
          <path
            d="M 16 68 C 14 62, 18 52, 28 48 C 36 45, 48 48, 62 60 C 50 63, 38 65, 26 73 C 20 77, 16 74, 16 68 Z"
            fill="url(#nauBrandPetalGrad)"
          />

          {/* Cánh sen 2 (Ở giữa: To bản, uốn hình ngọn lửa hoa sen hé nở thanh tao) */}
          <path
            d="M 23 52 C 20 38, 28 26, 44 20 C 56 16, 68 22, 74 34 C 64 36, 52 42, 42 56 C 34 66, 26 62, 23 52 Z"
            fill="url(#nauBrandPetalGrad)"
            opacity="0.96"
          />

          {/* Cánh sen 3 (Trên cùng: Vươn cao kiêu hãnh, cong nhọn mềm mại ở đỉnh) */}
          <path
            d="M 44 24 C 44 14, 52 6, 64 4 C 74 2, 82 8, 86 16 C 80 24, 70 32, 58 38 C 50 42, 46 34, 44 24 Z"
            fill="url(#nauBrandPetalGrad)"
          />

          {/* Nét chân liên kết uốn lượn dưới đáy cánh sen sang chữ NAU */}
          <path
            d="M 22 73 C 35 73, 55 74, 84 74"
            stroke="url(#nauBrandPetalGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* 
          =======================================================
          CHỮ "NAU" - FONT TIMES NEW ROMAN BOLD ITALIC CHUẨN
          Chữ in hoa nghiêng, có chân cong uốn nhẹ ở cuối mỗi nét
          N xanh dương, A đỏ thắm, U xanh dương
          =======================================================
        */}
        <g id="letters-nau" filter={showShadow ? 'url(#nauBrandShadow)' : undefined}>
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
            <tspan fill="url(#nauBrandBlueGrad)">N</tspan>
            <tspan fill="url(#nauBrandRedGrad)">A</tspan>
            <tspan fill="url(#nauBrandBlueGrad)">U</tspan>
          </text>
        </g>
      </svg>
    </div>
  );
};

export default NauBrandLogo;
