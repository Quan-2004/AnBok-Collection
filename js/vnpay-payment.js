// VNPAY Payment Integration
class VNPAYPayment {
    constructor() {
        this.config = {
            tmnCode: 'D8BKEQKQ',
            hashSecret: 'JOKBWH3T2E3CYLSJE212ZB639WL73JGQ',
            url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
            returnUrl: window.location.origin + '/payment-success.html',
            ipnUrl: window.location.origin + '/payment-ipn.html'
        };
    }

    // Generate secure hash for VNPAY
    generateSecureHash(params) {
        // Sort parameters alphabetically
        const sortedParams = Object.keys(params).sort().reduce((result, key) => {
            result[key] = params[key];
            return result;
        }, {});

        // Create query string
        const queryString = Object.keys(sortedParams)
            .map(key => `${key}=${encodeURIComponent(sortedParams[key])}`)
            .join('&');

        // Create HMAC SHA512 hash
        return this.hmacSHA512(queryString, this.config.hashSecret);
    }

    // HMAC SHA512 implementation
    hmacSHA512(message, secret) {
        // Using Web Crypto API for HMAC SHA512
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const messageData = encoder.encode(message);

        return crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-512' },
            false,
            ['sign']
        ).then(key => {
            return crypto.subtle.sign('HMAC', key, messageData);
        }).then(signature => {
            // Convert to hex string
            return Array.from(new Uint8Array(signature))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        });
    }

    // Create payment URL
    async createPaymentUrl(orderData) {
        const vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.config.tmnCode,
            vnp_Amount: orderData.amount * 100, // VNPAY expects amount in VND (smallest unit)
            vnp_CurrCode: 'VND',
            vnp_BankCode: '',
            vnp_TxnRef: orderData.orderId,
            vnp_OrderInfo: orderData.orderInfo,
            vnp_OrderType: 'billpayment',
            vnp_Locale: 'vn',
            vnp_ReturnUrl: this.config.returnUrl,
            vnp_IpnUrl: this.config.ipnUrl,
            vnp_CreateDate: new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + '07'
        };

        // Generate secure hash
        const secureHash = await this.generateSecureHash(vnpParams);
        vnpParams.vnp_SecureHash = secureHash;

        // Create query string
        const queryString = Object.keys(vnpParams)
            .map(key => `${key}=${encodeURIComponent(vnpParams[key])}`)
            .join('&');

        return `${this.config.url}?${queryString}`;
    }

    // Verify payment response
    async verifyPaymentResponse(params) {
        const { vnp_SecureHash, ...otherParams } = params;
        
        // Sort parameters alphabetically
        const sortedParams = Object.keys(otherParams).sort().reduce((result, key) => {
            result[key] = otherParams[key];
            return result;
        }, {});

        // Create query string
        const queryString = Object.keys(sortedParams)
            .map(key => `${key}=${encodeURIComponent(sortedParams[key])}`)
            .join('&');

        // Generate secure hash
        const calculatedHash = await this.generateSecureHash(sortedParams);
        
        return calculatedHash === vnp_SecureHash;
    }

    // Process payment response
    processPaymentResponse(params) {
        const responseCode = params.vnp_ResponseCode;
        const orderId = params.vnp_TxnRef;
        const responseMessage = params.vnp_Message || '';

        return {
            success: responseCode === '00',
            orderId: orderId,
            responseCode: responseCode,
            responseMessage: responseMessage,
            params: params
        };
    }
}

// Firebase Order Management
class FirebaseOrderManager {
    constructor(database) {
        this.database = database;
    }

