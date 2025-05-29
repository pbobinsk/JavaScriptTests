// server/api/protected-files-list.get.ts
import { defineEventHandler, getCookie, createError } from 'h3';
import fs from 'node:fs/promises';
import path from 'node:path';

import  { list } from '@vercel/blob';

//import manifestData from '~/server/data/public-files-manifest.json';
//import manifestData from '~/server/data/blob-tree-manifest.json';

import manifestData from '~/server/data/scraped-simplified-manifest.json';

let useManifest = true;


interface BlobTreeEntry {
  name: string,
  displayName: string,
  type: 'file' | 'directory',
  path: string, 
  url?: string, 
  size?: number, 
  uploadedAt?: Date, 
  children?: BlobTreeEntry[] 
 
}

/**
 * Rekursywnie listuje zawartość Vercel Blob, budując strukturę drzewiastą.
 * @param {string} [currentPrefix=''] - Aktualny prefix (ścieżka "katalogu") w Blob do wylistowania.
 * @returns {Promise<BlobTreeEntry[]>}
 */
 async function listBlobTreeRecursive(currentPrefix = ''): Promise<BlobTreeEntry[]> {
  // console.log(`Listowanie Blob dla prefixu: "${currentPrefix || '(root Blob store)'}"`);
  
  const treeEntries: BlobTreeEntry[] = [];

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
          // console.log(`  Wchodzenie do folderu: ${folderPathname} (nazwa: ${folderName})`);
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


interface FileEntry {
  name: string;        // Nazwa pliku (np. "secret-page.html" lub "subfolder/another.html")
  type: 'file';        // Będziemy listować tylko pliki
  path: string;        // Względna ścieżka od baseDir, używana do budowania URL API
  displayName: string; // Nazwa do wyświetlenia, może zawierać ścieżkę dla zagnieżdżonych plików
}

// Zaktualizowany interfejs, aby mógł reprezentować katalogi z dziećmi
interface FileSystemEntry {
  name: string;
  type: 'file' | 'directory';
  path: string; // Względna ścieżka od baseDir, używana do budowania URL API dla plików
  displayName: string; // Nazwa do wyświetlenia
  url?: string;
  children?: FileSystemEntry[]; // Dla katalogów, lista dzieci
}

// Rekursywna funkcja pomocnicza do listowania plików HTML
async function listHtmlFilesRecursive(
  directoryPath: string,    // Aktualnie przeszukiwany katalog
  baseDirectory: string,    // Główny katalog, od którego budujemy ścieżki względne
  currentRelativePath: string = '' // Ścieżka względna od baseDirectory do directoryPath
): Promise<FileEntry[]> {
  const entries: FileEntry[] = [];
  const items = await fs.readdir(directoryPath, { withFileTypes: true });

  for (const item of items) {
    const itemName = item.name;
    // Pełna ścieżka systemowa do aktualnego elementu
    const itemFullPath = path.join(directoryPath, itemName);
    // Ścieżka względna od baseDirectory, używana do linków i displayName
    const itemRelativePath = path.join(currentRelativePath, itemName).replace(/\\/g, '/');

    if (item.isDirectory()) {
      // WAŻNE: Tutaj decydujemy, czy wchodzić do podkatalogów
      // Możemy dodać warunek, np. aby ignorować katalog 'images'
      if (itemName.toLowerCase() === 'images') { // Ignoruj katalog 'images'
        continue; // Przejdź do następnego elementu
      }
      // Można też dodać inne ignorowane katalogi:
      // const ignoredDirs = ['images', 'temp', '_internal'];
      // if (ignoredDirs.includes(itemName.toLowerCase())) {
      //   continue;
      // }

      // Rekursywnie listuj pliki w podkatalogu
      entries.push(...await listHtmlFilesRecursive(itemFullPath, baseDirectory, itemRelativePath));
    } else if (item.isFile()) {
      // Sprawdź, czy plik ma rozszerzenie .html
      if (path.extname(itemName).toLowerCase() === '.html') {
        entries.push({
          name: itemName, // Sama nazwa pliku
          type: 'file',
          path: itemRelativePath, // np. "secret-page.html" lub "subfolder/another.html"
          displayName: itemRelativePath // Dla zagnieżdżonych plików, displayName pokaże pełną ścieżkę
        });
      }
    }
  }
  return entries;
}


async function listDirectoryRecursive(
  directoryPath: string,
  baseDirectory: string,
  currentRelativePath: string = ''
): Promise<FileSystemEntry[]> {
  const entries: FileSystemEntry[] = [];
  let items;
  try {
    items = await fs.readdir(directoryPath, { withFileTypes: true });
  } catch (error: any) {
    // Jeśli nie można odczytać katalogu (np. brak uprawnień, nie istnieje), zwróć pustą tablicę lub obsłuż błąd
    console.warn(`[protected-files-list] Nie można odczytać katalogu: ${directoryPath}`, error.message);
    return [];
  }


  for (const item of items) {
    const itemName = item.name;
    const itemFullPath = path.join(directoryPath, itemName);
    const itemRelativePath = path.join(currentRelativePath, itemName).replace(/\\/g, '/');

    if (item.isDirectory()) {
      // Ignoruj katalog 'images' i jego zawartość
      if (itemName.toLowerCase() === 'images') {
        continue;
      }

      // Rekursywnie pobierz dzieci dla tego katalogu
      const children = await listDirectoryRecursive(itemFullPath, baseDirectory, itemRelativePath);
      
      // Dodaj katalog do listy tylko jeśli zawiera jakiekolwiek pliki HTML (bezpośrednio lub w podkatalogach)
      // lub jeśli chcemy zawsze pokazywać strukturę katalogów, nawet pustych (poza images)
      // Dla uproszczenia, na razie dodajemy katalog, a filtrowanie można dodać później, jeśli potrzebne.
      // Jeśli chcesz pokazywać tylko katalogi, które ostatecznie prowadzą do plików HTML,
      // musiałbyś sprawdzić, czy `children` zawiera jakiekolwiek pliki HTML.
      if (children.length > 0) { // Dodaj katalog, jeśli ma jakieś dzieci (pliki HTML lub inne podkatalogi z plikami HTML)
        entries.push({
          name: itemName,
          type: 'directory',
          path: itemRelativePath, // Ścieżka do katalogu
          displayName: itemName,  // Dla katalogów zwykle tylko nazwa
          children: children,
        });
      } else {
          // Opcjonalnie: można dodać pusty katalog, jeśli chcesz pokazać wszystkie (poza images)
          // entries.push({ name: itemName, type: 'directory', path: itemRelativePath, displayName: itemName, children: [] });
          console.log(`[protected-files-list] Pomijanie pustego (lub zawierającego tylko nie-HTML) katalogu: ${itemRelativePath}`);
      }

    } else if (item.isFile()) {
      if (path.extname(itemName).toLowerCase() === '.html') {
        entries.push({
          name: itemName,
          type: 'file',
          path: itemRelativePath,
          displayName: itemName, // Dla plików, nazwa to zazwyczaj wystarczający displayName
        });
      }
    }
  }
  // Sortuj wpisy: najpierw katalogi, potem pliki (alfabetycznie w ramach grup)
  return entries.sort((a, b) => {
    if (a.type === 'directory' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'directory') return 1;
    return a.name.localeCompare(b.name);
  });
}

interface UserSession { // Typ dla danych sesji
  id: string;
  login: string;
  roles: string[];
}


function findHtmlFilesInDirectory(

  entries : FileSystemEntry[],
  targetStartDirectoryName : string,
  isInsideTargetStartDirectory : boolean = false
) : FileSystemEntry[] {
  let htmlFiles : FileSystemEntry[] = [];
  if (!entries) return htmlFiles; // Zabezpieczenie przed undefined entries

  for (const entry of entries) {
    if (entry.type === 'directory') {
      if (entry.name.toLowerCase() === 'images') {
        continue;
      }
      if (isInsideTargetStartDirectory) {
        if (entry.children && entry.children.length > 0) {
          htmlFiles = htmlFiles.concat(
            findHtmlFilesInDirectory(entry.children, targetStartDirectoryName, true)
          );
        }
      } else if (entry.name === targetStartDirectoryName) {
        if (entry.children && entry.children.length > 0) {
          htmlFiles = htmlFiles.concat(
            findHtmlFilesInDirectory(entry.children, targetStartDirectoryName, true)
          );
        }
      } else if (entry.children && entry.children.length > 0) {
        // Ta gałąź może być usunięta, jeśli 'MM' jest zawsze na pierwszym poziomie
        htmlFiles = htmlFiles.concat(
            findHtmlFilesInDirectory(entry.children, targetStartDirectoryName, false)
        );
      }
    } else if (entry.type === 'file' && isInsideTargetStartDirectory) {
      // Użyj path.extname do sprawdzenia rozszerzenia
      if (path.extname(entry.name).toLowerCase() === '.html') {
        htmlFiles.push(entry);
      }
    }
  }
  return htmlFiles;
}

function findPdfFilesInDirectory(

  entries : FileSystemEntry[],
  targetStartDirectoryName : string,
  isInsideTargetStartDirectory : boolean = false
) : FileSystemEntry[] {
  let htmlFiles : FileSystemEntry[] = [];
  if (!entries) return htmlFiles; // Zabezpieczenie przed undefined entries

  for (const entry of entries) {
    if (entry.type === 'directory') {
      if (isInsideTargetStartDirectory) {
        if (entry.children && entry.children.length > 0) {
          htmlFiles = htmlFiles.concat(
            findPdfFilesInDirectory(entry.children, targetStartDirectoryName, true)
          );
        }
      } else if (entry.name === targetStartDirectoryName) {
        if (entry.children && entry.children.length > 0) {
          htmlFiles = htmlFiles.concat(
            findPdfFilesInDirectory(entry.children, targetStartDirectoryName, true)
          );
        }
      } else if (entry.children && entry.children.length > 0) {
        // Ta gałąź może być usunięta, jeśli 'MM' jest zawsze na pierwszym poziomie
        htmlFiles = htmlFiles.concat(
            findPdfFilesInDirectory(entry.children, targetStartDirectoryName, false)
        );
      }
    } else if (entry.type === 'file' && isInsideTargetStartDirectory) {
      // Użyj path.extname do sprawdzenia rozszerzenia
      if (path.extname(entry.name).toLowerCase() === '.pdf') {
        htmlFiles.push(entry);
      }
    }
  }
  return htmlFiles;
}


export default defineEventHandler(async (event) => {
  // 1. Sprawdź autoryzację (bez zmian)
  const userSessionCookie = getCookie(event, 'user-session');
  let currentUserSession: UserSession | null = null;
  
  if (!userSessionCookie) { // <--- SPRAWDZENIE CZY ISTNIEJE (NAJPROSTSZE)
    console.log('[protected-files-list] No session cookie, access denied.');
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'Brak sesji użytkownika.' });
  }

  try {
    const parsedSession = JSON.parse(userSessionCookie);
    if (!parsedSession || !parsedSession.login) throw new Error('Invalid session');
  } catch (e) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'Nieprawidłowa sesja.' });
  }

  try {
    currentUserSession = JSON.parse(userSessionCookie) as UserSession;
    if (!currentUserSession || !currentUserSession.login || !currentUserSession.roles) {
      throw new Error('Invalid session data');
    }
    console.log('[protected-files-list] User authenticated:', currentUserSession.login, 'with roles:', currentUserSession.roles);
  } catch (e) {
    console.error('[protected-files-list] Invalid session cookie:', e);
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'Nieprawidłowa sesja.' });
  }


  // 2. Listuj pliki HTML z katalogu server/protected-assets/
  //const baseDir = path.resolve(process.cwd(), 'public/protected-assets');

  if (!useManifest) {

  try {
    // const htmlFiles = await listHtmlFilesRecursive(baseDir, baseDir);
    // console.log('Z API');
    const htmlFiles = await listBlobTreeRecursive('');
    // console.log('Z API');
    // console.log(htmlFiles as FileSystemEntry[]);

    let filesToReturn: FileSystemEntry[];
    let filesToReturn2: FileSystemEntry[];
    let filesToReturn3: FileSystemEntry[];

    const isAdmin = currentUserSession.roles.includes('admin');
    const isUser = currentUserSession.roles.includes('user');

    if (isAdmin) {
      console.log('[public-files-list] Admin access: returning all.');
      return htmlFiles as FileSystemEntry[];
    } else if (isUser) {
      // Zwykły użytkownik też widzi pliki HTML z "MM" bez 'images'
      filesToReturn = findHtmlFilesInDirectory(htmlFiles, "MM");
      filesToReturn2 = findPdfFilesInDirectory(htmlFiles, "PDF");
      filesToReturn3 = findHtmlFilesInDirectory(htmlFiles, "MMSoundArt");

      console.log('[public-files-list] User access: returning HTML files from "MM" (no images).');
    } else {
      // Inne role lub brak ról - pusta lista
      filesToReturn = [];
      filesToReturn2 = [];
      filesToReturn3 = [];

      console.log('[public-files-list] No matching roles, returning empty list.');
    }
    
    // Możesz dodać sortowanie do `filesToReturn`, jeśli jest to płaska lista
    filesToReturn.sort((a,b) => a.name.localeCompare(b.name));

    const resultWrappedInDirectory: FileSystemEntry[] = [ 
      {
        name: 'Pliki HTML z MM Sound Technology',
        displayName: 'Pliki HTML z MM Sound Technology',
        type: 'directory',
        path: 'virtualPath',
        children: filesToReturn
      },
      {
        name: 'Pliki HTML z MM Sound Art',
        displayName: 'Pliki HTML z MM Sound Art',
        type: 'directory',
        path: 'virtualPath',
        children: filesToReturn3
      },
      {
        name: 'Pliki PDF z pandemii',
        displayName: 'Pliki PDF z pandemii',
        type: 'directory',
        path: 'virtualPath',
        children: filesToReturn2
      },

    ];

    return resultWrappedInDirectory;

  } catch (error) {
    console.error('[protected-files-list] Error listing HTML files:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error', message: 'Nie udało się wylistować plików HTML.' });
  }

  } else {
  try {
    // Opcja A: Bezpośrednie zwrócenie zaimportowanych danych (preferowane, jeśli działa)
    if (manifestData) {

      console.log('[public-files-list] Zwracanie danych z zaimportowanego manifestu JSON.');
      console.log(manifestData as FileSystemEntry[]);
      return manifestData as FileSystemEntry[]; // Rzutowanie typu dla pewności
    } else {
      // To nie powinno się zdarzyć, jeśli import się powiedzie
      throw new Error('Manifest data could not be imported.');
    }
    } catch (error: any) {
    console.error('[public-files-list] Błąd podczas odczytu lub parsowania manifestu plików:', error);
    // Zwróć bardziej szczegółowy błąd, jeśli to możliwe
    const errorMessage = error.code === 'ENOENT' 
        ? 'Plik manifestu nie został znaleziony. Upewnij się, że skrypt generujący został uruchomiony.'
        : 'Nie udało się załadować listy plików z manifestu.';
    throw createError({ 
        statusCode: 500, 
        statusMessage: 'Internal Server Error', 
        message: errorMessage,
        cause: error // Dodaj oryginalny błąd do przyczyny dla lepszego debugowania
    });
  }
}
});