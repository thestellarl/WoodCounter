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

const authClient = new GoogleAPIService();
app.get('/auth', (req, res) => {
  res.redirect(authClient.authenticate(req.query.callbackUrl as string));
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
