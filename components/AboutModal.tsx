'use client';

import React from 'react';
import { X, TreePine, ShieldCheck, Scale, Award } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <TreePine size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Về CACBON POINT</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto space-y-3.5 text-left text-xs text-slate-600 leading-relaxed">
          <div className="rounded-2xl bg-emerald-50/70 p-3 border border-emerald-100">
            <h4 className="font-bold text-[#1E4D3E] flex items-center gap-1.5 mb-1">
              <Award size={14} className="text-amber-500" />
              <span>Chương trình Du lịch Xanh Tiên Phong</span>
            </h4>
            <p className="text-[11px]">
              Tài khoản EcoStay / CACBON POINT là sáng kiến thuộc đề án tham dự cuộc thi ThangLong Business & Marketing Challenge Season 5 “Kỳ Tích”, được phát triển bởi nhóm sinh viên Tinh Hà Say Hi - Trường Đại học Thăng Long.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-slate-800 flex items-center gap-1 mb-1">
              <Scale size={13} className="text-emerald-700" />
              <span>Quy tắc chuyển đổi điểm thưởng:</span>
            </h5>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              <li><strong>1 CACBON POINT (CB) = 1.000 VNĐ</strong> giá trị đổi dịch vụ nội khu.</li>
              <li>Điểm có hiệu lực <strong>12 tháng</strong> kể từ ngày phát sinh giao dịch.</li>
              <li>Điểm tích lũy không có giá trị quy đổi thành tiền mặt nhưng có thể quy đổi sang cây xanh trồng tại rừng phòng hộ hoặc voucher dịch vụ đối tác.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-800 flex items-center gap-1 mb-1">
              <ShieldCheck size={13} className="text-emerald-700" />
              <span>Chuẩn mực đo lường quốc tế:</span>
            </h5>
            <p className="text-[11px]">
              Hệ số quy đổi phát thải khí nhà kính dựa trên hướng dẫn của Ủy ban Liên chính phủ về Biến đổi Khí hậu (IPCC), tiêu chuẩn kiểm kê ISO 14064 và dữ liệu của Bộ Tài nguyên & Môi trường Việt Nam.
            </p>
          </div>

          <div className="border-t pt-2 text-[10px] text-slate-400">
            Bản quyền đề án thuộc về Nhóm Tinh Hà Say Hi (Hà Thị Yến Nhi, Nguyễn Thị Phương Oanh, Mạc Văn Huy, Trương Thế Lương, Ngô Hoàng Nguyên).
          </div>
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
