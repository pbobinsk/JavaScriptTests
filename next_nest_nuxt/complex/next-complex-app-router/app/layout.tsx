// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Domyślna czcionka
import Navbar from '@/components/Navbar'; // Zakładając alias @/*
// Jeśli nie masz aliasu @/*: import Navbar from '../components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Moja Apka Next.js', // Tytuł domyślny
    template: '%s | Moja Apka Next.js', // Szablon dla podstron, np. "O Nas | Moja Apka Next.js"
  },
  description: 'Rozbudowana aplikacja demonstracyjna Next.js z App Routerem',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <Navbar />
        <div className="container"> {/* Ten kontener obejmie całą zawartość strony */}
          <main>{children}</main>
        </div>
        <footer>
          <p>© {new Date().getFullYear()} - Next.js App Router Demo</p>
        </footer>
      </body>
    </html>
  );
}