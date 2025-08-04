# Hệ Thống Authentication - AnBok

## Tổng Quan

Hệ thống authentication của AnBok được thiết kế để quản lý trạng thái đăng nhập của người dùng và hiển thị giao diện phù hợp dựa trên trạng thái đó.

## Tính Năng

### 1. Kiểm Tra Trạng Thái Đăng Nhập
- Tự động kiểm tra trạng thái đăng nhập khi trang web được tải
- Lưu trữ thông tin người dùng trong localStorage
- Hiển thị/ẩn các phần tử UI tương ứng

### 2. Giao Diện Người Dùng
- **Chưa đăng nhập**: Hiển thị nút "Đăng nhập"
- **Đã đăng nhập**: Hiển thị avatar và tên người dùng với dropdown menu

### 3. Dropdown Menu Người Dùng
- Hồ sơ cá nhân
- Danh sách yêu thích
- Lịch sử đơn hàng
- Cài đặt
- Đăng xuất

## Cấu Trúc File

```
book_library/
├── index.html          # Trang chủ với authentication UI
├── auth.html           # Trang đăng nhập/đăng ký
├── js/
│   └── auth.js         # Logic xử lý authentication
└── docs/
    └── AUTHENTICATION_SYSTEM.md  # Tài liệu này
```

## Cách Hoạt Động

### 1. Khi Chưa Đăng Nhập
```html
<!-- Hiển thị nút đăng nhập -->
<div class="tg-auth-buttons">
    <a href="auth.html">Đăng nhập</a>
</div>

<!-- Ẩn thông tin người dùng -->
<div class="tg-user-profile" style="display: none;">
    <!-- User info -->
</div>
```

### 2. Khi Đã Đăng Nhập
```html
<!-- Ẩn nút đăng nhập -->
<div class="tg-auth-buttons" style="display: none;">
    <a href="auth.html">Đăng nhập</a>
</div>

<!-- Hiển thị thông tin người dùng -->
<div class="tg-user-profile">
    <div class="tg-user-info">
        <img src="avatar.jpg" alt="User Avatar">
        <span>Nguyễn Văn A</span>
        <i class="fa fa-chevron-down"></i>
    </div>
    <div class="tg-user-dropdown">
        <!-- Dropdown menu -->
    </div>
</div>
```

## API Functions

### `checkAuthStatus()`
Kiểm tra trạng thái đăng nhập và cập nhật UI tương ứng.

### `updateUserInfo(user)`
Cập nhật thông tin người dùng trên giao diện.

### `setupUserDropdown()`
Thiết lập các sự kiện cho dropdown menu người dùng.

### `logout()`
Đăng xuất người dùng và cập nhật UI.

### `showNotification(message, type)`
Hiển thị thông báo cho người dùng.

## Dữ Liệu Người Dùng

Thông tin người dùng được lưu trong localStorage với cấu trúc:

```javascript
{
    isLoggedIn: true,
    uid: "user_id_from_firebase",
    email: "user@example.com",
    displayName: "Nguyễn Văn A",
    photoURL: "https://example.com/avatar.jpg"
}
```

## Tích Hợp Firebase

Hệ thống sử dụng Firebase Authentication cho:
- Đăng nhập bằng email/password
- Đăng nhập bằng Google
- Đăng ký tài khoản mới
- Đặt lại mật khẩu

## Responsive Design

Giao diện được tối ưu cho các thiết bị:
- Desktop: Hiển thị đầy đủ thông tin
- Mobile: Thu gọn avatar và tên người dùng

## Bảo Mật

- Thông tin nhạy cảm được lưu trong localStorage (chỉ cho demo)
- Trong production, nên sử dụng session storage hoặc cookies với httpOnly
- Firebase Authentication đảm bảo bảo mật cho backend

## Cách Sử Dụng

1. **Đăng nhập**: Truy cập `auth.html` và đăng nhập
2. **Kiểm tra trạng thái**: Hệ thống tự động kiểm tra khi tải trang
3. **Đăng xuất**: Click vào dropdown menu và chọn "Đăng xuất"

## Troubleshooting

### Vấn đề thường gặp:
1. **Không hiển thị thông tin người dùng**: Kiểm tra localStorage có dữ liệu user không
2. **Dropdown không hoạt động**: Kiểm tra file `auth.js` đã được load chưa
3. **Firebase lỗi**: Kiểm tra cấu hình Firebase trong `auth.html`

### Debug:
```javascript
// Kiểm tra trạng thái đăng nhập
console.log(localStorage.getItem('user'));

// Kiểm tra các element
console.log(document.querySelector('.tg-user-profile'));
console.log(document.querySelector('.tg-auth-buttons'));
``` 