export interface Label {
  id: string,
  positionX: number,
  positionY: number,
  size: number
}

export interface Pin extends Label {
  color?: string | null,
  name?: string | null
}

export interface Cluster extends Label {
  numberOfPins: number,
  names: string[],
}

export const DEFAULT_PIN_SIZE = 40;
export const DEFAULT_PIN_COLOR = '#ff0000';