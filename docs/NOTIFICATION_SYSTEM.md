# HỆ THỐNG THÔNG BÁO (NOTIFICATION SYSTEM)

## Tổng quan
Hệ thống thông báo trong dự án Book Library là một component JavaScript được tích hợp trực tiếp vào file `index.html`. Hệ thống này cung cấp các thông báo popup tạm thời để thông báo cho người dùng về các hành động đã thực hiện.

## Các thành phần chính

### 1. CSS Classes
- **`.tg-notification`**: Class chính cho container thông báo
- **`.tg-notification-success`**: Thông báo thành công (màu xanh lá)
- **`.tg-notification-error`**: Thông báo lỗi (màu đỏ)
- **`.tg-notification-info`**: Thông báo thông tin (màu xanh dương)
- **`.tg-notification.show`**: Class để hiển thị thông báo với animation
- **`.tg-notification-content`**: Container cho nội dung thông báo

### 2. JavaScript Function
```javascript
function showNotification(message, type = 'info')
```

**Tham số:**
- `message`: Nội dung thông báo (string)
- `type`: Loại thông báo ('success', 'error', 'info') - mặc định là 'info'

## Cách hoạt động

### 1. Tạo thông báo
- Tạo một div element với class `tg-notification` và `tg-notification-${type}`
- Thêm icon tương ứng với loại thông báo:
  - Success: `fa-check-circle`
  - Error: `fa-exclamation-circle`
  - Info: `fa-info-circle`

### 2. Hiển thị animation
- Thông báo được thêm vào body với `transform: translateX(100%)` (ẩn bên phải)
- Sau 100ms, thêm class `show` để hiển thị với `transform: translateX(0)`
- Transition mượt mà trong 0.3s

### 3. Tự động ẩn
- Thông báo tự động ẩn sau 3 giây
- Animation ẩn: xóa class `show` và xóa element sau 300ms

## Vị trí và styling

### Vị trí
- Cố định ở góc trên bên phải màn hình
- `position: fixed`
- `top: 20px; right: 20px`

### Styling
- Nền trắng với border radius 8px
- Box shadow để tạo độ sâu
- Border-left với màu tương ứng với loại thông báo
- Z-index cao (10000) để hiển thị trên các element khác

## Các trường hợp sử dụng

### 1. Thông báo thành công (Success)
```javascript
showNotification('Đăng xuất thành công!', 'success');
showNotification('Đã thêm vào danh sách yêu thích!', 'success');
showNotification('Đã thêm vào giỏ hàng!', 'success');
```

### 2. Thông báo thông tin (Info)
```javascript
showNotification('Chuyển hướng đến trang đăng nhập...', 'info');
showNotification('Chuyển hướng đến trang sách...', 'info');
showNotification('Mở trang đọc thử...', 'info');
```

### 3. Thông báo lỗi (Error)
```javascript
showNotification('Có lỗi xảy ra!', 'error');
```

## Ưu điểm

1. **Đơn giản**: Không cần thư viện bên ngoài
2. **Linh hoạt**: Dễ dàng tùy chỉnh style và animation
3. **Tự động**: Tự động ẩn sau thời gian định sẵn
4. **Responsive**: Hoạt động tốt trên mọi kích thước màn hình
5. **Accessible**: Có icon và màu sắc phân biệt rõ ràng

## Nhược điểm

1. **Tích hợp cứng**: Code được viết trực tiếp trong HTML
2. **Không có queue**: Nhiều thông báo có thể chồng lên nhau
3. **Không có tương tác**: Không thể click để đóng thông báo
4. **Không có âm thanh**: Chỉ có hiệu ứng hình ảnh

## Cải tiến đề xuất

1. **Tách riêng file**: Tạo file CSS và JS riêng cho notification
2. **Thêm queue system**: Quản lý nhiều thông báo cùng lúc
3. **Thêm tương tác**: Cho phép click để đóng thông báo
4. **Thêm âm thanh**: Hiệu ứng âm thanh cho các loại thông báo khác nhau
5. **Thêm progress bar**: Hiển thị thời gian còn lại
6. **Thêm animation đa dạng**: Slide từ các hướng khác nhau

## Cách sử dụng

Để thêm thông báo mới, chỉ cần gọi:
```javascript
showNotification('Nội dung thông báo', 'loại_thông_báo');
```

Trong đó:
- `'loại_thông_báo'` có thể là: `'success'`, `'error'`, `'info'`
- Nếu không chỉ định loại, mặc định sẽ là `'info'` 