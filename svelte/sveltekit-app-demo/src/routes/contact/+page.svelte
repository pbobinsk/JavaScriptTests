<script lang="ts">
  import type { PageData } from './$types'; // Importuj typ dla danych z load

  export let data: PageData; // Dane przekazane z funkcji load
</script>

<svelte:head>
  <title>Kontakt - SvelteKit Demo</title>
</svelte:head>

<div class="page-content">
  <h1>Kontakt</h1>
  <p>Skontaktuj się z nami lub sprawdź wiadomość z naszego API!</p>

  {#if data.error}
    <p class="error-message">
      <strong>Błąd ładowania danych:</strong> {data.error}
    </p>
  {/if}

  {#if data.apiMessage}
    <div class="api-response">
      <h2>Wiadomość z API:</h2>
      <p>{data.apiMessage}</p>
      <p><small>Załadowano: {new Date(data.loadedAt).toLocaleString()}</small></p>
    </div>
  {:else if !data.error}
    <p>Ładowanie wiadomości z API...</p>
  {/if}
</div>

<style>
  .page-content {padding: 10px;}
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
    color: red;
    font-weight: bold;
    padding: 10px;
    border: 1px solid red;
    background-color: #ffebee;
    border-radius: 4px;
  }
</style>