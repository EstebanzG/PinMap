<script setup lang="ts">
import {onUnmounted} from "vue";
import panzoom, {type PanzoomObject} from "@panzoom/panzoom";
import ImageEdit from "./ImageEdit.vue";
import MenuEditor from "~/components/MenuEditor.vue";
import MenuPinMovement from "~/components/MenuPinMovement.vue";


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
const zoomScale = ref(1);
const menuOpen = ref<"pin" | "editor" | null>(null);
const isNavigationDisabled = ref<boolean>(false);

let imagePanzoomInstance: PanzoomObject | null = null;

const defaultPanZoomOptions = {
  maxZoom: 15,
  minZoom: 0.1,
};

const handleActivateImageMovement = (value: boolean) => {
  if (imagePanzoomInstance) {
    imagePanzoomInstance.setOptions({
      disablePan: value,
      ...defaultPanZoomOptions,
    });
  }
};

watch(() => isNavigationDisabled.value, () => handleActivateImageMovement(isNavigationDisabled.value));

const handlePrint = () => {
  if (imageEdit.value) {
    imageEdit.value.exportImage();
  }
};

const closeMenuPin = () => {
  menuOpen.value = null;
  handleActivateImageMovement(isNavigationDisabled.value);
};

onMounted(() => {
  if (imageWrapper.value) {
    imagePanzoomInstance = panzoom(imageWrapper.value, defaultPanZoomOptions);

    const wheelHandler = (event: WheelEvent) => {
      event.preventDefault();
      zoomScale.value = imagePanzoomInstance?.zoomWithWheel(event, {step: 0.1}).scale ?? 1;
    };
    document.addEventListener("wheel", wheelHandler, {passive: false});

    onUnmounted(() => {
      document.removeEventListener("wheel", wheelHandler);
    });
  }
});

onUnmounted(() => {
  if (imagePanzoomInstance) {
    imagePanzoomInstance.destroy();
  }
});
</script>

<template>
  <div class="image-preview-container">
    <div ref="image-wrapper">
      <ImageEdit
          ref="edit-image"
          :image-src="imageSrc"
          :image-dimensions="imageDimensions"
          :zoom-scale="zoomScale"
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
    <MenuPinMovement
        v-if="menuOpen === 'pin'"
        :zoomScale="zoomScale"
        :panzoomInstance="imagePanzoomInstance"
        :image-edit="imageEdit"
        @close="closeMenuPin"
    />
    <MenuEditor
        v-if="menuOpen === 'editor'"
        :is-navigation-disabled="isNavigationDisabled"
        @handleActivateMovement="() => isNavigationDisabled = !isNavigationDisabled"
        @reset="$emit('reset')"
        @print="handlePrint"
        @close="() => menuOpen = null"
    />
  </div>
</template>

<style scoped>
.image-preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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

@media (max-width: 768px) {
  .actions {
    top: 0;
    right: 50%;
    transform: translateX(50%);
    flex-direction: row;
    gap: 15px;
  }

  .closed {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #111111;
    color: white;
    padding: 10px;
    border-radius: 0 0 30px 30px;
  }
}
</style>