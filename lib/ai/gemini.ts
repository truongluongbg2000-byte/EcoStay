export interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiConfig {
  apiKey: string;
  model: string;
}

export class GeminiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'GeminiError';
    this.status = status;
    this.code = code;
  }
}

export function getGeminiConfig(): GeminiConfig | null {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  const model = (process.env.GEMINI_MODEL || 'gemini-2.0-flash').trim();
  return { apiKey, model };
}

export async function createGeminiStream(
  messages: GeminiMessage[],
  systemPrompt: string,
  signal?: AbortSignal
): Promise<Response> {
  const config = getGeminiConfig();
  if (!config) {
    throw new GeminiError(
      'GEMINI_API_KEY is not configured in .env.local',
      500,
      'MISSING_API_KEY'
    );
  }

  // Format contents for Gemini: role is 'user' or 'model'
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    config.model
  )}:streamGenerateContent?alt=sse&key=${encodeURIComponent(config.apiKey)}`;

  const body = {
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.45,
      maxOutputTokens: 1024,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    let errorDetail = `Google Gemini error (${response.status})`;
    try {
      const errJson = await response.json();
      errorDetail =
        errJson?.error?.message ||
        errJson?.message ||
        errorDetail;
    } catch {
      // ignore json parse error
    }

    let code = 'UPSTREAM_ERROR';
    if (response.status === 400 || response.status === 403) code = 'INVALID_API_KEY';
    else if (response.status === 429) code = 'RATE_LIMITED';
    else if (response.status === 404) code = 'MODEL_NOT_FOUND';

    throw new GeminiError(errorDetail, response.status, code);
  }

  return response;
}
