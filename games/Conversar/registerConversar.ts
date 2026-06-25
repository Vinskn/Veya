import { Server, Socket } from 'socket.io';
import type { RoomType, TConversar } from '../../types/index.ts';

export const registerConversar = (io: Server) => {
  const nsp = io.of('/conversar');

  nsp.on('connection', (socket: Socket) => {
    console.log('User connected to /conversar:', socket.id);

    socket.on('join_room', (data: RoomType) => {
      socket.join(data.roomID);
      console.log(`User ${socket.id} joined room ${data.roomID}`);
    });

    socket.on('send_message', (data: TConversar) => {
      nsp.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from /conversar:', socket.id);
    });
  });
};
