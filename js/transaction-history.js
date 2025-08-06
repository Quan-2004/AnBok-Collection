// Transaction History Management
class TransactionHistoryManager {
    constructor() {
        this.database = null;
        this.init();
    }

    async init() {
        // Wait for Firebase to be ready
        document.addEventListener('firebase-ready', () => {
            this.database = window.firebaseDatabase;
            this.loadTransactionHistory();
        });
        
        // Also try to initialize if Firebase is already available
        if (window.firebaseDatabase) {
            this.database = window.firebaseDatabase;
            this.loadTransactionHistory();
        }
    }

    async loadTransactionHistory() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.uid) {
                this.showTransactionEmpty();
                return;
            }

            // Check if database is available
            if (!this.database) {
                console.log('Database not available, waiting...');
                setTimeout(() => this.loadTransactionHistory(), 1000);
                return;
            }

            // Show loading
            $('#transaction-loading').show();
            $('#transaction-list').hide();
            $('#transaction-empty').hide();

            // Get orders from Firebase
            const { ref, get } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js");
            const ordersRef = ref(this.database, `orders/${user.uid}`);
            const ordersSnapshot = await get(ordersRef);

            if (ordersSnapshot.exists()) {
                const ordersData = ordersSnapshot.val();
                const orders = [];
                
                // Convert object to array and add orderId
                Object.keys(ordersData).forEach(orderId => {
                    const order = ordersData[orderId];
                    order.orderId = orderId;
                    orders.push(order);
                });
                
                // Sort by creation date (newest first)
                orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                if (orders.length > 0) {
                    this.displayTransactions(orders);
                } else {
                    this.showTransactionEmpty();
                }
            } else {
                this.showTransactionEmpty();
            }
        } catch (error) {
            console.error('Error loading transaction history:', error);
            this.showTransactionEmpty();
        }
    }

    displayTransactions(orders) {
        const transactionList = $('#transaction-list');
        transactionList.empty();

        // Pagination settings
        const itemsPerPage = 5;
        const totalPages = Math.ceil(orders.length / itemsPerPage);
        const currentPage = 1;

        // Store orders data for pagination
        this.allOrders = orders;
        this.currentPage = currentPage;
        this.itemsPerPage = itemsPerPage;

        // Display current page
        this.displayCurrentPage();
    }

    displayCurrentPage() {
        const transactionList = $('#transaction-list');
        transactionList.empty();

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentOrders = this.allOrders.slice(startIndex, endIndex);

        currentOrders.forEach((order, index) => {
            const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
            const orderTime = new Date(order.createdAt).toLocaleTimeString('vi-VN');
            const statusClass = order.status === 'success' ? 'success' : 
                              order.status === 'pending' ? 'pending' : 'failed';
            const statusText = order.status === 'success' ? 'Thành công' : 
                              order.status === 'pending' ? 'Đang xử lý' : 'Thất bại';

            // Determine order type and display appropriate information
            let orderType = 'membership';
            let orderTitle = '';
            let orderDetails = '';
            let orderAmount = 0;

            if (order.packageName) {
                // Membership order
                orderType = 'membership';
                orderTitle = order.packageName;
                orderDetails = `Thời hạn: ${order.packageDuration} tháng`;
                orderAmount = order.packagePrice;
            } else if (order.cartItems && order.cartItems.length > 0) {
                // Cart order
                orderType = 'cart';
                orderTitle = `Đơn hàng ${order.totalItems} sản phẩm`;
                orderDetails = order.cartItems.map(item => 
                    `${item.title} (${item.quantity}x)`
                ).join(', ');
                orderAmount = order.totalPrice;
            }

            const transactionHtml = `
                <div class="tg-transaction-summary" onclick="toggleTransactionDetails(${index})">
                    <div class="tg-transaction-summary-header">
                        <div class="tg-transaction-summary-id">${order.orderId}</div>
                        <div class="tg-transaction-summary-status status-${statusClass}">${statusText}</div>
                    </div>
                    <div class="tg-transaction-summary-footer">
                        <div class="tg-transaction-summary-date">${orderDate} ${orderTime}</div>
                        <div class="tg-transaction-summary-amount">${this.formatPrice(orderAmount)}</div>
                    </div>
                </div>
                <div class="tg-transaction-details-container" id="transaction-details-${index}">
                    <div class="tg-transaction-details">
                        <div class="tg-transaction-detail">
                            <div class="tg-transaction-label">Loại đơn hàng</div>
                            <div class="tg-transaction-value">
                                ${orderType === 'membership' ? '🎯 Gói hội viên' : '🛒 Đơn hàng sách/truyện'}
                            </div>
                        </div>
                        <div class="tg-transaction-detail">
                            <div class="tg-transaction-label">${orderType === 'membership' ? 'Gói' : 'Sản phẩm'}</div>
                            <div class="tg-transaction-value">${orderTitle}</div>
                        </div>
                        <div class="tg-transaction-detail">
                            <div class="tg-transaction-label">Phương thức</div>
                            <div class="tg-transaction-value">${order.paymentMethod.toUpperCase()}</div>
                        </div>
                        ${orderType === 'membership' ? `
                            <div class="tg-transaction-detail">
                                <div class="tg-transaction-label">Thời hạn</div>
                                <div class="tg-transaction-value">${order.packageDuration} tháng</div>
                            </div>
                        ` : `
                            <div class="tg-transaction-detail">
                                <div class="tg-transaction-label">Số lượng</div>
                                <div class="tg-transaction-value">${order.totalItems} sản phẩm</div>
                            </div>
                        `}
                        <div class="tg-transaction-detail">
                            <div class="tg-transaction-label">Trạng thái</div>
                            <div class="tg-transaction-value">${statusText}</div>
                        </div>
                        ${order.couponCode ? `
                            <div class="tg-transaction-detail">
                                <div class="tg-transaction-label">Mã giảm giá</div>
                                <div class="tg-transaction-value">${order.couponCode} (-${this.formatPrice(order.couponDiscount)})</div>
                            </div>
                        ` : ''}
                    </div>
                    ${orderType === 'cart' && order.cartItems ? `
                        <div class="tg-transaction-items">
                            <div class="tg-transaction-label">Chi tiết sản phẩm:</div>
                            <div class="tg-cart-items-list">
                                ${order.cartItems.map(item => `
                                    <div class="tg-cart-item-summary">
                                        <img src="${item.cover_image || item.image}" alt="${item.title}" onerror="this.src='images/books/default-book.jpg'">
                                        <div class="tg-cart-item-info">
                                            <div class="tg-cart-item-title">${item.title}</div>
                                            <div class="tg-cart-item-author">${item.author}</div>
                                            <div class="tg-cart-item-price">${this.formatPrice(item.price)} x ${item.quantity}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            transactionList.append(transactionHtml);
        });

        // Add pagination if there are more than 5 orders
        if (this.allOrders.length > this.itemsPerPage) {
            this.displayPagination();
        }

        $('#transaction-loading').hide();
        $('#transaction-list').show();
    }

    displayPagination() {
        const totalPages = Math.ceil(this.allOrders.length / this.itemsPerPage);
        const currentPage = this.currentPage;

        let paginationHtml = `
            <div class="tg-transaction-pagination">
                <button class="tg-pagination-nav" onclick="goToTransactionPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i> Trước
                </button>
        `;

        // Calculate page range to display
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        // Adjust range if at edges
        if (currentPage <= 3) {
            endPage = Math.min(totalPages, 5);
        } else if (currentPage >= totalPages - 2) {
            startPage = Math.max(1, totalPages - 4);
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <button class="tg-pagination-button ${i === currentPage ? 'active' : ''}" onclick="goToTransactionPage(${i})">
                    ${i}
                </button>
            `;
        }

        paginationHtml += `
                <button class="tg-pagination-nav" onclick="goToTransactionPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                    Sau <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        $('#transaction-list').append(paginationHtml);
    }

    showTransactionEmpty() {
        $('#transaction-loading').hide();
        $('#transaction-list').hide();
        $('#transaction-empty').show();
    }

    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }
}

// Initialize transaction history manager
$(document).ready(function() {
    window.transactionHistoryManager = new TransactionHistoryManager();
});

// Global function to reload transaction history
window.loadTransactionHistory = function() {
    if (window.transactionHistoryManager) {
        window.transactionHistoryManager.loadTransactionHistory();
    }
};

// Global function to toggle transaction history
window.toggleTransactionHistory = function() {
    const collapsibleItems = $('.tg-transaction-collapsible');
    const toggleButton = $('.tg-transaction-toggle');
    const toggleSpan = toggleButton.find('span');
    const toggleIcon = toggleButton.find('i');
    
    if (collapsibleItems.first().is(':visible')) {
        // Hide items
        collapsibleItems.slideUp(300);
        toggleSpan.text('Xem thêm giao dịch');
        toggleIcon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
        toggleButton.removeClass('expanded');
    } else {
        // Show items
        collapsibleItems.slideDown(300);
        toggleSpan.text('Thu gọn giao dịch');
        toggleIcon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
        toggleButton.addClass('expanded');
    }
};

// Global function to toggle individual transaction details
window.toggleTransactionDetails = function(index) {
    const detailsContainer = $(`#transaction-details-${index}`);
    const summary = detailsContainer.prev('.tg-transaction-summary');
    
    if (detailsContainer.hasClass('expanded')) {
        // Hide details
        detailsContainer.removeClass('expanded').slideUp(300);
        summary.removeClass('expanded');
    } else {
        // Show details
        detailsContainer.addClass('expanded').slideDown(300);
        summary.addClass('expanded');
    }
};

// Global function to navigate to transaction page
window.goToTransactionPage = function(page) {
    if (window.updatedTransactionHistoryManager) {
        window.updatedTransactionHistoryManager.currentPage = page;
        window.updatedTransactionHistoryManager.displayCurrentPage();
    } else if (window.transactionHistoryManager) {
        window.transactionHistoryManager.currentPage = page;
        window.transactionHistoryManager.displayCurrentPage();
    }
}; 