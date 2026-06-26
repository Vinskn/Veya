import { Server, Socket } from 'socket.io';
import { addPlayer, checkAnswer, checkRoomExists, createRoom, deleteRoom, endGame, getAllRooms, getCurrentQuestion, getPlayerName, getRoomData, getRoomHost, isUserExist, startGame } from './dataStore';
import type { JoinRoomPayload, StartGamePayload } from '../../types/SankhyaType';

export const registerSankhya = (io: Server) => {
  const nsp = io.of('/sankhya');
  nsp.on('connection', (socket: Socket) => {
    console.log('a user connected to /sankhya', socket.id);

    // join room
    socket.on('join_room', (data: JoinRoomPayload) => {
      if (checkRoomExists(data.roomName)) {
        const checkExistPlayer = isUserExist(data.roomName, socket.id);
        if (checkExistPlayer) {
          console.log('Player is in the room');
          return;
        }
        console.log(`Room ${data.roomName} exists, adding ${socket.id} as player`);
        addPlayer(data.roomName, socket.id, data.playerName);
      } else {
        console.log(`Room ${data.roomName} does not exist, creating and assign host ${socket.id}`);
        createRoom(data.roomName, socket.id);
        addPlayer(data.roomName, socket.id, data.playerName);
      }

      socket.join(data.roomName);
    });

    // get list of users in the room
    socket.on('user_list', async (roomName: string) => {
      try {
        const users = await nsp.in(roomName).fetchSockets();
        const tes = users.map((u) => u.id);

        const userList = users.map((user) => {
          return {
            id: user.id,
            name: getPlayerName(roomName, user.id),
          };
        });
        nsp.to(roomName).emit('user_list', userList);
      } catch (error) {
        console.log(error);
      }
    });

    // get information about the room (specific room including players detail and roomName)
    socket.on('room_info', (roomName: string) => {
      const roomInfo = getRoomData(roomName);
      nsp.to(roomName).emit('room_info', roomInfo);
    });

    // difficulty data
    socket.on('diff_data', (data: StartGamePayload) => {
      nsp.to(data.roomName).emit('diff_data', data);
    });

    // start game
    socket.on('start_game', (data: StartGamePayload) => {
      const hostID = getRoomHost(data.roomName);

      if (hostID !== data.playerID) return;

      startGame(data);
      const question = getCurrentQuestion(data.roomName);
      setTimeout(() => {
        nsp.to(data.roomName).emit('current_question', question);
      }, 1500);
    });

    // start trigger
    socket.on('start_trigger', (data: { start: boolean; roomID: string }) => {
      nsp.to(data.roomID).emit('start_trigger', data);
    });

    // check answer
    socket.on('check_answer', (data: { roomName: string; playerID: string; answer: number }) => {
      const result = checkAnswer(data.roomName, data.playerID, data.answer);
      nsp.to(data.roomName).emit('check_answer', result);

      if (result.isCorrect && !result.isGameEnd) {
        setTimeout(() => {
          const question = getCurrentQuestion(data.roomName);

          nsp.to(data.roomName).emit('current_question', question);
        }, 3000);
      }

      if (result.isGameEnd) {
        const endGameResult = endGame(data.roomName);
        nsp.to(data.roomName).emit('game_end', endGameResult);
      }
    });

    // get all rooms exist -> not for user (debug only)
    socket.on('all_rooms', () => {
      const allRooms = getAllRooms();
      nsp.to(socket.id).emit('all_rooms', allRooms);
    });

    socket.on('disconnecting', () => {
      socket.data.roomName = [...socket.rooms][1];
      console.log('user disconnecting from sankhya');
    });

    socket.on('disconnect', async () => {
      const roomName = socket.data.roomName;

      const users = await nsp.in(roomName).fetchSockets();
      const listUser = users.map((u) => u.id);

      if (listUser.length === 0) {
        deleteRoom(roomName);
      }

      nsp.to(roomName).emit('user_list', listUser);
    });
  });
};
