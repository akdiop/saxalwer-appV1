import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio, InterruptionModeIOS } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { LocationFinder } from '../../components/article/LocationFinder';
import { colors } from '../../constants/colors';
import { useProfileMock } from '../../context/ProfileMockContext';
import { ARTICLES } from '../../data/articles';

type ChatMessageKind = 'text' | 'articles' | 'locations' | 'voice-note' | 'image';

type ChatMessage = {
	id: string;
	role: 'assistant' | 'user';
	kind: ChatMessageKind;
	text?: string;
	articleIds?: number[];
	locationTags?: string[];
	imageUri?: string;
	audioUri?: string;
	createdAtLabel: string;
};

type ChatQuickAction = {
	id: string;
	icon: keyof typeof Ionicons.glyphMap;
	fr: string;
	wo: string;
	prompt: string;
};

type ChatReplyPlan = {
	intro: string;
	articleIds?: number[];
	locationTags?: string[];
	followUps?: string[];
};

const QUICK_ACTIONS: ChatQuickAction[] = [
	{
		id: 'cycle',
		icon: 'calendar-outline',
		fr: 'Cycle irrégulier',
		wo: 'Weer bu bari soppi',
		prompt: 'Mon cycle est irrégulier depuis plusieurs mois.',
	},
	{
		id: 'pain',
		icon: 'fitness-outline',
		fr: 'Douleurs intenses',
		wo: 'Metit yu tar',
		prompt: 'J’ai de fortes douleurs pendant mes règles.',
	},
	{
		id: 'contraception',
		icon: 'shield-checkmark-outline',
		fr: 'Contraception',
		wo: 'Contraception',
		prompt: 'Je veux comprendre les méthodes de contraception.',
	},
	{
		id: 'fertility',
		icon: 'flower-outline',
		fr: 'Fertilité',
		wo: 'Fertilité',
		prompt: 'J’aimerais mieux comprendre ma fertilité.',
	},
	{
		id: 'center',
		icon: 'location-outline',
		fr: 'Trouver un centre',
		wo: 'Gis centre',
		prompt: 'Je cherche un centre de santé proche de moi.',
	},
];

const ARTICLE_KEYWORDS: { keywords: string[]; articleIds: number[]; locationTags?: string[] }[] = [
	{
		keywords: ['cycle', 'regle', 'règle', 'irrégulier', 'irregulier', 'ovulation'],
		articleIds: [1, 6],
		locationTags: ['Planning', 'Gynécologie'],
	},
	{
		keywords: ['contraception', 'pilule', 'implant', 'stérilet', 'sterilet', 'préservatif'],
		articleIds: [3, 2],
		locationTags: ['Contraception', 'Planning'],
	},
	{
		keywords: ['fertilité', 'fertilite', 'bébé', 'grossesse', 'ovulation'],
		articleIds: [5, 6],
		locationTags: ['Fertilité', 'Maternité'],
	},
	{
		keywords: ['douleur', 'douleurs', 'saignement', 'urgence', 'endométriose', 'endometriose'],
		articleIds: [4, 7],
		locationTags: ['Urgences', 'Gynécologie'],
	},
	{
		keywords: ['ist', 'infection', 'dépistage', 'depistage', 'vih'],
		articleIds: [2, 4],
		locationTags: ['IST', 'Dépistage'],
	},
];

const FALLBACK_ARTICLES = [1, 3, 5];

