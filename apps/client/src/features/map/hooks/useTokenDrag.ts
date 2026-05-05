import { useRef, useState } from "react";
import { screenToWorld } from "../utils/coords";
import { clampTokenToMap, snapToGrid } from "@shared/rules/tokenRules";

interface Camera {
  x: number;
  y: number;
  zoom: number;
}

interface DropResult {
  tokenId: string;
  x: number;
  y: number;
}

export function useTokenDrag(
  camera: Camera,
  moveToken: (id: string, x: number, y: number) => void,
  mapWidth: number,
  mapHeight: number
) {
  const draggingId = useRef<string | null>(null);
  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);

  const startDrag = (id: string) => {
    draggingId.current = id;
  };

  const stopDrag = () => {
    draggingId.current = null;
    setPreview(null);
  };

  const onMove = (e: React.PointerEvent | React.MouseEvent) => {
    if (!draggingId.current) return;

    const world = screenToWorld(e.clientX, e.clientY, camera);
    const snapped = snapToGrid(world.x, world.y);
    const clamped = clampTokenToMap(snapped.x, snapped.y, mapWidth, mapHeight);

    setPreview(clamped);
  };

  const drop = (): DropResult | null => {
    if (!draggingId.current || !preview) return null;

    const result = {
      tokenId: draggingId.current,
      x: preview.x,
      y: preview.y,
    };

    moveToken(result.tokenId, result.x, result.y);

    return result;
  };

  return {
    startDrag,
    stopDrag,
    onMove,
    drop,
    preview,
  };
}