import { useState } from "react";
import ContextMenu from "../../components/ContextMenu";
import Grid from "./components/Grid";
import Token from "../tokens/components/Token";
import { useTokenStore } from "../tokens/store/tokenStore";
import { useCamera } from "./hooks/useCamera";
import { useMapInput } from "./hooks/useMapInput";
import { useTokenDrag } from "./hooks/useTokenDrag";
import GridHighlight from "./components/GridHighlight";
import MapBackground from "./components/MapBackground";
import { useMapStore } from "./store/mapStore";
import { clamp } from "../../shared/utils/math";
export default function MapCanvas() {
  const tokens = useTokenStore((s) => s.tokens);
  const addTokenAt = useTokenStore((s) => s.addTokenAt);
  const moveToken = useTokenStore((s) => s.moveToken);

  const { camera, zoomAt, move } = useCamera();

  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

  const input = useMapInput(camera, move, addTokenAt);
  const tokenDrag = useTokenDrag(camera, moveToken);

  const width = useMapStore((s) => s.width);
  const height = useMapStore((s) => s.height);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    input.onMouseUp();
    tokenDrag.stopDrag();
    setMenu({ x: e.clientX, y: e.clientY });
  };

  const handleAddToken = () => {
    if (!menu) return;

    const worldX = (menu.x - camera.x) / camera.zoom;
    const worldY = (menu.y - camera.y) / camera.zoom;

    const x = clamp(worldX, 0, width - 40);
    const y = clamp(worldY, 0, height - 40);

    addTokenAt(x, y);

    setMenu(null);
  };

  return (
    <div
      onContextMenu={handleRightClick}
      onPointerDown={(e) => {
        if (e.button !== 0) return;

        setMenu(null);

        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);

        input.onMouseDown(e as any);
      }}
      onPointerMove={(e) => {
        input.onMouseMove(e as any);
        tokenDrag.onMove(e as any);
      }}
      onPointerUp={(e) => {
        e.currentTarget.releasePointerCapture(e.pointerId);

        input.onMouseUp();
        tokenDrag.drop();
        tokenDrag.stopDrag();
      }}
      onWheel={(e) => {
        e.preventDefault();
        zoomAt(e.clientX, e.clientY, e.deltaY);
        input.onWheel(e);
      }}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#1e1e1e",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* CAMERA */}
      <div
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* MAPA */}

        <div
          style={{
            position: "relative",
            width,
            height,
            background: "#2c2c2c",
          }}
        >
          <MapBackground image="/mapa.jpg" />
          <Grid />
          {tokenDrag.preview && (
            <GridHighlight x={tokenDrag.preview.x} y={tokenDrag.preview.y} />
          )}
          {Object.values(tokens).map((t: any) => (
            <Token
              key={t.id}
              token={t}
              onMouseDown={(e: any) => {
                e.stopPropagation();
                tokenDrag.startDrag(t.id);
              }}
            />
          ))}
        </div>
      </div>

      {menu && (
        <ContextMenu x={menu.x} y={menu.y} onAddToken={handleAddToken} />
      )}
    </div>
  );
}
