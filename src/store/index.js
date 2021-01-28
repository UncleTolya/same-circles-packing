var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "vue", "vuex"], function (require, exports, vue_1, vuex_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    vue_1 = __importDefault(vue_1);
    vuex_1 = __importDefault(vuex_1);
    vue_1.default.use(vuex_1.default);
    exports.default = new vuex_1.default.Store({
        state: {},
        mutations: {},
        actions: {},
        modules: {},
    });
});
