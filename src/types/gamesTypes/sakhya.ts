export type roomInfoRecvType = {
  hostID: string;
  players: Record<string, { playerName: string; playerScore: number }>;
};

export type StartGamePayload = {
  roomName: string;
  noQuestions: number;
  playerID: string;
  difficulty: difficultyType;
};

export type difficultyType = 'easy' | 'medium' | 'hard';

export type checkAnswerResult = {
  playerID: string;
  playerName: string;
  isCorrect: boolean;
  nextQuestionIndex: number;
  isGameEnd: boolean;
};

export type endGameResult = {
  winner: string;
  score: number;
  totalQuestion: number;
  players: { name: string; score: number }[];
};

export type currentQuestionType = {
  question: string;
  questionIndex: number;
};
