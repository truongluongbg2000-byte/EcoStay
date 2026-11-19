'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Send,
  Bot,
  Square,
  AlertCircle,
  RotateCcw,
  Sparkles,
  PanelLeft,
  SquarePen,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { UserProfile } from '@/data/types';
import { formatText, getDictionary, getLanguageMeta, Lang } from '@/lib/i18n';
import {
  ChatSession,
  StoredChatMessage,
  loadStoredSessions,
  saveStoredSessions,
  loadActiveSessionId,
  saveActiveSessionId,
  createNewSession,
  generateSessionTitle,
} from '@/lib/ai/chatStorage';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  currentLang?: Lang;
}

function renderFormattedLine(line: string, lineIdx: number): React.ReactNode {
  const tokens = line.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return (
    <React.Fragment key={lineIdx}>
      {tokens.map((token, idx) => {
        if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
          return (
            <strong key={idx} className="font-semibold text-slate-800">
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
    if (!trimmed) return <div key={idx} className="h-1.5" />;
    if (trimmed.startsWith('### ')) {
      return (
        <div key={idx} className="font-bold text-[#1E4D3E] text-[12px] mt-2 mb-0.5">
          {renderFormattedLine(trimmed.slice(4), idx)}
        </div>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <div key={idx} className="font-bold text-[#1E4D3E] text-[13px] mt-2 mb-0.5">
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
  const t = getDictionary(currentLang);
  const langMeta = getLanguageMeta(currentLang);

  const buildWelcomeMessage = useCallback((): StoredChatMessage => {
    const points = user.carbonPoints;
    return {
      id: 'msg-init',
      sender: 'bot',
      text: formatText(t.chat.welcomeText, { name: user.name, points }),
      time: t.common.justNow,
      suggestions: t.chat.suggestions.map((s) => formatText(s, { points })),
    };
  }, [t, user.carbonPoints, user.name]);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize sessions from localStorage on mount
  useEffect(() => {
    const loaded = loadStoredSessions();
    if (loaded.length === 0) {
      const defaultSess = createNewSession(buildWelcomeMessage(), t.chat.newChatBtn);
      setSessions([defaultSess]);
      setActiveSessionId(defaultSess.id);
      saveStoredSessions([defaultSess]);
      saveActiveSessionId(defaultSess.id);
    } else {
      setSessions(loaded);
      const savedActiveId = loadActiveSessionId();
      const matched = loaded.find((s) => s.id === savedActiveId);
      const activeId = matched ? matched.id : loaded[0].id;
      setActiveSessionId(activeId);
      saveActiveSessionId(activeId);
    }
  }, [buildWelcomeMessage, t.chat.newChatBtn]);

  // Keep single initial welcome message in sync with live language
  useEffect(() => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.messages.length === 1 && s.messages[0].id === 'msg-init') {
          return {
            ...s,
            messages: [buildWelcomeMessage()],
          };
        }
        return s;
      })
    );
  }, [buildWelcomeMessage]);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 60);
    }
  }, [messages.length, isOpen]);

  useEffect(() => {
    if (!isOpen && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatCurrentTime = () =>
    new Date().toLocaleTimeString(langMeta.locale, {
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatFriendlyError = (code?: string, rawMessage?: string): string => {
    if (code === 'MISSING_API_KEY') return t.chat.errMissingKey;
    if (code === 'INVALID_API_KEY') return t.chat.errInvalidKey;
    if (code === 'RATE_LIMITED') return t.chat.errRateLimit;
    if (code === 'MODEL_NOT_FOUND') return t.chat.errModelNotFound;
    return `${t.chat.errNetwork}${rawMessage ? ` (${rawMessage})` : ''}`;
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  const handleCreateNewChat = () => {
    handleStopStreaming();
    setLastFailedPrompt(null);
    setInputText('');
    const newSess = createNewSession(buildWelcomeMessage(), t.chat.newChatBtn);
    const updated = [newSess, ...sessions];
    setSessions(updated);
    setActiveSessionId(newSess.id);
    saveStoredSessions(updated);
    saveActiveSessionId(newSess.id);
    setIsSidebarOpen(false); // Close drawer on mobile
  };

  const handleSelectSession = (sessionId: string) => {
    if (sessionId === activeSessionId) {
      setIsSidebarOpen(false);
      return;
    }
    handleStopStreaming();
    setLastFailedPrompt(null);
    setActiveSessionId(sessionId);
    saveActiveSessionId(sessionId);
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleStopStreaming();
    const remaining = sessions.filter((s) => s.id !== sessionId);
    if (remaining.length === 0) {
      const fresh = createNewSession(buildWelcomeMessage(), t.chat.newChatBtn);
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
      saveStoredSessions([fresh]);
      saveActiveSessionId(fresh.id);
    } else {
      setSessions(remaining);
      saveStoredSessions(remaining);
      if (sessionId === activeSessionId) {
        setActiveSessionId(remaining[0].id);
        saveActiveSessionId(remaining[0].id);
      }
    }
  };

  const updateActiveSessionMessages = (
    updater: (prevMsgs: StoredChatMessage[]) => StoredChatMessage[],
    newTitle?: string
  ) => {
    setSessions((prevSessions) => {
      const next = prevSessions.map((s) => {
        if (s.id === activeSessionId) {
          const updatedMsgs = updater(s.messages);
          return {
            ...s,
            title: newTitle !== undefined ? newTitle : s.title,
            updatedAt: Date.now(),
            messages: updatedMsgs,
          };
        }
        return s;
      });
      saveStoredSessions(next);
      return next;
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text || isStreaming) return;

    setLastFailedPrompt(null);

    const userMsg: StoredChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      time: formatCurrentTime(),
    };

    const botMsgId = `msg-bot-${Date.now() + 1}`;
    const placeholderBotMsg: StoredChatMessage = {
      id: botMsgId,
      sender: 'bot',
      text: '',
      time: formatCurrentTime(),
    };

    // Auto update title if this is the first user question
    const currentMsgs = activeSession?.messages || [];
    const isFirstUserQuestion =
      !currentMsgs.some((m) => m.sender === 'user');
    const computedTitle = isFirstUserQuestion
      ? generateSessionTitle(text, t.chat.newChatBtn)
      : undefined;

    const historyPayload = [
      ...currentMsgs
        .filter((m) => m.id !== 'msg-init' && !m.isError && m.text.trim().length > 0)
        .map((m) => ({
          role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.text,
        })),
      { role: 'user' as const, content: text },
    ];

    updateActiveSessionMessages(
      (prev) => [...prev, userMsg, placeholderBotMsg],
      computedTitle
    );

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
        updateActiveSessionMessages((prev) =>
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
        updateActiveSessionMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, text: currentText } : m))
        );
      }

      accumulated += decoder.decode();
      if (!accumulated.trim()) {
        setLastFailedPrompt(text);
        updateActiveSessionMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? { ...m, text: t.chat.errEmpty, isError: true }
              : m
          )
        );
      } else {
        updateActiveSessionMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId ? { ...m, text: accumulated.trim() } : m
          )
        );
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        updateActiveSessionMessages((prev) =>
          prev.filter((m) => !(m.id === botMsgId && !m.text.trim()))
        );
        return;
      }

      const msg = error instanceof Error ? error.message : '';
      setLastFailedPrompt(text);
      updateActiveSessionMessages((prev) =>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl md:max-w-3xl h-[620px] max-h-[92vh] rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col text-left border border-emerald-950/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E4D3E] via-[#245D4B] to-[#16392E] px-4 py-3 sm:py-3.5 text-white flex items-center justify-between shrink-0 border-b border-emerald-900/50">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="rounded-xl p-1.5 text-emerald-200 hover:text-white hover:bg-white/15 transition-colors"
              title={t.chat.toggleSidebar}
              aria-label={t.chat.toggleSidebar}
            >
              <PanelLeft size={19} />
            </button>

            <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full border-2 border-emerald-300 overflow-hidden shadow bg-emerald-950 flex items-center justify-center shrink-0">
              <Bot size={22} className="text-emerald-300 absolute z-0" />
              <img
                src="/chatbot-avatar.png"
                alt="EcoBot Avatar"
                className="relative z-10 h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                EcoBot
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="rounded-full bg-white/10 p-1.5 sm:p-2 text-white hover:bg-white/20 transition-colors"
              title={t.common.close}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Main Body: Sidebar + Chat Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-20 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Left Sidebar (ChatGPT-style) */}
          <aside
            className={`
              absolute md:relative z-30 inset-y-0 left-0
              w-64 bg-slate-50/95 border-r border-slate-200
              flex flex-col transition-all duration-200 ease-in-out shadow-lg md:shadow-none
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}
            `}
          >
            {/* New Chat Button */}
            <div className="p-3 border-b border-slate-200/80">
              <button
                onClick={handleCreateNewChat}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E4D3E] to-[#2D6A56] hover:from-[#245D4B] hover:to-[#367d66] text-white px-3.5 py-2.5 text-xs font-bold shadow-xs hover:shadow transition-all active:scale-[0.98]"
              >
                <SquarePen size={15} />
                <span>{t.chat.newChatBtn}</span>
              </button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>{t.chat.historyTitle}</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {sessions.length}
                </span>
              </div>

              {sessions.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs">
                  {t.chat.emptyHistory}
                </div>
              ) : (
                sessions.map((sess) => {
                  const isActive = sess.id === activeSessionId;
                  return (
                    <div
                      key={sess.id}
                      onClick={() => handleSelectSession(sess.id)}
                      className={`
                        group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-all
                        ${isActive
                          ? 'bg-emerald-100/90 text-emerald-950 font-semibold shadow-xs border border-emerald-300/80'
                          : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare
                          size={14}
                          className={`shrink-0 ${isActive
                            ? 'text-emerald-700'
                            : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                        />
                        <span className="truncate">{sess.title}</span>
                      </div>

                      <button
                        onClick={(e) => handleDeleteSession(sess.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all shrink-0"
                        title={t.chat.deleteChatConfirm}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom: Model Indicator */}
            <div className="p-2.5 border-t border-slate-200/80 bg-slate-100/70 text-[10px] text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1 font-semibold text-emerald-800">
                <Sparkles size={11} className="text-amber-500" />
                EcoBot AI
              </span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                1500 req/ngày
              </span>
            </div>
          </aside>

          {/* Right Chat Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-white">
            {/* Chat Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 text-xs">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isEmptyPending = !isUser && !msg.text && isStreaming;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-start gap-2 max-w-[92%] sm:max-w-[85%]">
                      {!isUser && (
                        <div className="h-7 w-7 rounded-full overflow-hidden shrink-0 border border-emerald-300 bg-[#1E4D3E] flex items-center justify-center relative shadow-xs">
                          <Bot size={14} className="text-emerald-200 absolute z-0" />
                          <img
                            src="/chatbot-avatar.png"
                            alt="EcoBot"
                            className="relative z-10 h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      <div
                        className={`rounded-2xl p-3 shadow-xs leading-relaxed ${isUser
                          ? 'bg-[#1E4D3E] text-white rounded-tr-none whitespace-pre-line'
                          : msg.isError
                            ? 'bg-amber-50 text-amber-950 border border-amber-200 rounded-tl-none'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                          }`}
                      >
                        {isEmptyPending ? (
                          <div className="flex items-center gap-1.5 py-1 text-emerald-800">
                            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce" />
                            <span
                              className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce"
                              style={{ animationDelay: '0.15s' }}
                            />
                            <span
                              className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce"
                              style={{ animationDelay: '0.3s' }}
                            />
                            <span className="text-[11px] font-medium ml-1">
                              {t.chat.thinking}
                            </span>
                          </div>
                        ) : (
                          renderMessageText(msg.text, isUser)
                        )}

                        {/* Error actions */}
                        {msg.isError && lastFailedPrompt && (
                          <div className="mt-2.5 pt-2 border-t border-amber-200 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-amber-700 flex items-center gap-1">
                              <AlertCircle size={11} />
                              {t.chat.connectionNotice}
                            </span>
                            <button
                              onClick={() => handleSendMessage(lastFailedPrompt)}
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-700 transition-colors shadow-xs"
                            >
                              <RotateCcw size={11} />
                              {t.chat.retryBtn}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Suggestions (only under initial welcome message) */}
                    {msg.suggestions &&
                      msg.suggestions.length > 0 &&
                      messages.length <= 1 && (
                        <div className="mt-3 ml-9 flex flex-wrap gap-1.5 max-w-[90%]">
                          {msg.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(sug)}
                              className="rounded-full border border-emerald-300 bg-emerald-50/80 px-3 py-1.5 text-[11px] font-medium text-emerald-900 hover:bg-emerald-100 hover:border-emerald-400 transition-all text-left shadow-xs"
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

            {/* Input Bar */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80">
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
                  placeholder={t.chat.inputPlaceholder}
                  disabled={isStreaming}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden disabled:opacity-60 shadow-inner"
                />

                {isStreaming ? (
                  <button
                    type="button"
                    onClick={handleStopStreaming}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500 text-white shadow hover:bg-rose-600 transition-colors shrink-0"
                    title={t.chat.stopTitle}
                  >
                    <Square size={14} className="fill-white" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#1E4D3E] to-emerald-600 text-white shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 shrink-0"
                    title={t.chat.sendTitle}
                  >
                    <Send size={15} />
                  </button>
                )}
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
