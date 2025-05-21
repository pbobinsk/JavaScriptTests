<script lang="ts">
  
  let count = 0; // W Svelte, zmienne let są automatycznie reaktywne w skryptach komponentów
  const increment = () => count++;
  const decrement = () => count--;
</script>

<svelte:head>
  <title>O Nas - SvelteKit Demo</title>
</svelte:head>

<div class="page-content">
  <h1>O Nas</h1>
  <p>Informacje o naszej wspaniałej aplikacji SvelteKit.</p>
  
  <div class="counter">
    <h2>Licznik</h2>
    <p>Wartość: {count}</p>
    <button on:click={increment}>Zwiększ</button>
    <button on:click={decrement}>Zmniejsz</button>
  </div>
</div>

<style>
  .page-content {padding: 10px;}
  .counter {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 5px;
    text-align: center;
  }
  .counter button {
    padding: 8px 15px;
    background-color: #ff3e00;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;
  }
  .counter button:hover {
    background-color: #c73000;
  }
</style>