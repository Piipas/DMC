import { createClient } from "redis";
import { Server } from "socket.io";

const io = new Server();
const redisClient = createClient();

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("introduction", (data) => {
    console.log(data);
  });

  socket.on("list", (data) => {
    io.emit("list", data);
    console.log("yow");
  });
  socket.on("changeDirectory", (data) => io.emit("changeDirectory", data));
  socket.on("download", (data) => io.emit("download", data));
});

io.listen(4000);
redisClient.connect();
