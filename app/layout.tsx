import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EcoStay - Du Lịch Xanh & Tích Lũy CACBON POINT',
  description: 'Ứng dụng du lịch bền vững, theo dõi giảm thiểu phát thải CO2 và đổi quà xanh.',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1E4D3E',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#0F2820] flex items-center justify-center p-0 sm:p-4 md:p-6">
        {children}
      </body>
    </html>
  );
}
