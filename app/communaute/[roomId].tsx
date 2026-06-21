import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import NoticeCard from '../../components/NoticeCard';
import { COMMUNITY_COLORS, CommunityMessage } from '../../data/community';
import {
    communityHasRemoteApi,
    ensureCommunityProfile,
    getCommunityUserId,
    joinCommunityRoom,
    loadRoomMessages,
    reportMessage,
    roomById,
    sendRoomMessage,
    syncQueuedRoomMessages,
} from '../../utils/communityApi';
import { useApp } from '../../context/appcontext';
import { useSpeak } from '../../hooks/usespeak';

const TEXT = {
  fr: {
    roomNotFound: 'Salon introuvable',
    anonymous: 'Anonyme',
    visible: 'Visible',
    messagesCount: 'messages',
    firstMessage: 'Sois la premiere a partager dans cet espace.',
    inputPlaceholder: 'Ecris ton message...',
    send: 'Envoyer',
    reportTitle: 'Signaler ce message ?',
    reportDesc:
      'Ce message sera signale pour moderation. Merci de contribuer a un espace sur.',
    cancel: 'Annuler',
    report: 'Signaler',
    reportDone: 'Message signale',
    sendDone: 'Message envoye',
    roomGuideTitle: 'Cadre du salon',
    roomGuideDesc: 'Bienveillance, anonymat au choix et échanges utiles entre femmes concernées.',
    moderationTitle: 'Modération active',
    moderationDesc: 'Les messages signalés sont revus pour protéger un espace respectueux et sans pression.',
    offlineTitle: 'Hors ligne: messages gardés localement',
    offlineDesc:
      'Tu peux lire le salon et continuer à écrire. Les nouveaux messages seront synchronisés dès le retour de la connexion.',
    localOnlyTitle: 'Mode local sur cet appareil',
    localOnlyDesc:
      'Dans cette version, les échanges restent stockés localement sur cet appareil.',
    pendingQueueTitle: 'Synchronisation à reprendre',
    syncing: 'Synchronisation en cours...',
    pendingLabel: 'En attente de sync',
    localLabel: 'Local seulement',
    starterTitle: 'Sujets pour commencer',
    safetyRules: [
      'Parle depuis ton vécu, sans juger celui des autres',
      'Ne partage pas d’informations trop identifiantes si tu veux rester discrète',
      'En cas d’urgence médicale, consulte un professionnel rapidement',
    ],
  },
  wo: {
    roomNotFound: 'Room bi amul',
    anonymous: 'Anonyme',
    visible: 'Visible',
    messagesCount: 'messages yi',
    firstMessage: 'Yow mooy nekk ci wax fii.',
    inputPlaceholder: 'Bind sa baat...',
    send: 'Yonnee',
    reportTitle: 'Signale baat bii ?',
    reportDesc: 'Baat bii dina nu signale. Jerejef ci jappale bereb bu jafe.',
    cancel: 'Bayyi',
    report: 'Signale',
    reportDone: 'Message yi signale nanu',
    sendDone: 'Message yeesal na',
    roomGuideTitle: 'Yoonu salon bi',
    roomGuideDesc: 'Yërmandé, anonymat su la neexee ak waxtaan yu jariñ ci diggante jigéen yu concernées.',
    moderationTitle: 'Modération buy dox',
    moderationDesc: 'Messages yi ñu signale dañuy leen xool ngir aar bereb bu am respect te amul pression.',
    offlineTitle: 'Hors ligne: messages yi dañu leen di denc fii',
    offlineDesc:
      'Man nga jàng salon bi te bind ba tey. Messages yees yi dinañu sync bu connexion dellusee.',
    localOnlyTitle: 'Mode local ci appareil bii',
    localOnlyDesc:
      'Ci version bii, waxtaan yi dañu leen di denc fii rekk ci appareil bii.',
    pendingQueueTitle: 'Sync bi war naa dellu',
    syncing: 'Sync mi mungi dox...',
    pendingLabel: 'Mi ngi ci xaar sync',
    localLabel: 'Local rekk',
    starterTitle: 'Sujets ngir tàmbali',
    safetyRules: [
      'Waxal li nga dund te bul xaste dundu keneen',
      'Bul sédd xetu yu la mën a xame bu bëggee des ci sutura',
      'Su amee urgence médicale, demal tabax bu gaaw',
    ],
  },
} as const;

