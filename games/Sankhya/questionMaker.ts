import Chance from 'chance';
import type { QuestionType } from '../../types/SankhyaType';

type TQuestion = {
  noQuestion: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

const chance = new Chance();

export const questionMaker = (question: TQuestion): QuestionType[] => {
  const result: QuestionType[] = [];

  const generateLoop = (func: () => QuestionType) => {
    for (let i = 0; i < question.noQuestion; i++) {
      result.push(func());
    }
  };

  const diff = question.difficulty.toLowerCase();

  if (diff === 'easy') {
    generateLoop(generateEasy);
  } else if (diff === 'medium') {
    generateLoop(generateMedium);
  } else {
    generateLoop(generateHard);
  }
  return result;
};

// rule
/*
1. Easy -> digit 1-9, operator * && digit 1 - 50, operator +, - 
2. Medium -> digit 1-9, operator * && digit 1 - 100, operator +, - && 1 - 30 operator /
3. Hard -> digit 1-20, operator * && digit 1 - 1000, operator +, - && 1 - 100 operator /
*/

const generateEasy = (): QuestionType => {
  const digit1 = chance.integer({ min: 1, max: 9 });
  const digit2 = chance.integer({ min: 1, max: 9 });
  const operator = chance.pickone(['+', '-']);
  const result = operator === '+' ? digit1 + digit2 : digit1 - digit2;
  return {
    theQuestion: `${digit1} ${operator} ${digit2}`,
    theAnswer: result,
  };
};

const generateMedium = (): QuestionType => {
  const digit1 = chance.integer({ min: 1, max: 9 });
  const digit2 = chance.integer({ min: 1, max: 9 });
  const operator = chance.pickone(['+', '-', '*']);
  const result = operator === '+' ? digit1 + digit2 : operator === '-' ? digit1 - digit2 : digit1 * digit2;
  return {
    theQuestion: `${digit1} ${operator} ${digit2}`,
    theAnswer: result,
  };
};

const generateHard = (): QuestionType => {
  const digit1 = chance.integer({ min: 1, max: 20 });
  const digit2 = chance.integer({ min: 1, max: 20 });
  const operator = chance.pickone(['+', '-', '*', '/']);
  const result = operator === '+' ? digit1 + digit2 : operator === '-' ? digit1 - digit2 : operator === '*' ? digit1 * digit2 : digit1 / digit2;
  
  if (operator === '/') {
    if (digit1 % digit2 !== 0) {
      return generateHard();
    }
  }

  return {
    theQuestion: `${digit1} ${operator} ${digit2}`,
    theAnswer: result,
  };
};