const UI_TEXT = {
	fr: {
		brand: 'SaxalWér Chat',
		title: 'Parle librement, on te guide pas à pas.',
		subtitle:
			'Conseils éducatifs, articles fiables et centres proches. Ce chat ne remplace pas une consultation médicale.',
		secure: 'Espace confidentiel',
		disclaimer: 'En cas de douleur soudaine, saignement abondant ou malaise, cherche une aide médicale rapidement.',
		assistantHello:
			'Bonjour. Décris ce qui t’inquiète, ou choisis une piste ci-dessous. Je peux te proposer des articles utiles et des centres de santé proches.',
		composerPlaceholder: 'Écris ton message...',
		send: 'Envoyer',
		attach: 'Photo',
		record: 'Audio',
		stop: 'Stop',
		play: 'Lire',
		pause: 'Pause',
		speak: 'Écouter',
		speaking: 'Lecture…',
		articlesTitle: 'Articles recommandés',
		centersTitle: 'Centres conseillés',
		followUp: 'Poursuivre avec',
		openArticle: 'Ouvrir',
		imageAlt: 'Image jointe',
		voiceNote: 'Note vocale jointe',
		chipTitle: 'Questions fréquentes',
		emptyInput: 'Écris un message ou choisis une action rapide.',
		mediaPermission: 'L’autorisation d’accéder aux photos a été refusée.',
		micPermission: 'L’autorisation du micro a été refusée.',
		photoError: 'Impossible d’ouvrir la galerie.',
		audioError: 'Impossible d’enregistrer ou de lire l’audio.',
		discrete: 'Mode discret activé',
		oral: 'Mode oral actif',
		you: 'Toi',
		assistant: 'Assistante',
		attachedPhoto: 'J’ai joint une photo pour avoir un avis éducatif.',
		attachedVoice: 'J’ai ajouté une note vocale.',
	},
	wo: {
		brand: 'SaxalWér Chat',
		title: 'Waxal ak dal, dinañu la gindi ndànk-ndànk.',
		subtitle:
			'Ay xelal yu leer, articles yu wóor ak centres yu nekk ci sa wet. Chat bii du wuutu seetlu tabib.',
		secure: 'Bérab bu sutura',
		disclaimer: 'Bu amee metit gu gaaw, saaw bu bari wala malaise, seetal jàppale bu gaaw.',
		assistantHello:
			'Asalaamaalekum. Waxal li la sonal, walla nga tànn benn yoon ci suuf. Man naa la jox articles ak centres yu nekk ci sa wet.',
		composerPlaceholder: 'Bindal sa bataaxal...',
		send: 'Yónnee',
		attach: 'Nataal',
		record: 'Audio',
		stop: 'Taxaw',
		play: 'Dëglu',
		pause: 'Taxaw',
		speak: 'Déglu',
		speaking: 'Jàng mi...',
		articlesTitle: 'Articles yi ñuy laabiire',
		centersTitle: 'Centres yi ñuy laabiire',
		followUp: 'Yeesal ak',
		openArticle: 'Ubbi',
		imageAlt: 'Nataal bu ñu yokk',
		voiceNote: 'Note vocale bu ñu yokk',
		chipTitle: 'Laaj yu bari',
		emptyInput: 'Bindal benn mesaj walla nga tànn benn action.',
		mediaPermission: 'Nataal yi ñu mayul sañ-sañ.',
		micPermission: 'Micro bi ñu mayul sañ-sañ.',
		photoError: 'Manul ubbi galerie bi.',
		audioError: 'Manul enregistrer walla lire audio bi.',
		discrete: 'Mode discret bi dafa dox',
		oral: 'Mode oral bi dafa dox',
		you: 'Yaw',
		assistant: 'Jàppalante',
		attachedPhoto: 'Yokkal naa benn nataal ngir am xelal yu leer.',
		attachedVoice: 'Yokkal naa benn note vocale.',
	},
} as const;

const timestampLabel = () =>
	new Date().toLocaleTimeString('fr-FR', {
		hour: '2-digit',
		minute: '2-digit',
	});

const summarizeHealthProfile = (conditions: string[]) => {
	if (conditions.length === 0) {
		return 'Sans condition renseignée';
	}

	return conditions.slice(0, 2).join(' · ');
};

const buildReplyPlan = (message: string, firstName: string): ChatReplyPlan => {
	const normalized = message
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();

	const matches = ARTICLE_KEYWORDS.filter((entry) =>
		entry.keywords.some((keyword) => normalized.includes(keyword))
	);

	const articleIds = Array.from(
		new Set((matches.length > 0 ? matches : [{ articleIds: FALLBACK_ARTICLES }]).flatMap((entry) => entry.articleIds))
	).slice(0, 3);

	const locationTags = Array.from(
		new Set(matches.flatMap((entry) => entry.locationTags || []))
	);

	const isEmergency = ['urgence', 'sang', 'saignement', 'malaise', 'fièvre', 'fievre'].some(
		(word) => normalized.includes(word)
	);

	const intro = isEmergency
		? `${firstName || 'Toi'}, certains mots dans ton message évoquent une situation qui mérite une attention rapide. Si la douleur est très intense, si tu saignes beaucoup ou si tu te sens faible, consulte sans attendre. En attendant, voici des repères sûrs pour t’orienter.`
		: `${firstName || 'Toi'}, merci pour ton message. Je te propose d’abord des repères simples pour comprendre la situation, puis quelques ressources utiles à lire ou à montrer pendant une consultation.`;

	const followUps = [
		'Quels signes dois-je surveiller ?',
		'Montre-moi un centre proche',
		'Propose un article simple à lire',
	];

	return {
		intro,
		articleIds,
		locationTags,
		followUps,
	};
};

