import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import type { RoomType, TConversar } from './types/index.ts';
import { registerConversar } from './games/Conversar/registerConversar.ts';
import { registerSankhya } from './games/Sankhya/registerSankhya.ts';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

// game list
registerConversar(io);
registerSankhya(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('Server is running on port', PORT, process.env.CLIENT_URL);
});
