import React from 'react'

export default function About() {
  const team = ['Anna Kowalska', 'Jan Nowak', 'Piotr Zieliński']

  return (
    <section>
      <h2>O nas</h2>
      <p>Poznaj nasz zespół:</p>
      <ul>
        {team.map(person => (
          <li key={person}>{person}</li>
        ))}
      </ul>
    </section>
  )
}
