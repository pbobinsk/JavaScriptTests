<script setup>
import { ref } from "vue";

const tasks = ref(["Kup mleko", "Zrób obiad"]);

const addTask = () => {
  tasks.value.push(`Nowe zadanie ${tasks.value.length + 1}`);
};
</script>

<template>
  <div>
    <h2>Lista zadań</h2>
    <ul>
      <li v-for="(task, index) in tasks" :key="index">{{ task }}</li>
    </ul>
    <button @click="addTask">Dodaj zadanie</button>
  </div>
</template>
