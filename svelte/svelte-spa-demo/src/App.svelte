<script>
  import Router, { link, push } from 'svelte-spa-router'; // Importuj router i pomocników
  import Home from './components/Home.svelte';
  import About from './components/About.svelte';
  import Contact from './components/Contact.svelte';
  import NotFound from './components/NotFound.svelte'; // Jeśli stworzyłeś

  // Definicja tras
  const routes = {
    '/': Home,
    '/about': About,
    '/contact': Contact,
    // Użyj globalnego catch-all dla 404, jeśli NotFound.svelte istnieje
    '*': NotFound, // Lub jeśli nie masz NotFound, możesz przekierować na '/'
    // '*': Home,
  };

  // Funkcja do nawigacji (alternatywa dla `use:link`)
  function navigateTo(path) {
    push(path);
  }
</script>

<header>
  <nav>
    <!-- Sposób 1: Użycie dyrektywy `use:link` -->
    <a href="/" use:link>Strona Główna</a>
    <a href="/about" use:link>O Nas</a>
    <a href="/contact" use:link>Kontakt</a>

    <!-- Sposób 2: Użycie funkcji `navigateTo` (mniej typowe dla prostych linków) -->
    <!-- <button on:click={() => navigateTo('/')}>Strona Główna</button> -->
    <!-- <button on:click={() => navigateTo('/about')}>O Nas</button> -->
    <!-- <button on:click={() => navigateTo('/contact')}>Kontakt</button> -->
  </nav>
</header>

<main>
  <Router {routes}/>
</main>

<footer>
  <p>© {new Date().getFullYear()} Svelte SPA Demo</p>
</footer>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    background-color: #f0f0f0;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center; /* Wyśrodkuj <main> w poziomie, jeśli jest węższy niż okno */
    min-height: 100vh;
    padding-top: 20px; /* Dodaj trochę przestrzeni na górze */
    padding-bottom: 20px; /* Dodaj trochę przestrzeni na dole */
    box-sizing: border-box; /* Aby padding nie zwiększał całkowitej wysokości body */
  }

  header {
    background-color: #333;
    color: white;
    padding: 1rem;
    text-align: center;
    width: 100%; /* Header na całą szerokość */
    box-sizing: border-box;
  }

  nav a {
    color: white;
    margin: 0 15px;
    text-decoration: none;
    font-weight: bold;
  }

  nav a:hover,
  nav a.active {
    color: #ff3e00;
    text-decoration: underline;
  }

  main {
    /* --- STAŁA SZEROKOŚĆ --- */
    width: 800px;     /* Ustaw konkretną szerokość */
    max-width: 95%;   /* Opcjonalnie: pozwól na zmniejszenie na bardzo małych ekranach */
                      /* Jeśli chcesz absolutnie stałą szerokość, usuń max-width */
                      /* lub ustaw max-width: 800px; */

    /* --- STAŁA (MINIMALNA) WYSOKOŚĆ --- */
    height: 400px;    /* Ustaw konkretną wysokość */
    /* min-height: 600px; */ /* Alternatywnie, jeśli chcesz pozwolić na rozszerzanie */
    /* max-height: 600px; */ /* Jeśli chcesz twardo ograniczyć wysokość */
    
    overflow-y: auto; /* Dodaj pasek przewijania WEWNĄTRZ <main>, jeśli zawartość jest za długa */
    overflow-x: hidden;/* Ukryj poziomy pasek przewijania, jeśli coś by wystawało */

    margin: 0 auto;   /* Usuń marginesy góra/dół, bo body ma padding. Auto dla wyśrodkowania w poziomie. */
                      /* Jeśli header i footer mają być "przyklejone" do <main>, to body nie potrzebuje padding-top/bottom */
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    box-sizing: border-box; /* Padding i border wliczane w width/height */

    display: flex; /* Aby kontrolować ułożenie wewnętrznej treści, jeśli potrzebne */
    flex-direction: column; /* Ułóż wewnętrzną treść w kolumnie */
  }

  /* Jeśli chcesz, aby zawartość wewnątrz main rozciągała się */
  /* :global(main > div), :global(main > .page-content) { */
    /* flex-grow: 1; */
    /* display: flex; */
    /* flex-direction: column; */
  /* } */


  footer {
    text-align: center;
    padding: 15px;
    color: #777;
    border-top: 1px solid #eee;
    width: 100%; /* Footer na całą szerokość */
    box-sizing: border-box;
    margin-top: 20px; /* Odstęp od main, jeśli main nie wypełnia całej przestrzeni */
  }
</style>