<template>
  <div id="app">
    <header>
      <nav class="navbar">
        <div class="logo">🌐 Moja SPA</div>
        <button class="hamburger" @click="toggleMenu">
          ☰
        </button>
        <ul :class="['nav-links', { open: menuOpen }]">
          <li><router-link to="/" @click="closeMenu">Strona główna</router-link></li>
          <li><router-link to="/about" @click="closeMenu">O nas</router-link></li>
          <li><router-link to="/contact" @click="closeMenu">Kontakt</router-link></li>
        </ul>
      </nav>
    </header>

    <!-- animacja przejścia -->
    <main class="content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    },
    closeMenu() {
      this.menuOpen = false
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f8f9fa;
}

#app {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

/* NAVBAR */

.navbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e2f;
  padding: 12px 24px;
  border-radius: 8px;
  color: #fff;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.hamburger {
  background: none;
  border: none;
  font-size: 24px;
  color: #fff;
  display: none;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
  padding: 0;
  margin: 0;
}

.nav-links li {
  display: inline;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-links a:hover,
.router-link-active {
  color: #00c3ff;
}

/* MOBILE MENU */

@media (max-width: 600px) {
  .hamburger {
    display: block;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    display: none;
    margin-top: 10px;
  }

  .nav-links.open {
    display: flex;
  }
}

/* MAIN CONTENT */

.content {
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* FADE TRANSITION */

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
