import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    useApp,
    type LifeSituation,
    type NotifFrequency,
    type NotificationPreferences
} from '../../context/appcontext';

const C = {
  beige: '#F5F1E6',
  warmWhite: '#FAF7F0',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  gold: '#D4AF37',
  sage: '#7A8C5A',
};

type PrefKey = keyof Pick<
  NotificationPreferences,
  'cycles' | 'contraception' | 'articleOfDay' | 'dailyTip' | 'symptomLog' | 'orientation'
>;

type SmartSuggestion = {
  category: PrefKey;
  frequency: NotifFrequency;
  reasonFr: string;
  reasonWo: string;
};

const CATEGORIES: {
  id: PrefKey;
  icon: React.ComponentProps<typeof Feather>['name'] | React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconSet: 'feather' | 'mci';
  color: string;
  labelFr: string;
  labelWo: string;
}[] = [
  { id: 'cycles', icon: 'moon', iconSet: 'feather', color: C.gold, labelFr: 'Cycles', labelWo: 'Weer' },
  { id: 'contraception', icon: 'shield', iconSet: 'feather', color: C.deepGreen, labelFr: 'Contraception', labelWo: 'Contraception' },
  { id: 'articleOfDay', icon: 'book-open', iconSet: 'feather', color: C.copper, labelFr: 'Articles', labelWo: 'Jangale' },
  { id: 'dailyTip', icon: 'lightbulb-outline', iconSet: 'mci', color: C.terracotta, labelFr: 'Conseils', labelWo: 'Digalante' },
  { id: 'symptomLog', icon: 'clipboard', iconSet: 'feather', color: C.sage, labelFr: 'Symptomes', labelWo: 'Metit' },
  { id: 'orientation', icon: 'compass', iconSet: 'feather', color: C.cocoa, labelFr: 'Orientation', labelWo: 'Orientation' },
];

const FREQ_LABELS: Record<NotifFrequency, { fr: string; wo: string; icon: React.ComponentProps<typeof Feather>['name'] }> = {
  daily: { fr: 'Quotidien', wo: 'Epp bes', icon: 'clock' },
  weekly: { fr: 'Hebdomadaire', wo: 'Epp ayu-bes', icon: 'calendar' },
  monthly: { fr: 'Mensuel', wo: 'Epp weer', icon: 'calendar' },
};

