import type { checkAnswerResult, SankhyaStorage, startGameData, StartGamePayload } from '../../types/SankhyaType.js';
import { questionMaker } from './questionMaker.js';

const sankhyaDataStore: SankhyaStorage = {};
const sankhyaStartGameData: startGameData = {};

// handlers --------------------

// room handlers --------------------
export const getAllRooms = () => {
  return sankhyaDataStore;
};

export const createRoom = (roomID: string, hostID: string) => {
  sankhyaDataStore[roomID] = {
    hostID,
    players: {},
  };
};

export const checkRoomExists = (roomID: string) => {
  return sankhyaDataStore[roomID] !== undefined;
};

export const getRoomData = (roomID: string) => {
  return sankhyaDataStore[roomID];
};

export const deleteRoom = (roomID: string) => {
  delete sankhyaDataStore[roomID];
};

// player handlers --------------------
export const addPlayer = (roomID: string, playerID: string, playerName: string) => {
  sankhyaDataStore[roomID].players[playerID] = {
    playerName,
    playerScore: 0,
  };
};

export const getPlayerName = (roomID: string, playerID: string) => {
  return sankhyaDataStore[roomID].players[playerID].playerName || '';
};

export const removePlayer = (roomID: string, playerID: string) => {
  if (sankhyaDataStore[roomID].players[playerID]) {
    delete sankhyaDataStore[roomID].players[playerID];
  }
};

export const getRoomHost = (roomID: string) => {
  return sankhyaDataStore[roomID].hostID;
};

export const isUserExist = (roomID: string, userID: string): boolean => {
  const userList = sankhyaDataStore[roomID].players[userID];
  if (userList) {
    return true;
  }
  return false;
};

// game handlers --------------------
export const startGame = (data: StartGamePayload) => {
  if (sankhyaStartGameData[data.roomName]) return;

  sankhyaStartGameData[data.roomName] = {
    gameQuestions: questionMaker({
      noQuestion: data.noQuestions,
      difficulty: data.difficulty,
    }),
    currentQuestionIndex: 0,
    totalQuestion: data.noQuestions,
  };
};

export const getCurrentQuestion = (roomID: string) => {
  return sankhyaStartGameData[roomID].gameQuestions?.[sankhyaStartGameData[roomID].currentQuestionIndex].theQuestion;
};

export const checkAnswer = (roomID: string, playerID: string, answer: number): checkAnswerResult => {
  const roomData = sankhyaStartGameData[roomID];
  const indexNo = roomData.currentQuestionIndex;
  const question = roomData.gameQuestions?.[indexNo];
  const questionTotal = roomData.gameQuestions?.length;
  const playerName = getPlayerName(roomID, playerID);

  if (question?.theAnswer === answer) {
    sankhyaDataStore[roomID].players[playerID].playerScore++;
    if (indexNo === questionTotal! - 1) {
      return { playerID, playerName, isCorrect: true, nextQuestionIndex: indexNo, isGameEnd: true };
    }
    roomData.currentQuestionIndex++;

    return { playerID, playerName, isCorrect: true, nextQuestionIndex: indexNo + 1, isGameEnd: false };
  }
  return { playerID, playerName, isCorrect: false, nextQuestionIndex: indexNo, isGameEnd: false };
};

export const endGame = (roomID: string): { winner: string; score: number; totalQuestion: number; players: { name: string; score: number }[] } => {
  const roomData = sankhyaDataStore[roomID];
  const totalQuestion = sankhyaStartGameData[roomID].totalQuestion;
  const players = roomData.players;

  const playersList = Object.values(players)
    .map((p) => ({
      name: p.playerName,
      score: p.playerScore,
    }))
    .sort((a, b) => b.score - a.score);

  const winner = playersList[0] || { name: '', score: 0 };

  delete sankhyaStartGameData[roomID];
  delete sankhyaDataStore[roomID];
  return {
    winner: winner.name,
    score: winner.score,
    totalQuestion,
    players: playersList,
  };
};
