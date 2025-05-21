<script>
  // Logika specyficzna dla About
  let count = 0;
  const increment = () => count++;
</script>

<div class="page-content">
  <h1>O Nas</h1>
  <p>Jesteśmy małym przykładem pokazującym możliwości Svelte i svelte-spa-router.</p>
  
  <div class="counter">
    <p>Licznik kliknięć: {count}</p>
    <button on:click={increment}>Kliknij mnie!</button>
  </div>
</div>

<style>
  .page-content {
    padding: 20px;
  }
  .counter {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 5px;
    text-align: center;
  }
  .counter button {
    padding: 8px 15px;
    background-color: #ff3e00; /* Kolor Svelte */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .counter button:hover {
    background-color: #c73000;
  }
</style>