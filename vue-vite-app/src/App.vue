<template>
  <div id="app">
    <h1>Vue + Vite App</h1>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: left; /* Wyśrodkowanie tekstu zmieniamy na 'left' */
  padding: 0; /* Usuwamy domyślne paddingi */
  margin: 0; /* Usuwamy domyślny margines */
  position: absolute; /* Ustawiamy pozycję absolutną */
  top: 0; /* Przesuwamy do góry */
  left: 0; /* Przesuwamy na lewo */
  width: 100%; /* Zajmujemy całą szerokość */
  height: 100%; /* Zajmujemy całą wysokość */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Przesuwamy zawartość do góry */
  align-items: flex-start; /* Przesuwamy zawartość do lewej */
}

nav {
  margin: 20px;
}

a {
  text-decoration: none;
  color: #42b983;
}
</style>
