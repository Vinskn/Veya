import { useEffect, useState } from 'react';
import type { IdentityModalProps } from '../../../types/componentTypes';
import { Sparkles, X } from 'lucide-react';
import { useUserManagement } from '../../hooks/useUserManagement';

export const IdentityModal = ({ isOpen, onClose, onSubmit }: IdentityModalProps) => {
  const { user } = useUserManagement();
  const [username, setUsername] = useState('');
  const [roomID, setRoomID] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log(username);
    console.log(roomID);
    if (username.trim() && roomID.trim()) {
      onSubmit({ username, roomID });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-bg-surface rounded-2xl border border-space-border shadow-[0_0_30px_var(--color-space-glow)] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-space-cyan via-space-purple to-space-pink"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-space-purple/20 rounded-full blur-[50px] pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-space-border relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="text-space-cyan w-5 h-5 drop-shadow-[0_0_5px_var(--color-space-cyan)]" />
            <h2 className="text-xl font-bold tracking-widest text-text-main drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">SETUP COMM-LINK</h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-game-danger transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10 bg-bg-main/50">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-space-cyan uppercase drop-shadow-[0_0_3px_var(--color-space-cyan)]">Callsign (Username)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Space Cowboy"
              className="w-full bg-bg-elevated border border-space-border text-text-main px-4 py-3 rounded-xl focus:outline-none focus:border-space-purple focus:shadow-[0_0_12px_var(--color-space-glow)] transition-all placeholder:text-text-muted font-medium"
              required
            />
          </div>

          {/* Room ID Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-space-cyan uppercase drop-shadow-[0_0_3px_var(--color-space-cyan)]">Frequency (Room ID)</label>
            <input
              type="text"
              value={roomID}
              onChange={(e) => setRoomID(e.target.value)}
              placeholder="e.g. Sector-7"
              className="w-full bg-bg-elevated border border-space-border text-text-main px-4 py-3 rounded-xl focus:outline-none focus:border-space-cyan focus:shadow-[0_0_12px_rgba(76,201,240,0.3)] transition-all placeholder:text-text-muted font-medium"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold tracking-wider text-text-main border border-space-border hover:bg-space-border hover:text-white transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl font-bold tracking-wider text-white bg-linear-to-r from-space-purple to-space-violet hover:shadow-[0_0_15px_var(--color-space-purple)] transition-all hover:scale-[1.02] active:scale-95 border border-space-purple"
            >
              CONNECT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
