// Updated Reading Logic for Profile Dashboard
// Logic mới: Dựa trên tiến độ đọc thay vì flag isCurrentlyReading

// 1. SÁCH VÀ TRUYỆN ĐANG ĐỌC (Tiến độ < 100%)
async function loadReadingContent() {
    const readingGrid = $('#reading-grid');
    const readingEmpty = $('#reading-empty');
    
    // Show loading
    readingGrid.html('<div class="tg-content-loading"><i class="fa fa-spinner fa-spin"></i><p>Đang tải sách và truyện đang đọc...</p></div>');
    readingEmpty.hide();
    
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.uid) {
            readingGrid.html('<div class="tg-content-empty"><i class="fa fa-user"></i><h3>Vui lòng đăng nhập</h3><p>Để xem sách và truyện đang đọc của bạn</p></div>');
            return;
        }
        
        // Load from Firebase
        const database = window.firebaseDatabase;
        const { ref, get } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");
        
        // Load both book and story reading history
        const bookHistoryRef = ref(database, `users/${user.uid}/bookReadingHistory`);
        const storyHistoryRef = ref(database, `users/${user.uid}/storyReadingHistory`);
        
        const [bookSnapshot, storySnapshot] = await Promise.all([
            get(bookHistoryRef),
            get(storyHistoryRef)
        ]);
        
        const readingItems = [];
        
        // Process book reading history - chỉ lấy những cuốn có tiến độ < 100% (đang đọc)
        if (bookSnapshot.exists()) {
            const bookData = bookSnapshot.val();
            Object.values(bookData).forEach(book => {
                // Kiểm tra tiến độ đọc < 100% (đang đọc)
                if (book.readingProgress && book.readingProgress < 100) {
                    readingItems.push({
                        id: book.bookId,
                        title: book.bookTitle,
                        author: book.bookAuthor,
                        coverImage: book.bookCover,
                        type: 'book',
                        progress: book.readingProgress,
                        readingTime: book.readingTime,
                        lastReadTime: book.lastReadTime,
                        startTime: book.startTime,
                        totalWords: book.totalWords
                    });
                }
            });
        }
        
        // Process story reading history - chỉ lấy những truyện có tiến độ < 100% (đang đọc)
        if (storySnapshot.exists()) {
            const storyData = storySnapshot.val();
            Object.values(storyData).forEach(story => {
                // Kiểm tra tiến độ đọc < 100% (đang đọc)
                if (story.readingProgress && story.readingProgress < 100) {
                    readingItems.push({
                        id: story.storyId,
                        title: story.storyTitle,
                        author: story.storyAuthor,
                        coverImage: story.storyCover,
                        type: 'story',
                        progress: story.readingProgress,
                        readingTime: story.readingTime,
                        lastReadTime: story.lastReadTime,
                        startTime: story.startTime,
                        totalWords: story.totalWords
                    });
                }
            });
        }
        
        // Sort by last read time (newest first)
        readingItems.sort((a, b) => b.lastReadTime - a.lastReadTime);
        
        console.log('Loaded reading items from Firebase:', readingItems);
        
        if (readingItems.length > 0) {
            displayReadingGrid(readingGrid, readingItems);
            readingEmpty.hide();
        } else {
            readingGrid.html('<div class="tg-content-empty"><i class="fa fa-book-open"></i><h3>Chưa có sách/truyện đang đọc</h3><p>Bạn chưa bắt đầu đọc sách/truyện nào</p></div>');
        }
        
    } catch (error) {
        console.error('Error loading reading content from Firebase:', error);
        readingGrid.html('<div class="tg-content-empty"><i class="fa fa-exclamation-triangle"></i><h3>Lỗi tải dữ liệu</h3><p>Vui lòng thử lại sau</p></div>');
    }
}

