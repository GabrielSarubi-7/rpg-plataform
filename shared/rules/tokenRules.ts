import { clamp } from "../utils/math";
import { GRID_SIZE } from "../constants/grid";

export function clampTokenToMap(
  x: number,
  y: number,
  mapWidth: number,
  mapHeight: number
) {
  return {
    x: clamp(x, 0, mapWidth - GRID_SIZE),
    y: clamp(y, 0, mapHeight - GRID_SIZE),
  };
}

export function snapToGrid(x: number, y: number) {
  return {
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE,
  };
}