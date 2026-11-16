# EcoStay - Ứng Dụng Du Lịch Xanh & Tích Lũy CACBON POINT

> Dự án tham dự cuộc thi: **ThangLong Business & Marketing Challenge Season 5 “Kỳ Tích”**
> Đơn vị thực hiện: **Nhóm Tinh Hà Say Hi - Lớp QI3703, Trường Đại học Thăng Long**

---

## 🌟 Giới Thiệu
**EcoStay** là ứng dụng di động (Mobile Web/PWA) kết nối du khách với hệ sinh thái lưu trú bền vững. Ứng dụng đo lường lượng CO₂ giảm phát thải theo thời gian thực (chuẩn IPCC & ISO 14064), tích điểm **CACBON POINT (CB)** từ các hành vi xanh (không dọn phòng, không lãng phí thức ăn, đi bộ/xe điện), và cho phép đổi điểm lấy các ưu đãi thực tế hoặc **trồng cây xanh thực tế** tại các rừng phòng hộ (Cúc Phương, Nam Cát Tiên).

---

## 📱 5 Tab Chức Năng Chính (Bottom Navigation)

1. **Trang chủ (Home):**
   - Header cá nhân hóa (Nguyễn Thị Phương Oanh - Phòng Suite Eco-402), thẻ số dư 54 điểm CACBON POINT (CB).
   - **Eco-Dashboard:** 3 chỉ số phát thải thời gian thực (kg CO₂ giảm được, Lít nước tiết kiệm, kWh Điện xanh).
   - **Băng chuyền Banner:** Chiến dịch trồng 1 vạn cây rừng, Tour Zero-Waste, Khách sạn Net Zero.
   - **Lưới 8 tiện ích nhanh:** Cẩm nang, Gửi ý kiến (+15 CB), Quà tặng, Ngày hội xanh, Đối tác, Đường tới EcoStay, Lịch sử điểm, Lịch sử mua sắm.

2. **Quà tặng (Eco-Store & Rewards):**
   - Lọc theo danh mục: Tất cả, Trồng cây, Ẩm thực, Thời trang, Hot deal, Dịch vụ, Khác.
   - Phân vùng: Miền Bắc (Ninh Bình - Cúc Phương), Miền Trung, Miền Nam.
   - Cơ chế đổi thưởng: Kiểm tra số dư điểm, trừ điểm thời gian thực, hiệu ứng pháo hoa ăn mừng và tự động cấp mã voucher số.

3. **Quét mã & Nhiệm vụ Xanh (Green Actions - Nút trung tâm):**
   - Khung camera giả lập quét mã QR với tia laser quét sinh động và nút bật đèn flash.
   - Các nút quét mô phỏng: Buồng phòng (+50 CB), Zero Food Waste (+30 CB), Xe điện Xanh SM / Bus (+20 CB).
   - Công tắc (Quick Toggles) cam kết xanh cho khách đang lưu trú tại khách sạn.

4. **Voucher / Coupon:**
   - Bộ chuyển đổi 2 Tab: **AVN Point** & **CACBON POINT**.
   - 2 mục: *Đổi điểm voucher* & *Voucher của bạn*.
   - Thẻ voucher kỹ thuật số có mã vạch (Barcode), mã QR Code và nút sao chép mã đưa nhân viên lễ tân cấn trừ.

5. **Khác & Xuất Hộ Chiếu Xanh (Profile & More):**
   - Thông tin cá nhân & hạng thành viên "Mầm Xanh Tiên Phong".
   - **Tính năng độc quyền:** **"Xuất Báo Cáo Dấu Chân Sinh Thái"** – Tự động render infographic card chuẩn đẹp và cho phép **tải ảnh về máy (PNG)** để đăng Story / Facebook / LinkedIn.
   - Menu tiện ích: Chỉ đường bản đồ, hotline hỗ trợ, khảo sát ý kiến, đối tác đồng hành, thông tin pháp lý & tiêu chuẩn ESG.

---

## 🚀 Hướng Dẫn Chạy Thử Tại Máy (Local)

```bash
# 1. Cài đặt thư viện (nếu chưa cài)
npm install

# 2. Chạy môi trường phát triển
npm run dev

# 3. Mở trình duyệt truy cập:
http://localhost:3000
```

---

## 🌐 Hướng Dẫn Triển Khai Lên Vercel (Miễn Phí 100%)

### Cách 1: Đẩy lên GitHub rồi kết nối Vercel (Khuyên Dùng)
1. Tạo một repository mới trên GitHub (ví dụ: `ecostay-web-demo`).
2. Mở terminal tại thư mục này và chạy các lệnh:
   ```bash
   git init
   git add .
   git commit -m "feat: EcoStay mobile web demo complete"
   git branch -M main
   git remote add origin <URL_GITHUB_CUA_BAN>
   git push -u origin main
   ```
3. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
4. Chọn **Add New Project** -> Chọn repository `ecostay-web-demo` -> Bấm **Deploy**.
5. Trong vòng 1 phút, Vercel sẽ cấp cho bạn một đường link công khai (ví dụ: `https://ecostay-app.vercel.app`) để gửi cho thầy cô và ban giám khảo!

### Cách 2: Triển khai trực tiếp qua Vercel CLI (Không cần GitHub)
1. Chạy lệnh cài đặt Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Chạy lệnh deploy:
   ```bash
   vercel
   ```
3. Đăng nhập theo hướng dẫn trên terminal và chọn `y` để hoàn tất.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Mobile-first, Container Smartphone Frame)
- **Icons:** `lucide-react`
- **Effects & Canvas:** `canvas-confetti`, `html2canvas` (Xuất ảnh Story)
- **State Management:** React Hooks + `localStorage` (tự động lưu trạng thái khi F5)
