import { createApp } from 'vue'
// import './style.css'
import './stylereact.css'
import App from './App.vue'

// Vuetify:
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'; // Upewnij się, że masz zaimportowaną bibliotekę ikon

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
    .use(vuetify)
    .mount('#app')
