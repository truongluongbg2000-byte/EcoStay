# TÀI LIỆU ĐẶC TẢ & THÔNG TIN HỆ THỐNG ỨNG DỤNG ECOSTAY

> **Môn học:** Quản trị Chiến lược / Quản trị Chất lượng (QTCL)  
> **Cuộc thi:** ThangLong Business & Marketing Challenge Season 5 “Kỳ Tích”  
> **Tên dự án:** **App EcoStay - Du Lịch Xanh & Tích Lũy CACBON POINT**  
> **Đơn vị thực hiện:** Nhóm Tinh Hà Say Hi - Lớp QI3703, Trường Đại học Thăng Long  
> **Thành viên:**  
> 1. Hà Thị Yến Nhi (Nhóm trưởng)  
> 2. Trương Thế Lương  
> 3. Nguyễn Thị Phương Oanh  
> 4. Mạc Văn Huy  
> 5. Ngô Hoàng Nguyên  

---

## PHẦN I: KHÁI QUÁT VỀ ỨNG DỤNG (EXECUTIVE SUMMARY)

### 1. Ý tưởng cốt lõi
**EcoStay** là một ứng dụng di động (Mobile Web/PWA) kết hợp hệ sinh thái lưu trú xanh và chương trình tích điểm **CACBON POINT (CB)**. 
Ứng dụng số hóa toàn bộ hành trình nghỉ dưỡng của khách hàng tại khách sạn: từ việc giám sát, định lượng mức độ giảm phát thải khí nhà kính (CO₂), điện, nước theo thời gian thực đến việc biến những hành vi xanh đó thành **điểm thưởng có giá trị quy đổi thực tế** (1 Điểm CB = 1.000 VNĐ) để đổi quà tặng, voucher dịch vụ hoặc **tài trợ trồng cây xanh thực tế tại các Vườn Quốc Gia**.

### 2. Vấn đề thực tế giải quyết (Pain Points)
- **Ô nhiễm từ ngành khách sạn:** Mỗi phòng nghỉ thông thường phát thải từ 15–30 kg CO₂/đêm, tiêu thụ điện nước gấp 2–3 lần hộ gia đình.
- **Khoảng cách "Ý thức" và "Hành động" (Say-Do Gap):** 84% du khách nói muốn du lịch bền vững, nhưng chỉ 26% thực sự chọn nơi lưu trú xanh vì các giải pháp truyền thống (như biển nhắc "tái sử dụng khăn") đòi hỏi khách hy sinh tiện nghi mà không nhận lại giá trị gì.
- **Vấn nạn "Tẩy xanh" (Greenwashing):** Khách hàng thiếu niềm tin vào các chứng chỉ xanh vô hình do thiếu dữ liệu số đo lường minh bạch.

### 3. Giải pháp của EcoStay
- **Đo lường phát thải thời gian thực:** Kết nối thiết bị buồng phòng, tính toán chính xác số kg CO₂, lít nước, kWh điện tiết kiệm được.
- **Game hóa (Gamification):** Khách hoàn thành nhiệm vụ xanh (không dọn phòng, không lãng phí thức ăn, đi xe điện) để nhận điểm thưởng.
- **Cơ chế phần thưởng kép (Double Rewards):** 
  + *Lợi ích cá nhân:* Voucher đồ uống, spa, giảm giá phòng đêm tiếp theo.
  + *Lợi ích cộng đồng (CSR):* Tích điểm trồng 1 cây xanh thật tại VQG Cúc Phương / Cát Tiên, cập nhật tọa độ GPS qua app.
- **Hộ chiếu xanh (Green Passport):** Xuất infographic chứng nhận giảm thải cá nhân chuẩn ISO 14064 để chia sẻ mạng xã hội.

---

## PHẦN II: KIẾN TRÚC KỸ THUẬT HỆ THỐNG (SYSTEM ARCHITECTURE)

Sơ đồ tổng quan kiến trúc hệ thống:

```
+-----------------------------------------------------------------------------------+
|                           GIAO DIỆN NGƯỜI DÙNG (FRONTEND)                         |
|   Next.js 14 (App Router) | React 18 | TypeScript | Tailwind CSS | Lucide Icons   |
|   Hiển thị thông minh 2-trong-1: Fullscreen Mobile PWA + Smartphone Frame trên PC  |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                             TẦNG XỬ LÝ & LOGIC (APPLICATION)                      |
|   State Management (React Hooks) | Canvas Confetti | HTML2Canvas (Xuất ảnh Story) |
|   Engine tính toán quy đổi phát thải CO2 (Chuẩn IPCC / ISO 14064)                 |
+-----------------------------------------------------------------------------------+
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
+---------------------------------------+ +-----------------------------------------+
|      LƯU TRỮ HIỆN TẠI (DEMO WEB)      | |   KIẾN TRÚC MỞ RỘNG (PRODUCTION PROPOSED)|
| - LocalStorage Cache Engine           | | - Backend: Next.js API Routes / Node.js |
| - Offline-First Persistence           | | - Database: PostgreSQL (Supabase/Neon)  |
| - Tự động đồng bộ số dư điểm, voucher | | - Caching/Leaderboard: Redis (Upstash)  |
|   và lịch sử giao dịch khi F5.        | | - IoT Ingestion: MQTT / WebSockets      |
+---------------------------------------+ +-----------------------------------------+
```

### 1. Frontend Layer (Giao diện & Tương tác người dùng)
- **Framework:** **Next.js 14** (App Router) kết hợp **React 18** và **TypeScript**. Đảm bảo type-safe tuyệt đối cho các đối tượng nghiệp vụ (`UserProfile`, `RewardItem`, `Voucher`, `GreenMission`, `ImpactLog`).
- **Styling & Theme:** **Tailwind CSS** xây dựng theo triết lý Mobile-First.
  - *Tone màu chủ đạo (Eco Brand):*
    - **Forest Green (Xanh rừng sâu):** `#1E4D3E` (đại diện cho sự bền vững, thiên nhiên).
    - **Pastel Mint (Xanh mint non):** `#E8F5E9` (nền phụ, badge, thẻ tác vụ nhẹ nhàng).
    - **Earth Orange (Cam đất/gỗ):** `#D97736` (tạo điểm nhấn CTA, nút đổi voucher, thông báo).
    - **Neutral Background:** `#F8FAF8` và `#1B3B2B` (tối ưu độ tương phản văn bản).
- **Thiết kế hiển thị 2-trong-1 (Adaptive Viewport):**
  - **Mở trên Điện thoại:** Tự động tràn viền 100% màn hình, hỗ trợ thao tác chạm vuốt đáy màn hình như Native App tải từ App Store.
  - **Mở trên Máy tính (Desktop/Laptop):** Giao diện nằm gọn gàng ở giữa màn hình bên trong **Khung điện thoại thông minh (Phone Simulator Frame)** có bo cong mềm mại, thanh trạng thái (giờ `9:41`, Dynamic Island, Wi-Fi, Pin), đặt trên nền xanh rừng sâu cao cấp. Rất tối ưu khi trình chiếu slide thuyết trình.
- **Hiệu ứng đồ họa & Tương tác:**
  - `canvas-confetti`: Bắn pháo hoa ăn mừng khi khách hoàn thành nhiệm vụ xanh hoặc đổi quà thành công.
  - `html2canvas`: Render toàn bộ DOM của thẻ Hộ Chiếu Xanh thành file ảnh PNG độ nét cao (2x retina) để người dùng tải về máy hoặc chia sẻ lên Facebook/Story.
  - `lucide-react`: Bộ biểu tượng chuẩn phẳng, hiện đại và đồng bộ.

### 2. Backend & Xử lý Logic (Serverless & Logic Engine)
- **Mô hình hiện tại:** Chạy theo kiến trúc **Serverless JAMstack** trên nền tảng **Vercel Edge Network**. Không tốn tài nguyên máy chủ thường trực, không bị ngủ đông (No Cold Start/Sleep), mở trang trong chưa đầy 1 giây.
- **Kế hoạch Production:** Tích hợp **Next.js API Routes** và **Node.js/Express**, cung cấp RESTful API và GraphQL cho:
  - Quản lý xác thực người dùng (JWT / OAuth2 với Google & Zalo).
  - Tích hợp cổng thanh toán / tích điểm đối tác (MoMo, ZaloPay, VNPay API).
  - Webhook nhận dữ liệu tiêu thụ điện nước từ hệ thống quản lý phòng khách sạn (PMS / IoT Gateway).