    // Create new order
    async createOrder(orderData) {
        try {
            const orderId = 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            const order = {
                orderId: orderId,
                packageId: orderData.packageId,
                packageName: orderData.packageName,
                packagePrice: orderData.packagePrice,
                packageDuration: orderData.packageDuration,
                customerName: orderData.customerName,
                customerEmail: orderData.customerEmail,
                customerPhone: orderData.customerPhone,
                customerAddress: orderData.customerAddress,
                paymentMethod: 'vnpay',
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Save to Firebase
            const ordersRef = ref(this.database, 'Orders');
            await push(ordersRef, order);

            return order;
        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error('Không thể tạo đơn hàng');
        }
    }

    // Update order status
    async updateOrderStatus(orderId, status, vnpayResponse) {
        try {
            const ordersRef = ref(this.database, 'Orders');
            const orderSnapshot = await get(ordersRef);
            
            if (orderSnapshot.exists()) {
                const orders = orderSnapshot.val();
                let orderKey = null;
                
                // Find the order by orderId
                for (const key in orders) {
                    if (orders[key].orderId === orderId) {
                        orderKey = key;
                        break;
                    }
                }
                
                if (orderKey) {
                    const updates = {};
                    updates[`Orders/${orderKey}/status`] = status;
                    updates[`Orders/${orderKey}/updatedAt`] = new Date().toISOString();
                    updates[`Orders/${orderKey}/vnpayResponse`] = vnpayResponse;
                    
                    if (status === 'success') {
                        updates[`Orders/${orderKey}/activatedAt`] = new Date().toISOString();
                    }
                    
                    await update(ref(this.database), updates);
                    return orders[orderKey];
                }
            }
            
            throw new Error('Không tìm thấy đơn hàng');
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    }

    // Get order by ID
    async getOrder(orderId) {
        try {
            const ordersRef = ref(this.database, 'Orders');
            const orderSnapshot = await get(ordersRef);
            
            if (orderSnapshot.exists()) {
                const orders = orderSnapshot.val();
                
                for (const key in orders) {
                    if (orders[key].orderId === orderId) {
                        return orders[key];
                    }
                }
            }
            
            return null;
        } catch (error) {
            console.error('Error getting order:', error);
            throw error;
        }
    }
}

// Payment Form Handler
class PaymentFormHandler {
    constructor(vnpayPayment, orderManager) {
        this.vnpayPayment = vnpayPayment;
        this.orderManager = orderManager;
        this.currentPackage = null;
    }

    // Initialize payment form
    async init() {
        await this.loadPackageInfo();
        this.bindEvents();
    }

    // Load package information
    async loadPackageInfo() {
        const packageId = this.getPackageIdFromUrl();
        if (!packageId) {
            this.showError('Không tìm thấy thông tin gói hội viên');
            return;
        }

        try {
            const packagesRef = ref(this.orderManager.database, 'MembershipPackages');
            const snapshot = await get(packagesRef);
            
            if (snapshot.exists()) {
                const packages = snapshot.val();
                let pkg = null;
                
                // Find package by package_id or by key
                for (const key in packages) {
                    if (packages[key].package_id === packageId || key === packageId) {
                        pkg = packages[key];
                        break;
                    }
                }
                
                if (pkg && pkg.is_active) {
                    this.currentPackage = pkg;
                    this.displayPackageInfo(pkg);
                } else {
                    this.showError('Gói hội viên không tồn tại hoặc đã bị vô hiệu hóa');
                }
            } else {
                this.showError('Không thể tải thông tin gói hội viên');
            }
        } catch (error) {
            console.error('Error loading package:', error);
            this.showError('Có lỗi xảy ra khi tải thông tin gói hội viên');
        }
    }

    // Get package ID from URL
    getPackageIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('package');
    }

    // Display package information
    displayPackageInfo(pkg) {
        const packageNameEl = document.getElementById('packageName');
        const packageDurationEl = document.getElementById('packageDuration');
        const packageIconEl = document.getElementById('packageIcon');
        const originalPriceEl = document.getElementById('originalPrice');
        const totalPriceEl = document.getElementById('packageTotalPrice');
        const discountAmountEl = document.getElementById('discountAmount');
        const discountRowEl = document.getElementById('discountRow');
        
        if (packageNameEl) packageNameEl.textContent = pkg.package_name;
        if (packageDurationEl) packageDurationEl.textContent = 
            pkg.duration_months === 1 ? '1 tháng' : 
            pkg.duration_months === 12 ? '1 năm' : 
            pkg.duration_months + ' tháng';
        
        // Set icon
        if (packageIconEl) packageIconEl.className = 'fa ' + pkg.icon;
        
        // Display prices
        if (originalPriceEl) originalPriceEl.textContent = this.formatPrice(pkg.original_price);
        if (totalPriceEl) totalPriceEl.textContent = this.formatPrice(pkg.price);
        
        // Show discount if applicable
        if (pkg.discount_percentage > 0) {
            const discountAmount = pkg.original_price - pkg.price;
            if (discountAmountEl) discountAmountEl.textContent = this.formatPrice(discountAmount);
            if (discountRowEl) discountRowEl.style.display = 'flex';
        }
    }

    // Format price
    formatPrice(price) {
        return price.toLocaleString('vi-VN') + '₫';
    }

    // Bind form events
    bindEvents() {
        // Payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', (e) => {
                this.selectPaymentMethod(e.currentTarget);
            });
        });

        // Form submission
        document.getElementById('paymentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    // Select payment method
    selectPaymentMethod(methodElement) {
        // Remove selected class from all methods
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Add selected class to clicked method
        methodElement.classList.add('selected');
        
        // Update radio button
        const radio = methodElement.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
        }
    }

    // Handle form submission
    async handleFormSubmission() {
        const payButton = document.getElementById('payButton');
        const btnText = payButton.querySelector('.btn-text');
        const spinner = payButton.querySelector('.loading-spinner');
        
        // Show loading state
        payButton.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'inline-block';
        
        try {
            // Validate form
            const formData = this.getFormData();
            if (!this.validateForm(formData)) {
                return;
            }

            // Create order
            const orderData = await this.orderManager.createOrder({
                ...formData,
                packageId: this.currentPackage.package_id,
                packageName: this.currentPackage.package_name,
                packagePrice: this.currentPackage.price,
                packageDuration: this.currentPackage.duration_months
            });

            // Generate VNPAY URL
            const vnpayUrl = await this.vnpayPayment.createPaymentUrl({
                orderId: orderData.orderId,
                amount: this.currentPackage.price,
                orderInfo: `Thanh toan goi hoi vien ${this.currentPackage.package_name}`
            });

            // Redirect to VNPAY
            window.location.href = vnpayUrl;

        } catch (error) {
            console.error('Payment error:', error);
            this.showError(error.message || 'Có lỗi xảy ra khi xử lý thanh toán');
        } finally {
            // Reset button state
            payButton.disabled = false;
            btnText.style.display = 'inline';
            spinner.style.display = 'none';
        }
    }

    // Get form data
    getFormData() {
        return {
            customerName: document.getElementById('customerName').value.trim(),
            customerEmail: document.getElementById('customerEmail').value.trim(),
            customerPhone: document.getElementById('customerPhone').value.trim(),
            customerAddress: document.getElementById('customerAddress').value.trim()
        };
    }

    // Validate form data
    validateForm(formData) {
        if (!formData.customerName) {
            this.showError('Vui lòng nhập họ và tên');
            return false;
        }

        if (!formData.customerEmail) {
            this.showError('Vui lòng nhập email');
            return false;
        }

        if (!this.isValidEmail(formData.customerEmail)) {
            this.showError('Email không hợp lệ');
            return false;
        }

        if (!formData.customerPhone) {
            this.showError('Vui lòng nhập số điện thoại');
            return false;
        }

        return true;
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show error message
    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
    }

    // Show success message
    showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        document.getElementById('errorMessage').style.display = 'none';
    }
}

// Export classes for use in other files
window.VNPAYPayment = VNPAYPayment;
window.FirebaseOrderManager = FirebaseOrderManager;
window.PaymentFormHandler = PaymentFormHandler; 