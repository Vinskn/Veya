import { createFileRoute } from '@tanstack/react-router';
import { GameCard } from '../components/Home';

export const Route = createFileRoute('/')({
  component: HomePage,
});

const gameListDummy = [
  {
    title: "Conversar",
    description: "For Chatting, testing realtime conversation using WebSocket",
    rating: "4.5",
    image: "/veyaLogo.png",
    gamePath: "/conversar",
  },
  {
    title: "Sankhya",
    description: "A card component has a figure, a body part, and inside body there are title and actions parts",
    rating: "4.5",
    image: "/veyaLogo.png",
    gamePath: "/sankhya",
  },
];

function HomePage() {
  return (
    <div className="bg-bg-main text-text-main min-h-screen font-sans selection:bg-space-purple/30 relative">
      {/* Space Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mask-[radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)]">
        <div className="absolute -inset-full bg-[linear-gradient(to_right,#9d4edd_1px,transparent_1px),linear-gradient(to_bottom,#9d4edd_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-10 rotate-45"></div>
      </div>

      <main className="max-w-7xl mx-auto p-8 relative z-10">
        <header className="mb-10">
          <h2 className="text-space-cyan text-sm font-bold tracking-widest uppercase mb-2">Play Now</h2>
          <h1 className="text-4xl font-extrabold">
            The <span className="text-transparent bg-clip-text bg-linear-to-r from-space-purple to-space-pink">Voyage</span> Never Ends
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {gameListDummy.map((game, index) => (
            <GameCard key={index} title={game.title} description={game.description} rating={game.rating} image={game.image} gamePath={game.gamePath} />
          ))}
        </div>
      </main>
    </div>
  );
}
