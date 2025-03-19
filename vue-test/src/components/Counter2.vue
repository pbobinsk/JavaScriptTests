<template>
  <div>
    <h2>Licznik: {{ count }}</h2>
    <button @click="increment">Zwiększ</button>
    <button @click="decrement">Zmniejsz</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    };
  },
  methods: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    }
  }
};
</script>

<style scoped>
button {
  margin: 5px;
}
</style>
