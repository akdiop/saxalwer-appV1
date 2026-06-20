import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/appcontext';
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  SORTED_TERMS,
  type GlossaryEntry,
} from '../data/glossary';

const COLORS = {
  bg: '#F5F1E6',
  surface: '#FFFCF7',
  white: '#FFFFFF',
  deepGreen: '#1A3C34',
  copper: '#B5622A',
  terracotta: '#A65D40',
  cocoa: '#4A2F27',
  border: 'rgba(181,98,42,0.14)',
  softBorder: 'rgba(26,60,52,0.08)',
};

type ThemeKey = keyof typeof GLOSSARY_CATEGORIES | 'all';

type GlossaryItem = {
  term: string;
  entry: GlossaryEntry;
};

type RankedGlossaryItem = GlossaryItem & {
  score: number;
};

function capitalizeGlossaryTerm(term: string) {
  if (!term) {
    return term;
  }

  return term.charAt(0).toUpperCase() + term.slice(1);
}

function normalizeSearchValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’`-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function getSearchScore(item: GlossaryItem, query: string) {
  if (!query) {
    return 0;
  }

  const normalizedTerm = normalizeSearchValue(item.term);
  const normalizedDefinitionFr = normalizeSearchValue(item.entry.fr);
  const normalizedDefinitionWo = normalizeSearchValue(item.entry.wo);
  const normalizedCategoryFr = normalizeSearchValue(GLOSSARY_CATEGORIES[item.entry.category].fr);
  const normalizedCategoryWo = normalizeSearchValue(GLOSSARY_CATEGORIES[item.entry.category].wo);
  const queryTokens = query.split(' ').filter(Boolean);

  let score = 0;

  if (normalizedTerm === query) {
    score += 120;
  } else if (normalizedTerm.startsWith(query)) {
    score += 90;
  } else if (normalizedTerm.includes(query)) {
    score += 70;
  }

  for (const token of queryTokens) {
    if (normalizedTerm === token) {
      score += 48;
      continue;
    }

    if (normalizedTerm.startsWith(token)) {
      score += 28;
      continue;
    }

    if (normalizedTerm.includes(token)) {
      score += 18;
      continue;
    }

    if (normalizedDefinitionFr.includes(token) || normalizedDefinitionWo.includes(token)) {
      score += 8;
      continue;
    }

    if (normalizedCategoryFr.includes(token) || normalizedCategoryWo.includes(token)) {
      score += 5;
    }
  }

  return score;
}

function getToneLabel(
  personalization: ReturnType<typeof useApp>['personalization'],
  language: 'fr' | 'wo'
) {
  if (language === 'wo') {
    if (personalization.socialNorms === 'conservative' || personalization.privacyLevel === 'very-high') {
      return 'Wax yu gëna sutura';
    }

    if (personalization.needsSupport) {
      return 'Wax yu gëna andale';
    }

    return 'Wax yu leer';
  }

  if (personalization.socialNorms === 'conservative' || personalization.privacyLevel === 'very-high') {
    return 'Ton plus discret';
  }

  if (personalization.needsSupport) {
    return 'Ton plus rassurant';
  }

  return 'Ton clair et simple';
}

export default function GlossaireScreen() {
  const router = useRouter();
  const { language, trackGlossaryView, personalization } = useApp();
  const wo = language === 'wo';
  const [query, setQuery] = React.useState('');
  const [activeTheme, setActiveTheme] = React.useState<ThemeKey>('all');

  const themeOptions = React.useMemo(
    () => [
      {
        key: 'all' as const,
        label: wo ? 'Lépp' : 'Tous',
      },
      ...Object.entries(GLOSSARY_CATEGORIES).map(([key, label]) => ({
        key: key as keyof typeof GLOSSARY_CATEGORIES,
        label: wo ? label.wo : label.fr,
      })),
    ],
    [wo]
  );

  const glossaryItems = React.useMemo<RankedGlossaryItem[]>(() => {
    const normalizedQuery = normalizeSearchValue(query);
    const items = SORTED_TERMS.map((term) => ({
      term,
      entry: GLOSSARY[term],
    }))
      .filter(({ entry }) => activeTheme === 'all' || entry.category === activeTheme)
      .map((item) => ({
        ...item,
        score: normalizedQuery ? getSearchScore(item, normalizedQuery) : 0,
      }))
      .filter((item) => !normalizedQuery || item.score > 0);

    return [...items].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.term.localeCompare(b.term, wo ? 'wo' : 'fr');
    });
  }, [activeTheme, query, wo]);

  const suggestedTerms = React.useMemo(
    () => (query ? glossaryItems.slice(0, 5) : []),
    [glossaryItems, query]
  );

  const highlightedThemeLabel =
    activeTheme === 'all'
      ? wo
        ? 'Lépp'
        : 'Tous'
      : wo
        ? GLOSSARY_CATEGORIES[activeTheme].wo
        : GLOSSARY_CATEGORIES[activeTheme].fr;

  const toneLabel = getToneLabel(personalization, language);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>{wo ? 'Retour' : 'Retour'}</Text>
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>{wo ? 'Glossaire' : 'Glossaire'}</Text>
            <Text style={styles.subtitle}>
              {wo
                ? 'Dégg ay wax yu am solo ci santé sexuelle ak reproductive.'
                : 'Les mots utiles, expliqués dans un langage plus simple et plus apaisé.'}
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>{wo ? 'Repères de lecture' : 'Repères de lecture'}</Text>
          <Text style={styles.heroTitle}>
            {wo
              ? 'Xam sa baat yi ngir gëna dégg sa yaram'
              : 'Comprendre les termes pour mieux comprendre ton corps'}
          </Text>
          <Text style={styles.heroDescription}>
            {wo
              ? 'Seet, filtre te jàngat waxi santé yu am solo. Benn baat, benn tekki bu leer.'
              : 'Cherche un mot, filtre par thème, puis retrouve une définition claire, sobre et adaptée à ton contexte.'}
          </Text>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={
              wo ? 'Seet term wala définition...' : 'Rechercher un terme ou une définition...'
            }
            placeholderTextColor="rgba(74,47,39,0.45)"
          />
        </View>

        {suggestedTerms.length > 0 ? (
          <View style={styles.suggestionsBlock}>
            <Text style={styles.sectionLabel}>
              {wo ? 'Mën nga doon seet lii' : 'Suggestions proches'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsRow}
            >
              {suggestedTerms.map(({ term }) => (
                <Pressable
                  key={term}
                  onPress={() => {
                    setQuery(capitalizeGlossaryTerm(term));
                    trackGlossaryView(term);
                  }}
                  style={styles.suggestionChip}
                >
                  <Text style={styles.suggestionChipText}>{capitalizeGlossaryTerm(term)}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {wo ? `${glossaryItems.length} waxi-kàddu` : `${glossaryItems.length} termes`}
          </Text>
          <Text style={styles.summaryText}>
            {wo ? 'Theme:' : 'Thème :'} {highlightedThemeLabel}
          </Text>
          <Text style={styles.summaryText}>
            {wo ? 'Melokaanu wax ji:' : 'Ton :'} {toneLabel}
          </Text>
        </View>

        <Text style={styles.sectionLabel}>{wo ? 'Themes' : 'Thèmes'}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.themesRow}
        >
          {themeOptions.map((theme) => {
            const active = theme.key === activeTheme;
            return (
              <Pressable
                key={theme.key}
                onPress={() => setActiveTheme(theme.key)}
                style={[styles.themeChip, active && styles.themeChipActive]}
              >
                <Text style={[styles.themeChipText, active && styles.themeChipTextActive]}>
                  {theme.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.list}>
          {glossaryItems.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                {wo ? 'Amul dara ci seet bi' : 'Aucun terme trouvé'}
              </Text>
              <Text style={styles.emptyText}>
                {wo
                  ? 'Jéemaat ak beneen wax walla soppi theme bi.'
                  : 'Essaie un autre mot-clé ou élargis le thème choisi.'}
              </Text>
            </View>
          ) : (
            glossaryItems.map(({ term, entry }) => (
              <Pressable
                key={term}
                onPress={() => trackGlossaryView(term)}
                style={styles.card}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.cardTerm}>{capitalizeGlossaryTerm(term)}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {wo
                        ? GLOSSARY_CATEGORIES[entry.category].wo
                        : GLOSSARY_CATEGORIES[entry.category].fr}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardDefinition}>{wo ? entry.wo : entry.fr}</Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 20, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 18 },
  headerText: { flex: 1 },
  backBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.softBorder,
  },
  backBtnText: { color: COLORS.deepGreen, fontSize: 13, fontWeight: '700' },
  title: { fontSize: 30, fontWeight: '700', color: COLORS.deepGreen, marginBottom: 6 },
  subtitle: { fontSize: 14, lineHeight: 22, color: 'rgba(74,47,39,0.72)' },
  heroCard: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 20,
    marginBottom: 16,
  },
  heroEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: COLORS.terracotta,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '700',
    color: COLORS.deepGreen,
    marginBottom: 10,
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.cocoa,
  },
  searchBox: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.softBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: { color: COLORS.cocoa, fontSize: 14, padding: 0 },
  suggestionsBlock: { marginBottom: 14 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: 'rgba(74,47,39,0.58)',
    marginBottom: 8,
  },
  suggestionsRow: { gap: 8, paddingBottom: 4 },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(181,98,42,0.07)',
  },
  suggestionChipText: { fontSize: 12, color: COLORS.copper, fontWeight: '600' },
  summaryCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: COLORS.deepGreen, marginBottom: 6 },
  summaryText: { fontSize: 13, color: 'rgba(74,47,39,0.72)', lineHeight: 20 },
  themesRow: { gap: 8, paddingBottom: 6, marginBottom: 16 },
  themeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.softBorder,
    backgroundColor: COLORS.white,
  },
  themeChipActive: {
    backgroundColor: 'rgba(181,98,42,0.10)',
    borderColor: COLORS.border,
  },
  themeChipText: { fontSize: 12, color: COLORS.cocoa, fontWeight: '600' },
  themeChipTextActive: { color: COLORS.copper },
  list: { gap: 10 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.softBorder,
    padding: 16,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  cardTerm: { flex: 1, fontSize: 22, lineHeight: 28, fontWeight: '700', color: COLORS.deepGreen },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(26,60,52,0.06)',
    borderWidth: 1,
    borderColor: COLORS.softBorder,
  },
  badgeText: { fontSize: 11, color: COLORS.deepGreen, fontWeight: '600' },
  cardDefinition: { fontSize: 15, lineHeight: 24, color: 'rgba(74,47,39,0.84)' },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.softBorder,
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.deepGreen, marginBottom: 6 },
  emptyText: {
    fontSize: 13,
    color: 'rgba(74,47,39,0.58)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
