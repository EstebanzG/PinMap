<script setup lang="ts">
import type { Pin } from "~/types/Label";
import { ref, watch, nextTick } from 'vue';
import { usePinStore } from "~/types/store/PinStore";

const props = defineProps<{
  pin: Pin
}>();

const pinStore = usePinStore();
const messages = ref(props.pin.messages);
const newMessage = ref('');
const chatMessagesRef = ref<HTMLElement | null>(null);

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    pinStore.addMessageToPin(props.pin.id, newMessage.value);
    newMessage.value = '';
  }
};

watch(messages, () => {
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
    }
  });
});
</script>

<template>
  <div class="chat-container">
    <div class="chat-messages" ref="chatMessagesRef">
      <div v-for="(message, index) in messages" :key="index" class="chat-message">
        <p class="message-content parkinsans-text">{{ message.content }}</p>
      </div>
    </div>
    <div class="chat-input">
      <input
          type="text"
          v-model="newMessage"
          placeholder="Type a message..."
          @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #1a1a1a;
  color: white;
  padding: 20px;
  border-radius: 10px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 10px;
}

.chat-message {
  margin-bottom: 10px;
  border-bottom: gray 1px solid;
}

.message-content {
  font-size: 16px;
}

.chat-input {
  display: flex;
  align-items: center;
}

.chat-input input {
  flex: 1;
  height: 40px;
  padding: 0 20px;
  background: transparent;
  border: 1px solid white;
  border-radius: 20px;
  color: white;
  margin-right: 10px;
  transition: all 0.2s ease-in-out;
}

.chat-input input:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 1px white;
}

.chat-input button {
  height: 40px;
  padding: 0 20px;
  background-color: #4CAF50;
  border: none;
  border-radius: 20px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.chat-input button:hover {
  background-color: #45a049;
}
</style>
