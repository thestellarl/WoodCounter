import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import path from 'path';
import boardRoutes from './routes/boardRoutes';
import settingsRoutes from './routes/settingsRoutes';
import { exec } from 'child_process';
import { SerialService } from './services/serialService';
import { GoogleService } from './services/googleSheetsService';
import { createServer } from 'http2';
import os from 'os';

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
const googleService = new GoogleService();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/login', (req: Request, res: Response) => {
//   res.redirect(sheetService.authenticate());
// });

const getIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (const alias of iface) {
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
  return '0.0.0.0';
};

const authMiddleware = (req: Request, res: Response, next: Function) => {
  if (!googleService.isAuthenticated()) {
    // return res.redirect(`${environment.server}/auth`);
    return res.redirect(
      `${
        process.env.server
      }/auth?callbackUrl=${getIPAddress()}:3333/oauth2callback`
    );
  } else {
    next();
  }
};

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  console.log(code);
  googleService
    .authCallback(code as string)
    .then(() => {
      res.redirect('/');
    })
    .catch(console.log);
});

// If any resource is requested, check if the user is authenticated
app.use(authMiddleware);

app.use('/auth_ping', (_, res) => res.status(200).send());

app.use('/static', express.static(path.join(__dirname, '../static')));
app.use('/api/boards', boardRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../static/index.html'));
});

serialService.onBoard(async (board) => {
  console.log(board);
});

const socketCallbacks: { [event: string]: any } = {
  // "remove board": async (data: any) =>
  //   await sheetService.removeBoard(data as string),
  // "archive board": async (data: any) =>
  //   await sheetService.archiveBoard(data as string),
  shutdown: () => exec('sudo shutdown -h now'),
};

io.on('connection', (socket) => {
  console.log('User connected');
  Object.keys(socketCallbacks).forEach((event) => {
    socket.on(event, socketCallbacks[event]);
  });
});

export default app;
