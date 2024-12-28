<script setup lang="ts">
defineProps<{
  isNavigationDisabled: boolean
}>()

defineEmits<{
  (e: 'handleActivateMovement'): void;
  (e: 'reset'): void;
  (e: 'print'): void;
  (e: 'close'): void;
}>();
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
        <input id="handle-movement" :checked="isNavigationDisabled" type="checkbox" @change="$emit('handleActivateMovement')"/>
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

input[type="checkbox"] {
  height: 20px;
  width: 20px;
  cursor: pointer;
}
</style>