const ROOM_STARTERS: Record<
  string,
  {
    fr: string[];
    wo: string[];
  }
> = {
  endometriose: {
    fr: [
      'Comment gérez-vous les jours de douleur intense ?',
      'Quels signes vous ont poussées à consulter ?',
      'Qu’est-ce qui vous aide au quotidien ?',
    ],
    wo: [
      'Naka ngeen di doxale bésu mettit bu tar ?',
      'Ban signes moo leen tax ngeen dem consultation ?',
      'Lan moo leen di dimbali ci dund gu bés bu nekk ?',
    ],
  },
  contraception: {
    fr: [
      'Quels critères comptent le plus pour choisir une méthode ?',
      'Comment parler contraception avec un professionnel ?',
      'Quels effets secondaires avez-vous observés ?',
    ],
    wo: [
      'Ban critères moo leen gën a am solo ci tànnal méthode ?',
      'Naka ngeen di wax contraception ak professionnel ?',
      'Ban effets secondaires ngeen gis ?',
    ],
  },
  maternite: {
    fr: [
      'Comment vivez-vous votre projet de grossesse ?',
      'Quels conseils vous ont rassurée au début ?',
      'Comment vous préparez-vous à la maternité ?',
    ],
    wo: [
      'Naka ngeen di dunde seen projet gàtt ?',
      'Ban conseils moo leen rassurer ci njàlbéen ?',
      'Naka ngeen di waajal seen bopp ngir yaay ?',
    ],
  },
  menopause: {
    fr: [
      'Quels changements ressentez-vous le plus ?',
      'Qu’est-ce qui améliore votre sommeil ou votre confort ?',
      'Comment en parlez-vous autour de vous ?',
    ],
    wo: [
      'Ban soppi ngeen di gën a yëg ?',
      'Lan moo di gën a yokk sa nelaw walla sa confort ?',
      'Naka ngay ko di wax ak nit ñi la wër ?',
    ],
  },
  intimite: {
    fr: [
      'Comment parler de santé intime sans gêne ?',
      'Quelles questions aimeriez-vous poser en consultation ?',
      'Quels sujets restent les plus sensibles pour vous ?',
    ],
    wo: [
      'Naka ngay wax santé intime te amul rus ?',
      'Ban laaj nga bëgg laaj ci consultation ?',
      'Ban sujets la gën a yëngu ci yaw ?',
    ],
  },
  soutien: {
    fr: [
      'De quoi as-tu besoin en ce moment ?',
      'Qu’est-ce qui te ferait du bien aujourd’hui ?',
      'Comment la communauté peut-elle te soutenir ?',
    ],
    wo: [
      'Lan nga soxla ci jamono jii ?',
      'Lan moo la mën a def baax tey ?',
      'Naka communauté bi mën laa jappale ?',
    ],
  },
};

function getPendingQueueText(language: 'fr' | 'wo', count: number) {
  if (count <= 0) {
    return '';
  }

  if (language === 'fr') {
    return `${count} message${count > 1 ? 's' : ''} en attente de synchronisation.`;
  }

  return `${count} message${count > 1 ? 's' : ''} ngi ci xaar sync.`;
}

