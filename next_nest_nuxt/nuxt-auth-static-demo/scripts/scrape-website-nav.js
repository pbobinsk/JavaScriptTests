// scripts/scrape-simplified-manifest.js
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { URL } from 'node:url';
import fs from 'fs-extra';
import path from 'node:path';
import 'dotenv/config'; // Jeśli używasz .env

import { START_URL } from './config/scraper-config';

// --- Konfiguracja ---

const BASE_DOMAIN = new URL(START_URL).hostname;
const BASE_PATH = new URL(START_URL).pathname; // np. "/~mmedia/pub/"

const manifestOutputDir = path.resolve(process.cwd(), 'server', 'data');
const manifestOutputFileName = 'scraped-simplified-manifest.json';
const manifestOutputPath = path.join(manifestOutputDir, manifestOutputFileName);

const IGNORED_EXTENSIONS = ['.txt', '.zip', '.gz', '.tar', '.tgz', '.rar'];
const IGNORED_NAMES = ['parent directory', 'parent_directory', 'last modified', 'name', 'size', 'description'];
const INDEX_FILES = ['index.html', 'index.htm']; // Możliwe nazwy plików indeksu
// --------------------

/**
 * Docelowy interfejs (podobny do FileSystemEntry)
 * @typedef {object} ManifestEntry
 * @property {string} name - Tekst linku lub nazwa pliku/katalogu.
 * @property {'file' | 'directory' | 'asset' | 'external'} type - Typ wpisu.
 * @property {string} path - Ścieżka względna od BASE_PATH (np. "Acoustics/index.html").
 * @property {string} displayName - Tekst linku lub sformatowana nazwa.
 * @property {string} url - Pełny, absolutny URL do zasobu.
 * @property {ManifestEntry[]} [children] - Dzieci, jeśli to 'directory'.
 */

const visitedUrls = new Set();

function normalizeDisplayNameForManifest(text, urlObj) {
  let displayName = text.trim().replace(/[\n\r]+|\s{2,}/g, ' ');
  if (!displayName || IGNORED_NAMES.some(name => displayName.toLowerCase().includes(name.toLowerCase()))) {
    let segments = urlObj.pathname.split('/').filter(s => s);
    let lastSegment = segments.pop() || '';
    if (INDEX_FILES.some(indexFile => lastSegment.toLowerCase() === indexFile) && segments.length > 0) {
      displayName = segments.pop(); // Nazwa katalogu nadrzędnego
    } else if (lastSegment) {
      displayName = path.basename(lastSegment, path.extname(lastSegment)); // Nazwa pliku bez rozszerzenia
    } else { // Root lub dziwny URL
      displayName = urlObj.hostname;
    }
  }
  return displayName || urlObj.pathname; // Fallback
}

/**
 * Pobiera i parsuje stronę, zwracając listę dzieci (ManifestEntry).
 * @param {string} currentUrl - URL strony/katalogu do sparsowania.
 * @returns {Promise<ManifestEntry[]>}
 */
