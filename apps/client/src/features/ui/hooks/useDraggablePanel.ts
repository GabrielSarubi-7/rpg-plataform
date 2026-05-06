import { useRef } from "react";
import { useUiStore, type PanelId } from "../store/uiStore";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function useDraggablePanel(
  panelId: PanelId,
  width: number,
  height: number,
) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const panel = useUiStore((s) => s.panels[panelId]);
  const setPanelPosition = useUiStore((s) => s.setPanelPosition);

  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const onHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dragOffsetRef.current = {
      x: e.clientX - panel.x,
      y: e.clientY - panel.y,
    };

    const onMove = (event: PointerEvent) => {
      const maxX = Math.max(8, window.innerWidth - width - 8);
      const maxY = Math.max(8, window.innerHeight - height - 8);

      const nextX = clamp(
        event.clientX - dragOffsetRef.current.x,
        8,
        maxX,
      );

      const nextY = clamp(
        event.clientY - dragOffsetRef.current.y,
        8,
        maxY,
      );

      setPanelPosition(panelId, nextX, nextY);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return {
    panelRef,
    onHeaderPointerDown,
  };
}