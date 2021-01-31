<template>
  <div class="home">
    <img alt="radio-technika.ru" :src="logo">
    <CanvasArea msg="Welcome to Your Vue.js Ap"/>
  </div>
</template>

<script>
// @ is an alias to /src
import CanvasArea from '@/components/CanvasArea.vue';

export default {
  name: 'Home',
  components: {
    CanvasArea,
  },
  data() {
    return {
      logo: require('@/assets/logo.svg'),
    };
  },
};
</script>
