<script lang="ts">
  import type { PageData } from './$types';
  import { enhance } from '$app/forms'; // Do progresywnego ulepszania formularzy (opcjonalne, ale dobre)
  import { onMount } from 'svelte'; // Do wykonania czegoś po zamontowaniu komponentu

  export let data: PageData; // Dane z funkcji load (początkowe)

  let username: string = 'Gość'; // Lokalny stan dla pola input
  let apiResponseMessage: string = data.apiMessage; // Lokalny stan dla wiadomości z API, inicjalizowany danymi z load
  let lastLoadedAt: string | null = data.loadedAt;
  let currentError: string | null = data.error || null; // Lokalny stan dla błędów
  let isLoading: boolean = false;

  let clientInitiatedUpdate: boolean = false;

  // Funkcja do pobierania wiadomości z API po stronie klienta
  async function fetchMessageFromApi(name: string) {
    console.log(`fetchMessageFromApi wywołane z name: "${name}"`); // <--- DODAJ TEN LOG
    isLoading = true;
    clientInitiatedUpdate = true; 
    currentError = null; // Wyczyść poprzedni błąd
    try {
      const response = await fetch(`/api/message?name=${encodeURIComponent(name)}`);
      console.log('Odpowiedź z fetch:', response); // <--- DODAJ TEN LOG
      if (!response.ok) {
        throw new Error(`Błąd API: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Dane JSON z API:', result); // <--- DODAJ TEN LOG
      apiResponseMessage = result.message;
      console.log('Nowa wartość apiResponseMessage:', apiResponseMessage); // DODAJ TEN LOG
      lastLoadedAt = new Date().toISOString(); // Zaktualizuj czas załadowania
    } catch (err: any) {
      console.error('Błąd pobierania wiadomości po stronie klienta:', err);
      currentError = err.message || 'Nie udało się pobrać wiadomości.';
      apiResponseMessage = ''; // Wyczyść wiadomość w razie błędu
    } finally {
      isLoading = false;
    }
  }

  // Obsługa wysłania formularza
  async function handleSubmit() {
    console.log('handleSubmit wywołane!'); // <--- DODAJ TEN LOG
    if (!username.trim()) {
      currentError = 'Nazwa użytkownika nie może być pusta.';
      return;
    }
    await fetchMessageFromApi(username);
  }

  // Możemy też zaktualizować wiadomość, gdy dane z `load` się zmienią (np. po nawigacji wstecz/naprzód)
    // $: { // Reaktywny blok, uruchamia się gdy `data` się zmienia
    //   console.log('Reaktywny blok - start. ClientInitiated:', clientInitiatedUpdate, 'isLoading:', isLoading);
    //   if (!clientInitiatedUpdate && !isLoading && data && data.apiMessage && data.apiMessage !== apiResponseMessage) {
    //       console.log('Reaktywny blok: Aktualizacja apiResponseMessage z `data` (np. po nawigacji, invalidate)');   
    //       apiResponseMessage = data.apiMessage;
    //       lastLoadedAt = data.loadedAt;
    //       currentError = data.error || null;
    //       console.log('Reaktywny blok: Zaktualizowano apiResponseMessage z data');
    //   }
    // }


</script>

<svelte:head>
  <title>Kontakt - SvelteKit Demo</title>
</svelte:head>

<div class="page-content">
  <h1>Kontakt</h1>
  <p>Wpisz swoje imię, aby otrzymać spersonalizowaną wiadomość z naszego API!</p>

  <form on:submit|preventDefault={handleSubmit} class="contact-form">
    <div>
      <label for="username">Twoje Imię:</label>
      <input type="text" id="username" bind:value={username} placeholder="np. Jan Kowalski" />
    </div>
    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Pobieranie...' : 'Pobierz Wiadomość'}
    </button>
  </form>

  {#if currentError}
    <p class="error-message">
      <strong>Błąd:</strong> {currentError}
    </p>
  {/if}

  {#if apiResponseMessage}
    <div class="api-response">
      <h2>Wiadomość z API:</h2>
      <p>{apiResponseMessage}</p>
      {#if lastLoadedAt}
        <p><small>Załadowano: {new Date(lastLoadedAt).toLocaleString()}</small></p>
      {/if}
    </div>
  {:else if !currentError && !isLoading}
    <p>Wpisz imię i kliknij przycisk, aby zobaczyć wiadomość.</p>
  {/if}

</div>

<style>
  .page-content {padding: 10px;}
  .contact-form {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  .contact-form div {
    margin-bottom: 10px;
  }
  .contact-form label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .contact-form input[type="text"] {
    width: calc(100% - 22px);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .contact-form button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .contact-form button:hover {
    background-color: #0056b3;
  }
  .contact-form button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .api-response {
    margin-top: 20px;
    padding: 15px;
    border: 1px dashed #007bff;
    border-radius: 5px;
    background-color: #e7f3ff;
  }
  .api-response h2 {
    margin-top: 0;
    color: #0056b3;
  }
  .error-message {
    color: #721c24;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    padding: 10px;
    border-radius: 4px;
    margin-top: 15px;
  }
</style>