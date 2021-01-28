<template>
  <div style="display: flex; flex-direction: row-reverse">
    <div style="display: flex; flex-direction: column">
      <AInput
        v-model="name"
        placehilder="имя"
      ></AInput>
      <AInput
        v-model="password"
        placehilder="пароль"
      ></AInput>
      <AButton
        type="submit"
        @click="handleSubmit"
      >Войти</AButton>
    </div>
  </div>
</template>

<script lang="ts">
import { User } from '@/server/passportConfig';
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
export default class Login extends Vue {
  private name: string = '';

  private password: string = '';

  private async handleSubmit(): Promise<void> {
    const user = await fetcher.post<User[]>('http://localhost:4000/login', {
      body: {
        name: this.name,
      },
    });
    console.log(user);
  }
}
</script>
