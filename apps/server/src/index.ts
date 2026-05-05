import { createServer } from "http";
import { Server } from "socket.io";
import { randomUUID } from "crypto";

import type {
  RoomState,
  CreateRoomPayload,
  JoinRoomPayload,
  AddTokenPayload,
  MoveTokenPayload,
  UpdateTokenImagePayload,
  Player,
} from "@shared/types/multiplayer";

import type {
  ChatMessage,
  SendChatMessagePayload,
} from "@shared/types/chat";

const PORT = 3001;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const rooms: Record<string, RoomState> = {};
const chatMessages: Record<string, ChatMessage[]> = {};

function createRoomCode() {
  let code = "";

  do {
    code = Math.random().toString(36).slice(2, 8).toUpperCase();
  } while (rooms[code]);

  return code;
}

function getRoom(code: string) {
  return rooms[code.toUpperCase()];
}

io.on("connection", (socket) => {
  console.log("Conectado:", socket.id);

  socket.on("room:create", (payload: CreateRoomPayload, callback) => {
    const playerName = payload.playerName?.trim();

    if (!playerName) {
      callback?.({
        ok: false,
        error: "Nome inválido.",
      });
      return;
    }

    const code = createRoomCode();

    const player: Player = {
      id: socket.id,
      name: playerName,
    };

    rooms[code] = {
      code,
      players: [player],
      tokens: {},
    };

    chatMessages[code] = [];

    socket.join(code);

    callback?.({
      ok: true,
      room: rooms[code],
      playerId: socket.id,
    });

    socket.emit("chat:history", chatMessages[code]);

    io.to(code).emit("room:state", rooms[code]);

    console.log(`Lobby criado: ${code} por ${playerName}`);
  });

  socket.on("room:join", (payload: JoinRoomPayload, callback) => {
    const roomCode = payload.roomCode?.trim().toUpperCase();
    const playerName = payload.playerName?.trim();

    if (!roomCode || !playerName) {
      callback?.({
        ok: false,
        error: "Dados inválidos.",
      });
      return;
    }

    const room = getRoom(roomCode);

    if (!room) {
      callback?.({
        ok: false,
        error: "Lobby não encontrado.",
      });
      return;
    }

    const alreadyInRoom = room.players.some((p) => p.id === socket.id);

    if (!alreadyInRoom) {
      room.players.push({
        id: socket.id,
        name: playerName,
      });
    }

    socket.join(roomCode);

    callback?.({
      ok: true,
      room,
      playerId: socket.id,
    });

    socket.emit("chat:history", chatMessages[roomCode] ?? []);

    io.to(roomCode).emit("room:state", room);

    console.log(`${playerName} entrou no lobby ${roomCode}`);
  });

  socket.on("token:add", (payload: AddTokenPayload) => {
    const room = getRoom(payload.roomCode);
    if (!room) return;

    room.tokens[payload.token.id] = payload.token;

    io.to(room.code).emit("room:state", room);
  });

  socket.on("token:move", (payload: MoveTokenPayload) => {
    const room = getRoom(payload.roomCode);
    if (!room) return;

    const token = room.tokens[payload.tokenId];
    if (!token) return;

    token.x = payload.x;
    token.y = payload.y;

    socket.to(room.code).emit("token:moved", {
      tokenId: payload.tokenId,
      x: payload.x,
      y: payload.y,
    });
  });

  socket.on("token:image:update", (payload: UpdateTokenImagePayload) => {
    const room = getRoom(payload.roomCode);
    if (!room) return;

    const token = room.tokens[payload.tokenId];
    if (!token) return;

    token.image = payload.image;

    io.to(room.code).emit("room:state", room);
  });

  socket.on("chat:send", (payload: SendChatMessagePayload) => {
    const roomCode = payload.roomCode?.trim().toUpperCase();
    const text = payload.text?.trim();

    if (!roomCode || !text) return;

    const room = getRoom(roomCode);
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);

    const message: ChatMessage = {
      id: randomUUID(),
      roomCode,
      playerId: socket.id,
      playerName: player?.name ?? payload.playerName ?? "Jogador",
      text,
      createdAt: Date.now(),
    };

    if (!chatMessages[roomCode]) {
      chatMessages[roomCode] = [];
    }

    chatMessages[roomCode].push(message);

    io.to(roomCode).emit("chat:message", message);
  });

  socket.on("disconnect", () => {
    for (const room of Object.values(rooms)) {
      const wasInRoom = room.players.some((p) => p.id === socket.id);

      if (!wasInRoom) continue;

      room.players = room.players.filter((p) => p.id !== socket.id);

      io.to(room.code).emit("room:state", room);

      if (room.players.length === 0) {
        delete rooms[room.code];
        delete chatMessages[room.code];

        console.log(`Lobby removido: ${room.code}`);
      }
    }

    console.log("Desconectado:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});