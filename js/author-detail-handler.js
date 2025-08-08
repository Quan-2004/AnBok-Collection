// Author Detail Handler
// Xử lý chức năng chuyển từ trang author-bio.html sang author-detail.html

class AuthorDetailHandler {
    constructor() {
        this.init();
    }

    init() {
        // Thêm event listener cho các nút "Chi tiết"
        this.addAuthorDetailListeners();
        
        // Thêm hiệu ứng hover cho author cards
        this.addAuthorCardEffects();
    }

    addAuthorDetailListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('author-detail-btn') || e.target.closest('.author-detail-btn')) {
                const button = e.target.classList.contains('author-detail-btn') ? e.target : e.target.closest('.author-detail-btn');
                const authorId = button.getAttribute('data-author-id');
                
                if (authorId) {
                    this.navigateToAuthorDetail(authorId);
                }
            }
        });
    }

    addAuthorCardEffects() {
        // Thêm hiệu ứng hover cho author cards
        const authorCards = document.querySelectorAll('.tg-author-card');
        authorCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            });
        });
    }

    navigateToAuthorDetail(authorId) {
        try {
            // Lưu author ID vào localStorage
            localStorage.setItem('selectedAuthorId', authorId);
            
            // Hiển thị loading indicator
            this.showLoadingIndicator();
            
            // Chuyển trang sau một chút delay để hiển thị loading
            setTimeout(() => {
                window.location.href = 'author-detail.html';
            }, 300);
            
        } catch (error) {
            console.error('Error navigating to author detail:', error);
            // Fallback: chuyển trang ngay lập tức
            localStorage.setItem('selectedAuthorId', authorId);
            window.location.href = 'author-detail.html';
        }
    }

    showLoadingIndicator() {
        // Tạo loading overlay
        const overlay = document.createElement('div');
        overlay.id = 'author-loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #4A6366;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;

        const text = document.createElement('p');
        text.textContent = 'Đang chuyển đến trang chi tiết tác giả...';
        text.style.cssText = `
            margin-top: 20px;
            color: #4A6366;
            font-weight: 600;
            text-align: center;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
        `;

        container.appendChild(spinner);
        container.appendChild(text);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
    }
}

// Khởi tạo handler khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    new AuthorDetailHandler();
});

// Export cho việc sử dụng trong các file khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthorDetailHandler;
} 