<template>
  <div style="display: flex; flex-direction: column">
    <div style="display: flex; justify-content: space-between; align-items: center">
      <div style="display: flex; flex-direction: column; margin-left: 1rem">
        <AInput
          v-model="name"
          placeholder="имя"
          style="margin-bottom: .5rem"
        ></AInput>
        <AInputPassword
          v-model="password"
          placeholder="пароль"
          style="margin-bottom: .5rem"
        ></AInputPassword>
        <AButton
          type="submit"
          @click="handleSubmit"
        >Войти</AButton>
        <div>
          {{ store.state.message }}
        </div>
      </div>
      <div style="display: flex; flex-direction: row-reverse">
        <img alt="radio-technika.ru" :src="logo" style="height: 8rem">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { store } from '@/store';
import { Component } from 'vue-property-decorator';
import { Button, Input } from 'ant-design-vue';
import Vue from 'vue';

@Component({
  components: {
    [Button.name]: Button,
    [Input.name]: Input,
    [Input.Password.name]: Input.Password,
  },
  data() {
    return {
      store,
      logo: require('@/assets/logo.png'),
    };
  },
})
export default class Login extends Vue {
  private name = '';

  private password = '';

  private async handleSubmit(): Promise<void> {
    await store.dispatch('login', {
      name: this.name,
      password: this.password,
    });
    if (store.state.isLoggedIn) {
      await this.$router.push('/');
    }
  }
}
</script>
