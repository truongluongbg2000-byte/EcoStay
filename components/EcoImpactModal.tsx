'use client';

import React, { useRef, useState } from 'react';
import { X, Download, Share2, Award, TreePine, Droplets, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { UserProfile } from '@/data/types';

interface EcoImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  currentLang?: 'vi' | 'en';
}

export const EcoImpactModal: React.FC<EcoImpactModalProps> = ({
  isOpen,
  onClose,
  user,
  currentLang = 'vi',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isEn = currentLang === 'en';

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1E4D3E',
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `EcoStay_Impact_${user.name.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: isEn ? 'EcoStay Green Passport' : 'Hộ Chiếu Sinh Thái EcoStay',
          text: isEn
            ? `I reduced ${user.co2Saved} kg CO₂ and planted ${user.treesPlanted} native trees with EcoStay!`
            : `Tôi vừa giảm được ${user.co2Saved} kg CO₂ và đóng góp ${user.treesPlanted} cây xanh cùng EcoStay!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        isEn
          ? `🌿 I just reduced ${user.co2Saved} kg CO₂ and contributed ${user.treesPlanted} trees with EcoStay! Join eco-tourism at: ${window.location.origin}`
          : `🌿 Tôi vừa đồng hành cùng EcoStay giảm ${user.co2Saved} kg CO₂ và đóng góp ${user.treesPlanted} cây xanh cho Trái Đất! Trải nghiệm du lịch xanh tại: ${window.location.origin}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#F8FAF8] p-4 shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/20 p-2 text-white hover:bg-black/30 transition-colors"
          aria-label={isEn ? 'Close' : 'Đóng'}
        >
          <X size={18} />
        </button>

        {/* The Card for capture */}
        <div
          ref={cardRef}
          className="relative rounded-2xl bg-gradient-to-b from-[#1E4D3E] via-[#16392E] to-[#0F2820] p-6 text-white shadow-xl overflow-hidden"
        >
          {/* Background Decorative Rings */}
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

          {/* Top Badge */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                <TreePine className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                  EcoStay Official
                </p>
                <p className="text-[10px] text-white/60">
                  {isEn ? 'Certified Green Impact' : 'Chứng Nhận Tác Động Xanh'}
                </p>
              </div>
            </div>
            <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-medium text-emerald-300 border border-emerald-500/30">
              ISO 14064
            </div>
          </div>

          {/* User Section */}
          <div className="mt-5 text-center">
            <div className="mx-auto h-16 w-16 overflow-hidden rounded-full border-2 border-emerald-400/60 p-0.5 shadow-lg">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <h3 className="mt-3 text-lg font-bold text-white tracking-wide">{user.name}</h3>
            <div className="inline-flex items-center gap-1.5 mt-1 rounded-full bg-white/10 px-3 py-0.5 text-xs text-emerald-200">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span>
                {isEn ? 'Tier: Sprout Tier' : `Hạng: ${user.rank}`}
              </span>
            </div>
            <p className="mt-2 text-xs text-emerald-100/70 italic">
              {isEn
                ? `"Proudly practiced sustainable habits during stay at ${user.hotelName}"`
                : `"Đã đồng hành thực hành lối sống bền vững trong kỳ lưu trú tại ${user.hotelName}"`}
            </p>
          </div>

          {/* Main 3 Metrics */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-white/5 border border-white/10 p-2.5 backdrop-blur-md">
              <div className="flex justify-center text-emerald-400 mb-1">
                <ShieldCheck size={18} />
              </div>
              <p className="text-base font-extrabold text-white">{user.co2Saved}</p>
              <p className="text-[10px] text-emerald-200/80">
                {isEn ? 'kg CO₂ saved' : 'kg CO₂ giảm'}
              </p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-2.5 backdrop-blur-md">
              <div className="flex justify-center text-cyan-300 mb-1">
                <Droplets size={18} />
              </div>
              <p className="text-base font-extrabold text-white">{user.waterSaved}L</p>
              <p className="text-[10px] text-cyan-200/80">
                {isEn ? 'Water saved' : 'Nước tiết kiệm'}
              </p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-2.5 backdrop-blur-md">
              <div className="flex justify-center text-amber-400 mb-1">
                <Zap size={18} />
              </div>
              <p className="text-base font-extrabold text-white">{user.energySaved}</p>
              <p className="text-[10px] text-amber-200/80">
                {isEn ? 'kWh clean' : 'kWh Điện sạch'}
              </p>
            </div>
          </div>

          {/* Tree Contribution Banner */}
          <div className="mt-4 rounded-xl bg-gradient-to-r from-emerald-900/60 to-emerald-800/40 border border-emerald-500/30 p-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
              <TreePine size={22} />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white">
                {isEn
                  ? `Contributed: ${user.treesPlanted} Native Trees`
                  : `Đóng góp: ${user.treesPlanted} Cây Bách Xanh`}
              </p>
              <p className="text-[10px] text-emerald-200/70">
                Cuc Phuong NP (Coord: 20.3188° N, 105.6042° E)
              </p>
            </div>
          </div>

          {/* Card Footer */}
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-white/50">
            <span>
              {isEn ? 'Auth Code:' : 'Mã xác thực:'} ECO-{Date.now().toString().slice(-6)}
            </span>
            <span>ecostay.vn/verify</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-white py-3 text-xs font-bold text-[#1E4D3E] shadow-sm hover:bg-emerald-50 active:scale-95 transition-all border border-slate-200"
          >
            <Download size={15} />
            <span>
              {downloading
                ? isEn
                  ? 'Saving...'
                  : 'Đang tải...'
                : isEn
                ? 'Download Image'
                : 'Tải Ảnh Infographic (PNG)'}
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#1E4D3E] py-3 text-xs font-bold text-white shadow-md hover:bg-[#16392E] active:scale-95 transition-all"
          >
            <Share2 size={15} />
            <span>
              {copied
                ? isEn
                  ? 'Copied Link!'
                  : 'Đã copy link!'
                : isEn
                ? 'Share to Story'
                : 'Chia Sẻ Lên Story'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
