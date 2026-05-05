import { create } from "zustand";

interface MapState {
  width: number;
  height: number;
  background?: string;

  setSize: (w: number, h: number) => void;
  setBackground: (url: string) => void;
}

export const useMapStore = create<MapState>((set) => ({
  width: 2000,
  height: 1500,
  background: "/mapa.jpg",

  setSize: (width, height) => set({ width, height }),
  setBackground: (background) => set({ background }),
}));