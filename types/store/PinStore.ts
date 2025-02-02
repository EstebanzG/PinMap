import {defineStore} from 'pinia';
import {ref} from 'vue';
import {v4 as uuidv4} from "uuid";
import type {Cluster, Pin} from "../Label";
import type {ActionsTypes, Message} from "~/types/Message";

export const usePinStore = defineStore('pinStore', () => {
  const pins = ref<Pin[]>([]);
  const pinsToDisplay = ref<Pin[]>([]);
  const clusterToDisplay = ref<Cluster[]>([]);
  let socket: WebSocket | null = null;
  let clientId: string | null = null;

  const initializedSocket = (ws: WebSocket, id: string) => {
    socket = ws;
    clientId = id;
  };

  const sendMessage = (type: ActionsTypes, pin: Pin) => {
    const isSocketOpen = socket && socket.readyState === WebSocket.OPEN;
    if (isSocketOpen && clientId) {
      const message: Message = {
        senderId: clientId,
        type: type,
        pin: pin,
      }
      console.log(message)
      socket?.send(JSON.stringify(message));
    }
  };

  const pinsOverlap = (pin1: Pin, pin2: Pin, zoomScale: number): boolean => {
    const distance = Math.sqrt(
      Math.pow(pin2.positionX - pin1.positionX, 2) +
      Math.pow(pin2.positionY - pin1.positionY, 2)
    );
    const combinedRadius = (pin1.size + pin2.size) / (2 * zoomScale);
    return distance < combinedRadius;
  };

  const findOrCreateCluster = (pin: Pin, clusters: Pin[][], zoomScale: number): Pin[] => {
    for (const cluster of clusters) {
      if (cluster.some(clusterPin => pinsOverlap(pin, clusterPin, zoomScale))) {
        return cluster;
      }
    }
    const newCluster: Pin[] = [];
    clusters.push(newCluster);
    return newCluster;
  };

  const addPin = (pin: Pin, zoomScale: number, shouldSendMessage = true) => {
    pins.value.push(pin);
    if (shouldSendMessage) {
      sendMessage("addPin", pin);
    }
    refreshView(zoomScale);
  };

  const deleteLastPin = (shouldSendMessage = true) => {
    const pin: Pin | undefined = pins.value.pop();
    if (pin && shouldSendMessage) {
      sendMessage("deletePin", pin);
    }
  };

  const deletePin = (deletedPin: Pin, zoomScale: number, shouldSendMessage = true) => {
    pins.value = pins.value.filter(pin => pin.id !== deletedPin.id);
    if (shouldSendMessage) {
      sendMessage("deletePin", deletedPin);
    }
    refreshView(zoomScale);
  };

  const updatePin = (updatedPin: Pin, zoomScale: number, shouldSendMessage = true) => {
    const index = pins.value.findIndex(pin => pin.id === updatedPin.id);
    if (index !== -1) {
      pins.value[index] = updatedPin;
      if (shouldSendMessage) {
        sendMessage("updatePin", updatedPin);
      }
      refreshView(zoomScale);
    }
  };

  const reset = () => {
    pins.value = [];
    pinsToDisplay.value = [];
    clusterToDisplay.value = [];
  }

  const getPinAtCoordinates = (clientX: number, clientY: number, zoomScale: number) => {
    return pinsToDisplay.value.find(pin => {
      const size = pin.size / zoomScale;
      const bottom = pin.positionY;
      const top = bottom - size;
      const left = pin.positionX - size / 2;
      const right = pin.positionX + size / 2;

      const withinX = clientX >= left && clientX <= right;
      const withinY = clientY >= top && clientY <= bottom;

      return withinX && withinY;
    }) ?? null;
  };

  const refreshView = (zoomScale: number) => {
    const clusters: Pin[][] = [];
    const processed = new Set<string>();

    // Build clusters
    for (const pin of pins.value) {
      if (processed.has(pin.id)) {
        continue;
      }

      let currentCluster = findOrCreateCluster(pin, clusters, zoomScale);
      currentCluster.push(pin);
      processed.add(pin.id);

      let changed = true;
      while (changed) {
        changed = false;
        for (const otherPin of pins.value) {
          if (processed.has(otherPin.id)) {
            continue;
          }

          if (currentCluster.some(clusterPin => pinsOverlap(otherPin, clusterPin, zoomScale))) {
            currentCluster.push(otherPin);
            processed.add(otherPin.id);
            changed = true;
          }
        }
      }
    }

    // Update display state
    pinsToDisplay.value = [];
    clusterToDisplay.value = [];

    // Add unprocessed pins
    pinsToDisplay.value = pins.value.filter(pin => !processed.has(pin.id));

    // Process clusters
    clusters.forEach(cluster => {
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
          names: cluster.map(pin => pin.name ?? ""),
          size: cluster.reduce((sum, pin) => sum + pin.size, 0) / cluster.length,
        });
      }
    });
  };

  return {
    pins,
    pinsToDisplay,
    clusterToDisplay,
    initializedSocket,
    addPin,
    deletePin,
    updatePin,
    deleteLastPin,
    reset,
    refreshView,
    getPinAtCoordinates,
  };
});