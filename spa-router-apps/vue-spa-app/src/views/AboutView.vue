<template>
    <section>
      <h2>O nas</h2>
      <p>Poznaj nasz zespół:</p>
      <ul>
        <li v-for="person in team" :key="person">{{ person }}</li>
      </ul>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        team: ['Anna Kowalska', 'Jan Nowak', 'Piotr Zieliński']
      }
    }
  }
  </script>
  
  <style scoped>
  ul {
    padding-left: 20px;
  }
  li {
    margin-bottom: 6px;
  }
  </style>
  