// 2. SÁCH VÀ TRUYỆN ĐÃ ĐỌC (Tiến độ = 100%)
async function loadReadContent() {
    const readGrid = $('#read-grid');
    const readEmpty = $('#read-empty');
    
    // Show loading
    readGrid.html('<div class="tg-content-loading"><i class="fa fa-spinner fa-spin"></i><p>Đang tải sách và truyện đã đọc...</p></div>');
    readEmpty.hide();
    
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.uid) {
            readGrid.html('<div class="tg-content-empty"><i class="fa fa-user"></i><h3>Vui lòng đăng nhập</h3><p>Để xem sách và truyện đã đọc của bạn</p></div>');
            return;
        }
        
        // Load from Firebase
        const database = window.firebaseDatabase;
        const { ref, get } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");
        
        // Load both book and story reading history
        const bookHistoryRef = ref(database, `users/${user.uid}/bookReadingHistory`);
        const storyHistoryRef = ref(database, `users/${user.uid}/storyReadingHistory`);
        
        const [bookSnapshot, storySnapshot] = await Promise.all([
            get(bookHistoryRef),
            get(storyHistoryRef)
        ]);
        
        const readItems = [];
        
        // Process book reading history - chỉ lấy những cuốn có tiến độ = 100% (đã đọc xong)
        if (bookSnapshot.exists()) {
            const bookData = bookSnapshot.val();
            Object.values(bookData).forEach(book => {
                // Kiểm tra tiến độ đọc = 100% (đã hoàn thành)
                if (book.readingProgress && book.readingProgress === 100) {
                    readItems.push({
                        id: book.bookId,
                        title: book.bookTitle,
                        author: book.bookAuthor,
                        coverImage: book.bookCover,
                        type: 'book',
                        progress: book.readingProgress,
                        readingTime: book.readingTime,
                        lastReadTime: book.lastReadTime,
                        startTime: book.startTime,
                        totalWords: book.totalWords
                    });
                }
            });
        }
        
        // Process story reading history - chỉ lấy những truyện có tiến độ = 100% (đã đọc xong)
        if (storySnapshot.exists()) {
            const storyData = storySnapshot.val();
            Object.values(storyData).forEach(story => {
                // Kiểm tra tiến độ đọc = 100% (đã hoàn thành)
                if (story.readingProgress && story.readingProgress === 100) {
                    readItems.push({
                        id: story.storyId,
                        title: story.storyTitle,
                        author: story.storyAuthor,
                        coverImage: story.storyCover,
                        type: 'story',
                        progress: story.readingProgress,
                        readingTime: story.readingTime,
                        lastReadTime: story.lastReadTime,
                        startTime: story.startTime,
                        totalWords: story.totalWords
                    });
                }
            });
        }
        
        // Sort by last read time (newest first)
        readItems.sort((a, b) => b.lastReadTime - a.lastReadTime);
        
        console.log('Loaded read items from Firebase:', readItems);
        
        if (readItems.length > 0) {
            displayReadGrid(readGrid, readItems);
            readEmpty.hide();
        } else {
            readGrid.html('<div class="tg-content-empty"><i class="fa fa-check-circle"></i><h3>Chưa có sách/truyện đã đọc</h3><p>Bạn chưa hoàn thành đọc sách/truyện nào</p></div>');
        }
        
    } catch (error) {
        console.error('Error loading read content from Firebase:', error);
        readGrid.html('<div class="tg-content-empty"><i class="fa fa-exclamation-triangle"></i><h3>Lỗi tải dữ liệu</h3><p>Vui lòng thử lại sau</p></div>');
    }
}

// 3. HIỂN THỊ SÁCH ĐANG ĐỌC
function displayReadingGrid(gridElement, readingItems) {
    gridElement.empty();
    
    readingItems.forEach(item => {
        const badgeText = item.type === 'book' ? '📚 Sách' : '📖 Truyện';
        const lastReadDate = new Date(item.lastReadTime).toLocaleDateString('vi-VN');
        const readingTime = Math.round(item.readingTime / 60); // Chuyển sang phút
        
        const itemHtml = `
            <div class="tg-content-item" data-id="${item.id}">
                <div class="tg-content-item-image">
                    <img src="${item.coverImage || 'images/books/default-book.jpg'}" alt="${item.title}" onerror="this.src='images/books/default-book.jpg'">
                    <div class="tg-content-item-badge">${badgeText}</div>
                    <div class="tg-content-item-progress" style="position: absolute; bottom: 10px; left: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; text-align: center;">
                        ${item.progress}% hoàn thành
                    </div>
                </div>
                <div class="tg-content-item-content">
                    <div class="tg-content-item-title">${item.title}</div>
                    <div class="tg-content-item-author">${item.author}</div>
                    <div class="tg-content-item-progress-info">
                        <i class="fa fa-clock"></i>
                        <span>Thời gian đọc: ${readingTime} phút</span>
                    </div>
                    <div class="tg-content-item-date">
                        <i class="fa fa-calendar"></i>
                        <span>Đọc lần cuối: ${lastReadDate}</span>
                    </div>
                    <div class="tg-content-item-actions">
                        <button class="tg-content-item-btn primary" onclick="readContent('${item.id}', '${item.type}')">
                            <i class="fa fa-play"></i> Tiếp tục đọc
                        </button>
                    </div>
                </div>
            </div>
        `;
        gridElement.append(itemHtml);
    });
}

