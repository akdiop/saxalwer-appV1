import React from 'react';
import { AppState as RNAppState, Platform } from 'react-native';

import { mapPersonalizationToProfile } from '@/utils/personalizationMapper';
import { secureStorage } from '@/utils/secureStorage';

export type GoalId = 'cycle' | 'grossesse' | 'menopause' | 'bienetre';
export type Language = 'fr' | 'wo';
export type NetworkStatus = 'online' | 'offline' | 'unknown';
export type LifeSituation =
	| 'curious'
	| 'cycles'
	| 'contraception'
	| 'pregnant'
	| 'trying'
	| 'postpartum'
	| 'menopause'
	| 'general'
	| 'prefer-not-say';

export type NotifCategory =
	| 'cycles'
	| 'contraception'
	| 'articleOfDay'
	| 'dailyTip'
	| 'symptomLog'
	| 'orientation'
	| 'predictive';

export interface CycleNotification {
	id: string;
	message: string;
	metaphor: string;
	timestamp: number;
	read: boolean;
	category: NotifCategory;
}

export type NotifFrequency = 'daily' | 'weekly' | 'monthly';

export type SymptomId =
	| 'headache'
	| 'cramps'
	| 'breast-pain'
	| 'bloating'
	| 'mood-swings'
	| 'fatigue'
	| 'nausea'
	| 'back-pain'
	| 'acne'
	| 'cravings'
	| 'insomnia'
	| 'irritability';

export interface SymptomEntry {
	symptomId: SymptomId;
	intensity: 1 | 2 | 3;
	notes?: string;
}

export interface PersonalizationContext {
	ageRange: '15-17' | '18-24' | '25-34' | '35-49' | '50+' | null;
	livingContext: 'alone' | 'parents' | 'partner' | 'roommates' | 'family' | null;
	privacyLevel: 'low' | 'medium' | 'high' | 'very-high' | null;
	socialNorms: 'conservative' | 'moderate' | 'open' | null;
	educationLevel: 'basic' | 'intermediate' | 'advanced' | null;
	preferredTone: 'formal' | 'friendly' | 'sisterly' | null;
	audioPreference: 'always' | 'sometimes' | 'never' | null;
	needsSupport: boolean;
}

export const FREQUENCY_INTERVALS: Record<NotifFrequency, number> = {
	daily: 86400000,
	weekly: 604800000,
	monthly: 2592000000,
};

export interface NotificationPreferences {
	cycles: boolean;
	contraception: boolean;
	articleOfDay: boolean;
	dailyTip: boolean;
	symptomLog: boolean;
	orientation: boolean;
	predictive: boolean;
	frequencies: Record<NotifCategory, NotifFrequency>;
	lastSent: Record<NotifCategory, number>;
}

export interface JournalEntry {
	id: string;
	date: number;
	mood: string;
	content: string;
	tags: string[];
	photos: string[];
}

export interface UserProfile {
	name: string;
	photoUrl: string | null;
	birthdate: string;
	location: string;
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
}

export interface FeedbackEntry {
	id: string;
	type: string;
	message: string;
	rating: number;
	timestamp: number;
	userName: string;
	photos: string[];
}

export interface OrientationSession {
	answers: Record<string, string | null>;
	currentStep: number;
	completedAt: number | null;
	level: 'surveillance' | 'recommended' | 'urgent' | null;
}

export type SensitiveOrientationLevel = 'surveillance' | 'recommended' | 'priority' | null;

export interface SensitiveOrientationSession {
	answers: Record<string, string | null>;
	completedAt: number | null;
	level: SensitiveOrientationLevel;
	riskDimensions: string[];
	privacyRisk: boolean;
}

export type QuickAccessId =
	| 'bibliotheque'
	| 'suivi'
	| 'carte'
	| 'about'
	| 'orientation'
	| 'orientation-sensible'
	| 'chat'
	| 'medecins'
	| 'journal'
	| 'faq'
	| 'glossaire'
	| 'urgence'
	| 'stats-sante'
	| 'calendrier'
	| 'mon-contexte';

export interface DailyLog {
	mood?: string;
	symptoms?: SymptomEntry[];
	flow?: number | null;
	notes?: string;
}