function getSmartSuggestions(
  lifeSituation: LifeSituation | null,
  riskDimensions: string[],
  currentPrefs: Record<PrefKey, boolean>,
): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];

  const SITUATION_MAP: Partial<Record<LifeSituation, SmartSuggestion[]>> = {
    pregnant: [
      { category: 'cycles', frequency: 'daily', reasonFr: 'Suivi quotidien important pendant la grossesse', reasonWo: 'Samm bu epp bes ci tur gi' },
      { category: 'symptomLog', frequency: 'daily', reasonFr: 'Documenter tes symptômes aide ton suivi prénatal', reasonWo: 'Bind sa metit yi mooy dimbali sa samm' },
      { category: 'dailyTip', frequency: 'daily', reasonFr: 'Un conseil bien-être chaque jour pour toi et bébé', reasonWo: 'Digalante bu weer epp bes' },
    ],
    trying: [
      { category: 'cycles', frequency: 'daily', reasonFr: 'Suivre ton cycle de près aide à la conception', reasonWo: 'Samm sa weer gi mooy dimbali' },
      { category: 'symptomLog', frequency: 'daily', reasonFr: 'Note tes signes de fertilité chaque jour', reasonWo: 'Bind sa mandarga epp bes' },
    ],
    contraception: [
      { category: 'contraception', frequency: 'daily', reasonFr: 'Rappel quotidien pour ne rien oublier', reasonWo: 'Fattali epp bes ngir bul fatte' },
      { category: 'cycles', frequency: 'weekly', reasonFr: 'Garder un œil sur ton cycle', reasonWo: 'Samm sa weer gi' },
    ],
    postpartum: [
      { category: 'symptomLog', frequency: 'daily', reasonFr: 'Ta récupération mérite une attention quotidienne', reasonWo: 'Sa weerum boppam dafa am solo' },
      { category: 'dailyTip', frequency: 'daily', reasonFr: 'Des conseils adaptés au post-partum', reasonWo: 'Digalante yu baax' },
    ],
    menopause: [
      { category: 'symptomLog', frequency: 'weekly', reasonFr: "Suivre l'évolution de tes symptômes", reasonWo: 'Samm sa metit yi' },
      { category: 'orientation', frequency: 'monthly', reasonFr: 'Réévaluer ton bien-être régulièrement', reasonWo: 'Xool sa weer ci jamano' },
    ],
    cycles: [
      { category: 'cycles', frequency: 'weekly', reasonFr: 'Rester connectée à ton cycle', reasonWo: 'Samm sa weer gi' },
      { category: 'symptomLog', frequency: 'weekly', reasonFr: 'Un rappel pour noter tes symptômes', reasonWo: 'Fattali ngir bind' },
    ],
    curious: [
      { category: 'articleOfDay', frequency: 'daily', reasonFr: 'Apprendre quelque chose de nouveau chaque jour', reasonWo: 'Jang lenn epp bes' },
      { category: 'dailyTip', frequency: 'daily', reasonFr: 'Des conseils pour enrichir tes connaissances', reasonWo: 'Digalante yu am solo' },
    ],
  };

  if (lifeSituation && SITUATION_MAP[lifeSituation]) {
    SITUATION_MAP[lifeSituation]!.forEach((s) => {
      if (!currentPrefs[s.category]) suggestions.push(s);
    });
  }

  if (riskDimensions.length > 0) {
    if (!currentPrefs.orientation) {
      suggestions.push({
        category: 'orientation',
        frequency: 'monthly',
        reasonFr: 'Des dimensions à risque ont été identifiées, un suivi régulier est recommandé',
        reasonWo: 'Ay xarit yu am solo lanu gis, samm bu yagg dafa am njarin',
      });
    }
    if (!currentPrefs.symptomLog) {
      suggestions.push({
        category: 'symptomLog',
        frequency: 'weekly',
        reasonFr: 'Documenter tes symptômes aide à surveiller les dimensions à risque',
        reasonWo: 'Bind sa metit yi mooy dimbali ci samm',
      });
    }
  }

  const activeCount = Object.values(currentPrefs).filter(Boolean).length;
  if (activeCount < 2) {
    if (!currentPrefs.articleOfDay) {
      suggestions.push({
        category: 'articleOfDay',
        frequency: 'daily',
        reasonFr: 'Commence par un article par jour pour rester informee',
        reasonWo: 'Tambali ak jangale epp bes',
      });
    }
    if (!currentPrefs.dailyTip) {
      suggestions.push({
        category: 'dailyTip',
        frequency: 'daily',
        reasonFr: 'Un petit conseil quotidien pour prendre soin de toi',
        reasonWo: 'Digalante epp bes ngir samm sa boppam',
      });
    }
  }

  const seen = new Set<PrefKey>();
  return suggestions
    .filter((s) => {
      if (seen.has(s.category)) return false;
      seen.add(s.category);
      return true;
    })
    .slice(0, 3);
}

function formatTimeAgo(timestamp: number, wo: boolean): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return wo ? 'leegi' : "A l'instant";
  if (mins < 60) return wo ? `${mins} simili ci ginaaw` : `Il y a ${mins}min`;
  if (hours < 24) return wo ? `${hours} waxtu ci ginaaw` : `Il y a ${hours}h`;
  if (days < 7) return wo ? `${days} fan ci ginaaw` : `Il y a ${days}j`;
  return new Date(timestamp).toLocaleDateString(wo ? 'wo' : 'fr-FR', { day: 'numeric', month: 'short' });
}

