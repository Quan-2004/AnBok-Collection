// Synchronized Authentication System for AnBok
(function() {
    'use strict';
    
    // Global variables
    let isInitialized = false;
    let authStateListener = null;
    let currentUser = null;
    
    // Initialize synchronized authentication
    function initializeSyncAuth() {
        if (isInitialized) return;
        
        console.log('Initializing synchronized authentication system...');
        
        // Wait for Firebase to be available
        if (window.firebaseAuth) {
            setupFirebaseSync();
        } else {
            // Fallback to localStorage only
            console.log('Firebase not available, using localStorage only');
            setupLocalStorageSync();
        }
        
        isInitialized = true;
    }
    
    // Setup Firebase synchronization
    function setupFirebaseSync() {
        console.log('Setting up Firebase synchronization...');
        
        // Listen for auth state changes
        authStateListener = window.firebaseAuth.onAuthStateChanged((user) => {
            console.log('Firebase auth state changed:', user);
            currentUser = user;
            
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
                console.log('User data synchronized to localStorage:', userData);
                
                // Update UI
                updateAuthUI(userData);
                
                // Show success notification if this is a fresh login
                if (userData.lastLogin && isRecentLogin(userData.lastLogin)) {
                    showNotification('Đăng nhập thành công!', 'success');
                }
                
            } else {
                // User is signed out
                console.log('User signed out');
                localStorage.removeItem('user');
                updateAuthUI(null);
            }
        });
        
        // Check current auth state
        const currentFirebaseUser = window.firebaseAuth.currentUser;
        if (currentFirebaseUser) {
            console.log('Current Firebase user:', currentFirebaseUser);
            currentUser = currentFirebaseUser;
        }
    }
    
    // Setup localStorage synchronization (fallback)
    function setupLocalStorageSync() {
        console.log('Setting up localStorage synchronization...');
        
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
    
    // Synchronized logout function
    window.syncLogout = function() {
        console.log('Starting synchronized logout...');
        
        // Show loading state
        showNotification('Đang đăng xuất...', 'info');
        
        // Firebase logout if available
        if (window.firebaseAuth) {
            window.firebaseAuth.signOut().then(() => {
                console.log('Firebase sign out successful');
                completeSyncLogout();
            }).catch((error) => {
                console.error('Firebase sign out error:', error);
                // Still complete logout even if Firebase fails
                completeSyncLogout();
            });
        } else {
            // LocalStorage only logout
            completeSyncLogout();
        }
    };
    
               // Complete synchronized logout process
           function completeSyncLogout() {
               // Clear user data from localStorage
               localStorage.removeItem('user');
               console.log('User data cleared from localStorage');
               
               // Update UI immediately
               updateAuthUI(null);
               
               // Show success message
               showNotification('Đăng xuất thành công!', 'success');
               
               // Handle redirect based on current page
               const currentPath = window.location.pathname;
               if (currentPath.includes('auth.html')) {
                   // If we're on the auth page, redirect to home page
                   setTimeout(() => {
                       window.location.href = 'index.html';
                   }, 2000);
               } else if (currentPath.includes('profile.html')) {
                   // If we're on the profile page, redirect to auth page
                   setTimeout(() => {
                       window.location.href = '../auth.html';
                   }, 2000);
               } else if (currentPath.includes('account/')) {
                   // If we're in account section, redirect to auth page
                   setTimeout(() => {
                       window.location.href = '../auth.html';
                   }, 2000);
               } else {
                   // Default redirect to home page
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
        console.log('DOM loaded, initializing sync auth system...');
        initializeSyncAuth();
    });
    
    // Initialize when Firebase becomes available
    document.addEventListener('firebase-ready', function() {
        console.log('Firebase ready event received for sync auth');
        if (!isInitialized) {
            initializeSyncAuth();
        }
    });
    
    // Make functions globally available
    window.showNotification = showNotification;
    window.initializeSyncAuth = initializeSyncAuth;
    window.syncLogout = window.syncLogout;
    
    // Export for use in other files
    window.AnBokSyncAuth = {
        initializeSyncAuth,
        updateUserInfo,
        syncLogout,
        showNotification
    };
    
    console.log('Synchronized authentication system loaded');
    
})(); 