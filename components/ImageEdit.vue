<script setup lang="ts">
import html2canvas from "html2canvas";
import constantColor from "~/utils/constant-color";
import type {Label} from "~/stores/pinStore";

const props = defineProps<{
  imageSrc: string,
  imageDimensions: {
    width: number
    height: number
  },
  zoomScale: number,
}>()

const pinStore = usePinStore();

const imageElement = useTemplateRef('image-element')

onMounted(() => {
  document.addEventListener('keydown', (event) => {
    const isOnMacos = navigator.userAgent.includes('Mac OS')
    const ctrlKey = isOnMacos ? event.metaKey : event.ctrlKey
    if (event.key === 'z' && ctrlKey) {
      event.preventDefault();
      pinStore.deleteLastPin();
      pinStore.refreshView(props.zoomScale);
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

watch(() => props.zoomScale, () => pinStore.refreshView(props.zoomScale));

defineExpose({
  exportImage,
});

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
  >
    <Pin
        v-for="(pin, index) in pinStore.pinsToDisplay"
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
        v-for="(cluster, index) in pinStore.clusterToDisplay"
        :key="index"
        class="pin"
        :color=constantColor.RED
        :nb-of-pins="cluster.numberOfPins"
        :names="cluster.names"
        :zoom-scale="zoomScale"
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