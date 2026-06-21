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
  AUDIO_CONTENTS,
  AUDIO_TYPE_LABEL,
  type AudioContent,
} from '../../data/audioContent';

const COLORS = {
  beige: '#F5F1E6',
  card: '#FFF9F1',
  white: '#FFFFFF',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  border: '#E8DCCB',
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m} min` : `${m} min ${s}s`;
}

export default function AudioScreen() {
  const router = useRouter();
  const { language, experienceMode } = useApp();
  const wo = language === 'wo';
  const guided = experienceMode === 'guide';

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
            <Text style={styles.eyebrow}>Audio éducatif</Text>
            <Text style={styles.title}>Écouter</Text>
            {!guided ? (
              <Text style={styles.subtitle}>
                Des contenus courts en français et en wolof. Les pistes arrivent
                progressivement.
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.list}>
          {AUDIO_CONTENTS.map((audio: AudioContent) => {
            const available = audio.status === 'disponible';
            return (
              <View key={audio.id} style={[styles.audioCard, guided && styles.audioCardGuided]}>
                <Pressable
                  disabled={!available}
                  style={[styles.playBtn, guided && styles.playBtnGuided, !available && styles.playBtnDisabled]}
                  accessibilityRole="button"
                  accessibilityLabel={available ? `Lire ${audio.title}` : `${audio.title} — bientôt disponible`}
                >
                  <Feather
                    name={available ? 'play' : 'clock'}
                    size={guided ? 26 : 20}
                    color={available ? COLORS.white : COLORS.copper}
                  />
                </Pressable>

                <View style={styles.audioBody}>
                  <View style={styles.tagRow}>
                    <View style={styles.typeTag}>
                      <Text style={styles.typeTagText}>{AUDIO_TYPE_LABEL[audio.type]}</Text>
                    </View>
                    <Text style={styles.lang}>{audio.language === 'wo' ? 'Wolof' : 'Français'}</Text>
                    <Text style={styles.duration}>· {formatDuration(audio.durationTarget)}</Text>
                  </View>

                  <Text style={[styles.audioTitle, guided && styles.audioTitleGuided]}>
                    {wo && audio.titleWo ? audio.titleWo : audio.title}
                  </Text>

                  {!guided ? <Text style={styles.audioDesc}>{audio.description}</Text> : null}

                  <View style={styles.statusRow}>
                    <View style={[styles.statusDot, available ? styles.dotOk : styles.dotSoon]} />
                    <Text style={styles.statusText}>
                      {available ? 'Disponible' : 'Disponible bientôt'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.footerNote}>
          SaxalWér informe et oriente. En cas de doute ou de symptôme inquiétant,
          consulte une professionnelle de santé.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.beige },
  content: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 40, gap: 16 },
  header: { gap: 16 },
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
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700', color: COLORS.deepGreen },
  subtitle: { fontSize: 14, lineHeight: 22, color: COLORS.cocoa },
  list: { gap: 12 },
  audioCard: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  audioCardGuided: { padding: 20 },
  playBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnGuided: { width: 60, height: 60, borderRadius: 30 },
  playBtnDisabled: { backgroundColor: '#F0E4D4' },
  audioBody: { flex: 1, gap: 6 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  typeTag: {
    backgroundColor: 'rgba(26,60,52,0.08)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  typeTagText: { fontSize: 10, fontWeight: '700', color: COLORS.deepGreen },
  lang: { fontSize: 11, fontWeight: '600', color: COLORS.terracotta },
  duration: { fontSize: 11, color: COLORS.cocoa },
  audioTitle: { fontSize: 16, fontWeight: '700', color: COLORS.deepGreen, lineHeight: 21 },
  audioTitleGuided: { fontSize: 18, lineHeight: 24 },
  audioDesc: { fontSize: 13, lineHeight: 19, color: COLORS.cocoa },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  dotOk: { backgroundColor: '#3F8F5B' },
  dotSoon: { backgroundColor: COLORS.copper },
  statusText: { fontSize: 11, fontWeight: '600', color: COLORS.terracotta },
  footerNote: { fontSize: 11, lineHeight: 16, color: COLORS.terracotta, fontStyle: 'italic' },
  pressed: { opacity: 0.85 },
});
