// News Handler for Firebase Integration
class NewsHandler {
    constructor() {
        this.newsData = [];
        this.currentLanguage = 'vi'; // Default to Vietnamese
        this.init();
    }

    async init() {
        await this.loadNewsFromFirebase();
        this.setupEventListeners();
    }

    async loadNewsFromFirebase() {
        try {
            console.log('Starting to load news from Firebase...');
            
            // Check if Firebase is available
            if (typeof getDatabase === 'undefined' || typeof app === 'undefined') {
                console.error('Firebase not available');
                this.displayDefaultNews();
                return;
            }
            
            const db = getDatabase(app);
            console.log('Database instance:', db);
            
            const newsRef = ref(db, 'news');
            console.log('News reference:', newsRef);
            
            const snapshot = await get(newsRef);
            console.log('Snapshot:', snapshot);
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log('News data loaded from Firebase:', data);
                
                // Convert object to array and sort by publish date
                this.newsData = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).sort((a, b) => new Date(b.ngayDang) - new Date(a.ngayDang));
                
                console.log('Processed news data:', this.newsData);
                this.displayNews();
            } else {
                console.log('No news data found in Firebase');
                this.displayDefaultNews();
            }
        } catch (error) {
            console.error('Error loading news from Firebase:', error);
            console.error('Error details:', error.message);
            this.displayDefaultNews();
        }
    }

    displayNews() {
        const featuredNewsContainer = document.getElementById('featuredNewsContainer');
        const latestNewsContainer = document.getElementById('latestNewsContainer');
        
        if (!featuredNewsContainer || !latestNewsContainer) {
            console.error('News containers not found');
            return;
        }

        // Clear existing content
        featuredNewsContainer.innerHTML = '';
        latestNewsContainer.innerHTML = '';

        if (!this.newsData || this.newsData.length === 0) {
            console.log('No news data to display');
            this.displayDefaultNews();
            return;
        }

        // Display featured news (first 2 items)
        const featuredNews = this.newsData.slice(0, 2);
        featuredNews.forEach((news) => {
            const newsElement = this.createNewsElement(news, true);
            featuredNewsContainer.appendChild(newsElement);
        });

        // Display latest news (remaining items)
        const latestNews = this.newsData.slice(2);
        latestNews.forEach((news) => {
            const newsElement = this.createNewsElement(news, false);
            latestNewsContainer.appendChild(newsElement);
        });

        console.log(`Displayed ${featuredNews.length} featured news and ${latestNews.length} latest news`);
    }

    createNewsElement(news, isFeatured) {
        console.log('Creating news element for:', news);
        
        // Validate news data
        if (!news || !news.maTin) {
            console.error('Invalid news data:', news);
            return document.createElement('div');
        }
        
        const colClass = isFeatured ? 'col-xs-12 col-sm-12 col-md-6 col-lg-6' : 'col-xs-12 col-sm-6 col-md-4 col-lg-4';
        const imageHeight = isFeatured ? '250px' : '200px';
        const titleSize = isFeatured ? '1.4rem' : '1.1rem';
        const padding = isFeatured ? '25px' : '20px';

        const newsDiv = document.createElement('div');
        newsDiv.className = colClass;
        newsDiv.style.marginBottom = '30px';

        // Safe date parsing
        let formattedDate = 'Ngày không xác định';
        try {
            const publishDate = new Date(news.ngayDang);
            if (!isNaN(publishDate.getTime())) {
                formattedDate = publishDate.toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }
        } catch (error) {
            console.error('Error parsing date:', error);
        }

        // Safe text extraction with fallbacks
        const title = (this.currentLanguage === 'en' ? news.tieuDe_en : news.tieuDe) || news.tieuDe || 'Tiêu đề không có';
        const summary = (this.currentLanguage === 'en' ? news.tomTat_en : news.tomTat) || news.tomTat || 'Tóm tắt không có';
        const author = (this.currentLanguage === 'en' ? news.tacGia_en : news.tacGia) || news.tacGia || 'Tác giả không xác định';
        const imageUrl = news.hinhAnh || 'images/blog/img-01.jpg';
        const viewCount = news.luotXem || 0;

        newsDiv.innerHTML = `
            <div style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: all 0.3s ease; height: 100%;">
                <div style="position: relative; overflow: hidden;">
                    <img src="${imageUrl}" alt="${title}" style="width: 100%; height: ${imageHeight}; object-fit: cover; transition: transform 0.3s ease;" onerror="this.src='images/blog/img-01.jpg'">
                    <div style="position: absolute; top: 15px; left: 15px; background: #F4A261; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                        ${news.trangThai === 'active' ? 'Tin Mới' : 'Tin Cũ'}
                    </div>
                </div>
                <div style="padding: ${padding};">
                    <div style="display: flex; align-items: center; margin-bottom: 15px; color: #666; font-size: 14px;">
                        <i class="fa fa-calendar" style="margin-right: 8px; color: #F4A261;"></i>
                        <span>${formattedDate}</span>
                        <i class="fa fa-user" style="margin-left: 20px; margin-right: 8px; color: #F4A261;"></i>
                        <span>${author}</span>
                        <i class="fa fa-eye" style="margin-left: 20px; margin-right: 8px; color: #F4A261;"></i>
                        <span>${viewCount}</span>
                    </div>
                    <h3 style="font-size: ${titleSize}; font-weight: 600; color: #333; margin-bottom: 15px; line-height: 1.4;">
                        <a href="javascript:void(0);" onclick="newsHandler.showNewsDetail('${news.maTin}')" style="color: #333; text-decoration: none; transition: color 0.3s ease;">
                            ${title}
                        </a>
                    </h3>
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                        ${summary}
                    </p>
                    <a href="javascript:void(0);" onclick="newsHandler.showNewsDetail('${news.maTin}')" style="color: #F4A261; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; transition: all 0.3s ease;">
                        Đọc thêm
                        <i class="fa fa-arrow-right" style="margin-left: 8px; transition: transform 0.3s ease;"></i>
                    </a>
                </div>
            </div>
        `;

        return newsDiv;
    }

    async showNewsDetail(newsId) {
        const news = this.newsData.find(n => n.maTin === newsId);
        if (!news) return;

        // Update view count
        await this.updateNewsViewCount(newsId);

        // Populate modal
        const title = this.currentLanguage === 'en' ? news.tieuDe_en : news.tieuDe;
        const summary = this.currentLanguage === 'en' ? news.tomTat_en : news.tomTat;
        const content = this.currentLanguage === 'en' ? news.noiDung_en : news.noiDung;
        const author = this.currentLanguage === 'en' ? news.tacGia_en : news.tacGia;
        const imageDesc = this.currentLanguage === 'en' ? news.moTaAnh_en : news.moTaAnh;

        document.getElementById('newsDetailTitle').textContent = title;
        document.getElementById('newsDetailImage').src = news.hinhAnh;
        document.getElementById('newsDetailImage').alt = imageDesc;
        document.getElementById('newsDetailSummary').innerHTML = `<p class="lead">${summary}</p>`;
        document.getElementById('newsDetailContent').innerHTML = `<p>${content}</p>`;
        document.getElementById('newsDetailAuthor').textContent = author;
        document.getElementById('newsDetailViews').textContent = news.luotXem;

        const publishDate = new Date(news.ngayDang);
        document.getElementById('newsDetailDate').textContent = publishDate.toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Show modal
        $('#newsDetailModal').modal('show');
    }

    async updateNewsViewCount(newsId) {
        try {
            const db = getDatabase(app);
            const newsRef = ref(db, `news/news_${newsId.slice(-3)}`);
            
            const snapshot = await get(child(newsRef, 'luotXem'));
            const currentViews = snapshot.val() || 0;
            
            await update(newsRef, {
                luotXem: currentViews + 1
            });
            
            // Update local data
            const news = this.newsData.find(n => n.maTin === newsId);
            if (news) {
                news.luotXem += 1;
            }
        } catch (error) {
            console.error('Error updating view count:', error);
        }
    }

    shareNews() {
        const title = document.getElementById('newsDetailTitle').textContent;
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(url).then(() => {
                alert('Đã sao chép link vào clipboard!');
            });
        }
    }

    displayDefaultNews() {
        console.log('Displaying default news content');
        
        // Add loading message or default content
        const featuredNewsContainer = document.getElementById('featuredNewsContainer');
        const latestNewsContainer = document.getElementById('latestNewsContainer');
        
        if (featuredNewsContainer) {
            featuredNewsContainer.innerHTML = `
                <div class="col-xs-12">
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <i class="fa fa-newspaper-o" style="font-size: 3rem; color: #F4A261; margin-bottom: 20px;"></i>
                        <h3>Không có tin tức mới</h3>
                        <p>Vui lòng quay lại sau hoặc kiểm tra kết nối mạng.</p>
                    </div>
                </div>
            `;
        }
        
        if (latestNewsContainer) {
            latestNewsContainer.innerHTML = `
                <div class="col-xs-12">
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <p>Đang tải tin tức...</p>
                    </div>
                </div>
            `;
        }
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'vi' ? 'en' : 'vi';
        const languageText = document.getElementById('languageText');
        if (languageText) {
            languageText.textContent = this.currentLanguage === 'vi' ? 'Tiếng Việt' : 'English';
        }
        this.displayNews();
    }

    setupEventListeners() {
        // Make functions globally available
        window.newsHandler = this;
        window.showNewsDetail = (newsId) => this.showNewsDetail(newsId);
        window.shareNews = () => this.shareNews();
        window.toggleLanguage = () => this.toggleLanguage();
    }
}

// Initialize News Handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Firebase to be ready
    if (typeof getDatabase !== 'undefined' && typeof app !== 'undefined') {
        new NewsHandler();
    } else {
        // Listen for Firebase ready event
        document.addEventListener('firebase-ready', function() {
            console.log('Firebase ready event received, initializing News Handler');
            new NewsHandler();
        });
        
        // Fallback: check again after a delay
        setTimeout(() => {
            if (typeof getDatabase !== 'undefined' && typeof app !== 'undefined') {
                console.log('Firebase available after delay, initializing News Handler');
                new NewsHandler();
            } else {
                console.log('Firebase not available, using default news content');
            }
        }, 2000);
    }
}); 