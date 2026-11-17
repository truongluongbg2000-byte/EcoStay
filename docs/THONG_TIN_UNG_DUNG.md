# TÀI LIỆU ĐẶC TẢ & THÔNG TIN HỆ THỐNG ỨNG DỤNG ECOSTAY (BẢN V2.0)

> **Môn học:** Quản trị Chiến lược / Quản trị Chất lượng (QTCL)  
> **Cuộc thi:** ThangLong Business & Marketing Challenge Season 5 “Kỳ Tích”  
> **Tên dự án:** **App EcoStay - Nền Tảng Du Lịch Xanh & Tích Lũy CACBON POINT**  
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
**EcoStay** là ứng dụng di động (Mobile Web/PWA) kết hợp hệ sinh thái du lịch bền vững và chương trình tích điểm **CACBON POINT (CP)**. 
Ứng dụng số hóa toàn bộ hành trình du lịch sinh thái: từ việc tra cứu điểm đến xanh, đặt dịch vụ đối tác (*Khách sạn sinh thái, Nhà hàng farm-to-table, Tour trải nghiệm bản địa, Xe điện/Xe đạp*), đến việc thực hiện các nhiệm vụ xanh để tích điểm thưởng CP và đổi quà tặng hoặc **tài trợ trồng cây xanh thực tế tại các Vườn Quốc Gia**.

### 2. Cấu trúc 5 Tab điều hướng cốt lõi:
```
[ Trang chủ ]  ──  [ Quà tặng ]  ──  [ QUÉT MÃ (Giữa) ]  ──  [ Tích điểm 👣 ]  ──  [ Khác ]
```

---

## PHẦN II: CHI TIẾT 5 PHÂN HỆ CHỨC NĂNG CHÍNH

### 1. Tab 1: Trang Chủ (Home & Bản Đồ Điểm Đến Xanh)
* **Thẻ CACBON POINT:** Hiển thị điểm số hiện có (**270 CP**), thành viên `Trương Thế Lương` (Hạng Mầm Xanh), ngày hết hạn điểm. (Đã loại bỏ dòng quy đổi tiền mặt và khung 3 chỉ số phát thải cũ để giao diện thoáng sạch).
* **Thanh tìm kiếm du lịch xanh:** Placeholder *"Bạn muốn đi đâu? (Hội An, Cúc Phương, Đà Lạt...)"* với tính năng tìm kiếm và lọc tức thì.
* **Bản đồ Điểm đến Xanh Việt Nam (Interactive Eco-Map):**
  * Sơ đồ minh họa dải đất Việt Nam với các điểm dừng sinh thái: *Cúc Phương, Hội An, Đà Lạt, Nam Cát Tiên, Ninh Bình, Sa Pa*.
  * Chạm trực tiếp vào các nút trên bản đồ để lọc cơ sở xanh theo vùng.
* **Thanh lọc Danh mục Dịch vụ Xanh:**
  * `[ Tất cả ]`
  * `[ 🍲 Ăn uống ]`
  * `[ 🏨 Khách sạn ]`
  * `[ 🧗 Vui chơi ]`
  * `[ 🚲 Xe cộ ]`
* **Danh sách cơ sở đạt chuẩn Xanh (Đối tác liên kết):**
  * Hiển thị ảnh, tiêu chuẩn xanh (*100% Xanh, Zero Plastic Waste, Farm-to-Table*), điểm thưởng khi trải nghiệm (*+300 CP, +250 CP, +150 CP*).
  * Nút *"Xem & Đặt dịch vụ"* cho phép đặt dịch vụ tích điểm ngay hoặc bấm *"Mở Google Maps dẫn đường"* miễn phí.

### 2. Tab 2: Quà Tặng (Kho Đổi Quà & Giỏ Hàng Xanh)
* **[ Kho đổi quà ]:**
  * Bộ lọc phân vùng (*Miền Bắc, Miền Trung, Miền Nam*).
  * Danh mục: *Trồng cây (CSR), Ẩm thực hữu cơ, Thời trang tái chế, Hot deal, Dịch vụ Spa*.
  * Đổi điểm thành công sẽ kích hoạt pháo hoa `canvas-confetti`, sinh mã voucher và tự động chuyển vào Giỏ hàng xanh.
* **[ 🛒 Giỏ hàng xanh ]:**
  * Nơi hiển thị tất cả voucher, vật phẩm hoặc hoạt động mà khách đã dùng điểm carbon để đổi.
  * Tích hợp mã vạch Barcode, mã QR Code và mã text `ECO-...` để xuất trình cho nhân viên lễ tân/nhà hàng quét cấn trừ khi thanh toán.

