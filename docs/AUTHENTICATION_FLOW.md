# LUỒNG XÁC THỰC HỆ THỐNG THƯ VIỆN SÁCH

## CẤU TRÚC TRANG WEB

```
Trang chủ (index.html) ✅
│
├── Đăng nhập (login.html) 🔄
│   ├── Form nhập Email + Mật khẩu
│   ├── Nút "Đăng nhập" → Gọi Firebase Auth
│   ├── Nút "Đăng ký" → register.html
│   └── Nút "Quên mật khẩu" → reset_password.html
│
├── Đăng ký (register.html) 🔄
│   └── Form đăng ký → Firebase Auth → Tự động chuyển về login.html hoặc dashboard
│
├── Quên mật khẩu (reset_password.html) 🔄
│   └── Nhập email → Firebase gửi link reset
│
└── Trang sau đăng nhập
    ├── dashboard.html (Người dùng thường) 🔄
    └── admin_dashboard.html (Quản trị viên) 🔄
```

## CHI TIẾT TỪNG TRANG

### 1. Trang chủ (index.html) ✅

**Trạng thái**: Hoàn thành
**Đường dẫn**: `/index.html`

**Chức năng chính**:
- Banner chính với thông tin thư viện
- Menu navigation đầy đủ
- Modal đăng nhập/đăng ký (có sẵn)
- Hiển thị sách nổi bật
- Gói hội viên
- Testimonials
- Tin tức mới nhất

**Tính năng đặc biệt**:
- Live Chat (góc dưới phải)
- Quick Actions (góc dưới trái)
- Back to Top button
- Reading Progress bar

---

### 2. Đăng nhập (login.html) 🔄

**Trạng thái**: Cần phát triển
**Đường dẫn**: `/login.html`

**Form fields**:
```
├── Email: input type="email" (required)
├── Mật khẩu: input type="password" (required)
├── Remember me: checkbox
├── Đăng nhập: submit button
├── Đăng ký: link to register.html
├── Quên mật khẩu: link to reset_password.html
└── Đăng nhập Google: OAuth button
```

**Validation rules**:
- Email: định dạng email hợp lệ
- Mật khẩu: tối thiểu 6 ký tự
- Hiển thị thông báo lỗi real-time

**Firebase Integration**:
```javascript
firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Redirect to dashboard
    window.location.href = '/dashboard.html';
  })
  .catch((error) => {
    showError(error.message);
  });
```

---

### 3. Đăng ký (register.html) 🔄

**Trạng thái**: Cần phát triển
**Đường dẫn**: `/register.html`

**Form fields**:
```
├── Họ và tên: input type="text" (required)
├── Email: input type="email" (required)
├── Mật khẩu: input type="password" (required)
├── Xác nhận mật khẩu: input type="password" (required)
├── Điều khoản sử dụng: checkbox (required)
├── Đăng ký: submit button
├── Đăng nhập: link to login.html
└── Đăng ký Google: OAuth button
```

**Validation rules**:
- Họ tên: tối thiểu 2 từ, không chứa ký tự đặc biệt
- Email: định dạng email, chưa được sử dụng
- Mật khẩu: tối thiểu 8 ký tự, có chữ hoa, số, ký tự đặc biệt
- Xác nhận mật khẩu: phải khớp với mật khẩu

**Firebase Integration**:
```javascript
firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Update user profile
    userCredential.user.updateProfile({
      displayName: fullName
    });
    // Redirect to dashboard
    window.location.href = '/dashboard.html';
  })
  .catch((error) => {
    showError(error.message);
  });
```

---

### 4. Quên mật khẩu (reset_password.html) 🔄

**Trạng thái**: Cần phát triển
**Đường dẫn**: `/reset_password.html`

**Form fields**:
```
├── Email: input type="email" (required)
├── Gửi yêu cầu: submit button
└── Quay lại đăng nhập: link to login.html
```

**Firebase Integration**:
```javascript
firebase.auth().sendPasswordResetEmail(email)
  .then(() => {
    showSuccess('Email đặt lại mật khẩu đã được gửi');
  })
  .catch((error) => {
    showError(error.message);
  });
```

---

### 5. Dashboard người dùng (dashboard.html) 🔄

