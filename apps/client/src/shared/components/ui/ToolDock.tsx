import styles from "./ToolDock.module.css";

interface DockButton {
  id: string;
  icon: string;
  title: string;
  active?: boolean;
  onClick: () => void;
}

interface Props {
  side: "left" | "right";
  collapsed: boolean;
  onToggleCollapsed: () => void;
  buttons: DockButton[];
}

export default function ToolDock({
  side,
  collapsed,
  onToggleCollapsed,
  buttons,
}: Props) {
  const stopUiEvent = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <aside
      data-ui-layer="true"
      className={`${styles.dock} ${
        side === "left" ? styles.left : styles.right
      } ${collapsed ? styles.collapsed : ""}`}
      onPointerDown={stopUiEvent}
      onPointerMove={stopUiEvent}
      onPointerUp={stopUiEvent}
      onClick={stopUiEvent}
      onWheel={stopUiEvent}
      onContextMenu={stopUiEvent}
    >
      <button
        type="button"
        className={styles.toggleButton}
        onClick={onToggleCollapsed}
        title={collapsed ? "Expandir barra" : "Recolher barra"}
      >
        {collapsed ? "☰" : "☰"}
      </button>

      {buttons.map((button) => (
        <button
          key={button.id}
          type="button"
          className={`${styles.toolButton} ${
            button.active ? styles.toolButtonActive : ""
          }`}
          onClick={button.onClick}
          title={button.title}
        >
          <span className={styles.icon}>{button.icon}</span>
          {!collapsed && <span className={styles.label}>{button.title}</span>}
        </button>
      ))}
    </aside>
  );
}