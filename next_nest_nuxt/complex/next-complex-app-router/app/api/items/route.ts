import { NextRequest, NextResponse } from 'next/server';

interface Item {
  id: number;
  name: string;
  description: string;
}

const items: Item[] = [
  { id: 1, name: 'Przedmiot A (App Router)', description: 'Bardzo fajny przedmiot A' },
  { id: 2, name: 'Przedmiot B (App Router)', description: 'Niezwykły przedmiot B' },
  { id: 3, name: 'Przedmiot C (App Router)', description: 'Tajemniczy przedmiot C' },
  { id: 4, name: 'Przedmiot D (App Router)', description: 'Dodatkowy przedmiot D' },
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get('sortBy');

  if (sortBy) {
    console.log(`Sortowanie według: ${sortBy}`);
    // Tutaj logika sortowania `items` na podstawie `sortBy`
  }
  // W przyszłości można tu dodać logikę, np. opóźnienie:
  // await new Promise(resolve => setTimeout(resolve, 500));
  return NextResponse.json(items);
}

// Można też dodać inne metody, np. POST
// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const newItem: Item = {
//       id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
//       name: body.name || 'Nowy Przedmiot',
//       description: body.description || 'Opis nowego przedmiotu',
//     };
//     items.push(newItem);
//     return NextResponse.json(newItem, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
//   }
// }