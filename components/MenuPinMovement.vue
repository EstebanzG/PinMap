<script setup lang="ts">

import type {PanzoomObject} from "@panzoom/panzoom";
import {usePinStore} from "~/types/store/PinStore";
import type {Pin} from "~/types/Label";

export interface Coordinate {
  x: number;
  y: number;
}

const props = defineProps<{
  zoomScale: number,
  panzoomInstance: PanzoomObject | null,
  clickCoordinate: Coordinate | null,
}>()

const emits = defineEmits<{
  (e: 'close'): void;
}>();

const pinStore = usePinStore();
const flyingMenu = useTemplateRef('flying-menu');
const targetCoordinate = ref<Coordinate | null>(null);
const existingPin = ref<Pin | null>(null);

const moveMenu = (event: MouseEvent) => {
  if (flyingMenu.value) {
    flyingMenu.value.style.left = `${event.clientX}px`;
    flyingMenu.value.style.top = `${event.clientY}px`;
    calculateTargetCoordinate();
    existingPin.value = pinStore.getPinAtCoordinates(
        targetCoordinate.value?.x ?? 0,
        targetCoordinate.value?.y ?? 0,
        props.zoomScale
    );
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
    x: x / props.zoomScale,
    y: y / props.zoomScale,
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
  if (existingPin.value) {
    pinStore.deletePin(existingPin.value, props.zoomScale);
    existingPin.value = null;
  }
}

watch(() => props.zoomScale, () => emits('close'));

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
        <button type="button" v-if="existingPin" @click="deleteExistingPin">
          <Icon name="hugeicons:delete-01" size="20px"/>
        </button>
        <button type="button" @click="() => emits('close')">
          <Icon name="hugeicons:cancel-01" size="20px"/>
        </button>
      </div>
    </div>
    <MenuPin
        ref="menu-pin"
        :pin="existingPin"
        :zoom-scale="zoomScale"
        :panzoom-instance="panzoomInstance"
        :target-coordinate="targetCoordinate ?? { x: 0, y: 0 }"
        @calculate-target-coordinate="calculateTargetCoordinate"
        @close="emits('close')"
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