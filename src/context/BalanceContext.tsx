import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserAvatar {
  animal: string;
  headgear: string;
  tool: string;
  image: string;
  labels: {
    animal: string;
    headgear: string;
    tool: string;
  };
}

interface BalanceContextType {
  balance: number;
  deductBalance: (amount: number) => void;
  addBalance: (amount: number) => void;
  hasVoted: boolean;
  setHasVoted: (value: boolean) => void;
  hasClaimedWinnings: boolean;
  setHasClaimedWinnings: (value: boolean) => void;
  hasSeenTimeTravelModal: boolean;
  setHasSeenTimeTravelModal: (value: boolean) => void;
  achievementsUnlocked: number[];
  unlockAchievement: (achievementId: number) => void;
  viewedAchievements: Set<number>;
  markAchievementAsViewed: (achievementId: number) => void;
  userAvatar: UserAvatar | null;
  setUserAvatar: (avatar: UserAvatar) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(15.00);
  const [hasVoted, setHasVoted] = useState(false);
  const [hasClaimedWinnings, setHasClaimedWinnings] = useState(false);
  const [hasSeenTimeTravelModal, setHasSeenTimeTravelModal] = useState(false);
  const [achievementsUnlocked, setAchievementsUnlocked] = useState<number[]>([]);
  const [viewedAchievements, setViewedAchievements] = useState<Set<number>>(new Set());
  const [userAvatar, setUserAvatar] = useState<UserAvatar | null>(null);

  const deductBalance = (amount: number) => {
    setBalance(prev => Math.max(0, prev - amount));
  };

  const addBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const unlockAchievement = (achievementId: number) => {
    setAchievementsUnlocked(prev => {
      if (!prev.includes(achievementId)) {
        return [...prev, achievementId];
      }
      return prev;
    });
  };

  const markAchievementAsViewed = (achievementId: number) => {
    setViewedAchievements(prev => new Set([...prev, achievementId]));
  };

  return (
    <BalanceContext.Provider value={{ 
      balance, 
      deductBalance,
      addBalance, 
      hasVoted, 
      setHasVoted,
      hasClaimedWinnings,
      setHasClaimedWinnings,
      hasSeenTimeTravelModal,
      setHasSeenTimeTravelModal,
      achievementsUnlocked,
      unlockAchievement,
      viewedAchievements,
      markAchievementAsViewed,
      userAvatar,
      setUserAvatar
    }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

export type { UserAvatar };