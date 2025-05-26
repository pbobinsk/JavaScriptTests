// server/api/serve-protected/[..path].get.ts
import { defineEventHandler, getCookie, createError, sendStream, setResponseHeader } from 'h3';
import fs from 'node:fs';
import path from 'node:path';
import mime from 'mime-types'; // Pamiętaj o instalacji: npm install mime-types @types/mime-types

import { head as vercelBlobHead } from '@vercel/blob';
import type { HeadBlobResult } from '@vercel/blob';

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

  console.info(`[serve-protected] !!! Path: "${requestedPath}" decoded  to "${decodedPath}`);
  requestedPath = decodedPath;
  let publicRequestedPath = '/protected-content/'+decodedPath;

  if (decodedPath.endsWith('favicon.ico')) {
    // Załóżmy, że masz globalną faviconę w public/favicon.ico
    const publicFaviconUrl = '/favicon.ico'; // Ścieżka publiczna
    console.log(`[view-blob] Przekierowanie żądania dla favicon.ico do: ${publicFaviconUrl}`);
    await sendRedirect(event, publicFaviconUrl, 302); // 302 Found - tymczasowe przekierowanie
    return; // Ważne: zakończ wykonanie handlera po wysłaniu przekierowania
  }


  const baseDir = path.resolve(process.cwd(), 'public/protected-content');
  // const baseDir = path.resolve(process.cwd(), 'server/protected-assets');
  const filePath = path.join(baseDir, requestedPath);


  console.info(`[serve-protected] !!! Path Traversal Attempt: "${requestedPath}" resolved to "${filePath}" which is outside "${baseDir}"`);

  if (!filePath.startsWith(baseDir + path.sep) && filePath !== baseDir) { // path.sep dla separatora systemowego
      console.error(`[serve-protected] Path Traversal Attempt: "${requestedPath}" resolved to "${filePath}" which is outside "${baseDir}"`);
      throw createError({ statusCode: 403, statusMessage: 'Forbidden', message: 'Niedozwolona ścieżka.' });
  }
  
  try {
    // const stats = await fs.promises.stat(filePath);
    // if (!stats.isFile()) {
    //     throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'Zasób nie jest plikiem.' });
    // }
/*
    !!!  zablokowane Vercel Blob !!!
    const blobMetaData: HeadBlobResult = await vercelBlobHead(requestedPath);
    
    if (!blobMetaData || !blobMetaData.url) {
        console.warn(`[view-blob] Could not retrieve metadata or URL for blob: ${requestedPath}`);
        throw createError({ statusCode: 404, message: 'Nie znaleziono metadanych dla pliku w Blob storage.' });
    }
    const signedBlobUrl = blobMetaData.url; // To jest podpisany, czasowy URL
    console.log(`[view-blob] Fetched signed URL for ${requestedPath}: ${signedBlobUrl}`);
  */  


    const host = getRequestHost(event, { xForwardedHost: true });
    const protocol = getRequestProtocol(event, { xForwardedProto: true });
    
    if (host && protocol) {
      console.log( ` UWAGA  ${protocol}://${host}`);
    }

    publicRequestedPath = `${protocol}://${host}${publicRequestedPath}`;

    console.log(`[view-blob] Fetched public URL for ${requestedPath}: ${publicRequestedPath}`);

//  !!!  zablokowane Vercel Blob !!!  const blobResponse = await fetch(signedBlobUrl);
    const blobResponse = await fetch(publicRequestedPath);

    console.log(`[view-blob reaponse] Fetched signed URL for ${requestedPath}: ${blobResponse.status}`);

    if (!blobResponse.ok) {
      console.error(`[view-blob] Failed to fetch blob content from signed URL. Status: ${blobResponse.status} ${blobResponse.statusText}`);
      throw createError({ statusCode: blobResponse.status, statusMessage: blobResponse.statusText, message: `Nie udało się pobrać zawartości pliku z Blob storage (status: ${blobResponse.status}).` });
    }

    if (!blobResponse.body) {
        console.warn(`[view-blob] Blob response body is null for: ${requestedPath}`);
        throw createError({ statusCode: 500, message: 'Otrzymano pustą odpowiedź z Blob storage.' });
    }

    const fileStream = blobResponse.body;//fs.createReadStream(filePath);
    const mimeType = mime.lookup(requestedPath) || 'application/octet-stream';

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