### 3. Database & Quản trị Dữ liệu (Data Storage)
- **Mô hình hiện tại (Bản Demo):**
  - Sử dụng **Local State kết hợp LocalStorage Persistence Engine** (`ecostay_user_profile_v3`, `ecostay_vouchers_v3`, `ecostay_logs_v3`, `ecostay_missions_v3`).
  - **Ưu điểm vượt trội:** Người dùng bấm đổi voucher, gạt tắt dọn phòng, nhận điểm thưởng đều được ghi nhớ vĩnh viễn trên trình duyệt mà không cần đăng nhập rườm rà, tải lại trang (F5) không mất dữ liệu, chi phí vận hành máy chủ = 0 VNĐ.
- **Kế hoạch Production:**
  - **Primary Database (PostgreSQL qua Supabase):** Quản lý quan hệ giữa Khách hàng (Users), Phòng nghỉ (Rooms), Đơn đặt phòng (Bookings), Thẻ Voucher (Vouchers), Lịch sử phát thải (Emission Logs).
  - **Cache & Realtime (Redis Upstash):** Lưu trữ bảng xếp hạng thi đua xanh (Leaderboard) theo tháng, kiểm soát tần suất quét mã QR (Rate Limiting).
  - **Blob Storage (Cloudinary / AWS S3):** Lưu trữ ảnh chụp thực tế cây xanh được gắn biển tên định vị GPS gửi từ VQG Cúc Phương.

### 4. Thuật toán Đo lường Phát thải & Tích hợp IoT (Emissions Engine)
Hệ số quy đổi phát thải được xây dựng dựa trên hướng dẫn của **IPCC**, tiêu chuẩn kiểm kê **ISO 14064** và định mức tiêu thụ khách sạn của **Bộ Tài nguyên & Môi trường**:
- **Không dọn phòng 1 ngày:** Tiết kiệm ~35 lít nước giặt và 1.5 kWh điện ≈ **2.1 kg CO₂** giảm được (+50 CB).
- **Thử thách Zero Food Waste (Ăn sạch đĩa):** Giảm thiểu thức ăn thừa phân hủy sinh khí Methane (CH₄) ≈ **1.2 kg CO₂** tương đương (+30 CB).
- **Duy trì điều hòa ≥ 25°C:** Giảm tải máy nén lạnh, tiết kiệm ~1.8 kWh điện ≈ **1.5 kg CO₂** (+25 CB).
- **Di chuyển bằng Xe điện (Xanh SM / VinFast) / Xe đạp TNGo:** Tránh phát thải đốt nhiên liệu hóa thạch ≈ **0.9 – 1.5 kg CO₂** (+20 CB).

---

## PHẦN III: CHI TIẾT CÁC TÍNH NĂNG TRONG ỨNG DỤNG

Hệ thống được cấu trúc xoay quanh **5 Tab điều hướng chân trang (Bottom Navigation)** bám sát 100% hình ảnh đề án gốc:

```
[ Trang chủ ]  ──  [ Quà tặng ]  ──  [ QUÉT MÃ (Nút giữa) ]  ──  [ Voucher ]  ──  [ Khác ]
```

### 1. Tab 1: Trang Chủ (Home Screen)
- **Header người dùng:** Lời chào cá nhân hóa *"Xin chào, Trương Thế Lương"*, thông tin số phòng *"Suite Eco-402"*, số dư điểm nổi bật, chuông thông báo có huy hiệu `99+` (mở popup xem danh sách thông báo hoạt động).
- **Thẻ Tài Khoản CACBON POINT:** Thẻ bo cong phủ gradient xanh rừng sang trọng:
  - Hiển thị số dư hiện có: **54 Điểm CB**.
  - Tỷ giá quy đổi: 1 Điểm CB = 1.000 VNĐ.
  - Ngày hết hạn điểm: `30/11/2027` (chu kỳ 12 tháng).
  - Điểm phụ AVN Point: 120 điểm.
  - Nút chuyển nhanh: *"Đổi voucher ngay"*.
- **Eco-Dashboard (Bảng chỉ số tác động thời gian thực):**
  - Ô 1: **14.8 kg CO₂** giảm được (biểu tượng cây xanh).
  - Ô 2: **120L Nước** tiết kiệm (biểu tượng giọt nước).
  - Ô 3: **6.5 kWh Điện** năng sạch (biểu tượng tia sét).
