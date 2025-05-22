<template>
  <div>
    <h1>Witaj w Aplikacji Nuxt!</h1>
    <p v-if="isLoggedIn">Jesteś zalogowany jako: {{ user?.login }}</p>
    <p v-else>Nie jesteś zalogowany.</p>
  </div>
</template>

<script setup lang="ts">
const { user, isLoggedIn } = useAuth();
useHead({ title: 'Strona Główna' });
</script>