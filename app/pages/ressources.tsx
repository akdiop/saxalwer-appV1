import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../../context/appcontext';
import { ARTICLES } from '../../data/articles';
import { GLOSSARY } from '../../data/glossary';

const COLORS = {
  bg: '#FDFAF5',
  deepGreen: '#1A3C34',
  copper: '#B5622A',
  cocoa: '#4A2F27',
};

const DEFAULT_QUICK_TAGS = ['Contraception', 'Grossesse', 'IST', 'Ménopause', 'Infertilité', 'Post-partum'];
const CONSULTATION_TAGS = ['Cycle menstruel', 'Douleurs', 'Pertes vaginales', 'Contraception', 'Fertilité', 'Grossesse'];
const CONSULTATION_ARTICLE_IDS = [26, 25, 20, 10, 16];
const CONSULTATION_GLOSSARY_TERMS = ['consultation', 'symptômes', 'antécédents', 'diagnostic', 'ordonnance'] as const;
const CONSULTATION_PREP = [
  {
    icon: 'edit-3',
    titleFr: 'Avant d’y aller',
    titleWo: 'Bala ngay dem',
    textFr: 'Note la date de tes dernières règles, ce qui a changé, ce qui te gêne le plus et les traitements déjà essayés.',
    textWo: 'Bind bésu sa règles yu mujj, li soppeeku, li la gëna sonal ak traitements yi nga mas a jëfandikoo.',
  },
  {
    icon: 'message-circle',
    titleFr: 'Pendant l’échange',
    titleWo: 'Bu ngeen di wax',
    textFr: 'Dis avec tes mots ce que tu ressens, depuis quand, à quelle fréquence et ce que tu aimerais comprendre.',
    textWo: 'Wax ak sa baat li ngay yëg, kañ la tàmbali, ni mu faral di am ak li nga bëgg a dégg.',
  },
  {
    icon: 'help-circle',
    titleFr: 'Avant de sortir',
    titleWo: 'Bala ngay génn',
    textFr: 'Vérifie que tu as compris le diagnostic proposé, les examens utiles, le traitement, et quand revenir.',
    textWo: 'Xool ndax dégg nga diagnostic bi, examens yi am solo, traitement bi ak kañ nga wara dellu.',
  },
] as const;

function formatTerm(term: string) {
  if (!term) {
    return term;
  }

  return term.charAt(0).toUpperCase() + term.slice(1);
}

