export function getCellFromWorldPosition(
  x: number,
  y: number,
  cellSize: number,
) {
  return {
    col: Math.floor(x / cellSize),
    row: Math.floor(y / cellSize),
  };
}

export function getTokenPositionFromCell(
  col: number,
  row: number,
  cellSize: number,
) {
  return {
    x: col * cellSize,
    y: row * cellSize,
  };
}

export function getTokenPositionFromMouse(
  worldX: number,
  worldY: number,
  cellSize: number,
) {
  const cell = getCellFromWorldPosition(worldX, worldY, cellSize);

  return getTokenPositionFromCell(cell.col, cell.row, cellSize);
}

export function snapTokenToGrid(
  x: number,
  y: number,
  cellSize: number,
) {
  const col = Math.round(x / cellSize);
  const row = Math.round(y / cellSize);

  return getTokenPositionFromCell(col, row, cellSize);
}

export function clampTokenToMap(
  x: number,
  y: number,
  mapWidth: number,
  mapHeight: number,
  tokenSize: number,
) {
  return {
    x: Math.max(0, Math.min(mapWidth - tokenSize, x)),
    y: Math.max(0, Math.min(mapHeight - tokenSize, y)),
  };
}