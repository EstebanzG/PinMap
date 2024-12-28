<script setup lang="ts">
defineProps<{}>()

const emits = defineEmits<{
  (e: 'handleActivateMovement', isChecked: boolean): void;
  (e: 'reset'): void;
  (e: 'print'): void;
  (e: 'close'): void;
}>();

const handleActivateMovement = (event: Event) => {
  event.stopPropagation();
  const isChecked = (event.target as HTMLInputElement).checked;
  emits('handleActivateMovement', isChecked);
};

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
    <div class="content">
      <span class="movement-control">
        <input id="handle-movement" type="checkbox" @change="handleActivateMovement"/>
        <label for="handle-movement" class="parkinsans-text">Disable movements</label>
      </span>
      <button class="action-btn" @click="$emit('print')">Print</button>
      <button class="action-btn" @click="$emit('reset')">Reset</button>
    </div>
  </div>
</template>

<style scoped>
.movement-control {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.action-btn {
  width: 100%;
  height: 40px;
  background: transparent;
  border: 1px solid white;
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.action-btn:hover {
  background: white;
  color: #111111;
}

input[type="checkbox"] {
  height: 20px;
  width: 20px;
  cursor: pointer;
}
</style>