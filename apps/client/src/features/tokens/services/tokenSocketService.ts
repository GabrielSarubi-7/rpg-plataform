import { socket } from "@/core/socket/socket";
import type { Token } from "@shared/types/token";

export function emitTokenAdd(roomCode: string, token: Token) {
  socket.emit("token:add", {
    roomCode,
    token,
  });
}

export function emitTokenMove(
  roomCode: string,
  tokenId: string,
  x: number,
  y: number,
) {
  socket.emit("token:move", {
    roomCode,
    tokenId,
    x,
    y,
  });
}

export function emitTokenImageUpdate(
  roomCode: string,
  tokenId: string,
  image: string,
) {
  socket.emit("token:image:update", {
    roomCode,
    tokenId,
    image,
  });
}