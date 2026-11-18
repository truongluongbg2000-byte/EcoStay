'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Send,
  Bot,
  RefreshCw,
  Square,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '@/data/types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  suggestions?: string[];
  isError?: boolean;
  errorCode?: string;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  currentLang?: 'vi' | 'en';
}

function formatCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Lightweight safe Markdown renderer for **bold**, *italic*, and `code` spans.
 */
function renderFormattedLine(line: string, lineIdx: number): React.ReactNode {
  const tokens = line.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return (
    <React.Fragment key={lineIdx}>
      {tokens.map((token, idx) => {
        if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
          return (
            <strong key={idx} className="font-bold text-slate-900">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
          return (
            <code
              key={idx}
              className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-emerald-800"
            >
              {token.slice(1, -1)}
            </code>
          );
        }
        if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
          return (
            <em key={idx} className="italic">
              {token.slice(1, -1)}
            </em>
          );
        }
        return <React.Fragment key={idx}>{token}</React.Fragment>;
      })}
    </React.Fragment>
  );
}

function renderMessageText(text: string, isUser: boolean): React.ReactNode {
  if (isUser) return text;

  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} className="h-1.5" />;
    }
    if (trimmed.startsWith('### ')) {
      return (
        <div key={idx} className="font-extrabold text-[#1E4D3E] text-[12px] mt-1.5 mb-0.5">
          {renderFormattedLine(trimmed.slice(4), idx)}
        </div>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <div key={idx} className="font-extrabold text-[#1E4D3E] text-[13px] mt-1.5 mb-0.5">
          {renderFormattedLine(trimmed.slice(3), idx)}
        </div>
      );
    }
    return (
      <div key={idx} className="leading-relaxed">
        {renderFormattedLine(line, idx)}
      </div>
    );
  });
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  user,
  currentLang = 'vi',
}) => {
  const isEn = currentLang === 'en';
  const pointsTerm = isEn ? 'Carbon Points (CP)' : 'Điểm Cacbon (CP)';

  const buildWelcomeMessage = useCallback((): Message => {
    const cp = user.carbonPoints;
    return {
      id: 'msg-init',
      sender: 'bot',
      text: isEn
        ? `Hello **${user.name}**! I am **EcoBot**, your AI Green Travel Assistant powered by OpenRouter. I can help you plan low-carbon trips in Vietnam and maximize your **${cp} ${pointsTerm}**. How can I help you today?`
        : `Xin chào **${user.name}**! Mình là **EcoBot** – Trợ lý Du Lịch Xanh AI kết nối trực tiếp OpenRouter. Mình có thể giúp bạn lên lịch trình du lịch xanh và tư vấn tối ưu **${cp} ${pointsTerm}** hiện có. Bạn cần hỗ trợ gì nào?`,
      time: isEn ? 'Just now' : 'Vừa xong',
      suggestions: isEn
        ? [
            'Plan a 2D1N green trip in Hoi An',
            'How do I earn CP at hotels?',
            `What can I redeem with ${cp} CP?`,
            'Best vegan & organic restaurants',
          ]
        : [
            'Lên lịch trình 2N1Đ tại Hội An xanh',
            'Làm sao để tích điểm CP khi lưu trú?',
            `${cp} CP của tôi đổi được quà gì?`,
            'Gợi ý quán ăn thuần chay hữu cơ',
          ],
    };
  }, [isEn, pointsTerm, user.carbonPoints, user.name]);

  const [messages, setMessages] = useState<Message[]>(() => [buildWelcomeMessage()]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [buildWelcomeMessage()];
      }
      return prev;
    });
  }, [buildWelcomeMessage]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 80);
    }
  }, [messages, isOpen]);

  // Abort active stream if modal closes
  useEffect(() => {
    if (!isOpen && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatFriendlyError = (code?: string, rawMessage?: string): string => {
    if (code === 'MISSING_API_KEY') {
      return isEn
        ? 'OpenRouter API key is not configured yet. Please paste your key into `OPENROUTER_API_KEY` inside `.env.local` and restart `npm run dev`.'
        : 'Chưa cấu hình khóa OpenRouter API. Bạn hãy dán API Key vào biến `OPENROUTER_API_KEY` trong file `.env.local` rồi khởi động lại `npm run dev` nhé!';
    }
    if (code === 'INVALID_API_KEY') {
      return isEn
        ? 'Your OpenRouter API key is invalid or expired. Please check `OPENROUTER_API_KEY` in `.env.local`.'
        : 'Khóa `OPENROUTER_API_KEY` không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại tại openrouter.ai/keys.';
    }
    if (code === 'RATE_LIMITED') {
      return isEn
        ? 'The free model (`inclusionai/ling-3.2-flash:free`) is currently rate-limited. Please wait a few seconds and tap Retry.'
        : 'Model miễn phí (`inclusionai/ling-3.2-flash:free`) đang tạm quá tải (HTTP 429). Vui lòng đợi vài giây rồi bấm Thử lại nhé!';
    }
    if (code === 'MODEL_NOT_FOUND') {
      return isEn
        ? 'The configured OpenRouter model ID was not found. Please verify `OPENROUTER_MODEL` in `.env.local`.'
        : 'Không tìm thấy mã model trong `OPENROUTER_MODEL`. Vui lòng kiểm tra lại tên model trên OpenRouter.';
    }
    return isEn
      ? `Unable to reach EcoBot AI (${rawMessage || 'Network error'}). Please try again.`
      : `Không thể kết nối EcoBot AI (${rawMessage || 'Lỗi mạng'}). Vui lòng bấm Thử lại.`;
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  const handleResetChat = () => {
    handleStopStreaming();
    setLastFailedPrompt(null);
    setMessages([buildWelcomeMessage()]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text || isStreaming) return;

    setLastFailedPrompt(null);

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      time: formatCurrentTime(),
    };

    const botMsgId = `msg-bot-${Date.now() + 1}`;
    const placeholderBotMsg: Message = {
      id: botMsgId,
      sender: 'bot',
      text: '',
      time: formatCurrentTime(),
    };

    // Build history payload (exclude welcome message & previous error bubbles)
    const historyPayload = [
      ...messages
        .filter((m) => m.id !== 'msg-init' && !m.isError && m.text.trim().length > 0)
        .map((m) => ({
          role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.text,
        })),
      { role: 'user' as const, content: text },
    ];

    setMessages((prev) => [...prev, userMsg, placeholderBotMsg]);
    if (!textToSend) setInputText('');
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          lang: currentLang,
          userContext: {
            name: user.name,
            carbonPoints: user.carbonPoints,
            hotelName: user.hotelName,
            roomNumber: user.roomNumber,
            rank: user.rank,
            co2Saved: user.co2Saved,
            waterSaved: user.waterSaved,
            treesPlanted: user.treesPlanted,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errCode = 'UPSTREAM_ERROR';
        let errMessage = `HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          errCode = errJson.code || errCode;
          errMessage = errJson.error || errMessage;
        } catch {
          // ignore
        }

        setLastFailedPrompt(text);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? {
                  ...m,
                  text: formatFriendlyError(errCode, errMessage),
                  isError: true,
                  errorCode: errCode,
                }
              : m
          )
        );
        return;
      }

      if (!response.body) {
        throw new Error('Empty response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });
        const currentText = accumulated;
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, text: currentText } : m))
        );
      }

      accumulated += decoder.decode();
      if (!accumulated.trim()) {
        setLastFailedPrompt(text);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? {
                  ...m,
                  text: isEn
                    ? 'The model returned an empty response. Please try again.'
                    : 'Model không trả về nội dung. Bạn vui lòng bấm Thử lại nhé!',
                  isError: true,
                }
              : m
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId ? { ...m, text: accumulated.trim() } : m
          )
        );
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        // User stopped stream manually; keep partial text or clean up empty bubble
        setMessages((prev) =>
          prev.filter((m) => !(m.id === botMsgId && !m.text.trim()))
        );
        return;
      }

      const msg = error instanceof Error ? error.message : 'Network error';
      setLastFailedPrompt(text);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId
            ? {
                ...m,
                text: formatFriendlyError('NETWORK_ERROR', msg),
                isError: true,
              }
            : m
        )
      );
    } finally {
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
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
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <Bot size={24} className="text-emerald-300 absolute" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">EcoBot AI</h3>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-200 flex items-center gap-0.5">
                  <Sparkles size={9} className="text-amber-300" />
                  Ling 3.2
                </span>
              </div>
              <p className="text-[10px] text-emerald-200">
                {isEn
                  ? 'OpenRouter Live AI • Green Travel Assistant'
                  : 'OpenRouter AI • Trợ Lý Du Lịch Xanh'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              className="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
              title={isEn ? 'New conversation' : 'Làm mới cuộc trò chuyện'}
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
              title={isEn ? 'Close' : 'Đóng'}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-xs">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isEmptyPending = !isUser && !msg.text && isStreaming;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-start gap-2 max-w-[90%]">
                  {!isUser && (
                    <div className="h-7 w-7 rounded-full overflow-hidden shrink-0 border border-emerald-300 bg-[#1E4D3E] flex items-center justify-center relative">
                      <img
                        src="/chatbot-avatar.png"
                        alt="EcoBot"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <Bot size={14} className="text-emerald-200 absolute -z-10" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-3 shadow-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#1E4D3E] text-white rounded-tr-none whitespace-pre-line'
                        : msg.isError
                        ? 'bg-amber-50 text-amber-950 border border-amber-200 rounded-tl-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    {isEmptyPending ? (
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                        <span>
                          {isEn ? 'EcoBot is thinking...' : 'EcoBot đang trả lời...'}
                        </span>
                      </div>
                    ) : (
                      <>
                        {msg.isError && (
                          <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1">
                            <AlertCircle size={13} />
                            <span>{isEn ? 'Connection Notice' : 'Thông báo kết nối'}</span>
                          </div>
                        )}
                        <div>{renderMessageText(msg.text, isUser)}</div>
                        {msg.isError && lastFailedPrompt && !isStreaming && (
                          <button
                            onClick={() => handleSendMessage(lastFailedPrompt)}
                            className="mt-2 inline-flex items-center gap-1 rounded-xl bg-[#1E4D3E] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-[#16392E] transition-colors"
                          >
                            <RotateCcw size={11} />
                            <span>{isEn ? 'Retry' : 'Thử lại'}</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Quick suggestions if provided */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pl-9">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        disabled={isStreaming}
                        onClick={() => handleSendMessage(sug)}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-[#1E4D3E] hover:bg-emerald-100 disabled:opacity-50 transition-colors shadow-2xs"
                      >
                        💡 {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
              disabled={isStreaming}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isEn
                  ? 'Ask EcoBot anything...'
                  : 'Hỏi EcoBot về lịch trình, cách tích điểm...'
              }
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none disabled:opacity-60 transition-all"
            />
            {isStreaming ? (
              <button
                type="button"
                onClick={handleStopStreaming}
                className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-sm hover:bg-rose-700 transition-all shrink-0"
                title={isEn ? 'Stop generating' : 'Dừng trả lời'}
              >
                <Square size={13} className="fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#1E4D3E] text-white shadow-sm hover:bg-[#16392E] disabled:opacity-40 transition-all shrink-0"
                title={isEn ? 'Send' : 'Gửi'}
              >
                <Send size={15} />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
