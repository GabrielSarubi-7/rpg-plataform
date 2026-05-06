import { useRef, useState } from "react";
import { screenToWorld } from "../utils/coords";
import {
  clampTokenToMap,
  snapTokenToGrid,
} from "@shared/rules/tokenRules";

interface Camera {
  x: number;
  y: number;
  zoom: number;
}

interface TokenData {
  id: string;
  x: number;
  y: number;
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
  mapHeight: number,
  cellSize: number,
) {
  const draggingId = useRef<string | null>(null);

  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);

  const startDrag = (
    token: TokenData,
    e: React.PointerEvent | React.MouseEvent,
  ) => {
    draggingId.current = token.id;

    const world = screenToWorld(e.clientX, e.clientY, camera);

    dragOffset.current = {
      x: world.x - token.x,
      y: world.y - token.y,
    };

    setPreview({
      x: token.x,
      y: token.y,
    });
  };

  const onMove = (e: React.PointerEvent | React.MouseEvent) => {
    if (!draggingId.current) return;

    const world = screenToWorld(e.clientX, e.clientY, camera);

    const rawX = world.x - dragOffset.current.x;
    const rawY = world.y - dragOffset.current.y;

    const snapped = snapTokenToGrid(rawX, rawY, cellSize);

    const clamped = clampTokenToMap(
      snapped.x,
      snapped.y,
      mapWidth,
      mapHeight,
      cellSize,
    );

    setPreview(clamped);
  };

  const drop = (): DropResult | null => {
    if (!draggingId.current || !preview) return null;

    const dropped = {
      tokenId: draggingId.current,
      x: preview.x,
      y: preview.y,
    };

    moveToken(dropped.tokenId, dropped.x, dropped.y);

    return dropped;
  };

  const stopDrag = () => {
    draggingId.current = null;
    dragOffset.current = { x: 0, y: 0 };
    setPreview(null);
  };

  return {
    startDrag,
    onMove,
    drop,
    stopDrag,
    preview,
  };
}