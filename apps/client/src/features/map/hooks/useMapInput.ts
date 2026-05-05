import { useRef } from "react";
import { screenToWorld } from "../utils/coords";

export function useMapInput(camera: any, moveCamera: any, onAddToken: any) {
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;

    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    last.current = { x: e.clientX, y: e.clientY };

    moveCamera(dx, dy);
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
  };

  const handleAddToken = (screenX: number, screenY: number) => {
    const world = screenToWorld(screenX, screenY, camera);
    onAddToken(world.x, world.y);
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    handleAddToken,
  };
}
