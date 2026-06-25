import { Star } from 'lucide-react';
import type { GameCardProps, SubmitData } from '../../../types/componentTypes';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { IdentityModal } from './IdentityModal';

export const GameCard = ({ title, description, rating, image }: GameCardProps) => {
  const navigate = useNavigate();
  const [ openIdentity, setOpenIdentity ] = useState<boolean>(false);
  const handleClick = (data: SubmitData) => {
    setOpenIdentity(false);
    navigate({ 
      to: title.toLowerCase(), 
      state: { userState: { username: data.username, roomID: data.roomID } }
    });
  };
  return (
    <div className="card bg-bg-surface border border-space-border rounded-2xl p-1 overflow-hidden hover:border-space-purple/50 transition-all group">
      <IdentityModal isOpen={openIdentity} onClose={() => setOpenIdentity(false)} onSubmit={handleClick} />
      <figure className="relative">
        <img src={image} alt={title} />
      </figure>
      <div className="card-body p-4">
        <h2 className="font-bold text-lg cursor-pointer group-hover:text-space-purple transition-colors">{title}</h2>
        <p className="text-text-muted text-xs mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-game-warning font-mono text-sm flex gap-2 items-center flex-row-reverse">
            {rating} <Star className="text-game-warning" size={20} />{' '}
          </span>
          <button className="text-xs font-bold border border-space-border px-3 py-1.5 rounded-lg hover:bg-white hover:text-bg-main transition-all" onClick={() => setOpenIdentity(true)}>
            PLAY
          </button>
        </div>
      </div>
    </div>
  );
};
