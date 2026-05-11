export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Rectangle {
  dimensions: Dimensions;
  position: Position;
}
