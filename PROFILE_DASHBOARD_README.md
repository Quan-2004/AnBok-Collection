# Profile Dashboard - AnBok Collection

## Tổng quan
Profile Dashboard là một giao diện quản lý tài khoản người dùng với thiết kế dark theme hiện đại, được xây dựng cho website thư viện sách AnBok Collection.

## Tính năng chính

### 1. Layout và Navigation
- **Sidebar bên trái**: Hiển thị thông tin người dùng và menu điều hướng
- **Content bên phải**: Hiển thị nội dung tương ứng với menu được chọn
- **Responsive design**: Tối ưu cho desktop và mobile

### 2. Thông tin người dùng
- Avatar người dùng với khả năng thay đổi ảnh
- Tên người dùng và thống kê (sồi, sao)
- Nút nạp sồi và đăng ký hội viên

### 3. Menu điều hướng
- Quản lý tài khoản (mặc định active)
- Tủ sách cá nhân
- Quản lý đơn hàng
- Thành tích
- Lịch sử giao dịch
- Hỗ trợ khách hàng

### 4. Quản lý thông tin cá nhân
- **Tab Thông tin cá nhân**:
  - Tên đăng nhập (readonly)
  - ID người dùng (readonly)
  - Họ và tên (editable)
  - Ngày sinh với calendar picker
  - Giới tính (dropdown)
  - Avatar lớn với nút thay ảnh
  - Nút cập nhật và hủy

- **Các tab khác**: Địa chỉ, Bảo mật, Tài khoản liên kết (placeholder)

## Cấu trúc file

### HTML (profile.html)
```html
<!-- Main content section -->
<main id="tg-main" class="tg-main tg-haslayout">
    <section class="tg-sectionspace tg-haslayout">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <div class="tg-profile-dashboard">
                        <!-- Left Sidebar -->
                        <div class="tg-profile-sidebar">
                            <!-- User info, stats, buttons, navigation -->
                        </div>
                        
                        <!-- Right Content -->
                        <div class="tg-profile-content">
                            <!-- Content sections -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
```

### CSS (css/profile-dashboard.css)
- Dark theme với màu chủ đạo: `#1a1a1a`, `#2a2a2a`, `#4A6366`
- Responsive design với breakpoints
- Animations và hover effects
- Form styling và validation states

### JavaScript (js/profile-dashboard.js)
- Navigation handling
- Tab switching
- Form validation
- File upload cho avatar
- Auto-save functionality
- Notification system

## Cách sử dụng

### 1. Navigation
```javascript
// Chuyển đổi giữa các section
$('.tg-profile-nav a').on('click', function(e) {
    e.preventDefault();
    const targetSection = $(this).data('tab');
    // Switch to target section
});
```

### 2. Tab switching
```javascript
// Chuyển đổi giữa các tab
$('.tg-tab-btn').on('click', function(e) {
    e.preventDefault();
    const targetTab = $(this).data('tab');
    // Switch to target tab
});
```

### 3. Form validation
```javascript
// Validate form fields
function validateForm() {
    let isValid = true;
    $('.tg-form-group input:not([readonly]), .tg-form-group select').each(function() {
        if (!validateField($(this))) {
            isValid = false;
        }
    });
    return isValid;
}
```

### 4. File upload
```javascript
// Handle avatar change
$('.tg-btn-change-photo').on('click', function() {
    // Create file input and handle upload
});
```

## Responsive Design

### Desktop (>1024px)
- Sidebar cố định bên trái (280px)
- Content area chiếm phần còn lại
- Form layout 2 cột

### Tablet (768px - 1024px)
- Sidebar chuyển lên trên
- Content area chiếm toàn bộ chiều rộng
- Form layout 1 cột

### Mobile (<768px)
- Sidebar và content stack vertically
- Tab navigation wrap
- Avatar section horizontal layout

## Customization

### Thay đổi màu sắc
```css
:root {
    --primary-color: #4A6366;
    --secondary-color: #2a2a2a;
    --background-color: #1a1a1a;
    --text-color: #ffffff;
    --text-muted: #cccccc;
}
```

### Thêm section mới
1. Thêm menu item vào sidebar
2. Tạo content section tương ứng
3. Thêm JavaScript handler

### Thêm tab mới
1. Thêm tab button vào tab navigation
2. Tạo tab panel tương ứng
3. Thêm JavaScript handler

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies
- jQuery 3.x
- Font Awesome 4.x
- Bootstrap 3.x (optional, for responsive grid)

## Performance
- Lazy loading cho images
- Debounced auto-save
- Optimized animations
- Minimal DOM manipulation

## Security
- File type validation cho upload
- File size limits
- XSS prevention
- CSRF protection (cần implement)

## Future Enhancements
- [ ] Real-time data sync
- [ ] Advanced form validation
- [ ] Image cropping
- [ ] Dark/Light theme toggle
- [ ] Accessibility improvements
- [ ] PWA support
- [ ] Offline functionality 