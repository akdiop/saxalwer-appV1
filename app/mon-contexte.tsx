import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React from 'react';
import {
	Alert,
	Animated,
	Easing,
	Pressable,
	SafeAreaView,
	ScrollView,
	Share,
	StyleSheet,
	Switch,
	Text,
	useWindowDimensions,
	View,
} from 'react-native';

import BackButton from '../components/BackButton';
import { useApp, type Language } from '../context/appcontext';

const BASE = {
	beige: '#F5F1E6',
	deepGreen: '#1A3C34',
	terracotta: '#A65D40',
	copper: '#B5622A',
	cocoa: '#4A2F27',
	gold: '#D4AF37',
	white: '#FFFFFF',
};

type Copy = {
	title: string;
	subtitle: string;
	sections: {
		life: string;
		learning: string;
		discrete: string;
		profile: string;
		sensitive: string;
	};
	buttons: {
		edit: string;
		export: string;
		notifications: string;
		clearSensitive: string;
	};
	labels: {
		active: string;
		inactive: string;
		blurredPages: string;
		lastUpdated: string;
		privacySupport: string;
		inferredProfile: string;
		oral: string;
		notSet: string;
		notApplicable: string;
		resetConfirmTitle: string;
		resetConfirmBody: string;
		cancel: string;
		confirm: string;
		exportTitle: string;
		sensitiveEmpty: string;
	};
	values: {
		ageRange: string;
		livingContext: string;
		privacyLevel: string;
		socialNorms: string;
		educationLevel: string;
		preferredTone: string;
		audioPreference: string;
		needsSupport: string;
		personality: string;
		maritalStatus: string;
		religiousFaith: string;
		desireChildren: string;
		contraception: string;
		healthConditions: string;
		sensitiveLevel: string;
		riskDimensions: string;
		privacyRisk: string;
	};
	meta: {
		privacyModes: Record<'low' | 'medium' | 'high' | 'very-high', string>;
	};
};

