<script setup lang="ts">
import {onUnmounted} from "vue";
import panzoom, {type PanzoomObject} from "@panzoom/panzoom";
import ImageEdit from "./ImageEdit.vue";
import type MenuPin from "~/components/MenuPin.vue";
import MenuEditor from "~/components/MenuEditor.vue";

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
const pinAction = useTemplateRef<typeof MenuPin>('pin-action');
const zoomScale = ref(1);
const menuOpen = ref<"pin" | "editor" | null>(null);

let panzoomInstance: PanzoomObject | null = null;

const defaultPanZoomOptions = {
  maxZoom: 10,
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
      zoomScale.value = panzoomInstance?.zoomWithWheel(event, {step: 0.1}).scale ?? 1;
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
          :zoom-scale="zoomScale"
          :is-pin-settings-open="menuOpen === 'pin'"
          :pin-settings-name="pinAction?.name ?? null"
          :pin-settings-color="pinAction?.color ?? null"
          :pin-settings-size="pinAction?.size ?? DEFAULT_PIN_SIZE"
      />
    </div>
    <div class="actions" v-if="menuOpen === null">
      <div class="closed cursor-pointer" @click="() => menuOpen = 'pin'">
        <Icon name="heroicons:plus-circle"/>
      </div>
      <div class="closed cursor-pointer" @click="() => menuOpen = 'editor'">
        <Icon name="heroicons:cog-6-tooth-16-solid"/>
      </div>
    </div>
    <MenuEditor
        v-if="menuOpen === 'editor'"
        @handleActivateMovement="handleActivateMovement"
        @reset="$emit('reset')"
        @print="handlePrint"
        @close="() => menuOpen = null"
    />
    <MenuPin
        v-if="menuOpen === 'pin'"
        ref="pin-action"
        @close="() => menuOpen = null"
    />
  </div>
</template>

<style scoped>
.image-preview-container {
  width: 100%;
  height: 100%;
}

.actions {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.closed {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #111111;
  color: white;
  padding: 10px;
  border-radius: 30px 0 0 30px;
}
</style>