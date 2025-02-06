import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {initialLevelData} from '../utils/data';
import {mmkvStorage} from './storage';

interface Level {
  id: number;
  unlocked: boolean;
  completed: boolean;
  highScore: number;
}

interface LevelStore {
  levels: Level[];
  unlockLevel: (id: number) => void;
  completeLevel: (id: number, collectedCandies: number) => void;
}

export const useLevelStore = create<LevelStore>()(
  persist(
    (set, get) => ({
      levels: initialLevelData,
      unlockLevel: (id: number) => {
        set(state => {
          const updatedLevels = state.levels.map(level =>
            level.id === id ? {...level, unlocked: true} : level,
          );
          return {levels: updatedLevels};
        });
      },
      completeLevel: (id: number, collectedCandies: number) => {
        set(state => {
          const updatedLevels = state.levels.map(level => {
            if (level.id === id) {
              return {
                ...level,
                completed: true,
                highScore: Math.max(level.highScore, collectedCandies),
              };
            }
            return level;
          });
          return {levels: updatedLevels};
        });
      },
    }),
    {
      name: 'level-storage',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
