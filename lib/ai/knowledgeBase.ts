export interface KnowledgeChunk {
  id: string;
  source: string;
  title: string;
  /** Keywords across Vietnamese (accented & non-accented), English, Korean, Japanese, Chinese */
  keywords: string[];
  /** Used as default fallback for general project overview questions */
  isDefaultOverview?: boolean;
  content: string;
}

export const PROJECT_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: 'team-info',
    source: 'Mục 1 - Thông tin thành viên dự án EcoStay',
    title: 'Thông tin nhóm thực hiện & Thành viên dự án (Lớp QI3703)',
    isDefaultOverview: true,
    keywords: [
      'thanh vien',
      'nhom truong',
      'truong nhom',
      'nhom lam',
      'ai lam',
      'lop',
      'qi3703',
      'ma sinh vien',
      'msv',
      'so dien thoai',
      'sdt',
      'email',
      'lien he',
      'ha thi yen nhi',
      'yen nhi',
      'a51848',
      'nguyen thi phuong oanh',
      'phuong oanh',
      'a51671',
      'mac van huy',
      'van huy',
      'a52051',
      'truong the luong',
      'the luong',
      'a51788',
      'ngo hoang nguyen',
      'hoang nguyen',
      'a51440',
      'team',
      'member',
      'members',
      'leader',
      'author',
      'creator',
      'contact',
      'who built',
      'who made',
      '팀원',
      '팀장',
      '멤버',
      '연락처',
      'メンバー',
      'チーム',
      'リーダー',
      '成员',
      '团队',
      '组长',
      '联系方式',
    ],
    content: `Thông tin các thành viên tham gia dự án App EcoStay (Lớp QI3703):
- Nhóm trưởng: Hà Thị Yến Nhi | MSV: A51848 | Lớp: QI3703 | SĐT: 0355575863 | Email: hayennhi792006@gmail.com | Vai trò: Nhóm trưởng.
- Thành viên 2: Nguyễn Thị Phương Oanh | MSV: A51671 | Lớp: QI3703 | SĐT: 0347644829 | Vai trò: Thành viên.
- Thành viên 3: Mạc Văn Huy | MSV: A52051 | Lớp: QI3703 | SĐT: 0397530513 | Vai trò: Thành viên.
- Thành viên 4: Trương Thế Lương | MSV: A51788 | Lớp: QI3703 | SĐT: 0869709106 | Vai trò: Thành viên.
- Thành viên 5: Ngô Hoàng Nguyên | MSV: A51440 | Lớp: QI3703 | SĐT: 0918170042 | Vai trò: Thành viên.
Tổng cộng gồm 5 sinh viên cùng lớp QI3703 (Trường Đại học Thăng Long).`,
  },
  {
    id: 'project-overview',
    source: 'Mục 2 - Tóm tắt dự án, Mô tả sản phẩm & Giá trị',
    title: 'Ý tưởng chính, Mô tả App EcoStay & Giá trị cho 4 nhóm đối tượng',
    isDefaultOverview: true,
    keywords: [
      'y tuong',
      'tom tat',
      'du an la gi',
      'du an lam ve gi',
      'gioi thieu',
      'tong quan',
      'gia tri',
      'san pham',
      'mo ta',
      'cacbon point',
      'app ecostay',
      'loi ich',
      'nguoi dung',
      'doanh nghiep',
      'cong dong',
      'don vi van hanh',
      'overview',
      'summary',
      'about',
      'what is ecostay',
      'value',
      'project idea',
      '프로젝트',
      '소개',
      '개요',
      '가치',
      'プロジェクト',
      '概要',
      '価値',
      '项目介绍',
      '概述',
      '价值',
      '核心理念',
    ],
    content: `Ý tưởng chính của dự án App EcoStay:
- Phát triển ứng dụng di động "App EcoStay" chuyên biệt về du lịch xanh nhằm đo lường và theo dõi sát sao lượng phát thải CO2 của du khách trong từng chuyến đi.
- Định hướng người dùng chọn dịch vụ bền vững: khách sạn sinh thái, nhà hàng không rác thải (zero-waste), phương tiện giao thông thân thiện môi trường.
- Gắn với chương trình tích điểm CACBON POINT (CB): người dùng tích điểm thông qua các hành vi xanh rồi đổi voucher, quà tặng và kết nối trực tiếp hoạt động trung hòa cacbon thực tế (trồng cây).

Cấu trúc sản phẩm & màn hình cốt lõi:
- Trang chủ: Hiển thị tài khoản, số điểm CACBON POINT hiện có, lối tắt (Cẩm nang, Gửi ý kiến, Quà tặng, Sự kiện, Đối tác, Đường tới EcoStay, Lịch sử điểm, Lịch sử mua sắm, Mua sắm).
- Quà tặng: Phân 6 nhóm (Thời trang, Ẩm thực, Trồng cây, Hot deal, Dịch vụ, Khác), nổi bật nhóm Trồng cây.
- Thông tin khác: Đường tới EcoStay, Liên hệ, Khảo sát, Mời bạn bè, Giới thiệu CACBON POINT, Thông tin pháp lý, Dịch vụ EcoStay, Lịch sử điểm, Hướng dẫn sử dụng, Lịch sử mua sắm, Ngôn ngữ, Đăng xuất.
- Thanh điều hướng: Trang chủ – Quà tặng – Quét mã – Voucher/Tích điểm – Khác.

Giá trị của dự án mang lại cho 4 nhóm:
1. Đối với người dùng: Biến hành vi sống xanh thành phần thưởng cụ thể, dễ hiểu, dễ nhận; quy trình quét mã - tích điểm - đổi quà rõ ràng; minh bạch lịch sử điểm và hạn sử dụng.
2. Đối với doanh nghiệp và đối tác: Tiếp cận khách hàng quan tâm tiêu dùng bền vững; giữ chân khách qua voucher; gắn thương hiệu với trách nhiệm xã hội & ESG.
3. Đối với cộng đồng và môi trường: Thay đổi thói quen tiêu dùng giảm phát thải, lan tỏa lối sống xanh qua mời bạn bè/khảo sát/cẩm nang, góp phần bảo vệ môi trường.
4. Đối với đơn vị vận hành: Xây dựng hệ sinh thái số kết nối người dùng - đối tác - chương trình xanh địa phương; có dữ liệu hành vi để đánh giá hiệu quả và tối ưu chính sách.`,
  },
  {
    id: 'bmc-partners-activities-resources',
    source: 'Mục 3 - Business Model Canvas (Đối tác, Hoạt động & Tài nguyên chính)',
    title: 'Đối tác chính, Hoạt động chính & Tài nguyên chính của EcoStay',
    keywords: [
      'doi tac',
      'key partner',
      'hoat dong chinh',
      'key activities',
      'tai nguyen',
      'key resources',
      'vinfast',
      'xanh sm',
      'tngo',
      'wwf',
      'live & learn',
      'greenviet',
      'pannature',
      'gaia',
      'vita',
      'momo',
      'zalopay',
      'vnpay',
      'google maps',
      'ipcc',
      'dai hoc thang long',
      'kinh te quoc dan',
      'bmc',
      'business model canvas',
      'mo hinh kinh doanh',
      'partner',
      'partners',
      'activities',
      'resources',
      '파트너',
      '주요 활동',
      '핵심 자원',
      'ビジネスモデル',
      'パートナー',
      '合作伙伴',
      '核心活动',
      '核心资源',
    ],
    content: `Business Model Canvas — Đối tác chính, Hoạt động chính & Tài nguyên chính:
1. Đối tác chính:
   - Đơn vị cho thuê xe xanh: VinFast (xe máy điện, xe buýt điện), Xanh SM, hệ thống xe đạp công cộng TNGo.
   - Tổ chức chứng nhận & môi trường: WWF Việt Nam (Quỹ Bảo tồn Thiên nhiên Thế giới), Trung tâm Sống và Học tập vì Môi trường và Cộng đồng (Live & Learn).
   - Quỹ trồng rừng: GreenViet, PanNature, sáng kiến Trồng rừng của Trung tâm Bảo tồn Thiên nhiên Gaia.
   - Cơ quan quản lý & Hiệp hội: Bộ Văn hóa, Thể thao và Du lịch, Tổng cục Du lịch Việt Nam, Hiệp hội Du lịch Việt Nam (VITA).
   - Đối tác công nghệ & thanh toán: MoMo, ZaloPay, VNPay (thanh toán tích điểm), Google Maps API (tính lộ trình và khoảng cách).
2. Hoạt động chính:
   - Phát triển & vận hành App (lập trình, cập nhật UI, bảo mật trên iOS & Android).
   - Xây dựng Thuật toán EcoStay: nghiên cứu & chuẩn hóa hệ số phát thải theo hướng dẫn của IPCC và Bộ Tài nguyên & Môi trường để quy đổi quãng đường, phương tiện, lưu trú ra kg CO2.
   - Tổ chức chiến dịch trồng cây, tour xanh cùng WWF-Việt Nam và GreenViet.
   - Tổ chức Sự kiện & Truyền thông: phối hợp với các trường đại học (Đại học Thăng Long, ĐH Kinh tế Quốc dân) tổ chức chiến dịch "Thử thách sống xanh".
3. Tài nguyên chính:
   - Nền tảng công nghệ: cơ sở dữ liệu hệ số phát thải độc quyền, mã nguồn ứng dụng App EcoStay.
   - Nhân sự chuyên môn: kỹ sư phần mềm, chuyên gia phân tích dữ liệu môi trường (ESG), nhân sự vận hành và phát triển kinh doanh (BD).
   - Mạng lưới dữ liệu địa điểm: hàng trăm điểm lưu trú, quán ăn, phương tiện xanh đã xác thực.`,
  },
  {
    id: 'bmc-value-relations-channels',
    source: 'Mục 3 - Business Model Canvas (Giải pháp giá trị, Quan hệ KH & Kênh phân phối)',
    title: 'Giải pháp giá trị, Quan hệ khách hàng & Kênh thông tin - phân phối',
    keywords: [
      'giai phap gia tri',
      'value proposition',
      'quan he khach hang',
      'customer relationship',
      'kenh thong tin',
      'kenh phan phoi',
      'channels',
      'gamification',
      'game hoa',
      'mam xanh',
      'co thu',
      'bang xep hang',
      'pre-stay',
      'bu dap co2',
      'cuc phuong',
      'cat tien',
      'customer relationships',
      'value propositions',
      '고객 관계',
      '유통 채널',
      '가치 제안',
      '顧客関係',
      'チャネル',
      '价值主张',
      '客户关系',
      '渠道',
    ],
    content: `Business Model Canvas — Giải pháp giá trị, Quan hệ khách hàng & Các kênh:
1. Giải pháp giá trị:
   - Theo dõi phát thải cá nhân: tự động quy đổi hành trình (máy bay, ô tô, xe máy, xe điện) ra khối lượng CO2 phát thải thực tế.
   - Gợi ý lịch trình tối ưu xanh: tuyến điểm, nhà hàng không rác thải (zero-waste), khách sạn dùng năng lượng mặt trời.
   - Tích điểm đổi quà: tích điểm từ mỗi kg CO2 tiết kiệm để đổi voucher (vé tham quan, đồ lưu niệm tái chế, phòng sinh thái, đồ ăn...).
   - Bù đắp CO2 minh bạch: đóng góp mua cây giống trồng tại rừng phòng hộ (VQG Cúc Phương, Cát Tiên) ngay trên app.
2. Quan hệ khách hàng:
   - Tự phục vụ & tự động hóa: khách chủ động xem chỉ số, tích điểm, đổi voucher ngay trên app.
   - Game hóa trải nghiệm (Gamification): huy hiệu xanh, thăng hạng tài khoản (Hạng Mầm Xanh → Hạng Cổ Thụ), thử thách xanh hằng ngày.
   - Tạo dựng cộng đồng: bảng xếp hạng khách hàng xanh theo tháng/năm, chia sẻ thành tích giảm CO2 và chứng nhận cây xanh lên MXH.
   - Cá nhân hóa & hỗ trợ chân thành: lễ tân/buồng phòng hỗ trợ và gửi thư cảm ơn cá nhân hóa.
3. Các kênh thông tin & phân phối:
   - Trực tiếp tại khách sạn: mã QR đặt tại quầy Check-in, phòng ngủ, bàn ăn, thang máy; lễ tân hướng dẫn cài app lúc nhận phòng.
   - Kênh kỹ thuật số: tích hợp "Tài khoản EcoStay" trên Website/App đặt phòng chính thức của khách sạn.
   - Kênh truyền thông: Pre-stay Email/tin nhắn tự động trước chuyến đi; MXH (Facebook, Instagram, TikTok) chia sẻ câu chuyện trồng rừng và khách nhận thưởng.`,
  },
  {
    id: 'bmc-cost-revenue',
    source: 'Mục 3 - Business Model Canvas (Cấu trúc chi phí & Dòng doanh thu)',
    title: 'Cấu trúc chi phí & 5 Dòng doanh thu của EcoStay',
    keywords: [
      'chi phi',
      'cau truc chi phi',
      'doanh thu',
      'dong doanh thu',
      'kiem tien',
      'loi nhuan',
      'tai chinh',
      'aws',
      'google cloud',
      'app store',
      'google play',
      'ota',
      'agoda',
      'booking',
      'ban hang cheo',
      'tai tro',
      'csr',
      'cost structure',
      'revenue',
      'revenue streams',
      'business model',
      'monetization',
      '비용 구조',
      '수익 모델',
      '매출',
      'コスト構造',
      '収益モデル',
      '成本结构',
      '收入来源',
      '商业模式',
      '盈利',
    ],
    content: `Business Model Canvas — Cấu trúc chi phí & Dòng doanh thu:
1. Cấu trúc chi phí (4 nhóm):
   - Hạ tầng công nghệ: thuê máy chủ đám mây (AWS / Google Cloud), phí duy trì tài khoản nhà phát triển App Store / Google Play.
   - Marketing & Phát triển cộng đồng: quảng cáo số, hợp tác KOLs/KOCs lối sống xanh, tổ chức sự kiện cộng đồng.
   - Chi phí nhân sự: lương lập trình viên, chuyên gia kiểm định môi trường, marketing và CSKH.
   - Phí vận hành dự án xã hội: chuyển kinh phí và giám sát thực thi dự án trồng rừng với tổ chức bảo tồn.
2. Dòng doanh thu (5 nguồn):
   - Doanh thu gián tiếp từ tối ưu chi phí vận hành: tiết kiệm giặt ủi, điện, nước, hóa chất (khách không dọn phòng hằng ngày) và tiết kiệm nguyên liệu thực phẩm (giảm thức ăn thừa).
   - Giá phòng chênh lệch: khách sẵn sàng trả cao hơn một chút cho gói "Eco-friendly Room" tích hợp quyền lợi tích điểm EcoStay cao hơn.
   - Tăng tỷ lệ khách quay lại & đặt phòng trực tiếp: điểm EcoStay/voucher kích thích đặt trực tiếp qua kênh khách sạn, giảm phí hoa hồng cho sàn OTA (Agoda, Booking.com).
   - Hợp tác bán hàng chéo (Cross-selling) & đối tác xanh: chiết khấu/hoa hồng từ nhà hàng chay, tour sinh thái địa phương, cửa hàng thủ công mỹ nghệ.
   - Tài trợ doanh nghiệp (Corporate Sponsorship): các tập đoàn đồng tài trợ quỹ trồng rừng để ghi nhận chứng chỉ đóng góp môi trường.`,
  },
  {
    id: 'necessity-vision',
    source: 'Mục 4.1 - Tính cần thiết, Hiện trạng, Tầm nhìn & Số liệu nhu cầu',
    title: 'Hiện trạng, Mục tiêu, Tầm nhìn & Lý do khách chọn EcoStay',
    keywords: [
      'tinh can thiet',
      'hien trang',
      'muc tieu',
      'tam nhin',
      'bang can doi',
      'ly do',
      'tai sao chon',
      'booking.com',
      '84%',
      '93%',
      '85%',
      '41%',
      '58%',
      '26%',
      'phocuswright',
      'bohinj',
      'slovenia',
      'queensland',
      '42%',
      'cop26',
      'net zero 2050',
      'quang nam',
      'co to',
      'con dao',
      'marriott',
      'make a green choice',
      'greenwashing',
      '73%',
      '69%',
      'why ecostay',
      'vision',
      'mission',
      'necessity',
      'current status',
      '비전',
      '목표',
      '필요성',
      'ビジョン',
      '目的',
      '必要性',
      '愿景',
      '目标',
      '必要性',
    ],
    content: `Mục 4.1 — Tính cần thiết, Hiện trạng, Mục tiêu & Tầm nhìn:
- Hiện trạng: "Tài khoản EcoStay" đang ở giai đoạn ý tưởng, thiết kế để triển khai thí điểm tại mô hình khách sạn xanh của nhóm (đã hoàn thiện cơ chế hoạt động, quy đổi điểm và đối tác liên quan, chưa vận hành thương mại thực tế).
- Mục tiêu & Giá trị cốt lõi: Biến lựa chọn tiết kiệm của khách thành lượng CO2 giảm đo đếm được; chuyển khách từ "người sử dụng dịch vụ" sang "người cùng tham gia mục tiêu giảm phát thải".
- Tầm nhìn: Hướng tới mỗi kỳ lưu trú đều có "bảng cân đối EcoStay" minh bạch và nhân rộng thành mô hình cho chuỗi khách sạn, điểm đến xanh.
- 3 lý do khách hàng chọn EcoStay:
  1. Nhu cầu có thật: Báo cáo Travel & Sustainability 2025 của Booking.com (>30.000 du khách, 34 quốc gia): 84% coi du lịch bền vững quan trọng, 93% muốn thêm lựa chọn bền vững. Tại Việt Nam (báo cáo lần 11, 2026): 85% xem du lịch bền vững là ưu tiên hàng đầu; 41% coi giảm rác nhựa là quan trọng nhất; 58% muốn giảm rác/tránh đồ dùng 1 lần.
  2. Lấp khoảng trống "muốn" và "làm": Chỉ 26% du khách Việt đưa tiêu chí bền vững vào quyết định đặt phòng (Phocuswright 2023: 5–13% toàn cầu). Nghiên cứu tại Bohinj Eco Hotel (Slovenia) của ĐH Queensland chứng minh: khi chia sẻ khoản tiết kiệm bằng voucher đồ uống, tỷ lệ khách bỏ dọn phòng hằng ngày tăng vọt từ 3% lên 42% (trong khi chỉ treo biển kêu gọi bảo vệ môi trường không làm tăng).
  3. Không hy sinh trải nghiệm & chống greenwashing: khách chỉ chọn hành vi nhỏ và nhận thưởng hữu hình minh bạch.
- Giá trị xã hội & chính sách: Phù hợp cam kết Net Zero 2050 tại COP26 và Chiến lược Tăng trưởng xanh 2021–2030 (Quảng Nam phê duyệt bộ tiêu chí du lịch Net Zero cuối tháng 8/2024; Cô Tô, Côn Đảo đang thí điểm). Booking.com ghi nhận 73% du khách muốn chi tiêu có lợi cho cộng đồng địa phương, 69% muốn để lại điểm đến tốt hơn. Tiền lệ Marriott "Make a Green Choice": chi phí trồng 1 cây chỉ 2 USD, rẻ hơn mức 500 điểm quy đổi (2,74 USD).`,
  },
  {
    id: 'innovation-science',
    source: 'Mục 4.2a - Tính mới, 4 Điểm khác biệt & Cơ sở khoa học hành vi',
    title: 'Tính sáng tạo, 4 Điểm khác biệt & Cơ sở khoa học hành vi của EcoStay',
    keywords: [
      'sang tao',
      'tinh moi',
      'khac biet',
      'diem khac biet',
      'starwood',
      'envirotrack',
      'tuestay',
      'goldstein',
      'cialdini',
      'griskevicius',
      '49,3%',
      '37,2%',
      'chuan muc xa hoi',
      'greenview',
      'hotel footprinting tool',
      'cornell',
      '20.000',
      'phan thuong kep',
      'innovation',
      'unique',
      'different',
      'behavioral science',
      'differentiation',
      '혁신',
      '차별점',
      '행동 과학',
      '革新',
      '差別化',
      '创新',
      '差异化',
      '亮点',
    ],
    content: `Mục 4.2a — Tính mới, Khác biệt & Cơ sở khoa học:
- Thực tế thị trường đã có tiền lệ như "Make a Green Choice" của Starwood (từ 2009, đến 2020 có 23/30 thương hiệu Marriott tham gia, tặng 250–500 điểm/ngày từ chối dọn phòng), EnviroTrack Card, TueStay — nhưng các sản phẩm này chỉ làm rời rạc từng phần.
- 4 điểm khác biệt cốt lõi của App EcoStay:
  1. Tích hợp trọn vẹn trong một hệ sinh thái: theo dõi hành vi xanh (phòng, di chuyển, ăn uống), quy đổi điểm, trồng cây thật tại địa phương và tour giáo dục "Behind the Scenes" trong cùng 1 ứng dụng.
  2. Phần thưởng kép: vừa lợi ích cá nhân cho khách (voucher, bữa ăn, spa), vừa lợi ích cộng đồng (cây xanh mang tên khách).
  3. Thiết kế hành vi có cơ sở khoa học: Nghiên cứu của Goldstein, Cialdini & Griskevicius (2008) chứng minh thông điệp theo chuẩn mực xã hội ("khách ở cùng phòng đã tái sử dụng khăn") đạt tỷ lệ tái sử dụng khăn 49,3% so với 37,2% của thông điệp môi trường thông thường. Do đó app hiển thị chỉ số "% khách tuần này đã chọn không dọn phòng" và bảng xếp hạng tiết kiệm.
  4. Dữ liệu có cơ sở tham chiếu quốc tế: Tham khảo Hotel Footprinting Tool của Greenview (dữ liệu >20.000 khách sạn từ Cornell Hotel Sustainability Benchmarking Index) để tính phát thải theo địa điểm, hạng sao và số đêm.
- Rào cản sao chép cao: kết nối app + mã QR + dữ liệu điện nước + quy trình vận hành khách sạn nên đối thủ khó copy chỉ bằng tấm biển hay khuyến mãi.`,
  },
  {
    id: 'cost-saving-sustainability',
    source: 'Mục 4.2b & 4.2c - Hiệu quả tiết kiệm chi phí, Số hóa & Bền vững',
    title: 'Đổi mới giúp giảm chi phí vận hành, Số hóa & Cam kết bền vững',
    keywords: [
      'tiet kiem',
      'buong phong',
      '35 lit',
      '100 ml',
      '1,5 kwh',
      'sheraton boston',
      '141 lit',
      '50 phong',
      '115 m3',
      '4.900 kwh',
      'thuc pham',
      'lang phi',
      'wri',
      '600%',
      'sofitel bangkok',
      '60.000 usd',
      'nordic choice',
      '20%',
      '70%',
      'so hoa',
      'nhan vien buong phong',
      '91%',
      'cost saving',
      'food waste',
      'housekeeping',
      'sustainability',
      'digitalization',
      '비용 절감',
      '음식물 쓰레기',
      '지속 가능성',
      'コスト削減',
      '食品ロス',
      '节约成本',
      '食物浪费',
      '可持续发展',
    ],
    content: `Mục 4.2b & 4.2c — Hiệu quả tiết kiệm chi phí & Phát triển bền vững:
1. Tiết kiệm từ buồng phòng:
   - Nghiên cứu tại Slovenia: mỗi lần dọn phòng tốn ~35 lít nước, 100 ml hóa chất và 1,5 kWh điện.
   - Tại Sheraton Boston: mỗi đêm bỏ dọn phòng tiết kiệm 37,2 gallon (~141 lít nước), 0,19 kWh điện và 7 ounce hóa chất.
   - Ví dụ minh họa (khách sạn 50 phòng, công suất 60%, 30% khách không dọn phòng = 9 phòng/ngày): tiết kiệm ~315 lít nước và 13,5 kWh/ngày → tương đương ~115 m³ nước và 4.900 kWh điện mỗi năm (chưa kể hóa chất & nhân công).
2. Tiết kiệm từ giảm lãng phí thực phẩm:
   - Phân tích Viện Tài nguyên Thế giới (WRI) trên 42 khách sạn tại 15 quốc gia: tỷ suất lợi nhuận đầu tư (ROI) trung bình đạt 600%.
   - Sofitel Bangkok Sukhumvit giảm 50% lãng phí thực phẩm trong 15 tuần, tiết kiệm ~60.000 USD/năm.
   - Nordic Choice Hotels dùng đĩa nhỏ hơn 3 cm và biển khuyến khích lấy nhiều lần giúp giảm ~20% lãng phí.
   - Hơn 70% lãng phí thực phẩm xảy ra ở khâu chế biến trước khi tới đĩa khách → EcoStay kết hợp thưởng cho khách với cải tiến khâu bếp.
3. Chi phí thưởng thấp: voucher spa/bữa ăn tận dụng công suất dư của khách sạn nên chi phí biên thấp nhưng giá trị cảm nhận cao.
4. Số hóa & Xã hội bền vững:
   - Số hóa 100% quy trình cấp tài khoản, ghi nhận điểm, báo cáo CO2 theo tháng/nhóm khách và chia sẻ chứng nhận xanh lên MXH.
   - Bài học xã hội từ Marriott (khảo sát công đoàn cho thấy 91% nhân viên buồng phòng từng bị cắt giờ làm): Nhóm EcoStay cam kết chuyển giờ làm của nhân viên buồng phòng sang công việc khác thay vì cắt giảm, đồng thời công khai minh bạch số liệu tiết kiệm.`,
  },
  {
    id: 'market-context',
    source: 'Mục 4.3.1 - Nghiên cứu thị trường & Bối cảnh ngành khách sạn xanh',
    title: 'Quy mô thị trường Du lịch xanh & Bảng thống kê 4.3.1',
    keywords: [
      'thi truong',
      'quy mo',
      'boi canh',
      'allied market research',
      '2,16',
      '11,4',
      'cagr',
      '14,2%',
      '34%',
      '31.000',
      '80%',
      '75%',
      '17,6 trieu',
      '110 trieu',
      'un tourism',
      '15-30 kg',
      'wttc',
      '48%',
      '20-35%',
      'iot',
      'bang 4.3.1',
      'market',
      'market size',
      'industry',
      'statistics',
      'vietnam tourism',
      '시장 규모',
      '시장 조사',
      '통계',
      '市場規模',
      '市場調査',
      '市场规模',
      '市场调研',
      '行业背景',
    ],
    content: `Mục 4.3.1 — Nghiên cứu thị trường & Bảng thống kê 4.3.1:
- Thị trường toàn cầu (Allied Market Research, 2024): Du lịch sinh thái & bền vững đạt 2,16 nghìn tỷ USD (2023), dự báo đạt 11,4 nghìn tỷ USD vào năm 2032 (tốc độ tăng trưởng kép CAGR 14,2%); lưu trú xanh chiếm 34% doanh thu.
- Khảo sát Booking.com (2024) trên 31.000 du khách tại 34 quốc gia: 80% coi du lịch bền vững là quan trọng và 75% muốn ở cơ sở có chứng nhận xanh trong 12 tháng tới.
- Thị trường Việt Nam (Cục Du lịch Quốc gia, 2024): đón 17,6 triệu khách quốc tế và 110 triệu lượt khách nội địa.
- Áp lực môi trường (UN Tourism, 2023): mỗi phòng khách sạn/đêm phát thải 15–30 kg CO2, tiêu thụ điện nước gấp 2–3 lần hộ gia đình.
- Khoảng trống niềm tin (WTTC, 2023): 48% du khách khó tin các khách sạn tự gắn nhãn xanh nếu thiếu dữ liệu đo lường minh bạch.
- Hiệu quả kinh tế: Khách sạn đối tác áp dụng công nghệ xanh giảm 20–35% chi phí điện, nước và xử lý chất thải (Tạp chí Quản lý Nhà nước, 2024); 73% Gen Z & Millennials ủng hộ app du lịch xanh (Trinh et al., 2024; WTTC, 2023).`,
  },
  {
    id: 'competitors-differentiation',
    source: 'Mục 4.3.2 - Phân tích 3 nhóm đối thủ cạnh tranh & 5 điểm khác biệt',
    title: 'Phân tích đối thủ cạnh tranh & 5 lợi thế cạnh tranh của EcoStay',
    keywords: [
      'doi thu',
      'canh tranh',
      'six senses',
      'topas ecolodge',
      'ana mandara',
      'sofitel metropole',
      'accor',
      'marriott',
      'silk sense',
      'boutique',
      '400',
      '1.000',
      '40-80',
      'green globe',
      'earthcheck',
      '20.000',
      '50.000',
      'nam cat tien',
      'rung bay mau',
      'iso 14064',
      'bao cao esg',
      'ho chieu xanh',
      'competitor',
      'competitors',
      'competition',
      'advantage',
      '경쟁사',
      '경쟁 분석',
      '競合',
      '競争優位',
      '竞争对手',
      '竞品分析',
      '竞争优势',
    ],
    content: `Mục 4.3.2 — Phân tích 3 nhóm đối thủ cạnh tranh (theo phân loại HUFLIT, 2024):
1. Nhóm 1 — Resort / Ecolodge sinh thái cao cấp (Six Senses Ninh Vân Bay, Topas Ecolodge, Ana Mandara Cam Ranh):
   - Điểm mạnh: Kiến trúc hòa hợp thiên nhiên, chứng nhận uy tín, dịch vụ 5 sao.
   - Điểm yếu: Giá rất cao ($400–1.000+/đêm), vị trí biệt lập, chưa có app đo CO2 tương tác.
2. Nhóm 2 — Chuỗi khách sạn đô thị quốc tế (Sofitel Metropole, Accor, Marriott, Silk Sense Hoi An):
   - Điểm mạnh: Chuẩn ESG tập đoàn, giảm nhựa dùng 1 lần, có chứng nhận Green Globe / EarthCheck.
   - Điểm yếu: Trải nghiệm xanh thụ động, khách không nhìn thấy tác động cá nhân.
3. Nhóm 3 — Khách sạn truyền thống tự dán nhãn xanh (Boutique & hotel tầm trung):
   - Điểm mạnh: Giá cạnh tranh ($40–80/đêm).
   - Điểm yếu: Thiếu minh bạch, nguy cơ "greenwashing", không chứng nhận, không có công nghệ đo lường.

5 điểm khác biệt cạnh tranh của EcoStay:
1. Tính phát thải thời gian thực qua cảm biến IoT (điện kWh, nước lít, điều hòa, dọn phòng → quy đổi kg CO2 theo giờ/ngày).
2. Game hóa & điểm xanh (Green Points / CB) từ hành vi thực tế để đổi voucher phòng, spa, đồ uống, quà thủ công.
3. Tín chỉ CO2 & trồng cây thật: đóng góp 20.000–50.000 VNĐ trồng 1 cây tại Rừng phòng hộ Nam Cát Tiên, Rừng Bảy Mẫu, theo dõi GPS & hình ảnh qua mã QR.
4. Hộ chiếu xanh & chứng nhận số: xuất "Bản kê khai dấu chân CO2" chuẩn ISO 14064 để chia sẻ LinkedIn/Facebook/Instagram.
5. Báo cáo ESG cho doanh nghiệp: tổng hợp lượng giảm thải của đoàn công tác cho báo cáo phát triển bền vững.`,
  },
  {
    id: 'target-customers-journey',
    source: 'Mục 4.3.3 - Phân tích khách hàng mục tiêu, Hành trình & Room-to-Win',
    title: '3 Phân khúc khách hàng mục tiêu, Hành trình mua hàng & Bảng tiêu thức 4.3.2',
    keywords: [
      'khach hang',
      'phan khuc',
      'chan dung',
      'gen z',
      '18-27',
      'millennials',
      '28-45',
      'gia dinh',
      'khach quoc te',
      'chau au',
      'bac my',
      'bac a',
      'hanh trinh',
      'digital key',
      '24h zero waste',
      'behind the scenes',
      'tieu thuc',
      'trong so',
      'bang 4.3.2',
      '61-109',
      'source of growth',
      'room to win',
      'room-to-win',
      'target customer',
      'segment',
      'customer journey',
      'persona',
      '타겟 고객',
      '고객 세분화',
      '고객 여정',
      'ターゲット顧客',
      '顧客セグメント',
      '目标客户',
      '客户细分',
      '用户画像',
    ],
    content: `Mục 4.3.3 — 3 Phân khúc khách hàng mục tiêu nòng cốt:
1. Nhóm 1 — Gen Z (18–27 tuổi): Thạo công nghệ, nhạy bén xu hướng môi trường, thích Gamification ("24h Zero Waste Challenge"), check-in chứng nhận Cacbon số và chia sẻ lên TikTok/Instagram.
2. Nhóm 2 — Gia đình có trẻ em & Millennials (28–45 tuổi): Ưu tiên giá trị giáo dục trải nghiệm cho con qua tour xanh "Behind-the-Scenes", trồng cây lưu niệm gia đình, ẩm thực organic Farm-to-table; chi tiêu cao, lưu trú dài ngày.
3. Nhóm 3 — Khách hàng Quốc tế (Châu Âu, Bắc Mỹ, Bắc Á): Nhận thức ESG cao, quen Tín chỉ Cacbon, sẵn sàng trả mức giá Premium (+10–15%), yêu cầu ứng dụng đa ngôn ngữ và báo cáo dấu chân CO2 chuẩn ISO 14064.

Hành trình khách hàng 5 bước với EcoStay:
1. Nhận thức (TikTok/Instagram, KOL) → 2. Cân nhắc & đặt phòng (hiển thị CO2 dự kiến tiết kiệm, tặng mã giảm 10% tải app lần đầu) → 3. Lưu trú (check-in không giấy, Digital Key, theo dõi biểu đồ CO2, "24 Hours Green Challenge") → 4. Thanh toán & quy đổi (đổi voucher, góp 30.000 VNĐ dư trồng 1 cây, nhận chứng chỉ số qua email) → 5. Gắn kết & lan tỏa (chia sẻ chứng chỉ có GPS, cập nhật ảnh cây 3 tháng/lần kéo khách quay lại).

Bảng 4.3.2 — 4 Tiêu thức đánh giá & trọng số của khách hàng:
- Đặc tính công nghệ (30%): App mượt, UI/UX tối ưu, IoT kết nối nhanh, đo phát thải chuẩn.
- Mức giá (25%): Giá phòng mục tiêu $61–109/đêm (tầm trung cao), tặng voucher từ điểm xanh.
- Công năng khách sạn (25%): Chuẩn 4 sao, lọc khí HEPA, ẩm thực farm-to-table, sạch và tiện nghi.
- Giá trị cảm xúc & ESG (20%): Chứng nhận Cacbon số, đóng góp cây xanh thật.

Source of Growth & Room-to-Win:
- Source of Growth: (1) chuyển đổi du khách trẻ từ khách sạn truyền thống tầm trung sang mô hình xanh công nghệ; (2) thu hút khách đoàn doanh nghiệp cần báo cáo ESG.
- Room-to-Win: Ngách "khách sạn xanh giá hợp lý tích hợp công nghệ EcoStay" (giữa phân khúc 5 sao quá đắt và khách sạn nhỏ thiếu công nghệ).`,
  },
  {
    id: 'product-points-rules',
    source: 'Mục 4.4.1 - Thiết kế sản phẩm số & Quy chế tích - đổi điểm CB',
    title: 'Thiết kế sản phẩm Tài khoản EcoStay & Quy chế đổi điểm CACBON POINT (CB)',
    isDefaultOverview: true,
    keywords: [
      'quy che',
      'doi diem',
      'tich diem',
      'dinh gia',
      '1.000',
      '1000',
      'bao nhieu tien',
      'han su dung',
      '12 thang',
      'moc doi thuong',
      '100-200',
      '300-500',
      '600-1.000',
      '1.500',
      'dem mien phi',
      'spa',
      'nang hang phong',
      'tai khoan ecostay',
      'cb',
      'point rules',
      'points',
      'redeem',
      'reward tiers',
      'exchange rate',
      'expiry',
      '포인트 규정',
      '환산',
      '포인트 교환',
      'ポイント規定',
      '交換',
      '积分规则',
      '兑换',
      '有效期',
    ],
    content: `Mục 4.4.1 — Thiết kế sản phẩm số & Quy chế tích lũy - đổi điểm trong đề án:
- 4 phân hệ ứng dụng:
  1. Trang chủ: Tông xanh tối giản, hiển thị số điểm CB hiện có và chỉ số môi trường (CO2, lít nước, kWh điện tiết kiệm).
  2. Tích điểm (Nhiệm vụ Xanh): Xác nhận hành động bền vững (không dọn phòng hôm nay, đếm bước chân, quét mã QR thử thách "Zero Food Waste").
  3. Cửa hàng Quà tặng: Danh mục thời trang tái chế, ẩm thực organic, dịch vụ Spa và trồng cây.
  4. Hồ sơ & Lan tỏa: Lịch sử giao dịch và tự động xuất "Báo cáo Dấu chân sinh thái" dạng đồ họa khi check-out để chia sẻ MXH.
- Quy chế định giá & thời hạn điểm CB:
  - 1 Điểm Cacbon (CB) tương đương 1.000 VNĐ khi thanh toán/đổi dịch vụ nội khu (không có giá trị quy đổi thành tiền mặt).
  - Thời hạn hiệu lực điểm: 12 tháng.
- 4 mốc đổi thưởng theo đề án:
  - 100 – 200 CB (Quà tặng nhỏ): 1 ly cocktail/nước ép organic hoặc quà lưu niệm xanh (túi vải tái chế, bộ hạt giống).
  - 300 – 500 CB (Dịch vụ gia tăng): Voucher giảm 30% Spa thiên nhiên, ưu tiên trả phòng muộn, hoặc vé tour khám phá hệ thống vận hành xanh.
  - 600 – 1.000 CB (Đặc quyền CSR): Trồng 1 cây xanh mang tên khách tại rừng phòng hộ (theo dõi tọa độ GPS qua app) hoặc nâng hạng phòng miễn phí.
  - Trên 1.500 CB (Khách hàng thân thiết): Tặng 1 đêm lưu trú miễn phí cho kỳ nghỉ tiếp theo.
- Cách giao dịch: Quét mã QR trực tiếp tại lễ tân, nhà hàng, spa để hệ thống tự động cộng/trừ điểm theo thời gian thực.`,
  },
  {
    id: 'pricing-distribution',
    source: 'Mục 4.4.2 & 4.4.3 - Đề xuất mức giá & Kênh phân phối trực tuyến',
    title: 'Chiến lược giá (Premium Eco Rate & Green Pledge Rate) & Kênh phân phối Online',
    keywords: [
      'muc gia',
      'gia phong',
      'chien luoc gia',
      'dinh gia',
      'value-based',
      'dynamic eco-pricing',
      'premium eco rate',
      'green pledge rate',
      'cam ket xanh',
      '10% - 15%',
      '5%',
      '25 do c',
      '76%',
      '43%',
      'direct booking',
      '80% ngan sach',
      'travel sustainable',
      'eco deals',
      'agoda',
      'booking',
      'ota',
      'phan phoi',
      'pricing',
      'room rate',
      'distribution',
      'price strategy',
      '가격 전략',
      '객실 요금',
      '유통',
      '価格戦略',
      '販売チャネル',
      '定价策略',
      '房价',
      '分销渠道',
    ],
    content: `Mục 4.4.2 & 4.4.3 — Chiến lược giá & Kênh phân phối trực tuyến:
1. Chiến lược định giá (Value-based Pricing + Dynamic Eco-Pricing):
   - Cơ sở: Theo Booking.com 2023, 76% du khách toàn cầu muốn du lịch bền vững hơn và 43% sẵn sàng trả thêm tiền cho lựa chọn có chứng nhận sinh thái.
   - Giá phòng tiêu chuẩn (Premium Eco Rate): Cao hơn 10% – 15% so với khách sạn truyền thống cùng phân hạng; cam kết trích 5% doanh thu trực tiếp vào quỹ vận hành hệ thống xử lý sinh thái và duy trì dự án trồng rừng.
   - Giá linh hoạt "Cam kết Xanh" (Green Pledge Rate): Giảm ngay 5% khi đặt phòng nếu khách ký "Cam kết xanh" trực tuyến lúc thanh toán (giới hạn điều hòa ở 25°C, không thay khăn tắm mỗi ngày). Nếu vi phạm, cảm biến phòng sẽ ghi nhận và trừ điểm trong Tài khoản EcoStay.
2. Kênh phân phối trực tuyến (ưu tiên 80% ngân sách & nguồn lực cho nền tảng online):
   - Kênh Direct Booking (Website & App khách sạn — ưu tiên số 1): Khách đặt trực tiếp được nhân đôi điểm khởi tạo trong Tài khoản EcoStay; giao diện đặt phòng hiển thị bộ đếm "Số lượng CO2 bạn sẽ giúp cắt giảm" ngay cạnh nút thanh toán.
   - Kênh OTA chuyên biệt & Huy hiệu Xanh: Đạt huy hiệu "Travel Sustainable" trên Booking.com và tham gia "Eco Deals" của Agoda để thuật toán đẩy thứ hạng hiển thị cao hơn với khách tìm du lịch xanh.`,
  },
  {
    id: 'marketing-kpis',
    source: 'Mục 4.4.4 - Kế hoạch truyền thông Marketing 3 giai đoạn & Bảng KPI',
    title: 'Kế hoạch truyền thông 3 giai đoạn, Công cụ độc đáo & KPI 4 kênh Marketing',
    keywords: [
      'marketing',
      'truyen thong',
      'quang ba',
      '3 giai doan',
      'teasing',
      'invisible footprint',
      'launching',
      'your currency',
      'ty phu xanh',
      'sustaining',
      'living forest',
      'khu rung dang song',
      'real-time data storytelling',
      'eco-dashboard',
      'man hinh led',
      'social sharing',
      'infographic',
      'kpi',
      '1.000.000',
      '5%',
      'ugc',
      'pr',
      'bao chi',
      'kinh te sai gon',
      'elle',
      'travel+leisure',
      'email marketing',
      '200 diem',
      '25%',
      '3%',
      'b2b',
      'influencer',
      'tiktok',
      'instagram',
      'communication',
      'campaign',
      'kpis',
      '마케팅',
      '홍보',
      '캠페인',
      'マーケティング',
      '広報',
      '营销',
      '推广',
      '三个阶段',
    ],
    content: `Mục 4.4.4 — Kế hoạch truyền thông Marketing năm đầu & Bảng KPI:
1. Kế hoạch 3 giai đoạn:
   - Giai đoạn Teasing (Tháng 1–2) — "The Invisible Footprint - Dấu chân vô hình": Nâng nhận thức về lượng khí thải CO2 khổng lồ của kỳ nghỉ thông thường, khơi gợi tò mò.
   - Giai đoạn Launching (Tháng 3–5) — "Your EcoStay, Your Currency - Trở thành tỷ phú xanh": Ra mắt App & Tài khoản EcoStay, mỗi hành động xanh đều có "tỷ giá", mở bán gói "Behind-the-Scenes Green Tour".
   - Giai đoạn Sustaining (Tháng 6–12) — "The Living Forest - Khu rừng đang sống": Công bố báo cáo minh bạch hằng tháng về số cây đã trồng, tổ chức thi đua xanh giữa khách lưu trú.
2. Công cụ truyền thông khác biệt (Real-time Data Storytelling):
   - Màn hình LED Eco-Dashboard tại sảnh lễ tân: hiển thị trực tiếp tổng điểm EcoStay trong ngày, điện nước tiết kiệm và bản đồ định vị cây đã trồng.
   - Social Sharing (Báo cáo sinh thái cá nhân): khi check-out, app tự xuất Infographic chuẩn Story Instagram/Facebook tạo hiệu ứng truyền miệng (Word-of-mouth).
3. KPI 4 kênh truyền thông:
   - Mạng xã hội (Instagram / TikTok + Eco-Influencers / Travel Vloggers): Đạt 1.000.000 lượt tiếp cận, tỷ lệ tương tác > 5% trong giai đoạn Launching; tăng lượng UGC gắn hashtag dự án.
   - PR Báo chí ngành & Lifestyle (Kinh tế Sài Gòn, Elle, Travel+Leisure): Phân tích "Mô hình Gamification đầu tiên trong du lịch xanh tại Việt Nam"; đo số lượng bài báo và lượng traffic đổ về trang đặt phòng.
   - Email Marketing cá nhân hóa: Mời khách cũ quay lại, tặng ngay 200 điểm EcoStay nếu đặt phòng qua email; KPI tỷ lệ mở email > 25%, tỷ lệ chuyển đổi đặt phòng > 3%.
   - Đối tác chiến lược B2B: Liên kết NGO môi trường và doanh nghiệp có quỹ CSR thiết kế gói nghỉ dưỡng phát thải thấp; KPI số hợp đồng B2B ký kết và số cây xanh doanh nghiệp đồng tài trợ.`,
  },
];
