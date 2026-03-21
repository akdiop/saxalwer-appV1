import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/appcontext';

type Step = 1 | 2 | 3;

type Choice = {
  id: string;
  fr: string;
  wo: string;
  icon: string;
  iconSet: 'feather' | 'mci';
};

const COLORS = {
  bg: '#FDFAF5',
  deepGreen: '#1A3C34',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  terracotta: '#A65D40',
};

const MOOD_OPTIONS: Choice[] = [
  { id: 'anxious', fr: 'Anxieuse', wo: 'Tiit', icon: 'alert-circle', iconSet: 'feather' },
  { id: 'curious', fr: 'Curieuse', wo: 'Bëgg xam', icon: 'compass', iconSet: 'feather' },
  { id: 'overwhelmed', fr: 'Submergée', wo: 'Metti lool', icon: 'waves', iconSet: 'mci' },
  { id: 'ready', fr: 'Prête', wo: 'Jàmm', icon: 'check-circle', iconSet: 'feather' },
];

const COMFORT_OPTIONS: Choice[] = [
  { id: 'text', fr: 'Lecture simple', wo: 'Jàng bu yomb', icon: 'book-open', iconSet: 'feather' },
  { id: 'audio', fr: 'Audio guidé', wo: 'Audio', icon: 'volume-2', iconSet: 'feather' },
  { id: 'anonymous', fr: 'Mode discret', wo: 'Mode suufe', icon: 'eye-off', iconSet: 'feather' },
  { id: 'assistant', fr: 'Chat accompagnement', wo: 'Ndimbal waxtaan', icon: 'message-circle', iconSet: 'feather' },
];

function ChoiceIcon({ item }: { item: Choice }) {
  if (item.iconSet === 'mci') {
    return <MaterialCommunityIcons name={item.icon as any} size={16} color={COLORS.deepGreen} />;
  }
  return <Feather name={item.icon as any} size={16} color={COLORS.deepGreen} />;
}

