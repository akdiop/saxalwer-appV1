import React, { createContext, ReactNode, useContext, useState } from 'react';

type NavigationDirection = 'forward' | 'back';

type OnboardingContextType = {
  age: string | null;
  setAge: (value: string) => void;
  needs: string[];
  toggleNeed: (value: string) => void;
  primaryGoal: string | null;
  setPrimaryGoal: (value: string) => void;
  secondaryGoal: boolean;
  setSecondaryGoal: (value: boolean) => void;
  personalization: string[];
  togglePersonalization: (value: string) => void;
  navigationDirection: NavigationDirection;
  setNavigationDirection: (value: NavigationDirection) => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [age, setAge] = useState<string | null>(null);
  const [needs, setNeeds] = useState<string[]>([]);
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);
  const [secondaryGoal, setSecondaryGoal] = useState(false);
  const [personalization, setPersonalization] = useState<string[]>([]);
  const [navigationDirection, setNavigationDirection] = useState<NavigationDirection>('forward');

  const toggleNeed = (value: string) => {
    setNeeds((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const togglePersonalization = (value: string) => {
    setPersonalization((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  return (
    <OnboardingContext.Provider
      value={{
        age,
        setAge,
        needs,
        toggleNeed,
        primaryGoal,
        setPrimaryGoal,
        secondaryGoal,
        setSecondaryGoal,
        personalization,
        togglePersonalization,
        navigationDirection,
        setNavigationDirection,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }

  return context;
}
