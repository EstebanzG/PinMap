<script setup lang="ts">
import {v4 as uuidv4} from 'uuid';
import {type PanzoomObject} from '@panzoom/panzoom';
import type {Coordinate} from '~/components/MenuPinMovement.vue';
import {usePinStore} from '~/types/store/PinStore';
import {DEFAULT_PIN_COLOR, DEFAULT_PIN_SIZE, type Pin} from '~/types/Label';
import {computed, onMounted, ref, watch} from 'vue';
import {useUsersStore} from "~/types/store/UsersStore";
import {useSelectedPinStore} from "~/types/store/SelectedPinStore";

const props = defineProps<{
  targetCoordinate: Coordinate;
  panzoomInstance: PanzoomObject | null;
}>();

const usersStore = useUsersStore();
const pinStore = usePinStore();
const selectedPinStore = useSelectedPinStore();

const pin = ref<Pin | null>(selectedPinStore.selectedPin);

const name = ref<string>('');
const size = ref<number>(DEFAULT_PIN_SIZE);
const color = ref<string>(DEFAULT_PIN_COLOR);

const isPinValidated = computed(() => pin.value && pin.value.status === 'validated');
const canValidatePin = computed(() => pin.value && pin.value.status === 'pending' && !pinStore.isValidatedByClient(pin.value));

const createOrUpdatePin = () => {
  if (pin.value === null) {
    createPin();
    resetInfos();
  } else {
    updatePin();
  }
};

const createPin = () => {
  pinStore.addPin({
    id: uuidv4(),
    name: name.value,
    color: color.value,
    size: size.value,
    positionX: props.targetCoordinate.x,
    positionY: props.targetCoordinate.y,
    status: 'pending',
    validatedBy: [],
    messages: [],
  });
};

const updatePin = () => {
  if (pin.value) {
    pinStore.updatePin({
      ...pin.value,
      name: name.value,
      size: size.value,
      color: color.value,
    });
  }
};

const resetInfos = () => {
  name.value = '';
  size.value = DEFAULT_PIN_SIZE;
  color.value = DEFAULT_PIN_COLOR;
};

const validatePin = () => {
  if (pin.value) {
    pinStore.validatePin(pin.value);
  }
};

const deletePin = () => {
  if (pin.value) {
    pinStore.deletePin(pin.value);
  }
};

const loadPinData = (pin: Pin | null) => {
  if (pin) {
    name.value = pin.name ?? '';
    size.value = pin.size;
    color.value = pin.color ?? DEFAULT_PIN_COLOR;
  } else {
    resetInfos();
  }
};

onMounted(() => {
  loadPinData(pin.value);
});

watch(() => selectedPinStore.selectedPin, (newPin) => {
  pin.value = newPin;
  loadPinData(newPin);
});
</script>

<template>
  <form v-if="!pin || isPinValidated" class="content" ref="form" @submit.prevent="createOrUpdatePin">
    <div class="inputs">
      <div class="form-group">
        <label for="name" class="parkinsans-text">Pin name*</label>
        <input id="name" type="text" v-model="name" placeholder="Chicago" required/>
      </div>
      <span class="form-group">
          <label for="size" class="parkinsans-text">Size*</label>
          <input id="size" type="number" min="20" max="80" v-model="size" required/>
        </span>
      <div class="form-group">
        <label for="color" class="parkinsans-text">Color</label>
        <input id="color" type="color" v-model="color"/>
      </div>
    </div>
    <button class="action-btn" type="submit">{{ pin === null ? 'Create' : 'Update' }}</button>
  </form>
  <div class="button-wrapper" v-else-if="canValidatePin">
    <button class="action-btn action-validation-btn parkinsans-title" type="button" @click="validatePin">Validate
    </button>
    <button class="action-btn action-validation-btn parkinsans-title" type="button" @click="deletePin">Deny</button>
  </div>
  <div v-else class="parkinsans-title">
    <p class="text-medium">Number of validation {{ pin.validatedBy.length ?? 0 }} / {{
        usersStore.minimalNbOfValidations
      }}</p>
    <p class="text-tall">Awaiting approval</p>
  </div>
  <div class="target-selector"></div>
</template>

<style scoped>
.action-validation-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-size: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  color: white;
  gap: 5px;
  width: 100%;
}

form {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.button-wrapper {
  height: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.text-tall {
  font-size: 30px;
}

.text-tall {
  font-size: 40px;
}

.inputs {
  height: 75%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

input[type="color"] {
  height: 40px;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  border: 1px solid white;
  outline: none;
  padding: 0;
  border-radius: 20px;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 20px;
}

input[type="number"] {
  height: 40px;
  outline: none;
  padding: 0 20px;
  background: transparent;
  border: 1px solid white;
  border-radius: 20px;
  color: white;
  transition: all 0.2s ease-in-out;
}

input[type="number"]:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 1px white;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>