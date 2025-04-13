<template>
    <section>
      <h2>Strona główna</h2>
      <p>Witamy w naszej aplikacji stworzonej w Vue 3!</p>
      <button @click="count++">Kliknięto: {{ count }} razy</button>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        count: 0
      }
    }
  }
  </script>
  
  <style scoped>
  button {
    padding: 8px 16px;
    background-color: #00c3ff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
  }
  button:hover {
    background-color: #00a5d3;
  }
  </style>
  