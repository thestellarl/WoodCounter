import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import path from "path";
import boardRoutes from "./routes/boardRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import { BoardService } from "./services/boardService";
import { exec } from "child_process";
import { SerialService } from "./services/serialService";

const app = express();
const server = createServer(app);

export const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "../static")));

app.use("/api/boards", boardRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../static/index.html"));
});

const boardService = new BoardService();
const serialService = new SerialService();

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("remove board", async (id: string) => {
    await boardService.removeBoard(id);
    socket.emit("board removed", id);
  });

  socket.on("archive board", async (id: string) => {
    await boardService.archiveBoard(id);
    socket.emit("board removed", id);
  });

  socket.on("shutdown", () => {
    exec("sudo shutdown -h now");
  });
});

boardService.serialService.onData(async (data: Buffer) => {
  await boardService.processSerialData(data);
});

export default app;
