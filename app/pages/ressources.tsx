import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/appcontext';
import { ARTICLES } from '../../data/articles';

const COLORS = {
  bg: '#FDFAF5',
  deepGreen: '#1A3C34',
  copper: '#B5622A',
  cocoa: '#4A2F27',
};

const QUICK_TAGS = ['Contraception', 'Grossesse', 'IST', 'Ménopause', 'Infertilité', 'Post-partum'];

export default function RessourcesPage() {
  const router = useRouter();
  const { language, oralMode } = useApp();
  const wo = language === 'wo';
  const [query, setQuery] = React.useState('');

  const suggested = React.useMemo(() => {
    if (!query.trim()) return ARTICLES.slice(0, 6);
    const q = query.toLowerCase();
    return ARTICLES.filter((a) =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)),
    ).slice(0, 8);
  }, [query]);

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
              {wo ? 'Seetlu ndimbal yi ngay soxla' : 'Trouve rapidement l\'aide qui te correspond'}
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Feather name="compass" size={13} color="rgba(255,255,255,0.82)" />
            <Text style={styles.heroBadgeText}>{wo ? 'Yoon yi' : 'Ressources'}</Text>
          </View>
          <Text style={styles.heroTitle}>
            {wo ? 'Seetal ndimbal yi gëna jëm ci sa soxla' : 'Trouve la bonne ressource au bon moment'}
          </Text>
          <Text style={styles.heroDescription}>
            {wo
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
            placeholder={wo ? 'Seetlu jàngale...' : 'Rechercher des ressources...'}
            placeholderTextColor="rgba(74,47,39,0.45)"
          />
          {oralMode ? <Feather name="volume-2" size={16} color={COLORS.copper} /> : null}
        </View>

        <Text style={styles.sectionLabel}>{wo ? 'Sujets populaires' : 'Sujets populaires'}</Text>
        <View style={styles.tagsWrap}>
          {QUICK_TAGS.map((tag) => (
            <Pressable key={tag} style={styles.tag} onPress={() => onOpenTag(tag)}>
              <Text style={styles.tagText}>{tag}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.glossaryCard} onPress={() => router.push('/glossaire' as any)}>
          <View style={styles.glossaryIconWrap}>
            <Feather name="book-open" size={18} color={COLORS.deepGreen} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.glossaryTitle}>{wo ? 'Glossaire' : 'Glossaire'}</Text>
            <Text style={styles.glossaryText}>
              {wo
                ? 'Seet waxi santé sexuelle ak reproductive te filtre ko ci theme.'
                : 'Retrouve les termes de santé sexuelle et reproductive, avec filtres par thème.'}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="rgba(74,47,39,0.35)" />
        </Pressable>

        <Text style={styles.sectionLabel}>{wo ? 'Suggestions' : 'Suggestions'}</Text>
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
