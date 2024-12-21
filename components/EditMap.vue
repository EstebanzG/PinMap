<script setup lang="ts">
import { ref } from 'vue';

const fileContent = ref<string | null>(null);
const zoomLevel = ref(1);

const fileInput = ref<HTMLInputElement | null>(null);

const handleFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      fileContent.value = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
};

const zoomIn = () => {
  zoomLevel.value += 0.1;
};

const zoomOut = () => {
  if (zoomLevel.value > 0.1) zoomLevel.value -= 0.1;
};

</script>

<template>
  <div class="container">
    <div class="editor" @click="!fileInput?.value && fileInput?.click()">
      <template v-if="fileContent">
        <button class="upload-btn" @click="fileInput?.click()">Upload New File</button>
        <img
            :src="fileContent"
            alt="Preview"
            :style="{ transform: `translate(-50%, -50%) scale(${zoomLevel})` }"
        />
        <div class="controls">
          <button @click="zoomIn">Zoom In</button>
          <button @click="zoomOut">Zoom Out</button>
        </div>
      </template>
      <template v-else>
        <p>Click here to upload a PNG, JPEG, or SVG file</p>
      </template>
    </div>
    <input
        type="file"
        accept="image/png, image/jpeg, image/svg"
        ref="fileInput"
        style="display: none;"
        @change="handleFileInput"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.controls {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.editor {
  width: 900px;
  height: 500px;
  border: solid black 1px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.editor p {
  color: gray;
  font-size: 14px;
  text-align: center;
}

.editor img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  transform-origin: center center;
}

.upload-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  background-color: white;
  border: 1px solid black;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
