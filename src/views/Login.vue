<template>
  <div style="display: flex; flex-direction: row-reverse">
    <div style="display: flex; flex-direction: column">
      <img alt="radio-technika.ru" :src="logo">
      <AInput
        v-model="name"
        placeholder="имя"
      ></AInput>
      <AInput
        v-model="password"
        placeholder="пароль"
      ></AInput>
      <AButton
        type="submit"
        @click="handleSubmit"
      >Войти</AButton>
      <div>
        {{ store.state.message }}
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
  },
  data() {
    return {
      store,
      logo: require('@/assets/logo.svg'),
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
