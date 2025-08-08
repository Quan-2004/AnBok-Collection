# Firebase Setup Guide

## 1. Deploy Firebase Rules

Để sửa lỗi "Permission denied" khi truy cập news data, bạn cần deploy Firebase Rules:

### Cách 1: Sử dụng Firebase CLI
```bash
# Cài đặt Firebase CLI (nếu chưa có)
npm install -g firebase-tools

# Login vào Firebase
firebase login

# Deploy rules
firebase deploy --only database
```

### Cách 2: Sử dụng Firebase Console
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project "anbok-collection"
3. Vào Realtime Database
4. Chọn tab "Rules"
5. Copy nội dung từ file `firebase-rules.json`
6. Paste vào và nhấn "Publish"

## 2. Kiểm tra Rules đã được cập nhật

Rules mới đã thêm quyền đọc cho node `news`:
```json
"news": {
  ".read": true,
  ".write": "auth != null"
}
```

## 3. Test lại trang news.html

Sau khi deploy rules, refresh trang news.html và kiểm tra console để xem tin tức đã load thành công.

## 4. Troubleshooting

Nếu vẫn gặp lỗi:
1. Kiểm tra Firebase project ID có đúng không
2. Đảm bảo đã login vào Firebase CLI
3. Kiểm tra quyền truy cập project
4. Xem logs trong Firebase Console 