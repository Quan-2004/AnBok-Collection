// Index Page Button Handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('Index page button handler loaded');
    
    // Setup all button event listeners
    setupAllButtons();
    
    // Setup search functionality
    setupSearch();
    
    // Setup cart functionality
    setupCart();
    
    // Setup user profile functionality
    setupUserProfile();
});

// Setup all buttons
function setupAllButtons() {
    // Navigation buttons
    setupNavigationButtons();
    
    // Action buttons
    setupActionButtons();
    
    // Book interaction buttons
    setupBookButtons();
    
    // Trending section buttons
    setupTrendingButtons();
}

// Setup navigation buttons
function setupNavigationButtons() {
    // Home button
    const homeButtons = document.querySelectorAll('a[href="index.html"]');
    homeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    });
    
    // Books button
    const booksButtons = document.querySelectorAll('a[href="book.html"]');
    booksButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'book.html';
        });
    });
    
    // Stories button
    const storiesButtons = document.querySelectorAll('a[href="story.html"]');
    storiesButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'story.html';
        });
    });
    
    // Authors button
    const authorsButtons = document.querySelectorAll('a[href="author-bio.html"]');
    authorsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'author-bio.html';
        });
    });
    
    // News button
    const newsButtons = document.querySelectorAll('a[href="news.html"]');
    newsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'news.html';
        });
    });
    
    // About button
    const aboutButtons = document.querySelectorAll('a[href="about.html"]');
    aboutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'about.html';
        });
    });
    
    // Contact button
    const contactButtons = document.querySelectorAll('a[href="contact.html"]');
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'contact.html';
        });
    });
}

// Setup action buttons
function setupActionButtons() {
    // "Xem tất cả" buttons
    const viewAllButtons = document.querySelectorAll('a.tg-btn');
    viewAllButtons.forEach(button => {
        if (button.textContent.includes('Xem tất cả')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Determine which section this button belongs to
                const section = button.closest('section');
                if (section) {
                    if (section.querySelector('.tg-bestsellingbooksslider')) {
                        window.location.href = 'book.html?category=bestselling';
                    } else if (section.querySelector('.tg-newreleasebooks')) {
                        window.location.href = 'book.html?category=new';
                    } else if (section.querySelector('#tg-postslider')) {
                        window.location.href = 'news.html';
                    }
                }
            });
        }
    });
    
    // "Đọc thêm" buttons
    const readMoreButtons = document.querySelectorAll('a.tg-btn');
    readMoreButtons.forEach(button => {
        if (button.textContent.includes('Đọc thêm')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'book.html';
            });
        }
    });
    
    // "Tìm hiểu thêm" button in banner
    const learnMoreButton = document.querySelector('.tg-bannerbtns .tg-btn');
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'about.html';
        });
    }
    
    // Membership package click
    const membershipPackage = document.querySelector('.tg-membership-package');
    if (membershipPackage) {
        membershipPackage.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'menbership.html';
        });
    }
}

// Setup book buttons
function setupBookButtons() {
    // Add to wishlist buttons
    const wishlistButtons = document.querySelectorAll('.tg-btnaddtowishlist');
    wishlistButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const bookId = `book_${String(index + 1).padStart(3, '0')}`;
            addToWishlist(bookId);
        });
    });
    
    // Add to cart buttons
    const cartButtons = document.querySelectorAll('.tg-btn.tg-btnstyletwo');
    cartButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const bookId = `book_${String(index + 1).padStart(3, '0')}`;
            addToCart(bookId);
        });
    });
    
    // Book title links
    const bookTitleLinks = document.querySelectorAll('.tg-booktitle h3 a');
    bookTitleLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const bookId = `book_${String(index + 1).padStart(3, '0')}`;
            window.location.href = `book-detail.html?id=${bookId}`;
        });
    });
    
    // Author links
    const authorLinks = document.querySelectorAll('.tg-bookwriter a');
    authorLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const authorId = `author_${String(index + 1).padStart(3, '0')}`;
            window.location.href = `author-detail.html?id=${authorId}`;
        });
    });
    
    // Category links
    const categoryLinks = document.querySelectorAll('.tg-bookscategories a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const category = this.textContent.trim();
            window.location.href = `book.html?category=${encodeURIComponent(category)}`;
        });
    });
}

// Setup trending buttons
function setupTrendingButtons() {
    // Trending "Xem thêm" buttons
    const trendingLinks = document.querySelectorAll('.trending-footer a');
    trendingLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const categories = ['trending', 'favorite', 'comments'];
            const category = categories[index] || 'trending';
            window.location.href = `book.html?category=${category}`;
        });
    });
    
    // Trending items
    const trendingItems = document.querySelectorAll('.trending-item');
    trendingItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const bookId = `trending_book_${String(index + 1).padStart(3, '0')}`;
            window.location.href = `book-detail.html?id=${bookId}`;
        });
    });
    
    // Comment items
    const commentItems = document.querySelectorAll('.comment-card');
    commentItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const bookId = `comment_book_${String(index + 1).padStart(3, '0')}`;
            window.location.href = `book-detail.html?id=${bookId}`;
        });
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.querySelector('.tg-search-box input');
    const searchButton = document.querySelector('.tg-search-box button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }
}

// Perform search
function performSearch(query) {
    if (query && query.trim()) {
        const searchTerm = query.trim();
        window.location.href = `book.html?search=${encodeURIComponent(searchTerm)}`;
    } else {
        showNotification('Vui lòng nhập từ khóa tìm kiếm', 'warning');
    }
}

