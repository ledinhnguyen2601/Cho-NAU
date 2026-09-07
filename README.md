# 🏪 CHỢ NAU - Nền Tảng TMĐT Đồ Cũ Sinh Viên Đại Học Nghệ An

> **Đồ Án Sáng Tạo Khoa Học Kỹ Thuật - Sàn Thương Mại Điện Tử Chuyên Biệt Cho Sinh Viên NAU**  
> *Được thiết kế tối ưu hóa hiển thị toàn diện cho Smartphone & Máy tính theo phong cách sàn thương mại điện tử hàng đầu (Chợ Tốt, Shopee).*

---

## 🌟 1. Giới thiệu dự án

**Chợ NAU** là nền tảng thương mại điện tử mua bán, trao đổi đồ dùng sinh hoạt, giáo trình, laptop, xe cộ và phòng trọ chuyên biệt dành riêng cho cộng đồng sinh viên & giảng viên trường **Đại học Nghệ An (NAU)**.

Dự án giải quyết triệt để các rủi ro lừa đảo, ép giá, spam và mất an toàn thông tin của các hội nhóm mạng xã hội tự phát:
- ✅ **Chuẩn nhận diện thương hiệu NAU:** Tích hợp logo chính thức của trường (3 cánh sen Làng Sen quê Bác Hồ cùng khối chữ NAU xanh - đỏ đặc trưng).
- ✅ **Xác thực danh tính sinh viên 100% (Identity Verification):** Bắt buộc đối chiếu Thẻ sinh viên NAU / CCCD trước khi được cấp quyền Đăng bán hoặc Nhắn tin giao dịch.
- ✅ **Huy hiệu & Đánh giá uy tín thực tế:** Điểm đánh giá sao bắt đầu từ 0 ★ (chỉ tích lũy khi có giao dịch thành công thật), chống đánh giá ảo.
- ✅ **Trải nghiệm hình ảnh & Video đột phá:**
  - **Chống bóp/méo ảnh:** Áp dụng công nghệ hiển thị 2 lớp (nền mờ + `object-contain`), giữ nguyên 100% tỷ lệ gốc (dọc 9:16, ngang 16:9) không bao giờ bị cắt cụt.
  - **Lightbox toàn màn hình:** Xem ảnh phóng to sắc nét, hỗ trợ cử chỉ vuốt chạm (touch swipe) trên điện thoại và phím mũi tên trên máy tính.
  - **Video thực tế sản phẩm:** Hỗ trợ tải video quay cận cảnh tối đa **3 phút (180s)**, chuẩn Full HD **1080p**, trình phát thích ứng mượt mà theo tốc độ mạng.
- ✅ **Chat thời gian thực & Thông báo Email tự động:**
  - Nhắn tin gắn liền từng sản phẩm với tính năng chia sẻ vị trí, cập nhật trạng thái đơn hàng.
  - **Tự động gửi email thông báo khi người nhận Offline:** Nếu người nhận không hoạt động quá 3 phút, hệ thống tự động gửi email thông báo tin nhắn mới kèm link truy cập trực tiếp.
- ✅ **Chính sách kiểm soát & Quản trị chặt chẽ (Zero-Fraud):**
  - Người bán có quyền ẩn tin khi đã bán xong.
  - Admin có quyền cảnh báo vi phạm, xóa bài, và cấm (ban) xóa vĩnh viễn tài khoản khỏi hệ thống kèm lý do do Admin tự biên soạn.

---

## 🚀 2. Công nghệ sử dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện | Mô tả vai trò |
| :--- | :--- | :--- |
| **Core Framework** | React 18, Vite | Tối ưu hóa tốc độ tải trang, Single Page Application (SPA) |
| **Routing** | React Router DOM v6 | Điều hướng thông minh, bảo vệ tuyến đường (Protected & Admin Routes) |
| **Styling & UI** | Tailwind CSS, Lucide React | Giao diện chuẩn Chợ Tốt, Dark/Light Mode, responsive 100% |
| **Authentication** | Firebase Auth | Đăng nhập an toàn qua Google OAuth & Email sinh viên |
| **Database** | Cloud Firestore | Cơ sở dữ liệu thời gian thực (NoSQL), composite indexes |
| **Storage & Media** | HTML5 Canvas, Firebase Storage | Nén ảnh siêu nét (86% quality), kiểm tra dung lượng & thời lượng video |
| **Notification** | EmailJS REST API, Web Notifications | Gửi email thông báo tự động khi offline |
| **Triển khai** | Vercel, Git / GitHub | CI/CD tự động, cấu hình `vercel.json` định tuyến SPA |

---

