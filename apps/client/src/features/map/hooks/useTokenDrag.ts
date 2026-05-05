import { useRef, useState } from "react";
import { screenToWorld } from "../../map/utils/coords";
import { snapToGrid } from "../../map/utils/grid";

export function useTokenDrag(camera: any, moveToken: any) {
  const draggingId = useRef<string | null>(null);
  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);

  const startDrag = (id: string) => {
    draggingId.current = id;
  };

  const stopDrag = () => {
    draggingId.current = null;
    setPreview(null);
  };

  const onMove = (e: React.MouseEvent) => {
    if (!draggingId.current) return;

    const world = screenToWorld(e.clientX, e.clientY, camera);
    const snapped = snapToGrid(world.x, world.y);

    setPreview(snapped);
  };

  const drop = () => {
    if (!draggingId.current || !preview) return;

    moveToken(draggingId.current, preview.x, preview.y);
  };

  return {
    startDrag,
    stopDrag,
    onMove,
    drop,
    preview
  };
}