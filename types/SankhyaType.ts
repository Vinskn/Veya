// Data store types configuration
export type SankhyaStorage = Record<roomID, SankhyaDataStorage>;

type SankhyaDataStorage = {
  hostID: string;
  players: Record<playerID, SankhyaPlayerDetail>;
};

type SankhyaPlayerDetail = {
  playerName: string;
  playerScore: number;
};

type playerID = string;

type roomID = string;

type roomName = string;

// Socket events payload types
export type JoinRoomPayload = {
  roomName: string;
  playerName: string;
};

// In-game configuration types
export type startGameData = Record<roomName, {
  gameQuestions?: QuestionType[];
  currentQuestionIndex: number;
  totalQuestion: number;
}>

export type QuestionType = {
  theQuestion: string;
  theAnswer: number;
};

export type checkAnswerResult = {
  playerID: string;
  playerName: string;
  isCorrect: boolean;
  nextQuestionIndex: number;
  isGameEnd: boolean;
};

export type StartGamePayload = {
  roomName: string;
  noQuestions: number;
  playerID: string;
  difficulty: 'easy' | 'medium' | 'hard';
};