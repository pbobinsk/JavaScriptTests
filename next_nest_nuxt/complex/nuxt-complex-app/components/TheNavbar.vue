<template>
  <nav class="navbar">
    <NuxtLink to="/" class="nav-link">Strona Główna</NuxtLink>
    <NuxtLink to="/about" class="nav-link">O Nas</NuxtLink>
    <NuxtLink to="/data" class="nav-link">Dane</NuxtLink>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #333;
  padding: 1rem;
  text-align: center;
  border-bottom: 3px solid #41b883; /* Kolor Nuxt Green */
}

.nav-link {
  color: white;
  margin: 0 1rem;
  text-decoration: none;
  font-size: 1.1rem;
}

.nav-link:hover,
.nav-link.router-link-active.router-link-exact-active { /* Aktywny link */
  color: #41b883;
  text-decoration: none;
}
</style>