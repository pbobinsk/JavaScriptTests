import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit'; // Funkcja pomocnicza do zwracania JSON

export const GET: RequestHandler = async ({ url }) => {
  // Możesz odczytać parametry zapytania z url.searchParams
  const name = url.searchParams.get('name') || 'Gościu';

  const message = `Witaj, ${name}! To jest wiadomość z SvelteKit API. Aktualny czas: ${new Date().toLocaleTimeString()}`;

  // Symulacja opóźnienia
  await new Promise(resolve => setTimeout(resolve, 500));

  return json({ // Zwróć odpowiedź JSON
    message: message,
    timestamp: Date.now()
  });
};

// Możesz też zdefiniować POST, PUT, DELETE itp.
// export const POST: RequestHandler = async ({ request }) => {
//   const body = await request.json();
//   // ... logika dla POST ...
//   return json({ received: body }, { status: 201 });
// };