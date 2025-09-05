import GamesList from "@/components/GamesList";
import Navigation from "@/components/Navigation";

export default function GamesPage() {
  return (
    <>
      <Navigation pageTitle="All Games" />
      <GamesList />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "All Games - Game Selector",
    description: "Browse and search through our complete collection of games",
  };
}
