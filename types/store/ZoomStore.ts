import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useZoomStore = defineStore('zoomStore', () => {
  const zoomLevel = ref<number>(1);

  return {
    zoomLevel,
  }
});