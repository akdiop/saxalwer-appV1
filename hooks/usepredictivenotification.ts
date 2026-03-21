import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

import type { NotifCategory } from '../context/appcontext';
import { useApp } from '../context/appcontext';
import {
  adaptNotificationTone,
  analyzeSymptomPatterns,
  calculateCycleDay,
  getPredictiveNotificationsForDay,
} from '../utils/cyclesymptoms';

/**
 * Hook to generate predictive notifications based on cycle day and personalization.
 */
export function usePredictiveNotifications() {
	const {
		cycleData,
		personalization,
		language,
		addCycleNotification,
		notificationPreferences,
		isOnboarded,
	} = useApp();

	useEffect(() => {
		const run = async () => {
			if (!isOnboarded) return;
			if (!notificationPreferences.cycles && !notificationPreferences.predictive) return;

			const cycleDay = calculateCycleDay(cycleData.lastPeriodDate, cycleData.cycleLength);
			if (cycleDay === null) return;

			const predictions = getPredictiveNotificationsForDay(cycleDay);
			if (predictions.length === 0) return;

			const { cyclePhasePatterns } = analyzeSymptomPatterns(
				cycleData.dailyLogs,
				cycleData.lastPeriodDate,
				cycleData.cycleLength
			);

			let currentPhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal-early' | 'luteal-late' =
				'menstrual';
			if (cycleDay >= 6 && cycleDay <= 13) currentPhase = 'follicular';
			if (cycleDay >= 12 && cycleDay <= 16) currentPhase = 'ovulation';
			if (cycleDay >= 17 && cycleDay <= 21) currentPhase = 'luteal-early';
			if (cycleDay >= 22) currentPhase = 'luteal-late';

			const today = new Date().toISOString().split('T')[0];
			const lastSentKey = `predictive_last_sent_${today}`;
			const hasSeenToday = await AsyncStorage.getItem(lastSentKey);
			if (hasSeenToday) return;

			let selectedPrediction = predictions[0];
			if (cyclePhasePatterns[currentPhase]?.length > 0) {
				const matchingPrediction = predictions.find((prediction) =>
					prediction.symptomIds.some((symptomId) =>
						cyclePhasePatterns[currentPhase].includes(symptomId)
					)
				);
				if (matchingPrediction) {
					selectedPrediction = matchingPrediction;
				}
			}

			const message =
				language === 'wo' ? selectedPrediction.messageWo : selectedPrediction.messageFr;
			const metaphor =
				language === 'wo' ? selectedPrediction.metaphorWo : selectedPrediction.metaphorFr;

			const adaptedMessage = adaptNotificationTone(message, language, personalization);
			addCycleNotification(adaptedMessage, metaphor, 'predictive' as NotifCategory);

			await AsyncStorage.setItem(lastSentKey, Date.now().toString());

			const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
			const allKeys = await AsyncStorage.getAllKeys();
			const predictiveKeys = allKeys.filter((key) => key.startsWith('predictive_last_sent_'));

			if (predictiveKeys.length > 0) {
				const values = await AsyncStorage.multiGet(predictiveKeys);
				const staleKeys = values
					.filter(([, value]) => Number.parseInt(value || '0', 10) < sevenDaysAgo)
					.map(([key]) => key);

				if (staleKeys.length > 0) {
					await AsyncStorage.multiRemove(staleKeys);
				}
			}
		};

		void run();
	}, [
		addCycleNotification,
		cycleData.cycleLength,
		cycleData.dailyLogs,
		cycleData.lastPeriodDate,
		isOnboarded,
		language,
		notificationPreferences.cycles,
		notificationPreferences.predictive,
		personalization,
	]);
}
