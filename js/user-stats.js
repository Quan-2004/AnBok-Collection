/**
 * User Statistics Management
 * Quản lý thống kê người dùng cho hệ thống thư viện
 */

// User Statistics Manager
class UserStatsManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadUserStats();
        this.setupEventListeners();
    }

    // Get current user ID
    getCurrentUserId() {
        const userData = localStorage.getItem('userData') || localStorage.getItem('currentUser');
        if (userData) {
            const user = JSON.parse(userData);
            return user.uid || user.id;
        }
        return null;
    }

    // Load user statistics
    loadUserStats() {
        const userId = this.getCurrentUserId();
        if (!userId) return null;

        const statsKey = `userStats_${userId}`;
        const stats = localStorage.getItem(statsKey);
        
        if (stats) {
            return JSON.parse(stats);
        } else {
            // Create default stats
            const defaultStats = {
                booksRead: 0,
                reviews: 0,
                points: 0,
                readingTime: 0,
                favoriteGenres: [],
                readingGoal: 12, // books per year
                achievedGoals: 0,
                lastActivity: new Date().toISOString()
            };
            this.saveUserStats(defaultStats);
            return defaultStats;
        }
    }

    // Save user statistics
    saveUserStats(stats) {
        const userId = this.getCurrentUserId();
        if (!userId) return;

        const statsKey = `userStats_${userId}`;
        stats.lastActivity = new Date().toISOString();
        localStorage.setItem(statsKey, JSON.stringify(stats));

        // Also save to Firebase if available
        if (typeof firebase !== 'undefined' && firebase.database) {
            firebase.database().ref(`users/${userId}/statistics`).set(stats);
        }

        // Update display if on profile page
        this.updateStatsDisplay(stats);
    }

    // Update statistics display
    updateStatsDisplay(stats) {
        const statsContainer = document.querySelector('.tg-user-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: #4A6366;">${stats.booksRead}</div>
                    <div style="color: #666; font-size: 0.9rem;">Sách đã đọc</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: #F4A261;">${stats.reviews}</div>
                    <div style="color: #666; font-size: 0.9rem;">Đánh giá</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700; color: #28a745;">${stats.points.toLocaleString()}</div>
                    <div style="color: #666; font-size: 0.9rem;">Điểm thưởng</div>
                </div>
            `;
        }

        // Update reading progress if exists
        const progressContainer = document.querySelector('.reading-progress');
        if (progressContainer) {
            const progressPercent = Math.min((stats.booksRead / stats.readingGoal) * 100, 100);
            progressContainer.innerHTML = `
                <div class="progress-bar" style="background: linear-gradient(90deg, #4A6366 0%, #2ECC71 100%); width: ${progressPercent}%; height: 10px; border-radius: 5px; transition: width 0.3s ease;"></div>
                <div class="progress-text" style="margin-top: 10px; color: #666;">
                    ${stats.booksRead}/${stats.readingGoal} sách (${Math.round(progressPercent)}%)
                </div>
            `;
        }
    }

    // Increment books read
    incrementBooksRead(bookId = null, bookTitle = null) {
        const stats = this.loadUserStats();
        stats.booksRead += 1;
        stats.points += 10; // 10 points per book

        // Add to reading history
        const historyKey = `readingHistory_${this.getCurrentUserId()}`;
        let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
        
        if (bookId && bookTitle) {
            history.unshift({
                bookId: bookId,
                title: bookTitle,
                completedAt: new Date().toISOString(),
                points: 10
            });
            
            // Keep only last 50 entries
            if (history.length > 50) {
                history = history.slice(0, 50);
            }
            
            localStorage.setItem(historyKey, JSON.stringify(history));
        }

        this.saveUserStats(stats);
        this.showNotification(`Chúc mừng! Bạn đã hoàn thành 1 cuốn sách và nhận được 10 điểm thưởng!`, 'success');
        
        return stats;
    }

    // Increment reviews
    incrementReviews(rating = 5) {
        const stats = this.loadUserStats();
        stats.reviews += 1;
        stats.points += 5; // 5 points per review

        this.saveUserStats(stats);
        this.showNotification(`Cảm ơn bạn đã đánh giá! Bạn nhận được 5 điểm thưởng!`, 'success');
        
        return stats;
    }

    // Add reading time
    addReadingTime(minutes) {
        const stats = this.loadUserStats();
        stats.readingTime += minutes;
        
        // Bonus points for reading time
        if (minutes >= 30) {
            stats.points += 2;
        }

        this.saveUserStats(stats);
        return stats;
    }

    // Update reading goal
    updateReadingGoal(newGoal) {
        const stats = this.loadUserStats();
        stats.readingGoal = newGoal;
        this.saveUserStats(stats);
        
        this.showNotification(`Mục tiêu đọc sách đã được cập nhật: ${newGoal} cuốn/năm`, 'info');
        return stats;
    }

    // Add favorite genre
    addFavoriteGenre(genre) {
        const stats = this.loadUserStats();
        if (!stats.favoriteGenres.includes(genre)) {
            stats.favoriteGenres.push(genre);
            this.saveUserStats(stats);
        }
        return stats;
    }

    // Get reading statistics for display
    getReadingInsights() {
        const stats = this.loadUserStats();
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        
        return {
            totalBooks: stats.booksRead,
            totalReviews: stats.reviews,
            totalPoints: stats.points,
            readingGoalProgress: Math.min((stats.booksRead / stats.readingGoal) * 100, 100),
            averageBooksPerMonth: Math.round(stats.booksRead / Math.max(currentMonth + 1, 1)),
            totalReadingTime: this.formatReadingTime(stats.readingTime),
            favoriteGenres: stats.favoriteGenres.slice(0, 3),
            level: this.calculateUserLevel(stats.points)
        };
    }

    // Calculate user level based on points
    calculateUserLevel(points) {
        if (points >= 1000) return { level: 'Master', icon: 'fa-crown', color: '#FFD700' };
        if (points >= 500) return { level: 'Expert', icon: 'fa-star', color: '#FF6B6B' };
        if (points >= 200) return { level: 'Advanced', icon: 'fa-bookmark', color: '#4ECDC4' };
        if (points >= 50) return { level: 'Intermediate', icon: 'fa-book', color: '#45B7D1' };
        return { level: 'Beginner', icon: 'fa-seedling', color: '#96CEB4' };
    }

    // Format reading time
    formatReadingTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${remainingMinutes}m`;
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for book completion events
        document.addEventListener('bookCompleted', (event) => {
            const { bookId, title } = event.detail;
            this.incrementBooksRead(bookId, title);
        });

        // Listen for review submission events
        document.addEventListener('reviewSubmitted', (event) => {
            const { rating } = event.detail;
            this.incrementReviews(rating);
        });

        // Listen for reading time events
        document.addEventListener('readingTimeAdded', (event) => {
            const { minutes } = event.detail;
            this.addReadingTime(minutes);
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize User Stats Manager
const userStatsManager = new UserStatsManager();

// Export for global use
window.UserStatsManager = userStatsManager;

// Helper functions for easy access
window.markBookAsRead = function(bookId, title) {
    const event = new CustomEvent('bookCompleted', {
        detail: { bookId, title }
    });
    document.dispatchEvent(event);
};

window.submitReview = function(rating = 5) {
    const event = new CustomEvent('reviewSubmitted', {
        detail: { rating }
    });
    document.dispatchEvent(event);
};

window.addReadingTime = function(minutes) {
    const event = new CustomEvent('readingTimeAdded', {
        detail: { minutes }
    });
    document.dispatchEvent(event);
};
