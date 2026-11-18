export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
  appUrl: string;
  appName: string;
}

export class OpenRouterError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'OpenRouterError';
    this.status = status;
    this.code = code;
  }
}

export function getOpenRouterConfig(): OpenRouterConfig {
  const apiKey = (process.env.OPENROUTER_API_KEY || '').trim();
  const model = (
    process.env.OPENROUTER_MODEL || 'inclusionai/ling-3.2-flash:free'
  ).trim();
  const baseUrl = (
    process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
  )
    .trim()
    .replace(/\/+$/, '');
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ).trim();
  const appName = (
    process.env.NEXT_PUBLIC_APP_NAME || 'EcoStay AI Assistant'
  ).trim();

  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    throw new OpenRouterError(
      'OPENROUTER_API_KEY is not configured in .env.local',
      500,
      'MISSING_API_KEY'
    );
  }

  return { apiKey, model, baseUrl, appUrl, appName };
}

export async function createOpenRouterStream(
  messages: OpenRouterMessage[],
  signal?: AbortSignal
): Promise<Response> {
  const config = getOpenRouterConfig();

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'HTTP-Referer': config.appUrl,
      'X-Title': config.appName,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
      reasoning: {
        exclude: true,
      },
    }),
    signal,
  });

  if (!response.ok) {
    let errorDetail = `OpenRouter error (${response.status})`;
    try {
      const errorJson = await response.json();
      errorDetail =
        errorJson?.error?.message ||
        errorJson?.message ||
        errorDetail;
    } catch {
      // ignore json parse error
    }

    let code = 'UPSTREAM_ERROR';
    if (response.status === 401) code = 'INVALID_API_KEY';
    else if (response.status === 402) code = 'INSUFFICIENT_CREDITS';
    else if (response.status === 404) code = 'MODEL_NOT_FOUND';
    else if (response.status === 429) code = 'RATE_LIMITED';

    throw new OpenRouterError(errorDetail, response.status, code);
  }

  return response;
}
