# Data Flow Diagram (DFD) - AnBok Collection Library System

## Context Diagram (Level 0)

```
                    ┌─────────────────┐
                    │   Guest User    │
                    └─────────┬───────┘
                              │
                    Yêu cầu xem sách/truyện
                    Thông tin đăng ký
                              │
                              ▼
    ┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
    │ Registered  │◄──►│   AnBok         │◄──►│   VNPay     │
    │ User        │    │   Collection    │    │   Gateway   │
    └─────────────┘    │   System        │    └─────────────┘
                       └─────────┬───────┘
                                 │
                                 ▼
                       ┌─────────────────┐
                       │     Admin       │
                       └─────────────────┘
```

## Level 1 DFD - Main Processes

```
┌─────────────┐  User Registration    ┌──────────────────┐
│ Guest User  ├─────────────────────►│  1.0 User        │
└─────────────┘  Login Request        │  Authentication  │
                                      │  & Registration  │
                                      └─────────┬────────┘
                                                │
                                        User Info
                                                │
                                                ▼
                                      ┌─────────────────┐
                                      │   D1: Users     │
                                      └─────────────────┘

┌─────────────┐  Browse Request       ┌──────────────────┐  Book/Story Data  ┌─────────────────┐
│ Registered  ├─────────────────────►│  2.0 Content     │◄─────────────────┤   D2: Books     │
│ User        │  Purchase Request     │  Management      │                   └─────────────────┘
└─────────────┘                      └─────────┬────────┘
                                               │
                                       Content Data
                                               │
                                               ▼
                                     ┌─────────────────┐
                                     │  D3: Stories    │
                                     └─────────────────┘

┌─────────────┐  Payment Info         ┌──────────────────┐  Order Data       ┌─────────────────┐
│ Member      ├─────────────────────►│  3.0 Order       │◄─────────────────┤   D4: Orders    │
└─────────────┘  Purchase Order       │  Processing      │                   └─────────────────┘
                                      └─────────┬────────┘
                                                │
                                        Payment Request
                                                │
                                                ▼
                                      ┌─────────────────┐
                                      │   VNPay Gateway │
                                      └─────────────────┘

┌─────────────┐  Story Upload         ┌──────────────────┐  Story Data       ┌─────────────────┐
│ Author      ├─────────────────────►│  4.0 Content     │◄─────────────────┤  D5: Story      │
└─────────────┘  Story Management     │  Creation        │                   │     Genres      │
                                      └─────────┬────────┘                   └─────────────────┘
                                                │
                                        Author Content
                                                │
                                                ▼
                                      ┌─────────────────┐
                                      │  D6: Author     │
                                      │     Works       │
                                      └─────────────────┘

┌─────────────┐  Management Commands  ┌──────────────────┐  System Data      ┌─────────────────┐
│ Admin       ├─────────────────────►│  5.0 System      │◄─────────────────┤  D7: System     │
└─────────────┘  Reports Request      │  Administration  │                   │     Config      │
                                      └─────────┬────────┘                   └─────────────────┘
                                                │
                                        Admin Data
                                                │
                                                ▼
                                      ┌─────────────────┐
                                      │  D8: Admin      │
                                      │     Logs        │
                                      └─────────────────┘
```

## Level 2 DFD - Detailed Process Breakdown

### Process 1.0 - User Authentication & Registration (Chi tiết)

```
┌─────────────┐  Registration Data    ┌─────────────────┐  User Validation  ┌─────────────────┐
│ Guest User  ├─────────────────────►│  1.1 User       │◄─────────────────┤  D9: User       │
└─────────────┘                      │  Registration    │                   │     Validation  │
                                     └─────────┬────────┘                   └─────────────────┘
                                               │
                                     User Profile
                                               │
                                               ▼
┌─────────────────┐  Profile Data     ┌─────────────────┐  Auth Status      ┌─────────────────┐
│   D1: Users     │◄─────────────────┤  1.2 Profile    │◄─────────────────┤ D10: Auth       │
└─────────────────┘                   │  Management     │                   │     Sessions    │
                                      └─────────┬────────┘                   └─────────────────┘
                                                │
                                      Login Response
                                                │
                                                ▼
                                      ┌─────────────────┐
                                      │ Registered User │
                                      └─────────────────┘
```

### Process 2.0 - Content Management (Chi tiết)

