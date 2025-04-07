<template>
    <v-card class="ma-2" max-width="345">
      <v-card-title>{{ breed.name }}</v-card-title>
  
      <v-img
        :src="data.url"
        :alt="breed.name"
        height="300"
        cover
      ></v-img>
  
      <v-card-text>
        <div>{{ breed.temperament }}</div>
      </v-card-text>
  
      <v-card-actions>
        <v-checkbox
          v-model="favouriteState"
          :true-value="true"
          :false-value="false"
          @change="handleFavouriteToggle"
          color="red"
          hide-details
        >
          <template v-slot:input>
            <!-- Zmieniamy ikony w zależności od stanu favouriteState -->
            <v-icon>{{ favouriteState ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
          </template>
        </v-checkbox>
        <v-checkbox
      v-model="isChecked"
      label="Kliknij, aby zmienić stan"
      @change="handleChange"
    >
   
        </v-checkbox>
          
      </v-card-actions>
    </v-card>
    <v-container>
    <v-checkbox
      v-model="isChecked"
      label="Kliknij, aby zmienić stan"
      on-icon="mdi-heart"
      off-icon="mdi-heart-outline"
      @change="handleChange"
    />
    <v-btn
    icon
    :color="isChecked ? 'red' : 'grey'"
    @click="handleChange"
    variant="text"
  >
    <v-icon>{{ isChecked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
  </v-btn>
  </v-container>
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
  
  const emit = defineEmits(['un-favourite'])
  
  const favourite = ref(props.data.favourite)
  const favouriteState = computed({
    get() {
      return !!favourite.value
    },
    set(value) {
      favourite.value = value
    }
  })
  
  const breed = computed(() => props.data.breeds?.[0] || {})
  
  async function handleFavouriteToggle() {
    const isFavouriting = !favourite.value
    console.log("Favourite toggled:", favouriteState.value);
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
  
        emit('un-favourite', favourite.value.id)
        favourite.value = null
      } catch (err) {
        console.error(err)
      }
    }
  }
  // Stan checkboxa
const isChecked = ref(false)

// Funkcja, która jest wywoływana przy zmianie stanu checkboxa
const handleChange = () => {
    isChecked.value = !isChecked.value
  console.log('Stan checkboxa zmienił się na:', isChecked.value)
}
  </script>
  