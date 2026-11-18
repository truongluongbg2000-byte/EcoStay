import { Lang } from '@/lib/i18n';

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
 * Placeholder hook for the upcoming RAG (Retrieval-Augmented Generation) pipeline.
 *
 * Future integration guide:
 * 1. Embed `query` using an embedding model (OpenRouter / OpenAI / local).
 * 2. Query your vector store (Supabase pgvector, Pinecone, Qdrant, Chroma, etc.).
 * 3. Return the top-K relevant `RagChunk[]` items here.
 *
 * `contextBuilder.ts` will automatically inject returned chunks into the system prompt
 * without requiring any changes to the API route or UI components.
 */
export async function retrieveRagContext(
  _query: string,
  _options?: RagRetrievalOptions
): Promise<RagChunk[]> {
  return [];
}