```
                                    ┌─────────────────┐
                                    │ Registered User │
                                    └─────────┬───────┘
                                              │
                                    Browse Request
                                              │
                                              ▼
┌─────────────────┐  Book Data      ┌─────────────────┐  Search Query     ┌─────────────────┐
│   D2: Books     ├────────────────►│  2.1 Search &   │◄─────────────────┤  D11: Search    │
└─────────────────┘                 │  Browse Content │                   │     Index       │
                                    └─────────┬────────┘                   └─────────────────┘
                                              │
                                    Content List
                                              │
                                              ▼
┌─────────────────┐  Story Data     ┌─────────────────┐  Wishlist Data    ┌─────────────────┐
│  D3: Stories    ├────────────────►│  2.2 Content    │◄─────────────────┤ D12: Wishlist   │
└─────────────────┘                 │  Display        │                   └─────────────────┘
                                    └─────────┬────────┘
                                              │
                                    Content Details
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │ Registered User │
                                    └─────────────────┘
```

### Process 3.0 - Order Processing (Chi tiết)

```
┌─────────────┐  Purchase Request    ┌─────────────────┐  Cart Data        ┌─────────────────┐
│ Member      ├────────────────────►│  3.1 Cart       │◄─────────────────┤ D13: Shopping   │
└─────────────┘                     │  Management     │                   │     Cart        │
                                    └─────────┬────────┘                   └─────────────────┘
                                              │
                                    Cart Items
                                              │
                                              ▼
┌─────────────────┐  Coupon Data    ┌─────────────────┐  Discount Info    ┌─────────────────┐
│ D14: Coupons    ├────────────────►│  3.2 Payment    │◄─────────────────┤ D15: Payment    │
└─────────────────┘                 │  Calculation    │                   │     Methods     │
                                    └─────────┬────────┘                   └─────────────────┘
                                              │
                                    Payment Info
                                              │
                                              ▼
┌─────────────────┐  Order Record   ┌─────────────────┐  Payment Response ┌─────────────────┐
│  D4: Orders     │◄───────────────┤  3.3 Payment    │◄─────────────────┤   VNPay Gateway │
└─────────────────┘                 │  Processing     │                   └─────────────────┘
                                    └─────────────────┘
```

### Process 4.0 - Content Creation (Chi tiết)

```
┌─────────────┐  Story Upload       ┌─────────────────┐  Genre Data       ┌─────────────────┐
│ Author      ├────────────────────►│  4.1 Content    │◄─────────────────┤  D5: Story      │
└─────────────┘                     │  Upload         │                   │     Genres      │
                                    └─────────┬────────┘                   └─────────────────┘
                                              │
                                    Content Metadata
                                              │
                                              ▼
┌─────────────────┐  Author Data    ┌─────────────────┐  Approval Status  ┌─────────────────┐
│  D6: Author     ├────────────────►│  4.2 Content    │◄─────────────────┤ D16: Content    │
│     Works       │                 │  Approval       │                   │     Approval    │
└─────────────────┘                 └─────────┬────────┘                   └─────────────────┘
                                              │
                                    Published Content
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │ Content Library │
                                    └─────────────────┘
```

### Process 5.0 - System Administration (Chi tiết)

```
┌─────────────┐  Admin Commands      ┌─────────────────┐  User Data        ┌─────────────────┐
│ Admin       ├────────────────────►│  5.1 User       │◄─────────────────┤   D1: Users     │
└─────────────┘                     │  Management     │                   └─────────────────┘
                                    └─────────┬────────┘
                                              │
                                    Management Actions
                                              │
                                              ▼
┌─────────────────┐  System Config  ┌─────────────────┐  Log Data         ┌─────────────────┐
│  D7: System     ├────────────────►│  5.2 System     │◄─────────────────┤  D8: Admin      │
│     Config      │                 │  Monitoring     │                   │     Logs        │
└─────────────────┘                 └─────────┬────────┘                   └─────────────────┘
                                              │
                                    Admin Reports
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │ Admin Dashboard │
                                    └─────────────────┘
```

## Data Stores (Kho dữ liệu)

