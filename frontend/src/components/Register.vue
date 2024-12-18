<!-- src/components/Register.vue -->

<template>
  <div class="register">
    <h2>注册</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="username">用户名:</label>
        <input
          v-model="username"
          type="text"
          id="username"
          required
          @blur="checkUsernameAvailability"
        />
        <span v-if="usernameError" class="error">{{ usernameError }}</span>
      </div>

      <div>
        <label for="email">邮箱:</label>
        <input
          v-model="email"
          type="email"
          id="email"
          required
          @blur="checkEmailAvailability"
        />
        <span v-if="emailError" class="error">{{ emailError }}</span>
      </div>

      <div>
        <label for="password">密码:</label>
        <input
          v-model="password"
          type="password"
          id="password"
          required
          @blur="validatePassword"
        />
        <span v-if="passwordError" class="error">{{ passwordError }}</span>
      </div>

      <div>
        <label for="password2">确认密码:</label>
        <input
          v-model="password2"
          type="password"
          id="password2"
          required
          @blur="validateConfirmPassword"
        />
        <span v-if="password2Error" class="error">{{ password2Error }}</span>
      </div>

      <button type="submit" :disabled="isSubmitting">注册</button>
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
  name: "RegisterPage",
  setup() {
    const store = useStore();
    const router = useRouter();

    const username = ref("");
    const email = ref("");
    const password = ref("");
    const password2 = ref("");

    const usernameError = ref("");
    const emailError = ref("");
    const passwordError = ref("");
    const password2Error = ref("");
    const isSubmitting = ref(false);

    // 检查用户名是否可用
    const checkUsernameAvailability = async () => {
      usernameError.value = "";
      if (!username.value) {
        usernameError.value = "用户名不能为空";
        return;
      }

      try {
        const response = await store.dispatch("auth/checkUsername", username.value);
        if (!response.available) {
          usernameError.value = "用户名已被占用";
        } else {
          usernameError.value = "";
        }
      } catch (error) {
        console.error(error);
        usernameError.value = "检查用户名时出错";
      }
    };

    // 检查邮箱是否可用
    const checkEmailAvailability = async () => {
      emailError.value = "";
      if (!email.value) {
        emailError.value = "邮箱不能为空";
        return;
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email.value)) {
        emailError.value = "请输入有效的邮箱地址";
        return;
      }

      try {
        const response = await store.dispatch("auth/checkEmail", email.value);
        if (!response.available) {
          emailError.value = "邮箱已被使用";
        } else {
          emailError.value = "";
        }
      } catch (error) {
        console.error(error);
        emailError.value = "检查邮箱时出错";
      }
    };

    // 验证密码长度
    const validatePassword = () => {
      passwordError.value = "";
      if (password.value.length < 8) {
        passwordError.value = "密码长度必须大于等于8";
      }
    };

    // 验证确认密码是否一致
    const validateConfirmPassword = () => {
      password2Error.value = "";
      if (password.value !== password2.value) {
        password2Error.value = "两次密码不一致";
      }
    };

    // 提交注册表单
    const handleRegister = async () => {
      // 先进行所有验证
      await checkUsernameAvailability();
      await checkEmailAvailability();
      validatePassword();
      validateConfirmPassword();

      // 检查是否有任何错误
      if (usernameError.value || emailError.value || passwordError.value || password2Error.value) {
        return;
      }

      isSubmitting.value = true;
      try {
        await store.dispatch("auth/register", {
          username: username.value,
          email: email.value,
          password: password.value,
          password2: password2.value,
        });
        router.push("/dashboard"); // 注册成功后重定向到仪表盘
      } catch (error) {
        console.error(error);
        if (error.username) {
          usernameError.value = error.username[0];
        }
        if (error.email) {
          emailError.value = error.email[0];
        }
        if (error.password) {
          passwordError.value = error.password[0];
        }
        alert("注册失败，请检查输入信息。");
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      username,
      email,
      password,
      password2,
      usernameError,
      emailError,
      passwordError,
      password2Error,
      checkUsernameAvailability,
      checkEmailAvailability,
      validatePassword,
      validateConfirmPassword,
      handleRegister,
      isSubmitting,
    };
  },
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 12px;
}
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
.register input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.register button {
  padding: 10px 15px;
}
</style>
