<script setup>
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <div>
    <h2>Licznik: {{ count }}</h2>
    <button @click="count++">Kliknij (+1)</button>
  </div>
</template>
