import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { SaxalHeroCard, SaxalPage, SaxalPageHeading } from '../../components/ui/SaxalPage';
import { colors } from '../../constants/colors';
import { Fonts } from '../../constants/theme';
import { useApp } from '../../context/appcontext';
import {
  AUDIO_CONTENTS,
  AUDIO_TYPE_LABEL,
  type AudioContent,
} from '../../data/audioContent';

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds === 0 ? `${minutes} min` : `${minutes} min ${remainingSeconds}s`;
}

export default function AudioScreen() {
  const router = useRouter();
  const { language, experienceMode } = useApp();
  const { width } = useWindowDimensions();
  const wo = language === 'wo';
  const guided = experienceMode === 'guide';
  const isWide = width >= 1080;

  return (
    <SaxalPage contentContainerStyle={styles.pageContent}>
      <SaxalPageHeading
        eyebrow={wo ? 'Audio' : 'Audio educatif'}
        title={wo ? 'Deglu, ci sa yoon' : 'Ecouter, a votre rythme'}
        subtitle={
          wo
            ? 'Ay xibaar yu gatt, ci wolof ak en français, ngir jangal ak yokk xel mu dal.'
            : 'Des pistes courtes, calmes et utiles pour avancer sans pression, dans la langue qui te parle.'
        }
        onBack={() => router.back()}
        rightSlot={
          <View style={styles.headerActions}>
            <View style={styles.infoPill}>
              <Text style={styles.infoPillText}>{wo ? 'Wolof' : 'Francais'}</Text>
            </View>
            <View style={[styles.infoPill, guided && styles.infoPillAccent]}>
              <Text style={[styles.infoPillText, guided && styles.infoPillTextAccent]}>
                {guided ? 'Mode guide' : 'Mode libre'}
              </Text>
            </View>
          </View>
        }
      />

      <SaxalHeroCard
        badge={wo ? 'Bibliotheque audio' : 'Bibliotheque audio'}
        title={wo ? 'Degglu tey, ci xel mu dal' : 'Des voix claires pour apprendre sans gene'}
        description={
          wo
            ? 'Lu gatt, leer te sutura. SaxalWer may na la nit ñi jàng ci doxalin bu xam ne yaram ak xel dañu wara am jamm.'
            : 'Le site pose une voix douce et digne. On reprend ici ce meme ton: des contenus simples, rassurants et culturellement ancrés pour apprendre en confiance.'
        }
        footer={
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaPill}>
              <Text style={styles.heroMetaLabel}>Catalogue</Text>
              <Text style={styles.heroMetaText}>{AUDIO_CONTENTS.length} pistes</Text>
            </View>
            <View style={styles.heroMetaPill}>
              <Text style={styles.heroMetaLabel}>Langues</Text>
              <Text style={styles.heroMetaText}>Francais · Wolof</Text>
            </View>
          </View>
        }
      />

      <View style={styles.sectionHeader}>
        <View style={styles.sectionLead}>
          <Text style={styles.sectionEyebrow}>{wo ? 'Choix' : 'Selection'}</Text>
          <Text style={styles.sectionTitle}>
            {wo ? 'Tannal li nga bëgg déglu' : 'Choisir une ecoute'}
          </Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countPillText}>
            {AUDIO_CONTENTS.filter((item) => item.status === 'disponible').length} disponibles
          </Text>
        </View>
      </View>

      <View style={[styles.audioGrid, isWide && styles.audioGridWide]}>
        {AUDIO_CONTENTS.map((audio: AudioContent) => {
          const available = audio.status === 'disponible';

          return (
            <View
              key={audio.id}
              style={[styles.audioCard, isWide && styles.audioCardWide, guided && styles.audioCardGuided]}
            >
              <View style={styles.audioTopRow}>
                <View style={styles.tagRow}>
                  <View style={styles.typeTag}>
                    <Text style={styles.typeTagText}>{AUDIO_TYPE_LABEL[audio.type]}</Text>
                  </View>
                  <Text style={styles.metaText}>{audio.language === 'wo' ? 'Wolof' : 'Francais'}</Text>
                  <Text style={styles.metaText}>· {formatDuration(audio.durationTarget)}</Text>
                </View>

                <View style={[styles.statusPill, available ? styles.statusPillReady : styles.statusPillSoon]}>
                  <Text
                    style={[
                      styles.statusPillText,
                      available ? styles.statusPillTextReady : styles.statusPillTextSoon,
                    ]}
                  >
                    {available ? 'Disponible' : 'Bientot'}
                  </Text>
                </View>
              </View>

              <View style={styles.audioBody}>
                <Pressable
                  disabled={!available}
                  style={[
                    styles.playButton,
                    guided && styles.playButtonGuided,
                    !available && styles.playButtonDisabled,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={
                    available ? `Lire ${audio.title}` : `${audio.title} bientot disponible`
                  }
                >
                  <Feather
                    name={available ? 'play' : 'clock'}
                    size={guided ? 24 : 20}
                    color={available ? colors.white : colors.copper}
                  />
                </Pressable>

                <View style={styles.audioCopy}>
                  <Text style={[styles.audioTitle, guided && styles.audioTitleGuided]}>
                    {wo && audio.titleWo ? audio.titleWo : audio.title}
                  </Text>

                  <Text style={styles.audioDesc}>{audio.description}</Text>

                  <View style={styles.listenRow}>
                    <Feather name="headphones" size={14} color={colors.deepGreen} />
                    <Text style={styles.listenRowText}>
                      {available
                        ? guided
                          ? 'Pret pour une ecoute guidee'
                          : 'Pret a etre ecoute'
                        : 'Publication en cours'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>Rappel important</Text>
        <Text style={styles.footerText}>
          SaxalWer informe et oriente. Si un symptome t&apos;inquiete ou si la douleur s&apos;aggrave,
          une professionnelle de sante reste la meilleure personne a consulter.
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
    borderColor: 'rgba(166,93,64,0.2)',
  },
  infoPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
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
  audioGrid: {
    gap: 16,
  },
  audioGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  audioCard: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: '#FFFBF6',
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.12)',
    padding: 18,
    gap: 16,
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  audioCardWide: {
    width: '48.9%',
  },
  audioCardGuided: {
    padding: 22,
  },
  audioTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'flex-start',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(26,60,52,0.07)',
  },
  typeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.deepGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.terracotta,
  },
  statusPill: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPillReady: {
    backgroundColor: 'rgba(26,60,52,0.07)',
    borderColor: 'rgba(26,60,52,0.08)',
  },
  statusPillSoon: {
    backgroundColor: 'rgba(166,93,64,0.08)',
    borderColor: 'rgba(166,93,64,0.12)',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  statusPillTextReady: {
    color: colors.deepGreen,
  },
  statusPillTextSoon: {
    color: colors.terracotta,
  },
  audioBody: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  playButtonGuided: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  playButtonDisabled: {
    backgroundColor: '#F2E5D7',
    shadowOpacity: 0,
    elevation: 0,
  },
  audioCopy: {
    flex: 1,
    gap: 10,
  },
  audioTitle: {
    color: colors.deepGreen,
    fontSize: 23,
    lineHeight: 27,
    fontWeight: '600',
    fontFamily: Fonts.serif,
  },
  audioTitleGuided: {
    fontSize: 26,
    lineHeight: 30,
  },
  audioDesc: {
    fontSize: 14,
    lineHeight: 23,
    color: 'rgba(74,47,39,0.76)',
  },
  listenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  listenRowText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.deepGreen,
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
