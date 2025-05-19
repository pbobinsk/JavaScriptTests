// Definicja typu Item (można też umieścić w osobnym pliku np. server/types/Item.ts)
interface Item {
  id: number;
  name: string;
  description: string;
}

const itemsData: Item[] = [
  { id: 1, name: 'Produkt Vue X', description: 'Niesamowity produkt ekosystemu Vue' },
  { id: 2, name: 'Usługa Nuxt Y', description: 'Kompleksowa usługa oparta na Nuxt' },
  { id: 3, name: 'Komponent Z', description: 'Uniwersalny komponent UI' },
];

export default defineEventHandler(async (event) => {
  // Symulacja opóźnienia API
  // await new Promise(resolve => setTimeout(resolve, 500));

  // W przyszłości można by tu sprawdzać metodę HTTP (event.node.req.method)
  // if (event.node.req.method === 'GET') { ... }
  return itemsData;
});