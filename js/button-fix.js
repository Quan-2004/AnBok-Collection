// Button Fix System for AnBok Collection
(function() {
    'use strict';
    
    console.log('Button fix system loaded');
    
    // Global logout function that works everywhere
    window.logout = function() {
        console.log('Logout button clicked');
        
        // Direct logout without confirmation
        console.log('User confirmed logout');
        
        // Show loading state
        showLoadingState();
        
        // Use synchronized logout if available
        if (window.syncLogout) {
            console.log('Using sync logout');
            window.syncLogout();
        } else if (window.firebaseAuth) {
            console.log('Using Firebase logout');
            // Firebase logout
            window.firebaseAuth.signOut().then(() => {
                console.log('Firebase sign out successful');
                completeLogout();
            }).catch((error) => {
                console.error('Firebase sign out error:', error);
                completeLogout();
            });
        } else {
            console.log('Using localStorage logout');
            completeLogout();
        }
    };
    
    // Complete logout process
    function completeLogout() {
        console.log('Completing logout process');
        
        // Clear user data from localStorage
        localStorage.removeItem('user');
        console.log('User data cleared from localStorage');
        
        // Update UI immediately
        updateAuthUI(null);
        
        // Show success message
        showNotification('Đăng xuất thành công!', 'success');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
            const currentPath = window.location.pathname;
            if (currentPath.includes('auth.html')) {
                window.location.href = 'index.html';
            } else if (currentPath.includes('account/')) {
                window.location.href = '../index.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
    }
    
    // Show loading state
    function showLoadingState() {
        console.log('Showing loading state');
        
        // Find all logout buttons and show loading
        const logoutButtons = document.querySelectorAll('[onclick*="logout"]');
        logoutButtons.forEach(button => {
            const originalContent = button.innerHTML;
            button.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Đang đăng xuất...';
            button.style.pointerEvents = 'none';
            button.dataset.originalContent = originalContent;
        });
    }
    
    // Update authentication UI
    function updateAuthUI(userData) {
        console.log('Updating auth UI:', userData);
        
        const authButtons = document.querySelector('.tg-auth-buttons');
        const userProfile = document.querySelector('.tg-user-profile');
        
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
    
    // Update user information display
    function updateUserInfo(user) {
        console.log('Updating user info:', user);
        
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        const dropdownUserName = document.getElementById('dropdownUserName');
        const dropdownUserEmail = document.getElementById('dropdownUserEmail');
        const dropdownUserAvatar = document.getElementById('dropdownUserAvatar');
        
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
    
    // Auth page specific logout function
    window.logoutFromAuthPage = function() {
        console.log('Logout from auth page clicked');
        
        // Show loading state
        showLoadingState();
        
        // Clear user data from localStorage
        localStorage.removeItem('user');
        console.log('User data cleared from localStorage');
        
        // Firebase logout if available
        if (window.firebaseAuth) {
            window.firebaseAuth.signOut().then(() => {
                console.log('Firebase sign out successful');
                showNotification('Đăng xuất thành công!', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }).catch((error) => {
                console.error('Firebase sign out error:', error);
                showNotification('Đăng xuất thành công!', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            });
        } else {
            showNotification('Đăng xuất thành công!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    };
    
    // Profile page specific logout function
    window.logoutFromProfile = function() {
        console.log('Logout from profile page clicked');
        
        // Direct logout without confirmation
        console.log('User confirmed logout from profile');
        
        // Show loading state
        showLoadingState();
        
        // Use synchronized logout if available
        if (window.syncLogout) {
            console.log('Using sync logout from profile');
            window.syncLogout();
            // Override redirect for profile page
            setTimeout(() => {
                window.location.href = '../auth.html';
            }, 1500);
        } else if (window.firebaseAuth) {
            console.log('Using Firebase logout from profile');
            // Firebase logout
            window.firebaseAuth.signOut().then(() => {
                console.log('Firebase sign out successful from profile');
                completeProfileLogout();
            }).catch((error) => {
                console.error('Firebase sign out error from profile:', error);
                completeProfileLogout();
            });
        } else {
            console.log('Using localStorage logout from profile');
            completeProfileLogout();
        }
    };
    
    // Complete profile logout process
    function completeProfileLogout() {
        console.log('Completing profile logout process');
        
        // Clear user data from localStorage
        localStorage.removeItem('user');
        console.log('User data cleared from localStorage');
        
        // Update UI immediately
        updateAuthUI(null);
        
        // Show success message
        showNotification('Đăng xuất thành công!', 'success');
        
        // Redirect to auth page
        setTimeout(() => {
            window.location.href = '../auth.html';
        }, 1500);
    }
    
    // Test logout function for debugging
    window.testLogout = function() {
        console.log('Test logout function called');
        showNotification('Test logout function', 'info');
    };
    
    // Initialize button event listeners
    function initializeButtons() {
        console.log('Initializing button event listeners');
        
        // Add click event listeners to all logout buttons with class
        const logoutButtons = document.querySelectorAll('.logout-btn');
        logoutButtons.forEach(button => {
            console.log('Found logout button with class:', button);
            
            // Remove any existing onclick
            button.removeAttribute('onclick');
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Logout button clicked via event listener');
                logout();
            });
        });
        
        // Add click event listeners to auth page logout button
        const authLogoutButtons = document.querySelectorAll('.auth-logout-btn');
        authLogoutButtons.forEach(button => {
            console.log('Found auth page logout button:', button);
            
            // Remove any existing onclick
            button.removeAttribute('onclick');
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Auth page logout button clicked via event listener');
                logoutFromAuthPage();
            });
        });
        
        // Add click event listeners to profile page logout button
        const profileLogoutButtons = document.querySelectorAll('.logout-btn');
        profileLogoutButtons.forEach(button => {
            console.log('Found profile page logout button:', button);
            
            // Remove any existing onclick
            button.removeAttribute('onclick');
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Profile page logout button clicked via event listener');
                
                // Check if we're on profile page
                if (window.location.pathname.includes('profile.html')) {
                    logoutFromProfile();
                } else {
                    logout();
                }
            });
        });
        
        // Also handle any remaining onclick buttons for backward compatibility
        const onclickLogoutButtons = document.querySelectorAll('[onclick*="logout"]');
        onclickLogoutButtons.forEach(button => {
            console.log('Found logout button with onclick:', button);
            
            // Remove existing onclick and add event listener
            button.removeAttribute('onclick');
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Logout button clicked via event listener (onclick fallback)');
                logout();
            });
        });
        
        const onclickAuthLogoutButtons = document.querySelectorAll('[onclick*="logoutFromAuthPage"]');
        onclickAuthLogoutButtons.forEach(button => {
            console.log('Found auth page logout button with onclick:', button);
            
            // Remove existing onclick and add event listener
            button.removeAttribute('onclick');
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Auth page logout button clicked via event listener (onclick fallback)');
                logoutFromAuthPage();
            });
        });
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, initializing buttons');
        initializeButtons();
    });
    
    // Also initialize after a short delay to catch dynamically added buttons
    setTimeout(initializeButtons, 1000);
    
    // Make functions globally available
    window.showNotification = showNotification;
    window.updateAuthUI = updateAuthUI;
    window.updateUserInfo = updateUserInfo;
    
    console.log('Button fix system initialized');
    
})(); 