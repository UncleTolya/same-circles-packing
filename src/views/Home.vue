<template>
  <div style="display: flex; flex-direction: column">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="margin-left: 1rem; color: #0a63ae; font-size: 1.8rem">
        Конфигуратор формы батареи
      </div>
      <div style="display: flex; flex-direction: row-reverse">
        <img alt="radio-technika.ru" :src="logo" style="height: 8rem">
      </div>
    </div>
    <CanvasArea/>
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
      logo: require('@/assets/logo.png'),
    };
  },
};
</script>
