import type {Pin} from "~/types/Label";

export type ActionsTypes = "addPin" | "deletePin" | "updatePin"

interface Message {
  senderId: string;
  type: "initialization" | "addPin" | "deletePin" | "updatePin" | "usersChange";
}

export interface ActionMessage extends Message {
  pin: Pin;
}

export interface InitializationMessage extends Message {
  pins: Pin[];
  nbOfUsers: number;
  minimalNbOfValidations: number;
  clientId: string;
}

export interface UsersChangeMessage extends Message {
  nbOfUsers: number;
  minimalNbOfValidations: number;
}