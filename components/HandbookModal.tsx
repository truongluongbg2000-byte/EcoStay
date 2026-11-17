'use client';

import React from 'react';
import { X, BookOpen, Leaf, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

interface HandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: 'vi' | 'en';
}

export const HandbookModal: React.FC<HandbookModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'vi',
}) => {
  if (!isOpen) return null;
  const isEn = currentLang === 'en';

  const tips = isEn
    ? [
        {
          title: 'Reuse Towels & Bedding',
          desc: 'Keeping towels dry and reusing them during your stay saves 35L of water and prevents laundry chemicals from polluting local waterways.',
          icon: <Leaf className="text-emerald-600" size={16} />,
        },
        {
          title: 'Set AC to Optimal 25°C',
          desc: 'Each 1°C increase saves 7-10% in power consumption while creating a comfortable sleeping climate.',
          icon: <Sparkles className="text-emerald-600" size={16} />,
        },
        {
          title: 'Zero Food Waste - Clean Plate',
          desc: 'Take only what you need at buffets. Food waste decomposing in landfills is a primary driver of methane gas emissions.',
          icon: <CheckCircle2 className="text-emerald-600" size={16} />,
        },
        {
          title: 'Support Local Artisans & Farmers',
          desc: 'Prioritize farm-to-table organic meals and handmade indigenous craft products to sustain local livelihoods.',
          icon: <HeartHandshake className="text-emerald-600" size={16} />,
        },
      ]
    : [
        {
          title: 'Tái sử dụng khăn & ga trải giường',
          desc: 'Giữ khăn tắm khô ráo và sử dụng lại trong kỳ nghỉ giúp giảm 35L nước và hạn chế lượng hóa chất giặt tẩy thải ra hệ sinh thái.',
          icon: <Leaf className="text-emerald-600" size={16} />,
        },
        {
          title: 'Nhiệt độ phòng lý tưởng 25°C',
          desc: 'Mỗi 1°C tăng lên giúp tiết kiệm tới 7-10% điện năng tiêu thụ của điều hòa, tạo bầu không khí dễ chịu cho giấc ngủ.',
          icon: <Sparkles className="text-emerald-600" size={16} />,
        },
        {
          title: 'Zero Food Waste - Ăn sạch đĩa',
          desc: 'Chỉ lấy lượng thức ăn vừa đủ tại quầy buffet. Lãng phí thực phẩm là một trong những nguyên nhân hàng đầu tạo ra khí Methane.',
          icon: <CheckCircle2 className="text-emerald-600" size={16} />,
        },
        {
          title: 'Hỗ trợ nông sản & văn hóa bản địa',
          desc: 'Ưu tiên trải nghiệm các sản phẩm thủ công hữu cơ và ẩm thực farm-to-table của người dân địa phương.',
          icon: <HeartHandshake className="text-emerald-600" size={16} />,
        },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <BookOpen size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {isEn ? 'Eco-Living Handbook' : 'Cẩm Nang Sống Xanh'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500 text-left">
          {isEn
            ? 'Your mindful travel choices create lasting impact towards Vietnam’s Net Zero 2050 vision.'
            : 'Những thói quen nhỏ của bạn trong mỗi chuyến đi sẽ tạo nên tác động to lớn cho mục tiêu Net Zero 2050 của Việt Nam.'}
        </p>

        <div className="mt-4 space-y-3 text-left">
          {tips.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-emerald-50/60 p-3.5 border border-emerald-100/80 transition-all hover:bg-emerald-50"
            >
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs mb-1">
                {t.icon}
                <span>{t.title}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed pl-6">{t.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-semibold text-white hover:bg-[#16392E]"
        >
          {isEn ? 'Understood & Go Green' : 'Đã hiểu & Sẵn sàng sống xanh'}
        </button>
      </div>
    </div>
  );
};
