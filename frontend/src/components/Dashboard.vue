<!-- src/components/Dashboard.vue -->

<template>
  <div class="dashboard">
    <h2>欢迎, {{ user.username }}</h2>
    <p>管理你的项目和任务。</p>
    <div class="links">
      <router-link to="/projects">查看项目</router-link>
      <router-link to="/tasks">查看任务</router-link>
    </div>
    <button @click="logout">退出登录</button>
    <p>这是一个测试文本，确认组件是否被渲染。</p> <!-- 添加的测试文本 -->
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

    // 正确访问命名空间下的 getter
    const user = computed(() => store.getters['auth/getUser']);
    console.log('当前用户:', user.value); // 调试输出

    const logout = () => {
      store.dispatch('auth/logout');
      router.push('/login');
    };

    onMounted(() => {
      store.dispatch('auth/fetchUser');
      console.log('用户信息已请求'); // 调试输出
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
