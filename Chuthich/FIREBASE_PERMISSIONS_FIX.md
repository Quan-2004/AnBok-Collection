# Firebase Permission Denied Fix

## Problem
You're getting a "Permission denied" error when trying to access the Firebase Realtime Database. This happens because the current security rules don't allow read access to the `Sach` (books) collection.

## Solution

### Option 1: Update Firebase Security Rules (Recommended)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `anbok-collection`

2. **Navigate to Realtime Database**
   - Click on "Realtime Database" in the left sidebar
   - Click on the "Rules" tab

3. **Update the Rules**
   - Replace the current rules with the content from `firebase-rules.json`
   - Or use these rules:

```json
{
  "rules": {
    "Sach": {
      ".read": "auth != null || true",
      ".write": "auth != null"
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "orders": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "wishlist": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

4. **Publish the Rules**
   - Click "Publish" to save the changes

### Option 2: Temporary Demo Mode (Already Implemented)

The code now includes a demo mode that shows sample books when:
- User is not authenticated
- Firebase permissions are not set correctly

This allows the app to work immediately while you fix the Firebase rules.

## What the Rules Do

- **Books (`Sach`)**: Anyone can read, only authenticated users can write
- **Users**: Users can only access their own data
- **Orders**: Users can only access their own orders
- **Wishlist**: Users can only access their own wishlist

## Testing

After updating the rules:
1. Refresh your page
2. The books should load from the real database
3. You can search and view book details
4. All functionality should work properly

## Security Notes

- The current rules allow public read access to books
- This is appropriate for a book library where you want anyone to browse books
- User-specific data (orders, wishlist) remains secure
- Only authenticated users can write to the database 