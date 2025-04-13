<template>
    <section>
      <h2>Kontakt</h2>
      <form @submit.prevent="submitForm">
        <label>
          Imię:
          <input v-model="name" type="text" required />
        </label>
        <label>
          Wiadomość:
          <textarea v-model="message" required></textarea>
        </label>
        <button type="submit">Wyślij</button>
      </form>
      <p v-if="submitted">Dziękujemy za wiadomość, {{ name }}!</p>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        message: '',
        submitted: false
      }
    },
    methods: {
      submitForm() {
        this.submitted = true
      }
    }
  }
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 400px;
  }
  
  input, textarea {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 1rem;
    width: 100%;
  }
  
  button {
    align-self: flex-start;
    padding: 8px 16px;
    background-color: #00c3ff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  button:hover {
    background-color: #00a5d3;
  }
  </style>
  