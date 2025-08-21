# Real-time Database Integration Guide

## Tổng quan

Hệ thống AnBok Collection đã được tích hợp Firebase Realtime Database để cung cấp khả năng lấy dữ liệu real-time từ các node **Books** và **Stories**. Điều này cho phép người dùng nhận được cập nhật dữ liệu ngay lập tức mà không cần refresh trang.

## Tính năng chính

### 1. Real-time Data Fetching
- **Books Node**: Lấy dữ liệu sách real-time
- **Stories Node**: Lấy dữ liệu truyện real-time
- **Automatic Updates**: Dữ liệu tự động cập nhật khi có thay đổi trong database

### 2. Smart Data Management
- **Caching**: Dữ liệu được cache để tối ưu hiệu suất
- **Fallback System**: Hệ thống dự phòng khi RealtimeDatabaseManager không khả dụng
- **Memory Management**: Tự động cleanup listeners để tránh memory leaks

### 3. Cross-Node Search
- **Multi-Node Search**: Tìm kiếm dữ liệu trên nhiều node cùng lúc
- **Flexible ID Matching**: Hỗ trợ nhiều loại ID field khác nhau
- **Priority-based Results**: Ưu tiên kết quả từ node phù hợp nhất

## Cấu trúc Files

```
js/
├── realtime-database.js      # Core RealtimeDatabaseManager
├── realtime-demo.js          # Demo và testing tools
└── ...

html/
├── read-book.html            # Trang đọc sách với real-time
├── read-story.html           # Trang đọc truyện với real-time
└── ...
```

## Cách sử dụng

### 1. Khởi tạo RealtimeDatabaseManager

```javascript
// Firebase đã được khởi tạo sẵn
if (window.realtimeDB) {
    window.realtimeDB.initialize({ ref, onValue, off, get }, database);
}
```

### 2. Thiết lập Real-time Listener

```javascript
// Đơn giản
const listener = window.realtimeDB.setupListener('Books', 'book-id', (book, snapshot) => {
    if (book) {
        console.log('Book updated:', book);
        updateUI(book);
    }
});

// Với options
const listener = window.realtimeDB.setupListener('Stories', 'story-id', callback, {
    autoCleanup: true,
    cacheData: true
});
```

### 3. Thiết lập Multiple Listeners

```javascript
const listeners = [
    {
        nodePath: 'Books',
        itemId: 'book-123',
        callback: (book, snapshot) => updateBookUI(book)
    },
    {
        nodePath: 'Stories',
        itemId: 'story-456',
        callback: (story, snapshot) => updateStoryUI(story)
    }
];

const results = window.realtimeDB.setupMultipleListeners(listeners);
```

### 4. Tìm kiếm dữ liệu

```javascript
// Tìm kiếm trên nhiều node
const result = await window.realtimeDB.searchAcrossNodes(
    ['Books', 'Stories'], 
    'item-id',
    (item, nodePath) => {
        console.log(`Found in ${nodePath}:`, item);
    }
);

// Lấy dữ liệu một lần
const book = await window.realtimeDB.fetchDataOnce('Books', 'book-id');
```

### 5. Quản lý Listeners

```javascript
// Xóa listener cụ thể
window.realtimeDB.removeListener('Books_book-123');

// Xóa tất cả listeners
window.realtimeDB.removeAllListeners();

// Lấy trạng thái
const status = window.realtimeDB.getStatus();
console.log('Active listeners:', status.activeListeners);
```

## API Reference

### RealtimeDatabaseManager

#### Methods

- `initialize(firebase, database)` - Khởi tạo manager
- `setupListener(nodePath, itemId, callback, options)` - Thiết lập listener
- `setupMultipleListeners(listeners)` - Thiết lập nhiều listeners
- `removeListener(listenerKey)` - Xóa listener cụ thể
- `removeAllListeners()` - Xóa tất cả listeners
- `getCachedData(nodePath, itemId)` - Lấy dữ liệu đã cache
- `fetchDataOnce(nodePath, itemId)` - Lấy dữ liệu một lần
- `searchAcrossNodes(nodePaths, itemId, callback)` - Tìm kiếm trên nhiều node
- `getStatus()` - Lấy trạng thái manager
- `destroy()` - Hủy manager

#### Options

```javascript
{
    autoCleanup: true,        // Tự động cleanup khi item bị xóa
    cacheData: true,          // Cache dữ liệu
    priority: 'high',         // Độ ưu tiên của listener
    retryCount: 3             // Số lần retry khi lỗi
}
```

## Error Handling

### 1. Permission Errors
```javascript
try {
    const listener = window.realtimeDB.setupListener('Books', 'id', callback);
} catch (error) {
    if (error.message.includes('PERMISSION_DENIED')) {
        console.warn('Permission denied, falling back to basic listener');
        setupBasicListener();
    }
}
```

