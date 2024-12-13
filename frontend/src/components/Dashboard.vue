<template>
    <div class="dashboard">
      <h2>欢迎, {{ user.username }}</h2>
      <p>管理你的项目和任务。</p>
      <div class="links">
        <router-link to="/projects">查看项目</router-link>
        <router-link to="/tasks">查看任务</router-link>
      </div>
      <button @click="logout">退出登录</button>
    </div>
  </template>
  
  <script>
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Dashboard',
    setup() {
      const store = useStore();
      const router = useRouter();
  
      const user = computed(() => store.getters.getUser);
  
      const logout = () => {
        store.dispatch('logout');
        router.push('/login');
      };
  
      onMounted(() => {
        store.dispatch('fetchUser');
      });
  
      return {
        user,
        logout,
      };
    },
  };
  </script>
  
  <style scoped>
  .dashboard {
    text-align: center;
    padding: 50px;
  }
  .links {
    margin: 20px 0;
  }
  .links a {
    margin: 0 10px;
    text-decoration: none;
    color: #42b983;
  }
  .dashboard button {
    padding: 10px 15px;
  }
  </style>
  