// src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import api from './services/api'; // 确保 API 实例已导入

const app = createApp(App);

app.use(store);
app.use(router);

// 在应用启动时获取用户信息
store.dispatch('auth/fetchUser');

app.mount('#app');
