export interface Player {
  id: string;
  name: string;
}

export interface Token {
  id: string;
  x: number;
  y: number;
}

export interface MoveTokenPayload {
  tokenId: string;
  x: number;
  y: number;
}