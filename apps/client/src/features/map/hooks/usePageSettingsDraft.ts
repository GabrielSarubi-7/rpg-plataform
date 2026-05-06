import { useEffect, useMemo, useRef, useState } from "react";
import { socket } from "@/core/socket/socket";
import { useLobbyStore } from "@/features/lobby/store/lobbyStore";
import { useMapStore } from "../store/mapStore";
import { loadLocalImage, revokeObjectUrl } from "../utils/imageFile";

import {
  getGridSizeFromImage,
  getMapPixelSize,
  normalizeMapSettings,
} from "@shared/rules/mapRules";

export function usePageSettingsDraft(isOpen: boolean) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const temporaryImageRef = useRef<string | null>(null);

  const lobbyCode = useLobbyStore((s) => s.lobbyCode);

  const pageName = useMapStore((s) => s.pageName);
  const widthCells = useMapStore((s) => s.widthCells);
  const heightCells = useMapStore((s) => s.heightCells);
  const cellSize = useMapStore((s) => s.cellSize);
  const backgroundImage = useMapStore((s) => s.backgroundImage);
  const backgroundImageWidth = useMapStore((s) => s.backgroundImageWidth);
  const backgroundImageHeight = useMapStore((s) => s.backgroundImageHeight);
  const setMapSettings = useMapStore((s) => s.setMapSettings);

  const [draftPageName, setDraftPageName] = useState(pageName);
  const [draftWidthCells, setDraftWidthCells] = useState(widthCells);
  const [draftHeightCells, setDraftHeightCells] = useState(heightCells);
  const [draftCellSize, setDraftCellSize] = useState(cellSize);
  const [draftBackgroundImage, setDraftBackgroundImage] = useState(
    backgroundImage ?? "",
  );

  const [draftImageSize, setDraftImageSize] = useState<{
    width: number;
    height: number;
  } | null>(
    backgroundImageWidth && backgroundImageHeight
      ? { width: backgroundImageWidth, height: backgroundImageHeight }
      : null,
  );

  useEffect(() => {
    if (!isOpen) return;

    setDraftPageName(pageName);
    setDraftWidthCells(widthCells);
    setDraftHeightCells(heightCells);
    setDraftCellSize(cellSize);
    setDraftBackgroundImage(backgroundImage ?? "");

    setDraftImageSize(
      backgroundImageWidth && backgroundImageHeight
        ? { width: backgroundImageWidth, height: backgroundImageHeight }
        : null,
    );
  }, [
    isOpen,
    pageName,
    widthCells,
    heightCells,
    cellSize,
    backgroundImage,
    backgroundImageWidth,
    backgroundImageHeight,
  ]);

  useEffect(() => {
    return () => {
      revokeObjectUrl(temporaryImageRef.current ?? undefined);
    };
  }, []);

  const imageGridSuggestion = useMemo(() => {
    if (!draftImageSize) return null;

    return getGridSizeFromImage(
      draftImageSize.width,
      draftImageSize.height,
      draftCellSize,
    );
  }, [draftImageSize, draftCellSize]);

  const preview = useMemo(() => {
    const settings = normalizeMapSettings({
      pageName: draftPageName,
      widthCells: draftWidthCells,
      heightCells: draftHeightCells,
      cellSize: draftCellSize,
      backgroundImage: draftBackgroundImage,
      backgroundImageWidth: draftImageSize?.width,
      backgroundImageHeight: draftImageSize?.height,
    });

    return {
      settings,
      size: getMapPixelSize(settings),
    };
  }, [
    draftPageName,
    draftWidthCells,
    draftHeightCells,
    draftCellSize,
    draftBackgroundImage,
    draftImageSize,
  ]);

  const shouldShowFitImageOption =
    !!imageGridSuggestion &&
    (imageGridSuggestion.widthCells !== preview.settings.widthCells ||
      imageGridSuggestion.heightCells !== preview.settings.heightCells);

  const chooseBackgroundImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const image = await loadLocalImage(file);

    revokeObjectUrl(temporaryImageRef.current ?? undefined);
    temporaryImageRef.current = image.url;

    setDraftBackgroundImage(image.url);
    setDraftImageSize({
      width: image.width,
      height: image.height,
    });
  };

  const removeBackgroundImage = () => {
    revokeObjectUrl(temporaryImageRef.current ?? undefined);
    temporaryImageRef.current = null;

    setDraftBackgroundImage("");
    setDraftImageSize(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const applyImageSizeToGrid = () => {
    if (!imageGridSuggestion) return;

    setDraftWidthCells(imageGridSuggestion.widthCells);
    setDraftHeightCells(imageGridSuggestion.heightCells);
  };

  const apply = () => {
    setMapSettings(preview.settings);

    if (lobbyCode) {
      socket.emit("map:settings:update", {
        roomCode: lobbyCode,
        settings: preview.settings,
      });
    }
  };

  return {
    fileInputRef,

    draftPageName,
    draftWidthCells,
    draftHeightCells,
    draftCellSize,
    draftBackgroundImage,
    draftImageSize,

    setDraftPageName,
    setDraftWidthCells,
    setDraftHeightCells,
    setDraftCellSize,

    preview,
    imageGridSuggestion,
    shouldShowFitImageOption,

    chooseBackgroundImage,
    removeBackgroundImage,
    applyImageSizeToGrid,
    apply,
  };
}