import { socket } from "@/core/socket/socket";

interface RollDiceParams {
  roomCode: string;
  playerName: string;
  expression: string;
  isGmRoll: boolean;
}

export function emitDiceRoll(params: RollDiceParams) {
  socket.emit("dice:roll", params);
}