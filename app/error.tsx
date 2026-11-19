'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-6 text-center text-emerald-50">
      <div className="text-6xl">🍃</div>
      <h1 className="text-xl font-bold">Đã có lỗi xảy ra / Something went wrong</h1>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white active:scale-95"
      >
        Thử lại / Retry
      </button>
    </main>
  );
}
