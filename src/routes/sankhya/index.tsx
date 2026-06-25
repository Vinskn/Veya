import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useUserManagement } from '../../hooks/useUserManagement';
import { getAvatarUrl } from '../../utils/getAvatarUrl';
import { useEffect, useRef, useState } from 'react';
import { AvatarRounded } from '../../components/Sankhya';
import { Settings, Users, Gamepad2, ShieldAlert, Zap } from 'lucide-react';
import { getSocket } from '../../utils/initSocket';
import type { roomInfoRecvType } from '../../types/gamesTypes';
import { Socket } from 'socket.io-client';
import type { difficultyType, StartGamePayload } from '../../types/gamesTypes/sakhya';

export const Route = createFileRoute('/sankhya/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, roomID } = useUserManagement();

  const [host, setHost] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();

  // level configuration
  const [difficulty, setDifficulty] = useState<difficultyType>('medium');
  const [questions, setQuestions] = useState<number>(10);
  const [mode, setMode] = useState('competitive');
  const [launch, setLaunch] = useState<boolean>(false);

  const gameStateRef = useRef<StartGamePayload | null>(null);
  useEffect(() => {
    gameStateRef.current = {
      difficulty,
      noQuestions: questions,
      roomName: roomID!,
      playerID: user!,
    };
  }, [difficulty, questions, roomID, user]);

  // game settings
  const [playerList, setPlayerList] = useState<{ id: string; name: string }[]>([]);

  const handleStartGame = () => {
    if (host && difficulty && questions && mode) {
      socket?.emit('start_trigger', { start: true, roomID: roomID });
    }
  };

  const handleFinishSetup = () => {
    socket?.emit('diff_data', { roomName: roomID, noQuestions: questions, playerID: user, difficulty: difficulty });
    setLaunch(true);
  };

  useEffect(() => {
    // create socket connection
    if (!roomID) return;
    const socketInstance = getSocket('sankhya');
    setSocket(socketInstance);

    if (roomID && user) {
      socketInstance.emit('join_room', { roomName: roomID, playerName: user });
    }

    // handle user list
    const handleUserList = (users: { id: string; name: string }[]) => {
      setPlayerList(users);
    };
    socketInstance.on('user_list', handleUserList);
    socketInstance.emit('user_list', roomID);

    // check host
    const checkHost = (data: roomInfoRecvType) => {
      if (data.hostID == socketInstance.id) {
        setHost(true);
        return;
      }
      setHost(false);
    };
    socketInstance.emit('room_info', roomID);
    socketInstance.on('room_info', checkHost);

    // handle share difficulty
    const handleSeeDifficulty = (data: StartGamePayload) => {
      setQuestions(data.noQuestions);
      setDifficulty(data.difficulty);
    };

    socketInstance.on('diff_data', handleSeeDifficulty);

    // trigger start game to all player when host start
    const handleTriggerStart = (data: { start: boolean; gameState: StartGamePayload }) => {
      if (data.start) {
        const stateToPass = data.gameState || {
          difficulty: gameStateRef.current?.difficulty,
          noQuestions: gameStateRef.current?.noQuestions,
          roomID: roomID,
          playerID: user,
        };
        navigate({
          to: '/sankhya/startGame',
          state: {
            sankhyaState: stateToPass,
          },
        });
      }
    };
    socketInstance.on('start_trigger', handleTriggerStart);

    return () => {
      socketInstance.off('user_list', handleUserList);
      socketInstance.off('room_info', checkHost);
      socketInstance.off('diff_data', handleSeeDifficulty);
      socketInstance.off('start_trigger', handleTriggerStart);
    };
  }, [roomID, user, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-main text-text-main p-4 md:p-8 relative overflow-hidden">
      {/* Nebula Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-space-purple rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-space-cyan rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-bg-surface/60 backdrop-blur-md border border-space-border p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-space-cyan to-space-purple flex items-center justify-center md:justify-start gap-3 drop-shadow-[0_0_10px_var(--color-space-purple)]">
              <Zap className="text-space-cyan" size={40} />
              SANKHYA
            </h1>
            <p className="text-text-muted mt-2 tracking-widest text-xs md:text-sm uppercase font-bold">Hyper-Math Computational Arena</p>
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-4 bg-bg-elevated p-3 rounded-2xl border border-space-border shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
            <div className="text-right">
              <p className="text-[0.65rem] text-space-cyan uppercase font-bold tracking-widest">Commander</p>
              <p className="font-bold text-lg text-text-main tracking-wider">{user || 'Unknown'}</p>
            </div>
            <div className="avatar">
              <div className="w-14 rounded-full border-2 border-space-purple shadow-[0_0_10px_var(--color-space-purple)] p-0.5 bg-bg-main">
                <img src={getAvatarUrl(user || 'user')} alt="Commander" className="rounded-full" />
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls Panel (Left & Center) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bg-surface/80 backdrop-blur-xl border border-space-border rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.4)]">
              {/* Card Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-space-cyan/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center gap-3 mb-8 border-b border-space-border pb-4">
                <Settings className="text-space-cyan" />
                <h2 className="text-xl md:text-2xl font-bold tracking-widest text-text-main">MISSION PARAMETERS</h2>
              </div>

              {host ? (
                <div className="space-y-8">
                  {/* Difficulty */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold tracking-widest text-space-cyan uppercase drop-shadow-[0_0_3px_var(--color-space-cyan)]">Threat Level (Difficulty)</label>
                    <div className="flex border border-space-border rounded-xl overflow-hidden bg-bg-main flex-wrap md:flex-nowrap w-full md:w-max">
                      {['easy', 'medium', 'hard'].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setDifficulty(lvl as difficultyType)}
                          className={`flex-1 md:flex-none px-6 py-3 font-bold text-sm tracking-wider transition-all ${
                            difficulty === lvl
                              ? 'bg-space-purple/20 text-space-cyan border-b-2 border-space-cyan shadow-[inset_0_-2px_10px_rgba(76,201,240,0.2)]'
                              : 'text-text-muted hover:bg-bg-elevated'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Range */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold tracking-widest text-space-cyan uppercase flex justify-between drop-shadow-[0_0_3px_var(--color-space-cyan)]">
                      <span>Computational Cycles (Questions)</span>
                      <span className="text-space-pink text-lg">{questions}</span>
                    </label>
                    <input type="range" min={1} max={25} value={questions} onChange={(e) => setQuestions(parseInt(e.target.value))} className="range range-info w-full" />
                    <div className="flex justify-between px-2 text-[0.65rem] text-text-muted font-mono">
                      <span>1</span>
                      <span>25</span>
                    </div>
                  </div>

                  {/* Mode */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold tracking-widest text-space-cyan uppercase drop-shadow-[0_0_3px_var(--color-space-cyan)]">Engagement Protocol (Mode)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: 'Competitive', desc: 'Destroy opponents by calculating faster.', icon: ShieldAlert },
                        { title: 'Cooperative', desc: 'Team up to solve max equations in time.', icon: Users },
                      ].map((m) => (
                        <div
                          key={m.title}
                          onClick={() => setMode(m.title)}
                          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                            mode === m.title ? 'bg-space-purple/10 border-space-purple shadow-[0_0_15px_rgba(157,78,221,0.2)]' : 'bg-bg-elevated border-space-border hover:border-space-purple/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <m.icon className={mode === m.title ? 'text-space-purple' : 'text-text-muted'} size={20} />
                            <h3 className={`font-bold tracking-wider ${mode === m.title ? 'text-text-main' : 'text-text-muted'}`}>{m.title}</h3>
                          </div>
                          <p className="text-xs text-text-muted leading-relaxed">{m.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end mt-5">
                      <button
                        onClick={handleFinishSetup}
                        disabled={launch}
                        className={`bg-linear-to-r ${!launch ? 'from-space-purple to-space-cyan' : 'from-slate-400 to-gray-600'} px-5 py-2 rounded-lg text-bg-main`}
                      >
                        Finish Setup
                      </button>
                    </div>
                  </div>

                  {/* Start Button */}
                  <div className="pt-8 border-t border-space-border md:text-right">
                    <button
                      onClick={handleStartGame}
                      disabled={!launch}
                      className={`bg-linear-to-r ${launch ? 'from-space-cyan to-space-purple' : 'from-slate-400 to-gray-600'} hover:shadow-[0_0_20px_var(--color-space-cyan)] text-bg-main px-8 py-4 rounded-xl font-black tracking-widest text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 w-full md:w-auto md:ml-auto`}
                    >
                      LAUNCH SEQUENCE <Gamepad2 size={24} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-72 flex flex-col items-center justify-center text-center space-y-6">
                  <span className="loading loading-ring loading-lg text-space-cyan w-16 h-16"></span>
                  <div>
                    <h3 className="text-2xl font-bold text-text-main animate-pulse tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">AWAITING COMMAND</h3>
                    <p className="text-text-muted mt-2 text-sm uppercase tracking-widest">Synchronizing orbital parameters...</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6 text-sm bg-bg-main p-4 rounded-xl border border-space-border w-full shadow-inner">
                    <div>
                      <span className="text-space-cyan/70 text-[0.65rem] uppercase tracking-widest block mb-1">Threat Level</span> {difficulty}
                    </div>
                    <div>
                      <span className="text-space-cyan/70 text-[0.65rem] uppercase tracking-widest block mb-1">Cycles</span> {questions}
                    </div>
                    <div>
                      <span className="text-space-cyan/70 text-[0.65rem] uppercase tracking-widest block mb-1">Protocol</span> {mode}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Lobby */}
          <div className="lg:col-span-1">
            <div className="bg-bg-surface/80 backdrop-blur-xl border border-space-border rounded-3xl p-6 h-full shadow-[0_0_20px_rgba(0,0,0,0.4)] flex flex-col">
              <div className="text-center mb-8 bg-bg-elevated p-6 rounded-2xl border border-space-border shadow-inner">
                <p className="text-xs font-bold tracking-widest text-space-cyan uppercase mb-2">Sector Frequency (Room)</p>
                <div className="font-mono text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-space-purple to-space-pink tracking-widest drop-shadow-[0_0_8px_var(--color-space-purple)]">
                  {roomID ? roomID : 'OFFLINE'}
                </div>
              </div>

              <div className="flex-1 bg-bg-main border border-space-border rounded-2xl p-4 shadow-inner">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-space-border">
                  <h3 className="font-bold tracking-widest text-text-main flex items-center gap-2">
                    <Users size={18} className="text-space-cyan" />
                    SQUADRON
                  </h3>
                  <span className="bg-space-cyan/10 text-space-cyan text-xs font-bold px-3 py-1 rounded-full border border-space-cyan shadow-[0_0_5px_var(--color-space-cyan)]">
                    {playerList.length || 0}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                  {playerList.map((dataUsr) => (
                    <AvatarRounded name={dataUsr.name || dataUsr.id} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