const COPY: Record<Language, Copy> = {
	fr: {
		title: 'Mon contexte',
		subtitle: 'Tes réglages de vie, d’apprentissage et de confidentialité regroupés dans un seul espace.',
		sections: {
			life: 'Mon contexte de vie',
			learning: 'Paramètres d’apprentissage',
			discrete: 'Mode discret',
			profile: 'Profil estimé',
			sensitive: 'Orientation sensible',
		},
		buttons: {
			edit: 'Modifier mon contexte',
			export: 'Exporter mon profil',
			notifications: 'Paramètres de notification',
			clearSensitive: 'Effacer l’orientation sensible',
		},
		labels: {
			active: 'Actif',
			inactive: 'Inactif',
			blurredPages: 'Pages sensibles protégées',
			lastUpdated: 'Réglé le',
			privacySupport: 'Ton niveau de confidentialité peut activer automatiquement la discrétion dans l’app.',
			inferredProfile: 'Ces informations sont déduites de tes réponses actuelles et restent modifiables.',
			oral: 'Lecture vocale active',
			notSet: 'Non renseigné',
			notApplicable: 'Non applicable',
			resetConfirmTitle: 'Effacer l’orientation sensible ?',
			resetConfirmBody: 'Cette action supprimera le dernier résultat enregistré.',
			cancel: 'Annuler',
			confirm: 'Effacer',
			exportTitle: 'Profil SaxalWér',
			sensitiveEmpty: 'Aucune orientation sensible enregistrée pour le moment.',
		},
		values: {
			ageRange: 'Tranche d`âge',
			livingContext: 'Je vis',
			privacyLevel: 'Niveau de confidentialité',
			socialNorms: 'Normes sociales',
			educationLevel: 'Niveau d`éducation',
			preferredTone: 'Ton préféré',
			audioPreference: 'Préférence audio',
			needsSupport: 'Besoin de support',
			personality: 'Personnalité suggérée',
			maritalStatus: 'Situation familiale',
			religiousFaith: 'Repère culturel ou spirituel',
			desireChildren: 'Projet d`enfants',
			contraception: 'Contraception',
			healthConditions: 'Profil santé',
			sensitiveLevel: 'Niveau détecté',
			riskDimensions: 'Dimensions suivies',
			privacyRisk: 'Risque de confidentialité',
		},
		meta: {
			privacyModes: {
				low: 'Faible',
				medium: 'Modéré',
				high: 'Élevé',
				'very-high': 'Très élevé',
			},
		},
	},
	wo: {
		title: 'Sama contexte',
		subtitle: 'Fi la ñu dajale sa dund, sa jàng ak sa sutura ci benn bereb.',
		sections: {
			life: 'Sama contexte dund',
			learning: 'Paramètres jàng',
			discrete: 'Mode bu sutura',
			profile: 'Profil bu ñu xalaat',
			sensitive: 'Orientation sensible',
		},
		buttons: {
			edit: 'Soppi sama contexte',
			export: 'Yebal sama profil',
			notifications: 'Paramètres notification',
			clearSensitive: 'Far orientation sensible bi',
		},
		labels: {
			active: 'Dox na',
			inactive: 'Taxaw na',
			blurredPages: 'Xët yu sutura yi',
			lastUpdated: 'Ñu réglé ko',
			privacySupport: 'Niveau sutura bi man naa taal mode discret bi ci app bi.',
			inferredProfile: 'Xibaar yii jóge na ci sa tontu yi, te mën nga leen soppi.',
			oral: 'Lecture vocal bi dox na',
			notSet: 'Amul benn xibaar',
			notApplicable: 'Jëmul fii',
			resetConfirmTitle: 'Far orientation sensible bi ?',
			resetConfirmBody: 'Jëf jii dina far résultat bu mujj bi ñu denc.',
			cancel: 'Bayyi',
			confirm: 'Far',
			exportTitle: 'Profil SaxalWér',
			sensitiveEmpty: 'Amul orientation sensible bu ñu denc fii leegi.',
		},
		values: {
			ageRange: 'At yi',
			livingContext: 'Fan laa dund',
			privacyLevel: 'Niveau sutura',
			socialNorms: 'Aada ak yoon',
			educationLevel: 'Niveau jàng',
			preferredTone: 'Ton bi nga bëgg',
			audioPreference: 'Bëgg-bëgg audio',
			needsSupport: 'Soxla ndimbal',
			personality: 'Personnalité bu ñu xalaat',
			maritalStatus: 'Nekkin njaboot',
			religiousFaith: 'Tënk ci cosaan walla gëm-gëm',
			desireChildren: 'Xalaat doom',
			contraception: 'Contraception',
			healthConditions: 'Profil wér',
			sensitiveLevel: 'Niveau bi ñu gis',
			riskDimensions: 'Wàll yi ñuy topp',
			privacyRisk: 'Risku sutura',
		},
		meta: {
			privacyModes: {
				low: 'Ndaw',
				medium: 'Diggante',
				high: 'Kawe',
				'very-high': 'Kawe lool',
			},
		},
	},
};

const LIFE_FIELD_META = [
	{ key: 'ageRange', icon: 'calendar-outline', emoji: '🕊️' },
	{ key: 'livingContext', icon: 'home-outline', emoji: '🏠' },
	{ key: 'privacyLevel', icon: 'shield-checkmark-outline', emoji: '🔒' },
	{ key: 'socialNorms', icon: 'people-outline', emoji: '🌍' },
] as const;

const LEARNING_FIELD_META = [
	{ key: 'educationLevel', icon: 'school-outline', emoji: '📚' },
	{ key: 'preferredTone', icon: 'chatbubble-ellipses-outline', emoji: '🗣️' },
	{ key: 'audioPreference', icon: 'volume-high-outline', emoji: '🔊' },
	{ key: 'needsSupport', icon: 'heart-outline', emoji: '🤝' },
] as const;

const PROFILE_FIELD_META = [
	{ key: 'personality', icon: 'sparkles-outline' },
	{ key: 'maritalStatus', icon: 'people-circle-outline' },
	{ key: 'religiousFaith', icon: 'leaf-outline' },
	{ key: 'desireChildren', icon: 'flower-outline' },
	{ key: 'contraception', icon: 'shield-outline' },
	{ key: 'healthConditions', icon: 'pulse-outline' },
] as const;

