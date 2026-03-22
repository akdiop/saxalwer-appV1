import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { ARTICLES } from '../data/mockArticles';

type Language = 'fr' | 'wo';
type SensitiveLevel = 'priority' | 'recommended' | 'monitor';
type NotificationFrequency = 'Quotidien' | 'Hebdo' | 'Mensuel';

type NotificationPreferenceItem = {
  enabled: boolean;
  frequency: NotificationFrequency;
};

type UserProfile = {
  name: string;
  birthdate: string;
  location: string;
  photoUrl: string;
  personality: string;
  maritalStatus: string;
  childrenCount: number;
  desireChildren: string;
  contraceptionActive: boolean;
  contraceptionMethod: string;
  healthConditions: string[];
  religiousFaith: string;
  educationLevel: string;
  hobbies: string[];
  aboutMe: string;
  pregnancyStatus: string;
  pregnancyWeeks: string;
  pregnancyDueDate: string;
};

type ProfileMockState = {
  language: Language;
  setLanguage: (value: Language) => void;
  selectedAge: number | null;
  setSelectedAge: (value: number | null) => void;
  favorites: string[];
  removeFavorite: (articleId: string) => void;
  selectedNeeds: string[];
  setSelectedNeeds: (value: string[]) => void;
  selectedGoals: string[];
  setSelectedGoals: (value: string[]) => void;
  discreteMode: boolean;
  toggleDiscreteMode: () => void;
  oralMode: boolean;
  toggleOralMode: () => void;
  unreadCount: number;
  clearNotifications: () => void;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  sensitiveOrientation: {
    completedAt: string | null;
    level: SensitiveLevel;
    answers: number;
    riskDimensions: string[];
  };
  notificationPreferences: {
    cycle: NotificationPreferenceItem;
    medication: NotificationPreferenceItem;
    wellness: NotificationPreferenceItem;
  };
  setNotificationPreferenceEnabled: (
    key: 'cycle' | 'medication' | 'wellness',
    value: boolean
  ) => void;
  setNotificationPreferenceFrequency: (
    key: 'cycle' | 'medication' | 'wellness',
    frequency: NotificationFrequency
  ) => void;
  cycleNotifications: { id: string; title: string; time: string }[];
  firstName: string;
};

const ProfileMockContext = createContext<ProfileMockState | undefined>(undefined);

export function ProfileMockProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');
  const [selectedAge, setSelectedAge] = useState<number | null>(24);
  const [favorites, setFavorites] = useState<string[]>([
    ARTICLES[0].id,
    ARTICLES[2].id,
  ]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
    'Cycle & Regles',
    'Douleurs & Symptomes',
  ]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Bien-etre general']);
  const [discreteMode, setDiscreteMode] = useState(false);
  const [oralMode, setOralMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const [notificationPreferences, setNotificationPreferences] = useState({
    cycle: { enabled: true, frequency: 'Hebdo' as NotificationFrequency },
    medication: { enabled: false, frequency: 'Quotidien' as NotificationFrequency },
    wellness: { enabled: true, frequency: 'Mensuel' as NotificationFrequency },
  });

  const [cycleNotifications] = useState([
    { id: 'n1', title: 'Rappel cycle demain', time: '18:00' },
    { id: 'n2', title: 'Hydratation & confort', time: '20:30' },
    { id: 'n3', title: 'Check-in bien-etre', time: '21:00' },
  ]);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Aida',
    birthdate: '1999-06-15',
    location: 'Dakar - Point E',
    photoUrl: '',
    personality: 'Calme et curieuse',
    maritalStatus: 'single',
    childrenCount: 0,
    desireChildren: 'maybe',
    contraceptionActive: true,
    contraceptionMethod: 'pilule',
    healthConditions: ['Anemie legere', 'Cycle irregulier'],
    religiousFaith: '',
    educationLevel: '',
    hobbies: [],
    aboutMe: '',
    pregnancyStatus: '',
    pregnancyWeeks: '',
    pregnancyDueDate: '',
  });

  const sensitiveOrientation = {
    completedAt: '2026-02-11',
    level: 'recommended' as SensitiveLevel,
    answers: 16,
    riskDimensions: ['Stress', 'Sommeil'],
  };

  const removeFavorite = (articleId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== articleId));
  };

  const toggleDiscreteMode = () => {
    setDiscreteMode((prev) => !prev);
  };

  const toggleOralMode = () => {
    setOralMode((prev) => !prev);
  };

  const clearNotifications = () => {
    setUnreadCount(0);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const setNotificationPreferenceEnabled = (
    key: 'cycle' | 'medication' | 'wellness',
    value: boolean
  ) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: value,
      },
    }));
  };

  const setNotificationPreferenceFrequency = (
    key: 'cycle' | 'medication' | 'wellness',
    frequency: NotificationFrequency
  ) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        frequency,
      },
    }));
  };

  const firstName = useMemo(() => userProfile.name.trim(), [userProfile.name]);

  return (
    <ProfileMockContext.Provider
      value={{
        language,
        setLanguage,
        selectedAge,
        setSelectedAge,
        favorites,
        removeFavorite,
        selectedNeeds,
        setSelectedNeeds,
        selectedGoals,
        setSelectedGoals,
        discreteMode,
        toggleDiscreteMode,
        oralMode,
        toggleOralMode,
        unreadCount,
        clearNotifications,
        userProfile,
        updateUserProfile,
        sensitiveOrientation,
        notificationPreferences,
        setNotificationPreferenceEnabled,
        setNotificationPreferenceFrequency,
        cycleNotifications,
        firstName,
      }}
    >
      {children}
    </ProfileMockContext.Provider>
  );
}

export function useProfileMock() {
  const context = useContext(ProfileMockContext);

  if (!context) {
    throw new Error('useProfileMock must be used within ProfileMockProvider');
  }

  return context;
}
