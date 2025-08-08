# 🔧 Khắc Phục Lỗi Firebase News

## ❌ Lỗi Hiện Tại
```
Error loading news from Firebase: Error: Permission denied
```

## ✅ Giải Pháp

### Bước 1: Cập nhật Firebase Rules

**Cách 1: Sử dụng Firebase Console (Khuyến nghị)**
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project **"anbok-collection"**
3. Vào **Realtime Database** (bên trái)
4. Chọn tab **"Rules"**
5. Thay thế toàn bộ nội dung bằng:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "orders": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "wishlist": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "BookCategories": {
      ".read": true,
      ".write": "auth != null"
    },
    "BookGenres": {
      ".read": true,
      ".write": "auth != null"
    },
    "StoryCategories": {
      ".read": true,
      ".write": "auth != null"
    },
    "StoryGenres": {
      ".read": true,
      ".write": "auth != null"
    },
    "Books": {
      ".read": true,
      ".write": "auth != null"
    },
    "Stories": {
      ".read": true,
      ".write": "auth != null"
    },
    "Carts": {
      ".read": true,
      ".write": "auth != null"
    },
    "Membership": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "MembershipPackages": {
      ".read": true,
      ".write": "auth != null"
    },
    "vnpay_transactions": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "news": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

6. Nhấn **"Publish"**

**Cách 2: Sử dụng Firebase CLI**
```bash
# Cài đặt Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only database
```

### Bước 2: Kiểm tra lại

1. Refresh trang `news.html`
2. Mở Developer Tools (F12)
3. Kiểm tra Console để xem:
   - ✅ "News data loaded from Firebase: [object Object]"
   - ❌ Không còn lỗi "Permission denied"

### Bước 3: Kết quả mong đợi

Sau khi sửa, trang news sẽ hiển thị:
- ✅ **Featured News**: 2 tin tức nổi bật
- ✅ **Latest News**: Tất cả tin tức theo thứ tự ngày đăng
- ✅ **Loading spinner** khi đang tải
- ✅ **Hover effects** cho các card tin tức

## 🆘 Nếu vẫn gặp lỗi

1. **Kiểm tra Firebase Project ID** trong `news.html`:
   ```javascript
   projectId: "anbok-collection"
   ```

2. **Kiểm tra Database URL**:
   ```javascript
   databaseURL: "https://anbok-collection-default-rtdb.asia-southeast1.firebasedatabase.app"
   ```

3. **Kiểm tra quyền truy cập project** trong Firebase Console

4. **Xem logs** trong Firebase Console > Realtime Database > Usage

## 📞 Hỗ trợ

Nếu vẫn gặp vấn đề, hãy:
1. Chụp màn hình lỗi trong Console
2. Chụp màn hình Firebase Rules
3. Gửi thông tin để được hỗ trợ 