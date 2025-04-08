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
      <Image :data="image" @unfavourited="onImageUnfavourited" />
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

function onImageUnfavourited(favouriteId) {
  console.log('onImageUnfavourited')
  images.value = images.value.filter((image) => image.favourite.id !== favouriteId)
}

async function refreshImages() {
  images.value = []

  try {
    const response = await fetch(
      'https://api.thecatapi.com/v1/favourites?order=DESC',
      {
        headers: {
          'content-type': 'application/json',
          'x-api-key': import.meta.env.VITE_CAT_API_KEY
        }
      }
    )
    const json = await response.json()
    //const mapped = json
    // const mapped = json.map(favourite => {
    //             return {
    //                 id: favourite.image.id,
    //                 url: favourite.image.url,
    //                 favourite,
    //                 breeds: []
    //             }})

    
    const mapped = await Promise.all(
      json.map(async (favourite) => {
        try {
          const imgRes = await fetch(`https://api.thecatapi.com/v1/images/${favourite.image_id}`, {
            headers: {
              'content-type': 'application/json',
              'x-api-key': import.meta.env.VITE_CAT_API_KEY
            }
          })

          const fullImage = await imgRes.json()

          return {
            ...fullImage,
            favourite
          }
        } catch (e) {
          console.warn('Could not fetch full image:', favourite.image_id)
          return {
            id: favourite.image_id,
            url: favourite.image?.url,
            breeds: [],
            favourite
          }
        }
      })
    )

    images.value = mapped
    console.log('fav images set:', images.value)  // Dodajemy logowanie
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
