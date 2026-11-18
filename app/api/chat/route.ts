import { NextRequest, NextResponse } from 'next/server';
import { retrieveRagContext } from '@/lib/ai/ragStub';
import { buildSystemPrompt, ChatUserContext } from '@/lib/ai/contextBuilder';
import {
  createOpenRouterStream,
  OpenRouterError,
  OpenRouterMessage,
} from '@/lib/ai/openrouter';
import { isValidLang, Lang } from '@/lib/i18n';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface IncomingChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  messages?: IncomingChatMessage[];
  userContext?: ChatUserContext;
  lang?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const lang: Lang = isValidLang(body.lang) ? body.lang : 'vi';
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];

    // Sanitize & keep last 12 turns for fast, focused multi-turn memory
    const conversationMessages: OpenRouterMessage[] = rawMessages
      .filter(
        (m): m is IncomingChatMessage =>
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim().length > 0
      )
      .slice(-12)
      .map((m) => ({
        role: m.role,
        content: m.content.trim(),
      }));

    if (conversationMessages.length === 0) {
      return NextResponse.json(
        {
          error: lang === 'en' ? 'Message cannot be empty.' : 'Tin nhắn không được để trống.',
          code: 'EMPTY_MESSAGE',
        },
        { status: 400 }
      );
    }

    const userMessages = conversationMessages.filter((m) => m.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1]?.content || '';
    const prevUserMessage = userMessages[userMessages.length - 2]?.content || '';

    // If the latest user message is a short follow-up (e.g. "chi tiết hơn", "KPI thì sao?"),
    // combine it with the previous user message so Local RAG retains topic context.
    const ragQuery =
      lastUserMessage.length < 35 && prevUserMessage
        ? `${prevUserMessage} ${lastUserMessage}`
        : lastUserMessage;

    // 1. Fast In-Memory Local RAG over the EcoStay team's official project document (< 1ms)
    const ragChunks = await retrieveRagContext(ragQuery, { lang, topK: 3 });

    // 2. Build dynamic system prompt (User profile + EcoStay rules + Future RAG chunks)
    const systemPrompt = buildSystemPrompt({
      lang,
      userContext: body.userContext,
      ragChunks,
    });

    const fullMessages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationMessages,
    ];

    // 3. Call OpenRouter API (streaming SSE)
    const upstreamResponse = await createOpenRouterStream(fullMessages, req.signal);

    if (!upstreamResponse.body) {
      throw new OpenRouterError('Empty stream body from OpenRouter', 502, 'EMPTY_STREAM');
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Parse OpenRouter SSE stream -> emit clean UTF-8 text chunks (filtering out <think> blocks)
    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = upstreamResponse.body!.getReader();
        let sseBuffer = '';
        let inThinkTag = false;
        let pendingTagBuffer = '';

        const emitFilteredText = (chunkText: string) => {
          let text = pendingTagBuffer + chunkText;
          pendingTagBuffer = '';

          while (text.length > 0) {
            if (inThinkTag) {
              const endIdx = text.indexOf('</think>');
              if (endIdx !== -1) {
                inThinkTag = false;
                text = text.slice(endIdx + '</think>'.length);
              } else {
                // Keep tail in case '</think>' is split across chunks
                pendingTagBuffer = text.slice(-8);
                text = '';
              }
            } else {
              const startIdx = text.indexOf('<think>');
              if (startIdx !== -1) {
                const before = text.slice(0, startIdx);
                if (before) controller.enqueue(encoder.encode(before));
                inThinkTag = true;
                text = text.slice(startIdx + '<think>'.length);
              } else {
                // Check if chunk ends with partial '<think>' prefix
                const lastLt = text.lastIndexOf('<');
                if (lastLt !== -1 && '<think>'.startsWith(text.slice(lastLt))) {
                  const safe = text.slice(0, lastLt);
                  if (safe) controller.enqueue(encoder.encode(safe));
                  pendingTagBuffer = text.slice(lastLt);
                  text = '';
                } else {
                  controller.enqueue(encoder.encode(text));
                  text = '';
                }
              }
            }
          }
        };

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            sseBuffer += decoder.decode(value, { stream: true });
            const lines = sseBuffer.split('\n');
            sseBuffer = lines.pop() || '';

            for (const rawLine of lines) {
              const line = rawLine.trim();
              if (!line || line.startsWith(':')) continue;
              if (!line.startsWith('data:')) continue;

              const dataStr = line.slice(5).trim();
              if (dataStr === '[DONE]') {
                continue;
              }

              try {
                const parsed = JSON.parse(dataStr);
                const delta = parsed?.choices?.[0]?.delta?.content;
                if (typeof delta === 'string' && delta.length > 0) {
                  emitFilteredText(delta);
                }
              } catch {
                // Ignore malformed partial SSE JSON comments
              }
            }
          }

          if (!inThinkTag && pendingTagBuffer) {
            controller.enqueue(encoder.encode(pendingTagBuffer));
          }
          controller.close();
        } catch (err) {
          if (req.signal.aborted) {
            controller.close();
            return;
          }
          controller.error(err);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(readableStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error) {
    if (error instanceof OpenRouterError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.status }
      );
    }

    const message =
      error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json(
      {
        error: message,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