### 2. Network Errors
```javascript
const listener = window.realtimeDB.setupListener('Books', 'id', (book, snapshot, error) => {
    if (error) {
        console.error('Network error:', error);
        // Fallback to cached data
        const cached = window.realtimeDB.getCachedData('Books', 'id');
        if (cached) updateUI(cached);
    } else if (book) {
        updateUI(book);
    }
});
```

## Performance Optimization

### 1. Caching Strategy
- Dữ liệu được cache theo listener key
- Tự động cleanup cache khi listener bị xóa
- Memory usage được theo dõi và quản lý

### 2. Listener Management
- Chỉ setup listeners khi cần thiết
- Tự động cleanup khi page unload
- Fallback system để tránh crash

### 3. Data Fetching
- Real-time updates cho dữ liệu quan trọng
- One-time fetch cho dữ liệu ít thay đổi
- Cross-node search được tối ưu

## Testing và Debugging

### 1. Demo Mode
```javascript
// Bật demo mode
window.realtimeDemo.start();

// Kiểm tra trạng thái
const status = window.realtimeDemo.getStatus();
console.log(status);

// Tắt demo mode
window.realtimeDemo.stop();
```

### 2. Console Logging
```javascript
// Bật debug mode
window.realtimeDB.debug = true;

// Kiểm tra listeners
console.log('Active listeners:', window.realtimeDB.getStatus());
```

### 3. Error Monitoring
```javascript
// Monitor errors
window.addEventListener('error', (event) => {
    if (event.error && event.error.message.includes('realtime')) {
        console.error('Realtime error:', event.error);
    }
});
```

## Best Practices

### 1. Listener Setup
- Setup listeners trong `DOMContentLoaded`
- Cleanup listeners trong `beforeunload`
- Sử dụng try-catch cho error handling

### 2. Data Management
- Cache dữ liệu quan trọng
- Implement fallback strategies
- Monitor memory usage

### 3. Error Handling
- Handle permission errors gracefully
- Implement retry mechanisms
- Log errors for debugging

### 4. Performance
- Limit số lượng active listeners
- Use appropriate update intervals
- Implement data pagination nếu cần

## Troubleshooting

### 1. Listeners không hoạt động
```javascript
// Kiểm tra initialization
console.log('RealtimeDB initialized:', window.realtimeDB.isInitialized);

// Kiểm tra Firebase connection
console.log('Firebase connected:', !!window.firebase);

// Kiểm tra listeners
const status = window.realtimeDB.getStatus();
console.log('Listener status:', status);
```

### 2. Memory Leaks
```javascript
// Kiểm tra active listeners
const status = window.realtimeDB.getStatus();
if (status.activeListeners > 10) {
    console.warn('Too many active listeners, consider cleanup');
}

// Force cleanup
window.realtimeDB.removeAllListeners();
```

### 3. Data Sync Issues
```javascript
// Force refresh data
const freshData = await window.realtimeDB.fetchDataOnce('Books', 'id');

// Clear cache
window.realtimeDB.cache.clear();
```

## Ví dụ thực tế

### 1. Trang đọc sách
```javascript
// Setup real-time listener cho sách
const bookListener = window.realtimeDB.setupListener('Books', bookId, (book, snapshot) => {
    if (book) {
        // Update UI với dữ liệu mới
        updateBookContent(book);
        updateReadingProgress(book);
        
        // Show notification
        showUpdateNotification('Sách đã được cập nhật');
    }
});
```

### 2. Trang đọc truyện
```javascript
// Setup listeners cho cả Books và Stories
const listeners = [
    {
        nodePath: 'Stories',
        itemId: storyId,
        callback: (story) => updateStoryContent(story)
    },
    {
        nodePath: 'Books',
        itemId: storyId,
        callback: (book) => updateBookContent(book)
    }
];

window.realtimeDB.setupMultipleListeners(listeners);
```

### 3. Search functionality
```javascript
// Tìm kiếm trên nhiều node
const result = await window.realtimeDB.searchAcrossNodes(
    ['Books', 'Stories', 'Users'],
    searchTerm,
    (item, nodePath) => {
        console.log(`Found in ${nodePath}:`, item);
        displaySearchResult(item, nodePath);
    }
);
```

## Kết luận

Hệ thống Real-time Database của AnBok Collection cung cấp một giải pháp mạnh mẽ và linh hoạt để quản lý dữ liệu real-time. Với RealtimeDatabaseManager, việc setup và quản lý listeners trở nên đơn giản và hiệu quả hơn bao giờ hết.

Để có thêm thông tin hoặc hỗ trợ, vui lòng tham khảo:
- Firebase Documentation: https://firebase.google.com/docs/database
- Console logs để debug
- Demo mode để test functionality 