import type { DailyLog, PersonalizationContext, SymptomId } from '../context/appcontext';

type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal-early' | 'luteal-late';

export interface PredictiveNotification {
	messageFr: string;
	messageWo: string;
	metaphorFr: string;
	metaphorWo: string;
	symptomIds: SymptomId[];
}

export type SymptomDefinition = {
	id: SymptomId;
	icon: string;
	labelFr: string;
	labelWo: string;
	category: 'physical' | 'hormonal' | 'emotional';
};

export const SYMPTOM_DEFINITIONS: SymptomDefinition[] = [
	{ id: 'cramps', icon: '🌀', labelFr: 'Crampes', labelWo: 'Metit bu jex', category: 'physical' },
	{ id: 'back-pain', icon: '🦴', labelFr: 'Mal de dos', labelWo: 'Metit gu gannaaw', category: 'physical' },
	{ id: 'bloating', icon: '🌿', labelFr: 'Ballonnements', labelWo: 'Biir buy fees', category: 'physical' },
	{ id: 'breast-pain', icon: '💮', labelFr: 'Douleur aux seins', labelWo: 'Metit ci dënn', category: 'physical' },
	{ id: 'headache', icon: '💫', labelFr: 'Mal de tete', labelWo: 'Metit bu bopp', category: 'physical' },
	{ id: 'fatigue', icon: '😴', labelFr: 'Fatigue', labelWo: 'Sonno', category: 'physical' },
	{ id: 'nausea', icon: '🌊', labelFr: 'Nausees', labelWo: 'Mer', category: 'physical' },
	{ id: 'acne', icon: '✨', labelFr: 'Acne', labelWo: 'Buttons', category: 'hormonal' },
	{ id: 'cravings', icon: '🍽️', labelFr: 'Envies alimentaires', labelWo: 'Begg lekk', category: 'hormonal' },
	{ id: 'insomnia', icon: '🌙', labelFr: 'Insomnie', labelWo: 'Nelawul', category: 'hormonal' },
	{ id: 'mood-swings', icon: '🎭', labelFr: 'Sautes d’humeur', labelWo: 'Xel buy soppeeku', category: 'emotional' },
	{ id: 'irritability', icon: '⚡', labelFr: 'Irritabilite', labelWo: 'Mer bu gaaw', category: 'emotional' },
];

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function toDateOnly(value: Date): Date {
	return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function getCyclePhase(day: number): CyclePhase {
	if (day <= 5) return 'menstrual';
	if (day >= 12 && day <= 16) return 'ovulation';
	if (day >= 6 && day <= 13) return 'follicular';
	if (day >= 17 && day <= 21) return 'luteal-early';
	return 'luteal-late';
}

function getCycleDayFromDate(date: Date, lastPeriodDate: string, cycleLength: number): number | null {
	const start = new Date(lastPeriodDate);
	if (Number.isNaN(start.getTime()) || cycleLength <= 0) {
		return null;
	}

	const startDay = toDateOnly(start).getTime();
	const targetDay = toDateOnly(date).getTime();
	const diffDays = Math.floor((targetDay - startDay) / ONE_DAY_MS);

	if (diffDays < 0) {
		return null;
	}

	return ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
}

export function calculateCycleDay(lastPeriodDate: string | null, cycleLength: number): number | null {
	if (!lastPeriodDate) {
		return null;
	}

	return getCycleDayFromDate(new Date(), lastPeriodDate, cycleLength);
}

export function getPredictiveNotificationsForDay(cycleDay: number): PredictiveNotification[] {
	if (cycleDay <= 0) {
		return [];
	}

	if (cycleDay <= 3) {
		return [
			{
				messageFr: 'Ton energie peut etre plus basse aujourd\'hui. Repose-toi si possible.',
				messageWo: 'Sa doole man naa wacc tey. Noppalu bu fekkee ne man nga ko def.',
				metaphorFr: 'Comme la terre apres la pluie, ton corps se regenere.',
				metaphorWo: 'Mel ni suuf su tawee, sa yaram dafa dellusi doole.',
				symptomIds: ['cramps', 'fatigue', 'back-pain'],
			},
			{
				messageFr: 'Hydrate-toi bien, cela peut soulager certaines sensations.',
				messageWo: 'Naan ndox bu baax, loolu man naa yombal ay metit.',
				metaphorFr: 'L\'eau douce calme la chaleur du jour.',
				metaphorWo: 'Ndox mu lewet day dolli dal ci bakan.',
				symptomIds: ['headache', 'bloating'],
			},
		];
	}

	if (cycleDay >= 12 && cycleDay <= 16) {
		return [
			{
				messageFr: 'Ta vitalite peut monter. Profite-en pour tes activites importantes.',
				messageWo: 'Sa kàttan man naa yokku. Jariñ ko ngir sa liggeey yu am solo.',
				metaphorFr: 'Le soleil est au zenith, ton elan aussi.',
				metaphorWo: 'Janta bi dafa ci kaw, sa doole itam dafa yokku.',
				symptomIds: ['acne', 'cravings', 'mood-swings'],
			},
		];
	}

	if (cycleDay >= 20) {
		return [
			{
				messageFr: 'Ton corps annonce peut-etre un changement de phase. Sois douce avec toi.',
				messageWo: 'Sa yaram man naa doon waajal beneen jamono. Defal sa bopp lu lewet.',
				metaphorFr: 'Le vent tourne avant la prochaine saison.',
				metaphorWo: 'Ngelaw li day soppi bala jamono ji topp.',
				symptomIds: ['mood-swings', 'bloating', 'breast-pain', 'irritability'],
			},
			{
				messageFr: 'Un peu de sommeil en plus peut faire une vraie difference aujourd\'hui.',
				messageWo: 'Noppalu lu gën man naa la jariñ lool tey.',
				metaphorFr: 'La nuit soigne ce que le jour fatigue.',
				metaphorWo: 'Guddi day faj lu bëccëg sonal.',
				symptomIds: ['fatigue', 'insomnia', 'headache'],
			},
		];
	}

	return [
		{
			messageFr: 'Continue ton rythme, ton corps avance pas a pas.',
			messageWo: 'Dëppoo ak sa doxalin, sa yaram dafay jëfandikoo ndank ndank.',
			metaphorFr: 'Le baobab grandit en silence, jour apres jour.',
			metaphorWo: 'Guy gi day mag ci jamm, bés bu nekk.',
			symptomIds: ['fatigue', 'headache'],
		},
	];
}

export function analyzeSymptomPatterns(
	dailyLogs: Record<string, DailyLog>,
	lastPeriodDate: string | null,
	cycleLength: number
): {
	commonSymptoms: SymptomId[];
	cyclePhasePatterns: Record<CyclePhase, SymptomId[]>;
} {
	const phaseSymptoms: Record<CyclePhase, Map<SymptomId, number>> = {
		menstrual: new Map(),
		follicular: new Map(),
		ovulation: new Map(),
		'luteal-early': new Map(),
		'luteal-late': new Map(),
	};

	const symptomCounts = new Map<SymptomId, number>();

	if (!lastPeriodDate || cycleLength <= 0) {
		return {
			commonSymptoms: [],
			cyclePhasePatterns: {
				menstrual: [],
				follicular: [],
				ovulation: [],
				'luteal-early': [],
				'luteal-late': [],
			},
		};
	}

	Object.entries(dailyLogs).forEach(([dateKey, log]) => {
		const parsedDate = new Date(dateKey);
		const cycleDay = getCycleDayFromDate(parsedDate, lastPeriodDate, cycleLength);

		if (!cycleDay || Number.isNaN(parsedDate.getTime()) || !log.symptoms?.length) {
			return;
		}

		const phase = getCyclePhase(cycleDay);
		log.symptoms.forEach(({ symptomId }) => {
			symptomCounts.set(symptomId, (symptomCounts.get(symptomId) || 0) + 1);
			phaseSymptoms[phase].set(symptomId, (phaseSymptoms[phase].get(symptomId) || 0) + 1);
		});
	});

	const commonSymptoms = [...symptomCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([symptomId]) => symptomId);

	const cyclePhasePatterns: Record<CyclePhase, SymptomId[]> = {
		menstrual: [],
		follicular: [],
		ovulation: [],
		'luteal-early': [],
		'luteal-late': [],
	};

	(Object.keys(phaseSymptoms) as CyclePhase[]).forEach((phase) => {
		cyclePhasePatterns[phase] = [...phaseSymptoms[phase].entries()]
			.filter(([, count]) => count >= 1)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([symptomId]) => symptomId);
	});

	return { commonSymptoms, cyclePhasePatterns };
}

export function adaptNotificationTone(
	message: string,
	language: 'fr' | 'wo',
	personalization: PersonalizationContext
): string {
	if (language === 'wo') {
		return message;
	}

	switch (personalization.preferredTone) {
		case 'formal':
			return `Information: ${message}`;
		case 'friendly':
			return `Coucou, ${message}`;
		case 'sisterly':
			return `Ma soeur, ${message}`;
		default:
			return message;
	}
}
