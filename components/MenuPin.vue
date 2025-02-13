<script setup lang="ts">
import {type PanzoomObject} from '@panzoom/panzoom';
import type {Coordinate} from '~/components/MenuPinMovement.vue';
import MenuPinBase from "~/components/MenuPinBase.vue";
import {useSelectedPinStore} from "~/types/store/SelectedPinStore";

defineProps<{
  targetCoordinate: Coordinate;
  panzoomInstance: PanzoomObject | null;
  isChatOpen: boolean;
}>();

const selectedPinStore = useSelectedPinStore();

</script>

<template>
  <div class="open" ref="menu">
    <MenuPinBase
        v-if="!isChatOpen || !selectedPinStore.selectedPin"
        :target-coordinate="targetCoordinate"
        :panzoom-instance="panzoomInstance"
    />
    <MenuChatBase
        v-else-if="selectedPinStore.selectedPin"
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