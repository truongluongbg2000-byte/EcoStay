'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Compass, HelpCircle, Gift, Bike, UtensilsCrossed, Bot, RefreshCw } from 'lucide-react';
import { UserProfile } from '@/data/types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  suggestions?: string[];
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  currentLang?: 'vi' | 'en';
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  user,
  currentLang = 'vi',
}) => {
  const isEn = currentLang === 'en';
  const pointsTerm = isEn ? 'Carbon Points (CP)' : 'Điểm Cacbon (CP)';

  const initialBotMessage: Message = {
    id: 'msg-init',
    sender: 'bot',
    text: isEn
      ? `Hello ${user.name}! I am EcoBot, your AI Green Travel Assistant. I can help you plan eco-friendly itineraries (destinations, organic food, green transit) and answer anything about earning & redeeming ${pointsTerm}. How can I assist you today?`
      : `Xin chào ${user.name}! Mình là EcoBot - Trợ lý Du Lịch Xanh AI của EcoStay. Mình có thể giúp bạn lên lịch trình du lịch xanh trọn gói (đi đâu, ăn gì, đi xe gì) và giải đáp mọi thắc mắc về cách tích/đổi ${pointsTerm}. Bạn cần hỗ trợ gì nè?`,
    time: 'Vừa xong',
    suggestions: isEn
      ? [
          'Plan a 2D1N green trip in Hoi An',
          'How do I earn CP at hotels?',
          'What can I redeem with 270 CP?',
          'Best vegan & organic restaurants',
        ]
      : [
          'Lên lịch trình 2N1Đ tại Hội An xanh',
          'Làm sao để tích điểm CP khi lưu trú?',
          '270 CP của tôi đổi được quà gì?',
          'Gợi ý quán ăn thuần chay hữu cơ',
        ],
  };

  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const generateAIResponse = (query: string): { reply: string; suggestions?: string[] } => {
    const q = query.toLowerCase();

    // 1. Lên lịch trình Hội An
    if (q.includes('hội an') || q.includes('hoi an') || q.includes('lịch trình') || q.includes('itinerary')) {
      if (isEn) {
        return {
          reply: `🌿 **Eco-Friendly 2D1N Itinerary in Hoi An (Estimated: +140 CP)**:
• **Day 1**:
  - *Morning*: Check-in at **Silk Sense Hội An River Eco-Resort** (Zero-plastic hotel, +10 CP for no daily towel change).
  - *Afternoon*: Rent an **E-Bike / Green Bike** (+20 CP) to explore the Ancient Town.
  - *Dinner*: Farm-to-table dinner at **An Lạc Vegan Restaurant** in Trà Quế (+15 CP for booking via app, remember zero food waste!).
• **Day 2**:
  - *Morning*: Bamboo Basket Boat Tour at **Bảy Mẫu Coconut Forest** (+40 CP for participating in river cleanup).
  - *Afternoon*: Pottery workshop at **Thanh Hà Pottery Village** (+40 CP) and buy handmade terracotta souvenirs (+15 CP).
👉 Total earned: **+140 CP**, saving ~12.5 kg CO₂!`,
          suggestions: ['How to redeem my points?', 'Rent green bike in Hoi An'],
        };
      }
      return {
        reply: `🌿 **Gợi Ý Lịch Trình 2N1Đ Du Lịch Xanh Tại Hội An (Tích lũy ước tính +140 CP)**:

• **Ngày 1: Trải nghiệm lưu trú & ẩm thực xanh**
  - **Sáng (08:30)**: Check-in tại **Silk Sense Hội An River Eco-Resort** (Khu nghỉ không rác thải nhựa, quét mã QR phòng không thay khăn ga: **+10 CP**).
  - **Trưa (12:00)**: Thưởng thức mâm cơm thực dưỡng tại **Nhà Hàng Chay & Organic An Lạc** (Đặt bàn qua app: **+15 CP**, ăn sạch đĩa không lãng phí).
  - **Chiều (15:00)**: Mở khóa **Xe đạp điện E-Bike** vi vu phố cổ và bãi biển An Bàng (**+20 CP**).
  - **Tối (19:00)**: Dạo phố lồng đèn, ghé tiệm thảo mộc và check-in đối tác xanh (**+10 CP**).

• **Ngày 2: Hoạt động sinh thái & làng nghề thủ công**
  - **Sáng (08:00)**: Chèo thuyền thúng tại **Rừng Dừa Bảy Mẫu**, trải nghiệm gom rác bãi nổi cùng ngư dân (**+50 CP**).
  - **Chiều (14:00)**: Tham gia workshop vuốt gốm tại **Làng Gốm Thanh Hà** (**+40 CP**), mua quà lưu niệm gốm mộc (**+15 CP**).
  - **17:00**: Chia sẻ Hộ Chiếu Xanh lên mạng xã hội (**+20 CP**).

👉 **Tổng điểm tích lũy: +140 CP** và giúp cắt giảm hơn **12.5 kg CO₂**!`,
        suggestions: ['Cách đổi quà từ 270 CP', 'Quy tắc trừ điểm lãng phí', 'Lịch trình tại Cúc Phương'],
      };
    }

    // 2. Cách tích điểm / Nhiệm vụ
    if (q.includes('tích điểm') || q.includes('earn') || q.includes('nhiệm vụ') || q.includes('mission')) {
      if (isEn) {
        return {
          reply: `🌟 **How to earn Carbon Points (CP) with EcoStay**:
1. **In-Room**: Refuse daily linen change (+10 CP); Turn off AC & lights when leaving (+10 CP).
2. **Dining**: Reserve table in advance (+15 CP); Finish meal cleanly (Warning: -5 CP penalty if food wasted!).
3. **Transit**: Ride bicycle/e-bike (+20 CP); Use public bus, train or carpool (+20 CP).
4. **Eco-Tours**: Craft workshop (+40 CP); Local organic farm tour (+30 CP); Beach cleanup (+50 CP); Plant a native tree (+60 CP).
5. **App Engagement**: Partner check-in (+10 CP); Share Eco-Passport (+20 CP); Friend referral (+50 CP).
👉 All missions are verified instantly via **QR code scanning** in the "Earn Points" tab!`,
          suggestions: ['Plan a 2D1N green trip in Hoi An', 'What can I redeem with 270 CP?'],
        };
      }
      return {
        reply: `🌟 **5 Cách Tích Lũy Điểm Cacbon (CP) cùng EcoStay**:

1. 🛏️ **Trong phòng:**
   - Không thay khăn, ga mỗi ngày: **+10 CP**
   - Tắt điều hòa & điện nước khi ra ngoài: **+10 CP**
2. 🍲 **Ăn uống:**
   - Đặt bàn trước qua ứng dụng: **+15 CP**
   - Ăn hết phần, không lãng phí thức ăn: **+10 CP** *(Lưu ý: Quán phản ánh lãng phí sẽ bị trừ 5 CP)*
3. 🚲 **Di chuyển:**
   - Đi xe đạp công cộng, xe điện du lịch: **+20 CP**
   - Đi xe buýt, tàu hỏa hoặc xe đi chung: **+20 CP**
4. 🧗 **Trải nghiệm sinh thái:**
   - Workshop thủ công làng nghề: **+40 CP**
   - Mua đồ handmade, đặc sản địa phương: **+15 CP**
   - Thăm trang trại hữu cơ: **+30 CP**
   - Tham gia dọn rác bãi biển/đường mòn: **+50 CP**
   - Trồng 1 cây xanh bản địa: **+60 CP**
5. 📱 **Tương tác ứng dụng:**
   - Check-in tại đối tác xanh: **+10 CP**
   - Chia sẻ Hộ Chiếu Xanh lên MXH: **+20 CP**
   - Đánh giá có ảnh thực tế: **+15 CP**
   - Giới thiệu bạn bè cài đặt app: **+50 CP**

👉 Toàn bộ nhiệm vụ đều được ghi nhận bằng cách **Quét mã QR** tại Tab "Tích điểm"!`,
        suggestions: ['Lên lịch trình 2N1Đ tại Hội An xanh', '270 CP của tôi đổi được quà gì?'],
      };
    }

    // 3. Đổi quà / Giỏ hàng xanh
    if (q.includes('đổi') || q.includes('quà') || q.includes('redeem') || q.includes('reward') || q.includes('giỏ hàng')) {
      if (isEn) {
        return {
          reply: `🎁 **With your current 270 CP balance**, you can redeem:
• **Eco Cotton Tote Bag**: 50 CP (Free pickup at front desk)
• **Bamboo Bottle / Straw Set**: 80 CP
• **Trà Quế Organic Vegetable Basket**: 120 CP
• **Eco-Resort 200,000đ Dining Voucher**: 200 CP
• **Plant a Mangrove Tree** in your name: 250 CP

👉 After redeeming, go to **Rewards > Green Cart** to show the Barcode/QR code to staff at the venue!`,
          suggestions: ['How to use My QR Code?', 'Plan a 2D1N green trip in Hoi An'],
        };
      }
      return {
        reply: `🎁 **Với số dư 270 CP hiện tại của bạn**, bạn có thể đổi ngay:
• 🛍️ **Túi vải Canvas EcoStay tái sinh**: 50 CP
• 🎋 **Bộ bình tre & ống hút cỏ bàng**: 80 CP
• 🥗 **Giỏ rau củ hữu cơ Trà Quế 3kg**: 120 CP
• 🎟️ **Voucher ẩm thực 200.000đ tại resort**: 200 CP
• 🌲 **Tài trợ trồng 1 cây bần chua tại rừng ngập mặn**: 250 CP

👉 Sau khi đổi, quà sẽ được lưu tại mục **"Giỏ hàng xanh"** trong Tab Quà Tặng kèm mã Barcode/QR để nhân viên quét xác nhận!`,
        suggestions: ['Lên lịch trình 2N1Đ tại Hội An xanh', 'Làm sao để tích điểm CP khi lưu trú?'],
      };
    }

    // 4. Mặc định
    if (isEn) {
      return {
        reply: `🌿 EcoBot is here to assist! I can help you:
1. Recommend certified green hotels, organic dining, and bike rentals.
2. Build custom eco-travel itineraries.
3. Guide you through earning Carbon Points via QR codes and redeeming them in your Green Cart.
Feel free to ask me anything!`,
        suggestions: ['Plan a 2D1N green trip in Hoi An', 'How do I earn CP at hotels?'],
      };
    }

    return {
      reply: `🌿 EcoBot luôn sẵn sàng đồng hành cùng bạn trên hành trình du lịch bền vững! Bạn có thể hỏi mình:
1. Gợi ý khách sạn xanh, quán ăn hữu cơ, điểm thuê xe đạp điện tại Hội An, Đà Lạt, Cúc Phương...
2. Tự động lên lịch trình du lịch xanh 1-3 ngày kèm ước tính điểm thưởng CP.
3. Cách quét mã QR để tích điểm hoặc dùng điểm đổi quà trong Giỏ hàng xanh.
Bạn hãy chọn gợi ý hoặc gõ câu hỏi bên dưới nhé!`,
      suggestions: ['Lên lịch trình 2N1Đ tại Hội An xanh', 'Làm sao để tích điểm CP khi lưu trú?', '270 CP của tôi đổi được quà gì?'],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Vừa xong',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(text);
      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: response.reply,
        time: 'Vừa xong',
        suggestions: response.suggestions,
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left">
        {/* Header with Circular Robot Avatar */}
        <div className="bg-gradient-to-r from-[#1E4D3E] via-[#245D4B] to-[#16392E] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-full border-2 border-emerald-300 overflow-hidden shadow bg-emerald-950 flex items-center justify-center">
              <img
                src="/chatbot-avatar.png"
                alt="EcoBot Avatar"
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback if image not rendered
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <Bot size={24} className="text-emerald-300 absolute" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">EcoBot AI</h3>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-emerald-200">
                {isEn ? 'Green Travel & Points AI Assistant' : 'Trợ Lý Du Lịch Xanh & Điểm Thưởng'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-xs">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-start gap-2 max-w-[88%]">
                  {!isUser && (
                    <div className="h-7 w-7 rounded-full overflow-hidden shrink-0 border border-emerald-300 bg-[#1E4D3E]">
                      <img
                        src="/chatbot-avatar.png"
                        alt="EcoBot"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-3 shadow-xs leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-[#1E4D3E] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                {/* Quick suggestions if provided */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pl-9">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(sug)}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-[#1E4D3E] hover:bg-emerald-100 transition-colors shadow-2xs"
                      >
                        💡 {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
              <span>EcoBot đang soạn câu trả lời...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="border-t border-slate-200 bg-white p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isEn ? 'Ask EcoBot anything...' : 'Hỏi EcoBot về lịch trình, cách tích điểm...'}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#1E4D3E] text-white shadow-sm hover:bg-[#16392E] disabled:opacity-40 transition-all shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
