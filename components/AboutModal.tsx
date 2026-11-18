'use client';

import React from 'react';
import { X, TreePine, ShieldCheck, Scale, Award } from 'lucide-react';
import { getDictionary, Lang } from '@/lib/i18n';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Lang;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, currentLang = 'vi' }) => {
  if (!isOpen) return null;
  const t = getDictionary(currentLang);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <TreePine size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {t.modals.about.title}
              </h3>
              <p className="text-[10px] text-emerald-700 font-semibold">
                {t.modals.about.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
            aria-label={t.common.close}
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto space-y-3.5 text-left text-xs text-slate-600 leading-relaxed">
          <div className="rounded-2xl bg-emerald-50/70 p-3 border border-emerald-100">
            <h4 className="font-bold text-[#1E4D3E] flex items-center gap-1.5 mb-1">
              <Award size={14} className="text-amber-500" />
              <span>{t.modals.about.missionHeading}</span>
            </h4>
            <p className="text-[11px]">{t.modals.about.missionDesc}</p>
          </div>

          <div>
            <h5 className="font-bold text-slate-800 flex items-center gap-1 mb-1">
              <Scale size={13} className="text-emerald-700" />
              <span>{t.modals.about.pointRulePrefix}</span>
            </h5>
            <p className="text-[11px]">{t.modals.about.pointRuleDesc}</p>
          </div>

          <div>
            <h5 className="font-bold text-slate-800 flex items-center gap-1 mb-1">
              <ShieldCheck size={13} className="text-emerald-700" />
              <span>{t.modals.about.esgHeading}</span>
            </h5>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
              {t.modals.about.esgItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-2 text-[10px] text-slate-400">
            {t.modals.about.footerTeam}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-semibold text-white hover:bg-[#16392E]"
        >
          {t.common.close}
        </button>
      </div>
    </div>
  );
};
