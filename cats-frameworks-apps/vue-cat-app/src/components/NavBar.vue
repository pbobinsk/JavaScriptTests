<template>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title class="flex-grow-1">
        Vue Kitties Tutorial App: Favouriting
      </v-toolbar-title>
  
      <v-switch
        v-model="mode"
        label="Show Your Favourites"
        color="red"
        @change="handleModeChange"
      />
    </v-app-bar>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const emit = defineEmits(['mode-change'])
  const mode = ref(false)
  
  function handleModeChange() {
    emit('mode-change', mode.value)
  }
  </script>
  
  <style scoped>
  .flex-grow-1 {
    flex-grow: 1;
  }
  </style>
  