function CatIcon({ iconSet, icon, color, size = 16 }: { iconSet: 'feather' | 'mci'; icon: string; color: string; size?: number }) {
  if (iconSet === 'mci') return <MaterialCommunityIcons name={icon as any} size={size} color={color} />;
  return <Feather name={icon as any} size={size} color={color} />;
}

export default function NotificationCenterPage() {
  const router = useRouter();
  const {
    language,
    cycleNotifications,
    markNotificationRead,
    deleteNotification,
    clearNotifications,
    unreadCount,
    notificationPreferences,
    setNotificationPreferences,
    lifeSituation,
    sensitiveOrientation,
    discreteMode,
  } = useApp();

  const wo = language === 'wo';

  const [activeFilter, setActiveFilter] = React.useState<PrefKey | 'all'>('all');
  const [showPrefs, setShowPrefs] = React.useState(false);
  const [expandedFreq, setExpandedFreq] = React.useState<PrefKey | null>(null);

  const filteredNotifs = React.useMemo(() => {
    if (activeFilter === 'all') return cycleNotifications;
    return cycleNotifications.filter((n) => (n.category || 'cycles') === activeFilter);
  }, [cycleNotifications, activeFilter]);

  const suggestions = React.useMemo(() => {
    const currentPrefs: Record<PrefKey, boolean> = {
      cycles: notificationPreferences.cycles,
      contraception: notificationPreferences.contraception,
      articleOfDay: notificationPreferences.articleOfDay,
      dailyTip: notificationPreferences.dailyTip,
      symptomLog: notificationPreferences.symptomLog,
      orientation: notificationPreferences.orientation,
    };
    return getSmartSuggestions(
      lifeSituation,
      sensitiveOrientation?.riskDimensions || [],
      currentPrefs,
    );
  }, [lifeSituation, sensitiveOrientation, notificationPreferences]);

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    cycleNotifications.forEach((n) => {
      const cat = n.category || 'cycles';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [cycleNotifications]);

  function markAllRead() {
    cycleNotifications.forEach((n) => {
      if (!n.read) markNotificationRead(n.id);
    });
  }

  function applySuggestion(s: SmartSuggestion) {
    const freqs = notificationPreferences.frequencies || {};
    setNotificationPreferences({
      ...notificationPreferences,
      [s.category]: true,
      frequencies: { ...freqs, [s.category]: s.frequency },
    });
  }

  function setFrequency(cat: PrefKey, freq: NotifFrequency) {
    const freqs = notificationPreferences.frequencies || {};
    setNotificationPreferences({
      ...notificationPreferences,
      frequencies: { ...freqs, [cat]: freq },
    });
    setExpandedFreq(null);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Feather name="chevron-left" size={20} color="white" />
          </Pressable>
          <View style={styles.headerTopRight}>
            {unreadCount > 0 && (
              <Pressable onPress={markAllRead} style={styles.readAllBtn}>
                <Feather name="check" size={12} color="white" />
                <Text style={styles.readAllText}>{wo ? 'Jang lepp' : 'Tout lire'}</Text>
              </Pressable>
            )}
            <Pressable onPress={() => setShowPrefs((v) => !v)} style={styles.iconBtn}>
              <Feather name="settings" size={17} color="white" />
            </Pressable>
          </View>
        </View>

        <View style={styles.headerTitleRow}>
          <Feather name="bell" size={22} color="white" />
          <Text style={styles.headerTitle}>{wo ? 'Sama Fattali yi' : 'Centre de notifications'}</Text>
        </View>
        <Text style={styles.headerSub}>
          {unreadCount > 0
            ? wo
              ? `${unreadCount} bu jangul`
              : `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`
            : wo
              ? 'Lepp jang nga'
              : 'Tout est a jour'}
          {' · '}
          {cycleNotifications.length} {wo ? 'fattali' : 'notification'}{cycleNotifications.length > 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, discreteMode && styles.discreteContent]}
        showsVerticalScrollIndicator={false}
      >
        {suggestions.length > 0 && !showPrefs ? (
          <View style={{ marginBottom: 16 }}>
            <View style={styles.sectionHead}>
              <Feather name="zap" size={13} color={C.gold} />
              <Text style={styles.sectionHeadText}>{wo ? 'Yu nu la tannal' : 'Suggestions pour toi'}</Text>
            </View>
            <View style={{ gap: 8 }}>
              {suggestions.map((s, i) => {
                const catMeta = CATEGORIES.find((c) => c.id === s.category)!;
                const freqMeta = FREQ_LABELS[s.frequency];
                return (
                  <View key={`${s.category}-${i}`} style={[styles.suggCard, { borderColor: `${catMeta.color}30` }]}>
                    <View style={styles.suggTop}>
                      <View style={[styles.suggIconWrap, { backgroundColor: `${catMeta.color}20` }]}>
                        <CatIcon iconSet={catMeta.iconSet} icon={catMeta.icon as string} color={catMeta.color} size={16} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.suggTitleRow}>
                          <Text style={styles.suggTitle}>{wo ? catMeta.labelWo : catMeta.labelFr}</Text>
                          <View style={[styles.freqBadge, { borderColor: `${catMeta.color}35`, backgroundColor: `${catMeta.color}12` }]}>
                            <Feather name={freqMeta.icon} size={10} color={catMeta.color} />
                            <Text style={[styles.freqBadgeText, { color: catMeta.color }]}>{wo ? freqMeta.wo : freqMeta.fr}</Text>
                          </View>
                        </View>
                        <Text style={styles.suggReason}>{wo ? s.reasonWo : s.reasonFr}</Text>
                      </View>
                    </View>
                    <Pressable style={[styles.activateBtn, { borderColor: `${catMeta.color}35` }]} onPress={() => applySuggestion(s)}>
                      <Feather name="check" size={12} color={catMeta.color} />
                      <Text style={[styles.activateText, { color: catMeta.color }]}>{wo ? 'Activer' : 'Activer cette notification'}</Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {showPrefs ? (
          <View style={styles.prefsPanel}>
            <View style={styles.sectionHead}>
              <Feather name="clock" size={13} color={C.deepGreen} />
              <Text style={styles.sectionHeadText}>{wo ? 'Frequence par categorie' : 'Frequence par categorie'}</Text>
            </View>

            {CATEGORIES.map((cat, i) => {
              const enabled = notificationPreferences[cat.id];
              const currentFreq = (notificationPreferences.frequencies || {})[cat.id] || 'daily';
              const isExpanded = expandedFreq === cat.id;
              return (
                <View key={cat.id} style={[styles.prefRowWrap, i < CATEGORIES.length - 1 && styles.prefRowDivider]}>
                  <Pressable
                    style={styles.prefRow}
                    onPress={() => {
                      if (!enabled) {
                        setNotificationPreferences({ ...notificationPreferences, [cat.id]: true });
                      }
                      setExpandedFreq(isExpanded ? null : cat.id);
                    }}
                  >
                    <View style={[styles.prefIconWrap, { backgroundColor: enabled ? `${cat.color}20` : `${C.cocoa}10` }]}>
                      <CatIcon iconSet={cat.iconSet} icon={cat.icon as string} color={enabled ? cat.color : `${C.cocoa}70`} size={14} />
                    </View>
                    <Text style={[styles.prefTitle, !enabled && styles.prefTitleMuted]}>{wo ? cat.labelWo : cat.labelFr}</Text>
                    <View style={styles.prefRight}>
                      {enabled ? (
                        <Text style={[styles.prefFreq, { color: cat.color }]}>{wo ? FREQ_LABELS[currentFreq].wo : FREQ_LABELS[currentFreq].fr}</Text>
                      ) : (
                        <Text style={styles.prefDisabled}>{wo ? 'Tedd' : 'Desactive'}</Text>
                      )}
                      <Feather name={isExpanded ? 'chevron-down' : 'chevron-right'} size={14} color="rgba(74,47,39,0.45)" />
                    </View>
                  </Pressable>

                  {isExpanded ? (
                    <View style={styles.freqSelectorRow}>
                      {(['daily', 'weekly', 'monthly'] as NotifFrequency[]).map((freq) => {
                        const active = currentFreq === freq;
                        return (
                          <Pressable
                            key={freq}
                            onPress={() => setFrequency(cat.id, freq)}
                            style={[styles.freqChoice, active && { backgroundColor: cat.color, borderColor: cat.color }]}
                          >
                            <Feather name={FREQ_LABELS[freq].icon} size={12} color={active ? 'white' : `${C.cocoa}90`} />
                            <Text style={[styles.freqChoiceText, active && { color: 'white' }]}>
                              {wo ? FREQ_LABELS[freq].wo : FREQ_LABELS[freq].fr}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          <Pressable
            onPress={() => setActiveFilter('all')}
            style={[styles.filterChip, activeFilter === 'all' && { backgroundColor: C.deepGreen, borderColor: C.deepGreen }]}
          >
            <Feather name="filter" size={11} color={activeFilter === 'all' ? 'white' : C.deepGreen} />
            <Text style={[styles.filterChipText, activeFilter === 'all' && { color: 'white' }]}>{wo ? 'Lepp' : 'Tout'}</Text>
            <View style={[styles.filterCount, activeFilter === 'all' && styles.filterCountActive]}>
              <Text style={[styles.filterCountText, activeFilter === 'all' && { color: 'white' }]}>{cycleNotifications.length}</Text>
            </View>
          </Pressable>

          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            if (count === 0 && activeFilter !== cat.id) return null;
            const isActive = activeFilter === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setActiveFilter(isActive ? 'all' : cat.id)}
                style={[styles.filterChip, { borderColor: `${cat.color}35` }, isActive && { backgroundColor: cat.color, borderColor: cat.color }]}
              >
                <CatIcon iconSet={cat.iconSet} icon={cat.icon as string} color={isActive ? 'white' : cat.color} size={11} />
                <Text style={[styles.filterChipText, { color: isActive ? 'white' : cat.color }]}>{wo ? cat.labelWo : cat.labelFr}</Text>
                <View style={[styles.filterCount, { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${cat.color}15` }]}>
                  <Text style={[styles.filterCountText, { color: isActive ? 'white' : cat.color }]}>{count}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {filteredNotifs.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Feather name="bell" size={22} color="rgba(74,47,39,0.45)" />
            </View>
            <Text style={styles.emptyTitle}>{wo ? 'Amul fattali' : 'Aucune notification'}</Text>
            <Text style={styles.emptySub}>
              {wo ? 'Fattali yi dinanu new ci sa tempo bi' : 'Tes rappels apparaitront ici selon tes preferences'}
            </Text>
          </View>
        ) : (
          <View style={{ gap: 8 }}>
            {filteredNotifs.map((notif) => {
              const catMeta = CATEGORIES.find((c) => c.id === ((notif.category || 'cycles') as PrefKey)) || CATEGORIES[0];
              return (
                <View
                  key={notif.id}
                  style={[
                    styles.notifCard,
                    {
                      borderColor: notif.read ? 'rgba(166,93,64,0.2)' : `${catMeta.color}45`,
                      opacity: notif.read ? 0.72 : 1,
                    },
                  ]}
                >
                  {!notif.read ? <View style={[styles.unreadBar, { backgroundColor: catMeta.color }]} /> : null}

                  <Pressable onPress={() => deleteNotification(notif.id)} style={styles.deleteBtn}>
                    <Feather name="trash-2" size={11} color={C.cocoa} />
                  </Pressable>

                  <Pressable style={styles.notifMain} onPress={() => markNotificationRead(notif.id)}>
                    <View style={[styles.notifIconWrap, { backgroundColor: `${catMeta.color}20` }]}>
                      <CatIcon iconSet={catMeta.iconSet} icon={catMeta.icon as string} color={catMeta.color} size={14} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.notifTitleRow}>
                        <Text style={styles.notifMetaphor} numberOfLines={1}>{notif.metaphor}</Text>
                        <Text style={styles.notifTime}>{formatTimeAgo(notif.timestamp, wo)}</Text>
                      </View>
                      <Text style={styles.notifMessage}>{notif.message}</Text>
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}

        {cycleNotifications.length > 0 ? (
          <Pressable onPress={clearNotifications} style={styles.clearAllFooterBtn}>
            <Feather name="trash-2" size={13} color="rgba(74,47,39,0.55)" />
            <Text style={styles.clearAllFooterText}>{wo ? 'Fassal lepp' : "Effacer tout l'historique"}</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.beige },
  header: {
    backgroundColor: C.deepGreen,
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTopRight: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  readAllBtn: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  readAllText: { color: 'white', fontSize: 11, fontWeight: '700' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: '700', flex: 1 },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
  content: { padding: 16, paddingBottom: 100 },
  discreteContent: { opacity: 0.15 },

  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  sectionHeadText: {
    fontSize: 10,
    color: C.deepGreen,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
  },

  suggCard: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    backgroundColor: C.warmWhite,
  },
  suggTop: { flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  suggIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
  suggTitle: { color: C.deepGreen, fontWeight: '700', fontSize: 13, flex: 1 },
  freqBadge: {
    borderRadius: 99,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  freqBadgeText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  suggReason: { fontSize: 12, color: 'rgba(74,47,39,0.75)', lineHeight: 17 },
  activateBtn: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  activateText: { fontSize: 11, fontWeight: '700' },

  prefsPanel: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.18)',
    padding: 12,
    marginBottom: 14,
  },
  prefRowWrap: { paddingVertical: 2 },
  prefRowDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(26,60,52,0.06)' },
  prefRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 7 },
  prefIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefTitle: { flex: 1, fontSize: 13, fontWeight: '600', color: C.deepGreen },
  prefTitleMuted: { color: 'rgba(74,47,39,0.5)' },
  prefRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  prefFreq: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  prefDisabled: { fontSize: 10, fontWeight: '700', color: 'rgba(74,47,39,0.45)', textTransform: 'uppercase' },
  freqSelectorRow: { flexDirection: 'row', gap: 6, paddingBottom: 8, paddingLeft: 42 },
  freqChoice: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(74,47,39,0.12)',
    backgroundColor: 'rgba(74,47,39,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 8,
  },
  freqChoiceText: { fontSize: 9, fontWeight: '700', color: C.cocoa, textTransform: 'uppercase' },

  chipsRow: { gap: 6, paddingBottom: 8, marginBottom: 8 },
  filterChip: {
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  filterChipText: { fontSize: 11, fontWeight: '700', color: C.deepGreen },
  filterCount: {
    borderRadius: 99,
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: 'rgba(26,60,52,0.08)',
  },
  filterCountActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  filterCountText: { fontSize: 10, fontWeight: '700', color: C.deepGreen },

  emptyCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.16)',
    paddingVertical: 42,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(212,175,55,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: { fontSize: 14, color: 'rgba(74,47,39,0.7)', fontWeight: '700', marginBottom: 4 },
  emptySub: { fontSize: 12, color: 'rgba(74,47,39,0.55)', textAlign: 'center' },

  notifCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    position: 'relative',
  },
  unreadBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  deleteBtn: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(74,47,39,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(74,47,39,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  notifMain: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingRight: 24 },
  notifIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  notifMetaphor: { flex: 1, fontSize: 11, fontWeight: '700', color: C.deepGreen },
  notifTime: { fontSize: 9, color: 'rgba(74,47,39,0.5)' },
  notifMessage: { fontSize: 12, lineHeight: 17, color: 'rgba(74,47,39,0.78)' },

  clearAllFooterBtn: {
    marginTop: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(74,47,39,0.25)',
    borderStyle: 'dashed',
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  clearAllFooterText: { color: 'rgba(74,47,39,0.62)', fontSize: 12, fontWeight: '600' },
});
