
import React, { useState } from 'react'

export default function Contact() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section>
      <h2>Kontakt</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Imię:
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Wiadomość:
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
        </label>
        <button type="submit">Wyślij</button>
      </form>
      {submitted && <p>Dziękujemy za wiadomość, {name}!</p>}
    </section>
  )
}
