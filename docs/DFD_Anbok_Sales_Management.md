
# DFD Luồng dữ liệu - Quản lý Mua bán Sách và Truyện (Anbok)

Tài liệu này mô tả Luồng dữ liệu (Data Flow Diagram - DFD) cho hệ thống con "Quản trị mua bán sách và truyện" của dự án Anbok ở các mức 0, 1 và 2.

**Lưu ý:** Các biểu đồ được viết bằng cú pháp Mermaid. Bạn có thể sao chép mã trong các khối ```mermaid ... ``` và dán vào các trình chỉnh sửa hỗ trợ (như VS Code với plugin, Obsidian) hoặc import vào Draw.io/diagrams.net qua menu `Arrange > Insert > Advanced > Mermaid...`.

---

## DFD Mức 0 - Sơ đồ Ngữ cảnh (Context Diagram)

Sơ đồ mức 0 thể hiện toàn bộ hệ thống như một tiến trình duy nhất và cho thấy các luồng dữ liệu chính giữa hệ thống với các tác nhân bên ngoài.

**Tác nhân bên ngoài:**
*   **Admin:** Quản trị viên hệ thống.
*   **Khách hàng:** Người dùng cuối mua và đọc sách/truyện.
*   **Tác giả:** Người cung cấp nội dung sách/truyện.
*   **Hệ thống Thanh toán:** Cổng thanh toán bên thứ ba (ví dụ: VNPay).

```mermaid
graph TD
    subgraph DFD Mức 0
        P0("
        Hệ thống Quản lý<br>
        Mua bán Sách/Truyện Anbok
        ")
    end

    Admin -->|Yêu cầu quản lý & Báo cáo| P0
    P0 -->|Báo cáo & Thông tin sản phẩm| Admin

    KhachHang("Khách hàng") -->|Thông tin cá nhân & Yêu cầu mua hàng| P0
    P0 -->|Thông tin sách & Xác nhận đơn hàng| KhachHang

    TacGia("Tác giả") -->|Nội dung sách/truyện| P0
    P0 -->|Thống kê doanh thu & Nhuận bút| TacGia

    P0 -- "Yêu cầu xử lý thanh toán" --> HeThongThanhToan("Hệ thống<br>Thanh toán")
    HeThongThanhToan -- "Kết quả giao dịch" --> P0
```

---

## DFD Mức 1 - Sơ đồ Tổng quan (Overview Diagram)

Sơ đồ mức 1 phân rã tiến trình chính ở mức 0 thành các tiến trình con, thể hiện luồng dữ liệu giữa các tiến trình này và các kho dữ liệu (Data Store).

**Các tiến trình chính:**
1.  **Quản lý Sản phẩm:** Thêm, xóa, sửa sách/truyện.
2.  **Quản lý Người dùng:** Quản lý thông tin khách hàng, tác giả.
3.  **Xử lý Đơn hàng:** Tiếp nhận và xử lý yêu cầu mua hàng từ khách.
4.  **Xử lý Thanh toán:** Tích hợp với cổng thanh toán để xác nhận giao dịch.
5.  **Báo cáo & Thống kê:** Tạo báo cáo doanh thu, nhuận bút.

**Kho dữ liệu:**
*   **D1:** Dữ liệu Sách/Truyện
*   **D2:** Dữ liệu Người dùng (Khách hàng, Tác giả)
*   **D3:** Dữ liệu Đơn hàng
*   **D4:** Dữ liệu Giao dịch

```mermaid
graph TD
    subgraph DFD Mức 1
        P1("1.0<br>Quản lý<br>Sản phẩm")
        P2("2.0<br>Quản lý<br>Người dùng")
        P3("3.0<br>Xử lý<br>Đơn hàng")
        P4("4.0<br>Xử lý<br>Thanh toán")
        P5("5.0<br>Báo cáo &<br>Thống kê")

        D1[("D1<br>Dữ liệu<br>Sách/Truyện")]
        D2[("D2<br>Dữ liệu<br>Người dùng")]
        D3[("D3<br>Dữ liệu<br>Đơn hàng")]
        D4[("D4<br>Dữ liệu<br>Giao dịch")]

        %% Flows
        Admin -->|Yêu cầu quản lý sách| P1
        TacGia("Tác giả") -->|Nội dung| P1
        P1 -->|Cập nhật dữ liệu sách| D1
        D1 -->|Thông tin sản phẩm| P1

        Admin -->|Yêu cầu quản lý người dùng| P2
        KhachHang("Khách hàng") -->|Thông tin đăng ký| P2
        TacGia -->|Thông tin đăng ký| P2
        P2 -->|Cập nhật dữ liệu người dùng| D2

        KhachHang -->|Yêu cầu mua hàng| P3
        P3 -->|Tạo đơn hàng mới| D3
        D3 -->|Thông tin đơn hàng| P3
        D1 -->|Thông tin sách cho đơn hàng| P3
        P3 -->|Thông tin đơn hàng cần thanh toán| P4
        P3 -->|Xác nhận đơn hàng| KhachHang

        HeThongThanhToan("Hệ thống<br>Thanh toán") <-->|Thông tin giao dịch| P4
        P4 -->|Kết quả thanh toán| D3
        P4 -->|Lưu lịch sử giao dịch| D4

        Admin -->|Yêu cầu báo cáo| P5
        P5 -->|Đọc dữ liệu| D1
        P5 -->|Đọc dữ liệu| D3
        P5 -->|Đọc dữ liệu| D4
        P5 -->|Báo cáo tổng hợp| Admin
        P5 -->|Thống kê cho tác giả| TacGia
    end
```

