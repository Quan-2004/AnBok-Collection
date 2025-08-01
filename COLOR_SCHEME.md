# Bảng Màu Mới - Thư Viện Sách

## Tổng Quan
Đã cập nhật bảng màu cho trang web thư viện sách từ màu tím sang bảng màu xám xanh và cam nhạt, tạo cảm giác tinh tế và hiện đại hơn.

## Bảng Màu Chính

### Màu Chính
- **Xám xanh (#4A6366)** - Màu chính, tinh tế và hiện đại
- **Cam nhạt (#F4A261)** - Màu phụ, năng động và thu hút
- **Trắng tinh (#FFFFFF)** - Màu nền, sạch sẽ và tối giản
- **Xanh lá nhạt (#A8D5BA)** - Màu nhấn, tươi mới và sáng tạo
- **Đen nhạt (#2D2D2D)** - Màu chữ, đảm bảo độ tương phản tốt

### Màu Bổ Sung
- **Xám xanh nhạt (#6B7F82)** - Phiên bản nhạt hơn của màu chính
- **Xám xanh đậm (#3A4F52)** - Phiên bản đậm hơn của màu chính
- **Cam nhạt (#F7B580)** - Phiên bản nhạt hơn của màu phụ
- **Cam đậm (#E8944A)** - Phiên bản đậm hơn của màu phụ
- **Xanh lá nhạt (#C4E4D1)** - Phiên bản nhạt hơn của màu nhấn
- **Xanh lá đậm (#8BC4A3)** - Phiên bản đậm hơn của màu nhấn

## Cách Sử Dụng

### 1. Header & Navigation
- Navigation bar: Màu xám xanh chính (#4A6366)
- Menu items: Trắng với hover effect màu cam
- Logo: Màu xám xanh chính

### 2. Banner Section
- Background: Gradient từ xám xanh chính đến xám xanh đậm
- Buttons: Cam nhạt cho primary actions
- Text: Trắng với độ trong suốt khác nhau

### 3. Book Cards
- Background: Trắng tinh
- Borders: Xám nhạt (#E5E5E5)
- Titles: Đen nhạt (#2D2D2D)
- Prices: Cam nhạt cho giá khuyến mãi
- Categories: Xanh lá nhạt

### 4. Membership Packages
- Basic Package: Border xám, button xám xanh
- Premium Package: Gradient xám xanh, button trắng
- VIP Package: Border cam, button cam nhạt

### 5. Footer
- Background: Xám xanh chính
- Text: Trắng
- Links: Trắng với hover effect cam nhạt
- Icons: Cam nhạt

## File CSS
- **File chính**: `css/color-custom.css`
- **Thay thế**: `css/color-purple.css`
- **Cập nhật**: `index.html` để sử dụng file CSS mới

## Tính Năng Đặc Biệt

### 1. CSS Variables
Sử dụng CSS custom properties để dễ dàng quản lý màu sắc:
```css
:root {
    --primary-color: #4A6366;
    --secondary-color: #F4A261;
    --background-color: #FFFFFF;
    --accent-color: #A8D5BA;
    --text-color: #2D2D2D;
}x
```

### 2. Hover Effects
- Tất cả buttons có hiệu ứng hover với màu đậm hơn
- Cards có shadow effect khi hover
- Smooth transitions cho tất cả interactions

### 3. Responsive Design
- Màu sắc được tối ưu cho mobile devices
- Text contrast được đảm bảo trên mọi kích thước màn hình

### 4. Accessibility
- Độ tương phản cao giữa text và background
- Focus states rõ ràng với màu cam nhạt
- Color-blind friendly palette

## Lợi Ích

1. **Chuyên nghiệp hơn**: Màu xám xanh tạo cảm giác tin cậy và chuyên nghiệp
2. **Dễ đọc**: Độ tương phản tốt giữa text và background
3. **Hiện đại**: Bảng màu phù hợp với xu hướng thiết kế hiện đại
4. **Linh hoạt**: Dễ dàng mở rộng và thay đổi trong tương lai
5. **Branding**: Tạo identity riêng cho thư viện sách

## Cách Cập Nhật

Để thay đổi màu sắc trong tương lai, chỉ cần cập nhật các CSS variables trong file `css/color-custom.css`:

```css
:root {
    --primary-color: #NEW_COLOR;
    --secondary-color: #NEW_COLOR;
    /* ... */
}
```

Tất cả các elements sẽ tự động cập nhật theo màu mới. 