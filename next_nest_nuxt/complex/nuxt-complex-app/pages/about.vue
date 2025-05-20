<template>
  <div>
    <Head>
      <Title>O Nas - Nuxt Demo</Title>
    </Head>
    <h1>O Nas</h1>
    <p>Jesteśmy firmą demonstracyjną pokazującą możliwości Nuxt 3.</p>
    <p>Naszym celem jest tworzenie świetnych aplikacji webowych z Vue.</p>
    <!-- Komponent Licznika -->
    <div class="counter-container">
      <h2>Prosty Licznik (Vue)</h2>
      <p>Aktualna wartość: {{ count }}</p>
      <button @click="increment" class="btn btn-primary">Zwiększ</button>
      <button @click="decrement" class="btn btn-secondary">Zmniejsz</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'; // Importuj ref do reaktywnego stanu

// Stan licznika
const count = ref(0); // ref() tworzy reaktywną referencję

// Metody do modyfikacji licznika
const increment = () => {
  count.value++;
};

const decrement = () => {
  count.value--;
};
</script>

<style scoped>
.counter-container {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.counter-container h2 {
  margin-top: 0;
}

.btn {
  padding: 8px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

.btn-primary {
  background-color: #007bff; /* Kolor Vue/Bootstrap primary */
}
.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d; /* Kolor Vue/Bootstrap secondary */
}
.btn-secondary:hover {
  background-color: #545b62;
}
</style>