---

## DFD Mức 2 - Chi tiết tiến trình "3.0 Xử lý Đơn hàng"

Sơ đồ mức 2 phân rã một tiến trình cụ thể từ mức 1 (ở đây là "Xử lý Đơn hàng") thành các tiến trình chi tiết hơn.

**Các tiến trình con của "3.0 Xử lý Đơn hàng":**
*   **3.1:** Tiếp nhận yêu cầu mua hàng.
*   **3.2:** Tạo đơn hàng tạm.
*   **3.3:** Gửi yêu cầu thanh toán.
*   **3.4:** Cập nhật trạng thái đơn hàng.
*   **3.5:** Gửi thông báo cho khách hàng.

```mermaid
graph TD
    subgraph "DFD Mức 2: Chi tiết 3.0 Xử lý Đơn hàng"
        P3_1("3.1<br>Tiếp nhận<br>Yêu cầu")
        P3_2("3.2<br>Tạo Đơn hàng")
        P3_3("3.3<br>Gửi yêu cầu<br>Thanh toán")
        P3_4("3.4<br>Cập nhật<br>Trạng thái Đơn")
        P3_5("3.5<br>Gửi Thông báo")

        %% Data Stores
        D1[("D1<br>Dữ liệu<br>Sách/Truyện")]
        D2[("D2<br>Dữ liệu<br>Người dùng")]
        D3[("D3<br>Dữ liệu<br>Đơn hàng")]

        %% External Entities
        KhachHang("Khách hàng")
        P4("4.0<br>Xử lý<br>Thanh toán")

        %% Flows
        KhachHang -->|Yêu cầu mua sách| P3_1
        P3_1 -->|Thông tin giỏ hàng| P3_2
        D1 -->|Kiểm tra thông tin sách| P3_1
        
        P3_2 -->|Lưu đơn hàng tạm| D3
        D2 -->|Lấy thông tin khách hàng| P3_2
        
        P3_2 -->|Thông tin đơn hàng| P3_3
        P3_3 -->|Yêu cầu thanh toán| P4

        P4 -->|Kết quả thanh toán| P3_4
        P3_4 -->|Cập nhật trạng thái| D3

        D3 -->|Thông tin đơn hàng đã cập nhật| P3_5
        P3_5 -->|Xác nhận/Thông báo lỗi| KhachHang
    end
```

---

## DFD Mức 2 - Chi tiết tiến trình "1.0 Quản lý Sản phẩm"

Sơ đồ này phân rã tiến trình "Quản lý Sản phẩm" để cho thấy cách sách và truyện được thêm, duyệt và quản lý.

**Các tiến trình con của "1.0 Quản lý Sản phẩm":**
*   **1.1:** Tiếp nhận thông tin sản phẩm (metadata như tên sách, tác giả, mô tả).
*   **1.2:** Tải lên & Lưu trữ nội dung số (file PDF, EPUB...).
*   **1.3:** Duyệt và Xuất bản sản phẩm.
*   **1.4:** Quản lý thông tin liên quan (thể loại, tag).

```mermaid
graph TD
    subgraph "DFD Mức 2: Chi tiết 1.0 Quản lý Sản phẩm"
        P1_1("1.1<br>Tiếp nhận<br>Thông tin Sản phẩm")
        P1_2("1.2<br>Tải lên<br>Nội dung số")
        P1_3("1.3<br>Duyệt &<br>Xuất bản")
        P1_4("1.4<br>Quản lý<br>Thể loại/Tag")

        %% Data Stores
        D1[("D1<br>Dữ liệu<br>Sách/Truyện")]
        D2[("D2<br>Dữ liệu<br>Người dùng")]

        %% External Entities
        Admin("Admin")
        TacGia("Tác giả")
        
        %% Flows
        TacGia -->|Cung cấp metadata sách| P1_1
        P1_1 -->|Lưu thông tin metadata| D1
        D2 -->|Xác thực thông tin tác giả| P1_1

        TacGia -->|Tải lên file nội dung| P1_2
        P1_2 -->|Lưu file & Cập nhật đường dẫn| D1

        Admin -->|Yêu cầu duyệt| P1_3
        D1 -->|Đọc thông tin sách chờ duyệt| P1_3
        P1_3 -->|Cập nhật trạng thái Approved/Rejected| D1
        
        Admin -->|Quản lý thể loại| P1_4
        P1_4 -->|Cập nhật dữ liệu thể loại/tag| D1
    end
``` 