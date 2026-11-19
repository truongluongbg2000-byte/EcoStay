import 'server-only';

/**
 * OpenAI Chat Completions client (server-only).
 * The API key is read exclusively from process.env on the server, sent only in the
 * Authorization header, and is never logged or returned to the client.
 */

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export class OpenAIError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'OpenAIError';
    this.status = status;
    this.code = code;
  }
}

const DEFAULT_MODEL = 'gpt-6-luna';
const DEFAULT_BASE_URL = 'https://api.openai.com/v1';

/** Matches OpenAI keys (sk-..., sk-proj-...) but not OpenRouter keys (sk-or-...). */
const OPENAI_KEY_PATTERN = /^sk-(?!or-)[A-Za-z0-9_-]{20,}$/;

function readApiKey(): string {
  const apiKey = (process.env.OPENAI_API_KEY || '').trim();

  if (!apiKey || apiKey.toLowerCase().includes('your_openai_api_key')) {
    throw new OpenAIError('OPENAI_API_KEY is not configured on the server.', 500, 'MISSING_API_KEY');
  }
  if (!OPENAI_KEY_PATTERN.test(apiKey)) {
    // Never echo the key itself.
    throw new OpenAIError(
      'OPENAI_API_KEY has an invalid format (expected an OpenAI "sk-..." key, not an OpenRouter key).',
      500,
      'INVALID_API_KEY'
    );
  }
  return apiKey;
}

function readBaseUrl(): string {
  const raw = (process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL).trim().replace(/\/+$/, '');
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new OpenAIError('OPENAI_BASE_URL is not a valid URL.', 500, 'INVALID_CONFIG');
  }
  // The key is sent to this host, so insist on HTTPS.
  if (url.protocol !== 'https:') {
    throw new OpenAIError('OPENAI_BASE_URL must use https.', 500, 'INVALID_CONFIG');
  }
  return raw;
}

export function getOpenAIConfig(): OpenAIConfig {
  const rawModel = (process.env.OPENAI_MODEL || DEFAULT_MODEL).trim();
  // Accept OpenRouter-style slugs like "openai/gpt-6-luna".
  const model = rawModel.replace(/^openai\//i, '') || DEFAULT_MODEL;
  return { apiKey: readApiKey(), model, baseUrl: readBaseUrl() };
}

/** Safe, non-throwing check used by the diagnostic endpoint. */
export function isOpenAIConfigured(): boolean {
  try {
    readApiKey();
    readBaseUrl();
    return true;
  } catch {
    return false;
  }
}

export async function createOpenAIStream(
  messages: OpenAIMessage[],
  signal?: AbortSignal
): Promise<Response> {
  const config = getOpenAIConfig();

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: true,
      max_completion_tokens: 1024,
    }),
    signal,
  });

  if (response.ok) {
    return response;
  }

  // Log upstream detail on the server only; the client gets a generic message.
  let upstreamDetail = '';
  let upstreamCode = '';
  try {
    const json = await response.json();
    upstreamDetail = json?.error?.message || '';
    upstreamCode = json?.error?.code || '';
  } catch {
    // ignore
  }
  console.error(`[OpenAI] ${response.status} ${upstreamCode} ${upstreamDetail}`.trim());

  if (response.status === 401) {
    throw new OpenAIError('OpenAI rejected the API key.', 401, 'INVALID_API_KEY');
  }
  if (response.status === 404) {
    throw new OpenAIError('The configured OpenAI model was not found.', 404, 'MODEL_NOT_FOUND');
  }
  if (response.status === 429) {
    const quota = upstreamCode === 'insufficient_quota';
    throw new OpenAIError(
      quota ? 'OpenAI quota exhausted.' : 'OpenAI rate limit reached.',
      429,
      quota ? 'INSUFFICIENT_CREDITS' : 'RATE_LIMITED'
    );
  }
  throw new OpenAIError('The AI service is temporarily unavailable.', 502, 'UPSTREAM_ERROR');
}