function ChatScreenContent() {
	const router = useRouter();
	const { language, discreteMode, oralMode, firstName, userProfile } = useProfileMock();
	const copy = UI_TEXT[language];

	const [draft, setDraft] = useState('');
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: 'welcome',
			role: 'assistant',
			kind: 'text',
			text: copy.assistantHello,
			createdAtLabel: timestampLabel(),
		},
	]);
	const [isSpeakingMessageId, setIsSpeakingMessageId] = useState<string | null>(null);
	const [recording, setRecording] = useState<Audio.Recording | null>(null);
	const [isRecording, setIsRecording] = useState(false);
	const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
	const soundRef = useRef<Audio.Sound | null>(null);
	const scrollRef = useRef<ScrollView | null>(null);

	useEffect(() => {
		setMessages((prev) => {
			if (prev.length === 0) {
				return prev;
			}

			if (prev[0].id !== 'welcome') {
				return prev;
			}

			return [
				{
					...prev[0],
					text: copy.assistantHello,
				},
				...prev.slice(1),
			];
		});
	}, [copy.assistantHello]);

	useEffect(() => {
		return () => {
			Speech.stop();
			if (soundRef.current) {
				soundRef.current.unloadAsync().catch(() => undefined);
			}
			if (recording) {
				recording.stopAndUnloadAsync().catch(() => undefined);
			}
		};
	}, [recording]);

	const articleMap = useMemo(
		() => new Map(ARTICLES.map((article) => [article.id, article])),
		[]
	);

	const quickPrompts = QUICK_ACTIONS.map((action) => ({
		...action,
		label: language === 'wo' ? action.wo : action.fr,
	}));

	const appendMessages = (nextMessages: ChatMessage[]) => {
		setMessages((prev) => [...prev, ...nextMessages]);
		requestAnimationFrame(() => {
			scrollRef.current?.scrollToEnd({ animated: true });
		});
	};

	const addAssistantPlan = (input: string) => {
		const plan = buildReplyPlan(input, firstName);
		const nextMessages: ChatMessage[] = [
			{
				id: `assistant-text-${Date.now()}`,
				role: 'assistant',
				kind: 'text',
				text: plan.intro,
				createdAtLabel: timestampLabel(),
			},
		];

		if (plan.articleIds && plan.articleIds.length > 0) {
			nextMessages.push({
				id: `assistant-articles-${Date.now()}`,
				role: 'assistant',
				kind: 'articles',
				articleIds: plan.articleIds,
				createdAtLabel: timestampLabel(),
			});
		}

		if (plan.locationTags && plan.locationTags.length > 0) {
			nextMessages.push({
				id: `assistant-locations-${Date.now()}`,
				role: 'assistant',
				kind: 'locations',
				locationTags: plan.locationTags,
				createdAtLabel: timestampLabel(),
			});
		}

		if (plan.followUps && plan.followUps.length > 0) {
			nextMessages.push({
				id: `assistant-followup-${Date.now()}`,
				role: 'assistant',
				kind: 'text',
				text: `${copy.followUp}: ${plan.followUps.join(' • ')}`,
				createdAtLabel: timestampLabel(),
			});
		}

		appendMessages(nextMessages);
	};

	const handleSend = (value?: string) => {
		const nextValue = (value ?? draft).trim();

		if (!nextValue) {
			Alert.alert(copy.brand, copy.emptyInput);
			return;
		}

		appendMessages([
			{
				id: `user-${Date.now()}`,
				role: 'user',
				kind: 'text',
				text: nextValue,
				createdAtLabel: timestampLabel(),
			},
		]);
		setDraft('');
		addAssistantPlan(nextValue);
	};

	const handleQuickPrompt = (prompt: string) => {
		setDraft(prompt);
		handleSend(prompt);
	};

	const handleImageAttach = async () => {
		try {
			const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (!permission.granted) {
				Alert.alert(copy.brand, copy.mediaPermission);
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ['images'],
				quality: 0.7,
				allowsEditing: true,
				aspect: [4, 5],
				base64: false,
			});

			if (result.canceled || result.assets.length === 0) {
				return;
			}

			const asset = result.assets[0];

			appendMessages([
				{
					id: `user-image-${Date.now()}`,
					role: 'user',
					kind: 'image',
					text: copy.attachedPhoto,
					imageUri: asset.uri,
					createdAtLabel: timestampLabel(),
				},
			]);
			addAssistantPlan('photo symptome peau douleur santé reproductive');
		} catch {
			Alert.alert(copy.brand, copy.photoError);
		}
	};

	const stopAudioPlayback = async () => {
		if (soundRef.current) {
			await soundRef.current.stopAsync().catch(() => undefined);
			await soundRef.current.unloadAsync().catch(() => undefined);
			soundRef.current = null;
		}
		setPlayingVoiceId(null);
	};

	const handleVoicePlayback = async (messageId: string, uri: string) => {
		try {
			if (playingVoiceId === messageId) {
				await stopAudioPlayback();
				return;
			}

			await stopAudioPlayback();

			const { sound } = await Audio.Sound.createAsync(
				{ uri },
				{ shouldPlay: true },
				(status) => {
					if ('didJustFinish' in status && status.didJustFinish) {
						setPlayingVoiceId(null);
					}
				}
			);

			soundRef.current = sound;
			setPlayingVoiceId(messageId);
		} catch {
			Alert.alert(copy.brand, copy.audioError);
		}
	};

	const handleRecordToggle = async () => {
		if (isRecording && recording) {
			try {
				await recording.stopAndUnloadAsync();
				const uri = recording.getURI();
				setRecording(null);
				setIsRecording(false);

				if (!uri) {
					return;
				}

				appendMessages([
					{
						id: `user-voice-${Date.now()}`,
						role: 'user',
						kind: 'voice-note',
						text: copy.attachedVoice,
						audioUri: uri,
						createdAtLabel: timestampLabel(),
					},
				]);
				addAssistantPlan('audio symptomes centre article');
			} catch {
				Alert.alert(copy.brand, copy.audioError);
			}
			return;
		}

		try {
			const permission = await Audio.requestPermissionsAsync();
			if (!permission.granted) {
				Alert.alert(copy.brand, copy.micPermission);
				return;
			}

			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
				interruptionModeIOS: InterruptionModeIOS.DoNotMix,
				interruptionModeAndroid: 1,
				shouldDuckAndroid: true,
				playThroughEarpieceAndroid: false,
				staysActiveInBackground: false,
			});

			const nextRecording = new Audio.Recording();
			await nextRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
			await nextRecording.startAsync();

			setRecording(nextRecording);
			setIsRecording(true);
		} catch {
			Alert.alert(copy.brand, copy.audioError);
		}
	};

	const handleSpeakMessage = (messageId: string, text?: string) => {
		if (!text) {
			return;
		}

		if (isSpeakingMessageId === messageId) {
			Speech.stop();
			setIsSpeakingMessageId(null);
			return;
		}

		Speech.stop();
		setIsSpeakingMessageId(messageId);
		Speech.speak(text, {
			language: 'fr-FR',
			rate: 0.86,
			onDone: () => setIsSpeakingMessageId(null),
			onStopped: () => setIsSpeakingMessageId(null),
			onError: () => setIsSpeakingMessageId(null),
		});
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.screen}>
				<View style={styles.heroCard}>
					<View style={styles.heroGlowLarge} />
					<View style={styles.heroGlowSmall} />

					<View style={styles.heroTopRow}>
						<Pressable onPress={() => router.back()} style={styles.iconCircle}>
							<Ionicons name="chevron-back" size={20} color={colors.deepGreen} />
						</Pressable>

						<View style={styles.heroStatusWrap}>
							<View style={styles.securityPill}>
								<Ionicons name="shield-checkmark" size={12} color={colors.white} />
								<Text style={styles.securityPillText}>{copy.secure}</Text>
							</View>
						</View>
					</View>

					<Text style={styles.brand}>{copy.brand}</Text>
					<Text style={styles.heroTitle}>{copy.title}</Text>
					<Text style={styles.heroSubtitle}>{copy.subtitle}</Text>

					<View style={styles.contextRow}>
						<View style={styles.contextPill}>
							<Ionicons name="person-outline" size={12} color={colors.deepGreen} />
							<Text style={styles.contextPillText}>{firstName || 'Aida'}</Text>
						</View>
						<View style={styles.contextPill}>
							<MaterialCommunityIcons name="heart-pulse" size={12} color={colors.deepGreen} />
							<Text style={styles.contextPillText}>{summarizeHealthProfile(userProfile.healthConditions)}</Text>
						</View>
					</View>

					<View style={styles.flagRow}>
						{discreteMode && (
							<View style={[styles.modePill, styles.modePillStrong]}>
								<Ionicons name="eye-off-outline" size={12} color={colors.white} />
								<Text style={styles.modePillStrongText}>{copy.discrete}</Text>
							</View>
						)}

						{oralMode && (
							<View style={styles.modePill}>
								<Ionicons name="volume-high-outline" size={12} color={colors.deepGreen} />
								<Text style={styles.modePillText}>{copy.oral}</Text>
							</View>
						)}
					</View>
				</View>

				<View style={styles.disclaimerCard}>
					<Ionicons name="warning-outline" size={18} color={colors.terracotta} />
					<Text style={styles.disclaimerText}>{copy.disclaimer}</Text>
				</View>

				<View style={styles.quickActionsBlock}>
					<Text style={styles.quickActionsTitle}>{copy.chipTitle}</Text>
					<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsRow}>
						{quickPrompts.map((action) => (
							<Pressable
								key={action.id}
								style={({ pressed }) => [styles.quickActionChip, pressed && styles.quickActionChipPressed]}
								onPress={() => handleQuickPrompt(action.prompt)}
							>
								<View style={styles.quickActionIconWrap}>
									<Ionicons name={action.icon} size={15} color={colors.copper} />
								</View>
								<Text style={styles.quickActionLabel}>{action.label}</Text>
							</Pressable>
						))}
					</ScrollView>
				</View>

				<View style={[styles.chatSurface, discreteMode && styles.chatSurfaceDiscrete]}>
					<ScrollView
						ref={scrollRef}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.messagesContent}
					>
						{messages.map((message) => {
							const isUser = message.role === 'user';
							const label = isUser ? copy.you : copy.assistant;
							const linkedArticles = (message.articleIds || [])
								.map((id) => articleMap.get(id))
								.filter((article): article is NonNullable<typeof article> => Boolean(article));

							return (
								<View key={message.id} style={[styles.messageWrap, isUser && styles.messageWrapUser]}>
									<View style={[styles.messageBubble, isUser ? styles.messageBubbleUser : styles.messageBubbleAssistant]}>
										<View style={styles.messageHeaderRow}>
											<Text style={[styles.messageRole, isUser && styles.messageRoleUser]}>{label}</Text>
											<Text style={[styles.messageTime, isUser && styles.messageTimeUser]}>{message.createdAtLabel}</Text>
										</View>

										{!!message.text && <Text style={[styles.messageText, isUser && styles.messageTextUser]}>{message.text}</Text>}

										{message.kind === 'image' && message.imageUri && (
											<View style={styles.attachmentBlock}>
												<Image source={{ uri: message.imageUri }} style={styles.imageAttachment} />
												<Text style={[styles.attachmentLabel, isUser && styles.attachmentLabelUser]}>{copy.imageAlt}</Text>
											</View>
										)}

										{message.kind === 'voice-note' && message.audioUri && (
											<View style={styles.voiceCard}>
												<View style={styles.voiceMeta}>
													<Ionicons name="mic-outline" size={16} color={isUser ? colors.white : colors.deepGreen} />
													<Text style={[styles.voiceLabel, isUser && styles.voiceLabelUser]}>{copy.voiceNote}</Text>
												</View>
												<Pressable
													onPress={() => handleVoicePlayback(message.id, message.audioUri!)}
													style={[styles.voiceButton, isUser && styles.voiceButtonUser]}
												>
													<Ionicons
														name={playingVoiceId === message.id ? 'pause' : 'play'}
														size={16}
														color={isUser ? colors.cocoaDark : colors.white}
													/>
													<Text style={[styles.voiceButtonText, isUser && styles.voiceButtonTextUser]}>
														{playingVoiceId === message.id ? copy.pause : copy.play}
													</Text>
												</Pressable>
											</View>
										)}

										{message.kind === 'articles' && linkedArticles.length > 0 && (
											<View style={styles.inlineSection}>
												<Text style={styles.inlineSectionTitle}>{copy.articlesTitle}</Text>
												{linkedArticles.map((article) => (
													<Pressable
														key={article.id}
														style={({ pressed }) => [styles.articleCard, pressed && styles.articleCardPressed]}
														onPress={() => router.push(`/bibliotheque/${article.id}` as never)}
													>
														<View style={styles.articleTag}>
															<Text style={styles.articleTagText}>
																{language === 'wo' ? article.categoryWo : article.category}
															</Text>
														</View>
														<Text style={styles.articleTitle}>{language === 'wo' ? article.titleWo : article.title}</Text>
														<Text style={styles.articleDesc} numberOfLines={2}>
															{language === 'wo' ? article.descriptionWo : article.description}
														</Text>
														<View style={styles.articleFooter}>
															<Text style={styles.articleMeta}>{article.readTime}</Text>
															<Text style={styles.articleLink}>{copy.openArticle}</Text>
														</View>
													</Pressable>
												))}
											</View>
										)}

										{message.kind === 'locations' && (
											<View style={styles.inlineSection}>
												<Text style={styles.inlineSectionTitle}>{copy.centersTitle}</Text>
												<LocationFinder
													language={language}
													filterTags={message.locationTags}
													headline={copy.centersTitle}
													maxItems={2}
												/>
											</View>
										)}

										{!isUser && !!message.text && (
											<Pressable
												onPress={() => handleSpeakMessage(message.id, message.text)}
												style={styles.speakButton}
											>
												<Ionicons
													name={isSpeakingMessageId === message.id ? 'stop-circle-outline' : 'volume-high-outline'}
													size={15}
													color={colors.copper}
												/>
												<Text style={styles.speakButtonText}>
													{isSpeakingMessageId === message.id ? copy.speaking : copy.speak}
												</Text>
											</Pressable>
										)}
									</View>
								</View>
							);
						})}
					</ScrollView>

					<View style={styles.composerWrap}>
						<View style={styles.composerField}>
							<TextInput
								value={draft}
								onChangeText={setDraft}
								placeholder={copy.composerPlaceholder}
								placeholderTextColor="rgba(74,47,39,0.45)"
								style={styles.input}
								multiline
								textAlignVertical="top"
							/>
						</View>

						<View style={styles.composerActionsRow}>
							<Pressable onPress={handleImageAttach} style={styles.secondaryActionButton}>
								<Ionicons name="image-outline" size={18} color={colors.copper} />
								<Text style={styles.secondaryActionLabel}>{copy.attach}</Text>
							</Pressable>

							<Pressable
								onPress={handleRecordToggle}
								style={[styles.secondaryActionButton, isRecording && styles.secondaryActionButtonActive]}
							>
								<Ionicons
									name={isRecording ? 'stop-circle-outline' : 'mic-outline'}
									size={18}
									color={isRecording ? colors.white : colors.copper}
								/>
								<Text style={[styles.secondaryActionLabel, isRecording && styles.secondaryActionLabelActive]}>
									{isRecording ? copy.stop : copy.record}
								</Text>
							</Pressable>

							<Pressable onPress={() => handleSend()} style={styles.primaryActionButton}>
								<Ionicons name="send" size={16} color={colors.white} />
								<Text style={styles.primaryActionLabel}>{copy.send}</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}

