<template>
  <div style="display: flex; flex-direction: row-reverse">
    <div style="display: flex; flex-direction: column">
      <AInput
        v-model="name"
        placeholder="имя"
      ></AInput>
      <AInput
        v-model="password"
        placeholder="пароль"
      ></AInput>
      <AButton
        :disabled="name.length < 3 || password.length < 6"
        type="submit"
        @click="handleSubmit"
      >Регистрация</AButton>
      <div>
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { User } from '@/server/server';
import { fetcher } from '@/utils/fetcher';
import { Component } from 'vue-property-decorator';
import { Button, Input } from 'ant-design-vue';
import Vue from 'vue';

@Component({
  components: {
    [Button.name]: Button,
    [Input.name]: Input,
  },
})
export default class Register extends Vue {
  private name = '';

  private password = '';

  private message = '';

  private async handleSubmit(): Promise<void> {
    this.message = '';
    const {
      user,
      token,
      auth,
      msg,
    } = await fetcher.post<{
      user: User;
      token: string;
      auth: boolean;
      msg: string;
    }>('http://localhost:4000/register', {
      body: {
        name: this.name,
        password: this.password,
      },
    });
    this.message = msg ?? '';
    if (!auth) {
      return;
    }
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('jwt', token);
    await this.$router.push('/');
    console.log('Logged in');
  }
}
</script>