async function scrapeAndMapChildren(currentUrl) {
  if (visitedUrls.has(currentUrl)) {
    return [];
  }
  visitedUrls.add(currentUrl);

  console.log(`Scraping for children: ${currentUrl}`);
  /** @type {ManifestEntry[]} */
  const children = [];

  try {
    const response = await fetch(currentUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch ${currentUrl}. Status: ${response.status}`);
      return [];
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.toLowerCase().includes('text/html')) {
      console.log(`Skipping non-HTML content at ${currentUrl} for children scan.`);
      return [];
    }

    const htmlContent = await response.text();
    const $ = cheerio.load(htmlContent);
    const links = $('a[href]');

    for (let i = 0; i < links.length; i++) {
      const linkElement = $(links[i]);
      const originalHref = linkElement.attr('href');
      const linkText = linkElement.text();

      if (!originalHref || originalHref.startsWith('#') || originalHref.startsWith('javascript:') || originalHref.startsWith('mailto:') || originalHref.startsWith('tel:')) {
        continue;
      }
      if (IGNORED_NAMES.some(name => linkText.toLowerCase().includes(name.toLowerCase()))) {
        continue;
      }

      const absoluteUrl = new URL(originalHref, currentUrl).href;
      const urlObject = new URL(absoluteUrl);
      const displayName = normalizeDisplayNameForManifest(linkText, urlObject);

      if (!displayName) continue;

      /** @type {ManifestEntry} */
      const entry = {
        name: displayName, // Użyj displayName jako głównej nazwy
        displayName: displayName,
        url: absoluteUrl,
        type: 'external', // Domyślnie
        path: '',
      };

      if (urlObject.hostname === BASE_DOMAIN && urlObject.pathname.startsWith(BASE_PATH)) {
        entry.path = urlObject.pathname.substring(BASE_PATH.length);
        if (entry.path.startsWith('/')) entry.path = entry.path.substring(1);
        
        const isDirectoryUrl = absoluteUrl.endsWith('/');
        const filenameInPath = path.basename(urlObject.pathname);
        const isIndexFile = INDEX_FILES.some(indexFile => filenameInPath.toLowerCase() === indexFile);
        const extension = path.extname(urlObject.pathname).toLowerCase();

        if (isDirectoryUrl || isIndexFile) {
          entry.type = 'directory';
          // Dla uproszczenia, displayName dla katalogu to jego nazwa
          entry.name = displayName; // lub ostatni segment ścieżki przed index.html
          if (isIndexFile && entry.path.endsWith(filenameInPath)) {
             // Upewnij się, że `path` dla directory nie zawiera `index.html`
             // entry.path = path.dirname(entry.path); // To może być zbyt agresywne jeśli BASE_PATH jest '/'
             // Lepsze: jeśli path kończy się na index.html, usuń tę część dla typu directory
             if (INDEX_FILES.some(idxFile => entry.path.endsWith(`/${idxFile}`))) {
                 entry.path = entry.path.substring(0, entry.path.lastIndexOf('/'));
             } else if (INDEX_FILES.some(idxFile => entry.path === idxFile)) {
                 entry.path = ''; // Root index.html
             }
          }
          if (entry.path.endsWith('/')) entry.path = entry.path.slice(0, -1); // Usuń końcowy slash z path dla directory

          entry.children = await scrapeAndMapChildren(absoluteUrl); // Rekurencja
        } else if (extension === '.html' || extension === '.htm' || extension === '.pdf') {
          entry.type = 'file'; // Wcześniej 'page', teraz bardziej jak FileSystemEntry
          entry.name = filenameInPath; // Nazwa pliku z rozszerzeniem
        } else if (IGNORED_EXTENSIONS.includes(extension)) {
          console.log(`Ignorowanie (ignored ext): ${absoluteUrl}`);
          continue;
        } else {
          entry.type = 'asset';
          entry.name = filenameInPath; // Nazwa pliku z rozszerzeniem
        }
      } else {
        entry.type = 'external';
      }
      children.push(entry);
    }
  } catch (error) {
    console.error(`Błąd podczas przetwarzania ${currentUrl} na dzieci:`, error);
  }
  return children.sort((a,b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      if (a.type === 'directory') return -1;
      if (b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
  });
}


async function generateManifest() {
  console.log(`Rozpoczynanie scrapowania od: ${START_URL}`);
  visitedUrls.clear();

  // Zaczynamy od START_URL, który traktujemy jako główny "katalog"
  const children = await scrapeAndMapChildren(START_URL);

  const rootDirName = normalizeDisplayNameForManifest(new URL(START_URL).hostname + BASE_PATH, START_URL);
  const rootEntry = {
    name: rootDirName,
    displayName: rootDirName,
    type: 'directory',
    path: '', // Root ma pustą ścieżkę względną
    url: START_URL,
    children: children
  };
  
  await fs.ensureDir(manifestOutputDir);
  await fs.writeJson(manifestOutputPath, [rootEntry], { spaces: 2 });
  console.log(`\nUproszczony manifest nawigacji (scraped) zapisany w: ${manifestOutputPath}`);
  if (children.length === 0) {
    console.warn("Manifest dla roota jest pusty (brak linków na stronie startowej lub błędy).");
  }
}

generateManifest().catch(error => {
  console.error("Błąd krytyczny podczas generowania uproszczonego manifestu (scraped):", error);
  process.exit(1);
});