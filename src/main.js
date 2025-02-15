import './assets/main.css'
import 'primeicons/primeicons.css'
import Aura from '@primevue/themes/aura';

import { createApp } from 'vue'
import App from './layouts/Index.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import mixin from './mixin';
import store from './store';
import VueApexCharts from 'vue3-apexcharts';

const app = createApp(App)

app.use(router)
app.use(store)
app.use(VueApexCharts)
app.mixin(mixin)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'none',
  }
  }
});

app.mount('#app')
