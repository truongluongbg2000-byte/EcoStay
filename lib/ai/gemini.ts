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

  let rawModel = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
  // Strip any accidental 'models/' or 'google/' prefixes
  rawModel = rawModel.replace(/^models\//i, '').replace(/^google\//i, '');

  // Google retired 2.0-flash in favor of 2.5-flash and 3.8-flash
  const model =
    rawModel === 'gemini-2.0-flash' || rawModel === 'gemini-2.0-flash-001'
      ? 'gemini-2.5-flash'
      : rawModel || 'gemini-2.5-flash';

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

  // Automatic model fallback list in case any model is sunset or not available
  const candidateModels = Array.from(
    new Set([
      config.model,
      'gemini-2.5-flash',
      'gemini-3.8-flash',
      'gemini-1.5-flash',
    ])
  );

  let lastError: Error | null = null;

  for (const modelName of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      modelName
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

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal,
      });

      if (response.ok) {
        return response;
      }

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

      // If 404 (model deprecated or not found on this endpoint), try next candidate
      if (response.status === 404) {
        console.warn(
          `[Gemini] Model ${modelName} returned 404 (${errorDetail}). Trying next candidate...`
        );
        lastError = new GeminiError(errorDetail, response.status, 'MODEL_NOT_FOUND');
        continue;
      }

      let code = 'UPSTREAM_ERROR';
      if (response.status === 400 || response.status === 403) code = 'INVALID_API_KEY';
      else if (response.status === 429) code = 'RATE_LIMITED';

      throw new GeminiError(errorDetail, response.status, code);
    } catch (err) {
      if (err instanceof GeminiError && err.code !== 'MODEL_NOT_FOUND') {
        throw err;
      }
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw (
    lastError ||
    new GeminiError(
      'All Gemini models failed to respond',
      502,
      'MODEL_NOT_FOUND'
    )
  );
}
