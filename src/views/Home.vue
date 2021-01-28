<template>
  <div class="home">
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
};
</script>
