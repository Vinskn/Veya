import { useDeviceWidth } from '../../hooks/useDeviceWidth';
import type { checkAnswerResult } from '../../types/gamesTypes/sakhya';

export const NotifCorrectAns = ({ playerName }: Partial<checkAnswerResult>) => {
  const { deviceType } = useDeviceWidth();
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl shadow-[0_0_20px_rgba(0,245,212,0.3)] animate-in slide-in-from-bottom-2 zoom-in-95 duration-500 relative overflow-hidden ${deviceType === 'small' ? 'top-20 bg-linear-to-r from-game-success to-transparent border-l-4 border-y border-y-game-success border-l-game-success' : 'top-10 bg-linear-to-r from-game-success/20 to-transparent border-l-4 border-y border-y-game-success/10 border-l-game-success'}`}>
      {/* Pulse background effect */}
      <div className="absolute inset-0 bg-game-success/5 animate-pulse rounded-xl" />

      <div className="relative bg-game-success/20 p-2 rounded-lg border border-game-success/50 shadow-[0_0_10px_rgba(0,245,212,0.5)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 text-game-success drop-shadow-[0_0_8px_rgba(0,245,212,0.8)] animate-[bounce_2s_infinite]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div className="relative">
        <h3 className="font-black text-white tracking-wider text-[15px] drop-shadow-[0_0_5px_rgba(0,245,212,0.8)] uppercase">
          <span className={` animate-pulse ${deviceType === 'small' ? 'text-black' : 'text-game-success'}`}>{playerName || 'Someone'}</span> STRUCK FIRST!
        </h3>
        <p className="text-[13px] text-game-success/90 mt-1 font-semibold tracking-wide">Calculation verified. Energy obtained! ⚡</p>
      </div>
    </div>
  );
};
