import chalk from "chalk";
import readline from "readline";
import io from "socket.io-client";
import fs from "fs/promises";

const commandRegex = new RegExp(/^[A-z0-9]{1,255}$/g);
let devices: string[] = [];
let currentDirectoryContent: Files[] = [];
let pwd = "";

type DataType = {
  destination?: string;
  source?: string;
  data?: string | string[];
};

type Files = {
  name: string;
  type: string;
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  prompt: "/>",
});

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log(chalk.green("Connected to server"));
  socket.emit("devices");
});

socket.on("listingDevices", (devicesIDs: string[]) => {
  devices = devicesIDs;
  console.log("- devices:");
  devicesIDs.map((device, i) => console.log(`${chalk.red(i + 1)}. ${device}`));

  rl.question("\nchoose a device to control: ", (deviceOrder) => {
    const deviceID = devices[Number(deviceOrder) - 1];

    console.log(`Connected to the device with id: ${chalk.green(deviceID)}\n`);

    socket.on("listingDirectory", ({ data }: { data: { currentDirectory: string; content: any[] } }) => {
      console.log(`${chalk.blue("◉ ")} ..`);
      data.content?.map((file) =>
        console.log(`${file.type === "-" ? chalk.blue("◉ ") : chalk.red("◉ ")} ${file.name}`),
      );
      currentDirectoryContent = data.content;
      pwd = data.currentDirectory;
      rl.prompt();
    });

    socket.on("changingDirectory", ({ data }: { data: { currentDirectory: string; content: any[] } }) => {
      currentDirectoryContent = data.content ? data.content : currentDirectoryContent;
      pwd = data.currentDirectory ? data.currentDirectory : pwd;
      rl.prompt();
    });

    socket.on("downloading", async ({ data }: { data: { name: string; file: any } }) => {
      try {
        await fs.writeFile(`./uploads/${data.name}`, data.file, "base64");
      } catch (error) {
        console.log(error);
      }
      rl.prompt();
    });

    rl.on("line", (input) => {
      const args = input.split(" ");
      const command = args[0];

      switch (command) {
        case "ls":
          socket.emit("ls", { destination: deviceID, data: pwd });
          break;
        case "pwd":
          console.log(pwd);
          break;
        case "cd":
          const item = currentDirectoryContent.find((file) => file.name === args[1]);
          if (args[1] === "..")
            socket.emit("cd", { destination: deviceID, data: pwd.split("/").slice(0, -1).join("/") });
          else if (item && item.type === "d") socket.emit("cd", { destination: deviceID, data: `${pwd}/${args[1]}` });
          else console.log("Undefined path or permission required!");
          break;
        case "get":
          socket.emit("get", { destination: deviceID, data: `${pwd}/${args[1]}` });
          break;
        default:
          console.log("Invalid command or Insufficient arguments!");
      }
    });
  });
});

socket.on("connect_error", (err) => {
  console.error(chalk.red("Connection error:"), err);
});

socket.on("error", (err) => {
  console.error(chalk.red("Error:"), err);
});