export default function ChatScreen() {
	return <ChatScreenContent />;
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#F6EFE5',
	},
	screen: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: Platform.select({ ios: 6, android: 16, default: 10 }),
		paddingBottom: 16,
		gap: 12,
	},
	heroCard: {
		position: 'relative',
		borderRadius: 28,
		paddingHorizontal: 18,
		paddingTop: 18,
		paddingBottom: 18,
		backgroundColor: colors.deepGreen,
		overflow: 'hidden',
	},
	heroGlowLarge: {
		position: 'absolute',
		right: -30,
		top: -10,
		width: 170,
		height: 170,
		borderRadius: 170,
		backgroundColor: 'rgba(212,175,55,0.16)',
	},
	heroGlowSmall: {
		position: 'absolute',
		left: -20,
		bottom: -38,
		width: 120,
		height: 120,
		borderRadius: 120,
		backgroundColor: 'rgba(245,241,230,0.14)',
	},
	heroTopRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 18,
	},
	heroStatusWrap: {
		flexDirection: 'row',
	},
	iconCircle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,255,0.88)',
	},
	securityPill: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingHorizontal: 10,
		paddingVertical: 7,
		borderRadius: 999,
		backgroundColor: 'rgba(255,255,255,0.18)',
	},
	securityPillText: {
		color: colors.white,
		fontSize: 11,
		fontWeight: '700',
	},
	brand: {
		color: 'rgba(255,255,255,0.7)',
		fontSize: 12,
		fontWeight: '700',
		letterSpacing: 1.1,
		textTransform: 'uppercase',
		marginBottom: 8,
	},
	heroTitle: {
		color: colors.white,
		fontSize: 28,
		lineHeight: 34,
		fontWeight: '800',
		maxWidth: '92%',
	},
	heroSubtitle: {
		color: 'rgba(255,255,255,0.8)',
		fontSize: 14,
		lineHeight: 21,
		marginTop: 10,
		maxWidth: '94%',
	},
	contextRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginTop: 14,
	},
	contextPill: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 999,
		backgroundColor: colors.beige,
	},
	contextPillText: {
		color: colors.deepGreen,
		fontSize: 11,
		fontWeight: '700',
	},
	flagRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginTop: 12,
	},
	modePill: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 999,
		backgroundColor: 'rgba(245,241,230,0.92)',
	},
	modePillStrong: {
		backgroundColor: 'rgba(166,93,64,0.95)',
	},
	modePillText: {
		color: colors.deepGreen,
		fontSize: 11,
		fontWeight: '700',
	},
	modePillStrongText: {
		color: colors.white,
		fontSize: 11,
		fontWeight: '700',
	},
	disclaimerCard: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 10,
		padding: 14,
		borderRadius: 18,
		backgroundColor: 'rgba(166,93,64,0.08)',
		borderWidth: 1,
		borderColor: 'rgba(166,93,64,0.18)',
	},
	disclaimerText: {
		flex: 1,
		color: colors.cocoaDark,
		fontSize: 13,
		lineHeight: 19,
		fontWeight: '600',
	},
	quickActionsBlock: {
		gap: 8,
	},
	quickActionsTitle: {
		color: colors.cocoaDark,
		fontSize: 13,
		fontWeight: '800',
	},
	quickActionsRow: {
		gap: 10,
		paddingRight: 6,
	},
	quickActionChip: {
		minWidth: 128,
		borderRadius: 20,
		paddingHorizontal: 12,
		paddingVertical: 12,
		backgroundColor: colors.white,
		borderWidth: 1,
		borderColor: 'rgba(181,98,42,0.15)',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	quickActionChipPressed: {
		opacity: 0.8,
	},
	quickActionIconWrap: {
		width: 28,
		height: 28,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(181,98,42,0.10)',
	},
	quickActionLabel: {
		flex: 1,
		color: colors.cocoaDark,
		fontSize: 12,
		lineHeight: 16,
		fontWeight: '700',
	},
	chatSurface: {
		flex: 1,
		borderRadius: 28,
		backgroundColor: 'rgba(255,255,255,0.78)',
		borderWidth: 1,
		borderColor: 'rgba(181,98,42,0.12)',
		overflow: 'hidden',
	},
	chatSurfaceDiscrete: {
		backgroundColor: 'rgba(255,255,255,0.64)',
	},
	messagesContent: {
		padding: 16,
		gap: 12,
	},
	messageWrap: {
		alignItems: 'flex-start',
	},
	messageWrapUser: {
		alignItems: 'flex-end',
	},
	messageBubble: {
		width: '100%',
		maxWidth: '92%',
		borderRadius: 22,
		padding: 14,
		gap: 10,
	},
	messageBubbleAssistant: {
		backgroundColor: colors.white,
		borderWidth: 1,
		borderColor: 'rgba(26,60,52,0.08)',
	},
	messageBubbleUser: {
		backgroundColor: colors.copper,
	},
	messageHeaderRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	},
	messageRole: {
		color: colors.deepGreen,
		fontSize: 11,
		fontWeight: '800',
		textTransform: 'uppercase',
		letterSpacing: 0.7,
	},
	messageRoleUser: {
		color: colors.white,
	},
	messageTime: {
		color: 'rgba(74,47,39,0.55)',
		fontSize: 11,
		fontWeight: '600',
	},
	messageTimeUser: {
		color: 'rgba(255,255,255,0.75)',
	},
	messageText: {
		color: colors.cocoaDark,
		fontSize: 14,
		lineHeight: 21,
		fontWeight: '500',
	},
	messageTextUser: {
		color: colors.white,
	},
	inlineSection: {
		gap: 8,
	},
	inlineSectionTitle: {
		color: colors.deepGreen,
		fontSize: 12,
		fontWeight: '800',
	},
	articleCard: {
		gap: 8,
		padding: 12,
		borderRadius: 16,
		backgroundColor: '#F8F1E7',
		borderWidth: 1,
		borderColor: 'rgba(181,98,42,0.15)',
	},
	articleCardPressed: {
		opacity: 0.82,
	},
	articleTag: {
		alignSelf: 'flex-start',
		paddingHorizontal: 8,
		paddingVertical: 5,
		borderRadius: 999,
		backgroundColor: 'rgba(181,98,42,0.12)',
	},
	articleTagText: {
		color: colors.copper,
		fontSize: 10,
		fontWeight: '700',
	},
	articleTitle: {
		color: colors.cocoaDark,
		fontSize: 14,
		lineHeight: 19,
		fontWeight: '800',
	},
	articleDesc: {
		color: colors.cocoaLight,
		fontSize: 12,
		lineHeight: 18,
		fontWeight: '500',
	},
	articleFooter: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	articleMeta: {
		color: colors.cocoaLight,
		fontSize: 11,
		fontWeight: '700',
	},
	articleLink: {
		color: colors.copper,
		fontSize: 11,
		fontWeight: '800',
	},
	speakButton: {
		alignSelf: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 999,
		backgroundColor: 'rgba(181,98,42,0.10)',
	},
	speakButtonText: {
		color: colors.copper,
		fontSize: 11,
		fontWeight: '800',
	},
	attachmentBlock: {
		gap: 8,
	},
	imageAttachment: {
		width: '100%',
		height: 190,
		borderRadius: 16,
		backgroundColor: '#E8DDCF',
	},
	attachmentLabel: {
		color: colors.cocoaLight,
		fontSize: 11,
		fontWeight: '700',
	},
	attachmentLabelUser: {
		color: 'rgba(255,255,255,0.78)',
	},
	voiceCard: {
		gap: 10,
		borderRadius: 16,
		padding: 12,
		backgroundColor: 'rgba(255,255,255,0.12)',
	},
	voiceMeta: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	voiceLabel: {
		color: colors.deepGreen,
		fontSize: 12,
		fontWeight: '700',
	},
	voiceLabelUser: {
		color: colors.white,
	},
	voiceButton: {
		alignSelf: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 999,
		backgroundColor: colors.deepGreen,
	},
	voiceButtonUser: {
		backgroundColor: colors.white,
	},
	voiceButtonText: {
		color: colors.white,
		fontSize: 11,
		fontWeight: '800',
	},
	voiceButtonTextUser: {
		color: colors.cocoaDark,
	},
	composerWrap: {
		paddingHorizontal: 14,
		paddingTop: 12,
		paddingBottom: 14,
		borderTopWidth: 1,
		borderTopColor: 'rgba(181,98,42,0.12)',
		backgroundColor: 'rgba(245,241,230,0.72)',
		gap: 12,
	},
	composerField: {
		minHeight: 84,
		borderRadius: 20,
		paddingHorizontal: 14,
		paddingVertical: 12,
		backgroundColor: colors.white,
		borderWidth: 1,
		borderColor: 'rgba(181,98,42,0.12)',
	},
	input: {
		minHeight: 60,
		color: colors.cocoaDark,
		fontSize: 14,
		lineHeight: 20,
	},
	composerActionsRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	secondaryActionButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		paddingVertical: 13,
		borderRadius: 18,
		backgroundColor: colors.white,
		borderWidth: 1,
		borderColor: 'rgba(181,98,42,0.18)',
	},
	secondaryActionButtonActive: {
		backgroundColor: colors.terracotta,
		borderColor: colors.terracotta,
	},
	secondaryActionLabel: {
		color: colors.copper,
		fontSize: 12,
		fontWeight: '800',
	},
	secondaryActionLabelActive: {
		color: colors.white,
	},
	primaryActionButton: {
		minWidth: 108,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		paddingHorizontal: 18,
		paddingVertical: 13,
		borderRadius: 18,
		backgroundColor: colors.deepGreen,
	},
	primaryActionLabel: {
		color: colors.white,
		fontSize: 12,
		fontWeight: '800',
	},
});