// Setup cart functionality
function setupCart() {
    // Cart toggle
    const cartToggle = document.querySelector('.tg-cart-link');
    if (cartToggle) {
        cartToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCartModal();
        });
    }
    
    // Cart modal close
    const cartModalClose = document.querySelector('.tg-cart-modal-close');
    if (cartModalClose) {
        cartModalClose.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCartModal();
        });
    }
    
    // Checkout button
    const checkoutButton = document.querySelector('.tg-cart-actions .tg-btn-primary');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'checkout.html';
        });
    }
    
    // Clear cart button
    const clearCartButton = document.querySelector('.tg-cart-actions .tg-btn-secondary');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', function(e) {
            e.preventDefault();
            clearCart();
        });
    }
}

// Setup user profile functionality
function setupUserProfile() {
    // User dropdown toggle
    const userInfo = document.querySelector('.tg-user-info');
    if (userInfo) {
        userInfo.addEventListener('click', function(e) {
            e.preventDefault();
            toggleUserDropdown();
        });
    }
    
    // Profile links
    const profileLinks = document.querySelectorAll('.tg-dropdown-item');
    profileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== 'javascript:void(0);') {
                window.location.href = href;
            }
        });
    });
    
    // Logout button
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Auth buttons for guest users
    const authButtons = document.querySelectorAll('.tg-auth-buttons a');
    authButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'auth.html';
        });
    });
}

// Cart functions
function addToCart(bookId) {
    // Check if user is logged in
    const user = getCurrentUser();
    if (!user) {
        showNotification('Vui lòng đăng nhập để thêm sách vào giỏ hàng', 'warning');
        return;
    }
    
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '{}');
    
    // Add or update book in cart
    if (cart[bookId]) {
        cart[bookId].quantity += 1;
    } else {
        cart[bookId] = {
            quantity: 1,
            added_at: new Date().toISOString()
        };
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart badge
    updateCartBadge(Object.keys(cart).length);
    
    showNotification('Đã thêm sách vào giỏ hàng', 'success');
}

function updateCartBadge(count) {
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'flex' : 'none';
    }
}

function toggleCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.toggle('active');
        
        if (modal.classList.contains('active')) {
            loadCartItems();
        }
    }
}

function loadCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    
    if (Object.keys(cart).length === 0) {
        container.innerHTML = `
            <div class="tg-cart-empty">
                <i class="fa fa-shopping-cart"></i>
                <h4>Giỏ hàng trống</h4>
                <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                <a href="book.html" class="tg-btn tg-btn-primary">Mua sắm ngay</a>
            </div>
        `;
        return;
    }
    
    // For now, show a simple cart with book IDs
    let totalPrice = 0;
    container.innerHTML = '';
    
    Object.entries(cart).forEach(([bookId, item]) => {
        const itemPrice = 600000; // Default price
        const itemTotal = itemPrice * item.quantity;
        totalPrice += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'tg-cart-item';
        itemElement.innerHTML = `
            <div class="tg-cart-item-image">
                <img src="images/books/img-01.jpg" alt="Book">
            </div>
            <div class="tg-cart-item-details">
                <h4>Sách ${bookId}</h4>
                <p class="tg-cart-item-author">Tác giả</p>
                <div class="tg-cart-item-price">
                    <span class="tg-cart-item-current">${formatPrice(itemPrice)}</span>
                </div>
            </div>
            <div class="tg-cart-item-actions">
                <div class="tg-cart-item-quantity">
                    <button class="tg-quantity-btn" onclick="updateCartQuantity('${bookId}', ${item.quantity - 1})">-</button>
                    <span class="tg-quantity-number">${item.quantity}</span>
                    <button class="tg-quantity-btn" onclick="updateCartQuantity('${bookId}', ${item.quantity + 1})">+</button>
                </div>
                <button class="tg-cart-item-remove" onclick="removeFromCart('${bookId}')">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(itemElement);
    });
    
    // Update totals
    const totalPriceElement = document.getElementById('cart-total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = formatPrice(totalPrice);
    }
}

function updateCartQuantity(bookId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(bookId);
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart') || '{}');
    cart[bookId].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    
    loadCartItems();
}

function removeFromCart(bookId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '{}');
    delete cart[bookId];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartBadge(Object.keys(cart).length);
    loadCartItems();
    showNotification('Đã xóa sách khỏi giỏ hàng', 'success');
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartBadge(0);
    loadCartItems();
    showNotification('Đã xóa toàn bộ giỏ hàng', 'success');
}

// Wishlist functions
function addToWishlist(bookId) {
    const user = getCurrentUser();
    if (!user) {
        showNotification('Vui lòng đăng nhập để thêm sách vào yêu thích', 'warning');
        return;
    }
    
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.includes(bookId)) {
        wishlist.push(bookId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification('Đã thêm sách vào yêu thích', 'success');
    } else {
        showNotification('Sách đã có trong danh sách yêu thích', 'info');
    }
}

// User functions
function getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    
    showNotification('Đăng xuất thành công', 'success');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `tg-notification tg-notification-${type}`;
    notification.innerHTML = `
        <div class="tg-notification-content">
            <i class="fa fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Export functions for global access
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.addToWishlist = addToWishlist;
window.toggleCartModal = toggleCartModal;
window.toggleUserDropdown = toggleUserDropdown;
window.logout = logout; 