<script setup lang="ts">
import {defineExpose, ref} from 'vue'
import html2canvas from "html2canvas";
import {v4 as uuidv4} from 'uuid';
import constantColor from "~/utils/constant-color";

interface Label {
  id: string,
  positionX: number,
  positionY: number,
  size: number
}

export interface Pin extends Label {
  color?: string | null,
  name?: string | null
}

interface Cluster extends Label {
  numberOfPins: number,
}

const props = defineProps<{
  imageSrc: string,
  imageDimensions: {
    width: number
    height: number
  },
  zoomScale: number,
  isPinSettingsOpen: boolean | null,
  pinSettingsName: string | null,
  pinSettingsColor: string | null,
  pinSettingsSize: number,
  isUpdate: boolean
}>()

const emit = defineEmits<{
  (e: 'submitForm'): void,
  (e: 'CloseMenuPin'): void,
  (e: 'updateOrDeletePin', pin: Pin): void,
}>()

const pins = ref<Pin[]>([])
const pinsToDisplay = ref<Pin[]>([])
const clusterToDisplay = ref<Cluster[]>([])

const imageElement = useTemplateRef('image-element')

const addPin = (event: MouseEvent) => {
  if (!props.isPinSettingsOpen) {
    return;
  }

  if (props.isUpdate) {
    return;
  }

  if (props.pinSettingsName === null || props.pinSettingsName === "") {
    emit('submitForm');
    return;
  }

  pins.value.push({
    id: uuidv4(),
    positionX: event.offsetX,
    positionY: event.offsetY,
    name: props.pinSettingsName,
    color: props.pinSettingsColor,
    size: props.pinSettingsSize,
  });

  refreshView();
  emit('CloseMenuPin');
};


onMounted(() => {
  document.addEventListener('keydown', (event) => {
    const isOnMacos = navigator.userAgent.includes('Mac OS')
    const ctrlKey = isOnMacos ? event.metaKey : event.ctrlKey
    if (event.key === 'z' && ctrlKey) {
      event.preventDefault();
      pins.value.pop();
      refreshView();
      return;
    }
    if (event.key === 's' && ctrlKey) {
      event.preventDefault();
      exportImage()
      return;
    }
  })
})

const exportImage = async () => {
  if (!imageElement.value) {
    return;
  }
  const canvas = await html2canvas(imageElement.value);
  const imageUrl = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'map.png';
  link.click();
}

const getPinPositionY = (pin: Label) => {
  const size = pin.size / props.zoomScale;

  return ((pin.positionY - size) / props.imageDimensions.height) * 100;
}

const getPinPositionX = (pin: Label) => {
  const size = pin.size / props.zoomScale;

  return ((pin.positionX - size / 2) / props.imageDimensions.width) * 100;
}

const refreshView = () => {
  if (pins.value.length === 0) {
    pinsToDisplay.value = [];
    clusterToDisplay.value = [];
    return;
  }

  const pinsOverlap = (pin1: Pin, pin2: Pin) => {
    const distance = Math.sqrt(
        Math.pow(pin2.positionX - pin1.positionX, 2) +
        Math.pow(pin2.positionY - pin1.positionY, 2)
    );
    const combinedRadius = (pin1.size + pin2.size) / (2 * props.zoomScale);
    return distance < combinedRadius;
  };

  const clusters: Pin[][] = [];
  const processed = new Set<string>();

  const findOrCreateCluster = (pin: Pin): Pin[] => {
    for (const cluster of clusters) {
      if (cluster.some(clusterPin => pinsOverlap(pin, clusterPin))) {
        return cluster;
      }
    }
    const newCluster: Pin[] = [];
    clusters.push(newCluster);
    return newCluster;
  };

  for (const pin of pins.value) {
    if (processed.has(pin.id)) {
      continue;
    }

    let currentCluster = findOrCreateCluster(pin);
    currentCluster.push(pin);
    processed.add(pin.id);

    let changed = true;
    while (changed) {
      changed = false;
      for (const otherPin of pins.value) {
        if (processed.has(otherPin.id)) {
          continue;
        }

        if (currentCluster.some(clusterPin => pinsOverlap(otherPin, clusterPin))) {
          currentCluster.push(otherPin);
          processed.add(otherPin.id);
          changed = true;
        }
      }
    }
  }

  pinsToDisplay.value = [];
  clusterToDisplay.value = [];

  for (const pin of pins.value) {
    if (!processed.has(pin.id)) {
      pinsToDisplay.value.push(pin);
    }
  }

  for (const cluster of clusters) {
    if (cluster.length === 1) {
      pinsToDisplay.value.push(cluster[0]);
    } else {
      const avgX = cluster.reduce((sum, pin) => sum + pin.positionX, 0) / cluster.length;
      const avgY = cluster.reduce((sum, pin) => sum + pin.positionY, 0) / cluster.length;

      clusterToDisplay.value.push({
        id: uuidv4(),
        positionX: avgX,
        positionY: avgY,
        numberOfPins: cluster.length,
        size: cluster.reduce((sum, pin) => sum + pin.size, 0) / cluster.length,
      });
    }
  }
};

watch(() => props.zoomScale, refreshView);

const deletePin = (pin: Pin) => {
  pins.value = pins.value.filter(p => p.id !== pin.id);
  refreshView();
  emit('CloseMenuPin');
}

const updatePin = (pin: Pin) => {
  pin.color = props.pinSettingsColor;
  pin.name = props.pinSettingsName;
  pin.size = props.pinSettingsSize;
  pins.value = pins.value.filter(p => p.id !== pin.id);
  pins.value.push(pin);
  refreshView();
  emit('CloseMenuPin');
}


defineExpose({
  exportImage,
  addPin,
  deletePin,
  updatePin,
  handleZoomScaleChange: refreshView
})
</script>

<template>
  <div
      class="image-background"
      ref="image-element"
      :style="{
            backgroundImage: `url('${imageSrc}')`,
            width: `${imageDimensions.width}px`,
            height: `${imageDimensions.height}px`,
          }"
      @click.self="(event) =>addPin(event)"
  >
    <Pin
        v-for="(pin, index) in pinsToDisplay"
        @click="() => $emit('updateOrDeletePin', pin)"
        :key="index"
        :color="pin.color ?? 'black'"
        :tooltipText="pin.name ?? ''"
        :zoom-scale="zoomScale"
        class="pin"
        :style="{
          top: `${getPinPositionY(pin)}%`,
          left: `${getPinPositionX(pin)}%`,
          height: `${pin.size / zoomScale}px`,
          width: `${pin.size / zoomScale}px`,
        }"
    />
    <Cluster
        v-for="(cluster, index) in clusterToDisplay"
        :key="index"
        class="pin"
        :color=constantColor.RED
        :nb-of-pins="cluster.numberOfPins"
        :style="{
          top: `${getPinPositionY(cluster)}%`,
          left: `${getPinPositionX(cluster)}%`,
          height: `${cluster.size / zoomScale}px`,
          width: `${cluster.size / zoomScale}px`,
        }"
    />
  </div>
</template>

<style scoped>
.image-background {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.pin {
  position: absolute;
}
</style>