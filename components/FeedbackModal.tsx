'use client';

import React, { useState } from 'react';
import { X, MessageSquareQuote, Star, CheckCircle2, Sparkles } from 'lucide-react';
import { getDictionary, Lang } from '@/lib/i18n';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (comment: string, rating: number) => void;
  currentLang?: Lang;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmitFeedback,
  currentLang = 'vi',
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const t = getDictionary(currentLang);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFeedback(comment, rating);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl overflow-hidden max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
          aria-label={t.common.close}
        >
          <X size={16} />
        </button>

        {submitted ? (
          <div className="py-8 text-center animate-fadeIn">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-800">
              {t.modals.feedback.successTitle}
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              {t.modals.feedback.successDesc}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="text-left">
            <div className="flex items-center gap-2 border-b pb-3 pr-6">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <MessageSquareQuote size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {t.modals.feedback.title}
                </h3>
                <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-500 shrink-0" />
                  <span>{t.modals.feedback.subtitle}</span>
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-bold text-slate-700">
                {t.modals.feedback.ratingLabel}
              </label>
              <div className="mt-1 flex gap-1.5 justify-center py-2 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={24}
                      fill={star <= rating ? '#f59e0b' : 'none'}
                      stroke={star <= rating ? '#f59e0b' : '#cbd5e1'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t.modals.feedback.placeholder}
                rows={3}
                required
                className="mt-1 w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-[#1E4D3E] focus:outline-none"
              />
            </div>

            <p className="mt-2 text-[10px] text-slate-400 text-center">
              {t.modals.feedback.hotlineLabel}
            </p>

            <button
              type="submit"
              className="mt-3 w-full rounded-2xl bg-[#1E4D3E] py-2.5 text-xs font-bold text-white shadow hover:bg-[#16392E]"
            >
              {t.modals.feedback.submitBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
