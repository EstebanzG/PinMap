<script setup lang="ts">
import {ref} from "vue";

const imageSrc = ref<string | null>(null);
const imageDimensions = ref<{ width: number; height: number }>({width: 0, height: 0});

const handleFileInput = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    imageSrc.value = URL.createObjectURL(file);

    const img = new Image();
    img.src = imageSrc.value;
    img.onload = () => {
      imageDimensions.value = {width: img.naturalWidth, height: img.naturalHeight};
    };
  }
};

const useDefaultMap = () => {
  imageSrc.value = "/default-map.svg";

  const img = new Image();
  img.src = "/default-map.svg";
  img.onload = () => {
    imageDimensions.value = {width: img.naturalWidth, height: img.naturalHeight};
  };
};

const reset = () => {
  imageSrc.value = null;
  imageDimensions.value = {width: 0, height: 0};
};
</script>

<template>
  <div class="container">
    <ImageInput
        v-if="!imageSrc"
        @handle-file-input="handleFileInput"
        @use-default-map="useDefaultMap"
    />
    <ImageNavigation
        v-else
        :imageSrc="imageSrc"
        :imageDimensions="imageDimensions"
        @reset="reset"
    />
  </div>
  <WebSocketHandler />
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

.file-input-container input {
  font-size: 1.5rem;
}
</style>