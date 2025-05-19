<template>
  <div>
    <Head>
      <Title>Dane z API - Nuxt Demo</Title>
    </Head>
    <h1>Dane z API (Nuxt 3)</h1>
    <div v-if="pending">
      <p>Ładowanie danych...</p>
    </div>
    <div v-else-if="error">
      <p>Wystąpił błąd podczas ładowania danych: {{ error.message }}</p>
    </div>
    <div v-else-if="items && items.length">
      <ul>
        <li v-for="item in items" :key="item.id">
          <strong>{{ item.name }}:</strong> {{ item.description }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Brak danych do wyświetlenia.</p>
    </div>
    <button @click="refresh" :disabled="pending" style="margin-top: 1rem;">Odśwież dane</button>
  </div>
</template>

<script setup lang="ts">
// Definicja typu Item (powinna być spójna z typem w API)
interface Item {
  id: number;
  name: string;
  description: string;
}

// useFetch jest auto-importowane i specyficzne dla Nuxt 3
// Automatycznie obsługuje SSR i hydrację po stronie klienta
const { data: items, pending, error, refresh } = await useFetch<Item[]>('/api/items', {
  // Opcje dla useFetch, np.:
  // lazy: true, // Nie blokuje nawigacji, pokazuje stan ładowania
  // server: true, // Domyślnie true, wykonuje na serwerze przy pierwszym renderowaniu
  // pick: ['id', 'name'] // Wybierz tylko określone pola
});

// Można też użyć useAsyncData, jeśli potrzebna jest bardziej złożona logika pobierania
// const { data: items, pending, error, refresh } = await useAsyncData<Item[]>('items', () => {
//   return $fetch('/api/items');
// });
</script>