import { createClient } from "redis";
import { Server } from "socket.io";

const io = new Server();
const redisClient = createClient();

const clients: { [key: string]: any } = {};

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("register", (data) => {
    clients[data.clientId] = socket;
    console.log(`Client registered: ${data.clientId}`);
  });

  socket.on("ls", async (data) => {
    const { to, message } = data;
    if (clients[to]) clients[to].emit("ls", { message });
  });

  socket.on("changeDirectory", (data) => io.emit("changeDirectory", data));

  socket.on("download", (data) => io.emit("download", data));
});

io.listen(4000, { cors: { origin: "*" } });
redisClient.connect();
