<script setup>
import { ref } from "vue";

const user = ref({ name: "Jan", age: 25 });

const updateAge = () => {
  user.value.age++;
};
</script>

<template>
  <div>
    <h2>Dane użytkownika</h2>
    <p>Imię: {{ user.name }}</p>
    <p>Wiek: {{ user.age }}</p>
    <button @click="updateAge">Zwiększ wiek</button>
  </div>
</template>
