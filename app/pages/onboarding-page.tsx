import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AgeSelection from '../../components/AgeSelection';
import ContextualPersonalization from '../../components/ContextualPersonalization';
import HealthNeeds from '../../components/HealthNeeds';
import PersonalGoals from '../../components/PersonalGoals';
import { useApp, type GoalId } from '../../context/appcontext';

type Step = 1 | 2 | 3 | 4;

const COLORS = {
  bg: '#FDFAF5',
  deepGreen: '#1A3C34',
  copper: '#B5622A',
  cocoa: '#4A2F27',
};

export default function OnboardingPageConverted() {
  const router = useRouter();
  const { language, setAge, setGoals, selectedAge, completeOnboarding } = useApp();
  const wo = language === 'wo';

  const [step, setStep] = React.useState<Step>(1);

  function onAgeSelect(ageRange: string) {
    setAge(ageRange);
    setStep(2);
  }

  function onGoalsFinish(goals: GoalId[]) {
    setGoals(goals);
    setStep(4);
  }

  function onNeedsFinish() {
    setStep(3);
  }

  function next() {
    if (step < 4) {
      setStep((step + 1) as Step);
      return;
    }
    completeOnboarding();
    router.push('/' as any);
  }

  function back() {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((step - 1) as Step);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={back} style={styles.backBtn}>
            <Feather name="chevron-left" size={20} color={COLORS.deepGreen} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{wo ? 'Onboarding' : 'Onboarding'}</Text>
            <Text style={styles.subtitle}>{wo ? `Etape ${step}/4` : `Étape ${step}/4`}</Text>
          </View>
        </View>

        <View style={styles.progressWrap}>
          {[1, 2, 3, 4].map((v) => (
            <View key={v} style={[styles.progressBar, step >= v && styles.progressBarActive]} />
          ))}
        </View>

        <View style={styles.body}>
          {step === 1 ? <AgeSelection onSelect={onAgeSelect} /> : null}
          {step === 2 ? <HealthNeeds onFinish={onNeedsFinish} /> : null}
          {step === 3 ? <PersonalGoals selectedAge={selectedAge} onFinish={onGoalsFinish} /> : null}
          {step === 4 ? <ContextualPersonalization /> : null}
        </View>

        {step > 1 ? (
          <Pressable style={styles.nextBtn} onPress={next}>
            <Text style={styles.nextText}>{step === 4 ? (wo ? 'Jeexal' : 'Terminer') : (wo ? 'Kontine' : 'Continuer')}</Text>
            <Feather name={step === 4 ? 'check' : 'chevron-right'} size={16} color="white" />
          </Pressable>
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
  progressWrap: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  progressBar: { flex: 1, height: 6, borderRadius: 99, backgroundColor: 'rgba(26,60,52,0.14)' },
  progressBarActive: { backgroundColor: COLORS.deepGreen },
  body: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    minHeight: 420,
  },
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
  nextText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
