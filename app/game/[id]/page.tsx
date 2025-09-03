import GameDetailsPage from "@/components/GameDetailsPage";

interface GamePageProps {
  params: {
    id: string;
  };
}

export default function GamePage({ params }: GamePageProps) {
  const gameId = parseInt(params.id);

  return <GameDetailsPage gameId={gameId} />;
}

export async function generateMetadata({ params }: GamePageProps) {
  return {
    title: `Game Details - Game Selector`,
    description: `Detailed information about the selected game`,
    openGraph: {
      images: [
        {
          url: `https://game-selector.vercel.app/api/og?title=${params.id}`,
        },
      ],
    },
  };
}
