<template>
  <v-card class="ma-2" max-width="345">
    <v-img
      :src="data.url"
      height="300px"
      cover
      :alt="breed.name || 'Cat image'"
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
          color="red"
          hide-details
        ></v-checkbox>
      </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

// Definicja propsów
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

// Definicja emitowanych zdarzeń
const emit = defineEmits(['unfavourited']);

// Klucz API ze zmiennych środowiskowych (upewnij się, że VITE_CAT_API_KEY jest ustawiony)
const apiKey = import.meta.env.VITE_CAT_API_KEY;

// Stan wewnętrzny
const favouriteData = ref(props.data.favourite); // Przechowuje obiekt ulubionego lub null
const isTogglingFavourite = ref(false); // Flaga ładowania podczas zmiany statusu ulubionego

// Obliczony stan - czy obrazek jest ulubiony (boolean)
const isFavourite = computed(() => !!favouriteData.value);

// Obliczony stan - dane rasy (zabezpieczenie przed brakiem danych)
const breed = computed(() => props.data.breeds?.[0] || {});

// Funkcja obsługująca dodawanie/usuwanie z ulubionych
async function handleFavouriteToggle() {
  if (!apiKey) {
    console.error('VITE_CAT_API_KEY is not set!');
    return;
  }
  isTogglingFavourite.value = true;

  const currentlyFavourited = isFavourite.value;
  const headers = {
    'content-type': 'application/json',
    'x-api-key': apiKey,
  };

  try {
    if (!currentlyFavourited) {
      // Dodawanie do ulubionych
      const response = await fetch('https://api.thecatapi.com/v1/favourites', {
        method: 'POST',
        headers,
        body: JSON.stringify({ image_id: props.data.id }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const newFavourite = await response.json();
      favouriteData.value = newFavourite; // Zaktualizuj stan o dane nowego ulubionego
    } else {
      // Usuwanie z ulubionych
      const favouriteId = favouriteData.value.id;
      const response = await fetch(`https://api.thecatapi.com/v1/favourites/${favouriteId}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      // Po pomyślnym usunięciu
      favouriteData.value = null; // Zresetuj stan ulubionego
      emit('unfavourited', favouriteId); // Emituj zdarzenie do rodzica
    }
  } catch (error) {
    console.error('Failed to toggle favourite:', error);
    // Można dodać powiadomienie dla użytkownika
  } finally {
    isTogglingFavourite.value = false;
  }
}
</script>

<style scoped>
/* Style specyficzne dla komponentu */
</style>