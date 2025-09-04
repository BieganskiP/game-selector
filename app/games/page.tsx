import GamesList from "@/components/GamesList";

export default function GamesPage() {
  return <GamesList />;
}

export async function generateMetadata() {
  return {
    title: "All Games - Game Selector",
    description: "Browse and search through our complete collection of games",
  };
}
