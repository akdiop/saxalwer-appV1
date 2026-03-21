import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SensitiveContent from '../../components/SensitiveContent';
import { useApp, type NotificationPreferences } from '../../context/appcontext';
import { ARTICLES } from '../../data/articles';

const COLORS = {
	bg: '#FDFAF5',
	deepGreen: '#1A3C34',
	copper: '#B5622A',
	cocoa: '#4A2F27',
};

type PrefKey = keyof Pick<
	NotificationPreferences,
	'cycles' | 'contraception' | 'articleOfDay' | 'dailyTip' | 'symptomLog' | 'orientation'
>;

const PREF_KEYS: PrefKey[] = [
	'cycles',
	'contraception',
	'articleOfDay',
	'dailyTip',
	'symptomLog',
	'orientation',
];

export default function ProfilePage() {
	const router = useRouter();
	const {
		language,
		userProfile,
		updateUserProfile,
		favorites,
		notificationPreferences,
		setNotificationPreferences,
		discreteMode,
		toggleDiscreteMode,
		oralMode,
		toggleOralMode,
		clearNotifications,
		unreadCount,
	} = useApp();

	const wo = language === 'wo';
	const favoriteArticles = ARTICLES.filter((a) => favorites.includes(a.id)).slice(0, 5);

	function togglePref(key: PrefKey) {
		setNotificationPreferences({
			...notificationPreferences,
			[key]: !notificationPreferences[key],
		});
	}

	function cycleLanguage() {
		updateUserProfile({
			personality: userProfile.personality || 'balanced',
		});
	}

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Pressable onPress={() => router.back()} style={styles.backBtn}>
						<Feather name="chevron-left" size={20} color={COLORS.deepGreen} />
					</Pressable>
					<View style={{ flex: 1 }}>
						<Text style={styles.title}>{wo ? 'Sama Profil' : 'Mon Profil'}</Text>
						<Text style={styles.subtitle}>{wo ? 'Jëfandikoo ak réglages' : 'Préférences et réglages'}</Text>
					</View>
					<Pressable style={styles.editBtn} onPress={() => router.push('/edit-profile' as any)}>
						<Feather name="edit-3" size={14} color={COLORS.deepGreen} />
					</Pressable>
				</View>

				<SensitiveContent
					masked={discreteMode}
					label={wo ? 'Xibaar bi dafa nebb' : 'Informations masquées'}
					style={styles.sensitiveBlock}
				>
					<View style={styles.profileCard}>
						<View style={styles.avatar}>
							<Text style={styles.avatarText}>{(userProfile.name || 'S').slice(0, 1).toUpperCase()}</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={styles.name}>{userProfile.name || (wo ? 'Jigeen bu am doole' : 'Femme forte')}</Text>
							<Text style={styles.meta}>{userProfile.location || (wo ? 'Sénégal' : 'Sénégal')}</Text>
							<Text style={styles.meta}>{userProfile.birthdate || (wo ? 'Bañ nañ ko' : 'Date non renseignée')}</Text>
						</View>
					</View>
				</SensitiveContent>

				<Section title={wo ? 'Mode & confidentialité' : 'Mode & confidentialité'}>
					<ToggleRow label={wo ? 'Mode discret' : 'Mode discret'} value={discreteMode} onPress={toggleDiscreteMode} />
					<ToggleRow label={wo ? 'Mode oral' : 'Mode oral'} value={oralMode} onPress={toggleOralMode} />
				</Section>

				<Section title={wo ? 'Notifications' : 'Notifications'}>
					<View style={styles.notificationTopRow}>
						<Text style={styles.sectionSmallText}>
							{wo ? `${unreadCount} xibaar bu jàngul` : `${unreadCount} notifications non lues`}
						</Text>
						<Pressable onPress={clearNotifications}>
							<Text style={styles.clearText}>{wo ? 'Far lépp' : 'Tout effacer'}</Text>
						</Pressable>
					</View>
					{PREF_KEYS.map((key) => (
						<ToggleRow
							key={key}
							label={
								key === 'articleOfDay'
									? wo
										? 'Jàngale bés bi'
										: 'Article du jour'
									: key === 'dailyTip'
										? wo
											? 'Pexe bés bu ne'
											: 'Conseil quotidien'
										: key === 'symptomLog'
											? wo
												? 'Jotay yaram'
												: 'Journal de symptômes'
											: key === 'contraception'
												? 'Contraception'
												: key === 'orientation'
													? 'Orientation'
													: wo
														? 'Cycle'
														: 'Cycle'
							}
							value={notificationPreferences[key]}
							onPress={() => togglePref(key)}
						/>
					))}
				</Section>

				<Section title={wo ? 'Favoris' : 'Favoris'}>
					{favoriteArticles.length === 0 ? (
						<View style={styles.emptyBox}>
							<Feather name="heart" size={20} color="rgba(74,47,39,0.35)" />
							<Text style={styles.emptyText}>{wo ? 'Amul favoris' : 'Aucun favori pour le moment'}</Text>
						</View>
					) : (
						favoriteArticles.map((article) => (
							<SensitiveContent
								key={article.id}
								masked={discreteMode}
								label={wo ? 'Favori bi nebb na' : 'Favori masqué'}
								style={styles.sensitiveBlock}
							>
								<Pressable
									style={styles.favoriteRow}
									onPress={() => router.push(`/bibliotheque/${article.id}` as any)}
								>
									<View style={{ flex: 1 }}>
										<Text style={styles.favoriteTitle}>{wo ? article.titleWo : article.title}</Text>
										<Text style={styles.favoriteMeta}>{article.category} · {article.readTime}</Text>
									</View>
									<Feather name="chevron-right" size={16} color="rgba(74,47,39,0.35)" />
								</Pressable>
							</SensitiveContent>
						))
					)}
				</Section>

				<Section title={wo ? 'Navigation rapide' : 'Navigation rapide'}>
					<View style={styles.actionsRow}>
						<ActionItem label={wo ? 'Orientation sensible' : 'Orientation sensible'} icon="shield" onPress={() => router.push('/orientation-sensible' as any)} />
						<ActionItem label={wo ? 'Orientation' : 'Orientation'} icon="compass" onPress={() => router.push('/orientation' as any)} />
						<ActionItem label={wo ? 'Messages' : 'Chat'} icon="message-circle" onPress={() => router.push('/chat' as any)} />
						<ActionItem label={wo ? 'Langue' : 'Langue'} icon="globe" onPress={cycleLanguage} />
					</View>
				</Section>
			</ScrollView>
		</SafeAreaView>
	);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>{title}</Text>
			{children}
		</View>
	);
}

