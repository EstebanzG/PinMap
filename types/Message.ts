import type {Pin} from "~/types/Label";

export type ActionsTypes = "addPin" | "deletePin" | "updatePin"

export interface Message {
  senderId: string;
  clientId?: string;
  type: "initialization" | ActionsTypes;
  pin?: Pin;
  pins?: Pin[];
}