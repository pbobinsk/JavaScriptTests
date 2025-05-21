// src/routes/contact/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => { // Usunąłem `depends`, bo nie używamy
  console.log('Funkcja load na serwerze dla /contact wywołana (dla początkowego renderowania)');
  try {
    const initialName = 'Szanowny Gościu'; // Początkowa nazwa dla server-side load
    const response = await fetch(`/api/message?name=${encodeURIComponent(initialName)}`);
    if (!response.ok) {
      throw new Error(`Błąd pobierania wiadomości z API: ${response.status}`);
    }
    const data = await response.json();
    return {
      apiMessage: data.message,
      loadedAt: new Date().toISOString(),
      error: null // Jawnie ustawiamy brak błędu
    };
  } catch (error) {
    console.error('Błąd w funkcji load dla /contact:', error);
    return {
      apiMessage: '', // Pusta wiadomość w razie błędu
      error: (error as Error).message || 'Nie udało się załadować początkowej wiadomości.',
      loadedAt: new Date().toISOString()
    };
  }
};