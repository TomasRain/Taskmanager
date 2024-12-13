import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    token: localStorage.getItem('token') || '',
    user: {},
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    CLEAR_AUTH(state) {
      state.token = '';
      state.user = {};
    },
  },
  actions: {
    async register({ commit }, userData) {
      const response = await axios.post('http://localhost:8000/api/register/', userData);
      return response;
    },
    async login({ commit }, credentials) {
      const response = await axios.post('http://localhost:8000/api/token/', credentials);
      const token = response.data.access;
      localStorage.setItem('token', token);
      commit('SET_TOKEN', token);
      return response;
    },
    logout({ commit }) {
      commit('CLEAR_AUTH');
      localStorage.removeItem('token');
    },
    async fetchUser({ commit, state }) {
      if (state.token) {
        try {
          const response = await axios.get('http://localhost:8000/api/user/', {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });
          commit('SET_USER', response.data);
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },
});

export default store;
