import { create } from "zustand";

export type PanelId = "dice" | "pageSettings";

interface PanelState {
  open: boolean;
  x: number;
  y: number;
}

interface UiStore {
  leftDockCollapsed: boolean;
  panels: Record<PanelId, PanelState>;

  toggleDock: () => void;
  togglePanel: (panelId: PanelId) => void;
  closePanel: (panelId: PanelId) => void;
  setPanelPosition: (panelId: PanelId, x: number, y: number) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  leftDockCollapsed: false,

  panels: {
    dice: {
      open: false,
      x: 72,
      y: 80,
    },
    pageSettings: {
      open: false,
      x: 72,
      y: 120,
    },
  },

  toggleDock: () =>
    set((state) => ({
      leftDockCollapsed: !state.leftDockCollapsed,
    })),

  togglePanel: (panelId) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panelId]: {
          ...state.panels[panelId],
          open: !state.panels[panelId].open,
        },
      },
    })),

  closePanel: (panelId) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panelId]: {
          ...state.panels[panelId],
          open: false,
        },
      },
    })),

  setPanelPosition: (panelId, x, y) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panelId]: {
          ...state.panels[panelId],
          x,
          y,
        },
      },
    })),
}));