import type { PageServerLoad } from './$types'; // Automatycznie generowane typy dla SvelteKit

export const load: PageServerLoad = async ({ fetch, depends }) => {
  // `fetch` tutaj to specjalna wersja fetch dostarczana przez SvelteKit,
  // która może robić żądania do własnych endpointów API (lub zewnętrznych)
  // i działa poprawnie po stronie serwera.

  console.log('Funkcja load na serwerze dla /contact wywołana');

  // Dodaj `depends` dla zależności, jeśli dane mogą się często zmieniać
  // np. depends('app:api-message'); // Jeśli chcesz invalidować dane

  try {
    // Użyj ścieżki względnej do własnego API. SvelteKit to obsłuży.
    // Lub pełny URL, jeśli testujesz/potrzebujesz, ale względna jest lepsza dla wewnętrznych.
    const response = await fetch('/api/message?name=UżytkownikStrony');
    
    if (!response.ok) {
      throw new Error(`Błąd pobierania wiadomości z API: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      apiMessage: data.message, // Przekaż dane do komponentu +page.svelte
      loadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Błąd w funkcji load dla /contact:', error);
    return {
      apiMessage: 'Nie udało się załadować wiadomości z API.',
      error: (error as Error).message,
      loadedAt: new Date().toISOString()
    };
  }
};