var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "vue", "vue-router", "../views/Home.vue", "../views/Login.vue"], function (require, exports, vue_1, vue_router_1, Home_vue_1, Login_vue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    vue_1 = __importDefault(vue_1);
    vue_router_1 = __importDefault(vue_router_1);
    Home_vue_1 = __importDefault(Home_vue_1);
    Login_vue_1 = __importDefault(Login_vue_1);
    vue_1.default.use(vue_router_1.default);
    const routes = [
        {
            path: '/',
            name: 'Home',
            component: Home_vue_1.default,
        },
        {
            path: '/login',
            name: 'Login',
            component: Login_vue_1.default,
        },
    ];
    const router = new vue_router_1.default({
        mode: 'history',
        routes,
    });
    exports.default = router;
});
