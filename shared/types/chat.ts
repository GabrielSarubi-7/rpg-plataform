export interface ChatMessage {
  id: string;
  roomCode: string;
  playerId: string;
  playerName: string;
  text: string;
  createdAt: number;
}

export interface SendChatMessagePayload {
  roomCode: string;
  playerName: string;
  text: string;
}