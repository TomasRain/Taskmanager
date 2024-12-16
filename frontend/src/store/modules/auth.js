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
      throw error;
    }
  },
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
      throw error;
    }
  },
  logout({ commit }) {
    commit('CLEAR_AUTH');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  },
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