function ToggleRow({ label, value, onPress }: { label: string; value: boolean; onPress: () => void }) {
	return (
		<Pressable style={styles.toggleRow} onPress={onPress}>
			<Text style={styles.toggleLabel}>{label}</Text>
			<View style={[styles.switchBase, value && styles.switchBaseActive]}>
				<View style={[styles.switchKnob, value && styles.switchKnobActive]} />
			</View>
		</Pressable>
	);
}

function ActionItem({ label, icon, onPress }: { label: string; icon: React.ComponentProps<typeof Feather>['name']; onPress: () => void }) {
	return (
		<Pressable style={styles.action} onPress={onPress}>
			<Feather name={icon} size={16} color={COLORS.deepGreen} />
			<Text style={styles.actionText}>{label}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: COLORS.bg },
	content: { padding: 22, paddingBottom: 110, gap: 12 },
	header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
	backBtn: {
		width: 40,
		height: 40,
		borderRadius: 12,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.05)',
	},
	editBtn: {
		width: 36,
		height: 36,
		borderRadius: 10,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: 'rgba(26,60,52,0.12)',
	},
	title: { fontSize: 28, fontWeight: '700', color: COLORS.deepGreen },
	subtitle: { fontSize: 12, color: 'rgba(74,47,39,0.6)', marginTop: 2 },
	profileCard: {
		backgroundColor: '#fff',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.05)',
		padding: 14,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	avatar: {
		width: 52,
		height: 52,
		borderRadius: 16,
		backgroundColor: 'rgba(181,98,42,0.18)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarText: { color: COLORS.copper, fontSize: 20, fontWeight: '700' },
	name: { color: COLORS.deepGreen, fontSize: 16, fontWeight: '700' },
	meta: { color: 'rgba(74,47,39,0.65)', fontSize: 12, marginTop: 2 },
	section: {
		backgroundColor: '#fff',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.05)',
		padding: 14,
		gap: 10,
	},
	sensitiveBlock: {
		position: 'relative',
	},
	sectionTitle: {
		fontSize: 11,
		fontWeight: '700',
		color: 'rgba(74,47,39,0.58)',
		textTransform: 'uppercase',
		letterSpacing: 1.1,
	},
	sectionSmallText: { fontSize: 12, color: 'rgba(74,47,39,0.7)' },
	clearText: { fontSize: 12, color: COLORS.copper, fontWeight: '600' },
	notificationTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
	toggleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRadius: 10,
		backgroundColor: 'rgba(26,60,52,0.04)',
		borderWidth: 1,
		borderColor: 'rgba(26,60,52,0.08)',
		paddingVertical: 10,
		paddingHorizontal: 12,
	},
	toggleLabel: { color: COLORS.deepGreen, fontSize: 13, fontWeight: '600' },
	switchBase: {
		width: 42,
		height: 24,
		borderRadius: 99,
		backgroundColor: 'rgba(74,47,39,0.25)',
		justifyContent: 'center',
		paddingHorizontal: 3,
	},
	switchBaseActive: { backgroundColor: 'rgba(181,98,42,0.7)' },
	switchKnob: {
		width: 18,
		height: 18,
		borderRadius: 99,
		backgroundColor: '#fff',
	},
	switchKnobActive: { alignSelf: 'flex-end' },
	favoriteRow: {
		borderRadius: 10,
		backgroundColor: 'rgba(26,60,52,0.04)',
		borderWidth: 1,
		borderColor: 'rgba(26,60,52,0.08)',
		paddingVertical: 10,
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	favoriteTitle: { color: COLORS.deepGreen, fontSize: 13, fontWeight: '600' },
	favoriteMeta: { color: 'rgba(74,47,39,0.62)', fontSize: 11, marginTop: 2 },
	emptyBox: {
		borderRadius: 10,
		backgroundColor: 'rgba(26,60,52,0.04)',
		borderWidth: 1,
		borderColor: 'rgba(26,60,52,0.08)',
		paddingVertical: 16,
		alignItems: 'center',
	},
	emptyText: { marginTop: 8, color: 'rgba(74,47,39,0.58)', fontSize: 12 },
	actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
	action: {
		borderRadius: 10,
		borderWidth: 1,
		borderColor: 'rgba(26,60,52,0.12)',
		backgroundColor: '#fff',
		paddingHorizontal: 10,
		paddingVertical: 8,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	actionText: { color: COLORS.deepGreen, fontSize: 12, fontWeight: '600' },
});
