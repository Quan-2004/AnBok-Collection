// Firebase Realtime Database Integration for Index Page
// Import Firebase modules
import { getDatabase, ref, get, child, onValue, query, orderByChild, limitToFirst } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Initialize Firebase Database
let database;
let auth;

// Wait for Firebase to be ready
document.addEventListener('firebase-ready', function(event) {
    auth = event.detail.auth;
    database = getDatabase();
    initializeIndexPage();
});

// Initialize the index page with Firebase data
function initializeIndexPage() {
    console.log('Initializing index page with Firebase data...');
    
    // Load best selling books
    loadBestSellingBooks();
    
    // Load new releases
    loadNewReleases();
    
    // Load trending data
    loadTrendingData();
    
    // Load latest news
    loadLatestNews();
    
    // Setup event listeners for buttons
    setupButtonEventListeners();
    
    // Load user data if logged in
    loadUserData();
}

// Load best selling books from Firebase
async function loadBestSellingBooks() {
    try {
        const booksRef = ref(database, 'Books');
        const bestSellingQuery = query(booksRef, orderByChild('sales_count'), limitToFirst(6));
        
        onValue(bestSellingQuery, (snapshot) => {
            const books = [];
            snapshot.forEach((childSnapshot) => {
                const book = childSnapshot.val();
                book.id = childSnapshot.key;
                books.push(book);
            });
            
            // Sort by sales count (descending)
            books.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
            
            // Update the best selling books section
            updateBestSellingBooksSection(books.slice(0, 6));
        });
    } catch (error) {
        console.error('Error loading best selling books:', error);
        // Fallback to static data
        loadStaticBestSellingBooks();
    }
}

// Update best selling books section
function updateBestSellingBooksSection(books) {
    const container = document.getElementById('tg-bestsellingbooksslider');
    if (!container) return;
    
    container.innerHTML = '';
    
    books.forEach(book => {
        const bookElement = createBookElement(book, 'bestselling');
        container.appendChild(bookElement);
    });
    
    // Reinitialize owl carousel
    if (typeof $.fn.owlCarousel !== 'undefined') {
        $('#tg-bestsellingbooksslider').owlCarousel({
            loop: true,
            margin: 30,
            nav: true,
            dots: false,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                992: { items: 3 },
                1200: { items: 4 }
            }
        });
    }
}

// Load new releases from Firebase
async function loadNewReleases() {
    try {
        const booksRef = ref(database, 'Books');
        const newReleasesQuery = query(booksRef, orderByChild('published_date'), limitToFirst(3));
        
        onValue(newReleasesQuery, (snapshot) => {
            const books = [];
            snapshot.forEach((childSnapshot) => {
                const book = childSnapshot.val();
                book.id = childSnapshot.key;
                books.push(book);
            });
            
            // Sort by published date (newest first)
            books.sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
            
            // Update the new releases section
            updateNewReleasesSection(books.slice(0, 3));
        });
    } catch (error) {
        console.error('Error loading new releases:', error);
        // Fallback to static data
        loadStaticNewReleases();
    }
}

// Update new releases section
function updateNewReleasesSection(books) {
    const container = document.querySelector('.tg-newreleasebooks');
    if (!container) return;
    
    container.innerHTML = '';
    
    books.forEach(book => {
        const bookElement = createBookElement(book, 'new-release');
        container.appendChild(bookElement);
    });
}

