'use client';

import React from 'react';
import { X, Handshake, ExternalLink, ShieldCheck } from 'lucide-react';

interface PartnersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnersModal: React.FC<PartnersModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const partnerGroups = [
    {
      group: 'Giao thông & Phương tiện xanh',
      partners: [
        { name: 'VinFast', desc: 'Xe máy điện & trạm sạc phủ khắp resort', tag: 'Xe điện' },
        { name: 'Xanh SM', desc: 'Dịch vụ taxi điện thuần 100% ưu đãi 15%', tag: 'Taxi Xanh' },
        { name: 'TNGo', desc: 'Hệ thống trạm xe đạp công cộng thông minh', tag: 'Xe đạp' },
      ],
    },
    {
      group: 'Quỹ bảo tồn & Trồng rừng',
      partners: [
        { name: 'WWF Việt Nam', desc: 'Tổ chức Quốc tế về Bảo tồn Thiên nhiên', tag: 'Bảo tồn' },
        { name: 'Trung tâm Bảo tồn Gaia', desc: 'Đồng hành trồng rừng Cúc Phương & Cát Tiên', tag: 'Trồng rừng' },
        { name: 'PanNature', desc: 'Bảo tồn đa dạng sinh học và sinh kế bản địa', tag: 'Đa dạng sinh học' },
      ],
    },
    {
      group: 'Công nghệ & Thanh toán tích điểm',
      partners: [
        { name: 'MoMo / ZaloPay / VNPay', desc: 'Cổng thanh toán và tích điểm CB không tiền mặt', tag: 'Fintech' },
        { name: 'Google Maps API', desc: 'Đo lường cự ly và tối ưu hóa lộ trình phát thải', tag: 'Bản đồ' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Handshake size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Đối Tác Đồng Hành</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto space-y-4 text-left">
          {partnerGroups.map((grp, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-bold text-[#1E4D3E] uppercase tracking-wider mb-2">
                {grp.group}
              </h4>
              <div className="space-y-2">
                {grp.partners.map((p, pIdx) => (
                  <div
                    key={pIdx}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{p.name}</span>
                        <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-800">
                          {p.tag}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-semibold text-white hover:bg-[#16392E]"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
