// app/page.tsx
// Nie potrzebujemy importować Metadata tutaj, jeśli chcemy użyć domyślnego tytułu z layoutu,
// lub możemy nadpisać/dodać:
// import type { Metadata } from 'next'
// export const metadata: Metadata = { title: 'Strona Główna' }

export default function HomePage() {
  return (
    <>
      <h1>Witaj w aplikacji Next.js z App Router!</h1>
      <p>To jest strona główna naszej przykładowej aplikacji.</p>
      <p>Użyj menu powyżej, aby nawigować po stronach.</p>
      <p>Strony w App Routerze są domyślnie komponentami serwerowymi (Server Components).</p>
    </>
  );
}