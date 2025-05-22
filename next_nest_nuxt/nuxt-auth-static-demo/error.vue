<template>
  <div class="error-page-container">
    <div class="error-card">
      <div class="error-icon">
        <!-- Możesz tu wstawić SVG lub inną ikonę -->
        <span v-if="error?.statusCode === 401 || error?.statusCode === 403">🚫</span>
        <span v-else-if="error?.statusCode === 404">🤷</span>
        <span v-else>💥</span>
      </div>
      <h1 class="error-title">
        {{ error?.statusCode === 404 ? 'Strony nie znaleziono' : 'Wystąpił błąd' }}
      </h1>
      <p class="error-code" v-if="error?.statusCode">
        Błąd {{ error.statusCode }}
      </p>
      <p class="error-message">
        {{ error?.statusMessage || error?.message || 'Przepraszamy, coś poszło nie tak.' }}
      </p>
      <p v-if="error?.data?.message && error.data.message !== (error?.statusMessage || error?.message)">
        Szczegóły: {{ error.data.message }}
      </p>
      <button @click="handleErrorClear" class="error-button">
        Wróć na stronę główną
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'; // Importuj typ NuxtError

const props = defineProps({
  error: Object as () => NuxtError // Błąd jest przekazywany jako prop
});

const handleErrorClear = () => {
  // clearError przekierowuje na stronę główną i czyści błąd
  // lub możesz przekierować na inną stronę, jeśli chcesz
  clearError({ redirect: '/' });
};

// Ustaw tytuł strony błędu
useHead({
  title: `Błąd ${props.error?.statusCode || ''} | Moja Aplikacja`,
  // Możesz dodać meta tagi, jeśli potrzebne
});

// Logowanie błędu po stronie klienta dla dewelopera
if (process.client) {
    console.error("Wystąpił błąd Nuxt:", props.error);
}
</script>

<style scoped>
.error-page-container {
  display: flex;
  flex-direction: column; /* Upewnij się, że zawartość jest w kolumnie */
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Cała wysokość widoku */
  width: 100vw; /* Cała szerokość widoku */
  padding: 20px;
  box-sizing: border-box;
  background-color: #f0f0f0; /* Tło takie jak reszta strony */
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.error-card {
  background-color: #ffffff;
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px; /* Ogranicz szerokość karty błędu */
  /* min-height: 300px; */ /* Opcjonalnie, minimalna wysokość karty */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-icon {
  font-size: 4rem; /* Duża ikona */
  margin-bottom: 20px;
  color: #dc3545; /* Kolor dla błędów */
}
.error-icon span[v-if*="404"] { /* Specyficzny kolor dla 404 */
    color: #ffc107; /* Żółty/pomarańczowy */
}


.error-title {
  font-size: 1.8rem;
  color: #333;
  margin-top: 0;
  margin-bottom: 10px;
}

.error-code {
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 20px;
  font-weight: bold;
}

.error-message {
  font-size: 1rem;
  color: #555;
  margin-bottom: 25px;
  line-height: 1.6;
}

.error-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none; /* Jeśli używasz <a> zamiast <button> */
  transition: background-color 0.3s ease;
}

.error-button:hover {
  background-color: #0056b3;
}
</style>