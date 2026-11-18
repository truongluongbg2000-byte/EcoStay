import { Lang } from '@/lib/i18n';
import { PROJECT_KNOWLEDGE_BASE, KnowledgeChunk } from './knowledgeBase';

export interface RagChunk {
  id: string;
  source: string;
  content: string;
  score?: number;
}

export interface RagRetrievalOptions {
  topK?: number;
  lang?: Lang;
}

/**
 * Normalize Vietnamese & multilingual text:
 * - Lowercase
 * - Convert đ/Đ -> d
 * - Strip Vietnamese/Latin combining diacritics so accented & non-accented queries match equally well
 * - Preserve CJK characters (Korean, Japanese, Chinese) and numbers
 */
function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFC')
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af\s.%+-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP_WORDS = new Set([
  'la',
  'gi',
  'cua',
  'va',
  'cac',
  'cho',
  'toi',
  'minh',
  'ban',
  'voi',
  've',
  'nhu',
  'the',
  'nao',
  'co',
  'duoc',
  'khong',
  'nhung',
  'trong',
  'nay',
  'do',
  'hay',
  'de',
  'thi',
  'sao',
  'what',
  'is',
  'are',
  'the',
  'of',
  'and',
  'for',
  'about',
  'how',
  'to',
  'in',
  'on',
  'with',
  'can',
  'you',
  'tell',
  'me',
]);

function tokenize(normalized: string): string[] {
  return normalized
    .split(' ')
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));
}

interface IndexedChunk {
  chunk: KnowledgeChunk;
  normTitle: string;
  normContent: string;
  normKeywords: string[];
}

// Pre-index once in server memory for sub-millisecond retrieval (< 1ms)
const INDEXED_KB: IndexedChunk[] = PROJECT_KNOWLEDGE_BASE.map((chunk) => ({
  chunk,
  normTitle: normalizeText(chunk.title),
  normContent: normalizeText(chunk.content),
  normKeywords: chunk.keywords.map((kw) => normalizeText(kw)).filter(Boolean),
}));

/**
 * Fast in-memory Hybrid Local RAG retriever over the EcoStay team's project knowledge base.
 * Supports Vietnamese (accented & non-accented), English, Korean, Japanese, and Chinese queries.
 */
export async function retrieveRagContext(
  query: string,
  options?: RagRetrievalOptions
): Promise<RagChunk[]> {
  const topK = options?.topK ?? 3;
  const normQuery = normalizeText(query || '');

  if (!normQuery) {
    return getFallbackOverviewChunks(topK);
  }

  const tokens = tokenize(normQuery);

  const scored = INDEXED_KB.map((entry) => {
    let score = 0;

    // 1. Exact keyword/phrase match (strongest signal, covers all 5 languages)
    for (const kw of entry.normKeywords) {
      if (kw.length >= 2 && normQuery.includes(kw)) {
        // Multi-word or CJK keyword phrases get extra weight
        const weight = kw.includes(' ') || /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(kw) ? 14 : 9;
        score += weight;
      }
    }

    // 2. Token-level scoring against title, keywords, and body content
    for (const token of tokens) {
      if (entry.normTitle.includes(token)) {
        score += 4;
      }
      if (entry.normKeywords.some((kw) => kw.includes(token) || token.includes(kw))) {
        score += 3;
      }
      if (entry.normContent.includes(token)) {
        score += 1.5;
      }
    }

    return { entry, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const matched = scored.filter((item) => item.score >= 3).slice(0, topK);

  if (matched.length === 0) {
    return getFallbackOverviewChunks(topK);
  }

  return matched.map(({ entry, score }) => ({
    id: entry.chunk.id,
    source: entry.chunk.source,
    content: entry.chunk.content,
    score: Number(score.toFixed(1)),
  }));
}

function getFallbackOverviewChunks(topK: number): RagChunk[] {
  return PROJECT_KNOWLEDGE_BASE.filter((c) => c.isDefaultOverview)
    .slice(0, topK)
    .map((chunk) => ({
      id: chunk.id,
      source: chunk.source,
      content: chunk.content,
      score: 1,
    }));
}
