<script setup>
import { ref, onMounted } from "vue";

// API do pobierania kotów
const API_URL = "https://api.thecatapi.com/v1/breeds";
const API_IMAGE_URL = "https://api.thecatapi.com/v1/images/search?breed_ids=";

const breeds = ref([]);
const selectedBreed = ref("");
const imageUrl = ref("");

// Pobieranie listy ras po załadowaniu strony
onMounted(async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  breeds.value = data;
});

// Pobieranie obrazu dla wybranej rasy
const getCatImage = async () => {
  if (!selectedBreed.value) return;
  
  const response = await fetch(`${API_IMAGE_URL}${selectedBreed.value}`);
  const data = await response.json();
  imageUrl.value = data.length > 0 ? data[0].url : "";
};
</script>

<template>
  <div class="container">
    <h1>Wyszukiwarka kotów 🐱</h1>
    
    <select v-model="selectedBreed" @change="getCatImage">
      <option value="">Wybierz rasę</option>
      <option v-for="breed in breeds" :key="breed.id" :value="breed.id">
        {{ breed.name }}
      </option>
    </select>

    <div v-if="imageUrl" class="image-container">
      <img :src="imageUrl" alt="Obraz kota" />
    </div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  font-family: Arial, sans-serif;
}

select {
  padding: 10px;
  margin: 10px;
  font-size: 16px;
}

.image-container {
  margin-top: 20px;
}

img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
