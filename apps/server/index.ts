import { redisClient, redisConnect } from "./lib/redis";
import { Server } from "socket.io";
import ngrok from "@ngrok/ngrok";
import { ngrokClient } from "./lib/ngrok";

type DataType = {
  destination?: string;
  source?: string;
  data?: string | string[];
};

const io = new Server({ maxHttpBufferSize: 1e9 });

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("register", async (clientID: string) => {
    try {
      await redisClient.set(String(clientID as string), String(socket.id));
      console.log(`Client registered: ${clientID}`);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("devices", async () => {
    const devices = await redisClient.keys("*");
    socket.emit("listingDevices", devices);
  });

  socket.on("ls", async (data) => {
    const { destination } = data;
    const clientSessionId = await redisClient.get(destination);
    socket.to(clientSessionId as string).emit("ls", data);
  });

  socket.on("listingDirectory", (data) => {
    console.log("listing");
    io.emit("listingDirectory", data);
  });

  socket.on("cd", async (data) => {
    const { destination } = data;
    const clientSessionId = await redisClient.get(destination);
    io.to(clientSessionId as string).emit("cd", data);
  });

  socket.on("changingDirectory", (data) => {
    console.log("changing");
    io.emit("changingDirectory", data);
  });

  socket.on("get", async (data) => {
    const { destination } = data;
    const clientSessionId = await redisClient.get(destination);
    io.to(clientSessionId as string).emit("get", data);
  });

  socket.on("downloading", (data) => {
    console.log("downloading");
    io.emit("downloading", data);
  });
});

io.listen(4000, { cors: { origin: "*" } });
redisConnect();
ngrokClient();