export default function RessourcesPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ focus?: string }>();
  const { language, oralMode } = useApp();
  const wo = language === 'wo';
  const isConsultationFocus = params.focus === 'consultation';
  const [query, setQuery] = React.useState('');

  const suggestedPool = React.useMemo(() => {
    if (!isConsultationFocus) {
      return ARTICLES;
    }

    return CONSULTATION_ARTICLE_IDS
      .map((id) => ARTICLES.find((article) => article.id === id))
      .filter((article): article is (typeof ARTICLES)[number] => Boolean(article));
  }, [isConsultationFocus]);

  const suggested = React.useMemo(() => {
    if (!query.trim()) {
      return suggestedPool.slice(0, isConsultationFocus ? 5 : 6);
    }

    const q = query.toLowerCase();
    return suggestedPool.filter((article) =>
      article.title.toLowerCase().includes(q) ||
      article.description.toLowerCase().includes(q) ||
      article.tags.some((tag) => tag.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [isConsultationFocus, query, suggestedPool]);

  const glossaryPreview = React.useMemo(
    () =>
      CONSULTATION_GLOSSARY_TERMS.map((term) => ({
        term,
        entry: GLOSSARY[term],
      })),
    []
  );

  const quickTags = isConsultationFocus ? CONSULTATION_TAGS : DEFAULT_QUICK_TAGS;

  function onOpenTag(tag: string) {
    router.push({ pathname: '/bibliotheque', params: { tag } } as any);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={20} color={COLORS.deepGreen} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{wo ? 'Ressources' : 'Ressources'}</Text>
            <Text style={styles.subtitle}>
              {isConsultationFocus
                ? wo
                  ? 'Waajal sa consultation ak ay repères yu leer'
                  : 'Prépare ta consultation avec des repères clairs'
                : wo
                  ? 'Seetlu ndimbal yi ngay soxla'
                  : "Trouve rapidement l'aide qui te correspond"}
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Feather name="compass" size={13} color="rgba(255,255,255,0.82)" />
            <Text style={styles.heroBadgeText}>
              {isConsultationFocus ? (wo ? 'Consultation' : 'Consultation') : wo ? 'Yoon yi' : 'Ressources'}
            </Text>
          </View>
          <Text style={styles.heroTitle}>
            {isConsultationFocus
              ? wo
                ? 'Jàng, waajal te gis baat yu am solo bala consultation'
                : 'Lis, prépare-toi et trouve les bons mots avant la consultation'
              : wo
                ? 'Seetal ndimbal yi gëna jëm ci sa soxla'
                : 'Trouve la bonne ressource au bon moment'}
          </Text>
          <Text style={styles.heroDescription}>
            {isConsultationFocus
              ? wo
                ? 'Jàngale yu jëm ci consultation, waxi-kàddu yu am solo ak repères pratiques ngir nga man a wax sa soxla ci xel mu dal.'
                : 'Articles ciblés, vocabulaire utile et repères pratiques pour aider la patiente à expliquer ses symptômes, poser ses questions et mieux comprendre les consignes.'
              : wo
                ? 'Jàngale, termes utiles, centres ak yeneen ndimbal yu jëm ci sa yoon.'
                : 'Articles, glossaire, repères pratiques et accès rapides pour t’orienter sans te perdre.'}
          </Text>
        </View>

        <View style={styles.searchBox}>
          <Feather name="search" size={16} color="rgba(74,47,39,0.6)" />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={
              isConsultationFocus
                ? wo
                  ? 'Seetlu article bu jëm ci consultation...'
                  : 'Rechercher un article pour préparer la consultation...'
                : wo
                  ? 'Seetlu jàngale...'
                  : 'Rechercher des ressources...'
            }
            placeholderTextColor="rgba(74,47,39,0.45)"
          />
          {oralMode ? <Feather name="volume-2" size={16} color={COLORS.copper} /> : null}
        </View>

        {isConsultationFocus ? (
          <View style={styles.prepCard}>
            <Text style={styles.prepTitle}>
              {wo ? 'Repères avant la consultation' : 'Repères avant la consultation'}
            </Text>
            <View style={styles.prepList}>
              {CONSULTATION_PREP.map((item) => (
                <View key={item.titleFr} style={styles.prepItem}>
                  <View style={styles.prepIconWrap}>
                    <Feather name={item.icon as never} size={16} color={COLORS.deepGreen} />
                  </View>
                  <View style={styles.prepItemBody}>
                    <Text style={styles.prepItemTitle}>{wo ? item.titleWo : item.titleFr}</Text>
                    <Text style={styles.prepItemText}>{wo ? item.textWo : item.textFr}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>
          {isConsultationFocus
            ? wo
              ? 'Sujets à préparer'
              : 'Sujets à préparer'
            : wo
              ? 'Sujets populaires'
              : 'Sujets populaires'}
        </Text>
        <View style={styles.tagsWrap}>
          {quickTags.map((tag) => (
            <Pressable key={tag} style={styles.tag} onPress={() => onOpenTag(tag)}>
              <Text style={styles.tagText}>{tag}</Text>
            </Pressable>
          ))}
        </View>

        {isConsultationFocus ? (
          <>
            <Text style={styles.sectionLabel}>
              {wo ? 'Waxi-kàddu yu jariñ bala consultation' : 'Glossaire utile avant le rendez-vous'}
            </Text>
            <View style={styles.glossaryPreviewList}>
              {glossaryPreview.map(({ term, entry }) => (
                <View key={term} style={styles.glossaryPreviewCard}>
                  <Text style={styles.glossaryPreviewTerm}>{formatTerm(term)}</Text>
                  <Text style={styles.glossaryPreviewDefinition}>
                    {wo ? entry.wo : entry.fr}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <Pressable style={styles.glossaryCard} onPress={() => router.push('/glossaire' as any)}>
          <View style={styles.glossaryIconWrap}>
            <Feather name="book-open" size={18} color={COLORS.deepGreen} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.glossaryTitle}>{wo ? 'Glossaire' : 'Glossaire'}</Text>
            <Text style={styles.glossaryText}>
              {isConsultationFocus
                ? wo
                  ? 'Jàngat baat yu mën a feeñ ci consultation ngir nga gën a dégg li ñu lay wax.'
                  : 'Retrouve les mots qui reviennent souvent en consultation pour mieux comprendre ce que le soignant explique.'
                : wo
                  ? 'Seet waxi santé sexuelle ak reproductive te filtre ko ci theme.'
                  : 'Retrouve les termes de santé sexuelle et reproductive, avec filtres par thème.'}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="rgba(74,47,39,0.35)" />
        </Pressable>

        <Text style={styles.sectionLabel}>
          {isConsultationFocus
            ? wo
              ? 'Articles bala consultation'
              : 'Articles avant la consultation'
            : wo
              ? 'Suggestions'
              : 'Suggestions'}
        </Text>
        <View style={styles.cards}>
          {suggested.length === 0 ? (
            <View style={styles.emptyBox}>
              <Feather name="search" size={24} color="rgba(74,47,39,0.3)" />
              <Text style={styles.emptyText}>{wo ? 'Amul dara ci seet bi' : 'Aucun résultat'}</Text>
            </View>
          ) : (
            suggested.map((article) => (
              <Pressable
                key={article.id}
                style={styles.card}
                onPress={() => router.push(`/bibliotheque/${article.id}` as any)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardCategory}>{article.category}</Text>
                  <Text style={styles.cardTitle}>{wo ? article.titleWo : article.title}</Text>
                  <Text numberOfLines={2} style={styles.cardDesc}>
                    {wo ? article.descriptionWo : article.description}
                  </Text>
                </View>
                <Feather name="chevron-right" size={17} color="rgba(74,47,39,0.35)" />
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.actionsRow}>
          <Pressable style={styles.actionBtn} onPress={() => router.push('/carte' as any)}>
            <Feather name="map-pin" size={15} color={COLORS.deepGreen} />
            <Text style={styles.actionText}>{wo ? 'Centres' : 'Centres'}</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => router.push('/faq' as any)}>
            <Feather name="help-circle" size={15} color={COLORS.deepGreen} />
            <Text style={styles.actionText}>FAQ</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => router.push('/bibliotheque' as any)}>
            <Feather name="book-open" size={15} color={COLORS.deepGreen} />
            <Text style={styles.actionText}>{wo ? 'Jàngale' : 'Bibliothèque'}</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => router.push('/glossaire' as any)}>
            <Feather name="type" size={15} color={COLORS.deepGreen} />
            <Text style={styles.actionText}>{wo ? 'Glossaire' : 'Glossaire'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 22, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.deepGreen,
    fontFamily: Platform.OS === 'ios' ? 'CormorantGaramond-Bold' : 'serif',
  },
  subtitle: { fontSize: 13, color: 'rgba(74,47,39,0.6)', marginTop: 4 },
  heroCard: {
    borderRadius: 28,
    backgroundColor: COLORS.deepGreen,
    paddingHorizontal: 24,
    paddingVertical: 26,
    marginBottom: 18,
    overflow: 'hidden',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 18,
  },
  heroBadgeText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    marginBottom: 10,
    maxWidth: 720,
    fontFamily: Platform.OS === 'ios' ? 'CormorantGaramond-Bold' : 'serif',
  },
  heroDescription: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 15,
    lineHeight: 26,
    maxWidth: 860,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 16,
  },
  searchInput: { flex: 1, color: COLORS.cocoa, fontSize: 14, padding: 0 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: 'rgba(74,47,39,0.58)',
    marginBottom: 8,
  },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.3)',
    backgroundColor: 'rgba(181,98,42,0.12)',
  },
  tagText: { fontSize: 12, color: COLORS.copper, fontWeight: '600' },
  prepCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.16)',
    backgroundColor: '#FFF8F1',
    padding: 18,
    marginBottom: 18,
  },
  prepTitle: {
    fontSize: 18,
    color: COLORS.deepGreen,
    fontWeight: '700',
    marginBottom: 12,
  },
  prepList: { gap: 12 },
  prepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  prepIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(26,60,52,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  prepItemBody: { flex: 1 },
  prepItemTitle: {
    fontSize: 14,
    color: COLORS.deepGreen,
    fontWeight: '700',
    marginBottom: 4,
  },
  prepItemText: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(74,47,39,0.72)',
  },
  glossaryPreviewList: { gap: 10, marginBottom: 16 },
  glossaryPreviewCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.08)',
    backgroundColor: '#FFFFFF',
    padding: 14,
  },
  glossaryPreviewTerm: {
    fontSize: 15,
    color: COLORS.deepGreen,
    fontWeight: '700',
    marginBottom: 6,
  },
  glossaryPreviewDefinition: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(74,47,39,0.72)',
  },
  glossaryCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.08)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 3,
  },
  glossaryIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(26,60,52,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glossaryTitle: { fontSize: 15, color: COLORS.deepGreen, fontWeight: '700', marginBottom: 4 },
  glossaryText: { fontSize: 12, color: 'rgba(74,47,39,0.68)', lineHeight: 17 },
  cards: { gap: 10, marginBottom: 18 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
    elevation: 3,
  },
  cardCategory: { fontSize: 10, color: COLORS.copper, textTransform: 'uppercase', fontWeight: '700', marginBottom: 4 },
  cardTitle: { fontSize: 15, color: COLORS.deepGreen, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: 'rgba(74,47,39,0.68)', lineHeight: 17 },
  actionsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actionBtn: {
    minWidth: '23%',
    flexGrow: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.15)',
    backgroundColor: '#fff',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionText: { fontSize: 12, color: COLORS.deepGreen, fontWeight: '600' },
  emptyBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: { marginTop: 8, fontSize: 13, color: 'rgba(74,47,39,0.55)' },
});