- **Băng chuyền Banner (Auto Carousel):** Tự động chuyển đổi slide thông điệp du lịch bền vững sau mỗi 4.5 giây:
  - *Chiến dịch phủ xanh 1 vạn cây rừng Cúc Phương.*
  - *Tour du lịch xanh Behind-The-Scenes.*
  - *Hành trình Net Zero 2050.*
- **Lưới 8 tiện ích nhanh (Grid 4x2 với icon tròn màu xanh):**
  1. *Cẩm nang:* Sổ tay mẹo sống xanh (mở modal hướng dẫn).
  2. *Gửi ý kiến:* Khảo sát đóng góp ý kiến nhận ngay +15 CB.
  3. *Quà tặng:* Chuyển nhanh sang kho đổi quà.
  4. *Ngày hội xanh:* Thông tin sự kiện nhân đôi điểm.
  5. *Đối tác:* Danh mục đơn vị đồng hành (VinFast, WWF, Gaia, MoMo...).
  6. *Đường tới EcoStay:* Bản đồ chỉ đường và xe buýt điện đón khách.
  7. *Lịch sử điểm:* Nhật ký cộng/trừ điểm minh bạch.
  8. *Đơn đổi quà:* Danh sách các voucher đã sở hữu.

### 2. Tab 2: Quà Tặng (Eco-Store & Rewards)
- **Thanh tiêu đề & Bộ lọc vùng:** Dropdown chuyển đổi khu vực (*Miền Bắc - Ninh Bình/Cúc Phương*, *Miền Trung - Hội An*, *Miền Nam - Cát Tiên*).
- **Thanh lọc 7 danh mục bo góc:** [Tất cả] - [Trồng cây] - [Ẩm thực] - [Thời trang] - [Hot deal] - [Dịch vụ] - [Khác].
- **Danh mục quà tặng phân tầng theo điểm thưởng:**
  - *100 - 200 điểm:* Ly sinh tố Organic (120 CB), Túi vải Canvas tái chế (150 CB), Set trà thảo dược (160 CB).
  - *300 - 500 điểm:* Voucher Spa thảo mộc giảm 30% (350 CB), Vé tour Behind-the-Scenes (450 CB), Giảm 30% đêm nghỉ kế tiếp (500 CB).
  - *600 - 1.000 điểm (Đặc quyền CSR):* Trồng 1 cây bách xanh VQG Cúc Phương (600 CB), Trồng cây bần ngập mặn Cát Tiên (650 CB), Nâng hạng phòng Suite (900 CB).
- **Cơ chế đổi quà thông minh:**
  - Bấm "Đổi quà" -> Mở Modal xác nhận chi tiết.
  - **Nếu đủ điểm:** Trừ điểm số dư, kích hoạt hiệu ứng pháo hoa `canvas-confetti`, sinh mã voucher ngẫu nhiên (`ECO-xxxxxx`) và tự động lưu vào tab Voucher.
  - **Nếu chưa đủ điểm:** Báo rõ số điểm còn thiếu và gợi ý khách bấm sang tab Quét mã để làm nhiệm vụ xanh tích điểm.

### 3. Tab 3: Quét Mã & Nhiệm Vụ Xanh (Green Action - Nút Trung Tâm Nổi Bật)
- Thiết kế nút tròn nổi ở chính giữa thanh điều hướng, có vòng tròn hiệu ứng phát sáng nhẹ.
- **Trình giả lập Camera Scanner:**
  - Giao diện khung ngắm camera hiện đại, góc viền xanh neon và **tia laser quét chuyển động liên tục**.
  - Nút bật tắt đèn Flashlight và nút đảo chiều camera.
  - 3 nút bấm mô phỏng tình huống thực tế tại khách sạn:
    + *Quét mã Buồng phòng:* Nhận ngay +50 CB.
    + *Quét mã Bàn ăn Zero Waste:* Nhận ngay +30 CB.
    + *Quét mã Xe điện / Bus:* Nhận ngay +20 CB.
