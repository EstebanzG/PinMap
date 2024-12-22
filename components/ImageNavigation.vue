<script setup lang="ts">
import {onUnmounted} from "vue";
import panzoom, {type PanzoomObject} from "@panzoom/panzoom";
import ImageEdit from "./ImageEdit.vue";
import PinActions from "~/components/PinActions.vue";

const DEFAULT_PIN_SIZE = 40;

defineProps<{
  imageSrc: string;
  imageDimensions: {
    width: number;
    height: number;
  };
}>();

defineEmits<{
  (e: "reset"): void;
}>();

const imageWrapper = useTemplateRef('image-wrapper');
const imageEdit = useTemplateRef('edit-image');
const pinAction = useTemplateRef<typeof PinActions>('pin-action');

let panzoomInstance: PanzoomObject | null = null;

const defaultPanZoomOptions = {
  maxZoom: 5,
  minZoom: 0.5,
};

const handleActivateMovement = (isChecked: boolean) => {
  if (panzoomInstance) {
    panzoomInstance.setOptions({
      disablePan: isChecked,
      ...defaultPanZoomOptions,
    });
  }
};

const handlePrint = () => {
  if (imageEdit.value) {
    imageEdit.value.exportImage();
  }
};

onMounted(() => {
  if (imageWrapper.value) {
    panzoomInstance = panzoom(imageWrapper.value, defaultPanZoomOptions);

    const wheelHandler = (event: WheelEvent) => {
      event.preventDefault();
      panzoomInstance?.zoomWithWheel(event, {step: 0.1});
    };
    document.addEventListener("wheel", wheelHandler, {passive: false});

    onUnmounted(() => {
      document.removeEventListener("wheel", wheelHandler);
    });
  }
});

onUnmounted(() => {
  if (panzoomInstance) {
    panzoomInstance.destroy();
  }
});
</script>

<template>
  <div class="image-preview-container">
    <div class="image-wrapper" ref="image-wrapper">
      <ImageEdit
          ref="edit-image"
          :image-src="imageSrc"
          :image-dimensions="imageDimensions"
          :is-pin-settings-open="pinAction?.isOpen ?? null"
          :pin-settings-name="pinAction?.name ?? null"
          :pin-settings-color="pinAction?.color ?? null"
          :pin-settings-size="pinAction?.size ?? DEFAULT_PIN_SIZE"
      />
    </div>
    <EditorActions
        @handleActivateMovement="handleActivateMovement"
        @reset="$emit('reset')"
        @print="handlePrint"
    />
    <PinActions
        ref="pin-action"
        @handleActivateMovement="handleActivateMovement"
        @reset="$emit('reset')"
        @print="handlePrint"
    />
  </div>
</template>

<style scoped>
.image-preview-container {
  width: 100%;
  height: 100%;
}
</style>