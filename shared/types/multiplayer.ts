import type { Token } from "./token";
import type { MapSettings } from "./map";

export interface Player {
  id: string;
  name: string;
}

export interface RoomState {
  code: string;
  players: Player[];
  tokens: Record<string, Token>;
  mapSettings: MapSettings;
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

export interface UpdateMapSettingsPayload {
  roomCode: string;
  settings: MapSettings;
}