## 📂 3. Cấu trúc thư mục toàn bộ dự án

```text
Ban4/
├── public/
│   ├── favicon.svg                # Favicon biểu trưng NAU
│   ├── nau_logo_photo.png         # Ảnh gốc logo bảng hiệu chuẩn của trường NAU
│   ├── nau_logo.png               # Logo đã xử lý nền phục vụ hiển thị
│   ├── nau_logo_clean.png         # Logo cánh sen + chữ NAU cắt gọn
│   └── nau_logo_trans.png         # Logo nền trong suốt (transparent)
├── src/
│   ├── components/
│   │   ├── admin/                 # Phân hệ Quản trị viên
│   │   │   ├── AdminSidebar.jsx       # Thanh điều hướng quản trị chuẩn logo NAU
│   │   │   ├── ChartOverview.jsx      # Biểu đồ doanh thu & tăng trưởng
│   │   │   ├── OrderModerationTable.jsx   # Bảng duyệt đơn hàng
│   │   │   ├── ProductModerationTable.jsx # Bảng duyệt & ẩn sản phẩm
│   │   │   ├── StatCard.jsx           # Thẻ chỉ số tổng quan
│   │   │   ├── UserModerationTable.jsx    # Bảng quản trị người dùng & nút Ban
│   │   │   └── VerificationModerationTable.jsx # Duyệt thẻ sinh viên
│   │   ├── brand/                 # Bộ nhận diện thương hiệu NAU
│   │   │   ├── NauBrandLogo.jsx       # Logo chuẩn hiển thị trên Navbar, Footer
│   │   │   ├── NauLoadingLogo.jsx     # Logo tĩnh từ ảnh gốc + chữ tải trang 3 chấm
│   │   │   └── index.js               # Export tập trung các component thương hiệu
│   │   ├── chat/                  # Hệ thống tin nhắn thời gian thực
│   │   │   ├── ChatInput.jsx          # Khung soạn tin, nút gửi, phím tắt Enter
│   │   │   ├── ChatWindow.jsx         # Cửa sổ chat, thông tin sản phẩm, định dạng giá
│   │   │   ├── ConversationList.jsx   # Danh sách các cuộc trò chuyện, bộ lọc tin
│   │   │   └── MessageBubble.jsx      # Bong bóng tin nhắn người mua/người bán
│   │   ├── common/                # Các component dùng chung chuẩn hóa
│   │   │   ├── Button.jsx             # Nút bấm đa năng (primary, outline, danger...)
│   │   │   ├── EmptyState.jsx         # Màn hình hiển thị khi không có dữ liệu
│   │   │   ├── ImageLightbox.jsx      # Modal xem ảnh phóng to toàn màn hình
│   │   │   ├── Input.jsx              # Trường nhập liệu có báo lỗi validate
│   │   │   ├── Modal.jsx              # Hộp thoại popup tiện ích
│   │   │   ├── OrderStatusBadge.jsx   # Huy hiệu trạng thái đơn hàng
│   │   │   ├── Pagination.jsx         # Phân trang dữ liệu
│   │   │   ├── RatingStars.jsx        # Đánh giá sao (0 đến 5 sao)
│   │   │   ├── Select.jsx             # Menu thả xuống tùy chọn
│   │   │   ├── ThemeToggle.jsx        # Công tắc chuyển đổi Dark / Light mode
│   │   │   └── VideoPlayer.jsx        # Trình phát video thích ứng (1080p, 720p, 480p)
│   │   ├── layout/                # Bố cục giao diện
│   │   │   ├── AdminLayout.jsx        # Layout trang quản trị
│   │   │   ├── Footer.jsx             # Chân trang thông tin & bản quyền
│   │   │   ├── MainLayout.jsx         # Layout chính (Navbar + Main + Mobile Bar)
│   │   │   └── Navbar.jsx             # Thanh điều hướng chính (Chợ Tốt style)
│   │   ├── order/                 # Quản lý đơn hàng
│   │   │   └── OrderCard.jsx          # Thẻ tóm tắt đơn mua / đơn bán
│   │   └── product/               # Quản lý hiển thị sản phẩm
│   │       ├── ImageGallery.jsx       # Bộ sưu tập ảnh 2 lớp chống bóp + tab Video
│   │       ├── ProductCard.jsx        # Thẻ sản phẩm chuẩn Chợ Tốt (nhãn Video, Hot)
│   │       ├── ProductFilters.jsx     # Bộ lọc nâng cao (Giá, Khoa, Tình trạng)
│   │       ├── ProductGrid.jsx        # Lưới sản phẩm tự co giãn responsive
│   │       ├── QuickFilterTabs.jsx    # Tab lọc nhanh danh mục theo icon
│   │       └── ReportModal.jsx        # Hộp thoại tố cáo tin đăng vi phạm
│   ├── config/
│   │   ├── constants.js           # Danh mục khoa học, địa điểm, quy tắc hệ thống
│   │   └── firebase.js            # Khởi tạo và cấu hình Firebase SDK
│   ├── context/
│   │   ├── AuthContext.jsx        # Quản lý đăng nhập, trạng thái xác thực sinh viên
│   │   ├── CartContext.jsx        # Quản lý giỏ hàng và tổng tiền
│   │   ├── ThemeContext.jsx       # Đồng bộ giao diện Sáng / Tối
│   │   └── ToastContext.jsx       # Hệ thống thông báo nổi (Toast notifications)
│   ├── pages/
│   │   ├── Admin/                 # Các trang quản trị hệ thống
│   │   │   ├── AdminDashboardPage.jsx     # Tổng quan số liệu toàn sàn
│   │   │   ├── AdminOrdersPage.jsx        # Quản lý giao dịch mua bán
│   │   │   ├── AdminProductsPage.jsx      # Quản lý & kiểm duyệt tin đăng
│   │   │   ├── AdminReportsPage.jsx       # Xử lý báo cáo vi phạm từ người dùng
│   │   │   ├── AdminSettingsPage.jsx      # Cấu hình hệ thống (tự động hóa email)
│   │   │   ├── AdminUsersPage.jsx         # Quản lý thành viên, cảnh báo & Ban nick
│   │   │   └── AdminVerificationsPage.jsx # Xét duyệt hồ sơ Thẻ sinh viên
│   │   ├── Cart/                  # Trang giỏ hàng & thanh toán
│   │   ├── Chat/                  # Trang nhắn tin giao dịch trực tiếp
│   │   ├── CreateProduct/         # Đăng tin sản phẩm (hỗ trợ ảnh + video 3 phút)
│   │   ├── Home/                  # Trang chủ danh mục & tìm kiếm sản phẩm
│   │   ├── Login/                 # Trang đăng nhập tài khoản sinh viên
│   │   ├── ManageListings/        # Quản lý tin đăng cá nhân (Ẩn tin đã bán)
│   │   ├── NotFound/              # Trang báo lỗi 404
│   │   ├── Orders/                # Quản lý lịch sử đơn mua & đơn bán
│   │   ├── ProductDetails/        # Chi tiết sản phẩm, video thực tế, người bán
│   │   ├── Profile/               # Hồ sơ cá nhân & đánh giá sao
│   │   ├── SavedProducts/         # Danh sách sản phẩm yêu thích đã lưu
│   │   └── Verification/          # Gửi ảnh chụp Thẻ sinh viên / CCCD xác thực
│   ├── routes/
│   │   ├── AdminRoute.jsx         # Bảo vệ phân hệ Quản trị viên
│   │   ├── AppRoutes.jsx          # Bảng định tuyến toàn bộ ứng dụng
│   │   └── ProtectedRoute.jsx     # Bảo vệ các chức năng yêu cầu đăng nhập
│   ├── services/                  # Tầng xử lý dữ liệu và API
│   │   ├── adminService.js        # Thống kê, xử lý cảnh báo và Ban tài khoản
│   │   ├── chatService.js         # Gửi nhận tin nhắn, hội thoại, đánh dấu đã đọc
│   │   ├── emailNotificationService.js # Gửi email tự động khi người dùng offline
│   │   ├── orderService.js        # Tạo đơn, cập nhật trạng thái đơn hàng
│   │   ├── productService.js      # CRUD sản phẩm, ẩn tin đã bán, tìm kiếm
│   │   ├── ratingService.js       # Đánh giá uy tín người bán sau giao dịch
│   │   ├── reportService.js       # Gửi tố cáo tin đăng vi phạm
│   │   ├── storageService.js      # Nén ảnh Canvas và tải video (< 3 phút, 1080p)
│   │   └── verificationService.js # Tải lên và xét duyệt Thẻ sinh viên NAU
│   ├── utils/
│   │   ├── formatters.js          # Định dạng tiền tệ VNĐ, thời gian tương đối
│   │   └── validators.js          # Kiểm tra tính hợp lệ form, dung lượng file
│   ├── App.jsx                    # Root component tích hợp Context Providers
│   ├── index.css                  # Tùy biến Tailwind, màu sắc NAU, keyframes
│   └── main.jsx                   # Điểm khởi chạy ứng dụng React DOM
├── firebase/
│   ├── firestore.rules            # Bộ quy tắc bảo mật dữ liệu Cloud Firestore
│   ├── firestore.indexes.json     # Cấu hình composite indexes cho truy vấn
│   └── storage.rules              # Bộ quy tắc bảo mật tệp tải lên Cloud Storage
├── .env.example                   # Mẫu khai báo biến môi trường
├── .gitignore                     # Cấu hình bỏ qua tệp nhạy cảm khi đẩy Git
├── package.json                   # Danh sách thư viện phụ thuộc và scripts
├── tailwind.config.js             # Cấu hình màu sắc Crimson Red, Navy Blue NAU
├── vercel.json                    # Cấu hình SPA rewrite phục vụ deploy Vercel
└── vite.config.js                 # Cấu hình Vite build & cổng chạy server
```

