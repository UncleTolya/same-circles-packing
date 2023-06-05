<template>
  <div style="display: flex;">
    <div style="display: flex; flex-direction: column; align-items: center">
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
        <div style="margin-left: 1rem; color: #0a63ae; font-size: 1.8rem">
          Конфигуратор Li-Ion АКБ
        </div>
        <div style="display: flex; flex-direction: row-reverse">
          <img alt="uno-soft.ru" :src="logo" style="height: 8rem; padding: 1rem;">
        </div>
      </div>
      <CanvasArea/>
    </div>
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
    const uno = require('@/assets/uno.png');
    const radioteh = require('@/assets/radioteh.png');
    return {
      logo: window.location.port === '8080' ? uno : radioteh,
    };
  },
};
</script>