export interface PillLog {
	taken: boolean;
	time?: number;
}

export interface CycleData {
	lastPeriodDate: string | null;
	cycleLength: number;
	periodLength: number;
	pillTracking: boolean;
	pillLogs: Record<string, PillLog>;
	dailyLogs: Record<string, DailyLog>;
	periodDates: string[];
}

interface AppState {
	selectedAge: string | null;
	selectedNeeds: string[];
	selectedGoals: GoalId[];
	lifeSituation: LifeSituation | null;
	discreteMode: boolean;
	oralMode: boolean;
	isOnboarded: boolean;
	hasConsented: boolean;
	hasCompletedTutorial: boolean;
	language: Language;
	favorites: number[];
	privacyConcern: boolean;
	cycleNotifications: CycleNotification[];
	journalEntries: JournalEntry[];
	userProfile: UserProfile;
	hasSeenWelcome: boolean;
	feedbackEntries: FeedbackEntry[];
	orientationSession: OrientationSession;
	sensitiveOrientation: SensitiveOrientationSession;
	notificationPreferences: NotificationPreferences;
	quickAccessItems: QuickAccessId[];
	glossaryViews: Record<string, number>;
	cycleData: CycleData;
	personalization: PersonalizationContext;
	discreteModeManual: boolean | null; // null = auto, true/false = manuel
}

export interface AppContextType extends AppState {
	networkStatus: NetworkStatus;
	isOffline: boolean;
	isOnline: boolean;
	appLockEnabled: boolean;
	appLockReady: boolean;
	isAppLocked: boolean;
	refreshNetworkStatus: () => Promise<NetworkStatus>;
	setAge: (age: string) => void;
	setNeeds: (needs: string[]) => void;
	setGoals: (goals: GoalId[]) => void;
	setLifeSituation: (situation: LifeSituation) => void;
	toggleDiscreteMode: () => void;
	toggleOralMode: () => void;
	completeOnboarding: () => void;
	completeTutorial: () => void;
	setConsent: (consented: boolean) => void;
	setLanguage: (lang: Language) => void;
	toggleFavorite: (articleId: number) => void;
	isFavorite: (articleId: number) => boolean;
	setPrivacyConcern: (concern: boolean) => void;
	addCycleNotification: (msg: string, metaphor: string, category: NotifCategory) => void;
	markNotificationRead: (id: string) => void;
	deleteNotification: (id: string) => void;
	clearNotifications: () => void;
	unreadCount: number;
	addJournalEntry: (mood: string, content: string, tags: string[], photos: string[]) => void;
	updateJournalEntry: (id: string, mood: string, content: string, tags: string[], photos: string[]) => void;
	deleteJournalEntry: (id: string) => void;
	updateUserProfile: (profile: Partial<UserProfile>) => void;
	setHasSeenWelcome: () => void;
	addFeedback: (feedback: Omit<FeedbackEntry, 'id'>) => void;
	saveOrientation: (session: OrientationSession) => void;
	clearOrientation: () => void;
	saveSensitiveOrientation: (session: SensitiveOrientationSession) => void;
	clearSensitiveOrientation: () => void;
	setNotificationPreferences: (preferences: NotificationPreferences) => void;
	setQuickAccessItems: (items: QuickAccessId[]) => void;
	trackGlossaryView: (term: string) => void;
	updateCycleData: (data: Partial<CycleData>) => void;
	setPersonalization: (context: PersonalizationContext) => void;
	setAppLockCode: (code: string) => Promise<boolean>;
	disableAppLock: (code: string) => Promise<boolean>;
	unlockApp: (code: string) => Promise<boolean>;
	lockApp: () => void;
	resetAppState: () => Promise<void>;
}

const STORAGE_KEY = 'samawer_state';
const APP_LOCK_SECRET_KEY = 'samawer_app_lock_secret';
const APP_LOCK_CODE_LENGTH = 4;

const normalizeAppLockCode = (code: string | null | undefined) => code?.replace(/\s+/g, '') ?? '';
const isValidAppLockCode = (code: string) =>
	new RegExp(`^[0-9]{${APP_LOCK_CODE_LENGTH}}$`).test(normalizeAppLockCode(code));

