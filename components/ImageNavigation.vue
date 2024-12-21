<script setup lang="ts">
import {onUnmounted, ref} from "vue";
import panzoom, {type PanzoomObject} from "@panzoom/panzoom";

defineProps<{
  imageSrc: string
  imageDimensions: {
    width: number
    height: number
  }
}>()

defineEmits<{
  reset: []
}>()


const imageWrapper = ref<HTMLDivElement | null>(null);
let panzoomInstance: PanzoomObject | null = null;

onMounted(() => {
  if (imageWrapper.value) {
    panzoomInstance = panzoom(
        imageWrapper.value, {
          maxZoom: 5,
          minZoom: 0.5,
        }
    );

    const wheelHandler = (event: WheelEvent) => {
      event.preventDefault();
      panzoomInstance?.zoomWithWheel(event, {step: 0.07});
    };
    document.addEventListener("wheel", wheelHandler, {passive: false});

    onUnmounted(() => {
      document.removeEventListener("wheel", wheelHandler);
    });
  }
})

onUnmounted(() => {
  if (panzoomInstance) {
    panzoomInstance.destroy();
  }
});
</script>

<template>
  <div class="image-preview-container">
    <div class="image-wrapper" ref="imageWrapper">
      <ImageEdit
        :imageSrc="imageSrc"
        :imageDimensions="imageDimensions"
      />
    </div>
    <button class="close-btn" @click="$emit('reset')">Reset</button>
  </div>
</template>

<style scoped>
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px 15px;
  background-color: #f00;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.image-preview-container {
  width: 100%;
  height: 100%;
}
</style>