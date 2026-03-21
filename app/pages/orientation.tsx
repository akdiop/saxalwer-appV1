import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/appcontext';

type SectionId = 'profil' | 'sante' | 'habitudes' | 'relationnel' | 'priorites';

type Question = {
  id: string;
  section: SectionId;
  fr: string;
  wo: string;
  options: { id: string; fr: string; wo: string }[];
};

const COLORS = {
  bg: '#FDFAF5',
  deepGreen: '#1A3C34',
  copper: '#B5622A',
  cocoa: '#4A2F27',
};

const SECTION_ORDER: SectionId[] = ['profil', 'sante', 'habitudes', 'relationnel', 'priorites'];

const QUESTIONS: Question[] = [
  {
    id: 'age-band',
    section: 'profil',
    fr: 'Dans quelle tranche d\'âge te situes-tu ?',
    wo: 'Ci ban tranche d\'âge nga nekk ?',
    options: [
      { id: '15-19', fr: '15-19', wo: '15-19' },
      { id: '20-29', fr: '20-29', wo: '20-29' },
      { id: '30-39', fr: '30-39', wo: '30-39' },
      { id: '40+', fr: '40+', wo: '40+' },
    ],
  },
  {
    id: 'primary-concern',
    section: 'sante',
    fr: 'Quel est ton besoin principal du moment ?',
    wo: 'Lan mooy sa soxla bu njëkk léegi ?',
    options: [
      { id: 'cycle', fr: 'Cycle', wo: 'Cycle' },
      { id: 'fertility', fr: 'Fertilité', wo: 'Fertilité' },
      { id: 'pregnancy', fr: 'Grossesse', wo: 'Gàtt' },
      { id: 'prevention', fr: 'Prévention', wo: 'Jiitu' },
    ],
  },
  {
    id: 'content-format',
    section: 'habitudes',
    fr: 'Quel format préfères-tu ?',
    wo: 'Ban format nga gëna bëgg ?',
    options: [
      { id: 'short', fr: 'Court', wo: 'Gàtt' },
      { id: 'detailed', fr: 'Détaillé', wo: 'Yàgg' },
      { id: 'audio', fr: 'Audio', wo: 'Audio' },
      { id: 'mixed', fr: 'Mixte', wo: 'Mixte' },
    ],
  },
  {
    id: 'support-style',
    section: 'relationnel',
    fr: 'Comment veux-tu être accompagnée ?',
    wo: 'Naka nga bëgg ñu la topp ?',
    options: [
      { id: 'private', fr: 'Très discret', wo: 'Suufe lool' },
      { id: 'normal', fr: 'Standard', wo: 'Standard' },
      { id: 'community', fr: 'Communauté', wo: 'Kominite' },
      { id: 'expert', fr: 'Orientation experte', wo: 'Ndigël xam-xam' },
    ],
  },
  {
    id: 'goal',
    section: 'priorites',
    fr: 'Objectif à 30 jours ?',
    wo: 'Jubluwaay 30 fan ?',
    options: [
      { id: 'learn', fr: 'M\'informer', wo: 'Jàng' },
      { id: 'track', fr: 'Suivre mon cycle', wo: 'Xool cycle' },
      { id: 'consult', fr: 'Trouver un centre', wo: 'Gis centre' },
      { id: 'prevent', fr: 'Mieux prévenir', wo: 'Jiitu baax' },
    ],
  },
];

const SECTION_LABELS: Record<SectionId, { fr: string; wo: string }> = {
  profil: { fr: 'Profil', wo: 'Profil' },
  sante: { fr: 'Santé', wo: 'Wér' },
  habitudes: { fr: 'Habitudes', wo: 'Jëf yi' },
  relationnel: { fr: 'Relationnel', wo: 'Jokkoo' },
  priorites: { fr: 'Priorités', wo: 'Jubluwaay' },
};

