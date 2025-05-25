

import { list, head as vercelBlobHead } from "@vercel/blob";

async function listMyBlobs() {
  console.log('Łączenie z Vercel Blob w celu wylistowania plików...');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BŁĄD: Zmienna środowiskowa BLOB_READ_WRITE_TOKEN nie jest ustawiona.');
    console.error('Upewnij się, że masz plik .env z poprawnym tokenem i że dotenv go wczytuje.');
    return;
  }

  try {
    // Możesz dodać opcje, jeśli chcesz filtrować lub paginować
    const options = {
      prefix: 'articles/', // Przykład: listuj tylko pliki z konkretnego "katalogu"
      // limit: 5, // Przykład: ogranicz do 5 wyników
      //mode: 'folded', // 'expanded' (domyślnie) lub 'folded' (grupuje jak katalogi)
    };

    console.log('Opcje listowania:', options);

    const { blobs, cursor, hasMore } = await list(options);

    if (blobs.length === 0) {
      console.log('\nNie znaleziono żadnych plików w Vercel Blob (lub pasujących do opcji).');
    } else {
      console.log(`\nZnaleziono ${blobs.length} plików/obiektów:`);
      blobs.forEach((blob, index) => {
        console.log(`\n--- Plik ${index + 1} ---`);
        console.log(`  Pathname:     ${blob.pathname}`);
        console.log(`  URL:          ${blob.url}`); // Pamiętaj, że dla prywatnych blobów ten URL jest czasowy
        console.log(`  Rozmiar:      ${blob.size} bajtów`);
        console.log(`  Przesłano:    ${new Date(blob.uploadedAt).toLocaleString()}`);
        if (blob.contentType) {
          console.log(`  Typ zawartości: ${blob.contentType}`);
        }
        if (blob.contentDisposition) {
          console.log(`  Content Disp: ${blob.contentDisposition}`);
        }
      });

      if (hasMore && cursor) {
        console.log(`\nJest więcej plików. Następny kursor (dla paginacji): ${cursor}`);
      } else {
        console.log('\nTo wszystkie znalezione pliki.');
      }
    }
  } catch (error) {
    console.error('\nWystąpił błąd podczas listowania plików z Vercel Blob:');
    if (error.name === 'BlobError') { // Błędy specyficzne dla @vercel/blob
      console.error(`  Typ błędu Blob: ${error.constructor.name}`);
      console.error(`  Wiadomość:    ${error.message}`);
      if (error.code) console.error(`  Kod:          ${error.code}`);
    } else {
      // Inne błędy
      console.error(error);
    }
  }
}

// Wywołaj funkcję
listMyBlobs();

console.log( await vercelBlobHead('MM/Signal acquisition and filtering/images/bessel.png')); 