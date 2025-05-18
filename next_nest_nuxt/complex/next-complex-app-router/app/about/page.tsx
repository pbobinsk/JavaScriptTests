import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'O Nas', // To zostanie połączone z szablonem z layout.tsx
  description: 'Dowiedz się więcej o naszej firmie demonstracyjnej.',
};

export default function AboutPage() {
  return (
    <>
      <h1>O Nas</h1>
      <p>Jesteśmy firmą demonstracyjną pokazującą możliwości Next.js App Router.</p>
      <p>Naszym celem jest tworzenie świetnych aplikacji webowych, które są szybkie i przyjazne SEO.</p>
    </>
  );
}