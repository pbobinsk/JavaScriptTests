// server/api/serve-protected/[..path].get.ts
import { defineEventHandler, getCookie, createError, sendStream, setResponseHeader } from 'h3';
import fs from 'node:fs';
import path from 'node:path';
import mime from 'mime-types'; // Pamiętaj o instalacji: npm install mime-types @types/mime-types

export default defineEventHandler(async (event) => {
  // 1. Sprawdź autoryzację (ta sama logika co w middleware, ale tutaj jest kluczowa)
  const userSessionCookie = getCookie(event, 'user-session');
  let isAuthenticated = false;

  if (userSessionCookie) {
    try {
      const parsedSession = JSON.parse(userSessionCookie);
      if (parsedSession && parsedSession.login) {
        isAuthenticated = true;
        console.log('[serve-protected] User AUTHENTICATED:', parsedSession.login);
      }
    } catch (e) {
      console.warn('[serve-protected] Invalid user session cookie');
    }
  }

  if (!isAuthenticated) {
    console.log('[serve-protected] Access DENIED - User not authenticated');
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'Brak autoryzacji do tego zasobu.' });
  }

  const filepathSegments = event.context.params?.filepath;
  
  if (!filepathSegments || (Array.isArray(filepathSegments) && filepathSegments.length === 0) || (typeof filepathSegments === 'string' && filepathSegments.trim() === '')) {
    // Rozszerzony warunek, aby obsłużyć pusty string, jeśli to nie jest tablica
    console.error('[serve-protected] Nie podano segmentów ścieżki lub są puste:', filepathSegments);
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Nie podano ścieżki do pliku.' });
  }

  // Teraz, na podstawie logów, zdecydujemy jak uzyskać requestedPath
  let requestedPath: string;
  if (Array.isArray(filepathSegments)) {
    requestedPath = filepathSegments.join('/');
  } else if (typeof filepathSegments === 'string') {
    requestedPath = filepathSegments; // Jeśli jakimś cudem to string, a nie tablica
  } else {
    console.error('[serve-protected] Niespodziewany typ dla filepathSegments:', typeof filepathSegments);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Błąd przetwarzania ścieżki.' });
  }
  
  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(requestedPath);
  } catch (e) {
    // Błąd dekodowania może wystąpić, jeśli URL jest źle sformatowany (np. niepoprawny % sekwencja)
    console.error('[serve-protected] Błąd podczas dekodowania ścieżki URL:', requestedPath, e);
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Nieprawidłowo zakodowana ścieżka pliku.' });
  }

  requestedPath = decodedPath;
  
  const baseDir = path.resolve(process.cwd(), 'public/protected-assets');
  // const baseDir = path.resolve(process.cwd(), 'server/protected-assets');
  const filePath = path.join(baseDir, requestedPath);

  if (!filePath.startsWith(baseDir + path.sep) && filePath !== baseDir) { // path.sep dla separatora systemowego
      console.error(`[serve-protected] Path Traversal Attempt: "${requestedPath}" resolved to "${filePath}" which is outside "${baseDir}"`);
      throw createError({ statusCode: 403, statusMessage: 'Forbidden', message: 'Niedozwolona ścieżka.' });
  }
  
  try {
    const stats = await fs.promises.stat(filePath);
    if (!stats.isFile()) {
        throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Zasób nie jest plikiem.' });
    }

    const fileStream = fs.createReadStream(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    setResponseHeader(event, 'Content-Type', mimeType);

    return sendStream(event, fileStream);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.warn(`[serve-protected] File not found: ${filePath}`);
      throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Plik nie istnieje.' });
    }
    console.error(`[serve-protected] Error serving file ${filePath}:`, error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});