function getLocalizedValue(language: Language, key: string, value: unknown, copy: Copy): string {
	if (value === null || value === undefined || value === '') {
		return copy.labels.notSet;
	}

	if (typeof value === 'boolean') {
		return value ? (language === 'fr' ? 'Oui' : 'Waaw') : (language === 'fr' ? 'Non' : 'Déedéet');
	}

	const stringValue = String(value);
	const maps: Partial<Record<string, Record<string, Record<Language, string>>>> = {
		ageRange: {
			'15-17': { fr: '15-17 ans', wo: '15-17 at' },
			'18-24': { fr: '18-24 ans', wo: '18-24 at' },
			'25-34': { fr: '25-34 ans', wo: '25-34 at' },
			'35-49': { fr: '35-49 ans', wo: '35-49 at' },
			'50+': { fr: '50 ans et +', wo: '50 at ak yokk' },
		},
		livingContext: {
			alone: { fr: 'Seule', wo: 'Maa ngi sama bopp' },
			parents: { fr: 'Avec mes parents', wo: 'Ak sama waajur' },
			partner: { fr: 'Avec mon partenaire', wo: 'Ak sama àndandoo' },
			roommates: { fr: 'En colocation', wo: 'Ak sama colocataire yi' },
			family: { fr: 'En famille', wo: 'Ak sama njaboot' },
		},
		privacyLevel: {
			low: { fr: 'Faible', wo: 'Ndaw' },
			medium: { fr: 'Modéré', wo: 'Diggante' },
			high: { fr: 'Élevé', wo: 'Kawe' },
			'very-high': { fr: 'Très élevé', wo: 'Kawe lool' },
		},
		socialNorms: {
			conservative: { fr: 'Conservatrices', wo: 'Aada yu dëgër' },
			moderate: { fr: 'Modérées', wo: 'Aada yu diggante' },
			open: { fr: 'Ouvertes', wo: 'Ubbeeku' },
		},
		educationLevel: {
			basic: { fr: 'Basique', wo: 'Njàng mu ndaw' },
			intermediate: { fr: 'Intermédiaire', wo: 'Njàng mu diggante' },
			advanced: { fr: 'Avancé', wo: 'Njàng mu kawe' },
		},
		preferredTone: {
			formal: { fr: 'Formel', wo: 'Respectueux' },
			friendly: { fr: 'Amical', wo: 'Xol bu sedd' },
			sisterly: { fr: 'Complice', wo: 'Ni rakk' },
		},
		audioPreference: {
			always: { fr: 'Toujours', wo: 'Saa su nekk' },
			sometimes: { fr: 'Parfois', wo: 'Yenn saa' },
			never: { fr: 'Jamais', wo: 'Mukku' },
		},
	};

	const translated = maps[key]?.[stringValue]?.[language];
	return translated || stringValue;
}

