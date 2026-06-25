export const AlertFalseAnswer = () => {
  return (
    <div className="flex items-center gap-4 bg-game-danger/10 border-l-4 border-game-danger p-4 rounded-xl shadow-[0_0_15px_rgba(255,71,126,0.15)] animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className="bg-game-danger/20 p-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-game-danger drop-shadow-[0_0_5px_var(--color-game-danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h3 className="font-bold text-game-danger tracking-widest text-sm drop-shadow-[0_0_3px_var(--color-game-danger)]">SYSTEM FAILURE</h3>
        <p className="text-xs text-text-muted mt-1">Calculations incorrect. Accuracy compromised.</p>
      </div>
    </div>
  );
};
