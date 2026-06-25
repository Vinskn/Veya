import { createFileRoute } from '@tanstack/react-router';
import { ChatBubble } from '../components/Conversar';
import { Send, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { initSocket } from '../utils/initSocket';
import { useUserManagement } from '../hooks/useUserManagement';
import type { TConversar } from '../types/gamesTypes';

export const Route = createFileRoute('/conversar')({
  component: RouteComponent,
});

function RouteComponent() {
  // init config
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // user and room config
  const { user, roomID } = useUserManagement();
  const [socket, setSocket] = useState<Socket | null>(null);

  // chat config
  const [messagesList, setMessagesList] = useState<TConversar[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!roomID) return;

    const socketInstance = initSocket('conversar');
    setSocket(socketInstance);
    socketInstance.emit('join_room', { roomID });

    const handleReceiveMessage = (data: TConversar) => {
      setMessagesList((prev) => [...prev, data]);
    };

    socketInstance.on('receive_message', handleReceiveMessage);

    return () => {
      socketInstance.off('receive_message', handleReceiveMessage);
      socketInstance.disconnect();
    };
  }, [roomID]);

  const handleSendMessage = () => {
    if (!message || !roomID) return;
    socket?.emit('send_message', {
      room: roomID,
      message,
      sender: user,
    });
    setMessage('');
  };

  // make always latest chat in focus
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messagesList]);

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-5xl mx-auto mt-6 bg-bg-main rounded-2xl overflow-hidden border border-space-border shadow-[0_0_20px_var(--color-space-glow)] relative">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-space-glow),transparent_40%)] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <div className="bg-bg-surface backdrop-blur-md bg-opacity-90 p-5 border-b border-space-border flex items-center justify-between z-10 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-space-purple bg-opacity-20 rounded-lg text-space-cyan border border-space-purple shadow-[0_0_10px_var(--color-space-glow)]">
            <Zap size={22} className="drop-shadow-[0_0_5px_var(--color-space-cyan)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-text-main drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">ALLIANCE COMM-LINK</h1>
            <p className="text-xs text-game-success drop-shadow-[0_0_3px_var(--color-game-success)] animate-pulse flex items-center gap-1 mt-1">
              <span className="inline-block w-2 h-2 bg-game-success rounded-full shadow-[0_0_5px_var(--color-game-success)]"></span>
              SECURE CONNECTION ESTABLISHED | ROOM: <span className="text-game-warning">{roomID}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-bg-main scrollbar-thin scrollbar-thumb-space-purple scrollbar-track-bg-surface z-10">
        <div className="text-center mb-8">
          <span className="text-[0.7rem] px-4 py-1.5 bg-bg-elevated border border-space-border rounded-full text-space-cyan tracking-widest shadow-[0_0_8px_rgba(76,201,240,0.1)]">
            SYSTEM DATE: {formattedDate}
          </span>
        </div>

        {messagesList.map((message, index) => (
          <ChatBubble key={index} message={message.message} sender={message.sender} position={message.sender === user ? 'end' : 'start'} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="bg-bg-surface p-5 border-t border-space-border z-10">
        <form className="flex gap-3 w-full" onSubmit={(e) => e.preventDefault()}>
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span className="text-space-cyan font-mono font-bold animate-pulse">{'>'}</span>
            </div>
            <input
              type="text"
              placeholder="Transmit orders..."
              className="w-full bg-bg-elevated border border-space-border text-text-main pl-10 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-space-cyan focus:shadow-[0_0_12px_rgba(76,201,240,0.3)] transition-all placeholder:text-text-muted group-hover:border-space-glow font-medium"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </div>
          <button
            type="submit"
            className="bg-linear-to-r from-space-purple to-space-violet hover:shadow-[0_0_15px_var(--color-space-purple)] text-white px-7 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 font-bold tracking-wider hover:scale-105 active:scale-95"
            onClick={handleSendMessage}
          >
            <span>SEND</span>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