export default function OrientationPage() {
  const router = useRouter();
  const { completeOnboarding, language, saveOrientation, setLifeSituation } = useApp();
  const wo = language === 'wo';

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});

  const current = QUESTIONS[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;
  const currentValue = answers[current.id];

  const sectionProgress = React.useMemo(() => {
    const bySection: Record<SectionId, { total: number; done: number }> = {
      profil: { total: 0, done: 0 },
      sante: { total: 0, done: 0 },
      habitudes: { total: 0, done: 0 },
      relationnel: { total: 0, done: 0 },
      priorites: { total: 0, done: 0 },
    };

    QUESTIONS.forEach((q) => {
      bySection[q.section].total += 1;
      if (answers[q.id]) bySection[q.section].done += 1;
    });

    return bySection;
  }, [answers]);

  function choose(optionId: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
  }

  function next() {
    if (!currentValue) return;
    if (isLast) {
      const primaryConcern = answers['primary-concern'];
      if (primaryConcern === 'cycle') setLifeSituation('cycles');
      if (primaryConcern === 'fertility') setLifeSituation('trying');
      if (primaryConcern === 'pregnancy') setLifeSituation('pregnant');
      if (primaryConcern === 'prevention') setLifeSituation('contraception');

      saveOrientation({
        answers,
        currentStep: QUESTIONS.length,
        completedAt: Date.now(),
        level: 'recommended',
      });
      completeOnboarding();
      router.replace('/about' as any);
      return;
    }
    setCurrentIndex((v) => v + 1);
  }

  function back() {
    if (currentIndex === 0) {
      router.back();
      return;
    }
    setCurrentIndex((v) => v - 1);
  }

  const completion = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={back} style={styles.backBtn}>
            <Feather name="chevron-left" size={20} color={COLORS.deepGreen} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{wo ? 'Orientation' : 'Orientation'}</Text>
            <Text style={styles.subtitle}>{wo ? `${completion}% jeex` : `${completion}% complété`}</Text>
          </View>
        </View>

        <View style={styles.progressWrap}>
          <View style={[styles.progressInner, { width: `${completion}%` }]} />
        </View>

        <View style={styles.sectionsRow}>
          {SECTION_ORDER.map((section) => {
            const stats = sectionProgress[section];
            const active = section === current.section;
            const done = stats.done === stats.total && stats.total > 0;
            return (
              <View key={section} style={[styles.sectionBadge, active && styles.sectionBadgeActive, done && styles.sectionBadgeDone]}>
                <Text style={[styles.sectionBadgeText, active && styles.sectionBadgeTextActive]}>
                  {wo ? SECTION_LABELS[section].wo : SECTION_LABELS[section].fr}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.question}>{wo ? current.wo : current.fr}</Text>
          <View style={styles.options}>
            {current.options.map((opt) => {
              const active = currentValue === opt.id;
              return (
                <Pressable key={opt.id} style={[styles.option, active && styles.optionActive]} onPress={() => choose(opt.id)}>
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>{wo ? opt.wo : opt.fr}</Text>
                  {active ? <Feather name="check-circle" size={18} color={COLORS.copper} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable style={[styles.nextBtn, !currentValue && styles.nextBtnDisabled]} onPress={next}>
          <Text style={styles.nextText}>{isLast ? (wo ? 'Jeexal' : 'Terminer') : (wo ? 'Kontine' : 'Continuer')}</Text>
          <Feather name={isLast ? 'check' : 'chevron-right'} size={16} color="white" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 22, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.deepGreen },
  subtitle: { fontSize: 12, color: 'rgba(74,47,39,0.6)', marginTop: 2 },
  progressWrap: {
    height: 8,
    borderRadius: 99,
    backgroundColor: 'rgba(26,60,52,0.12)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressInner: { height: '100%', backgroundColor: COLORS.deepGreen },
  sectionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 },
  sectionBadge: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(26,60,52,0.08)',
  },
  sectionBadgeActive: { backgroundColor: 'rgba(181,98,42,0.15)' },
  sectionBadgeDone: { borderWidth: 1, borderColor: 'rgba(26,60,52,0.35)' },
  sectionBadgeText: { fontSize: 11, color: 'rgba(26,60,52,0.75)' },
  sectionBadgeTextActive: { color: COLORS.copper, fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    marginBottom: 14,
  },
  question: { fontSize: 18, fontWeight: '700', color: COLORS.deepGreen, marginBottom: 12, lineHeight: 25 },
  options: { gap: 9 },
  option: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.12)',
    backgroundColor: 'rgba(26,60,52,0.04)',
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionActive: {
    borderColor: 'rgba(181,98,42,0.55)',
    backgroundColor: 'rgba(181,98,42,0.12)',
  },
  optionText: { fontSize: 14, color: COLORS.deepGreen, fontWeight: '600' },
  optionTextActive: { color: COLORS.copper },
  nextBtn: {
    borderRadius: 12,
    backgroundColor: COLORS.deepGreen,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  nextBtnDisabled: { opacity: 0.45 },
  nextText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
