// import io from "socket.io-client";
// import IP from "react-native-public-ip";

// export const webSocketClient = () => {
//   const socket = io("http://localhost:4000");

//   socket.on("connect", () => {
//     console.log("Connected to server at http://192.168.50.69:4000");
//     socket.emit("introduction", IP);
//   });

//   socket.on("ls", (data) => {
//     console.log(data, "listing files.");
//   });

//   socket.on("get", (data) => {
//     console.log(data, "sending files to the panel device.");
//   });

//   socket.on("set", (data) => {
//     console.log(data, "recieving files from the panel device.");
//   });
// };