function formatDiscreteUpdatedAt(timestamp: number | null, language: Language, copy: Copy) {
	if (!timestamp) {
		return copy.labels.notSet;
	}

	const locale = language === 'wo' ? 'fr-SN' : 'fr-FR';
	const date = new Date(timestamp);
	const datePart = date.toLocaleDateString(locale, {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
	const timePart = date.toLocaleTimeString(locale, {
		hour: '2-digit',
		minute: '2-digit',
	});

	return `${datePart} · ${timePart}`;
}

function buildExportText(language: Language, copy: Copy, values: Record<string, string>) {
	return [
		copy.labels.exportTitle,
		`${copy.values.ageRange}: ${values.ageRange}`,
		`${copy.values.livingContext}: ${values.livingContext}`,
		`${copy.values.privacyLevel}: ${values.privacyLevel}`,
		`${copy.values.educationLevel}: ${values.educationLevel}`,
		`${copy.values.preferredTone}: ${values.preferredTone}`,
		`${copy.values.audioPreference}: ${values.audioPreference}`,
		`${copy.values.personality}: ${values.personality}`,
		`${copy.values.healthConditions}: ${values.healthConditions}`,
		`${copy.values.contraception}: ${values.contraception}`,
		language === 'fr' ? 'Export généré depuis SaxalWér.' : 'Export bi jóge SaxalWér.',
	].join('\n');
}

export default function MonContexteScreen() {
	const router = useRouter();
	const {
		language,
		personalization,
		userProfile,
		discreteMode,
		oralMode,
		toggleDiscreteMode,
		sensitiveOrientation,
		clearSensitiveOrientation,
	} = useApp();
	const copy = COPY[language];
	const { width } = useWindowDimensions();
	const isWide = width >= 700;
	const entrance = React.useRef(new Animated.Value(0)).current;

	React.useEffect(() => {
		Animated.timing(entrance, {
			toValue: 1,
			duration: 420,
			easing: Easing.out(Easing.cubic),
			useNativeDriver: true,
		}).start();
	}, [entrance]);

	React.useEffect(() => {
		if (!oralMode) {
			return;
		}

		const speechText =
			language === 'fr'
				? 'Mon contexte. Retrouve ici tes réglages de vie, de confidentialité et ton profil estimé.'
				: 'Sama contexte. Fii nga mën a gis sa réglages dund, sutura ak profil bi ñu xalaat.';

		Speech.stop();
		Speech.speak(speechText, {
			language: language === 'fr' ? 'fr-FR' : 'fr-SN',
			rate: 0.92,
		});

		return () => {
			Speech.stop();
		};
	}, [language, oralMode]);

	const localizedValues = {
		ageRange: getLocalizedValue(language, 'ageRange', personalization.ageRange, copy),
		livingContext: getLocalizedValue(language, 'livingContext', personalization.livingContext, copy),
		privacyLevel: getLocalizedValue(language, 'privacyLevel', personalization.privacyLevel, copy),
		socialNorms: getLocalizedValue(language, 'socialNorms', personalization.socialNorms, copy),
		educationLevel: getLocalizedValue(language, 'educationLevel', personalization.educationLevel, copy),
		preferredTone: getLocalizedValue(language, 'preferredTone', personalization.preferredTone, copy),
		audioPreference: getLocalizedValue(language, 'audioPreference', personalization.audioPreference, copy),
		needsSupport: getLocalizedValue(language, 'needsSupport', personalization.needsSupport, copy),
		personality: userProfile.personality || copy.labels.notSet,
		maritalStatus: userProfile.maritalStatus || copy.labels.notSet,
		religiousFaith: userProfile.religiousFaith || copy.labels.notSet,
		desireChildren: userProfile.desireChildren || copy.labels.notSet,
		contraception: userProfile.contraceptionActive
			? userProfile.contraceptionMethod || (language === 'fr' ? 'Méthode active' : 'Méthode bi dox na')
			: language === 'fr'
				? 'Aucune méthode active'
				: 'Amul méthode buy dox',
		healthConditions:
			userProfile.healthConditions.length > 0
				? userProfile.healthConditions.join(language === 'fr' ? ', ' : ' • ')
				: copy.labels.notSet,
		sensitiveLevel:
			sensitiveOrientation.level === 'surveillance'
				? language === 'fr'
					? 'Surveillance'
					: 'Surveillance'
				: sensitiveOrientation.level === 'recommended'
					? language === 'fr'
						? 'Recommandé'
						: 'Digal nañu ko'
					: sensitiveOrientation.level === 'priority'
						? language === 'fr'
							? 'Prioritaire'
							: 'Lu jëkk'
						: copy.labels.notSet,
		riskDimensions:
			sensitiveOrientation.riskDimensions.length > 0
				? sensitiveOrientation.riskDimensions.join(language === 'fr' ? ', ' : ' • ')
				: copy.labels.notSet,
		privacyRisk: getLocalizedValue(language, 'privacyRisk', sensitiveOrientation.privacyRisk, copy),
	};

	const handleExport = async () => {
		try {
			await Share.share({
				title: copy.labels.exportTitle,
				message: buildExportText(language, copy, localizedValues),
			});
		} catch (error) {
			console.error('Failed to export profile', error);
		}
	};

	const handleClearSensitive = () => {
		Alert.alert(copy.labels.resetConfirmTitle, copy.labels.resetConfirmBody, [
			{ text: copy.labels.cancel, style: 'cancel' },
			{ text: copy.labels.confirm, style: 'destructive', onPress: clearSensitiveOrientation },
		]);
	};

	const cardStyle = [styles.valueCard, isWide ? styles.valueCardWide : null];

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<BackButton />

				<Animated.View
					style={[
						styles.heroCard,
						{
							opacity: entrance,
							transform: [
								{
									translateY: entrance.interpolate({
										inputRange: [0, 1],
										outputRange: [14, 0],
									}),
								},
							],
						},
					]}
				>
					<View style={styles.heroIconWrap}>
						<MaterialCommunityIcons name="shield-account-outline" size={28} color={BASE.deepGreen} />
					</View>
					<View style={styles.heroTextWrap}>
						<Text style={styles.heroTitle}>{copy.title}</Text>
						<Text style={styles.heroSubtitle}>{copy.subtitle}</Text>
					</View>
					<View style={styles.heroMetaWrap}>
						<View style={[styles.statusPill, discreteMode ? styles.statusPillActive : null]}>
							<Text style={[styles.statusPillText, discreteMode ? styles.statusPillTextActive : null]}>
								{discreteMode ? copy.labels.active : copy.labels.inactive}
							</Text>
						</View>
						{oralMode ? (
							<Text style={styles.heroMetaText}>{copy.labels.oral}</Text>
						) : null}
					</View>
				</Animated.View>

				<Section title={copy.sections.life} />
				<View style={styles.cardGrid}>
					{LIFE_FIELD_META.map((item, index) => (
						<ValueCard
							key={item.key}
							style={cardStyle}
							icon={item.icon}
							emoji={item.emoji}
							label={copy.values[item.key]}
							value={localizedValues[item.key]}
							description={
								item.key === 'privacyLevel' && personalization.privacyLevel
									? copy.meta.privacyModes[personalization.privacyLevel]
									: undefined
							}
							index={index}
							progress={entrance}
						/>
					))}
				</View>

				<Section title={copy.sections.learning} />
				<View style={styles.cardGrid}>
					{LEARNING_FIELD_META.map((item, index) => (
						<ValueCard
							key={item.key}
							style={cardStyle}
							icon={item.icon}
							emoji={item.emoji}
							label={copy.values[item.key]}
							value={localizedValues[item.key]}
							index={index + 1}
							progress={entrance}
						/>
					))}
				</View>

				<Section title={copy.sections.discrete} />
				<Animated.View
					style={[
						styles.discreteCard,
						{
							opacity: entrance,
							transform: [
								{
									translateY: entrance.interpolate({
										inputRange: [0, 1],
										outputRange: [18, 0],
									}),
								},
							],
						},
					]}
				>
					<View style={styles.discreteTopRow}>
						<View style={styles.discreteCopyWrap}>
							<Text style={styles.discreteTitle}>{copy.sections.discrete}</Text>
							<Text style={styles.discreteDescription}>{copy.labels.privacySupport}</Text>
						</View>
						<Switch
							trackColor={{ false: '#D9D0C4', true: 'rgba(26,60,52,0.36)' }}
							thumbColor={discreteMode ? BASE.deepGreen : BASE.white}
							ios_backgroundColor="#D9D0C4"
							onValueChange={toggleDiscreteMode}
							value={discreteMode}
						/>
					</View>

					<View style={styles.discreteMetaGrid}>
						<MetaStat
							label={copy.labels.blurredPages}
							value={language === 'fr' ? '18 pages' : '18 xët'}
						/>
						<MetaStat
							label={copy.labels.lastUpdated}
							value={formatDiscreteUpdatedAt(null, language, copy)}
						/>
					</View>
				</Animated.View>

				<Section title={copy.sections.profile} />
				<Text style={styles.sectionIntro}>{copy.labels.inferredProfile}</Text>
				<View style={styles.cardGrid}>
					{PROFILE_FIELD_META.map((item, index) => (
						<ValueCard
							key={item.key}
							style={cardStyle}
							icon={item.icon}
							label={copy.values[item.key]}
							value={localizedValues[item.key]}
							index={index + 2}
							progress={entrance}
						/>
					))}
				</View>

				<Section title={copy.sections.sensitive} />
				<View style={styles.sensitiveCard}>
					{sensitiveOrientation.completedAt ? (
						<>
							<SensitiveRow
								label={copy.values.sensitiveLevel}
								value={localizedValues.sensitiveLevel}
							/>
							<SensitiveRow
								label={copy.values.riskDimensions}
								value={localizedValues.riskDimensions}
							/>
							<SensitiveRow
								label={copy.values.privacyRisk}
								value={localizedValues.privacyRisk}
							/>
							<Pressable onPress={handleClearSensitive} style={styles.secondaryAction}>
								<Text style={styles.secondaryActionText}>{copy.buttons.clearSensitive}</Text>
							</Pressable>
						</>
					) : (
						<Text style={styles.sensitiveEmptyText}>{copy.labels.sensitiveEmpty}</Text>
					)}
				</View>

				<View style={styles.actionStack}>
					<Pressable onPress={() => router.push('/onboarding/personnalisation' as never)} style={styles.primaryAction}>
						<Ionicons name="create-outline" size={18} color={BASE.beige} />
						<Text style={styles.primaryActionText}>{copy.buttons.edit}</Text>
					</Pressable>

					<Pressable onPress={handleExport} style={styles.secondaryActionFull}>
						<Ionicons name="share-social-outline" size={18} color={BASE.deepGreen} />
						<Text style={styles.secondaryActionText}>{copy.buttons.export}</Text>
					</Pressable>

						<Pressable onPress={() => router.push('/notifications' as never)} style={styles.secondaryActionFull}>
							<Ionicons name="notifications-outline" size={18} color={BASE.deepGreen} />
							<Text style={styles.secondaryActionText}>{copy.buttons.notifications}</Text>
						</Pressable>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

function Section({ title }: { title: string }) {
	return <Text style={styles.sectionTitle}>{title}</Text>;
}

function ValueCard({
	icon,
	emoji,
	label,
	value,
	description,
	index,
	progress,
	style,
}: {
	icon: keyof typeof Ionicons.glyphMap;
	emoji?: string;
	label: string;
	value: string;
	description?: string;
	index: number;
	progress: Animated.Value;
	style: unknown;
}) {
	return (
		<Animated.View
			style={[
				style as object,
				{
					opacity: progress,
					transform: [
						{
							translateY: progress.interpolate({
								inputRange: [0, 1],
								outputRange: [10 + index * 2, 0],
							}),
						},
					],
				},
			]}
		>
			<View style={styles.cardIconRow}>
				<View style={styles.cardIconWrap}>
					<Ionicons name={icon} size={18} color={BASE.terracotta} />
				</View>
				{emoji ? <Text style={styles.cardEmoji}>{emoji}</Text> : null}
			</View>
			<Text style={styles.cardLabel}>{label}</Text>
			<Text style={styles.cardValue}>{value}</Text>
			{description ? <Text style={styles.cardDescription}>{description}</Text> : null}
		</Animated.View>
	);
}

function MetaStat({ label, value }: { label: string; value: string }) {
	return (
		<View style={styles.metaStatCard}>
			<Text style={styles.metaStatLabel}>{label}</Text>
			<Text style={styles.metaStatValue}>{value}</Text>
		</View>
	);
}

function SensitiveRow({ label, value }: { label: string; value: string }) {
	return (
		<View style={styles.sensitiveRow}>
			<Text style={styles.sensitiveLabel}>{label}</Text>
			<Text style={styles.sensitiveValue}>{value}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: BASE.beige,
	},
	scrollContent: {
		paddingHorizontal: 16,
		paddingTop: 18,
		paddingBottom: 40,
	},
	heroCard: {
		backgroundColor: BASE.white,
		borderRadius: 24,
		padding: 20,
		borderWidth: 1,
		borderColor: 'rgba(74,47,39,0.12)',
		shadowColor: BASE.cocoa,
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.08,
		shadowRadius: 18,
		elevation: 4,
		marginTop: 8,
		marginBottom: 18,
		gap: 14,
	},
	heroIconWrap: {
		width: 52,
		height: 52,
		borderRadius: 26,
		backgroundColor: 'rgba(212,175,55,0.12)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	heroTextWrap: {
		gap: 6,
	},
	heroTitle: {
		fontSize: 30,
		lineHeight: 34,
		fontWeight: '800',
		color: BASE.deepGreen,
	},
	heroSubtitle: {
		fontSize: 14,
		lineHeight: 22,
		color: 'rgba(74,47,39,0.84)',
	},
	heroMetaWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	},
	heroMetaText: {
		fontSize: 12,
		fontWeight: '600',
		color: BASE.deepGreen,
	},
	statusPill: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
		backgroundColor: 'rgba(74,47,39,0.08)',
	},
	statusPillActive: {
		backgroundColor: BASE.deepGreen,
	},
	statusPillText: {
		fontSize: 12,
		fontWeight: '700',
		color: BASE.cocoa,
	},
	statusPillTextActive: {
		color: BASE.beige,
	},
	sectionTitle: {
		fontSize: 22,
		lineHeight: 28,
		fontWeight: '800',
		color: BASE.deepGreen,
		marginTop: 8,
		marginBottom: 10,
	},
	sectionIntro: {
		fontSize: 12,
		lineHeight: 18,
		color: 'rgba(74,47,39,0.8)',
		marginBottom: 12,
	},
	cardGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
		marginBottom: 6,
	},
	valueCard: {
		backgroundColor: 'rgba(212,175,55,0.08)',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: 'rgba(74,47,39,0.16)',
		padding: 14,
		width: '100%',
		minHeight: 122,
	},
	valueCardWide: {
		width: '48%',
	},
	cardIconRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 12,
	},
	cardIconWrap: {
		width: 34,
		height: 34,
		borderRadius: 17,
		backgroundColor: 'rgba(166,93,64,0.12)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	cardEmoji: {
		fontSize: 18,
	},
	cardLabel: {
		fontSize: 13,
		lineHeight: 18,
		fontWeight: '700',
		color: BASE.deepGreen,
		marginBottom: 6,
	},
	cardValue: {
		fontSize: 14,
		lineHeight: 20,
		color: BASE.cocoa,
		fontWeight: '500',
	},
	cardDescription: {
		fontSize: 11,
		lineHeight: 16,
		color: 'rgba(74,47,39,0.72)',
		marginTop: 6,
	},
	discreteCard: {
		backgroundColor: BASE.white,
		borderRadius: 20,
		padding: 16,
		borderWidth: 1,
		borderColor: 'rgba(74,47,39,0.14)',
		marginBottom: 10,
		gap: 14,
	},
	discreteTopRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	},
	discreteCopyWrap: {
		flex: 1,
		gap: 4,
	},
	discreteTitle: {
		fontSize: 16,
		fontWeight: '800',
		color: BASE.deepGreen,
	},
	discreteDescription: {
		fontSize: 12,
		lineHeight: 18,
		color: 'rgba(74,47,39,0.8)',
	},
	discreteMetaGrid: {
		flexDirection: 'row',
		gap: 10,
	},
	metaStatCard: {
		flex: 1,
		borderRadius: 14,
		padding: 12,
		backgroundColor: 'rgba(212,175,55,0.08)',
	},
	metaStatLabel: {
		fontSize: 11,
		lineHeight: 15,
		fontWeight: '700',
		color: 'rgba(26,60,52,0.88)',
		marginBottom: 6,
	},
	metaStatValue: {
		fontSize: 13,
		lineHeight: 18,
		color: BASE.cocoa,
		fontWeight: '600',
	},
	sensitiveCard: {
		backgroundColor: BASE.white,
		borderRadius: 18,
		padding: 16,
		borderWidth: 1,
		borderColor: 'rgba(74,47,39,0.14)',
		gap: 12,
		marginBottom: 8,
	},
	sensitiveRow: {
		gap: 4,
		paddingBottom: 10,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'rgba(74,47,39,0.16)',
	},
	sensitiveLabel: {
		fontSize: 11,
		fontWeight: '700',
		color: 'rgba(26,60,52,0.88)',
	},
	sensitiveValue: {
		fontSize: 14,
		lineHeight: 20,
		color: BASE.cocoa,
	},
	sensitiveEmptyText: {
		fontSize: 13,
		lineHeight: 20,
		color: 'rgba(74,47,39,0.82)',
	},
	actionStack: {
		gap: 10,
		marginTop: 10,
	},
	primaryAction: {
		minHeight: 52,
		borderRadius: 16,
		backgroundColor: BASE.deepGreen,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
	},
	primaryActionText: {
		fontSize: 15,
		fontWeight: '800',
		color: BASE.beige,
	},
	secondaryActionFull: {
		minHeight: 50,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: 'rgba(26,60,52,0.18)',
		backgroundColor: BASE.white,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
	},
	secondaryAction: {
		marginTop: 4,
		minHeight: 44,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: 'rgba(166,93,64,0.24)',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(166,93,64,0.06)',
	},
	secondaryActionText: {
		fontSize: 14,
		fontWeight: '700',
		color: BASE.deepGreen,
	},
});
