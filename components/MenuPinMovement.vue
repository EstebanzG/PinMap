<script setup lang="ts">

import type {PanzoomObject} from "@panzoom/panzoom";
import {usePinStore} from "~/types/store/PinStore";
import {useZoomStore} from "~/types/store/ZoomStore";
import {useSelectedPinStore} from "~/types/store/SelectedPinStore";

export interface Coordinate {
  x: number;
  y: number;
}

const props = defineProps<{
  panzoomInstance: PanzoomObject | null,
  clickCoordinate: Coordinate | null,
}>()

const emits = defineEmits<{
  (e: 'close'): void;
}>();

const pinStore = usePinStore();
const zoomStore = useZoomStore();
const selectedPinStore = useSelectedPinStore();

const flyingMenu = useTemplateRef('flying-menu');
const targetCoordinate = ref<Coordinate | null>(null);
const isChatOpen = ref<boolean>(false);

const moveMenu = (event: MouseEvent) => {
  if (flyingMenu.value) {
    flyingMenu.value.style.left = `${event.clientX}px`;
    flyingMenu.value.style.top = `${event.clientY}px`;
    calculateTargetCoordinate();
    selectedPinStore.setSelectedPin(pinStore.getPinAtCoordinates(
        targetCoordinate.value?.x ?? 0,
        targetCoordinate.value?.y ?? 0,
    ));
  }
};

const handleActivateMenuMovement = () => {
  document.addEventListener("mousemove", moveMenu);
}

const handleDisableMenuMovement = () => {
  document.removeEventListener("mousemove", moveMenu);
}

const calculateTargetCoordinate = () => {
  const imageBackground = document.querySelector(".image-background");
  if (!imageBackground) {
    return;
  }

  const imageBackgroundRect = imageBackground.getBoundingClientRect();
  const flyingMenuCoordinate: DOMRect | null = flyingMenu.value?.getBoundingClientRect() ?? null;
  if (!flyingMenuCoordinate) {
    return;
  }

  const x = (flyingMenuCoordinate.right + 20) - imageBackgroundRect.left;
  const y = (flyingMenuCoordinate.top + (flyingMenuCoordinate.height / 2 + 10)) - imageBackgroundRect.top;

  targetCoordinate.value = {
    x: x / zoomStore.zoomLevel,
    y: y / zoomStore.zoomLevel,
  };
}

onMounted(() => {
  if (props.clickCoordinate && flyingMenu.value) {
    const menuRect = flyingMenu.value.getBoundingClientRect();
    const centerX = props.clickCoordinate.x - (menuRect.width / 2);
    const centerY = props.clickCoordinate.y - (menuRect.height / 2);

    flyingMenu.value.style.left = `${centerX}px`;
    flyingMenu.value.style.top = `${centerY}px`;
  }
  calculateTargetCoordinate();
});

const deleteExistingPin = () => {
  if (selectedPinStore.selectedPin) {
    pinStore.deletePin(selectedPinStore.selectedPin);
    selectedPinStore.selectedPin = null;
  }
}

const handleChat = () => {
  isChatOpen.value = !isChatOpen.value;
}

watch(() => zoomStore.zoomLevel, () => emits('close'));

</script>

<template>
  <div class="flying-menu" ref="flying-menu">
    <div class="actions">
      <button
          class="movement"
          @mousedown="handleActivateMenuMovement"
          @mouseup="handleDisableMenuMovement"
          type="button"
      >
        <Icon name="hugeicons:cursor-move-02" size="20px"/>
      </button>
      <div>
        <button type="button" v-if="selectedPinStore.selectedPin && !isChatOpen" @click="handleChat">
          <Icon name="hugeicons:message-02" size="20px"/>
        </button>
        <button type="button" v-if="selectedPinStore.selectedPin && isChatOpen" @click="handleChat">
          <Icon name="hugeicons:left-to-right-list-number" size="20px"/>
        </button>
        <button type="button" v-if="selectedPinStore.selectedPin && selectedPinStore.selectedPin.status !== 'pending'"
                @click="deleteExistingPin">
          <Icon name="hugeicons:delete-01" size="20px"/>
        </button>
        <button type="button" @click="() => emits('close')">
          <Icon name="hugeicons:cancel-01" size="20px"/>
        </button>
      </div>
    </div>
    <MenuPin
        ref="menu-pin"
        :panzoom-instance="panzoomInstance"
        :target-coordinate="targetCoordinate ?? { x: 0, y: 0 }"
        :is-chat-open="isChatOpen"
    />
  </div>
</template>

<style scoped>
.flying-menu {
  position: absolute;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.actions div {
  display: flex;
  gap: 10px;
}

.actions button {
  background-color: rgba(17, 17, 17);
  border: solid 1px white;
  border-bottom: none;
  cursor: pointer;
  color: white;
  padding: 10px;
}

.actions button:hover span {
  transform: scale(1.1);
}
</style>