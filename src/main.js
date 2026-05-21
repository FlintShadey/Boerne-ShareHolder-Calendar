import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import VCalendar from 'v-calendar'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import 'v-calendar/style.css'
import App from './App.vue'
import { config } from '../config.js'

// Create Vuetify instance with dark theme
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: config.ui.theme,
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#FF9800',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#121212',
          surface: '#1E1E1E'
        }
      },
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#F57C00',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00'
        }
      }
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

const app = createApp(App)

// Use Vuetify
app.use(vuetify)

// Use V-Calendar
app.use(VCalendar, {})

// Mount app
app.mount('#app')
