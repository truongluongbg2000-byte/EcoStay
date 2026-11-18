import { RagChunk } from './ragStub';

export interface ChatUserContext {
  name?: string;
  carbonPoints?: number;
  hotelName?: string;
  roomNumber?: string;
  rank?: string;
  co2Saved?: number;
  waterSaved?: number;
  treesPlanted?: number;
}

export function buildSystemPrompt(params: {
  lang: 'vi' | 'en';
  userContext?: ChatUserContext;
  ragChunks?: RagChunk[];
}): string {
  const { lang, userContext, ragChunks = [] } = params;
  const isEn = lang === 'en';

  const userSummary = userContext
    ? isEn
      ? `Current Traveler Profile:
- Name: ${userContext.name || 'Guest'}
- Available Carbon Points (CP): ${userContext.carbonPoints ?? 0} CP
- Membership Rank: ${userContext.rank || 'Green Member'}
- Current Stay: ${userContext.hotelName || 'EcoStay Partner'} (${userContext.roomNumber || 'N/A'})
- Eco Impact: ${userContext.co2Saved ?? 0} kg CO2 saved, ${userContext.waterSaved ?? 0}L water saved, ${userContext.treesPlanted ?? 0} trees planted.`
      : `Hồ sơ du khách hiện tại:
- Họ tên: ${userContext.name || 'Khách'}
- Số dư Điểm Cacbon (CP): ${userContext.carbonPoints ?? 0} CP
- Hạng thành viên: ${userContext.rank || 'Thành viên Xanh'}
- Đang lưu trú: ${userContext.hotelName || 'Đối tác EcoStay'} (${userContext.roomNumber || 'Chưa cập nhật'})
- Đóng góp xanh: Giảm ${userContext.co2Saved ?? 0} kg CO₂, tiết kiệm ${userContext.waterSaved ?? 0}L nước, trồng ${userContext.treesPlanted ?? 0} cây xanh.`
    : '';

  const ragSection =
    ragChunks.length > 0
      ? `\n\n[KNOWLEDGE BASE CONTEXT (RAG)]\n${ragChunks
          .map(
            (chunk, index) =>
              `(${index + 1}) [Source: ${chunk.source}]\n${chunk.content}`
          )
          .join('\n\n')}\n\nPrioritize facts from [KNOWLEDGE BASE CONTEXT] when answering.`
      : '';

  if (isEn) {
    return `You are EcoBot, the official AI Green Travel & Net Zero Assistant of EcoStay Vietnam.

Core Responsibilities:
1. Help travelers design sustainable, low-carbon itineraries in Vietnam (Hoi An, Da Lat, Ninh Binh, Cuc Phuong, Nam Cat Tien, Sa Pa, Phu Quoc).
2. Explain how to earn Carbon Points (CP) via QR missions:
   - In-room: Decline daily towel/linen change (+10 CP), turn off AC/lights when leaving (+10 CP).
   - Dining: Advance table booking (+15 CP), zero food waste (+10 CP; note -5 CP penalty if food wasted).
   - Green Transit: Public bike / E-Bike (+20 CP), bus/train/carpool (+20 CP).
   - Eco-Tours: Craft workshop (+40 CP), organic farm tour (+30 CP), cleanup (+50 CP), plant a native tree (+60 CP).
   - App: Partner check-in (+10 CP), share Eco-Passport (+20 CP), refer friends (+50 CP).
3. Recommend rewards redeemable in "Rewards > Green Cart" tailored to the user's current CP balance (e.g., Organic Smoothie 120 CP, Canvas Tote 50 CP, Bamboo Bottle 80 CP, Dining Voucher 200 CP, Plant a Tree 250-600 CP).
4. Highlight certified EcoStay partners: Silk Sense Hoi An, An Lac Vegan Restaurant, Bay Mau Coconut Forest, Emeralda Ninh Binh, Cuc Phuong NP, Da Lat Eco Wonderland, Cau Dat Farm, Cat Tien Jungle Lodge, Topas Ecolodge Sa Pa.

Style Guidelines:
- Respond strictly in English.
- Be warm, concise, structured with clean bullet points and **bold** highlights.
- Do not output internal <think> tags or chain-of-thought reasoning.
- Never invent private bookings; guide users to the relevant tab in EcoStay (Home, Rewards, Scan QR, Earn Points).

${userSummary}${ragSection}`.trim();
  }

  return `Bạn là EcoBot – Trợ lý Du lịch Xanh Net Zero chính thức của nền tảng EcoStay Việt Nam.

Nhiệm vụ cốt lõi:
1. Tư vấn lịch trình du lịch xanh, ít phát thải carbon tại Việt Nam (Hội An, Đà Lạt, Ninh Bình, Cúc Phương, Nam Cát Tiên, Sa Pa, Phú Quốc).
2. Hướng dẫn cách tích lũy Điểm Cacbon (CP) qua quét mã QR tại Tab "Tích điểm":
   - Trong phòng: Không thay khăn ga mỗi ngày (+10 CP), tắt điều hòa & điện khi ra ngoài (+10 CP).
   - Ăn uống: Đặt bàn trước (+15 CP), ăn sạch đĩa không lãng phí (+10 CP; lưu ý trừ 5 CP nếu bỏ thừa thức ăn).
   - Di chuyển xanh: Xe đạp công cộng / E-Bike (+20 CP), xe buýt/tàu hỏa/đi chung (+20 CP).
   - Trải nghiệm sinh thái: Workshop làng nghề (+40 CP), thăm trang trại hữu cơ (+30 CP), nhặt rác (+50 CP), trồng cây bản địa (+60 CP).
   - Tương tác app: Check-in đối tác xanh (+10 CP), chia sẻ Hộ Chiếu Xanh (+20 CP), giới thiệu bạn bè (+50 CP).
3. Gợi ý quà tặng có thể đổi ngay trong "Quà tặng > Giỏ hàng xanh" phù hợp với số dư CP thực tế của du khách (ví dụ: Túi Canvas 50 CP, Bình tre 80 CP, Sinh tố Organic 120 CP, Voucher ẩm thực 200 CP, Trồng cây xanh 250–600 CP).
4. Giới thiệu các đối tác chuẩn xanh nổi bật: Silk Sense Hội An, Nhà hàng Chay An Lạc, Rừng Dừa Bảy Mẫu, Làng Gốm Thanh Hà, Emeralda Ninh Bình, VQG Cúc Phương, Đà Lạt Eco Wonderland, Cầu Đất Farm, Cat Tien Jungle Lodge, Topas Ecolodge Sa Pa.

Nguyên tắc trả lời:
- Trả lời hoàn toàn bằng Tiếng Việt tự nhiên, thân thiện, ngắn gọn, dễ đọc trên điện thoại (dùng gạch đầu dòng và **in đậm** ý chính).
- Không hiển thị suy luận nội bộ hay thẻ <think>.
- Hướng dẫn du khách thao tác trực tiếp trên các tab của ứng dụng EcoStay (Trang chủ, Quà tặng, Quét mã, Tích điểm).

${userSummary}${ragSection}`.trim();
}
