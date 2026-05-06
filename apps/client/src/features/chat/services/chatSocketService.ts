import { socket } from "@/core/socket/socket";

export function emitChatMessage(
  roomCode: string,
  playerName: string,
  text: string,
) {
  socket.emit("chat:send", {
    roomCode,
    playerName,
    text,
  });
}