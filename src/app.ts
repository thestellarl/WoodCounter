import express, { Request, Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import path from "path";
import boardRoutes from "./routes/boardRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import { exec } from "child_process";
import { SerialService } from "./services/serialService";
import { GoogleSheetsService } from "./services/googleSheetsService";
import https from "https";
import fs from "fs";

const app = express();
// const privateKey = fs.readFileSync(
//   path.join(__dirname, "path/to/private.key"),
//   "utf8"
// );
// const certificate = fs.readFileSync(
//   path.join(__dirname, "path/to/certificate.crt"),
//   "utf8"
// );
// const credentials = { key: privateKey, cert: certificate };

const server = createServer(app);

export const io = new Server(server);

// Initialize services
// const boardService = new BoardService();
const serialService = new SerialService();
const sheetService = new GoogleSheetsService("");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authMiddleware = (req: Request, res: Response, next: Function) => {
  if (!sheetService.isAuthenticated()) {
    return res.redirect("/login");
  } else {
    next();
  }
};

app.get("/login", (req: Request, res: Response) => {
  res.redirect(sheetService.authenticate());
});
app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  console.log(code);
  sheetService
    .authCallback(code as string)
    .then(() => {
      res.redirect("/");
    })
    .catch(console.log);
});

app.use(authMiddleware);

app.use("/static", express.static(path.join(__dirname, "../static")));
app.use("/api/boards", boardRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../static/index.html"));
});

serialService.onBoard(async (board) => {
  console.log(board);
});

const socketCallbacks: { [event: string]: any } = {
  // "remove board": async (data: any) =>
  //   await sheetService.removeBoard(data as string),
  // "archive board": async (data: any) =>
  //   await sheetService.archiveBoard(data as string),
  shutdown: () => exec("sudo shutdown -h now"),
};

io.on("connection", (socket) => {
  console.log("User connected");
  Object.keys(socketCallbacks).forEach((event) => {
    socket.on(event, socketCallbacks[event]);
  });
});

export default app;
