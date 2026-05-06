import { create } from "zustand";
import type { MapSettings } from "@shared/types/map";
import {
  DEFAULT_MAP_SETTINGS,
  getMapPixelSize,
  normalizeMapSettings,
} from "@shared/rules/mapRules";

interface MapStore extends MapSettings {
  width: number;
  height: number;

  setMapSettings: (settings: Partial<MapSettings>) => void;
}

function buildMapState(settings: MapSettings) {
  const size = getMapPixelSize(settings);

  return {
    ...settings,
    width: size.width,
    height: size.height,
  };
}

export const useMapStore = create<MapStore>((set) => ({
  ...buildMapState(DEFAULT_MAP_SETTINGS),

  setMapSettings: (settings) => {
    const normalized = normalizeMapSettings(settings);

    set({
      ...buildMapState(normalized),
    });
  },
}));