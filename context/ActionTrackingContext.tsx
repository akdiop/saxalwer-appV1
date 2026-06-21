import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UrgencyLevel } from '../constants/urgency';

export interface TrackedAction {
  id: string;
  timestamp: number;
  type: 'read_article' | 'consulted_chatbot' | 'scheduled_appointment' | 'recorded_intention' | 'recorded_goal';
  subject: string;
  subjectId?: number;
  urgencyLevel?: UrgencyLevel;
  details?: string;
  completed?: boolean;
}

export interface Orientation {
  id: string;
  timestamp: number;
  subject: string;
  subjectId?: number;
  urgencyLevel: UrgencyLevel;
  recommendation: string;
  action?: 'continue_learning' | 'schedule_appointment' | 'prepare_consultation' | 'monitor';
  completed: boolean;
  completedAt?: number;
}

export interface SavedQuestion {
  id: string;
  createdAt: number;
  question: string;
  topic: string;
  topicId?: number;
}

interface ActionTrackingContextType {
  // Action tracking
  actions: TrackedAction[];
  addAction: (action: Omit<TrackedAction, 'id' | 'timestamp'>) => void;
  
  // Orientation history
  orientations: Orientation[];
  addOrientation: (orientation: Omit<Orientation, 'id' | 'timestamp'>) => void;
  completeOrientation: (id: string) => void;
  
  // Questions
  savedQuestions: SavedQuestion[];
  addQuestion: (question: string, topic: string, topicId?: number) => void;
  removeQuestion: (id: string) => void;
  getQuestionsByTopic: (topic: string) => SavedQuestion[];
  
  // Next step
  nextStep: TrackedAction | Orientation | null;
  
  // History
  clearHistory: () => void;
}

const ActionTrackingContext = createContext<ActionTrackingContextType | undefined>(undefined);

export function ActionTrackingProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActions] = useState<TrackedAction[]>([]);
  const [orientations, setOrientations] = useState<Orientation[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const STORAGE_KEYS = {
    actions: 'saxalwer_tracked_actions',
    orientations: 'saxalwer_orientations',
    questions: 'saxalwer_saved_questions',
  };

  // Load from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [actionsData, orientationsData, questionsData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.actions),
          AsyncStorage.getItem(STORAGE_KEYS.orientations),
          AsyncStorage.getItem(STORAGE_KEYS.questions),
        ]);

        if (actionsData) setActions(JSON.parse(actionsData));
        if (orientationsData) setOrientations(JSON.parse(orientationsData));
        if (questionsData) setSavedQuestions(JSON.parse(questionsData));
      } catch (error) {
        console.warn('Failed to load tracking data:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  const addAction = async (action: Omit<TrackedAction, 'id' | 'timestamp'>) => {
    const newAction: TrackedAction = {
      ...action,
      id: `action_${Date.now()}`,
      timestamp: Date.now(),
    };
    const updated = [newAction, ...actions];
    setActions(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.actions, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save action:', error);
    }
  };

  const addOrientation = async (orientation: Omit<Orientation, 'id' | 'timestamp'>) => {
    const newOrientation: Orientation = {
      ...orientation,
      id: `orientation_${Date.now()}`,
      timestamp: Date.now(),
    };
    const updated = [newOrientation, ...orientations];
    setOrientations(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.orientations, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save orientation:', error);
    }
  };

  const completeOrientation = async (id: string) => {
    const updated = orientations.map(o =>
      o.id === id ? { ...o, completed: true, completedAt: Date.now() } : o
    );
    setOrientations(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.orientations, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to update orientation:', error);
    }
  };

  const addQuestion = async (question: string, topic: string, topicId?: number) => {
    const newQuestion: SavedQuestion = {
      id: `question_${Date.now()}`,
      createdAt: Date.now(),
      question,
      topic,
      topicId,
    };
    const updated = [newQuestion, ...savedQuestions];
    setSavedQuestions(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save question:', error);
    }
  };

  const removeQuestion = async (id: string) => {
    const updated = savedQuestions.filter(q => q.id !== id);
    setSavedQuestions(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to remove question:', error);
    }
  };

  const getQuestionsByTopic = (topic: string) => {
    return savedQuestions.filter(q => q.topic === topic);
  };

  // Calculate next step: prefer incomplete orientations, otherwise last action
  const nextStep = (() => {
    const incompleteOrientation = orientations.find(o => !o.completed);
    if (incompleteOrientation) return incompleteOrientation;
    return actions.length > 0 ? actions[0] : null;
  })();

  const clearHistory = async () => {
    setActions([]);
    setOrientations([]);
    setSavedQuestions([]);
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.actions),
        AsyncStorage.removeItem(STORAGE_KEYS.orientations),
        AsyncStorage.removeItem(STORAGE_KEYS.questions),
      ]);
    } catch (error) {
      console.warn('Failed to clear history:', error);
    }
  };

  if (!isLoaded) {
    // Provide context with default values while loading
    const defaultValue: ActionTrackingContextType = {
      actions: [],
      addAction: () => {},
      orientations: [],
      addOrientation: () => {},
      completeOrientation: () => {},
      savedQuestions: [],
      addQuestion: () => {},
      removeQuestion: () => {},
      getQuestionsByTopic: () => [],
      nextStep: null,
      clearHistory: () => {},
    };
    return (
      <ActionTrackingContext.Provider value={defaultValue}>
        {children}
      </ActionTrackingContext.Provider>
    );
  }

  const value: ActionTrackingContextType = {
    actions,
    addAction,
    orientations,
    addOrientation,
    completeOrientation,
    savedQuestions,
    addQuestion,
    removeQuestion,
    getQuestionsByTopic,
    nextStep,
    clearHistory,
  };

  return (
    <ActionTrackingContext.Provider value={value}>
      {children}
    </ActionTrackingContext.Provider>
  );
}

export function useActionTracking(): ActionTrackingContextType {
  const context = useContext(ActionTrackingContext);
  if (!context) {
    throw new Error('useActionTracking must be used within ActionTrackingProvider');
  }
  return context;
}
