# Firebase Realtime Database Integration

## Overview
This project integrates Firebase Realtime Database to dynamically load and display book data in the book.html page.

## Features
- **Dynamic Book Loading**: Books are loaded from Firebase Realtime Database
- **Search Functionality**: Real-time search through book titles, authors, and descriptions
- **Filtering**: Filter books by category, price, author, and rating
- **Book Details Modal**: Click on any book to view detailed information
- **Responsive Design**: Works on all device sizes
- **Error Handling**: Graceful error handling with user-friendly messages

## Setup Instructions

### 1. Firebase Configuration
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Realtime Database
3. Update the `firebase-config.js` file with your Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 2. Database Structure
The Firebase Realtime Database should have the following structure:

```json
{
  "Sach": {
    "1": {
      "ma_sach": 1,
      "tieu_de": "Lão Hạc",
      "ma_tac_gia": "Nam Cao",
      "mo_ta": "Tiểu thuyết ngắn của Nam Cao...",
      "ma_danh_muc": "Văn học",
      "gia": 35000,
      "diem_tich_luy": 4.5,
      "mien_phi": false,
      "ngay_xuat_ban": "1943-01-01T00:00:00Z",
      "trang_thai": "available",
      "anh_bia": "https://example.com/images/lao-hac.jpg"
    }
  }
}
```

### 3. Database Rules
Set up Firebase Realtime Database rules for read access:

```json
{
  "rules": {
    "Sach": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

## Features Explained

### Book Loading
- Books are automatically loaded when the page loads
- Loading state is shown while fetching data
- Error handling for network issues

### Search Functionality
- Real-time search as you type
- Searches through title, author, and description
- Debounced search (500ms delay)

### Filtering
- Filter by category, price range, author, and rating
- Multiple filters can be applied simultaneously
- Clear filters button to reset all filters

### Book Details Modal
- Click "Xem chi tiết" to view book details
- Modal shows cover image, title, author, description
- Close with X button, clicking outside, or Escape key

## File Structure
```
├── book.html              # Main book page with Firebase integration
├── firebase-config.js     # Firebase configuration
├── FIREBASE_INTEGRATION.md # This documentation
└── anbok-collection-default-rtdb-export.json # Sample database export
```

## Functions

### Core Functions
- `loadBooksFromDatabase()`: Loads all books from Firebase
- `createBookCard(book)`: Creates HTML for a book card
- `searchBooks(query)`: Searches books by query
- `showBookDetails(bookId)`: Shows book details modal
- `applyFilters()`: Applies selected filters
- `addToWishlist(bookId)`: Adds book to wishlist

### Utility Functions
- `formatPrice(price)`: Formats price in Vietnamese currency
- `formatDate(dateString)`: Formats date in Vietnamese locale
- `generateStarRating(rating)`: Generates star rating HTML

## Error Handling
- Network errors show retry button
- Empty results show appropriate messages
- Loading states for all async operations
- Graceful fallbacks for missing data

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement

## Security Considerations
- Read-only access to book data
- No sensitive information in client-side code
- Input validation and sanitization
- XSS protection through proper HTML escaping

## Performance Optimizations
- Debounced search to reduce API calls
- Lazy loading of images
- Efficient DOM manipulation
- Minimal re-renders

## Troubleshooting

### Common Issues
1. **Books not loading**: Check Firebase configuration and database rules
2. **Search not working**: Verify database structure and field names
3. **Modal not showing**: Check for JavaScript errors in console
4. **Images not loading**: Verify image URLs in database

### Debug Mode
Add this to enable debug logging:
```javascript
// Enable Firebase debug mode
localStorage.setItem('firebase:debug', '*');
```

## Future Enhancements
- User authentication integration
- Wishlist functionality with user accounts
- Book reviews and ratings
- Advanced filtering options
- Pagination for large datasets
- Offline support with service workers 