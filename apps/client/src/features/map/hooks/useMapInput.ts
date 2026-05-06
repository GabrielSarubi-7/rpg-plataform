import { useRef } from "react";

interface Camera {
  x: number;
  y: number;
  zoom: number;
}

type MoveCamera = (dx: number, dy: number) => void;

export function useMapInput(
  _camera: Camera,
  move: MoveCamera,
  _addTokenAt: (x: number, y: number) => void,
) {
  const isPanning = useRef(false);
  const lastMouse = useRef({
    x: 0,
    y: 0,
  });

  const onMouseDown = (e: React.PointerEvent | React.MouseEvent) => {
    if (e.button !== 0) return;

    isPanning.current = true;

    lastMouse.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const onMouseMove = (e: React.PointerEvent | React.MouseEvent) => {
    if (!isPanning.current) return;

    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;

    lastMouse.current = {
      x: e.clientX,
      y: e.clientY,
    };

    move(dx, dy);
  };

  const onMouseUp = () => {
    isPanning.current = false;
  };

  const onWheel = () => {};

  const handleAddToken = () => {};

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    handleAddToken,
  };
}