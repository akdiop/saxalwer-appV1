import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/appcontext';
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  SORTED_TERMS,
  type GlossaryEntry,
} from '../data/glossary';

const COLORS = {
  bg: '#FDFAF5',
  deepGreen: '#1A3C34',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  border: 'rgba(26,60,52,0.1)',
  chipBg: 'rgba(181,98,42,0.1)',
  white: '#FFFFFF',
};

type ThemeKey = keyof typeof GLOSSARY_CATEGORIES | 'all';

type GlossaryItem = {
  term: string;
  entry: GlossaryEntry;
};

export default function GlossaireScreen() {
  const router = useRouter();
  const { language, oralMode, trackGlossaryView } = useApp();
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

  const glossaryItems = React.useMemo<GlossaryItem[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const items = SORTED_TERMS.map((term) => ({
      term,
      entry: GLOSSARY[term],
    })).filter(({ entry }) => {
      if (activeTheme !== 'all' && entry.category !== activeTheme) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        entry.fr,
        entry.wo,
        entry.category,
        term,
      ].join(' ').toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    return [...items].sort((a, b) => {
      const aLabel = wo ? a.term.toLowerCase() : a.term.toLowerCase();
      const bLabel = wo ? b.term.toLowerCase() : b.term.toLowerCase();
      return aLabel.localeCompare(bLabel, wo ? 'wo' : 'fr');
    });
  }, [activeTheme, query, wo]);

  const highlightedThemeLabel =
    activeTheme === 'all'
      ? wo
        ? 'Lépp'
        : 'Tous'
      : wo
        ? GLOSSARY_CATEGORIES[activeTheme].wo
        : GLOSSARY_CATEGORIES[activeTheme].fr;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={20} color={COLORS.deepGreen} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>{wo ? 'Glossaire SSR' : 'Glossaire SSR'}</Text>
            <Text style={styles.subtitle}>
              {wo
                ? 'Xam-xam ci waxi santé sexuelle ak reproductive'
                : 'Tous les termes utiles de santé sexuelle et reproductive'}
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Feather name="book-open" size={13} color="rgba(255,255,255,0.82)" />
            <Text style={styles.heroBadgeText}>{wo ? 'Waxi-kàddu' : 'Glossaire'}</Text>
          </View>
          <Text style={styles.heroTitle}>
            {wo ? 'Xam sa baat yi ngir gëna dégg sa yaram' : 'Comprendre les mots pour mieux comprendre ton corps'}
          </Text>
          <Text style={styles.heroDescription}>
            {wo
              ? 'Seet, filtre te déggat ay baat yu am solo ci santé sexuelle ak reproductive.'
              : 'Retrouve les termes essentiels, filtrés par thème, dans un langage plus clair et plus accessible.'}
          </Text>
        </View>

        <View style={styles.searchBox}>
          <Feather name="search" size={16} color="rgba(74,47,39,0.6)" />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={wo ? 'Seet term wala définition...' : 'Rechercher un terme ou une définition...'}
            placeholderTextColor="rgba(74,47,39,0.45)"
          />
          {oralMode ? <Feather name="volume-2" size={16} color={COLORS.copper} /> : null}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {wo ? `${glossaryItems.length} waxi-kàddu` : `${glossaryItems.length} termes`}
          </Text>
          <Text style={styles.summaryText}>
            {wo
              ? `Theme bi ngay xool: ${highlightedThemeLabel}`
              : `Thème affiché : ${highlightedThemeLabel}`}
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
              <Feather name="search" size={24} color="rgba(74,47,39,0.3)" />
              <Text style={styles.emptyTitle}>{wo ? 'Amul dara ci seet bi' : 'Aucun terme trouvé'}</Text>
              <Text style={styles.emptyText}>
                {wo
                  ? 'Jéemaat ak beneen wax walla soppi theme bi.'
                  : 'Essaie un autre mot-clé ou change de thème.'}
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
                  <Text style={styles.cardTerm}>{term}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {wo ? GLOSSARY_CATEGORIES[entry.category].wo : GLOSSARY_CATEGORIES[entry.category].fr}
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
  content: { padding: 22, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  headerText: { flex: 1 },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
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
    marginBottom: 16,
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
    maxWidth: 760,
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
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 14,
  },
  searchInput: { flex: 1, color: COLORS.cocoa, fontSize: 14, padding: 0 },
  summaryCard: {
    backgroundColor: 'rgba(181,98,42,0.08)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.16)',
    marginBottom: 18,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: COLORS.deepGreen, marginBottom: 4 },
  summaryText: { fontSize: 12, color: 'rgba(74,47,39,0.72)' },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: 'rgba(74,47,39,0.58)',
    marginBottom: 8,
  },
  themesRow: { gap: 8, paddingBottom: 6, marginBottom: 14 },
  themeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.3)',
    backgroundColor: COLORS.chipBg,
  },
  themeChipActive: {
    backgroundColor: COLORS.copper,
    borderColor: COLORS.copper,
  },
  themeChipText: { fontSize: 12, color: COLORS.copper, fontWeight: '600' },
  themeChipTextActive: { color: COLORS.white },
  list: { gap: 10 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  cardTerm: { flex: 1, fontSize: 18, fontWeight: '700', color: COLORS.deepGreen },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(26,60,52,0.08)',
  },
  badgeText: { fontSize: 11, color: COLORS.deepGreen, fontWeight: '600' },
  cardDefinition: { fontSize: 14, lineHeight: 21, color: 'rgba(74,47,39,0.82)' },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  emptyTitle: { marginTop: 8, fontSize: 14, fontWeight: '700', color: COLORS.deepGreen },
  emptyText: { marginTop: 6, fontSize: 12, color: 'rgba(74,47,39,0.55)', textAlign: 'center' },
});
