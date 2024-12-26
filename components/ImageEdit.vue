<script setup lang="ts">
import {defineExpose, ref} from 'vue'
import html2canvas from "html2canvas";
import {v4 as uuidv4} from 'uuid';

interface Pin {
  id: string,
  positionX: number,
  positionY: number,
  color?: string | null,
  name?: string | null
  size: number
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
}>()

const pins = ref<Pin[]>([])
const pinsToDisplay = ref<Pin[]>([])

const imageElement = useTemplateRef('image-element')

const addPin = (event: MouseEvent) => {
  pins.value.push({
    id: uuidv4(),
    positionX: event.offsetX,
    positionY: event.offsetY,
    name: props.pinSettingsName,
    color: props.pinSettingsColor,
    size: props.pinSettingsSize,
  });

  handleZoomScaleChange();
};


onMounted(() => {
  document.addEventListener('keydown', (event) => {
    const isOnMacos = navigator.userAgent.includes('Mac OS')
    const ctrlKey = isOnMacos ? event.metaKey : event.ctrlKey
    if (event.key === 'z' && ctrlKey) {
      event.preventDefault();
      pins.value.pop()
    }
    if (event.key === 's' && ctrlKey) {
      event.preventDefault();
      exportImage()
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
  link.download = 'image-with-cubes.png';
  link.click();
}

const getPinPositionY = (pin: Pin) => {
  const size = pin.size / props.zoomScale;

  return ((pin.positionY - size) / props.imageDimensions.height) * 100;
}

const getPinPositionX = (pin: Pin) => {
  const size = pin.size / props.zoomScale;

  return ((pin.positionX - size / 2) / props.imageDimensions.width) * 100;
}

const handleZoomScaleChange = () => {
  if (pins.value.length === 0) {
    return;
  }

  // Helper function to check if two pins overlap
  const pinsOverlap = (pin1: Pin, pin2: Pin) => {
    const distance = Math.sqrt(
        Math.pow(pin2.positionX - pin1.positionX, 2) +
        Math.pow(pin2.positionY - pin1.positionY, 2)
    );
    const combinedRadius = (pin1.size + pin2.size) / (2 * props.zoomScale);
    return distance < combinedRadius;
  };

  // Create clusters of overlapping pins
  const clusters: Pin[][] = [];
  const processed = new Set<string>();

  // Function to find or create a cluster for a pin
  const findOrCreateCluster = (pin: Pin): Pin[] => {
    // Check existing clusters
    for (const cluster of clusters) {
      // If pin overlaps with any pin in cluster, return that cluster
      if (cluster.some(clusterPin => pinsOverlap(pin, clusterPin))) {
        return cluster;
      }
    }
    // No overlapping cluster found, create new one
    const newCluster: Pin[] = [];
    clusters.push(newCluster);
    return newCluster;
  };

  // Process each pin
  for (const pin of pins.value) {
    if (processed.has(pin.id)) {
      continue;
    }

    let currentCluster = findOrCreateCluster(pin);
    currentCluster.push(pin);
    processed.add(pin.id);

    // Keep checking for more pins that might overlap with the growing cluster
    let changed = true;
    while (changed) {
      changed = false;
      for (const otherPin of pins.value) {
        if (processed.has(otherPin.id)) {
          continue;
        }

        // If pin overlaps with any pin in current cluster
        if (currentCluster.some(clusterPin => pinsOverlap(otherPin, clusterPin))) {
          currentCluster.push(otherPin);
          processed.add(otherPin.id);
          changed = true;
        }
      }
    }
  }

  // Convert clusters into merged pins
  const mergedPins: Pin[] = [];

  // Add individual pins that aren't in any cluster
  for (const pin of pins.value) {
    if (!processed.has(pin.id)) {
      mergedPins.push(pin);
    }
  }

  // Add merged cluster pins
  for (const cluster of clusters) {
    if (cluster.length === 1) {
      mergedPins.push(cluster[0]);
    } else {
      // Calculate average position for cluster
      const avgX = cluster.reduce((sum, pin) => sum + pin.positionX, 0) / cluster.length;
      const avgY = cluster.reduce((sum, pin) => sum + pin.positionY, 0) / cluster.length;

      // Create merged pin with size based on cluster size
      mergedPins.push({
        id: uuidv4(),
        positionX: avgX,
        positionY: avgY,
        size: 40 + (cluster.length - 2) * 10, // Increase size based on number of merged pins
        color: '#44a832',
        name: `Group of ${cluster.length} pins`
      });
    }
  }

  pinsToDisplay.value = mergedPins;
};

watch(() => props.zoomScale, handleZoomScaleChange);


defineExpose({
  exportImage,
  addPin,
})

</script>

<template>
  <div
      class="image-background"
      ref="image-element"
      :style="{
            backgroundImage: imageSrc ? `url('${imageSrc}')` : 'none',
            width: `${imageDimensions.width}px`,
            height: `${imageDimensions.height}px`,
          }"
      @click.self="(event) => isPinSettingsOpen ? addPin(event) : null"
  >
    <Icon
        name="heroicons:map-pin-16-solid"
        v-for="(pin, index) in pinsToDisplay"
        :key="index"
        class="center-square"
        :style="{
          top: `${getPinPositionY(pin)}%`,
          left: `${getPinPositionX(pin)}%`,
          backgroundColor: pin.color ?? 'black',
          height: `${pin.size / zoomScale}px`,
          width: `${pin.size / zoomScale}px`,
          border: '1px solid black',
          pointerEvents: 'none'
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

.center-square {
  position: absolute;
}
</style>
