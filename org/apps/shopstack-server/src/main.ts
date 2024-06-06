/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import GoogleAPIService from './services/auth';
import { createServer } from 'http2';

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authMiddleware = (req: Request, res: Response, next: Function) => {
  if (!sheetService.isAuthenticated()) {
    return res.redirect(`${environment.server}/auth`);
  } else {
    next();
  }
};

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to shopstack-server!' });
});

const authClient = new GoogleAPIService();
app.post('/auth', (req, res) => authClient.authenticate.bind(authClient));

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
