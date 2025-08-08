// Author Detail Loader
// Xử lý việc tải và hiển thị dữ liệu tác giả chi tiết từ Firebase

class AuthorDetailLoader {
    constructor() {
        this.authorId = null;
        this.authorData = null;
        this.init();
    }

    async init() {
        try {
            // Lấy author ID từ localStorage
            this.authorId = localStorage.getItem('selectedAuthorId');
            
            if (!this.authorId) {
                this.showError('Không tìm thấy thông tin tác giả');
                return;
            }

            // Kiểm tra Firebase
            if (typeof firebase === 'undefined' || !firebase.database) {
                this.showError('Không thể kết nối đến cơ sở dữ liệu');
                return;
            }

            // Hiển thị loading
            this.showLoading();
            
            // Tải dữ liệu tác giả
            await this.loadAuthorData();
            
            // Ẩn loading và hiển thị dữ liệu
            this.hideLoading();
            this.displayAuthorDetails();
            
        } catch (error) {
            console.error('Error initializing author detail loader:', error);
            this.hideLoading();
            this.showError('Có lỗi xảy ra khi tải thông tin tác giả');
        }
    }

    async loadAuthorData() {
        const db = firebase.database();
        const authorRef = db.ref(`Authors/${this.authorId}`);
        
        const snapshot = await authorRef.once('value');
        this.authorData = snapshot.val();
        
        if (!this.authorData) {
            throw new Error(`Author not found: ${this.authorId}`);
        }
    }

    displayAuthorDetails() {
        if (!this.authorData) return;

        // Cập nhật hình ảnh tác giả
        this.updateAuthorImage();
        
        // Cập nhật thông tin cơ bản
        this.updateBasicInfo();
        
        // Cập nhật thống kê
        this.updateStats();
        
        // Cập nhật tiểu sử
        this.updateBiography();
        
        // Cập nhật các phần tiểu sử chi tiết
        this.updateBiographySections();
        
        // Cập nhật giải thưởng
        this.updateAwards();
        
        // Cập nhật tiêu đề trang
        this.updatePageTitle();
        
        // Thêm hiệu ứng animation
        this.addAnimations();
    }

    updateAuthorImage() {
        const authorImage = document.querySelector('.tg-author-image img');
        if (authorImage && this.authorData.photo_url) {
            authorImage.src = this.authorData.photo_url;
            authorImage.alt = this.authorData.name;
            
            // Thêm hiệu ứng fade in
            authorImage.style.opacity = '0';
            setTimeout(() => {
                authorImage.style.transition = 'opacity 0.5s ease';
                authorImage.style.opacity = '1';
            }, 100);
        }
    }

    updateBasicInfo() {
        // Cập nhật tên tác giả
        const authorName = document.querySelector('.tg-author-info h2');
        if (authorName) {
            authorName.textContent = this.authorData.name;
        }

        // Cập nhật mô tả
        const authorDesc = document.querySelector('.tg-author-info p');
        if (authorDesc) {
            const genres = this.authorData.genre ? this.authorData.genre.join(', ') : 'Tác giả';
            authorDesc.textContent = genres;
        }
    }

    updateStats() {
        const statNumbers = document.querySelectorAll('.tg-stat-number');
        if (statNumbers.length >= 2) {
            statNumbers[0].textContent = this.authorData.total_books || '0';
            statNumbers[1].textContent = this.formatNumber(this.authorData.total_views || 0);
        }
    }

    updateBiography() {
        const bioContent = document.querySelector('.tg-author-bio p');
        if (bioContent && this.authorData.bio) {
            bioContent.textContent = this.authorData.bio;
        }
    }

    updateBiographySections() {
        const bioSections = document.querySelectorAll('.tg-bio-section');
        
        if (bioSections.length >= 3) {
            // Tuổi thơ và giáo dục
            this.updateBiographySection(bioSections[0], 'early');
            
            // Sự nghiệp văn chương
            this.updateBiographySection(bioSections[1], 'career');
            
            // Giải thưởng và thành tựu
            this.updateBiographySection(bioSections[2], 'awards');
        }
    }

