<template>
  <div class="home">
    <CanvasArea msg="Welcome to Your Vue.js App"/>
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
