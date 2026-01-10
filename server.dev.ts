// server.dev.ts
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = Number(process.env.SOCKET_PORT ?? 4000);

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("ping", (payload) => {
    console.log("ping from client:", payload);
    socket.emit("pong", { time: Date.now() });
  });

  socket.on("broadcast-content-update", (payload) => {
    // admin can emit this after saving content to notify public clients
    io.emit("content-updated", payload);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Dev socket server listening on http://localhost:${PORT}`);
});