| Data Store | Tên | Mô tả |
|------------|-----|--------|
| D1 | Users | Thông tin người dùng, profile, quyền hạn |
| D2 | Books | Dữ liệu sách (metadata, nội dung, giá) |
| D3 | Stories | Dữ liệu truyện (metadata, nội dung, giá) |
| D4 | Orders | Đơn hàng, lịch sử mua hàng |
| D5 | Story Genres | Thể loại truyện |
| D6 | Author Works | Tác phẩm của tác giả |
| D7 | System Config | Cấu hình hệ thống |
| D8 | Admin Logs | Nhật ký quản trị |
| D9 | User Validation | Dữ liệu xác thực người dùng |
| D10 | Auth Sessions | Phiên đăng nhập |
| D11 | Search Index | Chỉ mục tìm kiếm |
| D12 | Wishlist | Danh sách yêu thích |
| D13 | Shopping Cart | Giỏ hàng |
| D14 | Coupons | Mã giảm giá |
| D15 | Payment Methods | Phương thức thanh toán |
| D16 | Content Approval | Quy trình duyệt nội dung |
| D17 | Book Categories | Danh mục sách |
| D18 | Author Applications | Đơn đăng ký tác giả |
| D19 | News | Tin tức và thông báo |
| D20 | Membership Packages | Gói hội viên |

## External Entities (Thực thể bên ngoài)

| Entity | Mô tả |
|--------|--------|
| Guest User | Người dùng chưa đăng nhập |
| Registered User | Người dùng đã đăng ký |
| Member | Thành viên có gói |
| Author | Tác giả |
| Admin | Quản trị viên |
| VNPay Gateway | Cổng thanh toán VNPay |
| Firebase Auth | Hệ thống xác thực Firebase |
| Cloud Storage | Lưu trữ file và hình ảnh |

## Data Flows (Luồng dữ liệu chính)

### Authentication & Registration
- User Registration Data: Thông tin đăng ký từ Guest User
- Login Credentials: Thông tin đăng nhập
- User Profile: Thông tin profile người dùng
- Auth Session: Phiên đăng nhập

### Content Management
- Browse Request: Yêu cầu duyệt nội dung
- Search Query: Truy vấn tìm kiếm
- Content Data: Dữ liệu sách/truyện
- Content List: Danh sách nội dung
- Wishlist Data: Dữ liệu danh sách yêu thích

### Order Processing
- Purchase Request: Yêu cầu mua hàng
- Cart Data: Dữ liệu giỏ hàng
- Payment Info: Thông tin thanh toán
- Order Confirmation: Xác nhận đơn hàng
- VNPay Response: Phản hồi từ VNPay

### Content Creation
- Story Upload: Upload truyện mới
- Content Metadata: Thông tin metadata
- Author Content: Nội dung tác giả
- Approval Request: Yêu cầu duyệt nội dung

### System Administration
- Management Commands: Lệnh quản lý
- System Reports: Báo cáo hệ thống
- Admin Data: Dữ liệu quản trị
- User Management: Quản lý người dùng

## Quy trình xử lý dữ liệu chính

### 1. Đăng ký và xác thực người dùng
1. Guest User gửi thông tin đăng ký
2. Hệ thống xác thực qua Firebase Auth
3. Lưu thông tin vào D1: Users
4. Tạo profile trong D9: User Validation
5. Trả về thông tin tài khoản

### 2. Mua sách/truyện
1. User chọn sách/truyện từ D2/D3
2. Thêm vào D13: Shopping Cart
3. Áp dụng mã giảm giá từ D14: Coupons
4. Tính toán giá qua D15: Payment Methods
5. Xử lý thanh toán qua VNPay Gateway
6. Lưu đơn hàng vào D4: Orders

### 3. Quản lý nội dung
1. Author upload nội dung
2. Lưu vào D2: Books hoặc D3: Stories
3. Cập nhật D5: Story Genres
4. Gửi yêu cầu duyệt vào D16: Content Approval
5. Admin duyệt và publish

### 4. Tìm kiếm và duyệt
1. User gửi search query
2. Tìm kiếm trong D11: Search Index
3. Trả về kết quả từ D2/D3
4. Cập nhật D12: Wishlist nếu cần

### 5. Quản trị hệ thống
1. Admin truy cập dashboard
2. Quản lý người dùng trong D1: Users
3. Cấu hình hệ thống trong D7: System Config
4. Xem logs trong D8: Admin Logs
5. Quản lý gói hội viên trong D20: Membership Packages

## Công nghệ sử dụng

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap Framework
- jQuery Library
- SweetAlert2 cho thông báo

### Backend & Database
- Firebase Realtime Database
- Firebase Authentication
- Firebase Cloud Storage
- Firebase Hosting

### Payment Integration
- VNPay Gateway
- HMAC SHA512 encryption
- Secure payment processing

### Security
- Firebase Security Rules
- User authentication & authorization
- Data validation & sanitization
- Secure payment handling
