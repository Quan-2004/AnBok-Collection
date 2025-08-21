graph TD
    Admin["👤 Quản trị viên"]
    Author["👤 Tác giả"]
    User["👤 Người dùng"]

    subgraph "Hệ thống Quản lý"
        direction LR

        subgraph "Quy trình Nghiệp vụ"
            direction TB
            P1("1.0<br>QL Sách")
            P2("2.0<br>QL Truyện")
            P4("4.0<br>QL Tác giả")
            P3("3.0<br>QL Đơn hàng")
            P5("5.0<br>QL Hội viên")
            P7("7.0<br>QL Tài khoản")
            P6("6.0<br>QL Khuyến mãi")
            P9("9.0<br>QL Tin tức")
        end

        subgraph "Kho Dữ liệu"
            direction TB
            D1[("D1: Kho Sách")]
            D2[("D2: Kho Truyện")]
            D3[("D3: Kho Tác giả")]
            D5[("D5: Kho Đơn hàng")]
            D4[("D4: Kho Hội viên")]
            D7[("D7: Kho Người dùng")]
            D6[("D6: Kho Khuyến mãi")]
            D8[("D8: Kho Tin tức")]
        end
    end

    P8("8.0<br>Báo cáo & Thống kê")

    %% Luồng từ các Actor
    Admin -- "Quản lý toàn bộ hệ thống" --> P1
    Admin -- " " --> P2
    Admin -- " " --> P3
    Admin -- " " --> P4
    Admin -- " " --> P5
    Admin -- " " --> P6
    Admin -- " " --> P7
    Admin -- " " --> P9
    Admin -- "Yêu cầu Báo cáo" --> P8

    Author -- "QL Sách/Truyện" --> P1
    Author -- " " --> P2
    Author -- "Xem Thống kê" --> P8
    Author -- "QL Tài khoản" --> P7

    User -- "Xem Sách/Truyện" --> P1
    User -- " " --> P2
    User -- "Xem Tin tức" --> P9
    User -- "QL Đơn hàng" --> P3
    User -- "Mua Gói" --> P5
    User -- "QL Tài khoản" --> P7

    %% Luồng chính (Cập nhật/Truy vấn)
    P1 <--> |Đọc/Ghi| D1
    P2 <--> |Đọc/Ghi| D2
    P3 <--> |Đọc/Ghi| D5
    P4 <--> |Đọc/Ghi| D3
    P5 <--> |Đọc/Ghi| D4
    P6 <--> |Đọc/Ghi| D6
    P7 <--> |Đọc/Ghi| D7
    P9 <--> |Đọc/Ghi| D8

    %% Luồng chéo (Chỉ đọc)
    P1 -- "Truy vấn Tác giả" --> D3
    P3 -- "Truy vấn Sách" --> D1
    P3 -- "Truy vấn Hội viên" --> D4
    P3 -- "Truy vấn Người dùng" --> D7
    P5 -- "Truy vấn Người dùng" --> D7

    %% Luồng báo cáo (Chỉ đọc)
    D1 -- "Dữ liệu" --> P8
    D2 -- " " --> P8
    D3 -- " " --> P8
    D4 -- " " --> P8
    D5 -- " " --> P8
    D6 -- " " --> P8
    D7 -- " " --> P8
    D8 -- " " --> P8
    P8 -- "Xem Báo cáo" --> Admin

    %% Styles
    style Admin fill:#cde4ff,stroke:#4a86e8,stroke-width:2px
    style Author fill:#d9ead3,stroke:#6aa84f,stroke-width:2px
    style User fill:#fff2cc,stroke:#f1c232,stroke-width:2px
    classDef process fill:#e2d9eb,stroke:#8e7cc3,stroke-width:2px
    classDef report fill:#d9d2e9,stroke:#6fa8dc,stroke-width:2px
    classDef datastore fill:#f4cccc,stroke:#cc0000,stroke-width:2px
    class P1,P2,P3,P4,P5,P6,P7,P9 process
    class P8 report
    class D1,D2,D3,D4,D5,D6,D7,D8 datastore
