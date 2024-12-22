<script setup lang="ts">

defineProps<{}>()

const emits = defineEmits<{
  (e: 'handleActivateMovement', isChecked: boolean): void;
  (e: 'reset'): void;
  (e: 'print'): void;
}>();

const isOpen = ref<boolean>(false);

const handleActivateMovement = (event: Event) => {
  event.stopPropagation();

  const isChecked = (event.target as HTMLInputElement).checked;

  emits('handleActivateMovement', isChecked);
};

const handleClick = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="actions">
    <div v-if="isOpen" class="open">
      <div class="cursor-pointer" @click="handleClick">
        <Icon name="heroicons:cog-6-tooth-16-solid"/>
      </div>
      <span>
        <input id="handle-movement" type="checkbox" @change="handleActivateMovement"/>
        <label for="handle-movement" class="parkinsans-text">Disable movements</label>
      </span>
      <button class="close-btn" @click="$emit('print')">Print</button>
      <button class="close-btn" @click="$emit('reset')">Reset</button>
    </div>
    <div v-else class="closed cursor-pointer" @click="handleClick">
      <Icon name="heroicons:cog-6-tooth-16-solid"/>
    </div>
  </div>
</template>

<style scoped>
.actions {
  position: absolute;
  top: 50%;
  right: 0;
}

.actions .closed {
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #111111;
  color: #afafaf;
  padding: 10px;
  border-radius: 30px 0 0 30px;
}

.actions .open {
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #111111;
  padding: 10px;
  gap: 30px;
  color: white;
  border-radius: 30px 0 0 30px;
}

</style>