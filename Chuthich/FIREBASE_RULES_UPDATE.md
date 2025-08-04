# Hướng dẫn cập nhật Firebase Rules

## Vấn đề hiện tại
Trang web không thể truy cập collection `BookGenres` do Firebase Rules chưa cho phép đọc dữ liệu.

## Cách khắc phục

### Bước 1: Truy cập Firebase Console
1. Mở [Firebase Console](https://console.firebase.google.com/)
2. Chọn project `anbok-collection`
3. Vào **Realtime Database** trong menu bên trái

### Bước 2: Cập nhật Rules
1. Chọn tab **Rules**
2. Thay thế nội dung hiện tại bằng:

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
    }
  }
}
```

### Bước 3: Publish Rules
1. Nhấn nút **Publish** để lưu thay đổi
2. Đợi vài giây để rules được áp dụng

### Bước 4: Kiểm tra
1. Refresh trang web
2. Mở Developer Tools (F12)
3. Kiểm tra Console để xem có thông báo "Successfully loaded genres from BookGenres" không

## Lưu ý
- Rules mới cho phép đọc công khai các collections: `Books`, `BookGenres`, `Stories`, `StoryGenres`
- Chỉ authenticated users mới có thể write vào các collections này
- Nếu vẫn gặp lỗi, hãy đợi 1-2 phút để rules được propagate

## Fallback
Nếu không thể cập nhật rules ngay, trang web vẫn hoạt động bình thường bằng cách trích xuất thể loại từ dữ liệu sách. 