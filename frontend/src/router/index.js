// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import RegisterPage from '../components/Register.vue'; // 使用 RegisterPage 名称
import Dashboard from '../components/Dashboard.vue';
import ProjectList from '../components/ProjectList.vue';
import TaskList from '../components/TaskList.vue';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard', // 将 '/' 重定向到 '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },  // 仪表盘需要认证
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },  // 登录页面不需要认证
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
    meta: { requiresAuth: false },  // 注册页面不需要认证
  },
  {
    path: '/projects',
    name: 'ProjectList',
    component: ProjectList,
    meta: { requiresAuth: true },  // 项目列表需要认证
  },
  {
    path: '/tasks',
    name: 'TaskList',
    component: TaskList,
    meta: { requiresAuth: true },  // 任务列表需要认证
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 路由守卫，检查是否需要认证
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  console.log(`访问路由: ${to.path}, 需要认证: ${requiresAuth}, 已认证: ${isAuthenticated}`);

  // 如果目标路由需要认证，但用户未认证，则跳转到登录页面
  if (requiresAuth && !isAuthenticated) {
    console.log('未认证，重定向到登录页');
    next('/login');
  } else {
    next();
  }
});

export default router;
