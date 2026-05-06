import { socket } from "@/core/socket/socket";
import type { MapSettings } from "@shared/types/map";

export function emitMapSettingsUpdate(
  roomCode: string,
  settings: MapSettings,
) {
  socket.emit("map:settings:update", {
    roomCode,
    settings,
  });
}