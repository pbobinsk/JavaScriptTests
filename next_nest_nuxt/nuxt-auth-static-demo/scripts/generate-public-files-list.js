// scripts/generate-public-files-list.js
import fs from 'node:fs/promises';
import path from 'node:path';

import { fileURLToPath } from 'node:url'; // Do konwersji import.meta.url

// Uzyskanie __dirname w kontekście ES Module
const __filename = fileURLToPath(import.meta.url); // Pełna ścieżka do bieżącego pliku
const __dirname = path.dirname(__filename);       // Katalog bieżącego pliku

const publicDir = path.resolve(__dirname, '../public');
const protectedSubDir = 'protected-content'; // Nazwa Twojego katalogu
const targetDirToList = path.join(publicDir, protectedSubDir);
const manifestOutputPath = path.resolve(__dirname, '../server/data/public-files-manifest.json'); // Gdzie zapisać JSON

// Załóżmy, że `fs` i `path` są już zaimportowane/wymagane na początku pliku
// const fs = require('fs-extra'); // lub require('fs').promises dla natywnego fs
// const path = require('path');

/**
 * Rekursywnie listuje zawartość katalogu, tworząc drzewiastą strukturę.
 * Koncentruje się na plikach HTML i ignoruje katalog 'images'.
 * @param {string} directoryPath - Pełna ścieżka systemowa do aktualnie przetwarzanego katalogu.
 * @param {string} baseDirectory - Pełna ścieżka systemowa do katalogu bazowego, od którego liczymy ścieżki względne.
 *                                (Nie jest bezpośrednio używane w tej wersji do budowania `itemRelativePath`, ale może być przydatne dla innych logik).
 * @param {string} [currentRelativePath=''] - Akumulator ścieżki względnej od katalogu, który pierwotnie skanujemy.
 * @returns {Promise<Array<Object>>} Tablica obiektów reprezentujących pliki i katalogi.
 */
async function listDirectoryRecursive(
  directoryPath,
  baseDirectory, // Ten parametr nie jest aktywnie używany w logice budowania ścieżki poniżej, ale jest zachowany dla spójności z Twoim typowaniem.
                  // itemRelativePath jest budowane na podstawie currentRelativePath.
  currentRelativePath = ''
) {
  const entries = []; // Tablica na wyniki
  let items;

  try {
    // Odczytaj zawartość katalogu, uzyskując obiekty fs.Dirent (dzięki withFileTypes: true)
    items = await fs.readdir(directoryPath, { withFileTypes: true });
  } catch (error) {
    // Jeśli nie można odczytać katalogu (np. brak uprawnień, nie istnieje, nie jest katalogiem)
    console.warn(`[protected-files-list] Nie można odczytać katalogu: ${directoryPath} - Błąd: ${error.message}`);
    return []; // Zwróć pustą tablicę
  }

  for (const item of items) {
    const itemName = item.name;
    // Pełna ścieżka systemowa do bieżącego elementu (pliku/katalogu)
    const itemFullPath = path.join(directoryPath, itemName);
    // Ścieżka względna bieżącego elementu od katalogu, który pierwotnie zaczęliśmy skanować
    // np. jeśli currentRelativePath to "podkatalog", a itemName to "plik.html", to itemRelativePath będzie "podkatalog/plik.html"
    const itemRelativePath = path.join(currentRelativePath, itemName).replace(/\\/g, '/'); // Normalizuj separatory

    if (item.isDirectory()) {
      // Ignoruj katalog 'images' i jego zawartość całkowicie
      if (itemName.toLowerCase() === 'images') {
        console.log(`[protected-files-list] Ignorowanie katalogu 'images': ${itemRelativePath}`);
        continue; // Przejdź do następnego elementu w pętli
      }

      // Rekursywnie pobierz dzieci dla tego katalogu
      // Przekazujemy pełną ścieżkę systemową do podkatalogu i zaktualizowaną ścieżkę względną
      const children = await listDirectoryRecursive(itemFullPath, baseDirectory, itemRelativePath);
      
      // Dodaj katalog do listy tylko jeśli zawiera jakiekolwiek elementy (po odfiltrowaniu)
      // W tym przypadku, jeśli 'children' nie jest puste, oznacza to, że w podkatalogach
      // (lub w tym katalogu, jeśli byśmy nie filtrowali HTML na tym poziomie) coś znaleziono.
      if (children.length > 0) {
        entries.push({
          name: itemName,
          type: 'directory',
          path: itemRelativePath, // Ścieżka względna katalogu
          displayName: itemName,  // Możesz tu dodać logikę do formatowania nazwy wyświetlanej
          children: children,     // Zagnieżdżone elementy
        });
      } else {
        // Opcjonalnie: można dodać logikę dla pustych katalogów (innych niż 'images'), jeśli chcesz je pokazać.
        // Na razie puste (lub zawierające tylko nie-HTML/nie-podkatalogi z HTML) katalogi są pomijane.
        console.log(`[protected-files-list] Pomijanie pustego (lub niepasującego do kryteriów) katalogu: ${itemRelativePath}`);
      }

    } else if (item.isFile()) {
      // Dodawaj tylko pliki HTML
      if (path.extname(itemName).toLowerCase() === '.html') {
        entries.push({
          name: itemName,
          type: 'file',
          path: itemRelativePath, // Ścieżka względna pliku
          displayName: itemName,  // Możesz tu dodać logikę do formatowania nazwy wyświetlanej
                                  // np. usunięcie rozszerzenia .html
        });
      }
    }
  }

  // Sortuj wpisy: najpierw katalogi, potem pliki (alfabetycznie w ramach tych grup)
  return entries.sort((a, b) => {
    if (a.type === 'directory' && b.type === 'file') return -1; // Katalogi przed plikami
    if (a.type === 'file' && b.type === 'directory') return 1;  // Pliki po katalogach
    return a.name.localeCompare(b.name); // Sortowanie alfabetyczne dla tego samego typu
  });
}

