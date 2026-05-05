const GRID_SIZE = 40;

export function snapToGrid(x: number, y: number) {
  return {
    x: Math.floor(x / GRID_SIZE) * GRID_SIZE,
    y: Math.floor(y / GRID_SIZE) * GRID_SIZE
  };
}