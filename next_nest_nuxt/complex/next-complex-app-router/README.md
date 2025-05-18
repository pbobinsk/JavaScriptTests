This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


**Cel:**
*   Strona główna (`/`)
*   Podstrona "O nas" (`/about`)
*   Podstrona "Dane" (`/data`) pobierająca listę elementów z API (`/api/items`)
*   Prosta nawigacja (Navbar) zintegrowana z layoutem.
*   Proste, ale estetyczne style.

**Inicjalizacja Projektu (z App Routerem):**

```bash
npx create-next-app@latest next-complex-app-router --typescript --eslint --app --import-alias "@/*"
cd next-complex-app-router
```

*   **Ważne dotyczące `fetch` w Server Components:**
    *   Funkcja `getItems` jest wykonywana **na serwerze**.
    *   `fetch` w Next.js App Router jest rozszerzony i automatycznie deduplikuje żądania oraz oferuje opcje cachowania (np. `cache: 'no-store'` dla zachowania podobnego do `getServerSideProps`, lub `next: { revalidate: <sekundy> }` dla Incremental Static Regeneration).
    *   `process.env.NEXT_PUBLIC_APP_URL` musiałbyś zdefiniować w pliku `.env.local` (np. `NEXT_PUBLIC_APP_URL=http://localhost:3000`) dla lokalnego developmentu. W przypadku Vercel, `VERCEL_URL` jest automatycznie dostępny. Dla tego przykładu, `http://localhost:3000` zadziała lokalnie.


**Kluczowe koncepcje (App Router):**

*   **Routing oparty na katalogach:** `app/about/page.tsx` tworzy ścieżkę `/about`.
*   **`layout.tsx`:** Definiuje UI współdzielone między segmentami routingu. `app/layout.tsx` jest root layoutem.
*   **`page.tsx`:** Definiuje unikalne UI dla danego segmentu routingu.
*   **Server Components:** Domyślnie, komponenty w katalogu `app` (np. `page.tsx`, `layout.tsx`) są komponentami serwerowymi. Mogą być `async` i bezpośrednio pobierać dane.
*   **Route Handlers:** Pliki `route.ts` (lub `.js`) w katalogach `api` (lub innych) służą do tworzenia endpointów API. Eksportują funkcje nazwane metodami HTTP (np. `GET`, `POST`).
*   **Metadata API:** `export const metadata = {...}` w `layout.tsx` lub `page.tsx` do zarządzania `<head>`.