const defaultState: AppState = {
	selectedAge: null,
	selectedNeeds: [],
	selectedGoals: [],
	lifeSituation: null,
	discreteMode: false,
	oralMode: false,
	isOnboarded: false,
	hasConsented: false,
	hasCompletedTutorial: false,
	language: 'fr',
	favorites: [],
	privacyConcern: false,
	cycleNotifications: [],
	journalEntries: [],
	userProfile: {
		name: '',
		photoUrl: null,
		birthdate: '',
		location: '',
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
	},
	hasSeenWelcome: false,
	feedbackEntries: [],
	orientationSession: {
		answers: {},
		currentStep: 0,
		completedAt: null,
		level: null,
	},
	sensitiveOrientation: {
		answers: {},
		completedAt: null,
		level: null,
		riskDimensions: [],
		privacyRisk: false,
	},
	notificationPreferences: {
		cycles: true,
		contraception: true,
		articleOfDay: true,
		dailyTip: true,
		symptomLog: true,
		orientation: true,
		predictive: true,
		frequencies: {
			cycles: 'weekly',
			contraception: 'monthly',
			articleOfDay: 'daily',
			dailyTip: 'daily',
			symptomLog: 'weekly',
			orientation: 'monthly',
			predictive: 'monthly',
		},
		lastSent: {
			cycles: 0,
			contraception: 0,
			articleOfDay: 0,
			dailyTip: 0,
			symptomLog: 0,
			orientation: 0,
			predictive: 0,
		},
	},
	quickAccessItems: [],
	glossaryViews: {},
	cycleData: {
		lastPeriodDate: null,
		cycleLength: 0,
		periodLength: 0,
		pillTracking: false,
		pillLogs: {},
		dailyLogs: {},
		periodDates: [],
	},
	personalization: {
		ageRange: null,
		livingContext: null,
		privacyLevel: null,
		socialNorms: null,
		educationLevel: null,
		preferredTone: null,
		audioPreference: null,
		needsSupport: false,
	},
	discreteModeManual: null, // null = auto, true/false = manuel
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);
const NETWORK_CHECK_URL = 'https://www.google.com/generate_204';

const getBrowserOnlineStatus = () => {
	if (typeof navigator === 'undefined' || typeof navigator.onLine !== 'boolean') {
		return null;
	}

	return navigator.onLine;
};

const probeNetworkStatus = async (): Promise<NetworkStatus> => {
	const browserOnline = getBrowserOnlineStatus();

	if (Platform.OS === 'web') {
		if (browserOnline === false) {
			return 'offline';
		}

		if (browserOnline === true) {
			return 'online';
		}

		return 'unknown';
	}

	try {
		await Promise.race([
			fetch(NETWORK_CHECK_URL, { method: 'GET' }),
			new Promise<never>((_, reject) => {
				setTimeout(() => reject(new Error('timeout')), 4000);
			}),
		]);
		return 'online';
	} catch {
		if (browserOnline === false) {
			return 'offline';
		}

		return 'offline';
	}
};

const mergeLoadedState = (loadedState: Partial<AppState>): AppState => {
	const loadedNotificationPreferences = loadedState.notificationPreferences;
	const loadedCycleData = loadedState.cycleData;
	const loadedUserProfile = loadedState.userProfile;
	const loadedOrientationSession = loadedState.orientationSession;
	const loadedSensitiveOrientation = loadedState.sensitiveOrientation;
	const loadedPersonalization = loadedState.personalization;

	return {
		...defaultState,
		...loadedState,
		orientationSession: {
			...defaultState.orientationSession,
			...(loadedOrientationSession ?? {}),
		},
		sensitiveOrientation: {
			...defaultState.sensitiveOrientation,
			...(loadedSensitiveOrientation ?? {}),
		},
		notificationPreferences: {
			...defaultState.notificationPreferences,
			...(loadedNotificationPreferences || {}),
			frequencies: {
				...defaultState.notificationPreferences.frequencies,
				...(loadedNotificationPreferences?.frequencies || {}),
			},
			lastSent: {
				...defaultState.notificationPreferences.lastSent,
				...(loadedNotificationPreferences?.lastSent || {}),
			},
		},
		cycleData: {
			...defaultState.cycleData,
			...(loadedCycleData || {}),
		},
		userProfile: {
			...defaultState.userProfile,
			...(loadedUserProfile || {}),
		},
		personalization: {
			...defaultState.personalization,
			...(loadedPersonalization ?? {}),
		},
	};
};