export default function OrientationSensiblePage() {
  const router = useRouter();
  const { language, saveSensitiveOrientation } = useApp();
  const wo = language === 'wo';

  const [step, setStep] = React.useState<Step>(1);
  const [selectedMood, setSelectedMood] = React.useState<string[]>([]);
  const [selectedComfort, setSelectedComfort] = React.useState<string[]>([]);
  const [shareLevel, setShareLevel] = React.useState<'low' | 'medium' | 'high' | null>(null);

  function toggle(arrSetter: React.Dispatch<React.SetStateAction<string[]>>, value: string) {
    arrSetter((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  }

  function submit() {
    saveSensitiveOrientation({
      emotionalState: selectedMood,
      comfortStyle: selectedComfort,
      opennessLevel: shareLevel,
      completedAt: new Date().toISOString(),
    } as any);
    router.push('/' as any);
  }

  const canNextStep1 = selectedMood.length > 0;
  const canNextStep2 = selectedComfort.length > 0;
  const canSubmit = !!shareLevel;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => (step === 1 ? router.back() : setStep((step - 1) as Step))} style={styles.backBtn}>
            <Feather name="chevron-left" size={20} color={COLORS.deepGreen} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{wo ? 'Orientation sensible' : 'Orientation sensible'}</Text>
            <Text style={styles.subtitle}>{wo ? `Etape ${step}/3` : `Étape ${step}/3`}</Text>
          </View>
        </View>

        <View style={styles.progressWrap}>
          {[1, 2, 3].map((v) => (
            <View key={v} style={[styles.progressBar, step >= v && styles.progressBarActive]} />
          ))}
        </View>

        {step === 1 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{wo ? 'Naka nga nekk léegi?' : 'Comment te sens-tu en ce moment ?'}</Text>
            <Text style={styles.sectionDesc}>{wo ? 'Tannal lu ëpp ni nga ko yëg' : 'Sélectionne tout ce qui te correspond'}</Text>
            <View style={styles.grid}>
              {MOOD_OPTIONS.map((item) => {
                const active = selectedMood.includes(item.id);
                return (
                  <Pressable key={item.id} style={[styles.choice, active && styles.choiceActive]} onPress={() => toggle(setSelectedMood, item.id)}>
                    <ChoiceIcon item={item} />
                    <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{wo ? item.wo : item.fr}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable style={[styles.nextBtn, !canNextStep1 && styles.nextBtnDisabled]} onPress={() => canNextStep1 && setStep(2)}>
              <Text style={styles.nextText}>{wo ? 'Kontine' : 'Continuer'}</Text>
              <Feather name="chevron-right" size={16} color="white" />
            </Pressable>
          </View>
        ) : null}

        {step === 2 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{wo ? 'Lan nga gëna bëgg?' : 'Quel accompagnement te met à l\'aise ?'}</Text>
            <Text style={styles.sectionDesc}>{wo ? 'Mën nga tann lu bari' : 'Tu peux choisir plusieurs options'}</Text>
            <View style={styles.grid}>
              {COMFORT_OPTIONS.map((item) => {
                const active = selectedComfort.includes(item.id);
                return (
                  <Pressable key={item.id} style={[styles.choice, active && styles.choiceActive]} onPress={() => toggle(setSelectedComfort, item.id)}>
                    <ChoiceIcon item={item} />
                    <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{wo ? item.wo : item.fr}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable style={[styles.nextBtn, !canNextStep2 && styles.nextBtnDisabled]} onPress={() => canNextStep2 && setStep(3)}>
              <Text style={styles.nextText}>{wo ? 'Kontine' : 'Continuer'}</Text>
              <Feather name="chevron-right" size={16} color="white" />
            </Pressable>
          </View>
        ) : null}

        {step === 3 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{wo ? 'Meloom sharing' : 'Niveau de partage souhaité'}</Text>
            <Text style={styles.sectionDesc}>{wo ? 'Yow ngay tànn sa xóot' : 'Tu gardes le contrôle à tout moment'}</Text>
            <View style={styles.levelWrap}>
              {[
                { id: 'low', fr: 'Minimum', wo: 'Ndank ndank' },
                { id: 'medium', fr: 'Équilibré', wo: 'Dugalante' },
                { id: 'high', fr: 'Complet', wo: 'Mët na' },
              ].map((opt) => (
                <Pressable
                  key={opt.id}
                  style={[styles.level, shareLevel === opt.id && styles.levelActive]}
                  onPress={() => setShareLevel(opt.id as any)}
                >
                  <Text style={[styles.levelText, shareLevel === opt.id && styles.levelTextActive]}>{wo ? opt.wo : opt.fr}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={[styles.nextBtn, !canSubmit && styles.nextBtnDisabled]} onPress={submit}>
              <Text style={styles.nextText}>{wo ? 'Jeexal' : 'Terminer'}</Text>
              <Feather name="check" size={16} color="white" />
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 22, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
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
  title: { fontSize: 27, fontWeight: '700', color: COLORS.deepGreen },
  subtitle: { fontSize: 12, color: 'rgba(74,47,39,0.55)', marginTop: 2 },
  progressWrap: { flexDirection: 'row', gap: 6, marginBottom: 18 },
  progressBar: { flex: 1, height: 6, borderRadius: 99, backgroundColor: 'rgba(26,60,52,0.14)' },
  progressBarActive: { backgroundColor: COLORS.deepGreen },
  section: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 16,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.deepGreen, marginBottom: 5 },
  sectionDesc: { fontSize: 12, color: 'rgba(74,47,39,0.65)', marginBottom: 12 },
  grid: { gap: 8 },
  choice: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.12)',
    backgroundColor: 'rgba(26,60,52,0.04)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  choiceActive: {
    borderColor: 'rgba(181,98,42,0.55)',
    backgroundColor: 'rgba(181,98,42,0.12)',
  },
  choiceText: { fontSize: 14, color: COLORS.deepGreen, fontWeight: '600' },
  choiceTextActive: { color: COLORS.copper },
  nextBtn: {
    marginTop: 14,
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
  levelWrap: { gap: 8 },
  level: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.12)',
    backgroundColor: 'rgba(26,60,52,0.04)',
    alignItems: 'center',
  },
  levelActive: {
    borderColor: 'rgba(181,98,42,0.55)',
    backgroundColor: 'rgba(181,98,42,0.12)',
  },
  levelText: { color: COLORS.deepGreen, fontWeight: '600' },
  levelTextActive: { color: COLORS.copper },
});
