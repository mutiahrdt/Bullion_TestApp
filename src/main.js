import { createApp } from 'vue'
import { createPinia } from 'pinia' // Jika Anda menginstal Pinia

import App from './App.vue'
import router from './router' // <-- PASTIKAN baris ini ada

const app = createApp(App)

app.use(createPinia()) // Jika Anda menginstal Pinia
app.use(router)       // <-- INI ADALAH BAGIAN KRUSIAL!

app.mount('#app')