---

## 🛠️ 4. Hướng dẫn cài đặt & Khởi chạy cục bộ (Local Development)

### Bước 1: Cài đặt Dependencies
```bash
cmd /c npm install
```

### Bước 2: Cấu hình biến môi trường
Tạo file `.env` tại thư mục gốc dự án theo mẫu:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=cho-nau.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cho-nau
VITE_FIREBASE_STORAGE_BUCKET=cho-nau.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# (Tùy chọn) Cấu hình EmailJS phục vụ gửi thông báo tự động
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Bước 3: Khởi chạy máy chủ phát triển
```bash
cmd /c npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

### Bước 4: Kiểm tra bản đóng gói Production
```bash
cmd /c npm run build
```

---

## ☁️ 5. Hướng dẫn Triển khai Production lên Vercel

1. **Đẩy mã nguồn lên GitHub:**
   - Dự án đã được cấu hình `.gitignore` đầy đủ để bảo mật mã nguồn và tệp môi trường.
2. **Liên kết dự án trên Vercel:**
   - Đăng nhập [Vercel](https://vercel.com) -> Chọn **Add New Project** -> Chọn repository `Cho-NAU`.
   - Cấu hình Framework: **Vite**.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
3. **Thêm biến môi trường:**
   - Nhập các biến Firebase và EmailJS vào phần **Settings** -> **Environment Variables**.
4. **Định tuyến SPA mượt mà (`vercel.json`):**
   - Đã tích hợp sẵn file `vercel.json` để tự động điều hướng mọi route `/chat`, `/product/:id`, `/admin` về `/index.html`, loại bỏ hoàn toàn lỗi 404 khi tải lại trang.

---

## 🛡️ 6. Cơ chế Phân quyền & Quản trị viên (Super Admin)

Hệ thống hoạt động với mô hình phân quyền bảo mật 2 lớp:
1. **Người dùng thông thường:**
   - Đăng nhập lần đầu được cấp quyền `role: "user"` và trạng thái `verificationStatus: "new"`.
   - Cần gửi ảnh thẻ sinh viên tại trang `/verification` để được Admin cấp quyền đăng bài và gửi tin nhắn.
2. **Cấp quyền Admin đầu tiên:**
   - Vào [Firebase Console](https://console.firebase.google.com/) -> **Firestore Database**.
   - Chọn collection `users` -> Tìm document tương ứng với UID tài khoản của bạn.
   - Thay đổi giá trị `role` thành `"admin"`.
   - Khi tải lại trang web, bạn sẽ có toàn quyền truy cập phân hệ Quản trị tại `/admin`.
3. **Quyền hạn của Admin:**
   - Kiểm duyệt hồ sơ Thẻ sinh viên NAU / CCCD.
   - Gửi cảnh báo vi phạm tới người dùng kèm lý do.
   - Khóa hoặc cấm (Ban) xóa vĩnh viễn tài khoản gian lận khỏi cơ sở dữ liệu.
   - Quản lý toàn bộ tin đăng và theo dõi biến động doanh thu.

---

## 🔒 7. Quy tắc Bảo mật Dữ liệu (Security Rules)

- **Cloud Firestore:**
  - Người dùng chỉ được sửa/xóa tin đăng và đơn hàng do chính mình tạo ra.
  - Không ai có thể tự nâng cấp trường `role` hoặc `verificationStatus` từ phía client.
- **Media Storage:**
  - Ảnh đăng bán được nén tự động qua HTML5 Canvas với chất lượng tối ưu (86%) để vừa nét vừa nhẹ tải.
  - Video được kiểm tra thời lượng (`<= 180s`), độ phân giải (`<= 1080p`) và dung lượng (`<= 100MB`) trước khi tải lên.

---

© 2026 **Chợ NAU** - Dự Án Sáng Tạo Khoa Học Kỹ Thuật Đại Học Nghệ An.
