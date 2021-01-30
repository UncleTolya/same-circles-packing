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
    };
  },
})
export default class Register extends Vue {
  private name = '';

  private password = '';

  private async handleSubmit(): Promise<void> {
    await store.dispatch('register', {
      name: this.name,
      password: this.password,
    });
  }
}
</script>
