<script setup lang="ts">
defineEmits<{
  (e: 'handleFileInput', event: Event): void;
}>()

const fileInput = ref<HTMLDivElement | null>(null);
</script>

<template>
  <div class="file-input-container" @click="fileInput?.click()">
    <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="(event) => $emit('handleFileInput', event)"
    />
    <h1 class="parkinsans-title">
      Click here to upload your <span class="underline">map</span>.
    </h1>
  </div>
</template>

<style scoped>
.file-input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: transparent;
  cursor: pointer;
}

input {
  display: none;
}
</style>