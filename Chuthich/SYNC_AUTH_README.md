# Hệ Thống Đăng Nhập Đồng Bộ - AnBok Collection

## Tổng Quan

Hệ thống đăng nhập đồng bộ đã được cải tiến để đảm bảo tính nhất quán giữa Firebase Authentication và localStorage trên tất cả các trang của website.

## Các Tính Năng Chính

### 1. Đồng Bộ Firebase Auth và LocalStorage
- Tự động đồng bộ trạng thái đăng nhập giữa Firebase và localStorage
- Đảm bảo tính nhất quán dữ liệu người dùng
- Xử lý fallback khi Firebase không khả dụng

### 2. Quản Lý Trạng Thái Đăng Nhập
- Theo dõi trạng thái đăng nhập real-time
- Cập nhật UI tự động khi trạng thái thay đổi
- Lưu trữ thông tin người dùng với timestamp

### 3. Hệ Thống Thông Báo
- Thông báo đăng nhập/đăng xuất thành công
- Thông báo lỗi chi tiết
- Hệ thống notification đẹp mắt

## Cấu Trúc Files

### Files Chính
- `js/auth.js` - Hệ thống authentication cơ bản
- `js/sync-auth.js` - Hệ thống đăng nhập đồng bộ mới
- `account/profile.html` - Trang profile với Firebase SDK
- `index.html` - Trang chủ với Firebase SDK
- `auth.html` - Trang đăng nhập với Firebase SDK

### Firebase Configuration
Tất cả các trang HTML đều có Firebase SDK được cấu hình:
```javascript
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYLKQprHcGWDUo4TNOvDzTqTbqUFG4FkA",
    authDomain: "anbok-collection.firebaseapp.com",
    databaseURL: "https://anbok-collection-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "anbok-collection",
    storageBucket: "anbok-collection.firebasestorage.app",
    messagingSenderId: "835844957818",
    appId: "1:835844957818:web:33fc3d03875d49fc5c3dc3",
    measurementId: "G-MS5FT355WW"
};
```

## Cách Hoạt Động

### 1. Khởi Tạo Hệ Thống
```javascript
// Tự động khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    initializeSyncAuth();
});

// Hoặc khi Firebase sẵn sàng
document.addEventListener('firebase-ready', function() {
    initializeSyncAuth();
});
```

### 2. Theo Dõi Trạng Thái Đăng Nhập
```javascript
// Firebase Auth State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        // User đăng nhập - lưu vào localStorage
        const userData = {
            isLoggedIn: true,
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email,
            photoURL: user.photoURL,
            lastLogin: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(userData));
        updateAuthUI(userData);
    } else {
        // User đăng xuất - xóa khỏi localStorage
        localStorage.removeItem('user');
        updateAuthUI(null);
    }
});
```

### 3. Cập Nhật UI
```javascript
function updateAuthUI(userData) {
    const authButtons = document.querySelector('.tg-auth-buttons');
    const userProfile = document.querySelector('.tg-user-profile');
    
    if (userData && userData.isLoggedIn) {
        // Hiển thị profile, ẩn nút đăng nhập
        authButtons.style.display = 'none';
        userProfile.style.display = 'block';
        updateUserInfo(userData);
    } else {
        // Hiển thị nút đăng nhập, ẩn profile
        authButtons.style.display = 'block';
        userProfile.style.display = 'none';
    }
}
```

### 4. Đăng Xuất Đồng Bộ
```javascript
window.syncLogout = function() {
    // Firebase logout
    if (window.firebaseAuth) {
        window.firebaseAuth.signOut().then(() => {
            completeSyncLogout();
        }).catch((error) => {
            completeSyncLogout();
        });
    } else {
        completeSyncLogout();
    }
};

function completeSyncLogout() {
    localStorage.removeItem('user');
    updateAuthUI(null);
    showNotification('Đăng xuất thành công!', 'success');
}
```

## Các Cải Tiến

### 1. Đồng Bộ Hoàn Toàn
- Firebase Auth và localStorage luôn đồng bộ
- Không có trường hợp dữ liệu không nhất quán
- Fallback khi Firebase không khả dụng

### 2. Quản Lý Trạng Thái Tốt Hơn
- Theo dõi thời gian đăng nhập
- Thông báo đăng nhập thành công chỉ khi vừa đăng nhập
- Xử lý lỗi tốt hơn

### 3. UI/UX Cải Tiến
- Thông báo loading khi đăng xuất
- Animation mượt mà
- Responsive design

### 4. Debug và Logging
- Console logging chi tiết
- Theo dõi trạng thái Firebase
- Thông báo lỗi rõ ràng

## Sử Dụng

### 1. Đăng Nhập
- Sử dụng Firebase Authentication
- Tự động đồng bộ với localStorage
- Cập nhật UI ngay lập tức

### 2. Đăng Xuất
- Gọi `window.syncLogout()` hoặc `logout()`
- Đăng xuất khỏi Firebase và xóa localStorage
- Cập nhật UI và chuyển hướng

### 3. Kiểm Tra Trạng Thái
- Gọi `window.checkAuthStatus()` hoặc `initializeSyncAuth()`
- Tự động cập nhật UI dựa trên trạng thái hiện tại

## Troubleshooting

### 1. Firebase Không Khả Dụng
- Hệ thống sẽ fallback về localStorage
- Vẫn hoạt động bình thường
- Log warning trong console

### 2. Lỗi Đăng Xuất
- Kiểm tra console để xem lỗi Firebase
- Hệ thống vẫn đăng xuất local ngay cả khi Firebase lỗi
- Thông báo lỗi rõ ràng cho người dùng

### 3. UI Không Cập Nhật
- Kiểm tra các element selector
- Đảm bảo file sync-auth.js được load
- Kiểm tra console để xem log

## Tương Lai

### 1. Cải Tiến Tiếp Theo
- Thêm refresh token handling
- Cải thiện security
- Thêm multi-factor authentication

### 2. Performance
- Lazy loading cho Firebase SDK
- Optimize localStorage usage
- Caching user data

### 3. Features
- Remember me functionality
- Auto-login
- Session management

## Kết Luận

Hệ thống đăng nhập đồng bộ mới đã giải quyết các vấn đề về tính nhất quán và đảm bảo trải nghiệm người dùng tốt hơn. Tất cả các trang đều sử dụng cùng một hệ thống authentication, đảm bảo tính đồng bộ hoàn toàn. 