<template>
  <v-app>
  <NavBar @mode-change="showFavorites = $event" />
  <v-container fluid>
    <FavouritesFeed v-if="showFavorites" />
    <RandomFeed v-else /> 
  </v-container>
</v-app>
</template>

<script setup>

import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import FavouritesFeed from './components/FavouritesFeed.vue'
import RandomFeed from './components/RandomFeed.vue'

const showFavorites = ref(false)
</script>

<style scoped>
/* Przenieś tu zawartość z App.css, jeśli potrzebna */
</style>
