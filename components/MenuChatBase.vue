<script setup lang="ts">
import {ref, watch} from 'vue';
import {usePinStore} from "~/types/store/PinStore";
import {useSelectedPinStore} from "~/types/store/SelectedPinStore";

const props = defineProps<{}>();

const pinStore = usePinStore();
const selectedPinStore = useSelectedPinStore();

const newMessage = ref<string>('');
const chatMessagesRef = ref<HTMLElement | null>(null);

const sendMessage = () => {
  if (newMessage.value.trim() !== '' && selectedPinStore.selectedPin) {
    pinStore.addMessageToPin(selectedPinStore.selectedPin.id, newMessage.value);
    newMessage.value = '';
  }
};

const messages = computed(() => {
  if (selectedPinStore.selectedPin) {
    return pinStore.getMessagesForPin(selectedPinStore.selectedPin.id);
  }

  return [];
});

const scrollToBottom = (behavior: 'smooth' | 'instant') => {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTo({
      top: chatMessagesRef.value.scrollHeight,
      behavior: behavior,
    });
  }
};

watch(messages, async () => {
  await nextTick();
  scrollToBottom('smooth');
}, {deep: true});

onMounted(() => {
  scrollToBottom('instant');
});

</script>

<template>
  <div class="chat-container">
    <div class="chat-messages" ref="chatMessagesRef">
      <div v-for="(message, index) in messages" :key="index"
           :class="['chat-message parkinsans-text-light', pinStore.isMessageSenderIsMe(message.sender) ? 'self-message' : 'other-message']">
        <div class="message-bubble">
          <p class="message-content">{{ message.content }}</p>
          <hr v-if="!pinStore.isMessageSenderIsMe(message.sender)"/>
          <p v-if="!pinStore.isMessageSenderIsMe(message.sender)" class="message-sender">{{
              message.sender
            }}</p>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input
          type="text"
          v-model="newMessage"
          placeholder="Type a message..."
          @keyup.enter="sendMessage"
          class="input-box"
      />
      <button class="action-btn" @click="sendMessage">Send</button>
    </div>
  </div>
</template>


<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  color: white;
  user-select: text;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border-radius: 8px;
}

.chat-message {
  display: flex;
  margin-bottom: 10px;
}

.message-bubble {
  width: 60%;
  border-radius: 12px;
  border: white 1px solid;
  color: white;
}

.message-bubble hr {
  border-color: gray;
}

.self-message {
  justify-content: flex-end;
}

.other-message {
  justify-content: flex-start;
}

.self-message .message-bubble {
  color: white;
}

.message-content {
  font-size: 14px;
  overflow-wrap: break-word;
  padding: 10px;
}

.message-sender {
  font-size: 12px;
  margin-top: 5px;
  padding: 5px 10px 5px 10px;
  font-style: italic;
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;;
}

.chat-input {
  height: 20%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-input input {
  width: 50%;
}

.chat-input button {
  width: 30%;
}

.chat-messages::-webkit-scrollbar {
  width: 10px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: white;
  border-radius: 5px;
}
</style>
