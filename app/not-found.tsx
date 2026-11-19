import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-6 text-center text-emerald-50">
      <div className="text-6xl">🌱</div>
      <h1 className="text-2xl font-bold">404</h1>
      <p className="text-sm text-emerald-100/80">
        Trang không tồn tại / Page not found
      </p>
      <Link
        href="/"
        className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white active:scale-95"
      >
        EcoStay
      </Link>
    </main>
  );
}
