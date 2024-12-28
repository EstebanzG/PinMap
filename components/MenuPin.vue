<script setup lang="ts">
import { defineExpose } from "vue";

defineProps<{}>()

defineEmits<{
  (e: 'close'): void;
}>();

const isOpen = ref<boolean>(false);
const name = ref<string | null>(null);
const color = ref<string>('red');
const size = ref<number>(40);

defineExpose({
  isOpen,
  name,
  color,
  size,
})
</script>

<template>
  <div class="open">
    <div class="icon cursor-pointer" @click="() => $emit('close')">
      <Icon
          name="heroicons:x-mark-20-solid"
          :style="{
            height: '30px',
            width: '30px',
          }"
      />
    </div>
    <form class="content">
      <div class="form-group">
        <label for="name" class="parkinsans-text">Label name*</label>
        <input id="name" type="text" name="label name" v-model="name" placeholder="Chicago" required/>
      </div>
      <span class="form-group">
        <label for="size" class="parkinsans-text">Size</label>
        <input id="size" type="number" name="color" v-model="size"/>
      </span>
      <div class="form-group">
        <label for="color" class="parkinsans-text">Color</label>
        <input id="color" type="color" name="color" v-model="color"/>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  color: white;
  gap: 5px;
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