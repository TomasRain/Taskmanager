<template>
    <div class="login">
      <h2>登录</h2>
      <form @submit.prevent="login">
        <div>
          <label>用户名</label>
          <input v-model="username" required />
        </div>
        <div>
          <label>密码</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">登录</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Login',
    setup() {
      const store = useStore();
      const router = useRouter();
  
      const username = ref('');
      const password = ref('');
  
      const login = async () => {
        try {
          await store.dispatch('login', {
            username: username.value,
            password: password.value,
          });
          router.push('/');
        } catch (error) {
          console.error(error);
          alert('登录失败，请检查用户名和密码。');
        }
      };
  
      return {
        username,
        password,
        login,
      };
    },
  };
  </script>
  
  <style scoped>
  /* 添加一些样式 */
  .login {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .login form div {
    margin-bottom: 15px;
  }
  .login label {
    display: block;
    margin-bottom: 5px;
  }
  .login input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  .login button {
    padding: 10px 15px;
  }
  </style>
  