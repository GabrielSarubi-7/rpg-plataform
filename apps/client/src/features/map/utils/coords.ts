export function screenToWorld(
  x: number,
  y: number,
  camera: { x: number; y: number; zoom: number }
) {
  return {
    x: (x - camera.x) / camera.zoom,
    y: (y - camera.y) / camera.zoom,
  };
}