export function AppProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = React.useState<AppState>(defaultState);
	const [isLoaded, setIsLoaded] = React.useState(false);
	const [networkStatus, setNetworkStatus] = React.useState<NetworkStatus>('unknown');
	const [appLockEnabled, setAppLockEnabled] = React.useState(false);
	const [appLockReady, setAppLockReady] = React.useState(false);
	const [isAppLocked, setIsAppLocked] = React.useState(false);
	const appLockSecretRef = React.useRef<string | null>(null);

	const refreshNetworkStatus = React.useCallback(async () => {
		try {
			const nextStatus = await probeNetworkStatus();
			setNetworkStatus(nextStatus);
			return nextStatus;
		} catch {
			setNetworkStatus('unknown');
			return 'unknown';
		}
	}, []);

	React.useEffect(() => {
		let active = true;
		const syncNetworkStatus = async () => {
			const nextStatus = await probeNetworkStatus();

			if (!active) {
				return;
			}

			setNetworkStatus(nextStatus);
		};

		syncNetworkStatus().catch(() => undefined);
		const intervalId = setInterval(() => {
			syncNetworkStatus().catch(() => undefined);
		}, 20000);
		const appStateSubscription = RNAppState.addEventListener('change', (nextState) => {
			if (appLockSecretRef.current && (nextState === 'background' || nextState === 'inactive')) {
				setIsAppLocked(true);
			}

			if (nextState === 'active') {
				syncNetworkStatus().catch(() => undefined);
			}
		});
		const handleOnline = () => setNetworkStatus('online');
		const handleOffline = () => setNetworkStatus('offline');

		if (Platform.OS === 'web' && typeof window !== 'undefined') {
			window.addEventListener('online', handleOnline);
			window.addEventListener('offline', handleOffline);
		}

		return () => {
			active = false;
			clearInterval(intervalId);
			appStateSubscription.remove();

			if (Platform.OS === 'web' && typeof window !== 'undefined') {
				window.removeEventListener('online', handleOnline);
				window.removeEventListener('offline', handleOffline);
			}
		};
	}, []);

	React.useEffect(() => {
		let active = true;

		const loadState = async () => {
			try {
				const [parsed, storedAppLockCode] = await Promise.all([
					secureStorage.getJSON<Partial<AppState>>(STORAGE_KEY),
					secureStorage.getItem(APP_LOCK_SECRET_KEY),
				]);

				if (parsed && active) {
					setState(mergeLoadedState(parsed));
				}

				const normalizedAppLockCode = normalizeAppLockCode(storedAppLockCode);
				const hasValidAppLockCode = isValidAppLockCode(normalizedAppLockCode);
				appLockSecretRef.current = hasValidAppLockCode ? normalizedAppLockCode : null;

				if (active) {
					setAppLockEnabled(hasValidAppLockCode);
					setIsAppLocked(hasValidAppLockCode);
				}
			} catch (error) {
				console.error('Failed to load state', error);
			} finally {
				if (active) {
					setIsLoaded(true);
					setAppLockReady(true);
				}
			}
		};

		loadState();

		return () => {
			active = false;
		};
	}, []);

	React.useEffect(() => {
		if (!isLoaded) {
			return;
		}

		const persistState = async () => {
			try {
				await secureStorage.setJSON(STORAGE_KEY, state);
			} catch (error) {
				console.error('Failed to save state', error);
			}
		};

		persistState();
	}, [state, isLoaded]);

	React.useEffect(() => {
		if (!isLoaded || state.discreteModeManual !== null) {
			return;
		}

		if (state.privacyConcern && !state.discreteMode) {
			setState((prev) => ({ ...prev, discreteMode: true }));
		}
	}, [state.privacyConcern, state.discreteMode, state.discreteModeManual, isLoaded]);

	React.useEffect(() => {
		if (!isLoaded) {
			return;
		}

		const p = state.personalization;

		if (
			state.discreteModeManual === null &&
			(p.privacyLevel === 'high' || p.privacyLevel === 'very-high') &&
			!state.discreteMode
		) {
			setState((prev) => ({ ...prev, discreteMode: true }));
		}

		if (p.audioPreference === 'always' && !state.oralMode) {
			setState((prev) => ({ ...prev, oralMode: true }));
		} else if (p.audioPreference === 'never' && state.oralMode) {
			setState((prev) => ({ ...prev, oralMode: false }));
		}

		if (p.livingContext === 'parents' || p.privacyLevel === 'very-high') {
			setState((prev) => ({
				...prev,
				notificationPreferences: {
					...prev.notificationPreferences,
					cycles: false,
					frequencies: {
						...prev.notificationPreferences.frequencies,
						cycles: 'monthly',
						symptomLog: 'monthly',
					},
				},
			}));
		}
	}, [isLoaded, state.discreteMode, state.discreteModeManual, state.oralMode, state.personalization]);

	React.useEffect(() => {
		if (!isLoaded || !state.isOnboarded) {
			return;
		}

		const prefs = state.notificationPreferences;
		const freqs = prefs.frequencies || defaultState.notificationPreferences.frequencies;
		const lastSent = prefs.lastSent || defaultState.notificationPreferences.lastSent;
		const now = Date.now();

		const isDue = (category: NotifCategory): boolean => {
			const interval = FREQUENCY_INTERVALS[freqs[category] || 'daily'];
			return now - (lastSent[category] || 0) >= interval;
		};

		const newNotifs: CycleNotification[] = [];

		if (prefs.cycles && isDue('cycles')) {
			const cyclePool = [
				{ msg: "Ton cycle approche d'un nouveau chapitre", metaphor: 'La lune change de visage' },
				{ msg: 'Ecoute les signes de ton corps', metaphor: 'Le baobab murmure au vent' },
				{ msg: 'Prends un moment pour toi', metaphor: "La terre se repose avant l'aube" },
				{ msg: 'Ta sagesse interieure grandit', metaphor: 'Les etoiles guident en silence' },
			];
			const pick = cyclePool[Math.floor(Math.random() * cyclePool.length)];
			newNotifs.push({
				id: `cyc_${now}`,
				message: pick.msg,
				metaphor: pick.metaphor,
				timestamp: now,
				read: false,
				category: 'cycles',
			});
		}

		if (prefs.contraception && isDue('contraception')) {
			const contraPool = [
				{
					msg: 'As-tu pense a ton rendez-vous contraception ?',
					metaphor: 'Le fleuve suit son cours',
				},
				{ msg: 'Ta methode te convient-elle toujours ?', metaphor: 'Chaque saison porte ses choix' },
			];
			const pick = contraPool[Math.floor(Math.random() * contraPool.length)];
			newNotifs.push({
				id: `contra_${now}`,
				message: pick.msg,
				metaphor: pick.metaphor,
				timestamp: now + 1,
				read: false,
				category: 'contraception',
			});
		}

		if (prefs.articleOfDay && isDue('articleOfDay')) {
			const articlePool = [
				{
					msg: "Un article t'attend dans la bibliothèque",
					metaphor: "Le savoir nourrit l'esprit",
				},
				{ msg: 'Decouvre la lecture du jour', metaphor: 'Chaque page ouvre un chemin' },
			];
			const pick = articlePool[Math.floor(Math.random() * articlePool.length)];
			newNotifs.push({
				id: `art_${now}`,
				message: pick.msg,
				metaphor: pick.metaphor,
				timestamp: now + 2,
				read: false,
				category: 'articleOfDay',
			});
		}

		if (prefs.dailyTip && isDue('dailyTip')) {
			const tipPool = [
				{
					msg: "Boire de l'eau tiede le matin aide ton corps a s'eveiller",
					metaphor: 'La rosee nourrit la terre',
				},
				{ msg: 'Respire profondement, ton corps te remercie', metaphor: 'Le vent porte la serenite' },
				{
					msg: "Prends 5 minutes pour toi aujourd'hui",
					metaphor: "L'ombre du baobab accueille qui s'arrete",
				},
			];
			const pick = tipPool[Math.floor(Math.random() * tipPool.length)];
			newNotifs.push({
				id: `tip_${now}`,
				message: pick.msg,
				metaphor: pick.metaphor,
				timestamp: now + 3,
				read: false,
				category: 'dailyTip',
			});
		}

		if (prefs.symptomLog && isDue('symptomLog')) {
			const logPool = [
				{
					msg: "Comment te sens-tu aujourd'hui ? Note-le dans ton journal",
					metaphor: 'Les mots liberent le coeur',
				},
				{
					msg: 'Enregistrer tes symptomes aide a mieux te connaitre',
					metaphor: 'La memoire du corps est precieuse',
				},
			];
			const pick = logPool[Math.floor(Math.random() * logPool.length)];
			newNotifs.push({
				id: `sym_${now}`,
				message: pick.msg,
				metaphor: pick.metaphor,
				timestamp: now + 4,
				read: false,
				category: 'symptomLog',
			});
		}

		if (prefs.orientation && isDue('orientation') && state.sensitiveOrientation?.completedAt) {
			const oriPool = [
				{
					msg: 'Pense à réévaluer ton orientation santé',
					metaphor: 'Le chemin se redessine a chaque pas',
				},
				{
					msg: 'Ton bien-etre evolue, ton orientation aussi',
					metaphor: 'Les saisons changent, toi aussi',
				},
			];
			const pick = oriPool[Math.floor(Math.random() * oriPool.length)];
			newNotifs.push({
				id: `ori_${now}`,
				message: pick.msg,
				metaphor: pick.metaphor,
				timestamp: now + 5,
				read: false,
				category: 'orientation',
			});
		}

		if (newNotifs.length > 0) {
			const shuffled = [...newNotifs].sort(() => Math.random() - 0.5);
			const picked = shuffled.slice(0, Math.min(2, shuffled.length));
			const updatedLastSent = { ...lastSent };
			picked.forEach((notification) => {
				updatedLastSent[notification.category] = now;
			});

			setState((prev) => ({
				...prev,
				cycleNotifications: [...picked, ...prev.cycleNotifications.slice(0, 28)],
				notificationPreferences: {
					...prev.notificationPreferences,
					lastSent: updatedLastSent,
				},
			}));
		}
	}, [
		isLoaded,
		state.isOnboarded,
		state.notificationPreferences,
		state.sensitiveOrientation?.completedAt,
	]);

	const setAge = (age: string) => setState((prev) => ({ ...prev, selectedAge: age }));
	const setNeeds = (needs: string[]) => setState((prev) => ({ ...prev, selectedNeeds: needs }));
	const setGoals = (goals: GoalId[]) => setState((prev) => ({ ...prev, selectedGoals: goals }));
	const setLifeSituation = (situation: LifeSituation) =>
		setState((prev) => ({ ...prev, lifeSituation: situation }));
	const toggleDiscreteMode = () =>
		setState((prev) => {
			const nextDiscreteMode = !prev.discreteMode;

			return {
				...prev,
				discreteMode: nextDiscreteMode,
				discreteModeManual: nextDiscreteMode,
			};
		});
	const toggleOralMode = () => setState((prev) => ({ ...prev, oralMode: !prev.oralMode }));
	const completeOnboarding = () => setState((prev) => ({ ...prev, isOnboarded: true }));
	const completeTutorial = () => setState((prev) => ({ ...prev, hasCompletedTutorial: true }));
	const setConsent = (consented: boolean) => setState((prev) => ({ ...prev, hasConsented: consented }));
	const setLanguage = (lang: Language) => setState((prev) => ({ ...prev, language: lang }));
	const setPrivacyConcern = (concern: boolean) => setState((prev) => ({ ...prev, privacyConcern: concern }));

	const toggleFavorite = (articleId: number) => {
		setState((prev) => ({
			...prev,
			favorites: prev.favorites.includes(articleId)
				? prev.favorites.filter((id) => id !== articleId)
				: [...prev.favorites, articleId],
		}));
	};

	const isFavorite = React.useCallback(
		(articleId: number) => state.favorites.includes(articleId),
		[state.favorites]
	);

	const addCycleNotification = (msg: string, metaphor: string, category: NotifCategory) => {
		setState((prev) => ({
			...prev,
			cycleNotifications: [
				{
					id: `notif_${Date.now()}`,
					message: msg,
					metaphor,
					timestamp: Date.now(),
					read: false,
					category,
				},
				...prev.cycleNotifications.slice(0, 9),
			],
		}));
	};

	const markNotificationRead = (id: string) => {
		setState((prev) => ({
			...prev,
			cycleNotifications: prev.cycleNotifications.map((notification) =>
				notification.id === id ? { ...notification, read: true } : notification
			),
		}));
	};

	const deleteNotification = (id: string) => {
		setState((prev) => ({
			...prev,
			cycleNotifications: prev.cycleNotifications.filter((notification) => notification.id !== id),
		}));
	};

	const clearNotifications = () => setState((prev) => ({ ...prev, cycleNotifications: [] }));
	const unreadCount = state.cycleNotifications.filter((notification) => !notification.read).length;

	const addJournalEntry = (mood: string, content: string, tags: string[], photos: string[]) => {
		setState((prev) => ({
			...prev,
			journalEntries: [
				{
					id: `entry_${Date.now()}`,
					date: Date.now(),
					mood,
					content,
					tags,
					photos,
				},
				...prev.journalEntries.slice(0, 9),
			],
		}));
	};

	const updateJournalEntry = (
		id: string,
		mood: string,
		content: string,
		tags: string[],
		photos: string[]
	) => {
		setState((prev) => ({
			...prev,
			journalEntries: prev.journalEntries.map((entry) =>
				entry.id === id ? { ...entry, mood, content, tags, photos } : entry
			),
		}));
	};

	const deleteJournalEntry = (id: string) => {
		setState((prev) => ({
			...prev,
			journalEntries: prev.journalEntries.filter((entry) => entry.id !== id),
		}));
	};

	const updateUserProfile = (profile: Partial<UserProfile>) => {
		setState((prev) => ({
			...prev,
			userProfile: {
				...prev.userProfile,
				...profile,
			},
		}));
	};

	const setHasSeenWelcome = () => {
		setState((prev) => ({
			...prev,
			hasSeenWelcome: true,
		}));
	};

	const addFeedback = (feedback: Omit<FeedbackEntry, 'id'>) => {
		setState((prev) => ({
			...prev,
			feedbackEntries: [
				{
					id: `feedback_${Date.now()}`,
					...feedback,
				},
				...prev.feedbackEntries.slice(0, 9),
			],
		}));
	};

	const saveOrientation = (session: OrientationSession) => {
		setState((prev) => ({
			...prev,
			orientationSession: session,
		}));
	};

	const clearOrientation = () => {
		setState((prev) => ({
			...prev,
			orientationSession: {
				answers: {},
				currentStep: 0,
				completedAt: null,
				level: null,
			},
		}));
	};

	const saveSensitiveOrientation = (session: SensitiveOrientationSession) => {
		setState((prev) => ({ ...prev, sensitiveOrientation: session }));
	};

	const clearSensitiveOrientation = () => {
		setState((prev) => ({
			...prev,
			sensitiveOrientation: {
				answers: {},
				completedAt: null,
				level: null,
				riskDimensions: [],
				privacyRisk: false,
			},
		}));
	};

	const setNotificationPreferences = (preferences: NotificationPreferences) => {
		setState((prev) => ({ ...prev, notificationPreferences: preferences }));
	};

	const setQuickAccessItems = (items: QuickAccessId[]) => {
		setState((prev) => ({ ...prev, quickAccessItems: items }));
	};

	const trackGlossaryView = (term: string) => {
		setState((prev) => ({
			...prev,
			glossaryViews: {
				...prev.glossaryViews,
				[term]: (prev.glossaryViews[term] || 0) + 1,
			},
		}));
	};

	const updateCycleData = (data: Partial<CycleData>) => {
		setState((prev) => ({
			...prev,
			cycleData: {
				...prev.cycleData,
				...data,
			},
		}));
	};

	const setPersonalization = (context: PersonalizationContext) => {
		setState((prev) => {
			const profileUpdates = mapPersonalizationToProfile(context, prev.userProfile);

			return {
				...prev,
				personalization: context,
				userProfile: {
					...prev.userProfile,
					...profileUpdates,
				},
			};
		});
	};

	const setAppLockCode = React.useCallback(async (code: string) => {
		const normalizedCode = normalizeAppLockCode(code);

		if (!isValidAppLockCode(normalizedCode)) {
			return false;
		}

		try {
			await secureStorage.setItem(APP_LOCK_SECRET_KEY, normalizedCode);
			appLockSecretRef.current = normalizedCode;
			setAppLockEnabled(true);
			setIsAppLocked(false);
			return true;
		} catch (error) {
			console.error('Failed to save app lock code', error);
			return false;
		}
	}, []);

	const disableAppLock = React.useCallback(async (code: string) => {
		const normalizedCode = normalizeAppLockCode(code);

		if (!appLockSecretRef.current || normalizedCode !== appLockSecretRef.current) {
			return false;
		}

		try {
			await secureStorage.removeItem(APP_LOCK_SECRET_KEY);
			appLockSecretRef.current = null;
			setAppLockEnabled(false);
			setIsAppLocked(false);
			return true;
		} catch (error) {
			console.error('Failed to disable app lock', error);
			return false;
		}
	}, []);

	const unlockApp = React.useCallback(async (code: string) => {
		const normalizedCode = normalizeAppLockCode(code);

		if (!appLockSecretRef.current || normalizedCode !== appLockSecretRef.current) {
			return false;
		}

		setIsAppLocked(false);
		return true;
	}, []);

	const lockApp = React.useCallback(() => {
		if (appLockSecretRef.current) {
			setIsAppLocked(true);
		}
	}, []);

	const resetAppState = React.useCallback(async () => {
		await secureStorage.removeItem(STORAGE_KEY);
		await secureStorage.removeItem(APP_LOCK_SECRET_KEY);
		appLockSecretRef.current = null;
		setAppLockEnabled(false);
		setIsAppLocked(false);
		setState(defaultState);
	}, []);

	const value = React.useMemo<AppContextType>(
		() => ({
			...state,
			networkStatus,
			isOffline: networkStatus === 'offline',
			isOnline: networkStatus === 'online',
			appLockEnabled,
			appLockReady,
			isAppLocked,
			refreshNetworkStatus,
			setAge,
			setNeeds,
			setGoals,
			setLifeSituation,
			toggleDiscreteMode,
			toggleOralMode,
			completeOnboarding,
			completeTutorial,
			setConsent,
			setLanguage,
			toggleFavorite,
			isFavorite,
			setPrivacyConcern,
			addCycleNotification,
			markNotificationRead,
			deleteNotification,
			clearNotifications,
			unreadCount,
			addJournalEntry,
			updateJournalEntry,
			deleteJournalEntry,
			updateUserProfile,
			setHasSeenWelcome,
			addFeedback,
			saveOrientation,
			clearOrientation,
			saveSensitiveOrientation,
			clearSensitiveOrientation,
			setNotificationPreferences,
			setQuickAccessItems,
			trackGlossaryView,
			updateCycleData,
			setPersonalization,
			setAppLockCode,
			disableAppLock,
			unlockApp,
			lockApp,
			resetAppState,
		}),
		[
			state,
			unreadCount,
			isFavorite,
			resetAppState,
			networkStatus,
			refreshNetworkStatus,
			appLockEnabled,
			appLockReady,
			isAppLocked,
			setAppLockCode,
			disableAppLock,
			unlockApp,
			lockApp,
		]
	);

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
	const context = React.useContext(AppContext);

	if (context === undefined) {
		throw new Error('useApp must be used within an AppProvider');
	}

	return context;
}
