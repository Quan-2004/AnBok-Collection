# CẤU TRÚC DỰ ÁN THƯ VIỆN SÁCH

## 📁 Cấu trúc thư mục dự án

```
book_library/
├── 📄 index.html (Trang chủ)
├── 📄 404error.html (Trang lỗi 404)
├── 📄 aboutus.html (Về chúng tôi)
├── 📄 contactus.html (Liên hệ)
├── 📄 authors.html (Danh sách tác giả)
├── 📄 authordetail.html (Chi tiết tác giả)
├── 📄 products.html (Sản phẩm/Bán chạy nhất)
├── 📄 productdetail.html (Chi tiết sản phẩm)
├── 📄 newslist.html (Danh sách tin tức)
├── 📄 newsgrid.html (Lưới tin tức)
├── 📄 newsdetail.html (Chi tiết tin tức)
├── 📄 comingsoon.html (Trang sắp ra mắt)
├── 📄 modal-test.html (Test modal)
├── 📁 css/ (Thư mục CSS)
├── 📁 js/ (Thư mục JavaScript)
├── 📁 images/ (Thư mục hình ảnh)
├── 📁 fonts/ (Thư mục font chữ)
└── 📁 docs/ (Thư mục tài liệu)
```

## 🔐 HỆ THỐNG XÁC THỰC

### Trang chủ (index.html) ✅
- **Vị trí**: `/index.html`
- **Chức năng**: 
  - Banner chính với thông tin thư viện
  - Menu navigation đầy đủ
  - Modal đăng nhập/đăng ký
  - Hiển thị sách nổi bật
  - Gói hội viên
  - Testimonials
  - Tin tức mới nhất

### Đăng nhập (login.html) 🔄
- **Vị trí**: `/login.html`
- **Chức năng**:
  - Form nhập Email + Mật khẩu
  - Nút "Đăng nhập" → Gọi Firebase Auth
  - Nút "Đăng ký" → register.html
  - Nút "Quên mật khẩu" → reset_password.html
  - Đăng nhập bằng Google
  - Validation form

### Đăng ký (register.html) 🔄
- **Vị trí**: `/register.html`
- **Chức năng**:
  - Form đăng ký với các trường:
    - Họ và tên
    - Email
    - Mật khẩu
    - Xác nhận mật khẩu
  - Firebase Auth → Tự động chuyển về login.html hoặc dashboard
  - Validation form
  - Đăng ký bằng Google

### Quên mật khẩu (reset_password.html) 🔄
- **Vị trí**: `/reset_password.html`
- **Chức năng**:
  - Nhập email → Firebase gửi link reset
  - Form validation
  - Thông báo gửi email thành công

## 👤 TRANG SAU ĐĂNG NHẬP

### Dashboard người dùng (dashboard.html) 🔄
- **Vị trí**: `/dashboard.html`
- **Chức năng**:
  - Thông tin cá nhân
  - Lịch sử đơn hàng
  - Sách đã mua
  - Danh sách yêu thích
  - Cài đặt tài khoản
  - Thông báo

### Dashboard admin (admin_dashboard.html) 🔄
- **Vị trí**: `/admin_dashboard.html`
- **Chức năng**:
  - Quản lý sách
  - Quản lý đơn hàng
  - Quản lý người dùng
  - Thống kê bán hàng
  - Quản lý khuyến mãi
  - Báo cáo

## 🛒 HỆ THỐNG MUA SẮM

### Giỏ hàng (cart.html) 🔄
- **Vị trí**: `/cart.html`
- **Chức năng**:
  - Hiển thị sản phẩm trong giỏ
  - Cập nhật số lượng
  - Xóa sản phẩm
  - Tính tổng tiền
  - Áp dụng mã giảm giá
  - Chuyển đến thanh toán

### Thanh toán (checkout.html) 🔄
- **Vị trí**: `/checkout.html`
- **Chức năng**:
  - Thông tin giao hàng
  - Phương thức thanh toán
  - Xác nhận đơn hàng
  - Tích hợp cổng thanh toán

## 📚 QUẢN LÝ SÁCH

### Danh mục sách (category.html) 🔄
- **Vị trí**: `/category.html`
- **Chức năng**:
  - Hiển thị sách theo danh mục
  - Bộ lọc (giá, tác giả, đánh giá)
  - Sắp xếp (mới nhất, bán chạy, giá)
  - Phân trang

### Tìm kiếm (search.html) 🔄
- **Vị trí**: `/search.html`
- **Chức năng**:
  - Kết quả tìm kiếm
  - Bộ lọc nâng cao
  - Gợi ý tìm kiếm
  - Lịch sử tìm kiếm

## 👤 QUẢN LÝ NGƯỜI DÙNG

### Hồ sơ (profile.html) 🔄
- **Vị trí**: `/profile.html`
- **Chức năng**:
  - Thông tin cá nhân
  - Thay đổi mật khẩu
  - Cập nhật thông tin
  - Avatar

