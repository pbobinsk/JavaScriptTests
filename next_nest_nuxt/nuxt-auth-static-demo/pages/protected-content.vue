<template>
  <div class="protected-page-container">
    <h1>Chroniona Zawartość</h1>
    <p class="welcome-message" v-if="user">
      Witaj, <strong>{{ user.login }}</strong>! Masz dostęp do tej specjalnej strony.
    </p>
    
    <div class="content-section">
      <h2>Dostępne Chronione Pliki:</h2>
      <div v-if="isLoadingFiles">
        <p>Ładowanie listy plików...</p>
      </div>
      <div v-else-if="filesError">
        <p class="api-error-message"><strong>Błąd:</strong> {{ filesError }}</p>
      </div>
      <div v-else-if="protectedFiles.length === 0">
        <p>Brak dostępnych chronionych plików.</p>
      </div>
    <!-- <ul v-else-if="protectedFiles.length > 0" class="protected-links">
      <li v-for="file in protectedFiles" :key="file.path">
        <a :href="`/api/serve-protected/${file.path}`" target="_blank" class="protected-link-item">
          {{ file.displayName }} 
        </a>
      </li>
    </ul> -->
    <ul v-else-if="protectedFileTree.length > 0" class="file-tree-root">
        <FileTreeItem v-for="entry in protectedFileTree" :key="entry.path" :entry="entry" />
    </ul>
    </div>

    <button @click="handleLogout" class="logout-button-page" :disabled="isLoggingOut">
      {{ isLoggingOut ? 'Wylogowywanie...' : 'Wyloguj' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'; // Poprawka: `ref` i `onMounted` są z 'vue'
import FileTreeItem from '~/components/FileTreeItem.vue'; // Importuj komponent drzewa

interface ProtectedFile { // Zaktualizowany interfejs, jeśli potrzebne
  name: string;
  type: 'file';
  path: string;
  displayName: string;
}

interface FileSystemEntry {
  name: string;
  type: 'file' | 'directory';
  path: string;
  displayName: string;
  children?: FileSystemEntry[];
}

const { user, setUser } = useAuth();
const router = useRouter();
useHead({ title: 'Chroniona Zawartość | Nuxt Auth Demo' });

const isLoggingOut = ref(false);
const protectedFiles = ref<ProtectedFile[]>([]);
const protectedFileTree = ref<FileSystemEntry[]>([]); // Zmieniona nazwa na fileTree
const isLoadingFiles = ref(true);
const filesError = ref<string | null>(null);

onMounted(async () => {
  await loadProtectedFiles();
  await loadProtectedFileTree();
});

async function loadProtectedFiles() {
  isLoadingFiles.value = true;
  filesError.value = null;
  try {
    // Używamy $fetch do pobrania listy plików
    const files = await $fetch<ProtectedFile[]>('/api/protected-files-list');
    protectedFiles.value = files;
  } catch (e: any) {
    console.error('Błąd podczas ładowania listy chronionych plików:', e);
    filesError.value = e.data?.message || e.message || 'Nie udało się załadować listy plików.';
    protectedFiles.value = []; // Wyczyść listę w razie błędu
  } finally {
    isLoadingFiles.value = false;
  }
}

async function loadProtectedFileTree() {
  isLoadingFiles.value = true;
  filesError.value = null;
  try {
    const treeData = await $fetch<FileSystemEntry[]>('/api/protected-files-list');
    protectedFileTree.value = treeData;
  } catch (e: any) {
    console.error('Błąd podczas ładowania drzewa plików:', e);
    filesError.value = e.data?.message || e.message || 'Nie udało się załadować struktury plików.';
    protectedFileTree.value = [];
  } finally {
    isLoadingFiles.value = false;
  }
}

const handleLogout = async () => {
  isLoggingOut.value = true;
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  } catch (e) {
    console.error('Błąd wylogowywania:', e);
    alert('Wystąpił błąd podczas wylogowywania.');
  } finally {
    isLoggingOut.value = false;
  }
};
</script>

<style scoped>
/* ... (style z poprzedniego przykładu mogą pozostać, dostosuj jeśli trzeba) ... */
.protected-page-container {
  padding: 20px;
  /* text-align: center; */ /* Możesz usunąć, jeśli chcesz wyrównanie do lewej */
}
.protected-page-container h1 {
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}
.welcome-message {
  font-size: 1.1em;
  color: #555;
  margin-bottom: 30px;
  text-align: center;
}
.welcome-message strong {
  color: #007bff;
}
.content-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
}
.content-section h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.4em;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}
.protected-links {
  list-style-type: none;
  padding: 0;
}
.protected-links li {
  margin-bottom: 10px;
  padding: 5px 0;
  border-bottom: 1px dotted #eee;
}
.protected-links li:last-child {
  border-bottom: none;
}
.protected-link-item {
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}
.protected-link-item:hover {
  color: #0056b3;
  text-decoration: underline;
}
.api-error-message { /* Już zdefiniowane, można dostosować */
  color: #dc3545;
  margin-top: 15px;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
.logout-button-page { /* Już zdefiniowane */
  display: block; /* Aby wyśrodkować przy użyciu margin: auto */
  margin: 20px auto 0 auto; /* Wyśrodkowanie przycisku */
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
.logout-button-page:hover {
  background-color: #c82333;
}
.logout-button-page:disabled {
  background-color: #e07a83;
  cursor: not-allowed;
}
</style>