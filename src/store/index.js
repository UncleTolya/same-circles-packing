var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetcher } from '@/utils/fetcher';
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
// eslint-disable-next-line import/prefer-default-export
export const store = new Vuex.Store({
    state: {
        message: '',
        isLoggedIn: false,
    },
    mutations: {
        setMessage: (state, message) => {
            state.message = message;
        },
        setLoggedIn: (state, isLoggedIn) => {
            state.isLoggedIn = isLoggedIn;
        },
    },
    actions: {
        login: ({ commit, state }, namePass) => __awaiter(void 0, void 0, void 0, function* () {
            const token = localStorage.getItem('jwt');
            if (token) {
                const isTokenValid = yield fetcher.post('/checkToken', {
                    body: {
                        token,
                    },
                });
                if (isTokenValid) {
                    commit('setLoggedIn', true);
                    return;
                }
                localStorage.clear();
            }
            if (!namePass) {
                return;
            }
            const { user, auth, msg, token: newToken, } = yield fetcher.post('/login', {
                body: {
                    name: namePass.name,
                    password: namePass.password,
                },
            });
            commit('setMessage', msg !== null && msg !== void 0 ? msg : '');
            if (!auth) {
                commit('setLoggedIn', false);
                return;
            }
            commit('setLoggedIn', true);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('jwt', newToken);
        }),
        register: ({ commit, state }, namePass) => __awaiter(void 0, void 0, void 0, function* () {
            if (!namePass) {
                return;
            }
            commit('setLoggedIn', false);
            localStorage.clear();
            const { msg } = yield fetcher.post('/register', {
                body: {
                    name: namePass.name,
                    password: namePass.password,
                },
            });
            commit('setMessage', msg !== null && msg !== void 0 ? msg : '');
        }),
    },
});