### 3. Tab 3: Quét Mã QR (Live Camera Scanner & Mã Thành Viên)
* **[ 📷 Quét mã camera ]:**
  * Sử dụng thư viện `jsQR` kết hợp camera sau (`facingMode: 'environment'`) để quét mã QR ngoài đời thực trong **< 0.2 giây**.
  * Rung phản hồi (Haptic feedback) và nổ pháo hoa cộng điểm khi quét trúng mã buồng phòng (+50 CP), nhà hàng (+30 CP), xe điện (+20 CP) hoặc mã đối tác bất kỳ (+25 CP).
  * Nút bật/tắt Flashlight và đổi camera trước/sau.
* **[ 📲 MÃ QR CỦA TÔI ]:**
  * Thẻ thành viên kỹ thuật số của `Trương Thế Lương` (Mã: `ECO-TL-883921`, 270 CP).
  * Hiển thị mã QR thành viên để nhân viên thu ngân/lễ tân quét tích điểm hoặc áp dụng ưu đãi cho khách.

### 4. Tab 4: Tích Điểm (Biểu Tượng Dấu Chân Xanh 👣)
Nơi tập trung đầy đủ **5 nhóm nhiệm vụ xanh** để khách hàng chủ động thực hiện và tích lũy điểm thưởng:
1. **Trong phòng:**
   - *Không thay khăn, ga trong thời gian lưu trú:* `+10 CP`
   - *Tắt điều hoà, đèn điện và các thiết bị điện, nước khi ra khỏi phòng:* `+10 CP`
2. **Ăn uống:**
   - *Đặt bàn qua app:* `+15 CP`
   - *Ăn hết phần, không lãng phí thức ăn:* `+10 CP` (Lưu ý: Nếu quán phản ánh thừa thức ăn sẽ bị trừ `-5 CP`)
3. **Di chuyển (Gắn mã trên phương tiện):**
   - *Xe đạp, xe điện:* `+20 CP`
   - *Xe buýt, tàu hỏa, xe đi chung:* `+20 CP`
4. **Trải nghiệm văn hóa & Bản địa (Quét mã QR):**
   - *Workshop thủ công bản địa:* `+40 CP`
   - *Mua đồ handmade, đặc sản địa phương:* `+15 CP`
   - *Thăm trang trại hữu cơ, làng nghề:* `+30 CP`
   - *Dọn rác bãi biển, suối, đường mòn:* `+50 CP`
   - *Trồng 1 cây xanh bản địa:* `+60 CP`
5. **Tương tác ứng dụng:**
   - *Check-in đối tác xanh:* `+10 CP`
   - *Chia sẻ lên mạng xã hội:* `+20 CP`
   - *Đánh giá có ảnh:* `+15 CP`
   - *Giới thiệu bạn bè:* `+50 CP`

### 5. Tab 5: Khác (Cài Đặt & Đa Ngôn Ngữ)
* **Hồ sơ thành viên:** Thông tin `Trương Thế Lương`, hạng Mầm Xanh.
* **Tính năng Hộ Chiếu Xanh (Eco Impact Card):** Render infographic chứng nhận giảm thải CO₂ và tải ảnh PNG về máy (dùng `html2canvas`) để đăng Story/Facebook/LinkedIn.
* **Mục "Cài đặt" (Thay cho Đường tới EcoStay):** Quản lý cài đặt ứng dụng, thông báo, đồng bộ offline.
* **Mục "Ngôn ngữ hiển thị":** Hỗ trợ chuyển đổi nhanh giữa **Tiếng Việt (Mặc định)** và **English (US/UK)**.
* **Menu hỗ trợ:** Hotline, khảo sát (+15 CP), lịch sử điểm, hướng dẫn sử dụng và đặt lại dữ liệu demo.

---

## PHẦN III: THÔNG SỐ VẬN HÀNH & REPOSITORY

| Tiêu chí | Thông số kỹ thuật |
| :--- | :--- |
| **Môi trường triển khai** | Vercel Edge Network |
| **Source Code Repository** | `https://github.com/truongluongbg2000-byte/EcoStay.git` (Nhánh `main`) |
| **Kích thước tải ban đầu** | **127 kB** (Cực nhẹ, thời gian tải < 1 giây) |
| **Thư viện giải mã Camera** | `jsQR` (Client-side Canvas real-time frame decoder) |
| **Cơ chế lưu trữ Client** | LocalStorage Engine v4 |
| **Bản quyền môn học** | Nhóm Tinh Hà Say Hi - Lớp QI3703 - Trường Đại học Thăng Long |
