// scripts/generate-blob-tree-manifest.js

// Dla CommonJS (plik .js bez "type": "module" w package.json)
import  { list } from '@vercel/blob';
import fs from 'fs-extra';
import path from 'node:path'; // Użyj 'node:path' dla spójności
// const { fileURLToPath } = require('node:url'); // Niepotrzebne, jeśli używamy process.cwd()

// Jeśli używasz ES Modules:
// import dotenv from 'dotenv';
// dotenv.config();
// import { list, type ListBlobResultBlob, type ListFoldedBlobResult } from '@vercel/blob';
// import fs from 'fs-extra';
// import path from 'node:path';
// import { fileURLToPath } from 'node:url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


/**
 * @typedef {object} BlobTreeEntry
 * @property {string} name - Nazwa pliku lub folderu (ostatni segment pathname)
 * @property {string} displayName - Nazwa pliku lub folderu (ostatni segment pathname)
 * @property {'file' | 'directory'} type - Typ elementu
 * @property {string} path - Pełna ścieżka w Blob storage (używana do pobierania/operacji)
 * @property {string} [url] - URL do pliku (jeśli to plik, czasowy dla prywatnych)
 * @property {number} [size] - Rozmiar pliku w bajtach (jeśli to plik)
 * @property {Date} [uploadedAt] - Data przesłania (jeśli to plik)
 * @property {BlobTreeEntry[]} [children] - Dzieci, jeśli to folder
 */

// Konfiguracja
// Użyj process.cwd() dla ścieżki do katalogu projektu, co jest bardziej niezawodne niż __dirname w różnych kontekstach
const projectRootDir = process.cwd();
const manifestOutputDir = path.resolve(projectRootDir, 'server', 'data');
const manifestOutputFileName = 'blob-tree-manifest.json';
const manifestOutputPath = path.join(manifestOutputDir, manifestOutputFileName);

// Katalog (prefix) w Vercel Blob, który chcemy zmapować jako root.
// Pusty string '' oznacza listowanie wszystkiego od roota Twojego Blob store.
// Jeśli masz pliki w np. 'user-uploads/', ustaw tutaj 'user-uploads/'
// WAŻNE: Jeśli ustawiasz prefix, upewnij się, że kończy się ukośnikiem '/', jeśli ma reprezentować folder.
const rootBlobPrefixToList = ''; // Przykład: 'user-uploads/' lub '' dla roota


/**
 * Rekursywnie listuje zawartość Vercel Blob, budując strukturę drzewiastą.
 * @param {string} [currentPrefix=''] - Aktualny prefix (ścieżka "katalogu") w Blob do wylistowania.
 * @returns {Promise<BlobTreeEntry[]>}
 */
 async function listBlobTreeRecursive(currentPrefix = '') {
  console.log(`Listowanie Blob dla prefixu: "${currentPrefix || '(root Blob store)'}"`);
  /** @type {BlobTreeEntry[]} */
  const treeEntries = [];

  try {
    const { blobs, folders, cursor, hasMore } = await list({
      prefix: currentPrefix,
      limit: 1000, 
      mode: 'folded',
    });

    // Przetwórz pliki na bieżącym poziomie
    for (const blob of blobs) {
      let itemName = blob.pathname.substring(currentPrefix.length);
      if (itemName.startsWith('/')) itemName = itemName.substring(1);

      if (itemName && !itemName.endsWith('/')) { // Upewnij się, że to plik, a nie pusty wpis lub folder
        treeEntries.push({
          name: itemName,
          displayName: itemName,
          type: 'file',
          path: blob.pathname,
          url: blob.url,
          size: blob.size,
          uploadedAt: new Date(blob.uploadedAt), // Konwertuj na obiekt Date
        });
      }
    }

    // Przetwórz "foldery" (prefiksy) zwrócone przez `list` w trybie `folded`
    if (folders && folders.length > 0) {
      for (const folderPathname of folders) { // folderPathname to np. "user-uploads/images/"
        // Nazwa folderu to część folderPathname po currentPrefix, bez końcowego '/'
        let folderName = folderPathname.substring(currentPrefix.length);
        if (folderName.endsWith('/')) {
          folderName = folderName.substring(0, folderName.length - 1);
        }
        // Usuń wiodący ukośnik, jeśli currentPrefix był pusty, a folderPathname zaczyna się od /
        // (chociaż Vercel Blob zwykle nie zwraca ścieżek z wiodącym / dla roota)
        if (folderName.startsWith('/')) folderName = folderName.substring(1);


        if (folderName) { // Dodaj tylko jeśli nazwa folderu nie jest pusta
          console.log(`  Wchodzenie do folderu: ${folderPathname} (nazwa: ${folderName})`);
          const children = await listBlobTreeRecursive(folderPathname); // Rekursywne wywołanie dla podfolderu
          treeEntries.push({
            name: folderName,
            displayName: folderName,
            type: 'directory',
            path: folderPathname, // Pełna ścieżka "folderu"
            children: children,
          });
        }
      }
    }
    
    if (hasMore && cursor) {
        console.warn(`[UWAGA] Na poziomie "${currentPrefix}" jest więcej niż ${blobs.length + (folders?.length || 0)} elementów. Paginacja nie jest zaimplementowana w tym skrypcie. Następny kursor: ${cursor}`);
    }

  } catch (error) {
    console.error(`Błąd podczas listowania dla prefixu "${currentPrefix}":`, error);
    throw error; 
  }

  return treeEntries.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === 'directory' ? -1 : 1;
  });
}

async function generateManifest() {
  console.log(`Listowanie plików z: ${rootBlobPrefixToList}`);
  const fileList = await listBlobTreeRecursive(rootBlobPrefixToList);
  
  // Upewnij się, że katalog server/data istnieje
  await fs.ensureDir(path.dirname(manifestOutputPath), { recursive: true });
  
  await fs.writeFile(manifestOutputPath, JSON.stringify(fileList, null, 2));
  console.log(`Manifest plików zapisany w: ${manifestOutputPath}`);
}


generateManifest().catch(error => {
  console.error("Błąd podczas generowania manifestu plików:", error);
  process.exit(1);
});