import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {Pin} from "../Label";

export const useSelectedPinStore = defineStore('selectedPinStore', () => {
  const selectedPin = ref<Pin | null>(null);

  const setSelectedPin = (pin: Pin | null) => {
    selectedPin.value = pin;
  };

  return {
    selectedPin,
    setSelectedPin,
  };
});