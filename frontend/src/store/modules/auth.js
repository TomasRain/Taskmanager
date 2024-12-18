// src/store/modules/auth.js

import api from '../../services/api';

const state = {
  token: localStorage.getItem('token') || '',
  refresh_token: localStorage.getItem('refresh_token') || '',
  user: {},
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_REFRESH_TOKEN(state, refreshToken) {
    state.refresh_token = refreshToken;
  },
  SET_USER(state, user) {
    state.user = user;
  },
  CLEAR_AUTH(state) {
    state.token = '';
    state.refresh_token = '';
    state.user = {};
  },
};

const actions = {
  // 检查用户名是否可用
  async checkUsername({ commit }, username) {
    try {
      const response = await api.get(`check-username/${username}/`);
      return response.data; // { available: true/false }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 检查邮箱是否可用
  async checkEmail({ commit }, email) {
    try {
      const response = await api.get(`check-email/${encodeURIComponent(email)}/`);
      return response.data; // { available: true/false }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 注册用户
  async register({ commit, dispatch }, userData) {
    try {
      const response = await api.post('register/', userData);
      const { access, refresh } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);
      commit('SET_TOKEN', access);
      commit('SET_REFRESH_TOKEN', refresh);
      await dispatch('fetchUser');
      return response;
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        // 提取并返回具体的错误信息
        throw error.response.data;
      }
      throw error;
    }
  },

  // 登录用户
  async login({ commit, dispatch }, credentials) {
    try {
      const response = await api.post('token/', credentials);
      const { access, refresh } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);
      commit('SET_TOKEN', access);
      commit('SET_REFRESH_TOKEN', refresh);
      await dispatch('fetchUser');
      return response;
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        // 提取并返回具体的错误信息
        throw error.response.data;
      }
      throw error;
    }
  },

  // 登出用户
  logout({ commit }) {
    commit('CLEAR_AUTH');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  },

  // 获取用户信息
  async fetchUser({ commit, state, dispatch }) {
    if (state.token) {
      try {
        const response = await api.get('user/');
        commit('SET_USER', response.data);
      } catch (error) {
        console.error(error);
        // 如果获取用户信息失败，可能 Token 无效，触发登出
        dispatch('logout');
      }
    }
  },
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  getUser: (state) => state.user,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
