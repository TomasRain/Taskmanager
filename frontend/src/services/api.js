// src/services/api.js

import axios from 'axios';
import store from '../store';
import router from '../router';

// 创建一个 Axios 实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api/', // 使用环境变量或默认值
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，在每个请求中添加 Authorization 头
api.interceptors.request.use(
  (config) => {
    const isAuthenticated = store.getters['auth/isAuthenticated'];
    const token = isAuthenticated ? store.state.auth.token : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器，处理 Token 过期
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 如果返回 401 且未重试过
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = store.state.auth.refresh_token;

      if (refreshToken) {
        try {
          const response = await axios.post('/api/token/refresh/', {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          store.commit('auth/SET_TOKEN', newAccessToken); // 更新 Vuex 状态
          localStorage.setItem('token', newAccessToken);   // 更新 localStorage

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest); // 重新发起请求
        } catch (err) {
          console.error('刷新 Token 失败:', err);
          store.dispatch('auth/logout'); // 刷新失败，退出登录
          router.push('/login');          // 跳转到登录页
          return Promise.reject(err);
        }
      } else {
        store.dispatch('auth/logout');  // 如果没有 refresh token，登出
        router.push('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
