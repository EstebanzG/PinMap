<script setup lang="ts">
import panzoom, {type PanzoomObject} from "@panzoom/panzoom";
import ImageEdit from "./ImageEdit.vue";
import MenuEditor from "~/components/MenuEditor.vue";
import MenuPinMovement, {type Coordinate} from "~/components/MenuPinMovement.vue";
import {usePinStore} from "~/types/store/PinStore";
import {useZoomStore} from "~/types/store/ZoomStore";
import {useSelectedPinStore} from "~/types/store/SelectedPinStore";

defineProps<{
  imageSrc: string;
  imageDimensions: {
    width: number;
    height: number;
  };
}>();

const emits = defineEmits<{
  (e: "reset"): void;
}>();

const pinStore = usePinStore();
const zoomStore = useZoomStore();
const selectedPinStore = useSelectedPinStore();

const imageWrapper = useTemplateRef('image-wrapper');
const imageEdit = useTemplateRef('edit-image');
const menuOpen = ref<"pin" | "editor" | null>(null);
const pinClickCoordinate = ref<Coordinate | null>(null);
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
  selectedPinStore.setSelectedPin(null);
  handleActivateImageMovement(isNavigationDisabled.value);
};

const openMenuPin = (event: MouseEvent) => {
  event.preventDefault();
  menuOpen.value = "pin";
  pinClickCoordinate.value = {
    x: event.clientX,
    y: event.clientY,
  };
};

const reset = () => {
  pinStore.reset();
  emits("reset");
};

onMounted(() => {
  pinStore.refreshView();
  if (imageWrapper.value) {
    imagePanzoomInstance = panzoom(imageWrapper.value, defaultPanZoomOptions);

    const wheelHandler = (event: WheelEvent) => {
      event.preventDefault();
      zoomStore.zoomLevel = imagePanzoomInstance?.zoomWithWheel(event, {step: 0.1}).scale ?? 1;
    };
    imageWrapper.value.addEventListener("wheel", wheelHandler, {passive: false});

    onUnmounted(() => {
      imageWrapper.value?.removeEventListener("wheel", wheelHandler);
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
  <div class="image-preview-container" @contextmenu="openMenuPin">
    <div ref="image-wrapper">
      <ImageEdit
          ref="edit-image"
          :image-src="imageSrc"
          :image-dimensions="imageDimensions"
          :zoom-scale="zoomStore.zoomLevel"
      />
    </div>
    <div class="actions" v-if="menuOpen === null">
      <div class="closed cursor-pointer" @click="() => menuOpen = 'editor'">
        <Icon name="heroicons:cog-6-tooth-16-solid"/>
      </div>
    </div>
    <MenuPinMovement
        v-if="menuOpen === 'pin'"
        :panzoomInstance="imagePanzoomInstance"
        :click-coordinate="pinClickCoordinate"
        @close="closeMenuPin"
    />
    <MenuEditor
        v-if="menuOpen === 'editor'"
        :is-navigation-disabled="isNavigationDisabled"
        @handleActivateMovement="() => isNavigationDisabled = !isNavigationDisabled"
        @reset="reset"
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

.closed:hover span {
  transform: scale(1.1);
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