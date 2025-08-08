# Use Case Diagram - AnBok Collection Library System

## Actors (Người tham gia)
1. **Guest User (Khách)** - Người dùng chưa đăng nhập
2. **Registered User (Người dùng đã đăng ký)** - Người dùng đã có tài khoản
3. **Member (Thành viên)** - Người dùng đã mua gói membership
4. **Author (Tác giả)** - Người dùng có quyền đăng bài
5. **Admin (Quản trị viên)** - Người quản lý hệ thống

## Use Cases (Các chức năng)

### Guest User
- Xem danh sách sách/truyện
- Đọc tin tức
- Xem thông tin chi tiết sách/truyện miễn phí
- Đăng ký tài khoản
- Đăng nhập

### Registered User
- Đăng nhập/Đăng xuất
- Quản lý thông tin cá nhân
- Thêm sách/truyện vào wishlist
- Xem lịch sử đọc
- Mua sách/truyện đơn lẻ
- Mua gói membership
- Đọc sách/truyện đã mua
- Đăng ký làm tác giả
- Thanh toán qua VNPay

### Member
- Tất cả chức năng của Registered User
- Đọc sách/truyện dành cho thành viên
- Truy cập nội dung premium

### Author
- Tất cả chức năng của Member
- Đăng tải sách/truyện mới
- Quản lý tác phẩm của mình
- Xem thống kê tác phẩm

### Admin
- Quản lý người dùng
- Quản lý sách/truyện
- Quản lý tin tức
- Quản lý thể loại
- Quản lý đơn hàng
- Quản lý mã giảm giá
- Duyệt tác giả
- Xem thống kê hệ thống

## Mô tả Use Case Diagram

```
                    AnBok Collection Library System
                           Use Case Diagram

                 Guest User                    Registered User
                     |                              |
                     |                              |
           ┌─────────┼──────────┐          ┌───────┼────────┐
           │         │          │          │       │        │
           │    Xem sách    Đọc tin      Đăng    Quản lý   Mua
           │    truyện      tức miễn     ký      profile   sách
           │    miễn phí    phí          tài                truyện
           │                             khoản              
           │                                                
           └─────────┬──────────┘          └───────┬────────┘
                     │                             │
                 Đăng nhập ─────────────────────────┤
                                                   │
                                            ┌─────────────┐
                                            │   Member    │
                                            │             │
                                            │ - Đọc nội   │
                                            │   dung      │
                                            │   premium   │
                                            │ - Mua gói   │
                                            │   membership│
                                            └─────┬───────┘
                                                  │
                                            Đăng ký làm tác giả
                                                  │
                                            ┌─────┴───────┐
                                            │   Author    │
                                            │             │
                                            │ - Đăng tải │
                                            │   tác phẩm  │
                                            │ - Quản lý   │
                                            │   tác phẩm  │
                                            └─────────────┘
                                                  
                                            
                 Admin
                   |
        ┌──────────┼──────────┐
        │          │          │
    Quản lý    Quản lý    Quản lý
    người      sách       tin tức
    dùng       truyện     
        │          │          │
        └──────────┼──────────┘
                   │
            Duyệt tác giả
```

## Chi tiết các Use Case chính

### UC001: Đăng ký tài khoản
- **Actor**: Guest User
- **Mô tả**: Người dùng tạo tài khoản mới
- **Tiền điều kiện**: Chưa có tài khoản
- **Luồng chính**: 
  1. Nhập thông tin đăng ký
  2. Xác thực email
  3. Tạo tài khoản thành công

### UC002: Mua sách/truyện
- **Actor**: Registered User
- **Mô tả**: Người dùng mua sách hoặc truyện đơn lẻ
- **Tiền điều kiện**: Đã đăng nhập
- **Luồng chính**:
  1. Chọn sách/truyện
  2. Thêm vào giỏ hàng
  3. Áp dụng mã giảm giá (nếu có)
  4. Thanh toán qua VNPay
  5. Nhận sản phẩm

### UC003: Mua gói membership
- **Actor**: Registered User
- **Mô tả**: Người dùng mua gói thành viên để truy cập nội dung premium
- **Tiền điều kiện**: Đã đăng nhập
- **Luồng chính**:
  1. Chọn gói membership (3 tháng/6 tháng)
  2. Nhập thông tin thanh toán
  3. Thanh toán qua VNPay
  4. Kích hoạt tài khoản thành viên

### UC004: Đăng tải tác phẩm
- **Actor**: Author
- **Mô tả**: Tác giả đăng tải sách hoặc truyện mới
- **Tiền điều kiện**: Đã được duyệt làm tác giả
- **Luồng chính**:
  1. Nhập thông tin tác phẩm
  2. Upload file nội dung
  3. Chọn thể loại
  4. Đặt giá bán
  5. Gửi duyệt

### UC005: Quản lý đơn hàng
- **Actor**: Admin
- **Mô tả**: Quản trị viên quản lý các đơn hàng trong hệ thống
- **Tiền điều kiện**: Có quyền admin
- **Luồng chính**:
  1. Xem danh sách đơn hàng
  2. Cập nhật trạng thái đơn hàng
  3. Xử lý hoàn tiền (nếu cần)