// Load trending data from Firebase
async function loadTrendingData() {
    try {
        // Load trending books
        const trendingBooksRef = ref(database, 'TrendingData/trending_books');
        onValue(trendingBooksRef, (snapshot) => {
            const trendingBooks = snapshot.val() || [];
            updateTrendingBooksSection(trendingBooks);
        });
        
        // Load favorite books
        const favoriteBooksRef = ref(database, 'TrendingData/favorite_books');
        onValue(favoriteBooksRef, (snapshot) => {
            const favoriteBooks = snapshot.val() || [];
            updateFavoriteBooksSection(favoriteBooks);
        });
        
        // Load recent comments
        const recentCommentsRef = ref(database, 'Comments');
        const commentsQuery = query(recentCommentsRef, orderByChild('timestamp'), limitToFirst(4));
        onValue(commentsQuery, (snapshot) => {
            const comments = [];
            snapshot.forEach((childSnapshot) => {
                const comment = childSnapshot.val();
                comment.id = childSnapshot.key;
                comments.push(comment);
            });
            updateRecentCommentsSection(comments);
        });
    } catch (error) {
        console.error('Error loading trending data:', error);
        // Keep static trending data
    }
}

// Update trending books section
function updateTrendingBooksSection(trendingBooks) {
    const container = document.querySelector('.trending-column:first-child .trending-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    trendingBooks.slice(0, 5).forEach((book, index) => {
        const item = document.createElement('div');
        item.className = 'trending-item';
        item.innerHTML = `
            <span class="trending-number">${index + 1}</span>
            <i class="fa fa-arrow-up" style="color: #00ff00; margin: 0 8px;"></i>
            <img src="${book.cover_image || 'images/books/img-01.jpg'}" alt="${book.title}" style="width: 40px; height: 60px; object-fit: cover; margin: 0 8px;">
            <span class="trending-title">${book.title}</span>
        `;
        container.appendChild(item);
    });
}

// Update favorite books section
function updateFavoriteBooksSection(favoriteBooks) {
    const container = document.querySelector('.trending-column:nth-child(2) .trending-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    favoriteBooks.slice(0, 5).forEach((book, index) => {
        const item = document.createElement('div');
        item.className = 'trending-item';
        item.innerHTML = `
            <span class="trending-number">${index + 1}</span>
            <i class="fa fa-arrow-up" style="color: #00ff00; margin: 0 8px;"></i>
            <img src="${book.cover_image || 'images/books/img-06.jpg'}" alt="${book.title}" style="width: 40px; height: 60px; object-fit: cover; margin: 0 8px;">
            <span class="trending-title">${book.title}</span>
        `;
        container.appendChild(item);
    });
}

// Update recent comments section
function updateRecentCommentsSection(comments) {
    const container = document.querySelector('.trending-column:nth-child(3) .trending-comments');
    if (!container) return;
    
    container.innerHTML = '';
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-card';
        commentElement.innerHTML = `
            <img src="${comment.user_avatar || 'images/users/img-01.jpg'}" alt="User" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
            <div class="comment-content">
                <div class="comment-user">${comment.user_name || 'Anonymous'}</div>
                <div class="comment-text">${comment.content}</div>
                <div class="comment-movie">
                    <i class="fa fa-play" style="color: #ffd700;"></i>
                    <span>${comment.book_title || 'Unknown Book'}</span>
                </div>
            </div>
        `;
        container.appendChild(commentElement);
    });
}

// Load latest news from Firebase
async function loadLatestNews() {
    try {
        const newsRef = ref(database, 'News');
        const newsQuery = query(newsRef, orderByChild('published_date'), limitToFirst(6));
        
        onValue(newsQuery, (snapshot) => {
            const news = [];
            snapshot.forEach((childSnapshot) => {
                const newsItem = childSnapshot.val();
                newsItem.id = childSnapshot.key;
                news.push(newsItem);
            });
            
            // Sort by published date (newest first)
            news.sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
            
            // Update the latest news section
            updateLatestNewsSection(news.slice(0, 6));
        });
    } catch (error) {
        console.error('Error loading latest news:', error);
        // Keep static news data
    }
}

