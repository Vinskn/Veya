import { useEffect, useState } from 'react';

type CountdownProps = {
  onCountdownEnd: () => void;
};

export const Countdown = ({ onCountdownEnd }: CountdownProps) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown === 0) {
      onCountdownEnd();
      return;
    }
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown, onCountdownEnd]);

  return (
    <div className="absolute inset-0 bg-bg-main/90 backdrop-blur-xl flex flex-col items-center justify-center z-50">
      <div className="relative flex items-center justify-center">
        {/* Radar Ping Effect */}
        <div className="absolute w-64 h-64 border border-space-cyan rounded-full animate-ping opacity-20"></div>
        <div className="absolute w-40 h-40 border border-space-purple border-t-transparent rounded-full animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute w-48 h-48 border border-space-cyan border-b-transparent rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>

        <span className="countdown font-mono text-8xl font-black bg-clip-text bg-linear-to-b from-space-cyan to-space-purple drop-shadow-[0_0_20px_var(--color-space-cyan)]">
          <span style={{ '--value': countdown } as React.CSSProperties} aria-live="polite">
            {countdown}
          </span>
        </span>
      </div>
      <p className="mt-12 text-space-cyan tracking-[0.5em] font-bold text-sm animate-pulse drop-shadow-[0_0_5px_var(--color-space-cyan)]">PREPARE FOR JUMP</p>
    </div>
  );
};
