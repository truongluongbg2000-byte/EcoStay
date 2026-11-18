'use client';

import React from 'react';
import { X, BookOpen, Leaf, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';
import { getDictionary, Lang } from '@/lib/i18n';

interface HandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Lang;
}

export const HandbookModal: React.FC<HandbookModalProps> = ({
  isOpen,
  onClose,
  currentLang = 'vi',
}) => {
  if (!isOpen) return null;
  const t = getDictionary(currentLang);

  const stepIcons = [
    <Leaf key="0" className="text-emerald-600 shrink-0" size={16} />,
    <Sparkles key="1" className="text-emerald-600 shrink-0" size={16} />,
    <CheckCircle2 key="2" className="text-emerald-600 shrink-0" size={16} />,
    <HeartHandshake key="3" className="text-emerald-600 shrink-0" size={16} />,
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
              {t.modals.handbook.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
            aria-label={t.common.close}
          >
            <X size={16} />
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500 text-left">
          {t.modals.handbook.subtitle}
        </p>

        <div className="mt-4 space-y-3 text-left">
          {t.modals.handbook.steps.map((step, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-emerald-50/60 p-3.5 border border-emerald-100/80 transition-all hover:bg-emerald-50"
            >
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs mb-1">
                {stepIcons[idx % stepIcons.length]}
                <span>{step.title}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed pl-6">{step.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-semibold text-white hover:bg-[#16392E]"
        >
          {t.common.done}
        </button>
      </div>
    </div>
  );
};
