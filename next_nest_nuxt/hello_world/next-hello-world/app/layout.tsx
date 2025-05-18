// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Domyślna czcionka, możesz ją zostawić
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js Hello App', // Zmień tytuł
  description: 'Prosta aplikacja Next.js z App Routerem',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={inter.className}>{children}</body>
    </html>
  );
}