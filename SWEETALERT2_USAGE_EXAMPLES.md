# Hướng Dẫn Sử Dụng SweetAlert2 trong AnBok Collection

## Tổng Quan
File `index.html` đã được cập nhật để sử dụng thư viện SweetAlert2 (Sw2) cho tất cả các thông báo. SweetAlert2 cung cấp giao diện thông báo đẹp mắt và dễ tùy chỉnh.

## Các Hàm Tiện Ích Đã Có Sẵn

### 1. Hàm Cơ Bản
```javascript
// Hiển thị thông báo tùy chỉnh
function showSweetAlert(title, text, icon = 'info', timer = null)

// Thông báo thành công
function showSuccessAlert(message, timer = 2000)

// Thông báo lỗi
function showErrorAlert(message)

// Thông báo thông tin
function showInfoAlert(message)

// Thông báo cảnh báo
function showWarningAlert(message)

// Hiển thị loading
function showLoadingAlert(title = 'Đang xử lý...', text = 'Vui lòng chờ trong giây lát')

// Đóng loading
function closeLoadingAlert()
```

### 2. Cách Sử Dụng Trực Tiếp
```javascript
// Thông báo đơn giản
Swal.fire({
    title: 'Tiêu đề',
    text: 'Nội dung thông báo',
    icon: 'success', // success, error, warning, info, question
    confirmButtonColor: '#4A6366'
});

// Thông báo tự động đóng
Swal.fire({
    title: 'Thành công!',
    text: 'Thao tác đã hoàn tất',
    icon: 'success',
    confirmButtonColor: '#4A6366',
    timer: 2000, // Tự động đóng sau 2 giây
    showConfirmButton: false // Ẩn nút OK
});
```

## Các Loại Thông Báo Đã Được Cập Nhật

### 1. Thông Báo Đăng Nhập/Đăng Ký
```javascript
// Đăng nhập thành công
Swal.fire({
    title: 'Thành công!',
    text: 'Đăng nhập thành công!',
    icon: 'success',
    confirmButtonColor: '#4A6366',
    timer: 2000,
    showConfirmButton: false
});

// Đăng ký thành công
Swal.fire({
    title: 'Thành công!',
    text: 'Đăng ký thành công!',
    icon: 'success',
    confirmButtonColor: '#4A6366',
    timer: 2000,
    showConfirmButton: false
});
```

### 2. Thông Báo Giỏ Hàng
```javascript
// Thêm vào giỏ hàng
Swal.fire({
    title: 'Thành công!',
    text: 'Đã thêm vào giỏ hàng!',
    icon: 'success',
    confirmButtonColor: '#4A6366',
    timer: 1500,
    showConfirmButton: false
});

// Xóa khỏi giỏ hàng
Swal.fire({
    title: 'Thành công!',
    text: 'Đã xóa sản phẩm khỏi giỏ hàng!',
    icon: 'success',
    confirmButtonColor: '#4A6366',
    timer: 1500,
    showConfirmButton: false
});

// Xóa toàn bộ giỏ hàng
Swal.fire({
    title: 'Thành công!',
    text: 'Đã xóa toàn bộ giỏ hàng!',
    icon: 'success',
    confirmButtonColor: '#4A6366',
    timer: 1500,
    showConfirmButton: false
});
```

### 3. Thông Báo Hệ Thống
```javascript
// Thông báo chuyển hướng
Swal.fire({
    title: 'Thông báo',
    text: 'Đang chuyển đến trang thanh toán...',
    icon: 'info',
    confirmButtonColor: '#4A6366',
    timer: 1000,
    showConfirmButton: false
});

// Thông báo lỗi
Swal.fire({
    title: 'Lỗi!',
    text: 'Giỏ hàng trống!',
    icon: 'error',
    confirmButtonColor: '#4A6366'
});
```

### 4. Thông Báo Đăng Xuất
```javascript
// Đăng xuất thành công
Swal.fire({
    title: 'Thành công!',
    text: 'Đăng xuất thành công!',
    icon: 'success',
    confirmButtonColor: '#4A6366',
    timer: 1500,
    showConfirmButton: false
});
```

## Tùy Chỉnh Giao Diện

### 1. Màu Sắc
```javascript
// Sử dụng màu chủ đạo của dự án
confirmButtonColor: '#4A6366'

// Có thể thay đổi thành màu khác
confirmButtonColor: '#F4A261' // Màu cam
confirmButtonColor: '#28a745' // Màu xanh lá
confirmButtonColor: '#dc3545' // Màu đỏ
```

### 2. Icon
```javascript
icon: 'success'    // ✓ Xanh lá
icon: 'error'      // ✗ Đỏ
icon: 'warning'    // ⚠ Vàng
icon: 'info'       // ℹ Xanh dương
icon: 'question'   // ? Xám
```

### 3. Timer và Nút
```javascript
// Tự động đóng sau 2 giây
timer: 2000

// Ẩn nút OK
showConfirmButton: false

// Hiển thị nút OK
showConfirmButton: true
```

## Ví Dụ Nâng Cao

### 1. Thông Báo Xác Nhận
```javascript
Swal.fire({
    title: 'Bạn có chắc chắn?',
    text: "Hành động này không thể hoàn tác!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4A6366',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Có, xóa!',
    cancelButtonText: 'Hủy'
}).then((result) => {
    if (result.isConfirmed) {
        // Thực hiện hành động
        Swal.fire(
            'Đã xóa!',
            'Tệp đã được xóa thành công.',
            'success'
        );
    }
});
```

### 2. Thông Báo Input
```javascript
Swal.fire({
    title: 'Nhập tên của bạn',
    input: 'text',
    inputLabel: 'Tên',
    inputPlaceholder: 'Nhập tên vào đây...',
    confirmButtonColor: '#4A6366',
    showCancelButton: true,
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy'
}).then((result) => {
    if (result.isConfirmed) {
        Swal.fire(`Chào mừng ${result.value}!`);
    }
});
```

### 3. Thông Báo Loading
```javascript
// Hiển thị loading
Swal.fire({
    title: 'Đang xử lý...',
    text: 'Vui lòng chờ trong giây lát',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
        Swal.showLoading();
    }
});

// Đóng loading
Swal.close();
```

## Lưu Ý Quan Trọng

1. **Không cần xác nhận**: Tất cả các hành động đều diễn ra ngay lập tức
2. **Thông báo tự động**: Hầu hết thông báo đều tự động đóng sau 1-2 giây
3. **Màu sắc nhất quán**: Sử dụng màu chủ đạo `#4A6366` cho tất cả nút
4. **Icon phù hợp**: Sử dụng icon phù hợp với loại thông báo
5. **Responsive**: SweetAlert2 tự động điều chỉnh kích thước trên mobile

## Kết Luận

SweetAlert2 đã được tích hợp hoàn toàn vào `index.html` và cung cấp:
- Giao diện thông báo đẹp mắt và chuyên nghiệp
- Trải nghiệm người dùng nhất quán
- Dễ dàng tùy chỉnh và mở rộng
- Tương thích tốt với thiết kế hiện tại của dự án

Tất cả các thông báo cũ đã được thay thế bằng SweetAlert2, giữ nguyên chức năng nhưng cải thiện đáng kể về mặt giao diện. 