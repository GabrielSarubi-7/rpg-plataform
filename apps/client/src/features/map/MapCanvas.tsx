import { useRef, useState } from "react";
import ContextMenu from "../../components/ContextMenu";

import Grid from "./components/Grid";
import GridHighlight from "./components/GridHighlight";
import MapBackground from "./components/MapBackground";
import PageSettingsPanel from "./components/PageSettingsPanel";

import Token from "../tokens/components/Token";
import DicePanel from "@/features/dice/components/DicePanel";
import ChatPanel from "@/features/chat/components/ChatPanel";

import ToolDock from "@/shared/components/ui/ToolDock";

import { useTokenStore } from "../tokens/store/tokenStore";
import { useMapStore } from "./store/mapStore";
import { useLobbyStore } from "@/features/lobby/store/lobbyStore";
import { useUiStore } from "@/features/ui/store/uiStore";

import { useCamera } from "./hooks/useCamera";
import { useMapInput } from "./hooks/useMapInput";
import { useTokenDrag } from "./hooks/useTokenDrag";

import {
  clampTokenToMap,
  getTokenPositionFromMouse,
} from "@shared/rules/tokenRules";
import { isEventFromUiLayer } from "@/shared/utils/domEvents";

import {
  emitTokenAdd,
  emitTokenMove,
} from "@/features/tokens/services/tokenSocketService";

export default function MapCanvas() {
  const tokens = useTokenStore((s) => s.tokens);
  const addToken = useTokenStore((s) => s.addToken);
  const moveToken = useTokenStore((s) => s.moveToken);

  const width = useMapStore((s) => s.width);
  const height = useMapStore((s) => s.height);
  const cellSize = useMapStore((s) => s.cellSize);
  const backgroundImage = useMapStore((s) => s.backgroundImage);

  const lobbyCode = useLobbyStore((s) => s.lobbyCode);

  const leftDockCollapsed = useUiStore((s) => s.leftDockCollapsed);
  const toggleDock = useUiStore((s) => s.toggleDock);
  const togglePanel = useUiStore((s) => s.togglePanel);
  const panels = useUiStore((s) => s.panels);

  const { camera, zoomAt, move } = useCamera(width, height);

  const mapRef = useRef<HTMLDivElement>(null);

  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    worldX: number;
    worldY: number;
  } | null>(null);

  const input = useMapInput(camera, move, () => {});
  const tokenDrag = useTokenDrag(camera, moveToken, width, height, cellSize);

  const getWorldPositionFromScreen = (clientX: number, clientY: number) => {
    const mapElement = mapRef.current;

    if (!mapElement) {
      return {
        x: (clientX - camera.x) / camera.zoom,
        y: (clientY - camera.y) / camera.zoom,
      };
    }

    const rect = mapElement.getBoundingClientRect();

    return {
      x: (clientX - rect.left) / camera.zoom,
      y: (clientY - rect.top) / camera.zoom,
    };
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();

    input.onMouseUp();
    tokenDrag.stopDrag();

    const world = getWorldPositionFromScreen(e.clientX, e.clientY);

    setMenu({
      x: e.clientX,
      y: e.clientY,
      worldX: world.x,
      worldY: world.y,
    });
  };

  const handleAddToken = () => {
    if (!menu) return;

    const snapped = getTokenPositionFromMouse(
      menu.worldX,
      menu.worldY,
      cellSize,
    );

    const position = clampTokenToMap(
      snapped.x,
      snapped.y,
      width,
      height,
      cellSize,
    );

    const token = {
      id: crypto.randomUUID(),
      x: position.x,
      y: position.y,
    };

    addToken(token);

    if (lobbyCode) {
      emitTokenAdd(lobbyCode, token);
    }

    setMenu(null);
  };

  return (
    <div
      onContextMenu={(e) => {
        if (isEventFromUiLayer(e)) return;
        handleRightClick(e);
      }}
      onPointerDown={(e) => {
        if (isEventFromUiLayer(e)) return;
        if (e.button !== 0) return;

        setMenu(null);

        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);

        input.onMouseDown(e as any);
      }}
      onPointerMove={(e) => {
        if (isEventFromUiLayer(e)) return;

        input.onMouseMove(e as any);
        tokenDrag.onMove(e as any);
      }}
      onPointerUp={(e) => {
        if (isEventFromUiLayer(e)) return;

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }

        input.onMouseUp();

        const dropped = tokenDrag.drop();

        if (dropped && lobbyCode) {
          emitTokenMove(lobbyCode, dropped.tokenId, dropped.x, dropped.y);
        }

        tokenDrag.stopDrag();
      }}
      onWheel={(e) => {
        if (isEventFromUiLayer(e)) return;

        zoomAt(e.clientX, e.clientY, e.deltaY);
      }}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#1e1e1e",
        userSelect: "none",
        touchAction: "none",
        position: "relative",
      }}
    >
      <div
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
          transformOrigin: "0 0",
        }}
      >
        <div
          ref={mapRef}
          style={{
            position: "relative",
            width,
            height,
            background: "#2c2c2c",
          }}
        >
          <MapBackground image={backgroundImage} />

          <Grid zoom={camera.zoom} cellSize={cellSize} />

          {tokenDrag.preview && (
            <GridHighlight
              x={tokenDrag.preview.x}
              y={tokenDrag.preview.y}
              size={cellSize}
            />
          )}

          {Object.values(tokens).map((token: any) => (
            <Token
              key={token.id}
              token={token}
              size={cellSize}
              onMouseDown={(e) => {
                e.stopPropagation();
                tokenDrag.startDrag(token, e);
              }}
            />
          ))}
        </div>
      </div>

      {menu && (
        <ContextMenu x={menu.x} y={menu.y} onAddToken={handleAddToken} />
      )}

      <ToolDock
        side="left"
        collapsed={leftDockCollapsed}
        onToggleCollapsed={toggleDock}
        buttons={[
          {
            id: "dice",
            icon: "🎲",
            title: "Dados",
            active: panels.dice.open,
            onClick: () => togglePanel("dice"),
          },
          {
            id: "pageSettings",
            icon: "⚙",
            title: "Página",
            active: panels.pageSettings.open,
            onClick: () => togglePanel("pageSettings"),
          },
        ]}
      />

      <PageSettingsPanel />
      <DicePanel />
      <ChatPanel />
    </div>
  );
}