// Przykład użycia (zakładając, że reszta skryptu `generate-tree-manifest.js` jest podobna):
// async function generateTreeManifest() {
//   const projectRootDir = path.resolve(__dirname, '..');
//   const publicDirRelative = 'public';
//   const protectedSubDirRelative = 'protected-content';
//   const targetDirToScan = path.join(projectRootDir, publicDirRelative, protectedSubDirRelative);
//   const manifestOutputPath = path.resolve(projectRootDir, 'server', 'data', 'public-files-tree-manifest.json');

//   console.log(`Rozpoczynanie generowania drzewiastego manifestu plików z: ${targetDirToScan}`);
  
//   if (!fs.existsSync(targetDirToScan)) {
//     // ... obsługa braku katalogu ...
//     return;
//   }

//   // Wywołanie funkcji listującej. `baseDirectory` może być `targetDirToScan` lub `projectRootDir`
//   // w zależności od tego, jak chcesz interpretować ścieżki.
//   // Dla budowania `itemRelativePath` w obecnej logice, `baseDirectory` nie jest kluczowe.
//   const fileTree = await listDirectoryRecursive(targetDirToScan, targetDirToScan); 
  
//   await fs.ensureDir(path.dirname(manifestOutputPath));
//   await fs.writeJson(manifestOutputPath, fileTree, { spaces: 2 });
//   console.log(`Drzewiasty manifest plików zapisany w: ${manifestOutputPath}`);
// }

// generateTreeManifest().catch(console.error);

// async function listDirectoryRecursive(fullDirPath, relativePathAccumulator = '') {
//   const entries = [];
//   try {
//     const items = await fs.readdir(fullDirPath, { withFileTypes: true });
//     for (const item of items) {
//       const itemName = item.name;
//       const itemPublicPath = path.join(protectedSubDir, relativePathAccumulator, itemName).replace(/\\/g, '/');

//       if (item.isDirectory()) {
//         entries.push({ name: itemName, type: 'directory', publicPath: itemPublicPath });
//         // Jeśli chcesz rekursywnie, odkomentuj i dostosuj:
//         entries.push(...await listDirectoryRecursive(path.join(fullDirPath, itemName), path.join(relativePathAccumulator, itemName)));
//       } else if (item.isFile()) {
//         entries.push({ name: itemName, type: 'file', publicPath: itemPublicPath });
//       }
//     }
//   } catch (error) {
//     if (error.code === 'ENOENT') {
//       console.warn(`Katalog do wylistowania nie istnieje: ${fullDirPath}`);
//       return []; // Zwróć pustą tablicę, jeśli katalog nie istnieje
//     }
//     throw error; // Rzuć inne błędy dalej
//   }
//   return entries;
// }



async function generateManifest() {
  console.log(`Listowanie plików z: ${targetDirToList}`);
  const fileList = await listDirectoryRecursive(targetDirToList);
  
  // Upewnij się, że katalog server/data istnieje
  await fs.mkdir(path.dirname(manifestOutputPath), { recursive: true });
  
  await fs.writeFile(manifestOutputPath, JSON.stringify(fileList, null, 2));
  console.log(`Manifest plików zapisany w: ${manifestOutputPath}`);
}

console.log('Aktualny katalog skryptu (__dirname):', __dirname);
console.log('Rozwiązana ścieżka do publicDir:', publicDir);
console.log('Rozwiązana ścieżka do targetDirToList:', targetDirToList);
console.log('Rozwiązana ścieżka do manifestOutputPath:', manifestOutputPath);

generateManifest().catch(error => {
  console.error("Błąd podczas generowania manifestu plików:", error);
  process.exit(1);
});