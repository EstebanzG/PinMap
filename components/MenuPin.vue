<script setup lang="ts">

import {v4 as uuidv4} from 'uuid';
import {type PanzoomObject} from "@panzoom/panzoom";
import type {Coordinate} from "~/components/MenuPinMovement.vue";

const DEFAULT_PIN_SIZE = 40;
const DEFAULT_PIN_COLOR = '#ff0000';

const props = defineProps<{
  pin: Pin | null;
  targetCoordinate: Coordinate;
  panzoomInstance: PanzoomObject | null,
  zoomScale: number;
}>()

defineEmits<{
  (e: 'calculateTargetCoordinate'): Coordinate;
  (e: 'close'): void;
}>();


const pinStore = usePinStore();

const name = ref<string>('');
const size = ref<number>(DEFAULT_PIN_SIZE);
const color = ref<string>(DEFAULT_PIN_COLOR);

const createOrUpdatePin = () => {
  if (props.pin === null) {
    createPin()
  } else {
    updatePin()
  }
}

const createPin = () => {
  pinStore.addPin({
    id: uuidv4(),
    name: name.value,
    color: color.value,
    size: size.value,
    positionX: props.targetCoordinate.x,
    positionY: props.targetCoordinate.y,
  }, props.zoomScale)
}

const updatePin = () => {
  if (props.pin === null) {
    return;
  }
  pinStore.updatePin({
    ...props.pin,
    name: name.value,
    size: size.value,
    color: color.value,
  }, props.zoomScale)
}

watch(() => props.pin, (pin: Pin | null) => {
  if (pin !== null) {
    name.value = pin.name ?? "";
    size.value = pin.size;
    color.value = pin.color ?? DEFAULT_PIN_COLOR;
  } else {
    name.value = '';
    size.value = DEFAULT_PIN_SIZE;
    color.value = DEFAULT_PIN_COLOR;
  }
})
</script>

<template>
  <div class="open" ref="menu">
    <form class="content" ref="form" @submit.prevent="createOrUpdatePin">
      <div class="form-group">
        <label for="name" class="parkinsans-text">Pin name*</label>
        <input id="name" type="text" name="pin name" v-model="name" placeholder="Chicago" autocomplete="off" required/>
      </div>
      <span class="form-group">
        <label for="size" class="parkinsans-text">Size</label>
        <input id="size" type="number" min="20" max="80" name="color" v-model="size"/>
      </span>
      <div class="form-group">
        <label for="color" class="parkinsans-text">Color</label>
        <input id="color" type="color" name="color" v-model="color"/>
      </div>
      <div class="button-action">
        <button class="action-btn" type="submit">{{ pin === null ? 'Create' : 'Update' }}</button>
      </div>
    </form>
  </div>
  <div class="target-selector"></div>
</template>

<style scoped>
.open {
  padding: 20px;
  min-height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-color: rgba(17, 17, 17);
  border: solid 1px white;
}

.form-group {
  display: flex;
  flex-direction: column;
  color: white;
  gap: 5px;
}

.target-selector {
  position: absolute;
  top: 50%;
  right: -10px;
  transform: rotate(45deg);
  width: 20px;
  height: 20px;
  background-color: rgba(17, 17, 17);
  border-top: solid 1px white;
  border-right: solid 1px white;
}

input[type="color"] {
  height: 40px;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  border: 1px solid white;
  outline: none;
  padding: 0;
  border-radius: 20px;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 20px;
}

input[type="text"] {
  height: 40px;
  width: 200px;
  outline: none;
  padding: 0 20px;
  background: transparent;
  border: 1px solid white;
  border-radius: 20px;
  color: white;
  transition: all 0.2s ease-in-out;
}

input[type="text"]:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 1px white;
}

input[type="number"] {
  height: 40px;
  width: 200px;
  outline: none;
  padding: 0 20px;
  background: transparent;
  border: 1px solid white;
  border-radius: 20px;
  color: white;
  transition: all 0.2s ease-in-out;
}

input[type="number"]:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 1px white;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>