// Update latest news section
function updateLatestNewsSection(news) {
    const container = document.getElementById('tg-postslider');
    if (!container) return;
    
    container.innerHTML = '';
    
    news.forEach(newsItem => {
        const newsElement = document.createElement('article');
        newsElement.className = 'item tg-post';
        newsElement.innerHTML = `
            <figure><a href="news-detail.html?id=${newsItem.id}"><img src="${newsItem.image_url || 'images/blog/img-01.jpg'}" alt="${newsItem.title}"></a></figure>
            <div class="tg-postcontent">
                <ul class="tg-bookscategories">
                    <li><a href="javascript:void(0);">${newsItem.category || 'News'}</a></li>
                </ul>
                <div class="tg-themetagbox"><span class="tg-themetag">${newsItem.is_featured ? 'featured' : 'news'}</span></div>
                <div class="tg-posttitle">
                    <h3><a href="news-detail.html?id=${newsItem.id}">${newsItem.title}</a></h3>
                </div>
                <span class="tg-bookwriter">By: <a href="javascript:void(0);">${newsItem.author || 'Admin'}</a></span>
                <ul class="tg-postmetadata">
                    <li><a href="javascript:void(0);"><i class="fa fa-comment-o"></i><i>${newsItem.comment_count || 0} Comments</i></a></li>
                    <li><a href="javascript:void(0);"><i class="fa fa-eye"></i><i>${newsItem.view_count || 0} Views</i></a></li>
                </ul>
            </div>
        `;
        container.appendChild(newsElement);
    });
    
    // Reinitialize owl carousel
    if (typeof $.fn.owlCarousel !== 'undefined') {
        $('#tg-postslider').owlCarousel({
            loop: true,
            margin: 30,
            nav: true,
            dots: false,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                992: { items: 3 }
            }
        });
    }
}

// Create book element
function createBookElement(book, type) {
    const div = document.createElement('div');
    div.className = type === 'bestselling' ? 'item' : 'col-xs-4 col-sm-4 col-md-6 col-lg-4';
    
    const discount = book.discount_percentage || 0;
    const originalPrice = book.price || 0;
    const discountedPrice = originalPrice * (1 - discount / 100);
    
    div.innerHTML = `
        <div class="tg-postbook">
            <figure class="tg-featureimg">
                <div class="tg-bookimg">
                    <div class="tg-frontcover"><img src="${book.cover_image || 'images/books/img-01.jpg'}" alt="${book.title}"></div>
                    <div class="tg-backcover"><img src="${book.cover_image || 'images/books/img-01.jpg'}" alt="${book.title}"></div>
                </div>
                <a class="tg-btnaddtowishlist" href="javascript:void(0);" onclick="addToWishlist('${book.id}')">
                    <i class="icon-heart"></i>
                    <span>Thêm vào yêu thích</span>
                </a>
            </figure>
            <div class="tg-postbookcontent">
                <ul class="tg-bookscategories">
                    ${book.genres ? book.genres.map(genre => `<li><a href="book.html?genre=${genre}">${genre}</a></li>`).join('') : '<li><a href="javascript:void(0);">General</a></li>'}
                </ul>
                ${discount > 0 ? '<div class="tg-themetagbox"><span class="tg-themetag">Khuyến mãi</span></div>' : '<div class="tg-themetagbox"></div>'}
                <div class="tg-booktitle">
                    <h3><a href="book-detail.html?id=${book.id}">${book.title}</a></h3>
                </div>
                <span class="tg-bookwriter">Tác giả: <a href="author-detail.html?id=${book.author_id}">${book.author_name || 'Unknown'}</a></span>
                <span class="tg-stars"><span></span></span>
                <span class="tg-bookprice">
                    <ins>${formatPrice(discountedPrice)}</ins>
                    ${discount > 0 ? `<del>${formatPrice(originalPrice)}</del>` : ''}
                </span>
                <a class="tg-btn tg-btnstyletwo" href="javascript:void(0);" onclick="addToCart('${book.id}')">
                    <i class="fa fa-shopping-basket"></i>
                    <em>Thêm vào giỏ</em>
                </a>
            </div>
        </div>
    `;
    
    return div;
}

