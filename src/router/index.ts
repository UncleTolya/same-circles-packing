import Register from '@/views/Register.vue';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  const hasJWT = !!localStorage.getItem('jwt');
  const needAuth = to.meta.requiresAuth;
  console.log(hasJWT);
  console.log(needAuth);
  if (needAuth && !hasJWT) {
    next({ name: 'Login' });
  } else if (hasJWT && to.name !== 'Home') {
    next('/');
  } else {
    next();
  }
});

export default router;
