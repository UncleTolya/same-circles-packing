import { fetcher } from '@/utils/fetcher';
import Vue from 'vue';
import Vuex from 'vuex';
import { User } from '../server/server';

Vue.use(Vuex);

interface StoreState {
  message: string;
  isLoggedIn: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export const store = new Vuex.Store<StoreState>({
  state: {
    message: '',
    isLoggedIn: false,
  },
  mutations: {
    setMessage: (state, message: string) => {
      state.message = message;
    },
    setLoggedIn: (state, isLoggedIn: boolean) => {
      state.isLoggedIn = isLoggedIn;
    },
  },
  actions: {
    login: async ({ commit, state }, namePass?) => {
      const token = localStorage.getItem('jwt');
      if (token) {
        const isTokenValid = await fetcher.post<boolean>('/checkToken', {
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
      const {
        user,
        auth,
        msg,
        token: newToken,
      } = await fetcher.post<{
        user: User;
        auth: boolean;
        msg: string;
        token: string;
      }>('/login', {
        body: {
          name: namePass.name,
          password: namePass.password,
        },
      });
      commit('setMessage', msg ?? '');
      if (!auth) {
        commit('setLoggedIn', false);
        return;
      }
      commit('setLoggedIn', true);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('jwt', newToken);
    },
    register: async ({ commit, state }, namePass) => {
      if (!namePass) {
        return;
      }
      commit('setLoggedIn', false);
      localStorage.clear();
      const { msg } = await fetcher.post<{ msg: string; auth }>(
        '/register',
        {
          body: {
            name: namePass.name,
            password: namePass.password,
          },
        },
      );
      commit('setMessage', msg ?? '');
    },
  },
});
