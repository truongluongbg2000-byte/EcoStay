# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

EcoStay is a Next.js 14 (App Router, TypeScript, Tailwind) mobile-first web app/PWA demo for a green-tourism loyalty program: guests earn **CACBON POINT (CB)** for green actions (verified by scanning QR codes) and redeem them for vouchers or tree planting. It's a student competition project, so the UI copy and docs are mostly in Vietnamese. There is no real backend database: all app state is mock data that persists in `localStorage`. The product spec is in `docs/THONG_TIN_UNG_DUNG.md`. Deploy target: Vercel.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # also the main type-check (no separate tsc script)
npm run lint     # next lint
```

There is no test suite.

## Architecture

**Single-page shell.** `app/page.tsx` is one large client component that owns all app state: user profile, vouchers, impact logs, missions, notifications, language and active mock account. It passes this state and callbacks down to the `components/Tab*.tsx` tab views and the `*Modal.tsx` components. Navigation is a `TabId` state managed through `BottomNav`, not routing. When you add a feature, you'll usually add state and handlers in `page.tsx` and pass them as props.

**Persistence.** `page.tsx` hydrates from `localStorage` keys suffixed `_v5` (`ecostay_user_profile_v5`, etc.) and writes them back on every change once `isLoaded` is true. If you change the shape of persisted data, bump the key suffix so stale browser data doesn't break hydration. Chat sessions are stored separately (`lib/ai/chatStorage.ts`, keys `_v2`).

**Data.** `data/types.ts` holds the domain types. `data/mockData.ts` holds the seed data (missions, rewards, vouchers, mock accounts) and `data/greenDestinations.ts` the destination content.

**Missions and QR codes.** Each mission has a `qrSampleCode` (e.g. `ECOSTAY:ROOM:NO_LINEN_REPLACE`). A scanned code is matched against these strings in `page.tsx` (scanner tab) and in `components/MissionQRModal.tsx`. The `/qr-codes` route (`app/qr-codes/page.tsx`) generates printable QR codes from `initialMissions`, and `docs/qr-codes/` holds exported PNGs. Camera decoding is in `lib/qr/fastScanner.ts`: it uses the native `BarcodeDetector` when available and falls back to a cropped, downscaled `jsQR` pass.

**i18n.** Five languages (`vi`, `en`, `ko`, `ja`, `zh`). UI strings live in `lib/i18n/locales/*.ts`, typed by `AppDictionary` in `lib/i18n/types.ts`. A new key must be added to every locale or the build fails. Use `getDictionary(lang)` and `formatText(template, {var})` for `{var}` placeholders. Mock-data content such as mission titles is Vietnamese in `mockData.ts`, with translations kept separately in `data/translations.ts` (keyed by mission id).

**AI chat (EcoBot).** `components/AIChatModal.tsx` sends a POST to `app/api/chat/route.ts`, which:
1. Keeps the last 12 turns.
2. Runs a local keyword RAG (`lib/ai/ragStub.ts`) over the hardcoded `lib/ai/knowledgeBase.ts`, which normalizes away diacritics. It merges short follow-up questions with the previous question.
3. Builds the system prompt with `lib/ai/contextBuilder.ts`, which injects the user's profile and the RAG chunks.
4. Streams from OpenAI chat completions (`lib/ai/openai.ts`, server-only). The key is read only from `OPENAI_API_KEY`, validated (must be an `sk-` key, not OpenRouter's `sk-or-`), sent only in the `Authorization` header, and never logged or returned. Upstream errors are mapped to generic codes (`INVALID_API_KEY`, `RATE_LIMITED`, `MODEL_NOT_FOUND`, ...) that the client translates.
5. Re-parses the upstream SSE into plain UTF-8 text and strips `<think>…</think>` blocks.

`GET /api/chat` only reports whether a valid key is configured.

## Environment

Copy `.env.example` to `.env.local`. Variables: `OPENAI_API_KEY` (required for chat, server-only, never `NEXT_PUBLIC_`), `OPENAI_MODEL` (default `gpt-6-luna`; an `openai/` prefix is stripped) and optional `OPENAI_BASE_URL` (must be https). The app runs without a key; only the chat needs it. On Vercel, set the key in Project Settings → Environment Variables.

## Notes

- Path alias `@/*` maps to the repo root.
- `next.config.mjs` sets `images.unoptimized: true`.
- The `.docx` files in `docs/` are team project documents (requirements, bug lists, presentation), not code; they live in `docs/`, as do loose reference images (`docs/assets/`).
