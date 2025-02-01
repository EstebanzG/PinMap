<script setup lang="ts">
defineEmits<{
  (e: 'handleFileInput', event: Event): void;
  (e: 'useDefaultMap'): void;
}>()

const fileInput = ref<HTMLDivElement | null>(null);
</script>

<template>
  <div class="file-input-container">
    <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="(event) => $emit('handleFileInput', event)"
    />
    <h1 class="parkinsans-title" @click="fileInput?.click()">
      Click here to upload <span class="underline">your own map</span>.
    </h1>
    <h2 class="parkinsans-title-secondary" @click="$emit('useDefaultMap')">
      Or here to use the <span class="underline">default map</span>.
    </h2>
  </div>
</template>

<style scoped>
.file-input-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: transparent;
}

input {
  display: none;
}

h1, h2 {
  cursor: pointer;
  text-align: center;
}

h2 {
  cursor: pointer;
}
</style>