import type { Token } from "./token";

export interface Player {
  id: string;
  name: string;
}

export interface RoomState {
  code: string;
  players: Player[];
  tokens: Record<string, Token>;
}

export interface CreateRoomPayload {
  playerName: string;
}

export interface JoinRoomPayload {
  roomCode: string;
  playerName: string;
}

export interface AddTokenPayload {
  roomCode: string;
  token: Token;
}

export interface MoveTokenPayload {
  roomCode: string;
  tokenId: string;
  x: number;
  y: number;
}

export interface UpdateTokenImagePayload {
  roomCode: string;
  tokenId: string;
  image: string;
}