**Trạng thái**: Cần phát triển
**Đường dẫn**: `/dashboard.html`

**Các section chính**:
```
├── Thông tin cá nhân
│   ├── Avatar, họ tên, email
│   ├── Ngày tham gia, cấp độ thành viên
│   └── Nút chỉnh sửa thông tin
│
├── Thống kê cá nhân
│   ├── Số sách đã mua
│   ├── Số đơn hàng
│   ├── Điểm tích lũy
│   └── Số sách yêu thích
│
├── Hoạt động gần đây
│   ├── Đơn hàng mới nhất
│   ├── Sách đã xem gần đây
│   └── Đánh giá đã viết
│
└── Thông báo
    ├── Thông báo hệ thống
    ├── Khuyến mãi mới
    └── Sách mới phát hành
```

**Tính năng**:
- Hiển thị thông tin cá nhân
- Lịch sử đơn hàng
- Sách đã mua
- Danh sách yêu thích
- Cài đặt tài khoản
- Thông báo

---

### 6. Dashboard admin (admin_dashboard.html) 🔄

**Trạng thái**: Cần phát triển
**Đường dẫn**: `/admin_dashboard.html`

**Các module chính**:
```
├── Quản lý sách
│   ├── Thêm/sửa/xóa sách
│   ├── Quản lý danh mục
│   ├── Upload hình ảnh
│   └── Quản lý kho
│
├── Quản lý đơn hàng
│   ├── Danh sách đơn hàng
│   ├── Cập nhật trạng thái
│   ├── Xuất báo cáo
│   └── Thống kê doanh thu
│
├── Quản lý người dùng
│   ├── Danh sách thành viên
│   ├── Phân quyền
│   └── Khóa/mở khóa tài khoản
│
└── Thống kê
    ├── Doanh thu theo thời gian
    ├── Sách bán chạy
    ├── Người dùng mới
    └── Tỷ lệ chuyển đổi
```

**Tính năng**:
- Quản lý sách
- Quản lý đơn hàng
- Quản lý người dùng
- Thống kê bán hàng
- Quản lý khuyến mãi
- Báo cáo

---

## LUỒNG XÁC THỰC

### Luồng đăng nhập
```
1. User truy cập login.html
2. Nhập email và mật khẩu
3. Click "Đăng nhập"
4. Firebase Auth xác thực
5. Thành công → Chuyển đến dashboard.html
6. Thất bại → Hiển thị lỗi
```

### Luồng đăng ký
```
1. User truy cập register.html
2. Điền thông tin đăng ký
3. Click "Đăng ký"
4. Firebase Auth tạo tài khoản
5. Thành công → Chuyển đến dashboard.html
6. Thất bại → Hiển thị lỗi
```

### Luồng quên mật khẩu
```
1. User truy cập reset_password.html
2. Nhập email
3. Click "Gửi yêu cầu"
4. Firebase gửi email reset
5. User click link trong email
6. Đặt mật khẩu mới
7. Chuyển về login.html
```

---

## FIREBASE CONFIGURATION

### Firebase Setup
```javascript
// config/firebase.js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-domain.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-bucket.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

firebase.initializeApp(firebaseConfig);
```

### Authentication Methods
```
├── Email/Password
├── Google Sign-in
├── Password Reset
└── Email Verification
```

### Security Rules
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Books are readable by all, writable by admins
    match /books/{bookId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## CHECKLIST PHÁT TRIỂN

### ✅ Đã hoàn thành
- [x] index.html (Trang chủ)
- [x] Modal đăng nhập/đăng ký trong index.html
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

### 🔧 Cần tích hợp
- [ ] Firebase Authentication
- [ ] Firebase Firestore
- [ ] Google Sign-in
- [ ] Email verification
- [ ] Password reset
- [ ] Role-based access control

---

## NOTES

- Tất cả các trang đều sử dụng Bootstrap framework
- Responsive design cho mobile, tablet, desktop
- Tích hợp Firebase cho backend
- SEO optimized
- Accessibility compliant
- Cross-browser compatible

---

*Cập nhật lần cuối: [Ngày hiện tại]*
*Phiên bản: 1.0*
*Tác giả: Development Team* 