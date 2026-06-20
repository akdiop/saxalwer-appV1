import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

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
  resetProfileMockState: () => void;
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

const defaultNotificationPreferences = {
  cycle: { enabled: false, frequency: 'Hebdo' as NotificationFrequency },
  medication: { enabled: false, frequency: 'Quotidien' as NotificationFrequency },
  wellness: { enabled: false, frequency: 'Mensuel' as NotificationFrequency },
};

const defaultUserProfile: UserProfile = {
  name: '',
  birthdate: '',
  location: '',
  photoUrl: '',
  personality: '',
  maritalStatus: '',
  childrenCount: 0,
  desireChildren: '',
  contraceptionActive: false,
  contraceptionMethod: '',
  healthConditions: [],
  religiousFaith: '',
  educationLevel: '',
  hobbies: [],
  aboutMe: '',
  pregnancyStatus: '',
  pregnancyWeeks: '',
  pregnancyDueDate: '',
};

const defaultSensitiveOrientation = {
  completedAt: null,
  level: 'monitor' as SensitiveLevel,
  answers: 0,
  riskDimensions: [],
};

export function ProfileMockProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [discreteMode, setDiscreteMode] = useState(false);
  const [oralMode, setOralMode] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [notificationPreferences, setNotificationPreferences] = useState(defaultNotificationPreferences);

  const [cycleNotifications] = useState<{ id: string; title: string; time: string }[]>([]);

  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [sensitiveOrientation, setSensitiveOrientation] = useState(defaultSensitiveOrientation);

  const resetProfileMockState = () => {
    setLanguage('fr');
    setSelectedAge(null);
    setFavorites([]);
    setSelectedNeeds([]);
    setSelectedGoals([]);
    setDiscreteMode(false);
    setOralMode(false);
    setUnreadCount(0);
    setNotificationPreferences(defaultNotificationPreferences);
    setUserProfile(defaultUserProfile);
    setSensitiveOrientation(defaultSensitiveOrientation);
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
        resetProfileMockState,
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
