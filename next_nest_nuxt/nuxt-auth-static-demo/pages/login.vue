<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Logowanie</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="login">Login:</label>
          <input type="text" id="login" v-model="login" required placeholder="Wpisz login" />
        </div>
        <div class="form-group">
          <label for="password">Hasło:</label>
          <input type="password" id="password" v-model="password" required placeholder="Wpisz hasło" />
        </div>
        <button type="submit" :disabled="loading" class="submit-button">
          {{ loading ? 'Logowanie...' : 'Zaloguj' }}
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// W Nuxt 3 useRouter i useRoute są auto-importowane lub dostępne globalnie
// import { useRouter, useRoute } from 'vue-router'; // Nie jest to potrzebne, jeśli używamy globalnych

const { setUser } = useAuth(); // Zakładam, że useAuth jest auto-importowane z composables/
const router = useRouter();
const route = useRoute();

const login = ref('');
const password = ref('');
const error = ref<string | null>(null);
const loading = ref(false);

useHead({ title: 'Logowanie | Nuxt Auth Demo' });

const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await $fetch<{ user: any }>('/api/auth/login', {
      method: 'POST',
      body: {
        login: login.value,
        password: password.value,
      },
    });

    if (response.user) {
      setUser(response.user);
      const redirectTo = route.query.redirect as string || '/';
      router.push(redirectTo);
    }
  } catch (e: any) {
    console.error('Błąd logowania:', e);
    error.value = e.data?.message || e.message || 'Wystąpił błąd podczas logowania.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* `scoped` oznacza, że te style będą miały zastosowanie tylko do tego komponentu */

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* min-height: calc(100vh - 160px); */ /* Dopasuj, jeśli masz header/footer o znanej wysokości */
  /* Lub, jeśli chcesz, aby zajmował całą dostępną przestrzeń w <main> */
  width: 100%;
  flex-grow: 1; /* Jeśli <main> jest flex containerem */
  padding: 20px;
  box-sizing: border-box;
}

.login-card {
  background-color: #ffffff;
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px; /* Maksymalna szerokość karty logowania */
  text-align: center;
}

.login-card h1 {
  margin-top: 0;
  margin-bottom: 25px;
  color: #333;
  font-size: 24px;
}

.login-form .form-group {
  margin-bottom: 20px;
  text-align: left;
}

.login-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
  font-size: 14px;
}

.login-form input[type="text"],
.login-form input[type="password"] {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* Aby padding nie zwiększał szerokości */
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.login-form input[type="text"]:focus,
.login-form input[type="password"]:focus {
  border-color: #007bff; /* Kolor akcentu przy focusie */
  outline: none; /* Usuń domyślny outline przeglądarki */
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* Lekki cień przy focusie */
}

.login-form .submit-button {
  width: 100%;
  padding: 12px 15px;
  background-color: #007bff; /* Główny kolor przycisku */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.login-form .submit-button:hover {
  background-color: #0056b3; /* Ciemniejszy odcień przy najechaniu */
}

.login-form .submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-form .error-message {
  color: #dc3545; /* Kolor błędu */
  margin-top: 15px;
  font-size: 14px;
  text-align: center;
}
</style>