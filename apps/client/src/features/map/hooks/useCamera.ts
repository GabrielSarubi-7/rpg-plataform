import { useState } from "react";

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 4;

function clampZoom(value: number) {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
}

export function useCamera(_mapWidth?: number, _mapHeight?: number) {
  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const move = (dx: number, dy: number) => {
    setCamera((prev) => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };

  const zoomAt = (mouseX: number, mouseY: number, delta: number) => {
    setCamera((prev) => {
      const zoomFactor = 1 - delta * 0.001;
      const newZoom = clampZoom(prev.zoom * zoomFactor);

      const worldX = (mouseX - prev.x) / prev.zoom;
      const worldY = (mouseY - prev.y) / prev.zoom;

      return {
        x: mouseX - worldX * newZoom,
        y: mouseY - worldY * newZoom,
        zoom: newZoom,
      };
    });
  };

  const setZoom = (zoom: number) => {
    setCamera((prev) => ({
      ...prev,
      zoom: clampZoom(zoom),
    }));
  };

  const resetCamera = () => {
    setCamera({
      x: 0,
      y: 0,
      zoom: 1,
    });
  };

  return {
    camera,
    move,
    zoomAt,
    setZoom,
    resetCamera,
  };
}