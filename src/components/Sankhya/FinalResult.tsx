import type { endGameResult } from '../../types/gamesTypes/sakhya';
import { useNavigate } from '@tanstack/react-router';
import { disconnectSocket } from '../../utils/initSocket';
import { useUserManagement } from '../../hooks/useUserManagement';

export const FinalResult = ({ winner, totalQuestion, players }: endGameResult) => {
  const navigate = useNavigate();
  const { user } = useUserManagement();

  const isWinner = user === winner;

  const handleQuit = () => {
    disconnectSocket('sankhya');
    navigate({ to: '/' });
  };
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-500">
      {/* Background radial glow */}
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,${isWinner ? 'rgba(0,245,212,0.15)' : 'rgba(247,37,133,0.15)'}_0%,transparent_70%)] pointer-events-none`} />

      <div
        className={`bg-bg-surface/90 border-t-4 ${isWinner ? 'border-t-game-success shadow-[0_0_50px_rgba(0,245,212,0.3)]' : 'border-t-space-pink shadow-[0_0_50px_rgba(247,37,133,0.3)]'} border border-space-border p-8 md:p-14 rounded-3xl text-center relative max-w-2xl w-full animate-in zoom-in-95 slide-in-from-bottom-10 duration-700 overflow-hidden`}
      >
        {/* Glow blur accents */}
        <div className={`absolute -top-10 -left-10 w-40 h-40 ${isWinner ? 'bg-game-success/20' : 'bg-space-pink/20'} rounded-full blur-3xl pointer-events-none`} />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-space-cyan/20 rounded-full blur-3xl pointer-events-none" />
        <div
          className={`absolute -top-1/2 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,${isWinner ? 'rgba(0,245,212,0.1)' : 'rgba(247,37,133,0.1)'}_0%,transparent_50%)] pointer-events-none`}
        />

        <h1 className="text-xs md:text-sm font-bold tracking-[0.5em] text-space-cyan uppercase mb-6 drop-shadow-[0_0_5px_var(--color-space-cyan)]">SIMULATION COMPLETE</h1>

        <h2
          className={`text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-b ${isWinner ? 'from-white via-game-success to-game-success drop-shadow-[0_0_15px_rgba(0,245,212,0.5)]' : 'from-white via-space-pink to-space-pink drop-shadow-[0_0_15px_rgba(247,37,133,0.5)]'} mb-2`}
        >
          {winner || 'UNKNOWN'}
        </h2>
        <p className={`text-lg font-semibold tracking-widest mb-10 uppercase ${isWinner ? 'text-game-success/80' : 'text-space-pink/80'}`}>CHAMPION</p>

        <div className="flex flex-col gap-4 justify-center items-center mt-6 relative z-10 w-full px-4 md:px-0">
          <div className="w-full bg-black/50 border border-space-border p-4 rounded-2xl shadow-inner max-h-56 overflow-y-auto custom-scrollbar">
            <p className="text-[10px] md:text-xs text-text-muted font-bold tracking-widest uppercase mb-4 text-center">Squadron Leaderboard (Top 3 Players - {totalQuestion} Questions)</p>
            <div className="space-y-2 text-left">
              {players?.slice(0, 3).map((p, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center p-3 rounded-xl border transition-all ${p.name === winner ? 'bg-game-success/20 border-game-success text-game-success font-black drop-shadow-[0_0_5px_rgba(0,245,212,0.5)]' : p.name === user ? 'bg-space-pink/10 border-space-pink text-space-pink font-bold' : 'bg-bg-elevated/30 border-space-border text-text-main'}`}
                >
                  <div className="flex gap-3 items-center">
                    <span className="font-mono text-sm opacity-50">#{i + 1}</span>
                    <span className="tracking-wider">
                      {p.name} {p.name === user && <span className="text-[10px] opacity-70 ml-1">(You)</span>}
                    </span>
                  </div>
                  <span className="font-mono">{p.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 relative z-10">
          <button
            onClick={handleQuit}
            className="w-full md:w-auto bg-linear-to-r from-space-cyan to-space-purple text-bg-main font-black tracking-widest px-10 py-4 rounded-xl hover:shadow-[0_0_25px_var(--color-space-cyan)] transition-all hover:scale-105 active:scale-95 uppercase text-sm border-none"
          >
            RETURN TO BASE
          </button>
        </div>
      </div>
    </div>
  );
};
