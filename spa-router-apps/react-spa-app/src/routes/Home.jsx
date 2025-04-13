import React, { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <section>
      <h2>Strona główna</h2>
      <p>Witamy w naszej aplikacji stworzonej w React!</p>
      <button onClick={() => setCount(count + 1)}>
        Kliknięto: {count} razy
      </button>
    </section>
  )
}
