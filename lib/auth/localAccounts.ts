/**
 * Demo-grade local accounts (browser only). Passwords are salted + SHA-256 hashed,
 * but this is NOT real authentication: everything lives in this browser's localStorage.
 */

export interface LocalAccount {
  id: string;
  name: string;
  phone: string;
  email: string;
  hotel: string;
  room: string;
  salt: string;
  passwordHash: string;
}

export type RegisterInput = Omit<LocalAccount, 'id' | 'salt' | 'passwordHash'> & {
  password: string;
};

const KEY = 'ecostay_local_accounts_v1';
export const MIN_PASSWORD_LENGTH = 6;

function normalizeId(value: string): string {
  const v = value.trim().toLowerCase();
  return v.includes('@') ? v : v.replace(/[^\d+]/g, '');
}

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function loadAccounts(): LocalAccount[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: LocalAccount[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(accounts));
  } catch {
    // storage unavailable
  }
}

function matches(acc: LocalAccount, identifier: string): boolean {
  const id = normalizeId(identifier);
  if (!id) return false;
  return normalizeId(acc.email) === id || (!!acc.phone && normalizeId(acc.phone) === id);
}

export type RegisterResult =
  | { ok: true; account: LocalAccount }
  | { ok: false; reason: 'invalid' | 'exists' };

export async function registerLocalAccount(input: RegisterInput): Promise<RegisterResult> {
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || (!emailOk && !phone) || input.password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, reason: 'invalid' };
  }
  const accounts = loadAccounts();
  if (accounts.some((a) => (emailOk && matches(a, email)) || (phone && matches(a, phone)))) {
    return { ok: false, reason: 'exists' };
  }
  const salt = crypto.randomUUID();
  const account: LocalAccount = {
    id: `user-${Date.now()}`,
    name,
    phone,
    email: emailOk ? email : '',
    hotel: input.hotel,
    room: input.room,
    salt,
    passwordHash: await sha256(`${salt}:${input.password}`),
  };
  saveAccounts([...accounts, account]);
  return { ok: true, account };
}

export async function verifyLocalAccount(
  identifier: string,
  password: string
): Promise<LocalAccount | null> {
  const account = loadAccounts().find((a) => matches(a, identifier));
  if (!account) return null;
  const hash = await sha256(`${account.salt}:${password}`);
  return hash === account.passwordHash ? account : null;
}
