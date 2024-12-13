import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';

const app = createApp(App);

// 设置 Axios 基础 URL
axios.defaults.baseURL = 'http://localhost:8000';

// 添加请求拦截器，添加认证头
axios.interceptors.request.use(
  (config) => {
    const token = store.state.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 全局注册 Axios，便于在组件中通过 this.$axios 访问
app.config.globalProperties.$axios = axios;

app.use(store);
app.use(router);
app.mount('#app');
