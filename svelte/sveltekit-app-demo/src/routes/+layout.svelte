<script lang="ts">
  

  // Możesz tu importować komponenty, np. nawigację, jeśli jest w osobnym pliku
</script>

<svelte:head>
  <!-- Możesz tu umieścić globalne tagi <head>, np. link do global.css, jeśli nie jest w app.html -->
  <!-- <link rel="stylesheet" href="/global.css"> -->
</svelte:head>

<div class="app-container">
  <header>
    <nav>
      <a href="/">Strona Główna</a>
      <a href="/about">O Nas</a>
      <a href="/contact">Kontakt</a>
    </nav>
  </header>

  <main>
    <slot /> <!-- Tutaj SvelteKit renderuje zawartość aktualnej strony (+page.svelte) -->
  </main>

  <footer>
    <p>© {new Date().getFullYear()} SvelteKit App Demo</p>
  </footer>
</div>

<style>
  /* Import global.css, jeśli nie jest w app.html lub app.pcss */
  /* @import '/global.css'; */ /* Ścieżka od katalogu static */

  .app-container {
    display: flex;
    flex-direction: column;
    width: 800px;     /* STAŁA SZEROKOŚĆ GŁÓWNEGO KONTENERA APLIKACJI */
    max-width: 95%;   /* Responsywność dla mniejszych ekranów */
    height: 600px;    /* STAŁA WYSOKOŚĆ GŁÓWNEGO KONTENERA APLIKACJI */
    /* min-height: 600px; */
    /* max-height: 600px; */
    
    margin: 0 auto; /* Wyśrodkowanie app-container na stronie (jeśli body ma align-items: center) */
    background-color: #ffffff; /* Tło dla "okna" aplikacji */
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    overflow: hidden; /* Ukryj wszystko co wystaje poza app-container */
    box-sizing: border-box;
  }

  header {
    background-color: #333;
    color: white;
    padding: 1rem;
    text-align: center;
    /* Header nie będzie się rozciągał, jeśli to nie jest potrzebne */
    flex-shrink: 0; /* Zapobiegaj kurczeniu się headera */
  }

  nav a {
    color: white;
    margin: 0 15px;
    text-decoration: none;
    font-weight: bold;
  }

  nav a:hover,
  nav a[aria-current="page"] { /* SvelteKit dodaje atrybut aria-current="page" do aktywnego linku */
    color: #ff3e00; /* Kolor Svelte */
    text-decoration: underline;
  }

  main {
    flex-grow: 1; /* Pozwól main rozciągnąć się i wypełnić dostępną przestrzeń w app-container */
    padding: 20px;
    overflow-y: auto; /* Pasek przewijania WEWNĄTRZ main, jeśli zawartość jest za długa */
    overflow-x: hidden;
    background-color: white; /* Tło dla treści, jeśli różne od app-container */
  }

  footer {
    text-align: center;
    padding: 15px;
    color: #777;
    border-top: 1px solid #eee;
    background-color: #f9f9f9; /* Lekkie tło dla stopki */
    flex-shrink: 0; /* Zapobiegaj kurczeniu się footera */
  }
</style>