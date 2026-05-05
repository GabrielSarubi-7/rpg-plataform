import { createServer } from "http";
import { Server } from "socket.io";
import { MoveTokenPayload } from "@shared/types";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

let tokens: Record<string, { x: number; y: number }> = {};

io.on("connection", (socket) => {
  console.log("Player conectado:", socket.id);

  socket.emit("init", tokens);

  socket.on("moveToken", (data: MoveTokenPayload) => {
    tokens[data.tokenId] = { x: data.x, y: data.y };
    io.emit("tokenMoved", data);
  });

  socket.on("disconnect", () => {
    console.log("Player saiu:", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});