<script setup lang="ts">
import {type PanzoomObject} from '@panzoom/panzoom';
import type {Coordinate} from '~/components/MenuPinMovement.vue';
import {type Pin} from '~/types/Label';
import MenuPinBase from "~/components/MenuPinBase.vue";

defineProps<{
  pin: Pin | null;
  targetCoordinate: Coordinate;
  panzoomInstance: PanzoomObject | null;
  isChatOpen: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

</script>

<template>
  <div class="open" ref="menu">
    <MenuPinBase
        v-if="!isChatOpen || !pin"
        :pin="pin"
        :target-coordinate="targetCoordinate"
        :panzoom-instance="panzoomInstance"
        @close="$emit('close')"
    />
    <MenuChatBase
      v-else-if="pin"
      :pin="pin"
    />
  </div>
  <div class="target-selector"></div>
</template>

<style scoped>
.open {
  padding: 20px;
  background-color: rgba(17, 17, 17);
  border: solid 1px white;
  height: 347px;
  width: 282px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.target-selector {
  position: absolute;
  top: 50%;
  right: -10px;
  transform: rotate(45deg);
  width: 20px;
  height: 20px;
  background-color: rgba(17, 17, 17);
  border-top: solid 1px white;
  border-right: solid 1px white;
}
</style>