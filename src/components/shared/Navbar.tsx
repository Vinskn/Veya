import { useLocation, useNavigate } from '@tanstack/react-router';
import { OctagonMinus } from 'lucide-react';
import { disconnectSocket } from '../../utils/initSocket';

export const Navbar = () => {
  const location = useLocation({ select: (location) => location.pathname });
  const currentPath = location.split('/')[1]?.toUpperCase();
  const navigate = useNavigate();

  const handleQuit = () => {
    disconnectSocket(location.split('/')[1]);
    navigate({ to: '/' });
  };

  return (
    <nav className="bg-bg-surface/80 backdrop-blur-md border-b border-space-border p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-space-purple rounded-lg shadow-[0_0_15px_rgba(157,78,221,0.5)]">
            <img src="/veyaLogo.png" alt="Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          {location == '/' ? (
            <span className="text-xl font-black tracking-tighter italic">
              VEYA<span className="text-space-purple">GAMES</span>
            </span>
          ) : (
            <span className="text-xl font-black tracking-tighter italic">
              VEYA<span className="text-space-purple">GAMES</span> | <span className="text-transparent bg-clip-text bg-linear-to-r from-space-purple to-space-pink">{currentPath}</span>
            </span>
          )}
        </div>
        {location == '/' ? (
          <div className="space-x-6 text-sm font-medium">
            <a href="#" className="hover:text-space-cyan transition-colors">
              Discovery
            </a>
            <a href="#" className="hover:text-space-cyan transition-colors">
              Library
            </a>
            <button className="bg-space-purple px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-space-purple/20">STORE</button>
          </div>
        ) : (
          <div>
            <button onClick={handleQuit} className="bg-space-purple px-6 py-2 flex items-center gap-4 rounded-full font-bold shadow-lg shadow-space-purple/20">
              Quit <OctagonMinus />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