// Setup button event listeners
function setupButtonEventListeners() {
    // Navigation links
    setupNavigationLinks();
    
    // Action buttons
    setupActionButtons();
    
    // Search functionality
    setupSearchFunctionality();
    
    // Cart functionality
    setupCartFunctionality();
    
    // User profile functionality
    setupUserProfileFunctionality();
}

// Setup navigation links
function setupNavigationLinks() {
    // Home link
    const homeLink = document.querySelector('a[href="index.html"]');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
    
    // Books link
    const booksLink = document.querySelector('a[href="book.html"]');
    if (booksLink) {
        booksLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'book.html';
        });
    }
    
    // Stories link
    const storiesLink = document.querySelector('a[href="story.html"]');
    if (storiesLink) {
        storiesLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'story.html';
        });
    }
    
    // Authors link
    const authorsLink = document.querySelector('a[href="author-bio.html"]');
    if (authorsLink) {
        authorsLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'author-bio.html';
        });
    }
    
    // News link
    const newsLink = document.querySelector('a[href="news.html"]');
    if (newsLink) {
        newsLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'news.html';
        });
    }
    
    // About link
    const aboutLink = document.querySelector('a[href="about.html"]');
    if (aboutLink) {
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'about.html';
        });
    }
    
    // Contact link
    const contactLink = document.querySelector('a[href="contact.html"]');
    if (contactLink) {
        contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'contact.html';
        });
    }
    
    // Membership link
    const membershipLink = document.querySelector('a[href="menbership.html"]');
    if (membershipLink) {
        membershipLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'menbership.html';
        });
    }
}

// Setup action buttons
function setupActionButtons() {
    // "View all" buttons
    const viewAllButtons = document.querySelectorAll('a.tg-btn[href="javascript:void(0);"]');
    viewAllButtons.forEach(button => {
        if (button.textContent.includes('Xem tất cả')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
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
    
    // "Read more" buttons
    const readMoreButtons = document.querySelectorAll('a.tg-btn');
    readMoreButtons.forEach(button => {
        if (button.textContent.includes('Đọc thêm')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'book.html';
            });
        }
    });
}

// Setup search functionality
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.tg-search-box input');
    const searchButton = document.querySelector('.tg-search-box button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
}

// Perform search
function performSearch(query) {
    if (query.trim()) {
        window.location.href = `book.html?search=${encodeURIComponent(query.trim())}`;
    }
}

// Setup cart functionality
function setupCartFunctionality() {
    // Cart toggle
    const cartToggle = document.querySelector('.tg-cart-link');
    if (cartToggle) {
        cartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCartModal();
        });
    }
    
    // Cart modal close
    const cartModalClose = document.querySelector('.tg-cart-modal-close');
    if (cartModalClose) {
        cartModalClose.addEventListener('click', () => {
            toggleCartModal();
        });
    }
    
    // Checkout button
    const checkoutButton = document.querySelector('.tg-cart-actions .tg-btn-primary');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }
}

// Setup user profile functionality
function setupUserProfileFunctionality() {
    // User dropdown toggle
    const userInfo = document.querySelector('.tg-user-info');
    if (userInfo) {
        userInfo.addEventListener('click', () => {
            toggleUserDropdown();
        });
    }
    
    // Profile links
    const profileLinks = document.querySelectorAll('.tg-dropdown-item');
    profileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href !== 'javascript:void(0);') {
                window.location.href = href;
            }
        });
    });
    
    // Logout button
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Load user data
function loadUserData() {
    const user = auth.currentUser;
    if (user) {
        // Update user info in header
        updateUserInfo(user);
        
        // Load user cart
        loadUserCart(user.uid);
        
        // Load user wishlist
        loadUserWishlist(user.uid);
    } else {
        // Show auth buttons for guest users
        showAuthButtons();
    }
}

