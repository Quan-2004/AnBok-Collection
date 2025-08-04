# Chức năng Chuyển hướng đến Trang Hồ sơ Cá nhân

## Mô tả
Đã thêm chức năng chuyển hướng đến trang hồ sơ cá nhân khi người dùng nhấn vào các nút sau:

1. **Nút `tg-user-info`** - Nút hiển thị thông tin người dùng ở góc trên bên phải
2. **Nút "Hồ sơ cá nhân"** - Nút trong dropdown menu của người dùng

## Các thay đổi đã thực hiện

### 1. File `index.html`

#### Thay đổi nút `tg-user-info`:
```html
<!-- Trước -->
<div class="tg-user-info" style="...">

<!-- Sau -->
<div class="tg-user-info" style="..." onclick="goToProfile();">
```

#### Thay đổi nút "Hồ sơ cá nhân":
```html
<!-- Trước -->
<a href="javascript:void(0);" class="tg-dropdown-item" style="...">
    <i class="fa fa-user" style="width: 16px; color: #4A6366;"></i>
    <span>Hồ sơ cá nhân</span>
</a>

<!-- Sau -->
<a href="javascript:void(0);" onclick="goToProfile();" class="tg-dropdown-item" style="...">
    <i class="fa fa-user" style="width: 16px; color: #4A6366;"></i>
    <span>Hồ sơ cá nhân</span>
</a>
```

#### Hiển thị User Profile:
```html
<!-- Trước -->
<div class="tg-user-profile" style="... display: none;">

<!-- Sau -->
<div class="tg-user-profile" style="... display: block;">
```

#### Ẩn nút đăng nhập:
```html
<!-- Trước -->
<div class="tg-auth-buttons" style="...">

<!-- Sau -->
<div class="tg-auth-buttons" style="... display: none;">
```

#### Thêm hàm JavaScript `goToProfile()`:
```javascript
// Hàm chuyển hướng đến trang profile
function goToProfile() {
    window.location.href = 'account/profile.html';
}
```

## Cách hoạt động

1. **Khi nhấn nút `tg-user-info`**: 
   - Chuyển hướng ngay lập tức đến `account/profile.html`

2. **Khi nhấn nút "Hồ sơ cá nhân"**:
   - Chuyển hướng ngay lập tức đến `account/profile.html`

## Trang đích

- **File**: `account/profile.html`
- **Đường dẫn**: `C:\Users\phamh\OneDrive\Desktop\book_library\account\profile.html`
- **Trạng thái**: Đã tồn tại và hoạt động

## Kiểm tra

1. Mở file `index.html` trong trình duyệt
2. Nhấn vào nút thông tin người dùng (góc trên bên phải)
3. Hoặc nhấn vào "Hồ sơ cá nhân" trong dropdown menu
4. Kiểm tra chuyển hướng ngay lập tức đến trang profile 