// 4. HIỂN THỊ SÁCH ĐÃ ĐỌC
function displayReadGrid(gridElement, readItems) {
    gridElement.empty();
    
    readItems.forEach(item => {
        const badgeText = item.type === 'book' ? '📚 Sách' : '📖 Truyện';
        const lastReadDate = new Date(item.lastReadTime).toLocaleDateString('vi-VN');
        const readingTime = Math.round(item.readingTime / 60); // Chuyển sang phút
        
        const itemHtml = `
            <div class="tg-content-item" data-id="${item.id}">
                <div class="tg-content-item-image">
                    <img src="${item.coverImage || 'images/books/default-book.jpg'}" alt="${item.title}" onerror="this.src='images/books/default-book.jpg'">
                    <div class="tg-content-item-badge">${badgeText}</div>
                    <div class="tg-content-item-completed" style="position: absolute; bottom: 10px; left: 10px; right: 10px; background: #28a745; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; text-align: center;">
                        ✅ Hoàn thành
                    </div>
                </div>
                <div class="tg-content-item-content">
                    <div class="tg-content-item-title">${item.title}</div>
                    <div class="tg-content-item-author">${item.author}</div>
                    <div class="tg-content-item-progress-info">
                        <i class="fa fa-clock"></i>
                        <span>Thời gian đọc: ${readingTime} phút</span>
                    </div>
                    <div class="tg-content-item-date">
                        <i class="fa fa-calendar"></i>
                        <span>Hoàn thành: ${lastReadDate}</span>
                    </div>
                    <div class="tg-content-item-actions">
                        <button class="tg-content-item-btn primary" onclick="readContent('${item.id}', '${item.type}')">
                            <i class="fa fa-book"></i> Đọc lại
                        </button>
                    </div>
                </div>
            </div>
        `;
        gridElement.append(itemHtml);
    });
}

// 5. CẬP NHẬT TRẠNG THÁI KHI ĐỌC
// Trong read-book.html và read-story.html, khi user scroll và tiến độ đạt 100%
async function updateReadingProgress(progress) {
    try {
        const user = window.firebase.auth().currentUser;
        if (!user || !isReading) return;

        const bookId = getBookIdFromUrl();
        if (!bookId) return;

        const readingHistoryRef = window.firebaseRef(window.firebase.database(), `users/${user.uid}/bookReadingHistory/${bookId}`);
        
        await window.firebaseUpdate(readingHistoryRef, {
            readingProgress: progress,
            lastReadTime: Date.now(),
            readingTime: Math.floor((Date.now() - startTime) / 1000)
        });

        // Nếu tiến độ đạt 100%, tự động chuyển sang trạng thái đã đọc
        if (progress >= 100) {
            await window.firebaseUpdate(readingHistoryRef, {
                isCurrentlyReading: false  // Có thể giữ lại flag này để tương thích
            });
            
            // Hiển thị thông báo hoàn thành
            Swal.fire({
                title: 'Chúc mừng! 🎉',
                text: 'Bạn đã hoàn thành đọc sách này!',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        }
    } catch (error) {
        console.error('Error updating reading progress:', error);
    }
}

// 6. SO SÁNH LOGIC CŨ VÀ MỚI

/*
LOGIC CŨ (dựa trên flag isCurrentlyReading):
- Đang đọc: isCurrentlyReading = true
- Đã đọc: isCurrentlyReading = false

LOGIC MỚI (dựa trên tiến độ đọc):
- Đang đọc: readingProgress < 100%
- Đã đọc: readingProgress = 100%

ƯU ĐIỂM CỦA LOGIC MỚI:
1. Chính xác hơn: Dựa trên tiến độ thực tế thay vì flag
2. Tự động: Khi tiến độ đạt 100% thì tự động chuyển sang đã đọc
3. Linh hoạt: Có thể hiển thị tiến độ chính xác (45%, 67%, etc.)
4. Nhất quán: Không cần quản lý flag isCurrentlyReading
*/

// 7. VÍ DỤ DỮ LIỆU FIREBASE

/*
Cấu trúc dữ liệu trong Firebase:
{
  "users": {
    "user123": {
      "bookReadingHistory": {
        "book456": {
          "bookId": "book456",
          "bookTitle": "Đắc Nhân Tâm",
          "bookAuthor": "Dale Carnegie",
          "bookCover": "https://...",
          "readingProgress": 45,        // ← Đang đọc (45% < 100%)
          "readingTime": 180,
          "lastReadTime": 1703123567890,
          "startTime": 1703123456789,
          "totalWords": 50000
        },
        "book789": {
          "bookId": "book789",
          "bookTitle": "Nhà Giả Kim",
          "bookAuthor": "Paulo Coelho",
          "bookCover": "https://...",
          "readingProgress": 100,       // ← Đã đọc xong (100%)
          "readingTime": 240,
          "lastReadTime": 1703123567890,
          "startTime": 1703123456789,
          "totalWords": 30000
        }
      }
    }
  }
}
*/ 