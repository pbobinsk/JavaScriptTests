// app/api/greet/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // request: Request - obiekt standardowego Web API Request
  // Możesz odczytać parametry zapytania z request.url

  return NextResponse.json({ message: 'Greetings from Next.js API! (App Router)' });
}

// Możesz też zdefiniować inne metody HTTP, np. POST:
// export async function POST(request: Request) {
//   const body = await request.json();
//   return NextResponse.json({ received: body, message: 'Data received!' });
// }