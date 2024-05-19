import io from "socket.io-client";

type DataType = {
  destination?: string;
  source?: string;
  data?: string | string[];
};

export const webSocketClient = async (uuid: string) => {
  const socket = io("http://192.168.50.69:4000", {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Connected to server at http://192.168.50.69:4000");
    socket.emit("register", uuid);
  });

  socket.on("ls", (data) => {
    console.log(data, "listing files.");
    socket.emit("listingDirectory", {
      data: ["firstFile.txt", "secondFile.txt"],
    });
  });

  // socket.on("get", (data) => {
  //   console.log(data, "sending files to the panel device.");
  //   socket.emit("downloading", { node: publicIP, files: [] });
  // });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", JSON.stringify(error));
  });

  socket.on("disconnect", (reason) => {
    console.log("Disconnected from the server:", reason);
  });
};
