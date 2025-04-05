<script setup>
import { ref, onMounted } from "vue";

const posts = ref([]);

onMounted(async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  posts.value = await res.json();
});
</script>

<template>
  <div>
    <h2>📩 Posty z API</h2>
    <ul v-if="posts.length > 0">
      <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
    </ul>
    <p v-else>Ładowanie postów...</p>
  </div>
</template>
