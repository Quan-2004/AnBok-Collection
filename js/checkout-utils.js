/**
 * Checkout Utilities - Functions đồng nhất cho tất cả các trang
 * Đảm bảo tính nhất quán trong việc xử lý thanh toán
 */

// Function checkout đồng nhất cho tất cả các trang
window.checkout = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        showNotification('Giỏ hàng trống!', 'error');
        return;
    }
    
    // Tính tổng tiền giỏ hàng
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalOriginal = cart.reduce((sum, item) => sum + (item.original_price * item.quantity), 0);
    
    // Tạo dữ liệu giỏ hàng để truyền
    const cartData = {
        items: cart,
        totalPrice: totalPrice,
        totalOriginal: totalOriginal,
        totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
        timestamp: new Date().toISOString()
    };
    
    // Lưu dữ liệu giỏ hàng vào sessionStorage để truyền sang checkout.html
    sessionStorage.setItem('checkoutCart', JSON.stringify(cartData));
    
    // Chuyển đến trang thanh toán
    showNotification('Đang chuyển đến trang thanh toán...', 'info');
    setTimeout(() => {
        window.location.href = 'checkout.html?source=cart';
    }, 1000);
};

// Function để format giá tiền
window.formatPrice = function(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);
};

// Function để hiển thị thông báo
window.showNotification = function(message, type = 'info') {
    // Tạo notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fa fa-times"></i>
            </button>
        </div>
    `;
    
    // Thêm styles nếu chưa có
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideIn 0.3s ease-out;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                color: white;
                font-weight: 500;
            }
            
            .notification-info {
                background: linear-gradient(135deg, #4A6366 0%, #3A4F52 100%);
            }
            
            .notification-success {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            }
            
            .notification-error {
                background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            }
            
            .notification-warning {
                background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
                color: #212529;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-left: 12px;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Thêm notification vào body
    document.body.appendChild(notification);
    
    // Tự động xóa sau 5 giây
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
};

// Function để cập nhật hiển thị giỏ hàng
window.updateCartDisplay = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items-container');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        // Hiển thị giỏ hàng trống
        cartItemsContainer.innerHTML = `
            <div class="tg-cart-empty" style="display: block;">
                <i class="fa fa-shopping-cart"></i>
                <h4>Giỏ hàng trống</h4>
                <p>Hãy thêm sản phẩm vào giỏ hàng</p>
                <button class="tg-btn tg-btn-primary" onclick="toggleCartModal();">Tiếp tục mua sắm</button>
            </div>
        `;
    } else {
        // Hiển thị danh sách sản phẩm với đầy đủ thông tin
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="tg-cart-item" data-item-id="${item.story_id || item.book_id}">
                <div class="tg-cart-item-image">
                    <img src="${item.cover_image || item.image}" alt="${item.title}" onerror="this.src='images/books/default-book.jpg'">
                </div>
                <div class="tg-cart-item-details">
                    <h4>${item.title}</h4>
                    <p class="tg-cart-item-author">${item.author}</p>
                    <div class="tg-cart-item-info">
                        ${item.category_name ? `<span class="tg-cart-item-category">${item.category_name}</span>` : ''}
                        ${item.rating ? `<span class="tg-cart-item-rating">★ ${item.rating}</span>` : ''}
                        ${item.type === 'story' ? `<span class="tg-cart-item-type">📖 Truyện</span>` : '<span class="tg-cart-item-type">📚 Sách</span>'}
                    </div>
                    <div class="tg-cart-item-price">
                        <span class="tg-cart-item-current">${formatPrice(item.price)}</span>
                        ${item.original_price > item.price ? `<span class="tg-cart-item-original">${formatPrice(item.original_price)}</span>` : ''}
                    </div>
                    ${item.description ? `<p class="tg-cart-item-description">${item.description.substring(0, 100)}${item.description.length > 100 ? '...' : ''}</p>` : ''}
                </div>
                <div class="tg-cart-item-actions">
                    <div class="tg-cart-item-quantity">
                        <button class="tg-quantity-btn" onclick="updateQuantity('${item.story_id || item.book_id}', -1)">-</button>
                        <span class="tg-quantity-number">${item.quantity}</span>
                        <button class="tg-quantity-btn" onclick="updateQuantity('${item.story_id || item.book_id}', 1)">+</button>
                    </div>
                    <button class="tg-cart-item-remove" onclick="removeCartItem('${item.story_id || item.book_id}')">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Cập nhật tổng tiền
    updateCartTotal();
};

// Function để cập nhật số lượng sản phẩm
window.updateQuantity = function(itemId, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => (item.story_id === itemId || item.book_id === itemId));
    
    if (itemIndex !== -1) {
        const newQuantity = cart[itemIndex].quantity + change;
        
        if (newQuantity <= 0) {
            // Xóa item nếu số lượng <= 0
            cart.splice(itemIndex, 1);
            showNotification('Đã xóa sản phẩm khỏi giỏ hàng!', 'success');
        } else {
            // Cập nhật số lượng
            cart[itemIndex].quantity = newQuantity;
            showNotification('Đã cập nhật số lượng!', 'success');
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    }
};

// Function để xóa sản phẩm khỏi giỏ hàng
window.removeCartItem = function(itemId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => (item.story_id === itemId || item.book_id === itemId));
    
    if (itemIndex !== -1) {
        const removedItem = cart.splice(itemIndex, 1)[0];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
        showNotification(`Đã xóa "${removedItem.title}" khỏi giỏ hàng!`, 'success');
    }
};

// Function để xóa toàn bộ giỏ hàng
window.clearCart = function() {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
        localStorage.removeItem('cart');
        updateCartDisplay();
        updateCartCount();
        showNotification('Đã xóa toàn bộ giỏ hàng!', 'success');
    }
};

// Function để cập nhật số lượng sản phẩm trên badge
window.updateCartCount = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
};

// Function để cập nhật tổng tiền giỏ hàng
window.updateCartTotal = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalOriginal = cart.reduce((sum, item) => sum + (item.original_price * item.quantity), 0);
    const savings = totalOriginal - totalPrice;
    
    const totalPriceElement = document.getElementById('cart-total-price');
    const savingsElement = document.getElementById('cart-savings-amount');
    
    if (totalPriceElement) {
        totalPriceElement.textContent = formatPrice(totalPrice);
    }
    if (savingsElement) {
        savingsElement.textContent = formatPrice(savings);
    }
};

// Function để load giỏ hàng từ localStorage khi trang load
window.loadCartFromLocalStorage = function() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Cart loaded from localStorage:', cart);
        
        // Cập nhật hiển thị giỏ hàng
        updateCartDisplay();
        updateCartCount();
        
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // Nếu có lỗi, xóa cart cũ và tạo mới
        localStorage.removeItem('cart');
        updateCartDisplay();
        updateCartCount();
    }
};

// Auto-load cart when script loads
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
});

console.log('Checkout utilities loaded successfully!'); 