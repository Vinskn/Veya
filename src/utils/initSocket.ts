import { io, Socket } from 'socket.io-client';

export const initSocket = (namespace: string) => {
  const socket = io(`${import.meta.env.VITE_SOCKET_URL}/${namespace}`, {
    transports: ['websocket'],
    upgrade: false,
  });
  return socket;
};

const sockets: Record<string, Socket> = {};
const socketOptions = {
  transports: ['websocket'],
  upgrade: false,
};

export const getSocket = (
  namespace: string
) => {

  if (!sockets[namespace]) {
    sockets[namespace] = io(
      `${import.meta.env.VITE_SOCKET_URL}/${namespace}`,
      socketOptions
    );
  }

  return sockets[namespace];
};

export const disconnectSocket = (
  namespace: string
) => {

  sockets[namespace]?.disconnect();
  delete sockets[namespace];

};