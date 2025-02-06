<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {usePinStore} from "~/types/store/PinStore";
import type {Message} from "~/types/Message";

const pinStore = usePinStore();
const clientId = ref<string>('');
const socket = ref<WebSocket | null>(null);

onMounted(() => {
  socket.value = new WebSocket("ws://localhost:8080");

  socket.value.onopen = () => {
    console.log("WebSocket connecté");
  };

  socket.value.onmessage = (event) => {
    const message: Message = JSON.parse(event.data);
    switch (message.type) {
      case "initialization":
        handleInitializationMessage(message);
        break;
      case "deletePin":
        handleDeletePinMessage(message);
        break;
      case "addPin":
        handleAddPinMessage(message);
        break;
      case "updatePin":
        handleUpdatePinMessage(message);
        break;
      default:
    }
  };

  socket.value.onclose = () => {
    console.log("WebSocket déconnecté");
  };

  socket.value.onerror = (error) => {
    console.error("WebSocket erreur :", error);
  };
});

const handleInitializationMessage = (message: Message) => {
  if (!message.pins) {
    return;
  }
  pinStore.pins = message.pins;
  if (!message.clientId) {
    return;
  }
  clientId.value = message.clientId;
  if (socket.value) {
    pinStore.initializedSocket(socket.value, clientId.value);
  }
};

const handleDeletePinMessage = (message: Message) => {
  if (!message.pin) {
    return;
  }
  pinStore.deletePin(message.pin, false);
};

const handleAddPinMessage = (message: Message) => {
  if (!message.pin) {
    return;
  }
  pinStore.addPin(message.pin, false);
};

const handleUpdatePinMessage = (message: Message) => {
  if (!message.pin) {
    return;
  }
  pinStore.updatePin(message.pin, false);
};

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});
</script>
<template>
</template>
