<script setup>
import { ref, onMounted } from "vue";

// API do pobierania ras kotów
const API_BREEDS_URL = "https://api.thecatapi.com/v1/breeds";
const API_IMAGE_URL = "https://api.thecatapi.com/v1/images/search?breed_ids=";

const breeds = ref([]); // Lista ras
const selectedBreed = ref(null); // Wybrana rasa
const imageUrl = ref(""); // Obraz wybranej rasy

// Pobieranie listy ras kotów po załadowaniu strony
onMounted(async () => {
  try {
    const response = await fetch(API_BREEDS_URL);
    const data = await response.json();
    breeds.value = data;
  } catch (error) {
    console.error("Błąd podczas pobierania ras:", error);
  }
});

// Pobieranie zdjęcia dla wybranej rasy
const fetchBreedImage = async () => {
  if (!selectedBreed.value) return;

  try {
    const response = await fetch(`${API_IMAGE_URL}${selectedBreed.value.id}`);
    const data = await response.json();
    imageUrl.value = data.length > 0 ? data[0].url : "";
  } catch (error) {
    console.error("Błąd podczas pobierania obrazu:", error);
  }
};
</script>

<template>
  <div class="container">
    <h1>Wybór rasy kota 🐱</h1>

    <!-- Formularz wyboru rasy -->
    <div class="form-group">
      <label for="breed-select">Wybierz rasę:</label>
      <select id="breed-select" v-model="selectedBreed" @change="fetchBreedImage">
        <option disabled value="">Wybierz rasę</option>
        <option v-for="breed in breeds" :key="breed.id" :value="breed">
          {{ breed.name }}
        </option>
      </select>
    </div>

    <!-- Szczegóły rasy -->
    <div v-if="selectedBreed" class="breed-details">
      <h2>{{ selectedBreed.name }}</h2>
      <p><strong>Pochodzenie:</strong> {{ selectedBreed.origin }}</p>
      <p><strong>Temperament:</strong> {{ selectedBreed.temperament }}</p>
      
      <!-- Tabela z dodatkowymi informacjami -->
      <table class="breed-info-table">
        <tr>
          <td><strong>Przyjazny dla psów:</strong></td>
          <td>{{ selectedBreed.dog_friendly }}/5</td>
        </tr>
        <tr>
          <td><strong>Inteligencja:</strong></td>
          <td>{{ selectedBreed.intelligence }}/5</td>
        </tr>
        <tr>
          <td><strong>Długość życia:</strong></td>
          <td>{{ selectedBreed.life_span }} lat</td>
        </tr>
      </table>

      <!-- Zdjęcie kota -->
      <div class="image-container" v-if="imageUrl">
        <img :src="imageUrl" alt="Zdjęcie kota" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  font-family: Arial, sans-serif;
  margin: 20px;
}

.form-group {
  margin-bottom: 20px;
}

select {
  padding: 10px;
  font-size: 16px;
}

.breed-details {
  margin-top: 20px;
}

.breed-info-table {
  margin: 10px auto;
  border-collapse: collapse;
}

.breed-info-table td {
  padding: 8px;
  border: 1px solid #ddd;
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
