import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { SaxalHeroCard, SaxalPage, SaxalPageHeading } from '../../components/ui/SaxalPage';
import { colors } from '../../constants/colors';
import { Fonts } from '../../constants/theme';
import {
  PROVIDERS_EXTRA,
  PROVIDER_REGIONS,
  PROVIDER_SPECIALTIES,
  type ProviderExtra,
  type ProviderSpecialty,
} from '../../data/providersExtra';

type RegionFilter = 'Toutes' | string;
type SpecFilter = 'Toutes' | ProviderSpecialty;

export default function AnnuaireScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 1100;

  const [region, setRegion] = React.useState<RegionFilter>('Toutes');
  const [spec, setSpec] = React.useState<SpecFilter>('Toutes');
  const [womanOnly, setWomanOnly] = React.useState(false);

  const providers = React.useMemo<ProviderExtra[]>(() => {
    return PROVIDERS_EXTRA.filter((provider) => {
      if (region !== 'Toutes' && provider.region !== region) return false;
      if (spec !== 'Toutes' && provider.specialty !== spec) return false;
      if (womanOnly && !provider.womanProvider) return false;
      return true;
    });
  }, [region, spec, womanOnly]);

  const regionOptions: RegionFilter[] = ['Toutes', ...PROVIDER_REGIONS];
  const specOptions: SpecFilter[] = ['Toutes', ...PROVIDER_SPECIALTIES];

  return (
    <SaxalPage contentContainerStyle={styles.pageContent}>
      <SaxalPageHeading
        eyebrow="Annuaire"
        title="Trouver une professionnelle de confiance"
        subtitle="Une presentation plus calme, plus editoriale et plus rassurante, inspiree directement du ton du site."
        onBack={() => router.back()}
        rightSlot={
          <View style={styles.headerActions}>
            <View style={styles.infoPill}>
              <Text style={styles.infoPillText}>Senegal</Text>
            </View>
            <View style={[styles.infoPill, womanOnly && styles.infoPillAccent]}>
              <Text style={[styles.infoPillText, womanOnly && styles.infoPillTextAccent]}>
                {womanOnly ? 'Accueil femme' : 'Ouvert'}
              </Text>
            </View>
          </View>
        }
      />

      <SaxalHeroCard
        badge="Orientation locale"
        title="Un annuaire qui inspire la discretion et la confiance"
        description="Le site pose une relation plus douce avec l’utilisatrice. Ici, on reprend ce langage visuel avec des filtres plus sereins, des cartes plus lisibles et une hierarchie qui met d’abord la confiance avant la technique."
        footer={
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaPill}>
              <Text style={styles.heroMetaLabel}>Regions</Text>
              <Text style={styles.heroMetaText}>{PROVIDER_REGIONS.length} zones</Text>
            </View>
            <View style={styles.heroMetaPill}>
              <Text style={styles.heroMetaLabel}>Specialites</Text>
              <Text style={styles.heroMetaText}>{PROVIDER_SPECIALTIES.length} parcours</Text>
            </View>
          </View>
        }
      />

      <View style={styles.filterPanel}>
        <View style={styles.filterPanelHeader}>
          <View style={styles.filterPanelLead}>
            <Text style={styles.filterEyebrow}>Affiner</Text>
            <Text style={styles.filterTitle}>Choisir un cadre de recherche</Text>
          </View>

          <View style={styles.countPill}>
            <Text style={styles.countPillText}>
              {providers.length} resultat{providers.length > 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Region</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {regionOptions.map((option) => {
              const active = region === option;

              return (
                <Pressable
                  key={option}
                  onPress={() => setRegion(option)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Specialite</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {specOptions.map((option) => {
              const active = spec === option;

              return (
                <Pressable
                  key={option}
                  onPress={() => setSpec(option)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <Pressable
          onPress={() => setWomanOnly((value) => !value)}
          style={[styles.preferenceRow, womanOnly && styles.preferenceRowActive]}
        >
          <View style={styles.preferenceLeft}>
            <Feather
              name={womanOnly ? 'check-circle' : 'circle'}
              size={16}
              color={womanOnly ? colors.white : colors.deepGreen}
            />
            <Text style={[styles.preferenceText, womanOnly && styles.preferenceTextActive]}>
              Accueil par une professionnelle femme
            </Text>
          </View>
          <Text style={[styles.preferenceHint, womanOnly && styles.preferenceHintActive]}>
            {womanOnly ? 'Filtre actif' : 'Optionnel'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.sectionLead}>
        <Text style={styles.sectionEyebrow}>Resultats</Text>
        <Text style={styles.sectionTitle}>Des fiches plus calmes, plus lisibles</Text>
      </View>

      <View style={[styles.providerGrid, isWide && styles.providerGridWide]}>
        {providers.map((provider) => (
          <View key={provider.id} style={[styles.providerCard, isWide && styles.providerCardWide]}>
            <View style={styles.cardTopRow}>
              <View style={styles.cardTitleBlock}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerMeta}>
                  {provider.specialty} · {provider.city}, {provider.region}
                </Text>
              </View>

              <View
                style={[
                  styles.verificationPill,
                  provider.verified ? styles.verificationPillReady : styles.verificationPillReview,
                ]}
              >
                <Feather
                  name={provider.verified ? 'check' : 'clock'}
                  size={11}
                  color={provider.verified ? colors.deepGreen : colors.terracotta}
                />
                <Text
                  style={[
                    styles.verificationText,
                    provider.verified
                      ? styles.verificationTextReady
                      : styles.verificationTextReview,
                  ]}
                >
                  {provider.verified ? 'Verifie' : 'A verifier'}
                </Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              {provider.womanProvider ? (
                <View style={styles.badgeTag}>
                  <Text style={styles.badgeTagText}>Femme</Text>
                </View>
              ) : null}

              {provider.vbg ? (
                <View style={[styles.badgeTag, styles.badgeTagWarm]}>
                  <Text style={styles.badgeTagText}>Soutien VBG</Text>
                </View>
              ) : null}

              <View style={styles.badgeTag}>
                <Text style={styles.badgeTagText}>{provider.languages.join(' · ')}</Text>
              </View>
            </View>

            <Text style={styles.orientationText}>{provider.orientationNotes}</Text>

            <View style={styles.contactRow}>
              <View style={styles.contactPill}>
                <Feather name="phone" size={13} color={colors.copper} />
                <Text style={styles.contactText}>{provider.contact}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {providers.length === 0 ? (
        <View style={styles.emptyCard}>
          <Feather name="search" size={20} color={colors.terracotta} />
          <Text style={styles.emptyTitle}>Aucune fiche pour ces filtres</Text>
          <Text style={styles.emptyText}>
            Essaie une region plus large, une specialite differente ou retire le filtre
            d&apos;accueil femme.
          </Text>
        </View>
      ) : null}

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>Note de confiance</Text>
        <Text style={styles.footerText}>
          SaxalWer oriente et ne pose aucun diagnostic. En cas d&apos;urgence: SAMU 1515,
          Pompiers 18, Police 17.
        </Text>
      </View>
    </SaxalPage>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    gap: 24,
  },
  headerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoPill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.14)',
  },
  infoPillAccent: {
    backgroundColor: 'rgba(166,93,64,0.08)',
    borderColor: 'rgba(166,93,64,0.18)',
  },
  infoPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: colors.deepGreen,
    textTransform: 'uppercase',
  },
  infoPillTextAccent: {
    color: colors.terracotta,
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  heroMetaPill: {
    minWidth: 150,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 3,
  },
  heroMetaLabel: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  heroMetaText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600',
  },
  filterPanel: {
    borderRadius: 28,
    backgroundColor: '#FFFBF6',
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.12)',
    padding: 18,
    gap: 18,
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  filterPanelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterPanelLead: {
    gap: 5,
  },
  filterEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: colors.terracotta,
  },
  filterTitle: {
    color: colors.deepGreen,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '600',
    fontFamily: Fonts.serif,
  },
  countPill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(26,60,52,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.08)',
  },
  countPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.deepGreen,
  },
  filterGroup: {
    gap: 10,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: colors.deepGreen,
    textTransform: 'uppercase',
  },
  chipsRow: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.08)',
  },
  chipActive: {
    backgroundColor: colors.deepGreen,
    borderColor: colors.deepGreen,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.cocoa,
  },
  chipTextActive: {
    color: colors.white,
  },
  preferenceRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  preferenceRowActive: {
    backgroundColor: colors.terracotta,
    borderColor: colors.terracotta,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  preferenceText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.deepGreen,
  },
  preferenceTextActive: {
    color: colors.white,
  },
  preferenceHint: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: colors.terracotta,
    textTransform: 'uppercase',
  },
  preferenceHintActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  sectionLead: {
    gap: 5,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: colors.terracotta,
  },
  sectionTitle: {
    color: colors.deepGreen,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '600',
    fontFamily: Fonts.serif,
  },
  providerGrid: {
    gap: 16,
  },
  providerGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  providerCard: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: '#FFFBF6',
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.12)',
    padding: 18,
    gap: 14,
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  providerCardWide: {
    width: '48.9%',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitleBlock: {
    flex: 1,
    gap: 5,
  },
  providerName: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.deepGreen,
    fontFamily: Fonts.serif,
  },
  providerMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.terracotta,
  },
  verificationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  verificationPillReady: {
    backgroundColor: 'rgba(26,60,52,0.07)',
    borderColor: 'rgba(26,60,52,0.08)',
  },
  verificationPillReview: {
    backgroundColor: 'rgba(166,93,64,0.08)',
    borderColor: 'rgba(166,93,64,0.12)',
  },
  verificationText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  verificationTextReady: {
    color: colors.deepGreen,
  },
  verificationTextReview: {
    color: colors.terracotta,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(26,60,52,0.07)',
  },
  badgeTagWarm: {
    backgroundColor: 'rgba(166,93,64,0.08)',
  },
  badgeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.deepGreen,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  orientationText: {
    fontSize: 14,
    lineHeight: 23,
    color: 'rgba(74,47,39,0.76)',
  },
  contactRow: {
    marginTop: 2,
  },
  contactPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#FFF4E9',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.14)',
  },
  contactText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.copper,
  },
  emptyCard: {
    borderRadius: 24,
    backgroundColor: '#FFF8EF',
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.12)',
    paddingHorizontal: 18,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.deepGreen,
    fontFamily: Fonts.serif,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(74,47,39,0.74)',
    textAlign: 'center',
    maxWidth: 520,
  },
  footerCard: {
    borderRadius: 24,
    backgroundColor: '#FFF8EF',
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.12)',
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 6,
  },
  footerTitle: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: colors.terracotta,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(74,47,39,0.74)',
  },
});
