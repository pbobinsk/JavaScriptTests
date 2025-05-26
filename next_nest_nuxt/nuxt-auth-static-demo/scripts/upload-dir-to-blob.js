
import { put } from '@vercel/blob';
import fs from 'fs-extra';         // fs-extra zazwyczaj eksportuje domyślny obiekt
import path from 'node:path';      // Wbudowany moduł Node.js
import mime from 'mime-types';     // mime-types również często ma domyślny eksport

// --- Konfiguracja ---
// Ścieżka do lokalnego katalogu, który chcesz przesłać
const LOCAL_SOURCE_DIRECTORY = './public/SoundArt'; // ZMIEŃ NA SWÓJ KATALOG ŹRÓDŁOWY

const BLOB_TARGET_PREFIX = 'MMSoundArt/'; // ZMIEŃ NA SWÓJ DOCELOWY PREFIX W BLOB

// Domyślny poziom dostępu dla przesyłanych plików
const DEFAULT_ACCESS_LEVEL = 'public'; // 'private' lub 'public'
// --------------------

const isSimulationMode = process.argv.includes('--simulation') || process.argv.includes('-s');

if (isSimulationMode) {
  console.log('\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  console.log('<<<< URUCHOMIONO W TRYBIE SYMULACJI >>>>');
  console.log('<<<< Żadne pliki nie zostaną przesłane. >>>>');
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n');
}


async function uploadDirectoryRecursive(localDirPath, currentRelativePath = '') {
  try {
    const items = await fs.readdir(localDirPath, { withFileTypes: true });

    for (const item of items) {
      const localItemPath = path.join(localDirPath, item.name);
      const relativeItemPath = path.join(currentRelativePath, item.name).replace(/\\/g, '/'); // Normalizuj

      if (item.isDirectory()) {
        if (isSimulationMode) {
          console.log(`[SYMULACJA] Wejście do podkatalogu: ${relativeItemPath}`);
        } else {
          console.log(`Wchodzenie do podkatalogu: ${relativeItemPath}`);
        }
        await uploadDirectoryRecursive(localItemPath, relativeItemPath); // Rekurencja dla podkatalogu
      } else if (item.isFile()) {
        const fileBuffer = await fs.readFile(localItemPath);
        const contentType = mime.lookup(localItemPath) || 'application/octet-stream';
        
        // Pełna ścieżka docelowa w Vercel Blob
        const blobPathname = (BLOB_TARGET_PREFIX + relativeItemPath).replace(/^\/+/, ''); // Usuń wiodące / jeśli są

       if (isSimulationMode) {
          console.log(`  [SYMULACJA] Przesłano by plik: ${localItemPath}`);
          console.log(`              -> Do Blob jako: ${blobPathname}`);
          console.log(`              -> Typ: ${contentType}, Dostęp: ${DEFAULT_ACCESS_LEVEL}`);
        } else {
          const fileBuffer = await fs.readFile(localItemPath);
          console.log(`  Przesyłanie pliku: ${localItemPath} -> Blob: ${blobPathname} (Typ: ${contentType}, Dostęp: ${DEFAULT_ACCESS_LEVEL})`);
          try {
            const blobResult = await put(blobPathname, fileBuffer, {
              access: DEFAULT_ACCESS_LEVEL,
              contentType: contentType,
              addRandomSuffix: false,
            });
            console.log(`    -> Sukces! URL: ${blobResult.url}`);
          } catch (uploadError) {
            console.error(`    -> BŁĄD podczas przesyłania ${blobPathname}:`, uploadError.message || uploadError);
          }
        }
      
      }
    }
  } catch (error) {
    console.error(`Błąd podczas przetwarzania katalogu ${localDirPath}:`, error.message || error);
  }
}

async function main() {
  console.log('Rozpoczynanie przesyłania katalogu do Vercel Blob...');

  const absoluteSourceDirectory = path.resolve(process.cwd(), LOCAL_SOURCE_DIRECTORY);

  if (!fs.existsSync(absoluteSourceDirectory)) {
    console.error(`BŁĄD: Katalog źródłowy nie istnieje: ${absoluteSourceDirectory}`);
    return;
  }
  if (! (await fs.stat(absoluteSourceDirectory)).isDirectory() ) {
    console.error(`BŁĄD: Podana ścieżka źródłowa nie jest katalogiem: ${absoluteSourceDirectory}`);
    return;
  }

  console.log(`Katalog źródłowy: ${absoluteSourceDirectory}`);
  console.log(`Docelowy prefix w Blob: "${BLOB_TARGET_PREFIX}"`);
  console.log(`Domyślny poziom dostępu: ${DEFAULT_ACCESS_LEVEL}`);
  console.log('--- Rozpoczynanie przesyłania ---');

 if (isSimulationMode) {
    console.log('--- Rozpoczynanie SYMULACJI przesyłania ---');
  } else {
    console.log('--- Rozpoczynanie FAKTYCZNEGO przesyłania ---');
  }

  await uploadDirectoryRecursive(absoluteSourceDirectory);

  if (isSimulationMode) {
    console.log('--- SYMULACJA przesyłania zakończona ---');
  } else {
    console.log('--- Przesyłanie zakończone ---');
  }
}

main().catch(error => {
  console.error("Wystąpił nieoczekiwany błąd w głównym wykonaniu skryptu:", error);
  process.exit(1);
});