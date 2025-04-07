<template>
    <v-container fluid>
      <v-row>
        <v-col
          v-for="image in images"
          :key="image.id"
          cols="12"
          sm="6"
          md="4"
        >
          <Image :data="image" />
        </v-col>
      </v-row>
  
      <v-row justify="center" v-if="images.length === 0">
        <v-col cols="auto">
          <v-progress-circular indeterminate color="primary" />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import Image from './Image.vue'
  
  const images = ref([])
  const hasFetched = ref(false)
  
  async function refreshImages() {
    images.value = []
  
    try {
      const response = await fetch(
        'https://api.thecatapi.com/v1/images/search?limit=12&has_breeds=1',
        {
          headers: {
            'content-type': 'application/json',
            'x-api-key': import.meta.env.VITE_CAT_API_KEY
          }
        }
      )
      const json = await response.json()
      images.value = json
      // Dodajemy pole `favourite` do każdego obrazu
    images.value = json.map(image => ({
      ...image,
      favourite: false // Ustawiamy domyślną wartość `favourite`
    }))
    console.log('images set:', images.value)  // Dodajemy logowanie
    } catch (e) {
      console.error(e)
    }
  }
  
  onMounted(() => {
    if (hasFetched.value) return
    hasFetched.value = true
    refreshImages()
  })
  </script>
  