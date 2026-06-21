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
import { computeDigitalAutonomy } from '../../lib/scoring/digitalAutonomy';
import { computeSocioCultural } from '../../lib/scoring/socioCultural';

const COLORS = {
  beige: '#F5F1E6',
  card: '#FFF9F1',
  white: '#FFFFFF',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  border: '#E8DCCB',
  track: '#E7DBC9',
};

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(4, value)}%`, backgroundColor: color }]} />
    </View>
  );
}

export default function ProfilNumeriqueScreen() {
  const router = useRouter();
  const { personalization, language, hasCompletedTutorial, experienceMode, setExperienceMode } =
    useApp();

  const autonomy = computeDigitalAutonomy({
    educationLevel: personalization?.educationLevel,
    audioPreference: personalization?.audioPreference,
    language,
    privacyLevel: personalization?.privacyLevel,
    completedTutorial: hasCompletedTutorial,
  });

  const socio = computeSocioCultural({
    socialNorms: personalization?.socialNorms,
    livingContext: personalization?.livingContext,
    privacyLevel: personalization?.privacyLevel,
    preferredTone: personalization?.preferredTone,
    needsSupport: personalization?.needsSupport,
  });

  const modeMatches = experienceMode === autonomy.recommendedMode;

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
            <Text style={styles.eyebrow}>Mon profil</Text>
            <Text style={styles.title}>Autonomie & contexte</Text>
            <Text style={styles.subtitle}>
              Ces repères servent uniquement à adapter ton expérience. Ils sont calculés sur ton
              appareil et ne sont jamais transmis.
            </Text>
          </View>
        </View>

        {/* Autonomie numérique */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Feather name="smartphone" size={16} color={COLORS.deepGreen} />
            <Text style={styles.cardTitle}>Autonomie numérique</Text>
            <Text style={styles.scoreNum}>{autonomy.score}/100</Text>
          </View>
          <ScoreBar value={autonomy.score} color={COLORS.deepGreen} />
          <Text style={styles.levelText}>
            Niveau : {autonomy.level === 'autonome' ? 'Autonome' : autonomy.level === 'intermediaire' ? 'Intermédiaire' : 'Accompagnée'}
          </Text>
          <Text style={styles.explanation}>{autonomy.explanation}</Text>

          {!modeMatches ? (
            <Pressable
              onPress={() => setExperienceMode(autonomy.recommendedMode)}
              style={({ pressed }) => [styles.applyBtn, pressed && styles.pressed]}
            >
              <Feather name="check-circle" size={14} color={COLORS.white} />
              <Text style={styles.applyText}>
                Activer le mode {autonomy.recommendedMode === 'guide' ? 'guidé' : 'complet'} conseillé
              </Text>
            </Pressable>
          ) : (
            <View style={styles.okRow}>
              <Feather name="check" size={13} color={COLORS.deepGreen} />
              <Text style={styles.okText}>
                Mode {experienceMode === 'guide' ? 'guidé' : 'complet'} actif (cohérent)
              </Text>
            </View>
          )}
        </View>

        {/* Sensibilité socio-culturelle */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Feather name="users" size={16} color={COLORS.terracotta} />
            <Text style={styles.cardTitle}>Sensibilité socio-culturelle</Text>
            <Text style={[styles.scoreNum, { color: COLORS.terracotta }]}>
              {socio.sensitivityScore}/100
            </Text>
          </View>
          <ScoreBar value={socio.sensitivityScore} color={COLORS.terracotta} />
          <Text style={styles.explanation}>{socio.explanation}</Text>

          <View style={styles.chipsRow}>
            {socio.recommendDiscreet ? (
              <View style={styles.chip}>
                <Feather name="eye-off" size={11} color={COLORS.cocoa} />
                <Text style={styles.chipText}>Mode discret conseillé</Text>
              </View>
            ) : null}
            {socio.recommendNeutralTitles ? (
              <View style={styles.chip}>
                <Feather name="type" size={11} color={COLORS.cocoa} />
                <Text style={styles.chipText}>Titres neutres</Text>
              </View>
            ) : null}
          </View>
        </View>

        <Text style={styles.footerNote}>
          SaxalWér n&apos;établit aucun diagnostic. Ces réglages restent modifiables dans les
          préférences.
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
  title: { fontSize: 27, lineHeight: 33, fontWeight: '700', color: COLORS.deepGreen },
  subtitle: { fontSize: 13, lineHeight: 20, color: COLORS.cocoa },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.deepGreen },
  scoreNum: { fontSize: 14, fontWeight: '800', color: COLORS.deepGreen },
  track: { height: 10, borderRadius: 999, backgroundColor: COLORS.track, overflow: 'hidden' },
  fill: { height: 10, borderRadius: 999 },
  levelText: { fontSize: 13, fontWeight: '700', color: COLORS.cocoa },
  explanation: { fontSize: 13, lineHeight: 19, color: COLORS.cocoa },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.deepGreen,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    marginTop: 2,
  },
  applyText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  okRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  okText: { fontSize: 12, fontWeight: '600', color: COLORS.deepGreen },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(26,60,52,0.07)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  chipText: { fontSize: 11, fontWeight: '700', color: COLORS.cocoa },
  footerNote: { fontSize: 11, lineHeight: 16, color: COLORS.terracotta, fontStyle: 'italic' },
  pressed: { opacity: 0.85 },
});
