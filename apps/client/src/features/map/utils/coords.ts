export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export function screenToWorld(
  screenX: number,
  screenY: number,
  camera: Camera,
) {
  return {
    x: (screenX - camera.x) / camera.zoom,
    y: (screenY - camera.y) / camera.zoom,
  };
}
