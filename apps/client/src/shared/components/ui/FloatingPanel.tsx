import type { ReactNode } from "react";

import styles from "./FloatingPanel.module.css";

import { useUiStore, type PanelId } from "@/features/ui/store/uiStore";
import { useDraggablePanel } from "@/features/ui/hooks/useDraggablePanel";

interface Props {
  panelId: PanelId;
  title: string;
  width?: number;
  height?: number;
  children: ReactNode;
}

export default function FloatingPanel({
  panelId,
  title,
  width = 420,
  height = 520,
  children,
}: Props) {
  const panel = useUiStore((s) => s.panels[panelId]);
  const closePanel = useUiStore((s) => s.closePanel);

  const drag = useDraggablePanel(panelId, width, height);

  if (!panel.open) return null;

  const stopUiEvent = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={drag.panelRef}
      data-ui-layer="true"
      className={`game-panel ${styles.panel}`}
      style={{
        left: panel.x,
        top: panel.y,
        width,
        height,
      }}
      onPointerDown={stopUiEvent}
      onPointerMove={stopUiEvent}
      onPointerUp={stopUiEvent}
      onClick={stopUiEvent}
      onWheel={stopUiEvent}
      onContextMenu={stopUiEvent}
    >
      <div className={styles.header} onPointerDown={drag.onHeaderPointerDown}>
        <strong className={styles.title}>{title}</strong>

        <button
          className={styles.closeButton}
          onClick={() => closePanel(panelId)}
          type="button"
        >
          ×
        </button>
      </div>

      <div className={`game-scrollbar ${styles.body}`}>{children}</div>
    </div>
  );
}