export interface StoredChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  suggestions?: string[];
  isError?: boolean;
  errorCode?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: StoredChatMessage[];
}

const STORAGE_KEY = 'ecostay_chat_sessions_v2';
const ACTIVE_SESSION_KEY = 'ecostay_active_session_id_v2';

export function loadStoredSessions(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (s) => s && typeof s.id === 'string' && Array.isArray(s.messages)
      );
    }
  } catch (err) {
    console.error('Failed to load chat sessions from localStorage:', err);
  }
  return [];
}

export function saveStoredSessions(sessions: ChatSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save chat sessions to localStorage:', err);
  }
}

export function loadActiveSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(ACTIVE_SESSION_KEY);
  } catch {
    return null;
  }
}

export function saveActiveSessionId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, id);
  } catch {
    // ignore
  }
}

export function generateSessionTitle(firstUserText: string, defaultTitle = 'Trò chuyện mới'): string {
  const cleaned = firstUserText.replace(/\s+/g, ' ').trim();
  if (!cleaned) return defaultTitle;
  if (cleaned.length <= 36) return cleaned;
  return cleaned.slice(0, 36) + '...';
}

export function createNewSession(welcomeMessage: StoredChatMessage, defaultTitle = 'Trò chuyện mới'): ChatSession {
  const now = Date.now();
  return {
    id: `session_${now}_${Math.random().toString(36).substring(2, 7)}`,
    title: defaultTitle,
    createdAt: now,
    updatedAt: now,
    messages: [welcomeMessage],
  };
}