// Update user info in header
function updateUserInfo(user) {
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    const dropdownUserAvatar = document.getElementById('dropdownUserAvatar');
    
    if (userName) userName.textContent = user.displayName || user.email;
    if (userAvatar) userAvatar.src = user.photoURL || 'images/users/img-01.jpg';
    if (dropdownUserName) dropdownUserName.textContent = user.displayName || user.email;
    if (dropdownUserEmail) dropdownUserEmail.textContent = user.email;
    if (dropdownUserAvatar) dropdownUserAvatar.src = user.photoURL || 'images/users/img-01.jpg';
    
    // Hide auth buttons and show user profile
    const authButtons = document.querySelector('.tg-auth-buttons');
    const userProfile = document.querySelector('.tg-user-profile');
    
    if (authButtons) authButtons.style.display = 'none';
    if (userProfile) userProfile.style.display = 'flex';
}

// Show auth buttons for guest users
function showAuthButtons() {
    const authButtons = document.querySelector('.tg-auth-buttons');
    const userProfile = document.querySelector('.tg-user-profile');
    
    if (authButtons) authButtons.style.display = 'block';
    if (userProfile) userProfile.style.display = 'none';
}

// Load user cart
async function loadUserCart(userId) {
    try {
        const cartRef = ref(database, `Users/${userId}/cart`);
        onValue(cartRef, (snapshot) => {
            const cart = snapshot.val() || {};
            updateCartBadge(Object.keys(cart).length);
            updateCartModal(cart);
        });
    } catch (error) {
        console.error('Error loading user cart:', error);
    }
}

// Load user wishlist
async function loadUserWishlist(userId) {
    try {
        const wishlistRef = ref(database, `Users/${userId}/wishlist`);
        onValue(wishlistRef, (snapshot) => {
            const wishlist = snapshot.val() || {};
            // Update wishlist count if needed
        });
    } catch (error) {
        console.error('Error loading user wishlist:', error);
    }
}

