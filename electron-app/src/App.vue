

<template>
  <div class="container">
    <h1>Electron + Vite Plugin</h1>
    <nav>
      <router-link to="/">Home</router-link>
      <span>|</span>
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f6f8;
}

.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

nav {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

nav a {
  text-decoration: none;
  color: #007acc;
  font-weight: bold;
}

nav a.router-link-exact-active {
  color: #005799;
  border-bottom: 2px solid #005799;
}
</style>
