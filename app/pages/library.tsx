import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useApp } from '../../context/appcontext';
import { ARTICLES, type Article } from '../../data/articles';

const BASE = {
  bg: '#F5F1E6',
  surface: '#FFFCF7',
  white: '#FFFFFF',
  deepGreen: '#1A3C34',
  copper: '#B5622A',
  terracotta: '#A65D40',
  cocoa: '#4A2F27',
  line: 'rgba(181,98,42,0.14)',
  softLine: 'rgba(26,60,52,0.08)',
};

const LIFE_STAGES = [
  { label: 'Toutes', filter: 'all' },
  { label: 'Découverte', filter: 'Découverte' },
  { label: 'Autonomie', filter: 'Autonomie' },
  { label: 'Maternité', filter: 'Maternité' },
  { label: 'Plénitude', filter: 'Plénitude' },
] as const;

const CATEGORIES = [
  { fr: 'Tout', wo: 'Yépp', value: 'Tout' },
  { fr: 'Pour toi', wo: 'Ngir yaw', value: 'PourToi' },
  { fr: 'Contraception', wo: 'Contraception', value: 'Contraception' },
  { fr: 'Grossesse', wo: 'Gàtt', value: 'Grossesse' },
  { fr: 'Fertilité', wo: 'Fertilité', value: 'Fertilité' },
  { fr: 'IST & Prévention', wo: 'IST & Jiitu', value: 'IST & Prévention' },
  { fr: 'Maladies chroniques', wo: 'Feebar bu yàgg', value: 'Maladies chroniques' },
  { fr: 'Post-partum', wo: 'Ginnaaw doom', value: 'Post-partum' },
  { fr: 'Ménopause', wo: 'Ménopause', value: 'Ménopause' },
  { fr: 'Infertilité', wo: 'Ñàkk doom', value: 'Infertilité' },
];

function ArticleRow({
  article,
  wo,
  isFavorite,
  onToggleFavorite,
  onNavigate,
}: {
  article: Article;
  wo: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onNavigate: () => void;
}) {
  return (
    <Pressable onPress={onNavigate} style={styles.articleCard}>
      <View style={styles.articleTop}>
        <View style={styles.articleTopLeft}>
          <Text style={styles.articleCategory}>{wo ? article.categoryWo : article.category}</Text>
          <Text style={styles.articleMeta}>
            {article.readTime} • {article.author}
          </Text>
        </View>
        <Pressable onPress={onToggleFavorite} style={styles.savePill}>
          <Text style={[styles.savePillText, isFavorite && styles.savePillTextActive]}>
            {isFavorite ? (wo ? 'Sauvé' : 'Sauvé') : wo ? 'Sauver' : 'Sauver'}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.articleTitle}>{wo ? article.titleWo : article.title}</Text>
      <Text style={styles.articleDesc}>{wo ? article.descriptionWo : article.description}</Text>

      <View style={styles.articleFooter}>
        <Text style={styles.articleFooterText}>
          {wo ? article.lifeStageWo : article.lifeStage}
        </Text>
        <Text style={styles.articleFooterDivider}>•</Text>
        <Text style={styles.articleFooterText}>
          {article.readers.toLocaleString()} {wo ? 'lectrices' : 'lectrices'}
        </Text>
      </View>
    </Pressable>
  );
}