    updateBiographySection(section, type) {
        const content = section.querySelector('p');
        if (!content) return;

        let text = '';
        
        switch (type) {
            case 'early':
                const birthInfo = this.authorData.birth_date ? 
                    `sinh ngày ${this.formatDate(this.authorData.birth_date)}` : 
                    'sinh năm không rõ';
                const nationality = this.authorData.nationality || 'không rõ';
                text = `${this.authorData.name} ${birthInfo}, quốc tịch ${nationality}. `;
                if (this.authorData.bio) {
                    text += this.authorData.bio.split('.')[0] + '.';
                }
                break;
                
            case 'career':
                const notableWorks = this.authorData.notable_works ? 
                    this.authorData.notable_works.join(', ') : 
                    'nhiều tác phẩm';
                text = `${this.authorData.name} được biết đến với những tác phẩm nổi bật như: ${notableWorks}. `;
                if (this.authorData.bio && this.authorData.bio.split('.').length > 1) {
                    text += this.authorData.bio.split('.')[1] + '.';
                } else {
                    text += 'Tác giả có sự nghiệp văn chương phong phú và đa dạng.';
                }
                break;
                
            case 'awards':
                const awards = this.authorData.awards ? 
                    this.authorData.awards.join(', ') : 
                    'nhiều giải thưởng danh giá';
                text = `Trong sự nghiệp của mình, ${this.authorData.name} đã nhận được ${awards}. `;
                if (this.authorData.bio && this.authorData.bio.split('.').length > 2) {
                    text += this.authorData.bio.split('.')[2] + '.';
                } else {
                    text += 'Tác giả có những đóng góp quan trọng cho văn học.';
                }
                break;
        }
        
        content.innerHTML = text;
    }

    updateAwards() {
        const awardItems = document.querySelectorAll('.tg-award-item');
        
        if (awardItems.length >= 4 && this.authorData.awards) {
            this.authorData.awards.forEach((award, index) => {
                if (awardItems[index]) {
                    const awardTitle = awardItems[index].querySelector('h4');
                    const awardDesc = awardItems[index].querySelector('p');
                    
                    if (awardTitle) awardTitle.textContent = award;
                    if (awardDesc) awardDesc.textContent = 'Giải thưởng danh giá trong sự nghiệp văn chương';
                }
            });
        }
    }

    updatePageTitle() {
        document.title = `${this.authorData.name} - AnBok Collection`;
    }

    addAnimations() {
        // Thêm hiệu ứng fade in cho các phần tử
        const elements = document.querySelectorAll('.tg-author-profile > *');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    showLoading() {
        const mainContent = document.querySelector('.tg-author-profile');
        if (mainContent) {
            mainContent.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #4A6366; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                    <p style="color: #666;">Đang tải thông tin tác giả...</p>
                </div>
            `;
        }
    }

    hideLoading() {
        // Loading sẽ được thay thế bằng nội dung thực tế
    }

    showError(message) {
        const mainContent = document.querySelector('.tg-author-profile');
        if (mainContent) {
            mainContent.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <i class="fa fa-exclamation-triangle" style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;"></i>
                    <h3 style="color: #333; margin-bottom: 10px;">Có lỗi xảy ra</h3>
                    <p style="color: #666;">${message}</p>
                    <button onclick="window.history.back()" style="background: #4A6366; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px; cursor: pointer;">
                        Quay lại
                    </button>
                </div>
            `;
        }
    }

    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B+';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M+';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K+';
        }
        return num.toString();
    }

    formatDate(dateString) {
        if (!dateString) return 'không rõ';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            
            return date.toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }
}

// Khởi tạo loader khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    new AuthorDetailLoader();
});

// Export cho việc sử dụng trong các file khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthorDetailLoader;
} 