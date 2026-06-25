import { createFileRoute, useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { NotifCorrectAns, AlertFalseAnswer, Countdown, FinalResult } from '../../components/Sankhya';
import { Zap, Crosshair } from 'lucide-react';
import { getSocket } from '../../utils/initSocket';
import type { checkAnswerResult, endGameResult } from '../../types/gamesTypes/sakhya';
import type { Socket } from 'socket.io-client';

export const Route = createFileRoute('/sankhya/startGame')({
  component: RouteComponent,
});

function RouteComponent() {
  const [showCountdown, setShowCountdown] = useState<boolean>(true);
  const [isTrueAnswer, setIsTrueAnswer] = useState<boolean | null>(null);
  const [notifMessage, setNotifMessage] = useState<checkAnswerResult | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [answer, setAnswer] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const handleEndCountdown = () => {
    setShowCountdown(false);
    setIsTrueAnswer(null);
  };

  // in game
  const routerState = useRouterState();
  const { difficulty, noQuestions, roomID } = routerState.location.state.sankhyaState || {};
  const [currentQuestion, setCurrentQuestion] = useState<string>();

  const [isGameEnd, setIsGameEnd] = useState<endGameResult | null>(null);

  useEffect(() => {
    const socketInstance = getSocket('sankhya');
    setSocket(socketInstance);

    if (noQuestions && difficulty && roomID) {
      socketInstance.emit('start_game', { roomName: roomID, noQuestions: noQuestions, playerID: socketInstance.id, difficulty: difficulty });
    }

    const handleCurrentQuestion = (data: string) => {
      setCurrentQuestion(data);
    };
    socketInstance.on('current_question', handleCurrentQuestion);


    socketInstance.on('check_answer', (data: checkAnswerResult) => {
      if (data.isCorrect) {
        setIsTrueAnswer(true);
        setAnswer('');
        setNotifMessage(data);
        setTimeout(() => {
          setCurrentQuestionIndex(data.nextQuestionIndex)
          setShowCountdown(true);
        }, 3000);
      } else {
        if(data.playerID === socketInstance.id){
          console.log(data.playerID, socketInstance.id);
          
          setIsTrueAnswer(false);
        }
      }
    });

    const handleGameEnd = (data: endGameResult) => {
      setIsTrueAnswer(null);
      setShowCountdown(false);
      setIsGameEnd(data);
    };
    socketInstance.on('game_end', handleGameEnd);
  
    return () => {
      socketInstance.off('current_question', handleCurrentQuestion);
      socketInstance.off('check_answer');
      socketInstance.off('game_end');
    };
  }, [difficulty, noQuestions, roomID]);

  // submit answer
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket?.emit('check_answer', { roomName: roomID, playerID: socket.id, answer: Number(answer) });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-main text-text-main p-4 md:p-8 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Decor */}
      <div className="absolute top-0 w-full h-px bg-linear-to-r from-transparent via-space-cyan to-transparent opacity-50"></div>
      <div className="absolute bottom-0 w-full h-px bg-linear-to-r from-transparent via-space-purple to-transparent opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-bg-elevated)_0%,transparent_100%)] z-0"></div>

      {showCountdown && <Countdown onCountdownEnd={handleEndCountdown} />}
      {isGameEnd && <FinalResult {...isGameEnd} />}

      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress HUD */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-bg-surface/60 backdrop-blur-sm p-4 rounded-3xl border border-space-border shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <Zap className="text-game-warning drop-shadow-[0_0_5px_var(--color-game-warning)]" />
            <div>
              <p className="text-[0.65rem] font-bold tracking-widest text-text-muted uppercase">Energy Core</p>
              <p className="font-mono text-xl font-bold text-game-warning">{((currentQuestionIndex + 1) / noQuestions!) * 100}%</p>
            </div>
          </div>

          <div className="flex-1 w-full px-4">
            <div className="flex justify-between text-[0.65rem] font-bold tracking-widest text-space-cyan mb-2">
              <span>CYCLES</span>
              <span>{Math.round((currentQuestionIndex + 1) / noQuestions! * 100)}%</span>
            </div>
            <progress className="progress progress-info w-full h-3 bg-bg-main drop-shadow-[0_0_5px_var(--color-space-cyan)]" value={(currentQuestionIndex + 1)} max={noQuestions}></progress>
          </div>
        </div>
        {/* Alerts Area */}
        <div className="h-24">{isTrueAnswer !== null && (isTrueAnswer ? <NotifCorrectAns playerName={notifMessage?.playerName} /> : <AlertFalseAnswer />)}</div>

        {/* Question Area */}
        <div className="bg-bg-surface/80 backdrop-blur-xl border border-space-border rounded-4xl p-8 md:p-12 text-center shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden mb-6">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-space-purple/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-space-cyan/20 rounded-full blur-2xl"></div>

          <p className="text-[0.65rem] font-bold tracking-[0.3em] text-text-muted uppercase mb-4 flex items-center justify-center gap-2">
            <Crosshair size={14} className="text-space-cyan" /> Target Equation
          </p>

          <div className="font-mono text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-space-cyan via-white to-space-purple drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-10 tracking-wider">
            {currentQuestion}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto relative z-10">
            <input
              inputMode="numeric"
              type="number"
              placeholder="Enter computation..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="input input-lg flex-1 bg-bg-main border-2 border-space-border focus:border-space-cyan focus:shadow-[0_0_15px_rgba(76,201,240,0.3)] text-center md:text-left font-mono font-bold text-xl placeholder:tracking-widest placeholder:text-sm transition-all h-16"
              autoFocus
              disabled={showCountdown}
            />
            <button
              type="submit"
              disabled={showCountdown}
              className="bg-linear-to-r from-space-cyan to-space-purple text-bg-main font-black tracking-widest px-8 py-3 rounded-xl hover:shadow-[0_0_20px_var(--color-space-cyan)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none h-16"
            >
              ENGAGE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
