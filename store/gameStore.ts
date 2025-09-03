import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Game } from "@/types/game";

interface GameStore {
  savedGames: Game[];
  addGame: (game: Game) => void;
  removeGame: (gameId: number) => void;
  isGameSaved: (gameId: number) => boolean;
  clearAllGames: () => void;
  getRandomGame: () => Game | null;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      savedGames: [],

      addGame: (game: Game) => {
        const { savedGames } = get();
        if (!savedGames.find((g) => g.id === game.id)) {
          set({
            savedGames: [...savedGames, { ...game, added_to_wishlist: true }],
          });
        }
      },

      removeGame: (gameId: number) => {
        const { savedGames } = get();
        set({ savedGames: savedGames.filter((game) => game.id !== gameId) });
      },

      isGameSaved: (gameId: number) => {
        const { savedGames } = get();
        return savedGames.some((game) => game.id === gameId);
      },

      clearAllGames: () => {
        set({ savedGames: [] });
      },

      getRandomGame: () => {
        const { savedGames } = get();
        if (savedGames.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * savedGames.length);
        return savedGames[randomIndex];
      },
    }),
    {
      name: "game-store",
      partialize: (state) => ({ savedGames: state.savedGames }),
    }
  )
);