- **Công tắc ghi nhận cam kết xanh (Quick Toggles):**
  - Công tắc bật/tắt *"Cam kết không dọn phòng hôm nay"* (+50 CB, 35L nước, 1.5 kWh điện).
  - Công tắc *"Thử thách Zero Food Waste - Ăn sạch đĩa"* (+30 CB).
  - Công tắc *"Duy trì điều hòa phòng ≥ 25°C"* (+25 CB).
  - Nút bấm *"Đi bộ 5.000 bước thay vì đi xe"* (+20 CB).
  - Khi bật/tắt, điểm số trên header và chỉ số phát thải tự động nhảy tăng/giảm thời gian thực kèm thanh thông báo Toast.

### 4. Tab 4: CACBON POINT & Kho Voucher
- **Chuyển đổi 2 Tab lớn:** `AVN Point` vs `CACBON POINT`.
- **Chuyển đổi 2 Tab con:** `Đổi điểm voucher/coupon` vs `Voucher/Coupon của bạn`.
- **Thẻ thông tin điểm:** Nhắc nhở hạn dùng điểm ngày `30/11/2027`.
- **Danh sách Voucher sở hữu (Thẻ vé cắt góc):**
  - Thiết kế vết cắt khuyết hai bên hông như vé xem phim / voucher cao cấp.
  - Nút **"Sử dụng ngay"** mở ra cửa sổ:
    + **Mã vạch số (Barcode).**
    + **Mã QR Code động.**
    + **Mã ký tự text (ví dụ `ECO-ORG921`)** kèm nút bấm 1 chạm sao chép mã.
    + Nút đánh dấu *"Đã sử dụng"* để đưa vào danh sách lịch sử.

### 5. Tab 5: Khác & Hộ Chiếu Xanh (Profile & More)
- **Thẻ hồ sơ người dùng:** Tên `Trương Thế Lương`, hạng thành viên `Mầm Xanh Tiên Phong`, phòng `Suite Eco-402`.
- **Tính năng độc quyền: "Xuất Báo Cáo Dấu Chân Sinh Thái" (Green Passport):**
  - Render thẻ chứng nhận đồ họa xanh tuyệt đẹp chuẩn tiêu chuẩn ISO 14064.
  - Ghi nhận: Họ tên, số kg CO₂ đã giảm, số lít nước tiết kiệm, số kWh điện sạch và cây rừng đã đóng góp kèm tọa độ GPS.
  - Nút **"Lưu ảnh & Chia sẻ Story"**: Sử dụng thuật toán `html2canvas` để chụp lại khung thẻ và tải file ảnh PNG độ nét cao về thiết bị để người dùng đăng lên Facebook, Instagram hoặc LinkedIn.
- **Danh mục menu cài đặt & Tiện ích đầy đủ:**
  - *Đường tới ECOSTAY:* Bản đồ vị trí Thung Nham, Ninh Bình và phương tiện xanh đón khách (Xanh SM, Eco-Bus, TNGo).
  - *Liên hệ hotline hỗ trợ.*
  - *Khảo sát ý kiến du khách:* Form đánh giá 5 sao nhận thưởng ngay +15 CB.
  - *Mời bạn bè sống xanh.*
  - *Giới thiệu chương trình CACBON POINT & Tiêu chuẩn ESG.*
  - *Lịch sử điểm & Đơn đổi quà.*
  - *Hướng dẫn sử dụng cẩm nang.*
  - *Ngôn ngữ: Tiếng Việt (VN).*
  - *Nút "Đặt lại dữ liệu Demo ban đầu".*

---

## PHẦN IV: THÔNG SỐ VẬN HÀNH & TRIỂN KHAI

| Tiêu chí | Thông số kỹ thuật |
| :--- | :--- |
| **Môi trường triển khai** | Vercel Edge Network |
| **Source Code Repository** | `https://github.com/vungocthien843-cyber/EcoStay.git` (Nhánh `main`) |
| **Kích thước gói tải ban đầu** | **87.3 kB** (Siêu nhẹ, tải trong < 0.8 giây) |
| **Tiêu chuẩn thiết kế** | Responsive Mobile-First, PWA Standalone Ready |
| **Cơ chế lưu trữ Client** | LocalStorage Engine v3 |
| **Bản quyền môn học** | Nhóm Tinh Hà Say Hi - Lớp QI3703 - Trường Đại học Thăng Long |
