<script setup lang="ts">
import {onUnmounted} from "vue";
import panzoom, {type PanzoomObject} from "@panzoom/panzoom";
import ImageEdit from "./ImageEdit.vue";
import type MenuPin from "~/components/MenuPin.vue";
import MenuEditor from "~/components/MenuEditor.vue";
import type {Pin} from "~/components/ImageEdit.vue";

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
const menuPin = useTemplateRef<typeof MenuPin>('menu-pin');
const zoomScale = ref(1);
const menuOpen = ref<"pin" | "editor" | null>(null);
const isNavigationDisabled = ref<boolean>(false);
const pinToUpdate = ref<Pin | null>(null);

let panzoomInstance: PanzoomObject | null = null;

const defaultPanZoomOptions = {
  maxZoom: 15,
  minZoom: 0.1,
};

const handleActivateMovement = (value: boolean) => {
  if (panzoomInstance) {
    panzoomInstance.setOptions({
      disablePan: value,
      ...defaultPanZoomOptions,
    });
  }
};

watch(() => isNavigationDisabled.value, () => handleActivateMovement(isNavigationDisabled.value));

const handlePrint = () => {
  if (imageEdit.value) {
    imageEdit.value.exportImage();
  }
};

const openMenuPin = () => {
  handleActivateMovement(true);
  menuOpen.value = "pin";
};

const closeMenuPin = () => {
  pinToUpdate.value = null;
  menuOpen.value = null;
  handleActivateMovement(isNavigationDisabled.value);
};

const submitForm = () => {
  if (menuPin.value) {
    const form = menuPin.value.form;
    if (form) {
      if (!form.checkValidity()) {
        for (const element of form.elements) {
          if (!element.validity.valid) {
            element.reportValidity();
          }
        }
        return false;
      }
    }
  }
};

const updateOrDeletePin = (pin: Pin) => {
  if (pinToUpdate.value) {
    return;
  }
  pinToUpdate.value = pin;
  menuOpen.value = "pin"
}

const deletePin = (pin: Pin) => {
  imageEdit.value?.deletePin(pin);
}

const updatePin = (pin: Pin) => {
  imageEdit.value?.updatePin(pin);
}

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
          :pin-settings-name="menuPin?.name ?? null"
          :pin-settings-color="menuPin?.color ?? null"
          :pin-settings-size="menuPin?.size ?? DEFAULT_PIN_SIZE"
          :is-update="pinToUpdate !== null"
          @submit-form="submitForm"
          @close-menu-pin="closeMenuPin"
          @update-or-delete-pin="updateOrDeletePin"
      />
    </div>
    <div class="actions" v-if="menuOpen === null">
      <div class="closed cursor-pointer" @click="openMenuPin">
        <Icon name="heroicons:plus-circle"/>
      </div>
      <div class="closed cursor-pointer" @click="() => menuOpen = 'editor'">
        <Icon name="heroicons:cog-6-tooth-16-solid"/>
      </div>
    </div>
    <MenuEditor
        v-if="menuOpen === 'editor'"
        :is-navigation-disabled="isNavigationDisabled"
        @handleActivateMovement="() => isNavigationDisabled = !isNavigationDisabled"
        @reset="$emit('reset')"
        @print="handlePrint"
        @close="() => menuOpen = null"
    />
    <MenuPin
        v-if="menuOpen === 'pin'"
        ref="menu-pin"
        :pin="pinToUpdate"
        @close="closeMenuPin"
        @delete="(pin: Pin) => deletePin(pin)"
        @update="(pin: Pin) => updatePin(pin)"
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