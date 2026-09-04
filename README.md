# 🏪 CHỢ NAU - Nền Tảng TMĐT Đồ Cũ Sinh Viên Đại Học Nghệ An

> **Đồ Án Sáng Tạo Khoa Học Kỹ Thuật - Sàn Thương Mại Điện Tử Chuyên Biệt Cho Sinh Viên NAU**

---

## 🌟 1. Giới thiệu dự án

**Chợ NAU** là nền tảng thương mại điện tử mua bán, trao đổi đồ dùng sinh hoạt, sách giáo trình, laptop, xe cộ và phòng trọ dành riêng cho cộng đồng sinh viên & giảng viên trường **Đại học Nghệ An (NAU)**.

Hệ thống giải quyết triệt để các rủi ro của các hội nhóm mạng xã hội tự phát:
- ✅ **Bộ lọc thông minh theo chuẩn NAU:** Phân loại theo khoa/ngành học, danh mục, mức giá, tình trạng đồ dùng.
- ✅ **Xác thực danh tính sinh viên 100% (Identity Verification):** Bắt buộc đối chiếu Thẻ sinh viên NAU / CCCD trước khi được cấp quyền Đăng bán hoặc Chat giao dịch.
- ✅ **Huy hiệu uy tín:** Hiển thị huy hiệu **✓ Đã xác thực** cùng điểm đánh giá sao (1–5 ★) và nhận xét minh bạch từ các đơn hàng thành công.
- ✅ **Chat giao dịch thời gian thực:** Nhắn tin trực tiếp giữa người mua và người bán gắn liền với từng sản phẩm.
- ✅ **Chống gian lận (Zero-Fraud Policy):** Hệ thống tố cáo vi phạm, quản trị viên can thiệp xử lý và khóa tài khoản tức thì.
- ✅ **Admin SaaS Dashboard:** Bảng điều khiển quản trị chuyên nghiệp dành cho Ban Quản Trị / Đoàn Trường theo dõi thống kê, duyệt thẻ sinh viên và kiểm duyệt tin đăng.

---

## 🚀 2. Công nghệ sử dụng (Tech Stack)

- **Frontend:** React 18, Vite, React Router DOM v6, Tailwind CSS (Hệ thống màu chuẩn nhận diện NAU Crimson Red `#C5221F` & Navy Blue `#1B4D89`), Lucide React icons.
- **Backend / Cloud Services:** Firebase Authentication (Google & Facebook OAuth), Cloud Firestore, Firebase Cloud Storage, Security Rules.
- **Triển khai:** Tối ưu hóa sẵn sàng cho Vercel & GitHub (Hỗ trợ cấu hình `vercel.json` SPA routing).

---

## 📂 3. Cấu trúc thư mục

```text
cho-nau/
├── public/
│   ├── favicon.svg            # Biểu trưng NAU chuẩn sắc đỏ-xanh
│   └── assets/
├── src/
│   ├── components/
│   │   ├── admin/             # Bảng thống kê, biểu đồ và bảng kiểm duyệt Admin
│   │   ├── chat/              # Cửa sổ chat, danh sách hội thoại, bong bóng tin nhắn
│   │   ├── common/            # Button, Badge, Modal, Input, Select, RatingStars, ThemeToggle
│   │   ├── layout/            # Navbar, Footer, MainLayout, AdminLayout
│   │   ├── order/             # OrderCard, OrderStatusBadge
│   │   └── product/           # ProductCard, ProductGrid, ProductFilters, ImageGallery, ReportModal
│   ├── config/
│   │   ├── firebase.js        # Cấu hình Firebase Modular SDK
│   │   └── constants.js       # Hằng số danh mục và cấu hình hệ thống
│   ├── context/
│   │   ├── AuthContext.jsx    # Quản lý phiên đăng nhập thực tế (Firebase Auth & Firestore)
│   │   ├── CartContext.jsx    # Quản lý giỏ hàng & tính tổng tiền
│   │   ├── ThemeContext.jsx   # Quản lý Dark/Light mode
│   │   └── ToastContext.jsx   # Thông báo toast toàn cục
│   ├── pages/
│   │   ├── Admin/             # Các phân hệ Quản trị (Dashboard, Users, Products, Verifications, Orders, Reports, Settings)
│   │   ├── Cart/              # Trang giỏ hàng & đặt đơn
│   │   ├── Chat/              # Trang nhắn tin giao dịch thời gian thực
│   │   ├── CreateProduct/     # Trang đăng tin bán sản phẩm
│   │   ├── Home/              # Trang chủ marketplace & bộ lọc
│   │   ├── Login/             # Trang đăng nhập Google / Facebook OAuth
│   │   ├── Orders/            # Trang quản lý đơn mua & đơn bán
│   │   ├── ProductDetails/    # Trang chi tiết sản phẩm & uy tín người bán
│   │   ├── Profile/           # Trang cá nhân & đánh giá uy tín
│   │   ├── SavedProducts/     # Danh sách tin đăng đã lưu
│   │   └── Verification/      # Trang gửi hồ sơ thẻ sinh viên NAU
│   ├── routes/
│   │   ├── AppRoutes.jsx      # Định tuyến toàn ứng dụng
│   │   ├── ProtectedRoute.jsx # Bảo vệ trang cần đăng nhập
│   │   └── AdminRoute.jsx     # Bảo vệ trang Quản trị viên
│   ├── services/              # Tầng xử lý logic nghiệp vụ và Firebase APIs
│   ├── utils/                 # Formatters tiền tệ VND, thời gian, validators
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── firebase/
│   ├── firestore.rules        # Bộ quy tắc bảo mật dữ liệu Firestore
│   ├── storage.rules          # Bộ quy tắc lưu trữ hình ảnh Storage
│   └── firestore.indexes.json # Composite indexes tối ưu truy vấn
├── .env.example
├── .gitignore
├── vercel.json
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🛠️ 4. Hướng dẫn cài đặt & Khởi chạy cục bộ (Local Development)

### Bước 1: Cài đặt Dependencies
```bash
cmd /c npm install
```

### Bước 2: Cấu hình biến môi trường
Sao chép `.env.example` thành `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=cho-nau.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cho-nau
VITE_FIREBASE_STORAGE_BUCKET=cho-nau.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Bước 3: Chạy Development Server
```bash
cmd /c npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`

