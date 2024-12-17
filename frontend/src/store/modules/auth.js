// src/store/modules/auth.js

import api from '../../services/api';  // 确保 api.js 中正确设置了基础路径

const state = {
  token: localStorage.getItem('token') || '',  // 获取 token
  refresh_token: localStorage.getItem('refresh_token') || '',  // 获取 refresh_token
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
      const response = await api.post('register/', userData);  // 调用后端注册 API
      const { access, refresh } = response.data;
      localStorage.setItem('token', access);  // 将 token 存入 localStorage
      localStorage.setItem('refresh_token', refresh);  // 将 refresh_token 存入 localStorage
      commit('SET_TOKEN', access);  // 设置 state 中的 token
      commit('SET_REFRESH_TOKEN', refresh);  // 设置 state 中的 refresh_token
      await dispatch('fetchUser');  // 获取用户信息
      return response;
    } catch (error) {
      console.error(error);
      throw error;  // 失败时抛出错误
    }
  },
  async login({ commit, dispatch }, credentials) {
    try {
      const response = await api.post('token/', credentials);  // 调用后端登录 API
      const { access, refresh } = response.data;
      localStorage.setItem('token', access);  // 存储 token
      localStorage.setItem('refresh_token', refresh);  // 存储 refresh_token
      commit('SET_TOKEN', access);  // 更新 token
      commit('SET_REFRESH_TOKEN', refresh);  // 更新 refresh_token
      await dispatch('fetchUser');  // 获取用户信息
      return response;
    } catch (error) {
      console.error(error);
      throw error;  // 登录失败抛出错误
    }
  },
  logout({ commit }) {
    commit('CLEAR_AUTH');  // 清空 token 和用户信息
    localStorage.removeItem('token');  // 删除 localStorage 中的 token
    localStorage.removeItem('refresh_token');  // 删除 refresh_token
  },
  async fetchUser({ commit, state, dispatch }) {
    if (state.token) {
      try {
        const response = await api.get('user/');  // 调用获取用户信息 API
        commit('SET_USER', response.data);  // 存储用户信息到 state
      } catch (error) {
        console.error(error);
        dispatch('logout');  // 获取用户信息失败时清除认证信息
      }
    }
  },
};

const getters = {
  isAuthenticated: (state) => !!state.token,  // 判断用户是否已认证
  getUser: (state) => state.user,  // 获取用户信息
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
