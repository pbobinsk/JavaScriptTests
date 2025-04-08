<template>
    <v-card class="ma-2" max-width="345">
        
      <v-img
        :src="data.url"
        :alt="breed.name"
        height="300"
        cover
      ></v-img>
  
      <v-card-item>
       <v-card-title v-if="breed.name">{{ breed.name }}</v-card-title>
      </v-card-item>


    <v-card-text v-if="breed.temperament">
      {{ breed.temperament }}
    </v-card-text>
      
      <v-card-actions>
        <v-checkbox
          v-model="favouriteState"
          :true-value="true"
          :false-value="false"
          @change="handleFavouriteToggle"
          :true-icon="'mdi-heart'"
          :false-icon="'mdi-heart-outline'"
          color="blue"
          hide-details
        ></v-checkbox>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const props = defineProps({
    data: {
      type: Object,
      required: true
    },
    onUnFavourite: Function
  })
  
  const emit = defineEmits(['unfavourited'])
  
  const favourite = ref(props.data.favourite)
  const favouriteState = computed({
  get: () => !!favourite.value,
  set: (val) => {}
})
  
  const breed = computed(() => props.data.breeds?.[0] || {})
  
  async function handleFavouriteToggle() {
    const isFavouriting = !favourite.value
  
    if (isFavouriting) {
      const rawBody = JSON.stringify({ image_id: props.data.id })
  
      try {
        const response = await fetch('https://api.thecatapi.com/v1/favourites', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': import.meta.env.VITE_CAT_API_KEY
          },
          body: rawBody
        })
  
        const newFavourite = await response.json()
        favourite.value = newFavourite
      } catch (err) {
        console.error(err)
      }
  
    } else {
      try {
        await fetch(`https://api.thecatapi.com/v1/favourites/${favourite.value.id}`, {
          method: 'DELETE',
          headers: {
            'content-type': 'application/json',
            'x-api-key': import.meta.env.VITE_CAT_API_KEY
          }
        })
  
        emit('unfavourited', favourite.value.id)
        favourite.value = null
      } catch (err) {
        console.error(err)
      }
    }
  }
  </script>
  