import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useUsersStore = defineStore('usersStore', () => {
  const nbOfUsers = ref<number>(1);
  const minimalNbOfValidations = ref<number>(1);

  return {
    nbOfUsers,
    minimalNbOfValidations
  }
});