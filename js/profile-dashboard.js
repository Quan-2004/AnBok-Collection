// Profile Dashboard Management
$(document).ready(function() {
    // Load profile data from Firebase
    window.loadProfileData = function(userProfile) {
        if (!userProfile || !userProfile.personalInfo) return;
        
        const personalInfo = userProfile.personalInfo;
        
        // Update form fields
        $('input[name="username"]').val(personalInfo.username || '');
        $('input[name="userId"]').val(personalInfo.userId || '');
        $('input[name="fullName"]').val(personalInfo.fullName || '');
        $('input[name="dateOfBirth"]').val(personalInfo.dateOfBirth || '');
        $('select[name="gender"]').val(personalInfo.gender || 'Khác');
        $('input[name="phone"]').val(personalInfo.phone || '');
        $('input[name="address"]').val(personalInfo.address || '');
        
        // Update user display name in sidebar
        $('.tg-user-info h3').text(personalInfo.fullName || userProfile.displayName || 'User');
        
        // Update avatar if available
        if (userProfile.photoURL) {
            $('.tg-user-avatar img, .tg-avatar-large img').attr('src', userProfile.photoURL);
        }
        
        console.log('Profile data loaded into form');
    };

    // Save profile data to Firebase
    window.saveProfileData = async function() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.uid) {
            showNotification('Vui lòng đăng nhập để lưu thông tin!', 'error');
            return false;
        }

        const profileData = {
            personalInfo: {
                username: $('input[name="username"]').val(),
                userId: $('input[name="userId"]').val(),
                fullName: $('input[name="fullName"]').val(),
                dateOfBirth: $('input[name="dateOfBirth"]').val(),
                gender: $('select[name="gender"]').val(),
                phone: $('input[name="phone"]').val(),
                address: $('input[name="address"]').val()
            }
        };

        try {
            const success = await window.updateUserProfile(user.uid, profileData);
            if (success) {
                // Update localStorage
                const updatedUser = { ...user, profile: { ...user.profile, ...profileData } };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // Update display name
                $('.tg-user-info h3').text(profileData.personalInfo.fullName || user.displayName);
                
                showNotification('Thông tin đã được cập nhật thành công!', 'success');
                return true;
            } else {
                showNotification('Có lỗi xảy ra khi lưu thông tin!', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            showNotification('Có lỗi xảy ra khi lưu thông tin!', 'error');
            return false;
        }
    };

    // Sidebar Navigation
    $('.tg-profile-nav a').on('click', function(e) {
        e.preventDefault();
        
        const targetSection = $(this).data('tab');
        
        // Remove active class from all nav items
        $('.tg-profile-nav li').removeClass('active');
        $('.tg-content-section').removeClass('active');
        
        // Add active class to clicked item
        $(this).parent().addClass('active');
        $('#' + targetSection).addClass('active');
    });
    
    // Tab Navigation
    $('.tg-tab-btn').on('click', function(e) {
        e.preventDefault();
        
        const targetTab = $(this).data('tab');
        
        // Remove active class from all tabs
        $('.tg-tab-btn').removeClass('active');
        $('.tg-tab-panel').removeClass('active');
        
        // Add active class to clicked tab
        $(this).addClass('active');
        $('#' + targetTab).addClass('active');
    });
    
    // Action Buttons
    $('.tg-btn-membership').on('click', function() {
        showNotification('Chuyển đến trang đăng ký hội viên...', 'info');
        // Chuyển hướng đến trang membership sau 1 giây
        setTimeout(function() {
            window.location.href = 'menbership.html';
        }, 1000);
    });
    
    // Form Actions
    $('.tg-btn-update').on('click', async function() {
        const success = await window.saveProfileData();
        if (success) {
            // Success notification is already shown in saveProfileData
        }
    });
    
    $('.tg-btn-cancel').on('click', function() {
        // Load original data from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.profile) {
            window.loadProfileData(user.profile);
        }
        showNotification('Đã hủy thay đổi!', 'info');
    });
    
    // Change Photo Button
    $('.tg-btn-change-photo').on('click', function() {
        // Create file input
        const fileInput = $('<input type="file" accept="image/*" style="display: none;">');
        $('body').append(fileInput);
        
        fileInput.on('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    $('.tg-avatar-large img, .tg-user-avatar img').attr('src', e.target.result);
                    showNotification('Ảnh đã được cập nhật!', 'success');
                };
                reader.readAsDataURL(file);
            }
            fileInput.remove();
        });
        
        fileInput.click();
    });
    
    // Date Input Calendar Icon
    $('.tg-date-input i').on('click', function() {
        $(this).siblings('input').focus();
        showNotification('Vui lòng nhập ngày sinh theo định dạng DD/MM/YYYY', 'info');
    });
    
    // Form Validation
    $('.tg-form-group input, .tg-form-group select').on('blur', function() {
        const $input = $(this);
        const value = $input.val().trim();
        
        if ($input.attr('type') === 'text' && !$input.prop('readonly')) {
            if (value === '') {
                $input.css('border-color', '#dc3545');
            } else {
                $input.css('border-color', '#4A6366');
            }
        }
    });
    
    // Hover Effects for Navigation
    $('.tg-profile-nav a').hover(
        function() {
            $(this).find('i').addClass('fa-bounce');
        },
        function() {
            $(this).find('i').removeClass('fa-bounce');
        }
    );
    
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();
    
    // Auto-save functionality
    let autoSaveTimer;
    $('.tg-form-group input, .tg-form-group select').on('input change', function() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(function() {
            // Auto-save after 3 seconds of inactivity
            window.saveProfileData();
        }, 3000);
    });
    
    // Load profile data when page loads
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.profile) {
        window.loadProfileData(user.profile);
    }
});

// Enhanced notification function for profile dashboard
function showNotification(message, type = 'info') {
    const notification = $(`
        <div class="tg-notification tg-notification-${type}">
            <div class="tg-notification-content">
                <i class="fa fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        </div>
    `);
    
    $('body').append(notification);
    
    // Animate in
    setTimeout(() => {
        notification.addClass('show');
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.removeClass('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
} 