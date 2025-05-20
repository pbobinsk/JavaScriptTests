'use client';

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
      <h2>Prosty Licznik</h2>
      <p>Aktualna wartość: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ padding: '8px 15px', marginRight: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Zwiększ
      </button>
      <button 
        onClick={() => setCount(count - 1)}
        style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Zmniejsz
      </button>
    </div>
  );
}

export default function AboutPage() {
  // Ustawienie tytułu strony dla komponentu klienckiego
  // Można to też zrobić w komponencie Layout, jeśli tytuł jest statyczny
  if (typeof window !== 'undefined') { // Upewnij się, że kod działa tylko w przeglądarce
      document.title = 'O Nas | Moja Apka Next.js';
  }


  return (
    <>
      <h1>O Nas</h1>
      <p>Jesteśmy firmą demonstracyjną pokazującą możliwości Next.js App Router.</p>
      <p>Naszym celem jest tworzenie świetnych aplikacji webowych, które są szybkie i przyjazne SEO.</p>
      
      <Counter /> {/* Dodajemy nasz komponent licznika */}
    </>
  );
}