<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {usePinStore} from "~/types/store/PinStore";
import type {ActionMessage, InitializationMessage, UsersChangeMessage,} from "~/types/Message";
import {useUsersStore} from "~/types/store/UsersStore";

const pinStore = usePinStore();
const usersStore = useUsersStore();
const clientId = ref<string>('');
const socket = ref<WebSocket | null>(null);

onMounted(() => {
  socket.value = new WebSocket("ws://localhost:8080");

  socket.value.onopen = () => {
    console.log("WebSocket connecté");
  };

  socket.value.onmessage = (event) => {
    const message: ActionMessage | InitializationMessage | UsersChangeMessage = JSON.parse(event.data);
    switch (message.type) {
      case "initialization":
        handleInitializationMessage(message as InitializationMessage);
        break;
      case "usersChange":
        usersStore.nbOfUsers = (message as UsersChangeMessage).nbOfUsers;
        usersStore.minimalNbOfValidations = (message as UsersChangeMessage).minimalNbOfValidations;
        break;
      case "deletePin":
        handleDeletePinMessage(message as ActionMessage);
        break;
      case "addPin":
        handleAddPinMessage(message as ActionMessage);
        break;
      case "updatePin":
        handleUpdatePinMessage(message as ActionMessage);
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

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});

const handleInitializationMessage = (message: InitializationMessage) => {
  pinStore.pins = message.pins;
  clientId.value = message.clientId;
  usersStore.nbOfUsers = message.nbOfUsers;
  usersStore.minimalNbOfValidations = message.minimalNbOfValidations;

  if (socket.value) {
    pinStore.initializedSocket(socket.value, clientId.value);
  }
};

const handleDeletePinMessage = (message: ActionMessage) => {
  pinStore.deletePin(message.pin, false);
};

const handleAddPinMessage = (message: ActionMessage) => {
  pinStore.addPin(message.pin, false);
};

const handleUpdatePinMessage = (message: ActionMessage) => {
  pinStore.updatePin(message.pin, false);
};

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});
</script>
<template>
  <div>
    {{ usersStore.nbOfUsers }} user{{ usersStore.nbOfUsers > 1 ? 's' : '' }} connected
  </div>
</template>
<style scoped>
div {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  background-color: #f0f0f0;
  border-radius: 0 0 0 1rem;
  border: 1px solid #ccc;
  font-size: 1.5rem;
  z-index: 100;
}
</style>
