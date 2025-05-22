<!-- layouts/default.vue -->
<template>
  <div class="app-shell">
    <header>
      <nav>
        <NuxtLink to="/">Strona Główna</NuxtLink>
        <NuxtLink to="/protected-content">Chroniona Zawartość</NuxtLink>
        <template v-if="!isLoggedIn">
          <NuxtLink to="/login">Logowanie</NuxtLink>
        </template>
        <template v-if="isLoggedIn">
          <span>Witaj, {{ user?.login }}!</span>
          <button @click="handleLogout" class="logout-button">Wyloguj</button>
        </template>
      </nav>
    </header>
    <main class="main-content">
      <NuxtPage /> <!-- Tutaj renderowane są strony -->
    </main>
    <footer>
      <p>© {{ new Date().getFullYear() }} Nuxt Auth Demo</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, isLoggedIn, setUser } = useAuth();
const router = useRouter();

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  } catch (e) {
    console.error('Błąd wylogowywania z layoutu:', e);
  }
};
</script>

<style>
/* Proste style dla layoutu - dostosuj według potrzeb */
body {
  margin: 0;
  font-family: sans-serif;
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Aby kontener nie rozciągał się na całą wysokość, jeśli nie musi */
  min-height: 100vh;
  padding-top: 20px;
}

.app-shell {
  width: 800px;
  max-width: 95%;
  min-height: 500px; /* Minimalna wysokość "okna" aplikacji */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

header {
  background-color: #333;
  color: white;
  padding: 1rem;
}
nav {
  display: flex;
  align-items: center;
  gap: 15px;
}
nav a {
  color: white;
  text-decoration: none;
}
nav a.router-link-active { /* Aktywny link */
  font-weight: bold;
  text-decoration: underline;
}
nav span {
  margin-left: auto; /* Przesuń powitanie na prawo */
}
.logout-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5em 1em;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}
.logout-button:hover {
  background-color: #c82333;
}

.main-content {
  padding: 20px;
  flex-grow: 1; /* Pozwól main rozciągnąć się */
  overflow-y: auto; /* Pasek przewijania dla długiej treści */
}

footer {
  text-align: center;
  padding: 1rem;
  background-color: #eee;
  border-top: 1px solid #ddd;
}
</style>