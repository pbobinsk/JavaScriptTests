<template>
  <li :class="['tree-item', entry.type]">
    <div class="item-content">
      <span v-if="entry.type === 'directory'" class="icon" @click="toggle" :class="{ 'open': isOpen }">
        {{ isOpen ? '📂' : '📁' }} <!-- Ikony dla otwartego/zamkniętego folderu -->
      </span>
      <span v-else class="icon">📄</span> <!-- Ikona dla pliku -->

      <a v-if="entry.type === 'file'" :href="`/api/serve-protected/${entry.path}`" target="_blank" class="file-link">
      <!-- poniższe były do serwowania plików z katalogów, albo z public 
       powyższe serwuje z api, a tam z Vercel Blob
      -->
      <!-- <a v-if="entry.type === 'file'" :href="`/protected-content/${entry.path}`" target="_blank" class="file-link"> -->
      <!-- <a v-if="entry.type === 'file'" :href="`${entry.url}`" target="_blank" class="file-link"> -->
        {{ entry.displayName }}
      </a>
      <span v-else @click="toggle" class="directory-name">
        {{ entry.displayName }}
      </span>
    </div>

    <ul v-if="entry.type === 'directory' && entry.children && entry.children.length > 0 && isOpen" class="nested-list">
      <!-- Rekursywne wywołanie komponentu dla dzieci -->
      <FileTreeItem v-for="child in entry.children" :key="child.path" :entry="child" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';

// Definicja typu dla propsa entry, zgodna z FileSystemEntry z API
interface FileSystemEntry {
  name: string;
  type: 'file' | 'directory';
  path: string;
  displayName: string;
  url?: string;
  children?: FileSystemEntry[];
}

const props = defineProps({
  entry: {
    type: Object as PropType<FileSystemEntry>,
    required: true
  }
});

const isOpen = ref(props.entry.type === 'directory' ? false : true); // Katalogi domyślnie zamknięte, chyba że chcesz inaczej

const toggle = () => {
  if (props.entry.type === 'directory') {
    isOpen.value = !isOpen.value;
  }
};
</script>

<style scoped>
.tree-item {
  list-style-type: none;
  margin-left: 0; /* Usunięcie domyślnego wcięcia dla li */
  padding-left: 20px; /* Dodanie własnego wcięcia dla zagnieżdżenia */
  position: relative; /* Dla linii łączących, jeśli chcesz dodać */
}

.item-content {
  display: flex;
  align-items: center;
  padding: 5px 0;
  cursor: default; /* Domyślny kursor */
}

.tree-item.directory > .item-content {
    cursor: pointer; /* Kursor pointer tylko dla klikalnych nazw katalogów */
}


.icon {
  margin-right: 8px;
  width: 20px; /* Stała szerokość dla ikon */
  display: inline-block;
  text-align: center;
}
.directory-name {
  font-weight: bold;
}

.file-link {
  color: #007bff;
  text-decoration: none;
}
.file-link:hover {
  text-decoration: underline;
}

.nested-list {
  list-style-type: none;
  padding-left: 0; /* Usunięcie domyślnego wcięcia dla ul */
  margin-left: 0px; /* Dodatkowe wcięcie dla zagnieżdżonych list */
}

/* Opcjonalnie: linie łączące dla drzewa (bardziej zaawansowane) */
/* .tree-item::before, .tree-item::after { ... } */
</style>