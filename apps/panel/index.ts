import chalk from "chalk";
import readline from "readline";
import io from "socket.io-client";

const commandRegex = new RegExp(/^[A-z0-9]{1,255}$/g);
let devices: string[] = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log(chalk.green("Connected to server"));

  socket.emit("devices");

  socket.on("listingDirectory", (data) => {
    console.log("wsslatni", data);
    process.exit(1);
  });

  socket.on("listingDevices", (devicesIDs: string[]) => {
    devices = devicesIDs;
    console.log("- devices:");
    devicesIDs.map((device, i) =>
      console.log(`${chalk.red(i + 1)}. ${device}`)
    );

    rl.question("\nchoose a device to control: ", (deviceOrder) => {
      const deviceID = devices[Number(deviceOrder) - 1];

      console.log(
        `Connected to the device with id: ${chalk.green(deviceID)}\n`
      );

      rl.on("line", (input) => {
        const args = input.split(" ");
        const command = args[0];

        switch (command) {
          case "ls":
            socket.emit("ls", { destination: deviceID });
            break;
          case "cd":
            socket.emit("cd", { destination: deviceID, data: args[1] });
            break;
          case "get":
            socket.emit("get", { destination: deviceID, data: args[1] });
            break;
          default:
            console.log("Invalid command or Insufficient arguments!");
        }
      });
    });
  });
});

socket.on("connect_error", (err) => {
  console.error(chalk.red("Connection error:"), err);
});

socket.on("error", (err) => {
  console.error(chalk.red("Error:"), err);
});
