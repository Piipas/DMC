import chalk from "chalk";
import readline from "readline";
import io from "socket.io-client";

const commandRegex = new RegExp(/^[A-z0-9]{1,255}$/g);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  let clientId = null;
  console.log(chalk.green("Connected to server"));

  socket.on("list", (data) => {
    console.log("wsslni");
  });

  rl.on("line", (input) => {
    const args = input.split(" ");
    console.log(args);
    if (args[0] === "ls") socket.emit("ls");
    else if (args[0] === "cd" && args.length >= 2) socket.emit("cd", args[1]);
    else if (args[0] === "get" && args.length >= 2) socket.emit("get", args[1]);
    else console.log("Invalid command or Insufficient arguments!");
  });
});
