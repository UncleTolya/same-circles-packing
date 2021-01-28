var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "vue", "./App.vue", "./store", "./router"], function (require, exports, vue_1, App_vue_1, store_1, router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    vue_1 = __importDefault(vue_1);
    App_vue_1 = __importDefault(App_vue_1);
    store_1 = __importDefault(store_1);
    router_1 = __importDefault(router_1);
    vue_1.default.config.productionTip = false;
    new vue_1.default({
        store: store_1.default,
        router: router_1.default,
        render: (h) => h(App_vue_1.default),
    }).$mount('#app');
});
