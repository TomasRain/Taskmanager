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
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
  },
  {
    path: '/projects',
    name: 'ProjectList',
    component: ProjectList,
    meta: { requiresAuth: true },
  },
  {
    path: '/tasks',
    name: 'TaskList',
    component: TaskList,
    meta: { requiresAuth: true },
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

  if (requiresAuth && !isAuthenticated) {
    console.log('未认证，重定向到登录页');
    next('/login');
  } else {
    next();
  }
});

export default router;
