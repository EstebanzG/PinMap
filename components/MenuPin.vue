<script setup lang="ts">
import { defineExpose } from "vue";
import constantColor from "~/utils/constant-color";
import type {Pin} from "~/components/ImageEdit.vue";

const props = defineProps<{
  pin ?: Pin | null;
}>()

const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'delete', pin: Pin): void;
  (e: 'update', pin: Pin): void;
}>();

const name = ref<string | null>(props.pin?.name ?? null);
const color = ref<string>(props.pin?.color ?? constantColor.RED);
const size = ref<number>(props.pin ? props.pin.size : 40);
const form = useTemplateRef('form');

const deleteEvent = (pin?: Pin | null) => {
  if (pin !== null && pin !== undefined) {
    emits('delete', pin)
  }
}

const updateEvent = (pin?: Pin | null) => {
  if (pin !== null && pin !== undefined) {
    emits('update', pin)
  }
}

defineExpose({
  name,
  color,
  size,
  form
})
</script>

<template>
  <div class="open open-placement">
    <div class="icon icon-placement cursor-pointer" @click="() => $emit('close')">
      <Icon
          name="heroicons:x-mark-20-solid"
          :style="{
            height: '30px',
            width: '30px'
          }"
      />
    </div>
    <form class="content" ref="form">
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
        <button v-if="pin !== null" class="action-btn" type="button" @click="() => updateEvent(pin)">Save</button>
        <button v-if="pin !== null" class="action-btn" type="button" @click="() => deleteEvent(pin)">Delete</button>
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