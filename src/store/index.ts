import Vue from 'vue';
import Vuex from 'vuex';

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
  },
});
