import { Feather } from '@expo/vector-icons';
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

import { useApp } from '../../context/appcontext';
import {
    PROVIDERS_EXTRA,
    PROVIDER_REGIONS,
    PROVIDER_SPECIALTIES,
    type ProviderExtra,
    type ProviderSpecialty,
} from '../../data/providersExtra';

const COLORS = {
  beige: '#F5F1E6',
  card: '#FFF9F1',
  white: '#FFFFFF',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  border: '#E8DCCB',
  amber: '#9A6B12',
  amberBg: '#FBF1DA',
  greenBg: '#E4EFE7',
};

type RegionFilter = 'Toutes' | string;
type SpecFilter = 'Toutes' | ProviderSpecialty;

export default function AnnuaireScreen() {
  const router = useRouter();
  const { language: _language } = useApp();

  const [region, setRegion] = React.useState<RegionFilter>('Toutes');
  const [spec, setSpec] = React.useState<SpecFilter>('Toutes');
  const [womanOnly, setWomanOnly] = React.useState(false);

  const list = React.useMemo<ProviderExtra[]>(() => {
    return PROVIDERS_EXTRA.filter((p) => {
      if (region !== 'Toutes' && p.region !== region) return false;
      if (spec !== 'Toutes' && p.specialty !== spec) return false;
      if (womanOnly && !p.womanProvider) return false;
      return true;
    });
  }, [region, spec, womanOnly]);

  const regionOptions: RegionFilter[] = ['Toutes', ...PROVIDER_REGIONS];
  const specOptions: SpecFilter[] = ['Toutes', ...PROVIDER_SPECIALTIES];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <Feather name="arrow-left" size={18} color={COLORS.deepGreen} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Annuaire — Sénégal</Text>
            <Text style={styles.title}>Trouver une professionnelle</Text>
            <Text style={styles.subtitle}>
              Psychologue, soutien VBG, gynécologie. Les fiches « À vérifier » ne sont pas
              encore confirmées : aucune coordonnée n&apos;est diffusée sans validation.
            </Text>
          </View>
        </View>

        {/* Filtre région */}
        <Text style={styles.filterLabel}>Région</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {regionOptions.map((r) => (
            <Pressable
              key={r}
              onPress={() => setRegion(r)}
              style={[styles.chip, region === r && styles.chipActive]}
            >
              <Text style={[styles.chipText, region === r && styles.chipTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Filtre spécialité */}
        <Text style={styles.filterLabel}>Spécialité</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {specOptions.map((s) => (
            <Pressable
              key={s}
              onPress={() => setSpec(s)}
              style={[styles.chip, spec === s && styles.chipActive]}
            >
              <Text style={[styles.chipText, spec === s && styles.chipTextActive]}>{s}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Toggle femme */}
        <Pressable
          onPress={() => setWomanOnly((v) => !v)}
          style={[styles.womanToggle, womanOnly && styles.womanToggleActive]}
        >
          <Feather
            name={womanOnly ? 'check-circle' : 'circle'}
            size={16}
            color={womanOnly ? COLORS.white : COLORS.deepGreen}
          />
          <Text style={[styles.womanToggleText, womanOnly && styles.womanToggleTextActive]}>
            Accueil par une professionnelle femme
          </Text>
        </Pressable>

        <Text style={styles.count}>{list.length} résultat{list.length > 1 ? 's' : ''}</Text>

        {/* Liste */}
        <View style={styles.list}>
          {list.map((p) => (
            <View key={p.id} style={styles.providerCard}>
              <View style={styles.cardTop}>
                <Text style={styles.providerName}>{p.name}</Text>
                <View style={[styles.badge, p.verified ? styles.badgeOk : styles.badgeWarn]}>
                  <Feather
                    name={p.verified ? 'check' : 'clock'}
                    size={11}
                    color={p.verified ? COLORS.deepGreen : COLORS.amber}
                  />
                  <Text style={[styles.badgeText, p.verified ? styles.badgeTextOk : styles.badgeTextWarn]}>
                    {p.verified ? 'Vérifié' : 'À vérifier'}
                  </Text>
                </View>
              </View>

              <Text style={styles.providerMeta}>
                {p.specialty} · {p.city}, {p.region}
              </Text>

              <View style={styles.tagRow}>
                {p.womanProvider ? (
                  <View style={styles.miniTag}>
                    <Text style={styles.miniTagText}>Femme</Text>
                  </View>
                ) : null}
                {p.vbg ? (
                  <View style={[styles.miniTag, styles.miniTagVbg]}>
                    <Text style={styles.miniTagText}>Soutien VBG</Text>
                  </View>
                ) : null}
                <View style={styles.miniTag}>
                  <Text style={styles.miniTagText}>{p.languages.join(' · ')}</Text>
                </View>
              </View>

              <Text style={styles.orientation}>{p.orientationNotes}</Text>

              <View style={styles.contactRow}>
                <Feather name="phone" size={13} color={COLORS.copper} />
                <Text style={styles.contactText}>{p.contact}</Text>
              </View>
            </View>
          ))}

          {list.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="search" size={20} color={COLORS.terracotta} />
              <Text style={styles.emptyText}>Aucune fiche pour ces filtres.</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.footerNote}>
          SaxalWér oriente et n&apos;établit aucun diagnostic. En cas d&apos;urgence : SAMU 1515 ·
          Pompiers 18 · Police 17.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.beige },
  content: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 40, gap: 12 },
  header: { gap: 16, marginBottom: 4 },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerText: { gap: 8 },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLORS.terracotta,
  },
  title: { fontSize: 26, lineHeight: 32, fontWeight: '700', color: COLORS.deepGreen },
  subtitle: { fontSize: 13, lineHeight: 20, color: COLORS.cocoa },

  filterLabel: { fontSize: 13, fontWeight: '700', color: COLORS.deepGreen, marginTop: 4 },
  chipsRow: { gap: 8, paddingVertical: 2, paddingRight: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.deepGreen, borderColor: COLORS.deepGreen },
  chipText: { fontSize: 12, fontWeight: '600', color: COLORS.cocoa },
  chipTextActive: { color: COLORS.white },

  womanToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
  },
  womanToggleActive: { backgroundColor: COLORS.terracotta, borderColor: COLORS.terracotta },
  womanToggleText: { fontSize: 12, fontWeight: '600', color: COLORS.deepGreen },
  womanToggleTextActive: { color: COLORS.white },

  count: { fontSize: 12, color: COLORS.terracotta, fontWeight: '600', marginTop: 4 },

  list: { gap: 12 },
  providerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  providerName: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.deepGreen, lineHeight: 20 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  badgeOk: { backgroundColor: COLORS.greenBg },
  badgeWarn: { backgroundColor: COLORS.amberBg },
  badgeText: { fontSize: 10, fontWeight: '700' },
  badgeTextOk: { color: COLORS.deepGreen },
  badgeTextWarn: { color: COLORS.amber },
  providerMeta: { fontSize: 12, color: COLORS.terracotta, fontWeight: '600' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  miniTag: { backgroundColor: 'rgba(26,60,52,0.07)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  miniTagVbg: { backgroundColor: '#F3E2DC' },
  miniTagText: { fontSize: 10, fontWeight: '700', color: COLORS.cocoa },
  orientation: { fontSize: 13, lineHeight: 19, color: COLORS.cocoa },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  contactText: { fontSize: 12, color: COLORS.copper, fontWeight: '600' },

  empty: { alignItems: 'center', gap: 8, paddingVertical: 28 },
  emptyText: { fontSize: 13, color: COLORS.terracotta },
  footerNote: { fontSize: 11, lineHeight: 16, color: COLORS.terracotta, fontStyle: 'italic', marginTop: 8 },
  pressed: { opacity: 0.85 },
});
