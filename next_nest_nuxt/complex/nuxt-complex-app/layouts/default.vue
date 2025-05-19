<template>
  <div>
    <TheNavbar />
    <div class="container">
      <main>
        <slot /> <!-- Tutaj renderowane będą strony z katalogu `pages` -->
      </main>
    </div>
    <footer>
      <hr />
      <p style="text-align: center; color: #777;">
        © {{ new Date().getFullYear() }} - Nuxt 3 Demo
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Można dodać logikę layoutu, jeśli potrzebna
// useHead({
//   titleTemplate: (titleChunk) => {
//     return titleChunk ? `${titleChunk} - Nuxt App` : 'Nuxt App';
//   }
// })
</script>