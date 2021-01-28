import Register from '@/views/Register.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
Vue.use(VueRouter);
const routes = [
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
        meta: {
            guest: true,
        },
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            guest: true,
        },
    },
];
const router = new VueRouter({
    mode: 'history',
    routes,
});
router.beforeEach((to, from, next) => {
    if (to.matched.some(({ meta }) => meta.requiresAuth)) {
        if (localStorage.getItem('jwt') == null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath },
            });
        }
        else {
            next();
        }
    }
    // } else if (to.matched.some(({ meta }) => meta.guest)) {
    //   if (localStorage.getItem('jwt') == null) {
    //     next();
    //   } else {
    //     next({ name: 'userboard' });
    //   }
    // } else {
    //   next();
    // }
});
export default router;