export default function CommunityRoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();
  const router = useRouter();
  const { language, oralMode, discreteMode, isOffline, isOnline } = useApp();
  const { speak } = useSpeak();

  const copy = TEXT[language];
  const selectedRoomId = typeof roomId === 'string' ? roomId : '';
  const room = roomById(selectedRoomId);

  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
  const [communityPseudo, setCommunityPseudo] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncingQueued, setSyncingQueued] = useState(false);

  const scrollRef = useRef<ScrollView | null>(null);

  const currentDisplayName = useMemo(() => {
    if (isAnonymous) {
      return copy.anonymous;
    }

    return communityPseudo || copy.anonymous;
  }, [communityPseudo, copy.anonymous, isAnonymous]);

  const pendingMessagesCount = useMemo(
    () => messages.filter((message) => message.syncStatus === 'pending').length,
    [messages]
  );
  const pendingQueueText = useMemo(
    () => getPendingQueueText(language, pendingMessagesCount),
    [language, pendingMessagesCount]
  );
  const modeInfo = useMemo(() => {
    if (!communityHasRemoteApi) {
      return {
        color: COMMUNITY_COLORS.deepGreen,
        icon: 'phone-portrait-outline' as const,
        title: copy.localOnlyTitle,
        description: copy.localOnlyDesc,
      };
    }

    if (isOffline) {
      return {
        color: COMMUNITY_COLORS.copper,
        icon: 'cloud-offline-outline' as const,
        title: copy.offlineTitle,
        description: copy.offlineDesc,
      };
    }

    if (syncingQueued) {
      return {
        color: room?.color ?? COMMUNITY_COLORS.deepGreen,
        icon: 'sync-outline' as const,
        title: copy.pendingQueueTitle,
        description: copy.syncing,
      };
    }

    if (pendingMessagesCount > 0) {
      return {
        color: COMMUNITY_COLORS.copper,
        icon: 'time-outline' as const,
        title: copy.pendingQueueTitle,
        description: pendingQueueText,
      };
    }

    return null;
  }, [
    copy.localOnlyDesc,
    copy.localOnlyTitle,
    copy.offlineDesc,
    copy.offlineTitle,
    copy.pendingQueueTitle,
    copy.syncing,
    isOffline,
    pendingMessagesCount,
    pendingQueueText,
    room?.color,
    syncingQueued,
  ]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const profile = await ensureCommunityProfile();
      const nextUserId = await getCommunityUserId(profile.pseudonym);

      if (!mounted) {
        return;
      }

      setCommunityPseudo(profile.pseudonym || '');
      setUserId(nextUserId);
      setIsLoaded(true);
    };

    bootstrap().catch(() => setIsLoaded(true));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedRoomId || !isLoaded) {
      return;
    }

    let active = true;

    const syncMessages = async () => {
      const nextMessages = await loadRoomMessages(selectedRoomId, { offline: isOffline });
      if (active) {
        setMessages(nextMessages);
      }
    };

    syncMessages().catch(() => undefined);

    const interval = setInterval(() => {
      syncMessages().catch(() => undefined);
    }, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isLoaded, isOffline, selectedRoomId]);

  useEffect(() => {
    if (!selectedRoomId || !isLoaded || !communityHasRemoteApi || !isOnline) {
      return;
    }

    let active = true;

    const flushQueuedMessages = async () => {
      setSyncingQueued(true);

      try {
        await syncQueuedRoomMessages();
        const nextMessages = await loadRoomMessages(selectedRoomId);

        if (active) {
          setMessages(nextMessages);
        }
      } catch {
        // Next polling cycle will retry.
      } finally {
        if (active) {
          setSyncingQueued(false);
        }
      }
    };

    flushQueuedMessages().catch(() => undefined);

    return () => {
      active = false;
    };
  }, [isLoaded, isOnline, selectedRoomId]);

  useEffect(() => {
    if (!selectedRoomId || !userId) {
      return;
    }

    const nameToJoin = isAnonymous ? copy.anonymous : communityPseudo || copy.anonymous;
    joinCommunityRoom(selectedRoomId, userId, nameToJoin, { offline: isOffline }).catch(() => undefined);
  }, [communityPseudo, copy.anonymous, isAnonymous, isOffline, selectedRoomId, userId]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages]);

  const handleSendMessage = async () => {
    const content = newMessage.trim();
    if (!content || !selectedRoomId || !userId || !room) {
      return;
    }

    setLoading(true);
    try {
      const next = await sendRoomMessage({
        roomId: selectedRoomId,
        userId,
        userName: currentDisplayName,
        text: content,
        isAnonymous,
      }, { offline: isOffline });

      if (next) {
        setMessages((prev) => [...prev, next]);
      }

      setNewMessage('');
      if (oralMode) {
        speak(copy.sendDone);
      }
    } catch {
      Alert.alert('SaxalWer', 'Impossible d envoyer le message pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (messageId: string) => {
    if (!userId) {
      return;
    }

    try {
      await reportMessage(messageId, userId, { offline: isOffline });
      setReportingMessageId(null);
      if (oralMode) {
        speak(copy.reportDone);
      }
    } catch {
      Alert.alert('SaxalWer', 'Impossible de signaler ce message maintenant.');
    }
  };

  const handleAnonymousToggle = async () => {
    const next = !isAnonymous;
    setIsAnonymous(next);

    if (!next && !communityPseudo.trim()) {
      const profile = await ensureCommunityProfile();
      setCommunityPseudo(profile.pseudonym);
    }
  };

  if (!room) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundWrap}>
          <Text style={styles.notFoundText}>{copy.roomNotFound}</Text>
          <Pressable style={styles.notFoundButton} onPress={() => router.replace('/communaute' as never)}>
            <Text style={styles.notFoundButtonText}>Retour</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={[styles.roomHeader, { backgroundColor: room.color }]}> 
          <Pressable onPress={() => router.replace('/communaute' as never)} style={styles.headerBackButton}>
            <Ionicons name="chevron-back" size={18} color={COMMUNITY_COLORS.warmWhite} />
          </Pressable>

          <Ionicons name={room.iconName} size={22} color={COMMUNITY_COLORS.warmWhite} />

          <View style={styles.roomHeaderTextWrap}>
            <Text style={styles.roomHeaderTitle}>{language === 'fr' ? room.titleFr : room.titleWo}</Text>
            <Text style={styles.roomHeaderMeta}>
              {messages.length} {copy.messagesCount}
            </Text>
          </View>

          <Pressable
            onPress={handleAnonymousToggle}
            style={[styles.visibilityToggle, isAnonymous && styles.visibilityToggleOn]}
          >
            <Ionicons
              name={isAnonymous ? 'eye-off-outline' : 'eye-outline'}
              size={13}
              color={COMMUNITY_COLORS.warmWhite}
            />
            <Text style={styles.visibilityToggleText}>{isAnonymous ? copy.anonymous : copy.visible}</Text>
          </Pressable>
        </View>

        <View style={styles.messagesAreaWrap}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.roomGuideCard}>
              <View style={styles.roomGuideHeader}>
                <View style={styles.roomGuideIconWrap}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={room.color} />
                </View>
                <View style={styles.roomGuideTextWrap}>
                  <Text style={styles.roomGuideTitle}>{copy.roomGuideTitle}</Text>
                  <Text style={styles.roomGuideDesc}>{copy.roomGuideDesc}</Text>
                </View>
              </View>

              <View style={styles.safetyList}>
                {copy.safetyRules.map((rule) => (
                  <View key={rule} style={styles.safetyRow}>
                    <View style={[styles.safetyDot, { backgroundColor: room.color }]} />
                    <Text style={styles.safetyText}>{rule}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.moderationCard}>
              <Ionicons name="flag-outline" size={17} color={COMMUNITY_COLORS.terracotta} />
            <View style={styles.moderationTextWrap}>
              <Text style={styles.moderationTitle}>{copy.moderationTitle}</Text>
              <Text style={styles.moderationDesc}>{copy.moderationDesc}</Text>
            </View>
          </View>

          {modeInfo ? (
            <NoticeCard
              title={modeInfo.title}
              description={modeInfo.description}
              iconName={modeInfo.icon}
              accentColor={modeInfo.color}
              style={styles.syncCard}
            />
          ) : null}

            <View style={styles.startersSection}>
              <Text style={styles.startersTitle}>{copy.starterTitle}</Text>
              <View style={styles.startersWrap}>
                {(language === 'fr'
                  ? ROOM_STARTERS[selectedRoomId]?.fr
                  : ROOM_STARTERS[selectedRoomId]?.wo
                )?.map((starter) => (
                  <Pressable
                    key={starter}
                    onPress={() => setNewMessage(starter)}
                    style={styles.starterChip}
                  >
                    <Text style={styles.starterChipText}>{starter}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {messages.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="chatbubble-ellipses-outline" size={48} color={room.color} />
                <Text style={styles.emptyText}>{copy.firstMessage}</Text>
              </View>
            ) : (
              messages.map((message) => {
                const isOwn = message.userId === userId;
                const isPending = message.syncStatus === 'pending';
                const isLocalOnly = message.syncStatus === 'local-only';

                return (
                  <View key={message.id} style={[styles.messageWrap, isOwn && styles.messageWrapOwn]}>
                    <View
                      style={[
                        styles.messageBubble,
                        isOwn
                          ? [styles.messageBubbleOwn, { backgroundColor: room.color }]
                          : styles.messageBubbleOther,
                      ]}
                    >
                      <View style={styles.messageAuthorRow}>
                        <Text style={[styles.authorText, isOwn && styles.authorTextOwn]}>
                          {message.isAnonymous ? copy.anonymous : message.userName}
                        </Text>

                        {!isOwn ? (
                          <Pressable onPress={() => setReportingMessageId(message.id)} style={styles.reportButton}>
                            <Ionicons name="flag-outline" size={12} color={COMMUNITY_COLORS.cacao} />
                          </Pressable>
                        ) : null}
                      </View>

                      <Text style={[styles.messageText, isOwn && styles.messageTextOwn]}>{message.text}</Text>

                      <View style={styles.messageMetaRow}>
                        <Text style={[styles.timeText, isOwn && styles.timeTextOwn]}>
                          {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>

                        {isPending ? (
                          <View style={[styles.messageStatusPill, isOwn && styles.messageStatusPillOwn]}>
                            <Text style={[styles.messageStatusText, isOwn && styles.messageStatusTextOwn]}>
                              {copy.pendingLabel}
                            </Text>
                          </View>
                        ) : null}

                        {isLocalOnly ? (
                          <View style={[styles.messageStatusPill, isOwn && styles.messageStatusPillOwn]}>
                            <Text style={[styles.messageStatusText, isOwn && styles.messageStatusTextOwn]}>
                              {copy.localLabel}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {discreteMode ? <View style={styles.discreteVeil} pointerEvents="none" /> : null}
        </View>

        <View style={styles.inputArea}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder={copy.inputPlaceholder}
            placeholderTextColor="rgba(74,47,39,0.55)"
            style={styles.input}
            editable={!loading}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
          />

          <Pressable
            onPress={handleSendMessage}
            disabled={loading || !newMessage.trim()}
            style={({ pressed }) => [
              styles.sendButton,
              (loading || !newMessage.trim()) && styles.sendButtonDisabled,
              pressed && styles.sendButtonPressed,
              { backgroundColor: room.color },
            ]}
          >
            <Ionicons name="send" size={18} color={COMMUNITY_COLORS.warmWhite} />
          </Pressable>
        </View>

        <Modal
          animationType="fade"
          transparent
          visible={!!reportingMessageId}
          onRequestClose={() => setReportingMessageId(null)}
        >
          <Pressable style={styles.reportOverlay} onPress={() => setReportingMessageId(null)}>
            <Pressable style={styles.reportCard} onPress={() => undefined}>
              <View style={styles.reportHeadRow}>
                <Ionicons name="alert-circle-outline" size={28} color="#d4183d" />
                <Text style={styles.reportTitle}>{copy.reportTitle}</Text>
              </View>

              <Text style={styles.reportDesc}>{copy.reportDesc}</Text>

              <View style={styles.reportActions}>
                <Pressable onPress={() => setReportingMessageId(null)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>{copy.cancel}</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    if (!reportingMessageId) {
                      return;
                    }
                    handleReport(reportingMessageId);
                  }}
                  style={styles.reportButtonDanger}
                >
                  <Text style={styles.reportButtonDangerText}>{copy.report}</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COMMUNITY_COLORS.warmWhite,
  },
  screen: {
    flex: 1,
    backgroundColor: COMMUNITY_COLORS.warmWhite,
  },
  notFoundWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundText: {
    color: COMMUNITY_COLORS.deepGreen,
    fontSize: 17,
    fontWeight: '700',
  },
  notFoundButton: {
    backgroundColor: COMMUNITY_COLORS.deepGreen,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  notFoundButtonText: {
    color: COMMUNITY_COLORS.warmWhite,
    fontWeight: '700',
  },
  roomHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  roomHeaderTextWrap: {
    flex: 1,
  },
  roomHeaderTitle: {
    color: COMMUNITY_COLORS.warmWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  roomHeaderMeta: {
    marginTop: 2,
    color: 'rgba(253,250,245,0.9)',
    fontSize: 11,
  },
  visibilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.32)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  visibilityToggleOn: {
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  visibilityToggleText: {
    color: COMMUNITY_COLORS.warmWhite,
    fontSize: 11,
    fontWeight: '700',
  },
  messagesAreaWrap: {
    flex: 1,
    backgroundColor: COMMUNITY_COLORS.beige,
  },
  messagesContent: {
    padding: 14,
    gap: 10,
    paddingBottom: 30,
  },
  roomGuideCard: {
    backgroundColor: COMMUNITY_COLORS.warmWhite,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(194,106,61,0.16)',
    padding: 14,
  },
  roomGuideHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  roomGuideIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(15,61,46,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomGuideTextWrap: {
    flex: 1,
  },
  roomGuideTitle: {
    color: COMMUNITY_COLORS.deepGreen,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  roomGuideDesc: {
    color: COMMUNITY_COLORS.cacao,
    fontSize: 12,
    lineHeight: 18,
  },
  safetyList: {
    gap: 8,
  },
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  safetyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  safetyText: {
    flex: 1,
    color: 'rgba(74,47,39,0.82)',
    fontSize: 12,
    lineHeight: 18,
  },
  moderationCard: {
    backgroundColor: 'rgba(184,112,80,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(184,112,80,0.18)',
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  moderationTextWrap: {
    flex: 1,
  },
  moderationTitle: {
    color: COMMUNITY_COLORS.deepGreen,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  moderationDesc: {
    color: COMMUNITY_COLORS.cacao,
    fontSize: 12,
    lineHeight: 17,
  },
  syncCard: {
    marginBottom: 4,
  },
  startersSection: {
    marginBottom: 4,
  },
  startersTitle: {
    color: COMMUNITY_COLORS.deepGreen,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  startersWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  starterChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(194,106,61,0.16)',
  },
  starterChipText: {
    color: COMMUNITY_COLORS.deepGreen,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  emptyText: {
    marginTop: 10,
    color: COMMUNITY_COLORS.cacao,
    fontSize: 14,
    textAlign: 'center',
  },
  messageWrap: {
    alignItems: 'flex-start',
  },
  messageWrapOwn: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '76%',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  messageBubbleOther: {
    backgroundColor: COMMUNITY_COLORS.warmWhite,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  messageBubbleOwn: {
    borderTopRightRadius: 4,
  },
  messageAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  authorText: {
    color: COMMUNITY_COLORS.deepGreen,
    fontSize: 11,
    fontWeight: '700',
  },
  authorTextOwn: {
    color: COMMUNITY_COLORS.warmWhite,
  },
  reportButton: {
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  messageText: {
    color: COMMUNITY_COLORS.cacao,
    fontSize: 14,
    lineHeight: 21,
  },
  messageTextOwn: {
    color: COMMUNITY_COLORS.warmWhite,
  },
  messageMetaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  timeText: {
    color: 'rgba(74,47,39,0.72)',
    fontSize: 10,
  },
  timeTextOwn: {
    color: 'rgba(253,250,245,0.78)',
  },
  messageStatusPill: {
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: 'rgba(15,61,46,0.08)',
  },
  messageStatusPillOwn: {
    backgroundColor: 'rgba(253,250,245,0.18)',
  },
  messageStatusText: {
    color: COMMUNITY_COLORS.deepGreen,
    fontSize: 9,
    fontWeight: '700',
  },
  messageStatusTextOwn: {
    color: COMMUNITY_COLORS.warmWhite,
  },
  discreteVeil: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(253,250,245,0.52)',
  },
  inputArea: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(194,106,61,0.16)',
    backgroundColor: COMMUNITY_COLORS.warmWhite,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'rgba(194,106,61,0.2)',
    borderRadius: 20,
    backgroundColor: COMMUNITY_COLORS.beige,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COMMUNITY_COLORS.cacao,
    fontSize: 14,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.46,
  },
  sendButtonPressed: {
    opacity: 0.84,
  },
  reportOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.52)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  reportCard: {
    backgroundColor: COMMUNITY_COLORS.warmWhite,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 420,
  },
  reportHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  reportTitle: {
    flex: 1,
    color: COMMUNITY_COLORS.deepGreen,
    fontSize: 20,
    fontWeight: '700',
  },
  reportDesc: {
    color: COMMUNITY_COLORS.cacao,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COMMUNITY_COLORS.sand,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COMMUNITY_COLORS.cacao,
    fontWeight: '700',
  },
  reportButtonDanger: {
    flex: 1,
    backgroundColor: '#d4183d',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  reportButtonDangerText: {
    color: COMMUNITY_COLORS.warmWhite,
    fontWeight: '700',
  },
});
