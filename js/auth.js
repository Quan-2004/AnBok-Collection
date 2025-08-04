// Authentication System for AnBok - Synchronized Version
(function() {
    'use strict';
    
    // Global variables
    let isInitialized = false;
    let authStateListener = null;
    
    // Initialize authentication system
    function initializeAuth() {
        if (isInitialized) return;
        
        console.log('Initializing authentication system...');
        
        // Wait for Firebase to be available
        if (window.firebaseAuth) {
            setupFirebaseAuth();
        } else {
            // Fallback to localStorage only
            console.log('Firebase not available, using localStorage only');
            setupLocalStorageAuth();
        }
        
        isInitialized = true;
    }
    
    // Setup Firebase authentication
    function setupFirebaseAuth() {
        console.log('Setting up Firebase authentication...');
        
        // Listen for auth state changes
        authStateListener = window.firebaseAuth.onAuthStateChanged((user) => {
            console.log('Firebase auth state changed:', user);
            
            if (user) {
                // User is signed in
                const userData = {
                    isLoggedIn: true,
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || user.email,
                    photoURL: user.photoURL,
                    lastLogin: new Date().toISOString()
                };
                
                // Save to localStorage
                localStorage.setItem('user', JSON.stringify(userData));
                console.log('User data saved to localStorage:', userData);
                
                // Update UI
                updateAuthUI(userData);
                
            } else {
                // User is signed out
                console.log('User signed out');
                localStorage.removeItem('user');
                updateAuthUI(null);
            }
        });
        
        // Check current auth state
        const currentUser = window.firebaseAuth.currentUser;
        if (currentUser) {
            console.log('Current Firebase user:', currentUser);
        }
    }
    
    // Setup localStorage only authentication (fallback)
    function setupLocalStorageAuth() {
        console.log('Setting up localStorage authentication...');
        
        // Check existing user data
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        if (userData && userData.isLoggedIn) {
            console.log('Found existing user data:', userData);
            updateAuthUI(userData);
        } else {
            console.log('No existing user data found');
            updateAuthUI(null);
        }
    }
    
    // Update authentication UI
    function updateAuthUI(userData) {
        const authButtons = document.querySelector('.tg-auth-buttons');
        const userProfile = document.querySelector('.tg-user-profile');
        
        console.log('Updating auth UI with user data:', userData);
        
        if (userData && userData.isLoggedIn) {
            // User is logged in
            console.log('Showing user profile, hiding auth buttons');
            
            if (authButtons) {
                authButtons.style.display = 'none';
            }
            
            if (userProfile) {
                userProfile.style.display = 'block';
                updateUserInfo(userData);
            }
            
            // Show success notification if this is a fresh login
            if (userData.lastLogin && isRecentLogin(userData.lastLogin)) {
                showNotification('Đăng nhập thành công!', 'success');
            }
            
        } else {
            // User is not logged in
            console.log('Showing auth buttons, hiding user profile');
            
            if (authButtons) {
                authButtons.style.display = 'block';
            }
            
            if (userProfile) {
                userProfile.style.display = 'none';
            }
        }
    }
    
    // Check if login was recent (within last 5 seconds)
    function isRecentLogin(lastLogin) {
        const loginTime = new Date(lastLogin);
        const now = new Date();
        const diffSeconds = (now - loginTime) / 1000;
        return diffSeconds < 5;
    }
    
    // Check authentication status (synchronized)
    function checkAuthStatus() {
        console.log('Checking synchronized auth status...');
        
        if (!isInitialized) {
            initializeAuth();
            return;
        }
        
        // If Firebase is available, let it handle the auth state
        if (window.firebaseAuth) {
            console.log('Firebase auth is handling state');
            return;
        }
        
        // Fallback to localStorage check
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        console.log('LocalStorage auth check:', userData);
        updateAuthUI(userData);
    }
    
    // Update user information display
    function updateUserInfo(user) {
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        const dropdownUserName = document.getElementById('dropdownUserName');
        const dropdownUserEmail = document.getElementById('dropdownUserEmail');
        const dropdownUserAvatar = document.getElementById('dropdownUserAvatar');
        
        console.log('Updating user info display:', user);
        
        if (userName) {
            userName.textContent = user.displayName || user.email || 'Người dùng';
        }
        
        if (dropdownUserName) {
            dropdownUserName.textContent = user.displayName || user.email || 'Người dùng';
        }
        
        if (dropdownUserEmail) {
            dropdownUserEmail.textContent = user.email || '';
        }
        
        // Update avatar if user has one
        if (user.photoURL) {
            if (userAvatar) userAvatar.src = user.photoURL;
            if (dropdownUserAvatar) dropdownUserAvatar.src = user.photoURL;
        } else {
            // Use default avatar
            const defaultAvatar = '../images/users/img-01.jpg';
            if (userAvatar) userAvatar.src = defaultAvatar;
            if (dropdownUserAvatar) dropdownUserAvatar.src = defaultAvatar;
        }
    }
    
    // Setup user dropdown functionality
    function setupUserDropdown() {
        const userDropdown = document.querySelector('.tg-user-dropdown');
        
        if (userDropdown) {
            console.log('Setting up user dropdown functionality');
            
            // Hover effects for dropdown items
            const dropdownItems = document.querySelectorAll('.tg-dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.background = '#f8f9fa';
                });
                item.addEventListener('mouseleave', function() {
                    this.style.background = 'transparent';
                });
            });
        }
    }
    
    // Synchronized logout function
    window.logout = function() {
        console.log('Starting synchronized logout...');
        
        // Show loading state
        showNotification('Đang đăng xuất...', 'info');
        
        // Firebase logout if available
        if (window.firebaseAuth) {
            window.firebaseAuth.signOut().then(() => {
                console.log('Firebase sign out successful');
                completeLogout();
            }).catch((error) => {
                console.error('Firebase sign out error:', error);
                // Still complete logout even if Firebase fails
                completeLogout();
            });
        } else {
            // LocalStorage only logout
            completeLogout();
        }
    };
    
    // Complete logout process
    function completeLogout() {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        console.log('User data cleared from localStorage');
        
        // Update UI immediately
        updateAuthUI(null);
        
        // Show success message
        showNotification('Đăng xuất thành công!', 'success');
        
        // If we're on the auth page, redirect to home page
        if (window.location.pathname.includes('auth.html')) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
    
    // Show notification function
    function showNotification(message, type = 'info') {
        console.log(`Showing notification: ${message} (${type})`);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `tg-notification tg-notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
            padding: 12px 16px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 10000;
            border-left: 3px solid #4A6366;
            font-size: 13px;
            max-width: 300px;
            min-width: 250px;
        `;
        
        // Set border color based on type
        if (type === 'success') {
            notification.style.borderLeftColor = '#28a745';
        } else if (type === 'error') {
            notification.style.borderLeftColor = '#dc3545';
        } else if (type === 'info') {
            notification.style.borderLeftColor = '#17a2b8';
        }
        
        notification.innerHTML = `
            <div class="tg-notification-content" style="display: flex; align-items: center; gap: 8px;">
                <i class="fa ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}" style="font-size: 16px; flex-shrink: 0; color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};"></i>
                <span style="font-size: 13px; line-height: 1.4; color: #333;">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, initializing auth system...');
        initializeAuth();
        setupUserDropdown();
    });
    
    // Initialize when Firebase becomes available
    document.addEventListener('firebase-ready', function() {
        console.log('Firebase ready event received');
        if (!isInitialized) {
            initializeAuth();
        }
    });
    
    // Make functions globally available
    window.showNotification = showNotification;
    window.checkAuthStatus = checkAuthStatus;
    window.initializeAuth = initializeAuth;
    
    // Export for use in other files
    window.AnBokAuth = {
        checkAuthStatus,
        updateUserInfo,
        setupUserDropdown,
        logout,
        showNotification,
        initializeAuth
    };
    
    console.log('Authentication system loaded');
    
})(); 