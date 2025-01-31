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
  <div class="open open-placement">
    <div class="icon icon-placement cursor-pointer" @click="() => $emit('close')">
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
      <div class="button-action">
        <button class="action-btn" @click="$emit('print')">Print</button>
        <button class="action-btn" @click="$emit('reset')">Reset</button>
      </div>
      <div class="parkinsans-text shortcuts">
        <h3>Shortcuts</h3>
        <ul>
          <li>CTRL + Z to remove the last pin</li>
          <li>CTRL + S to export the map</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.open {
  position: absolute;
  padding: 20px;
  min-height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-color: #111111;
  box-shadow: 2px 6px 22px -3px rgba(0, 0, 0, 0.95);
}

.open-placement {
  left: auto;
  top: 50%;
  right: 0;
  gap: 20px;
  width: auto;
  transform: translateY(-50%);
  border-radius: 40px 0 0 40px;
}

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

h3 {
  margin: 0;
}

ul {
  margin: 0;
}

.shortcuts {
  color: white;
}
</style>