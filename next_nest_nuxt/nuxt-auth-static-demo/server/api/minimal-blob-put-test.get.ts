// server/api/minimal-blob-put-test.get.ts
import { defineEventHandler } from 'h3';
import { put } from '@vercel/blob';
import type { PutBlobResult } from '@vercel/blob';

export default defineEventHandler(async (event) => {
  // W prawdziwej aplikacji, nawet dla testów, warto by tu dodać jakąś formę
  // zabezpieczenia, aby endpoint nie był wywoływany przez każdego.
  // Na razie pomijamy dla maksymalnej prostoty.

  const testBlobPath = `minimal-test/direct-put-${Date.now()}.txt`;
  const testContent = `Hello from Nuxt API at ${new Date().toISOString()}!`;
  // Zmień poniżej na 'private' aby przetestować ten scenariusz
  const testAccessLevel: 'public' | 'private' = 'public'; // <--- ZMIEŃ TUTAJ NA 'private' DO TESTÓW

  console.log(`[minimal-blob-put-test] Attempting to put blob: ${testBlobPath} with access: ${testAccessLevel}`);

  try {
    const blob: PutBlobResult = await put(
      testBlobPath,
      testContent,
      {
        access: testAccessLevel,
        addRandomSuffix: false, // Dla testu, możemy chcieć przewidywalną ścieżkę
      }
    );

    const responseMessage = `Minimal test: File uploaded to "${blob.pathname}" with access "${testAccessLevel}".`;
    console.log(`[minimal-blob-put-test] Success: ${responseMessage}`);
    console.log(`[minimal-blob-put-test] Blob URL: ${blob.url}`);

    return {
      success: true,
      message: responseMessage,
      blobUrl: blob.url,
      blobPathname: blob.pathname,
    };

  } catch (error: any) {
    console.error('[minimal-blob-put-test] Error during Vercel Blob put operation:', error);
    
    // Przekaż szczegóły błędu dalej, aby były widoczne w odpowiedzi
    // i łatwiejsze do zdiagnozowania na Vercel
    // createError rzuca błąd, który zostanie obsłużony przez Nitro
    // i zwrócony jako odpowiedź HTTP z odpowiednim statusem
    throw createError({
        statusCode: error.status || 500, // Jeśli błąd z @vercel/blob ma status
        statusMessage: error.name === 'BlobError' ? 'VercelBlobError' : 'InternalServerError',
        message: `Vercel Blob put failed: ${error.message}`,
        data: { // Dodatkowe dane dla debugowania
            errorName: error.name,
            errorCode: error.code,
            // stack: error.stack, // Stack może być zbyt długi dla odpowiedzi JSON
        }
    });
  }
});