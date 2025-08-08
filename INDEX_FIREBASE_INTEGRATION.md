# Tích hợp Firebase Realtime Database cho Trang Index

## Tổng quan

Dự án đã được tích hợp Firebase Realtime Database để lấy dữ liệu động cho trang index và xử lý các nút để link đến đúng trang.

## Các tính năng đã triển khai

### 1. Lấy dữ liệu từ Firebase Realtime Database

#### Sách bán chạy nhất
- Lấy dữ liệu từ node `Books` trong Firebase
- Sắp xếp theo `sales_count` (giảm dần)
- Hiển thị 6 sách bán chạy nhất
- Cập nhật realtime khi có thay đổi

#### Sách mới phát hành
- Lấy dữ liệu từ node `Books` 
- Sắp xếp theo `published_date` (mới nhất trước)
- Hiển thị 3 sách mới nhất

#### Dữ liệu trending
- **Sách sôi nổi nhất**: Lấy từ `TrendingData/trending_books`
- **Sách yêu thích nhất**: Lấy từ `TrendingData/favorite_books`
- **Bình luận mới**: Lấy từ `Comments` (sắp xếp theo timestamp)

#### Tin tức mới nhất
- Lấy từ node `News`
- Sắp xếp theo `published_date`
- Hiển thị 6 tin tức mới nhất

### 2. Xử lý các nút và link

#### Navigation Links
- **Trang chủ**: `index.html`
- **Sách**: `book.html`
- **Truyện**: `story.html`
- **Tác giả**: `author-bio.html`
- **Tin tức**: `news.html`
- **Giới thiệu**: `about.html`
- **Liên hệ**: `contact.html`

#### Action Buttons
- **"Xem tất cả"** (Sách bán chạy): `book.html?category=bestselling`
- **"Xem tất cả"** (Sách mới): `book.html?category=new`
- **"Xem tất cả"** (Tin tức): `news.html`
- **"Đọc thêm"**: `book.html`
- **"Tìm hiểu thêm"**: `about.html`

#### Trending Section
- **"Xem thêm"** (Sôi nổi nhất): `book.html?category=trending`
- **"Xem thêm"** (Yêu thích nhất): `book.html?category=favorite`
- **"Xem thêm"** (Bình luận mới): `book.html?category=comments`

#### Book Interaction
- **"Thêm vào giỏ"**: Thêm sách vào giỏ hàng (localStorage)
- **"Thêm vào yêu thích"**: Thêm sách vào wishlist (localStorage)
- **Tên sách**: Link đến `book-detail.html?id={bookId}`
- **Tên tác giả**: Link đến `author-detail.html?id={authorId}`
- **Thể loại**: Link đến `book.html?category={category}`

### 3. Chức năng giỏ hàng

#### Quản lý giỏ hàng
- Thêm sách vào giỏ hàng
- Cập nhật số lượng
- Xóa sách khỏi giỏ hàng
- Xóa toàn bộ giỏ hàng
- Hiển thị tổng tiền và tiết kiệm

#### Modal giỏ hàng
- Hiển thị danh sách sách trong giỏ
- Cho phép thay đổi số lượng
- Nút thanh toán link đến `checkout.html`

### 4. Chức năng tìm kiếm

#### Search Box
- Tìm kiếm theo từ khóa
- Link đến `book.html?search={query}`
- Hỗ trợ Enter key

### 5. Quản lý người dùng

#### User Profile
- Hiển thị thông tin người dùng đã đăng nhập
- Dropdown menu với các tùy chọn
- Link đến các trang quản lý cá nhân

#### Authentication
- Kiểm tra trạng thái đăng nhập
- Hiển thị nút đăng nhập cho khách
- Xử lý đăng xuất

## Cấu trúc file

### Files chính
- `index.html` - Trang chủ với các nút đã được cập nhật
- `js/index-firebase.js` - Tích hợp Firebase Realtime Database
- `js/index-button-handler.js` - Xử lý các nút và tương tác

### Dependencies
- Firebase SDK (v10.7.1)
- jQuery
- SweetAlert2
- Bootstrap

## Cách sử dụng