// Update cart badge
function updateCartBadge(count) {
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Update cart modal
function updateCartModal(cart) {
    const container = document.getElementById('cart-items-container');
    if (!container) return;
    
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
    
    // Load book details for cart items
    loadCartItemsDetails(cart, container);
}

// Load cart items details
async function loadCartItemsDetails(cart, container) {
    try {
        const booksRef = ref(database, 'Books');
        const snapshot = await get(booksRef);
        
        if (snapshot.exists()) {
            const books = snapshot.val();
            let totalPrice = 0;
            let totalSavings = 0;
            
            container.innerHTML = '';
            
            for (const [bookId, cartItem] of Object.entries(cart)) {
                const book = books[bookId];
                if (book) {
                    const discount = book.discount_percentage || 0;
                    const originalPrice = book.price || 0;
                    const discountedPrice = originalPrice * (1 - discount / 100);
                    const itemTotal = discountedPrice * cartItem.quantity;
                    const itemSavings = (originalPrice - discountedPrice) * cartItem.quantity;
                    
                    totalPrice += itemTotal;
                    totalSavings += itemSavings;
                    
                    const itemElement = document.createElement('div');
                    itemElement.className = 'tg-cart-item';
                    itemElement.innerHTML = `
                        <div class="tg-cart-item-image">
                            <img src="${book.cover_image || 'images/books/img-01.jpg'}" alt="${book.title}">
                        </div>
                        <div class="tg-cart-item-details">
                            <h4>${book.title}</h4>
                            <p class="tg-cart-item-author">${book.author_name || 'Unknown'}</p>
                            <div class="tg-cart-item-price">
                                <span class="tg-cart-item-current">${formatPrice(discountedPrice)}</span>
                                ${discount > 0 ? `<span class="tg-cart-item-original">${formatPrice(originalPrice)}</span>` : ''}
                            </div>
                        </div>
                        <div class="tg-cart-item-actions">
                            <div class="tg-cart-item-quantity">
                                <button class="tg-quantity-btn" onclick="updateCartQuantity('${bookId}', ${cartItem.quantity - 1})">-</button>
                                <span class="tg-quantity-number">${cartItem.quantity}</span>
                                <button class="tg-quantity-btn" onclick="updateCartQuantity('${bookId}', ${cartItem.quantity + 1})">+</button>
                            </div>
                            <button class="tg-cart-item-remove" onclick="removeFromCart('${bookId}')">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    `;
                    container.appendChild(itemElement);
                }
            }
            
            // Update totals
            const totalPriceElement = document.getElementById('cart-total-price');
            const savingsElement = document.getElementById('cart-savings-amount');
            
            if (totalPriceElement) totalPriceElement.textContent = formatPrice(totalPrice);
            if (savingsElement) savingsElement.textContent = formatPrice(totalSavings);
        }
    } catch (error) {
        console.error('Error loading cart items details:', error);
    }
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function toggleCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.toggle('active');
    }
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Cart functions
function addToCart(bookId) {
    const user = auth.currentUser;
    if (!user) {
        showNotification('Vui lòng đăng nhập để thêm sách vào giỏ hàng', 'warning');
        return;
    }
    
    const cartRef = ref(database, `Users/${user.uid}/cart/${bookId}`);
    get(cartRef).then((snapshot) => {
        const currentQuantity = snapshot.exists() ? snapshot.val().quantity : 0;
        set(cartRef, { quantity: currentQuantity + 1, added_at: new Date().toISOString() });
        showNotification('Đã thêm sách vào giỏ hàng', 'success');
    });
}

function updateCartQuantity(bookId, newQuantity) {
    const user = auth.currentUser;
    if (!user) return;
    
    if (newQuantity <= 0) {
        removeFromCart(bookId);
        return;
    }
    
    const cartRef = ref(database, `Users/${user.uid}/cart/${bookId}`);
    update(cartRef, { quantity: newQuantity });
}

function removeFromCart(bookId) {
    const user = auth.currentUser;
    if (!user) return;
    
    const cartRef = ref(database, `Users/${user.uid}/cart/${bookId}`);
    remove(cartRef);
    showNotification('Đã xóa sách khỏi giỏ hàng', 'success');
}

function clearCart() {
    const user = auth.currentUser;
    if (!user) return;
    
    const cartRef = ref(database, `Users/${user.uid}/cart`);
    remove(cartRef);
    showNotification('Đã xóa toàn bộ giỏ hàng', 'success');
}

function checkout() {
    window.location.href = 'checkout.html';
}

// Wishlist functions
function addToWishlist(bookId) {
    const user = auth.currentUser;
    if (!user) {
        showNotification('Vui lòng đăng nhập để thêm sách vào yêu thích', 'warning');
        return;
    }
    
    const wishlistRef = ref(database, `Users/${user.uid}/wishlist/${bookId}`);
    set(wishlistRef, { added_at: new Date().toISOString() });
    showNotification('Đã thêm sách vào yêu thích', 'success');
}

// Logout function
function logout() {
    auth.signOut().then(() => {
        showNotification('Đăng xuất thành công', 'success');
        window.location.reload();
    }).catch((error) => {
        console.error('Error signing out:', error);
        showNotification('Lỗi khi đăng xuất', 'error');
    });
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `tg-notification tg-notification-${type}`;
    notification.innerHTML = `
        <div class="tg-notification-content">
            <i class="fa fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Fallback functions for static data
function loadStaticBestSellingBooks() {
    console.log('Loading static best selling books...');
    // Keep existing static content
}

function loadStaticNewReleases() {
    console.log('Loading static new releases...');
    // Keep existing static content
}

// Export functions for global access
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.checkout = checkout;
window.addToWishlist = addToWishlist;
window.toggleCartModal = toggleCartModal;
window.toggleUserDropdown = toggleUserDropdown; 