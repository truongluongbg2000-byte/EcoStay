import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000')
  ),
  title: 'EcoStay - Du Lịch Xanh & Tích Lũy CACBON POINT',
  description: 'Ứng dụng du lịch bền vững, theo dõi giảm thiểu phát thải CO2 và đổi quà xanh.',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'EcoStay - Du Lịch Xanh & Tích Lũy CACBON POINT',
    description: 'Ứng dụng du lịch bền vững, theo dõi giảm thiểu phát thải CO2 và đổi quà xanh.',
    images: ['/icon-512.png'],
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1E4D3E',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#0F2820] flex items-center justify-center p-0 sm:p-4 md:p-6 lg:block lg:p-0 lg:bg-[#F1F5F2]">
        {children}
      </body>
    </html>
  );
}