### 1. Khởi tạo Firebase
```javascript
// Firebase config đã được cấu hình trong index.html
const firebaseConfig = {
    apiKey: "AIzaSyDYLKQprHcGWDUo4TNOvDzTqTbqUFG4FkA",
    authDomain: "anbok-collection.firebaseapp.com",
    databaseURL: "https://anbok-collection-default-rtdb.asia-southeast1.firebasedatabase.app",
    // ... other config
};
```

### 2. Lấy dữ liệu từ Firebase
```javascript
// Ví dụ lấy sách bán chạy
const booksRef = ref(database, 'Books');
const bestSellingQuery = query(booksRef, orderByChild('sales_count'), limitToFirst(6));

onValue(bestSellingQuery, (snapshot) => {
    const books = [];
    snapshot.forEach((childSnapshot) => {
        const book = childSnapshot.val();
        book.id = childSnapshot.key;
        books.push(book);
    });
    updateBestSellingBooksSection(books);
});
```

### 3. Xử lý nút
```javascript
// Ví dụ xử lý nút "Thêm vào giỏ"
function addToCart(bookId) {
    const user = getCurrentUser();
    if (!user) {
        showNotification('Vui lòng đăng nhập để thêm sách vào giỏ hàng', 'warning');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart') || '{}');
    if (cart[bookId]) {
        cart[bookId].quantity += 1;
    } else {
        cart[bookId] = { quantity: 1, added_at: new Date().toISOString() };
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge(Object.keys(cart).length);
    showNotification('Đã thêm sách vào giỏ hàng', 'success');
}
```

## Cấu trúc dữ liệu Firebase

### Books Node
```json
{
  "book_001": {
    "title": "Tên sách",
    "author_name": "Tên tác giả",
    "author_id": "author_001",
    "price": 600000,
    "discount_percentage": 10,
    "sales_count": 150,
    "published_date": "2024-01-15",
    "cover_image": "images/books/img-01.jpg",
    "genres": ["Tiểu thuyết", "Văn học"],
    "description": "Mô tả sách"
  }
}
```

### TrendingData Node
```json
{
  "trending_books": [
    {
      "title": "Sách trending",
      "cover_image": "images/books/img-01.jpg"
    }
  ],
  "favorite_books": [
    {
      "title": "Sách yêu thích",
      "cover_image": "images/books/img-06.jpg"
    }
  ]
}
```

### Comments Node
```json
{
  "comment_001": {
    "user_name": "Tên người dùng",
    "user_avatar": "images/users/img-01.jpg",
    "content": "Nội dung bình luận",
    "book_title": "Tên sách",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### News Node
```json
{
  "news_001": {
    "title": "Tiêu đề tin tức",
    "author": "Tác giả",
    "published_date": "2024-01-15",
    "image_url": "images/blog/img-01.jpg",
    "category": "Tin tức",
    "is_featured": true,
    "comment_count": 21,
    "view_count": 24565
  }
}
```

## Tính năng bổ sung

### 1. Notification System
- Hiển thị thông báo thành công/lỗi/cảnh báo
- Tự động ẩn sau 3 giây
- Hỗ trợ các loại: success, error, warning, info

### 2. Cart Management
- Lưu trữ trong localStorage
- Cập nhật realtime
- Tính toán tổng tiền và tiết kiệm

### 3. User Authentication
- Kiểm tra trạng thái đăng nhập
- Hiển thị thông tin người dùng
- Xử lý đăng xuất

### 4. Responsive Design
- Tương thích với mobile
- Adaptive layout cho các kích thước màn hình

## Lưu ý

1. **Firebase Rules**: Đảm bảo Firebase Realtime Database rules cho phép đọc dữ liệu
2. **Authentication**: Cần đăng nhập để sử dụng một số tính năng
3. **LocalStorage**: Dữ liệu giỏ hàng và wishlist được lưu trong localStorage
4. **Error Handling**: Có fallback cho trường hợp không kết nối được Firebase

## Troubleshooting

### Lỗi thường gặp
1. **Firebase không kết nối**: Kiểm tra config và internet connection
2. **Dữ liệu không hiển thị**: Kiểm tra cấu trúc dữ liệu trong Firebase
3. **Nút không hoạt động**: Kiểm tra console để xem lỗi JavaScript

### Debug
```javascript
// Bật debug mode
console.log('Firebase initialized:', app);
console.log('Auth initialized:', auth);
console.log('Database:', database);
``` 