### Danh sách yêu thích (wishlist.html) 🔄
- **Vị trí**: `/wishlist.html`
- **Chức năng**:
  - Sách đã yêu thích
  - Thêm vào giỏ hàng
  - Xóa khỏi yêu thích
  - Chia sẻ danh sách

### Lịch sử đơn hàng (order_history.html) 🔄
- **Vị trí**: `/order_history.html`
- **Chức năng**:
  - Danh sách đơn hàng
  - Chi tiết đơn hàng
  - Trạng thái đơn hàng
  - Đánh giá sản phẩm

### Cài đặt (settings.html) 🔄
- **Vị trí**: `/settings.html`
- **Chức năng**:
  - Cài đặt thông báo
  - Bảo mật tài khoản
  - Ngôn ngữ
  - Giao diện

## 🎯 TÍNH NĂNG ĐẶC BIỆT

### Gói hội viên (membership.html) 🔄
- **Vị trí**: `/membership.html`
- **Chức năng**:
  - Gói Cơ Bản (99K/tháng)
  - Gói Premium (199K/tháng)
  - Gói VIP (399K/tháng)
  - So sánh các gói
  - Đăng ký gói

### Live Chat 💬
- **Vị trí**: Có sẵn trong index.html
- **Chức năng**:
  - Chat với nhân viên hỗ trợ
  - Gửi tin nhắn
  - Lịch sử chat
  - File đính kèm

### Quick Actions ⚡
- **Vị trí**: Có sẵn trong index.html
- **Chức năng**:
  - Truy cập nhanh
  - Tìm kiếm
  - Giỏ hàng
  - Yêu thích

## 🔧 CÁC MODAL VÀ POPUP

### Modal Đăng nhập ✅
- **Vị trí**: Có sẵn trong index.html
- **Chức năng**: Form đăng nhập

### Modal Đăng ký ✅
- **Vị trí**: Có sẵn trong index.html
- **Chức năng**: Form đăng ký

### Modal Quên mật khẩu ✅
- **Vị trí**: Có sẵn trong index.html
- **Chức năng**: Form quên mật khẩu

### Modal Xem trước sách ✅
- **Vị trí**: Có sẵn trong index.html
- **Chức năng**: Xem chi tiết sách

### Modal Timer ✅
- **Vị trí**: Có sẵn trong index.html
- **Chức năng**: Đếm ngược thời gian

### Universal Modal ✅
- **Vị trí**: Có sẵn trong index.html
- **Chức năng**: Thông báo chung

## 📱 TÍNH NĂNG RESPONSIVE

### Mobile Navigation
- Menu hamburger
- Tìm kiếm mobile
- Giỏ hàng mobile

### Tablet Optimization
- Layout tối ưu
- Touch gestures
- Swipe navigation

## 🔒 BẢO MẬT

### Firebase Authentication
- Email/Password
- Google Sign-in
- Password Reset
- Email Verification

### Data Protection
- HTTPS
- Input Validation
- XSS Protection
- CSRF Protection

## 📊 ANALYTICS

### Google Analytics
- Page Views
- User Behavior
- Conversion Tracking

### Custom Analytics
- Book Views
- Purchase Tracking
- User Engagement

## 🚀 PERFORMANCE

### Optimization
- Image Compression
- CSS/JS Minification
- Lazy Loading
- Caching

### CDN
- Static Assets
- Global Distribution
- Fast Loading

## 📋 CHECKLIST PHÁT TRIỂN

### ✅ Đã hoàn thành
- [x] index.html (Trang chủ)
- [x] Modal đăng nhập/đăng ký
- [x] Navigation menu
- [x] Responsive design
- [x] CSS styling
- [x] JavaScript functionality

### 🔄 Cần phát triển
- [ ] login.html
- [ ] register.html
- [ ] reset_password.html
- [ ] dashboard.html
- [ ] admin_dashboard.html
- [ ] cart.html
- [ ] checkout.html
- [ ] profile.html
- [ ] wishlist.html
- [ ] search.html
- [ ] category.html
- [ ] order_history.html
- [ ] settings.html
- [ ] membership.html

### 🔧 Cần tích hợp
- [ ] Firebase Authentication
- [ ] Database (Firestore)
- [ ] Payment Gateway
- [ ] Email Service
- [ ] File Upload
- [ ] Search Engine
- [ ] Analytics

## 📝 GHI CHÚ

- Tất cả các trang đều sử dụng Bootstrap framework
- Responsive design cho mobile, tablet, desktop
- Tích hợp Firebase cho backend
- SEO optimized
- Accessibility compliant
- Cross-browser compatible

## 🔗 LIÊN KẾT QUAN TRỌNG

- **Firebase Console**: https://console.firebase.google.com/
- **Bootstrap Documentation**: https://getbootstrap.com/docs/
- **Font Awesome**: https://fontawesome.com/
- **Google Fonts**: https://fonts.google.com/

---

*Cập nhật lần cuối: [Ngày hiện tại]*
*Phiên bản: 1.0*
*Tác giả: Development Team* 