### Bước 4: Kiểm tra bản Build Production
```bash
cmd /c npm run build
```

---

## ☁️ 5. Hướng dẫn Triển khai Production lên Vercel

1. **Đẩy mã nguồn lên GitHub:**
   - Dự án đã có sẵn `.gitignore` để tự động loại bỏ `.env`, `node_modules` và thư mục `dist/`.
2. **Import Repository vào Vercel:**
   - Đăng nhập [Vercel](https://vercel.com) và chọn **Add New Project** -> Chọn repository Chợ NAU.
   - Framework Preset: **Vite**.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
3. **Cấu hình Environment Variables trên Vercel:**
   - Vào mục **Settings** -> **Environment Variables** trên dự án Vercel.
   - Thêm đầy đủ 6 biến môi trường từ Firebase (như trong file `.env.example`).
4. **Cấu hình SPA Rewrite (`vercel.json`):**
   - Dự án đã tích hợp sẵn `vercel.json` với cấu hình rewrite toàn bộ route về `/index.html`, đảm bảo người dùng khi F5/refresh các trang như `/admin`, `/chat`, `/orders`, `/product/:id` không bị lỗi 404.

---

## 🛡️ 6. Cơ chế Phân quyền & Cấp quyền Quản trị viên (Super Admin)

Hệ thống vận hành 100% bằng phân quyền thực tế:
- **Người dùng mới (Mặc định):** Đăng nhập qua Google/Facebook sẽ tự động tạo bản ghi trong collection `users/{uid}` với `role: "user"` và `verificationStatus: "new"`.
- **Cấp quyền Admin đầu tiên (Bootstrapping):**
  1. Đăng nhập một lần vào website bằng tài khoản Google/Gmail của bạn.
  2. Mở [Firebase Console](https://console.firebase.google.com/) -> Chọn Project -> Vào **Firestore Database**.
  3. Tìm đến collection `users` -> Tìm document có UID của bạn.
  4. Sửa giá trị trường `role` từ `"user"` thành `"admin"`.
  5. Đăng nhập lại hoặc làm mới website, thanh menu cá nhân trên Navbar sẽ xuất hiện mục **"Admin SaaS Dashboard"** và bạn có toàn quyền truy cập `/admin`.
- **Bảo mật hai lớp:**
  - `AdminRoute.jsx` chặn truy cập trực tiếp từ phía giao diện.
  - `firestore.rules` bảo vệ dữ liệu ở tầng backend: người dùng thường không thể tự sửa trường `role` hay `verificationStatus` của chính mình hoặc người khác.

---

## 🔒 7. Chính sách bảo mật (Security Rules)

- Chỉ tài khoản có `verificationStatus == 'verified'` và `status == 'active'` mới được đăng tin bán và gửi tin nhắn chat.
- Người dùng chỉ có quyền chỉnh sửa/xóa sản phẩm do chính mình đăng tải.
- Chỉ tài khoản có `role == 'admin'` mới có quyền duyệt hồ sơ thẻ sinh viên, xóa tin đăng hoặc khóa tài khoản vi phạm.
- Giới hạn ảnh tải lên tối đa 5MB và bắt buộc đúng định dạng ảnh hợp lệ.

---

© 2026 Chợ NAU - Dự án sáng tạo khoa học kỹ thuật Đại học Nghệ An.
