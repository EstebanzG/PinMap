<script setup lang="ts">

import {defineExpose} from "vue";

defineProps<{}>()

defineEmits<{
  (e: 'handleActivateMovement', isChecked: boolean): void;
  (e: 'reset'): void;
  (e: 'print'): void;
}>();

const isOpen = ref<boolean>(false);
const name = ref<string | null>(null);
const color = ref<string | null>(null);
const size = ref<string | null>(null);

const handleClick = () => {
  isOpen.value = !isOpen.value;
};

defineExpose({
  isOpen,
  name,
  color,
  size,
})
</script>

<template>
  <div class="actions">
    <div v-if="isOpen" class="open">
      <div class="cursor-pointer" @click="handleClick">
        <Icon name="heroicons:plus-circle"/>
      </div>
      <form>
        <span>
          <label for="name" class="parkinsans-text">Label name</label>
          <input id="name" type="text" name="label name" v-model="name"/>
        </span>
        <span>
          <label for="color">Color</label>
          <input id="color" type="color" name="color" v-model="color"/>
        </span>
        <span>
          <label for="color">Size</label>
          <input id="color" type="number" name="color" v-model="size"/>
        </span>
      </form>
    </div>
    <div v-else class="closed cursor-pointer" @click="handleClick">
      <Icon name="heroicons:plus-circle"/>
    </div>
  </div>
</template>

<style scoped>
.actions {
  position: absolute;
  bottom: 0;
  left: 50%;
}

.actions .closed {
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #111111;
  color: #afafaf;
  padding: 10px;
  border-radius: 30px 30px 0 0;
}

.actions .open {
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #111111;
  padding: 10px;
  gap: 10px;
  color: #afafaf;
  border-radius: 30px 30px 0 0;
}

</style>