export default function LibraryScreen() {
  const router = useRouter();
  const rawParams = useLocalSearchParams();
  const urlTag = typeof rawParams.tag === 'string' ? rawParams.tag : '';

  const { toggleFavorite, isFavorite, language, userProfile, personalization } = useApp();
  const wo = language === 'wo';

  const [activeTab, setActiveTab] = React.useState('Tout');
  const [activeStage, setActiveStage] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState(urlTag);
  const [tagFilter, setTagFilter] = React.useState(urlTag);

  const filteredArticles = React.useMemo(() => {
    return ARTICLES.filter((a) => {
      if (activeTab === 'PourToi') {
        const healthMatches =
          (userProfile.healthConditions ?? []).length > 0 &&
          (userProfile.healthConditions ?? []).some(
            (c) =>
              a.tags.some((t) => t.toLowerCase().includes(c.toLowerCase())) ||
              a.title.toLowerCase().includes(c.toLowerCase())
          );
        const faithMatches =
          !!userProfile.religiousFaith &&
          (a.tags.some(
            (t) => t.toLowerCase().includes('religion') || t.toLowerCase().includes('foi')
          ) ||
            a.category === 'Foi & Santé');
        const contraceptionMatches =
          userProfile.contraceptionActive && a.category === 'Contraception';
        if (!healthMatches && !faithMatches && !contraceptionMatches) return false;
      } else if (activeTab !== 'Tout' && a.category !== activeTab) {
        return false;
      }

      const matchesStage =
        activeStage === 'all' || a.lifeStage === activeStage || a.lifeStage === 'Toutes';
      const matchesTag =
        !tagFilter ||
        a.tags.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase())) ||
        a.tagsWo.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()));
      const matchesSearch =
        searchQuery === '' ||
        searchQuery === tagFilter ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesStage && (tagFilter ? matchesTag : matchesSearch);
    });
  }, [activeStage, activeTab, searchQuery, tagFilter, userProfile]);

  const featuredArticle = ARTICLES.find((a) => a.featured);
  const showFeatured = activeTab === 'Tout' && activeStage === 'all' && !!featuredArticle;
  const listArticles = filteredArticles.filter((a) => !(showFeatured && a.featured));

  const introCopy = wo
    ? 'Jàngale yu dal, yu leer, te mën a topp sa xaalis ak sa sutura.'
    : "Des lectures calmes, claires et adaptees a ton contexte, avec des definitions quand un terme demande plus d'explication.";

  const toneCopy =
    personalization.socialNorms === 'conservative' || personalization.privacyLevel === 'very-high'
      ? wo
        ? 'Wax yu gëna sutura'
        : 'Ton plus discret'
      : personalization.needsSupport
        ? wo
          ? 'Wax yu gëna andale'
          : 'Ton plus rassurant'
        : wo
          ? 'Wax yu leer'
          : 'Ton clair';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>{wo ? 'Retour' : 'Retour'}</Text>
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{wo ? 'Jàngale yi' : 'Bibliothèque'}</Text>
            <Text style={styles.headerSub}>{introCopy}</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryEyebrow}>{wo ? 'Bibliothèque sensible' : 'Bibliothèque sensible'}</Text>
          <Text style={styles.summaryTitle}>
            {ARTICLES.length} {wo ? 'jàngale yu am' : 'lectures disponibles'}
          </Text>
          <Text style={styles.summaryText}>
            {wo ? 'Melokaanu wax ji:' : 'Ajustement du ton :'} {toneCopy}
          </Text>
        </View>

        {!!tagFilter && (
          <View style={styles.tagBanner}>
            <Text style={styles.tagBannerText}>
              {wo ? 'Filtré ci' : 'Filtré par'} : "{tagFilter}"
            </Text>
            <Pressable
              onPress={() => {
                setTagFilter('');
                setSearchQuery('');
              }}
              style={styles.clearInlineButton}
            >
              <Text style={styles.clearInlineButtonText}>{wo ? 'Effacer' : 'Effacer'}</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.searchBox}>
          <TextInput
            placeholder={wo ? 'Seetlu ci sujet...' : 'Rechercher un sujet...'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="rgba(74,47,39,0.45)"
          />
        </View>

        <Text style={styles.filterLabel}>{wo ? 'Etape de vie' : 'Etape de vie'}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {LIFE_STAGES.map((ls) => (
            <Pressable
              key={ls.filter}
              onPress={() => setActiveStage(ls.filter)}
              style={[styles.chip, activeStage === ls.filter && styles.chipActive]}
            >
              <Text style={[styles.chipText, activeStage === ls.filter && styles.chipTextActive]}>
                {ls.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>{wo ? 'Catégories' : 'Catégories'}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          style={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.value}
              onPress={() => setActiveTab(cat.value)}
              style={[styles.chip, activeTab === cat.value && styles.chipActive]}
            >
              <Text style={[styles.chipText, activeTab === cat.value && styles.chipTextActive]}>
                {wo ? cat.wo : cat.fr}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {showFeatured && featuredArticle && (
          <Pressable
            onPress={() => router.push(`/bibliotheque/${featuredArticle.id}` as any)}
            style={styles.featuredCard}
          >
            <Text style={styles.featuredEyebrow}>{wo ? 'A lire en ce moment' : 'A lire en ce moment'}</Text>
            <Text style={styles.featuredTitle}>
              {wo ? featuredArticle.titleWo : featuredArticle.title}
            </Text>
            <Text style={styles.featuredDesc}>
              {wo ? featuredArticle.descriptionWo : featuredArticle.description}
            </Text>
            <View style={styles.featuredMetaRow}>
              <Text style={styles.featuredMetaText}>{featuredArticle.author}</Text>
              <Text style={styles.featuredMetaDivider}>•</Text>
              <Text style={styles.featuredMetaText}>{featuredArticle.readTime}</Text>
            </View>
          </Pressable>
        )}

        <View style={styles.listContainer}>
          {listArticles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                {wo ? 'Amul jàngale fii' : 'Aucun article trouvé'}
              </Text>
              <Text style={styles.emptyHint}>
                {wo ? 'Jéemal beneen baat walla soppi filtre yi.' : 'Essaie un autre mot-clé ou un filtre plus large.'}
              </Text>
            </View>
          ) : (
            listArticles.map((article) => (
              <ArticleRow
                key={article.id}
                article={article}
                wo={wo}
                isFavorite={isFavorite(article.id)}
                onToggleFavorite={() => toggleFavorite(article.id)}
                onNavigate={() => router.push(`/bibliotheque/${article.id}` as any)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BASE.bg },
  content: { padding: 20, paddingBottom: 110 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 18,
  },
  backBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BASE.softLine,
    backgroundColor: BASE.surface,
  },
  backBtnText: {
    color: BASE.deepGreen,
    fontSize: 13,
    fontWeight: '700',
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 30, fontWeight: '700', color: BASE.deepGreen, marginBottom: 6 },
  headerSub: { fontSize: 14, lineHeight: 22, color: 'rgba(74,47,39,0.72)' },
  summaryCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BASE.line,
    backgroundColor: BASE.surface,
    padding: 18,
    marginBottom: 16,
  },
  summaryEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: BASE.copper,
    marginBottom: 6,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(74,47,39,0.72)',
  },
  tagBanner: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BASE.line,
    backgroundColor: 'rgba(181,98,42,0.06)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  tagBannerText: {
    flex: 1,
    color: BASE.copper,
    fontSize: 13,
    fontWeight: '600',
  },
  clearInlineButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BASE.line,
  },
  clearInlineButtonText: {
    color: BASE.copper,
    fontSize: 12,
    fontWeight: '700',
  },
  searchBox: {
    backgroundColor: BASE.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BASE.softLine,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },
  searchInput: { color: BASE.cocoa, fontSize: 14, padding: 0 },
  filterLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: 'rgba(74,47,39,0.58)',
    marginBottom: 8,
  },
  chipsRow: { gap: 8, paddingBottom: 6 },
  categoriesRow: { marginBottom: 18 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BASE.softLine,
    backgroundColor: BASE.white,
  },
  chipActive: {
    backgroundColor: 'rgba(181,98,42,0.10)',
    borderColor: BASE.line,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: BASE.cocoa,
  },
  chipTextActive: {
    color: BASE.copper,
  },
  featuredCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BASE.line,
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 18,
  },
  featuredEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: BASE.terracotta,
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 10,
  },
  featuredDesc: {
    fontSize: 15,
    lineHeight: 25,
    color: BASE.cocoa,
    marginBottom: 12,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featuredMetaText: {
    fontSize: 12,
    color: 'rgba(74,47,39,0.66)',
  },
  featuredMetaDivider: {
    fontSize: 12,
    color: 'rgba(74,47,39,0.35)',
  },
  listContainer: { gap: 12 },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BASE.softLine,
    padding: 18,
  },
  articleTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  articleTopLeft: {
    flex: 1,
  },
  articleCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: BASE.terracotta,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  articleMeta: {
    fontSize: 12,
    color: 'rgba(74,47,39,0.6)',
  },
  savePill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BASE.line,
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: BASE.surface,
  },
  savePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: BASE.cocoa,
  },
  savePillTextActive: {
    color: BASE.copper,
  },
  articleTitle: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 10,
  },
  articleDesc: {
    fontSize: 15,
    lineHeight: 24,
    color: BASE.cocoa,
    marginBottom: 14,
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  articleFooterText: {
    fontSize: 12,
    color: 'rgba(74,47,39,0.66)',
  },
  articleFooterDivider: {
    fontSize: 12,
    color: 'rgba(74,47,39,0.35)',
  },
  emptyState: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BASE.softLine,
    backgroundColor: '#FFFFFF',
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 6,
  },
  emptyHint: {
    fontSize: 13,
    color: 'rgba(74,47,39,0.58)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
