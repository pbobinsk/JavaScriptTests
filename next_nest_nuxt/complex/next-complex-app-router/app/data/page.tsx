import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dane z API',
  description: 'Lista przedmiotów pobrana z naszego API.',
};

export const dynamic = 'force-dynamic';

interface Item {
  id: number;
  name: string;
  description: string;
}

async function getItems(): Promise<Item[]> {
  // W prawdziwej aplikacji, URL API byłby prawdopodobnie w zmiennej środowiskowej
  // Dla dewelopmentu, Next.js automatycznie wie, gdzie jest jego własne API.
  // W przypadku zewnętrznego API, użyj pełnego URL.
  // Użycie `process.env.NEXT_PUBLIC_VERCEL_URL` lub `localhost` dla developmentu.
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8080';
  
  console.log('Używany apiUrl do fetch:', apiUrl); // <--- Dodaj ten log

  try {
    // Opcja cache: 'no-store' aby dane były zawsze świeże przy każdym żądaniu (jak getServerSideProps)
    // Domyślnie Next.js agresywnie cachuje wyniki fetch w Server Components.
    // Inne opcje: 'force-cache' (domyślne), { next: { revalidate: 60 } } (ISR)
    const res = await fetch(`${apiUrl}/api/items`, { cache: 'no-store' });

    if (!res.ok) {
      // To spowoduje błąd, który może być obsłużony przez error.tsx (jeśli istnieje)
      throw new Error(`Failed to fetch items: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error);
    // Można rzucić błąd dalej, aby obsłużyć go w error.tsx, lub zwrócić pustą tablicę/komunikat
    // throw error;
    return []; // Zwróć pustą tablicę w przypadku błędu, aby strona się załadowała
  }
}

export default async function DataPage() {
  const items = await getItems();

  return (
    <>
      <h1>Dane z API (App Router)</h1>
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.name}:</strong> {item.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>Brak danych do wyświetlenia lub wystąpił błąd podczas ładowania.</p>
      )}
    </>
  );
}