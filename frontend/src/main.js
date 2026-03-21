import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/scss/main.scss';

const app = createApp(App);
app.use(router);
app.mount('#app');

console.log('🚀 Frontend iniciado');
console.log('🌐 API URL:', process.env.VUE_APP_API_URL || 'http://localhost:3000/api');