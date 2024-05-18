import io from "socket.io-client";
import IP from "react-native-public-ip";

export const socket = io("http://192.168.50.69:4000", {
  transports: ["websocket"],
});

export const webSocketClient = async () => {
  const publicIP = await IP();

  socket.on("connect", () => {
    console.log("Connected to server at http://192.168.50.69:4000");
    socket.emit("introduction", publicIP);
  });

  socket.on("ls", (data) => {
    console.log(data, "listing files.");
    socket.emit("listing", { node: publicIP, files: [] });
  });

  socket.on("get", (data) => {
    console.log(data, "sending files to the panel device.");
    socket.emit("downloading", { node: publicIP, files: [] });
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", JSON.stringify(error));
  });

  socket.on("disconnect", (reason) => {
    console.log("Disconnected from the server:", reason);
  });
};
