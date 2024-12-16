<!-- src/components/Register.vue -->

<template>
  <div class="register">
    <h2>注册</h2>
    <form @submit.prevent="register">
      <div>
        <label>用户名</label>
        <input v-model="username" required />
      </div>
      <div>
        <label>邮箱</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>密码</label>
        <input type="password" v-model="password" required />
      </div>
      <div>
        <label>确认密码</label>
        <input type="password" v-model="password2" required />
      </div>
      <button type="submit">注册</button>
    </form>
    <p>
      已有账号？ <router-link to="/login">登录</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "RegisterPage", // 修改组件名称以符合 ESLint 规则
  setup() {
    const store = useStore();
    const router = useRouter();

    const username = ref("");
    const email = ref("");
    const password = ref("");
    const password2 = ref("");

    const register = async () => {
      if (password.value !== password2.value) {
        alert("密码不匹配。");
        return;
      }

      try {
        await store.dispatch("auth/register", {
          username: username.value,
          email: email.value,
          password: password.value,
          password2: password2.value,
        });
        router.push("/"); // 注册成功后重定向到仪表盘
      } catch (error) {
        console.error(error);
        alert("注册失败，请检查输入信息。");
      }
    };

    return {
      username,
      email,
      password,
      password2,
      register,
    };
  },
};
</script>

<style scoped>
/* 添加一些样式 */
.register {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.register form div {
  margin-bottom: 15px;
}
.register label {
  display: block;
  margin-bottom: 5px;
}
.register input,
.register textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.register button {
  padding: 10px 15px;
}
</style>
