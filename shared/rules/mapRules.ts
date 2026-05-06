import type { MapSettings } from "../types/map";

export const DEFAULT_MAP_SETTINGS: MapSettings = {
  pageName: "Nova página",
  widthCells: 40,
  heightCells: 40,
  cellSize: 40,
  backgroundImage: "/mapa.jpg",
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function normalizeMapSettings(input: Partial<MapSettings>): MapSettings {
  const widthCells = clamp(
    Math.floor(Number(input.widthCells) || DEFAULT_MAP_SETTINGS.widthCells),
    1,
    500,
  );

  const heightCells = clamp(
    Math.floor(Number(input.heightCells) || DEFAULT_MAP_SETTINGS.heightCells),
    1,
    500,
  );

  const cellSize = clamp(
    Math.floor(Number(input.cellSize) || DEFAULT_MAP_SETTINGS.cellSize),
    20,
    200,
  );

  let backgroundImage: string | undefined;

  if (input.backgroundImage === undefined) {
    backgroundImage = DEFAULT_MAP_SETTINGS.backgroundImage;
  } else {
    const trimmed = input.backgroundImage.trim();
    backgroundImage = trimmed.length > 0 ? trimmed : undefined;
  }

  return {
    pageName: input.pageName?.trim() || DEFAULT_MAP_SETTINGS.pageName,
    widthCells,
    heightCells,
    cellSize,
    backgroundImage,
    backgroundImageWidth: input.backgroundImageWidth,
    backgroundImageHeight: input.backgroundImageHeight,
  };
}

export function getMapPixelSize(settings: MapSettings) {
  return {
    width: settings.widthCells * settings.cellSize,
    height: settings.heightCells * settings.cellSize,
  };
}

export function getGridSizeFromImage(
  imageWidth: number,
  imageHeight: number,
  cellSize: number,
) {
  return {
    widthCells: Math.max(1, Math.round(imageWidth / cellSize)),
    heightCells: Math.max(1, Math.round(imageHeight / cellSize)),
  };
}
