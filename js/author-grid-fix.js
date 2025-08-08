// Author Grid Layout Fix
// Sửa lỗi layout grid cho author cards

document.addEventListener('DOMContentLoaded', function() {
    // Fix author grid layout
    fixAuthorGridLayout();
    
    // Add responsive behavior
    window.addEventListener('resize', fixAuthorGridLayout);
});

function fixAuthorGridLayout() {
    const authorSection = document.querySelector('.tg-sectionspace');
    if (!authorSection) return;
    
    const row = authorSection.querySelector('.row');
    if (!row) return;
    
    // Apply flexbox layout
    row.style.display = 'flex';
    row.style.flexWrap = 'wrap';
    row.style.margin = '0 -15px';
    
    // Fix column layout
    const columns = row.querySelectorAll('.col-xs-12, .col-sm-6, .col-md-4, .col-lg-3');
    columns.forEach(col => {
        col.style.padding = '0 15px';
        col.style.marginBottom = '30px';
        
        // Set width based on screen size
        const width = getColumnWidth();
        col.style.width = width;
    });
    
    // Fix card heights
    const cards = row.querySelectorAll('.tg-author-card');
    cards.forEach(card => {
        card.style.height = '100%';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        
        const authorInfo = card.querySelector('.tg-author-info');
        if (authorInfo) {
            authorInfo.style.flex = '1';
            authorInfo.style.display = 'flex';
            authorInfo.style.flexDirection = 'column';
            
            const button = authorInfo.querySelector('.tg-btn');
            if (button) {
                button.style.marginTop = 'auto';
            }
        }
    });
}

function getColumnWidth() {
    const width = window.innerWidth;
    
    if (width < 768) {
        return '100%'; // Mobile: 1 column
    } else if (width < 992) {
        return '50%'; // Tablet: 2 columns
    } else if (width < 1200) {
        return '33.333333%'; // Small desktop: 3 columns
    } else {
        return '25%'; // Large desktop: 4 columns
    }
}

// Add hover effects
function addHoverEffects() {
    const cards = document.querySelectorAll('.tg-author-card');
    const buttons = document.querySelectorAll('.author-detail-btn');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
            
            const avatar = this.querySelector('.tg-author-avatar');
            if (avatar) {
                avatar.style.borderColor = '#4A6366';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            
            const avatar = this.querySelector('.tg-author-avatar');
            if (avatar) {
                avatar.style.borderColor = '#F4A261';
            }
        });
    });
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(74, 99, 102, 0.3)';
            this.style.background = 'linear-gradient(135deg, #3A4F52 0%, #2A3F42 100%)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
            this.style.background = 'linear-gradient(135deg, #4A6366 0%, #3A4F52 100%)';
        });
    });
}

// Initialize hover effects
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addHoverEffects, 100);
}); 