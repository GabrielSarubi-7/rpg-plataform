import { useState } from "react";
import { clamp } from "@shared/utils/math";
export function useCamera() {
  const [camera, setCamera] = useState({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const zoomAt = (mouseX: number, mouseY: number, delta: number) => {
    setCamera((prev) => {
      const zoomFactor = 1 - delta * 0.001;

      const newZoom = clamp(prev.zoom * zoomFactor, 0.5, 2.5);

      // posição do mouse no mundo antes do zoom
      const worldX = (mouseX - prev.x) / prev.zoom;
      const worldY = (mouseY - prev.y) / prev.zoom;

      // nova posição da câmera compensada
      const newX = mouseX - worldX * newZoom;
      const newY = mouseY - worldY * newZoom;

      const MAP_WIDTH = 2000;
      const MAP_HEIGHT = 1500;

      return {
        x: newX,
        y: newY,
        zoom: newZoom,
      };
    });
  };

  const move = (dx: number, dy: number) => {
    setCamera((prev) => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };

  return { camera, zoomAt, move };
}
