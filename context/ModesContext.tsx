import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type AppMode = 'guided' | 'complete';

interface ModesContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isGuidedMode: boolean;
  isCompleteMode: boolean;
  toggleMode: () => void;
}

const ModesContext = createContext<ModesContextType | undefined>(undefined);

export function ModesProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppMode>('complete');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load mode preference on mount
  useEffect(() => {
    const loadMode = async () => {
      try {
        const saved = await AsyncStorage.getItem('app_mode_preference');
        if (saved === 'guided' || saved === 'complete') {
          setModeState(saved);
        }
      } catch (error) {
        console.warn('Failed to load mode preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadMode();
  }, []);

  const setMode = async (newMode: AppMode) => {
    try {
      setModeState(newMode);
      await AsyncStorage.setItem('app_mode_preference', newMode);
    } catch (error) {
      console.warn('Failed to save mode preference:', error);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'guided' ? 'complete' : 'guided';
    setMode(newMode);
  };

  if (!isLoaded) {
    // Provide context with default values while loading
    const defaultValue: ModesContextType = {
      mode: 'complete',
      setMode: () => {},
      isGuidedMode: false,
      isCompleteMode: true,
      toggleMode: () => {},
    };
    return (
      <ModesContext.Provider value={defaultValue}>
        {children}
      </ModesContext.Provider>
    );
  }

  const value: ModesContextType = {
    mode,
    setMode,
    isGuidedMode: mode === 'guided',
    isCompleteMode: mode === 'complete',
    toggleMode,
  };

  return (
    <ModesContext.Provider value={value}>
      {children}
    </ModesContext.Provider>
  );
}

export function useModes(): ModesContextType {
  const context = useContext(ModesContext);
  if (!context) {
    throw new Error('useModes must be used within ModesProvider');
  }
  return context;
}
