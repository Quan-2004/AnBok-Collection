// Profile Loader for Firebase Integration
(function() {
    'use strict';
    
    // Update user profile UI elements
    function updateUserProfileUI(userProfile) {
        console.log('Updating user profile UI with:', userProfile);
        
        // Get UI elements
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        const dropdownUserName = document.getElementById('dropdownUserName');
        const dropdownUserEmail = document.getElementById('dropdownUserEmail');
        const dropdownUserAvatar = document.getElementById('dropdownUserAvatar');
        
        if (!userProfile) {
            console.log('No user profile provided for UI update');
            return;
        }
        
        // Get personal info from Firebase data
        const personalInfo = userProfile.personalInfo || {};
        const displayName = personalInfo.fullName || userProfile.displayName || 'User';
        const email = userProfile.email || '';
        const photoURL = userProfile.photoURL || '';
        
        console.log('Updating UI with:', { displayName, email, photoURL });
        
        // Update user name
        if (userName) {
            userName.textContent = displayName;
        }
        if (dropdownUserName) {
            dropdownUserName.textContent = displayName;
        }
        
        // Update user email
        if (dropdownUserEmail) {
            dropdownUserEmail.textContent = email;
        }
        
        // Update user avatar
        if (photoURL) {
            // Check if it's a valid URL
            if (photoURL.startsWith('http') || photoURL.startsWith('https')) {
                if (userAvatar) userAvatar.src = photoURL;
                if (dropdownUserAvatar) dropdownUserAvatar.src = photoURL;
            } else {
                // Use default avatar for invalid URLs
                const defaultAvatar = 'images/users/img-01.jpg';
                if (userAvatar) userAvatar.src = defaultAvatar;
                if (dropdownUserAvatar) dropdownUserAvatar.src = defaultAvatar;
            }
        } else {
            // Use default avatar if no photo URL
            const defaultAvatar = 'images/users/img-01.jpg';
            if (userAvatar) userAvatar.src = defaultAvatar;
            if (dropdownUserAvatar) dropdownUserAvatar.src = defaultAvatar;
        }
        
        console.log('User profile UI updated successfully');
    }
    
    // Load user profile from Firebase
    async function loadUserProfileFromFirebase() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.uid) {
                console.log('No user found in localStorage');
                return;
            }
            
            console.log('Loading user profile for:', user.uid);
            
            // Try to load from localStorage first
            let userProfile = null;
            
            // Check if loadUserProfile function exists (from profile.html)
            if (window.loadUserProfile) {
                userProfile = window.loadUserProfile(user.uid);
            } else {
                // Try to get from localStorage directly
                try {
                    userProfile = JSON.parse(localStorage.getItem('userProfile_' + user.uid));
                } catch (error) {
                    console.log('No user profile found in localStorage');
                }
            }
            
            if (userProfile) {
                console.log('User profile loaded from localStorage:', userProfile);
                updateUserProfileUI(userProfile);
                
                // Call loadProfileData if it exists (for profile.html)
                if (window.loadProfileData) {
                    window.loadProfileData(userProfile);
                }
            } else {
                console.log('No user profile found in localStorage, creating default profile');
                // Create default profile if none exists
                const userInfo = {
                    email: user.email,
                    displayName: user.displayName || user.email,
                    photoURL: user.photoURL || ''
                };
                
                // Create a basic profile object
                const defaultProfile = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || user.email,
                    photoURL: user.photoURL || '',
                    personalInfo: {
                        fullName: user.displayName || user.email,
                        username: user.email ? user.email.split('@')[0] : 'user'
                    }
                };
                
                // Save to localStorage
                localStorage.setItem('userProfile_' + user.uid, JSON.stringify(defaultProfile));
                
                // Update UI with default profile
                updateUserProfileUI(defaultProfile);
                
                // Call createDefaultProfile if it exists (for profile.html)
                if (window.createDefaultProfile) {
                    await window.createDefaultProfile(user.uid, userInfo);
                }
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }
    
    // Listen for user profile loaded event
    document.addEventListener('user-profile-loaded', function(event) {
        const { user, userProfile } = event.detail;
        console.log('User profile loaded event received:', userProfile);
        
        if (userProfile) {
            updateUserProfileUI(userProfile);
            
            // Call loadProfileData if it exists (for profile.html)
            if (window.loadProfileData) {
                window.loadProfileData(userProfile);
            }
        }
    });
    
    // Listen for Firebase ready event
    document.addEventListener('firebase-ready', function(event) {
        console.log('Firebase ready event received');
        // Load user profile when Firebase is ready
        loadUserProfileFromFirebase();
    });
    
    // Load profile when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM ready, loading user profile...');
        // Wait a bit for Firebase to initialize
        setTimeout(() => {
            loadUserProfileFromFirebase();
        }, 1000);
    });
    
    // Also try to load immediately
    if (document.readyState === 'loading') {
        // Document is still loading
        document.addEventListener('DOMContentLoaded', loadUserProfileFromFirebase);
    } else {
        // Document is already loaded
        loadUserProfileFromFirebase();
    }
    
    // Make functions globally available
    window.loadUserProfileFromFirebase = loadUserProfileFromFirebase;
    window.updateUserProfileUI = updateUserProfileUI;
    
})(); 