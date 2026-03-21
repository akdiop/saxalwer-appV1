import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import BackButton from '../../components/onboarding/BackButton';
import StepIndicator from '../../components/onboarding/StepIndicator';
import { useApp, type GoalId, type PersonalizationContext } from '../../context/appcontext';
import { useOnboarding } from '../../context/OnboardingContext';

const COLORS = {
  bg: '#F7F0E4',
  deepGreen: '#1A3C34',
  cocoa: '#5D4337',
  sand: '#C96F3D',
  shadow: 'rgba(55, 39, 32, 0.1)',
  white: '#FFFFFF',
  whiteSoft: 'rgba(255,255,255,0.78)',
  lightBorder: 'rgba(26,60,52,0.08)',
  selectedBorder: '#D78A58',
  selectedBg: '#FFF7EF',
  subtle: 'rgba(93,67,55,0.82)',
  faint: 'rgba(93,67,55,0.58)',
  muted: 'rgba(93,67,55,0.34)',
};

type FeatherIcon = React.ComponentProps<typeof Feather>['name'];

type QuestionKey =
  | 'ageRange'
  | 'livingContext'
  | 'privacyLevel'
  | 'socialNorms'
  | 'educationLevel'
  | 'preferredTone'
  | 'audioPreference'
  | 'needsSupport';

type Option<T extends string> = {
  value: T;
  label: string;
  description: string;
  icon: FeatherIcon;
};

type Question<T extends string> = {
  key: QuestionKey;
  title: string;
  subtitle: string;
  options: Option<T>[];
};

const QUESTIONS: Question<any>[] = [
  {
    key: 'ageRange',
    title: "Quelle est ta tranche d'âge ?",
    subtitle: 'Cela nous aide à adapter les exemples et les conseils à ton moment de vie.',
    options: [
      { value: '15-17', label: '15 à 17 ans', description: 'Adolescence et premiers repères', icon: 'calendar' },
      { value: '18-24', label: '18 à 24 ans', description: 'Jeunes adultes et nouvelles habitudes', icon: 'calendar' },
      { value: '25-34', label: '25 à 34 ans', description: 'Vie active, projets et équilibre', icon: 'calendar' },
      { value: '35-49', label: '35 à 49 ans', description: 'Transitions, stabilité et prévention', icon: 'calendar' },
      { value: '50+', label: '50 ans et plus', description: 'Ménopause, bien-être et accompagnement', icon: 'calendar' },
    ],
  },
  {
    key: 'livingContext',
    title: 'Avec qui vis-tu en ce moment ?',
    subtitle: 'Cela nous aide à proposer un niveau de discrétion adapté à ton quotidien.',
    options: [
      { value: 'alone', label: 'Seule', description: 'Je gère mon espace seule', icon: 'home' },
      { value: 'parents', label: 'Avec mes parents', description: 'Je partage mon quotidien avec mes parents', icon: 'users' },
      { value: 'partner', label: 'Avec mon partenaire', description: 'Je vis avec mon partenaire', icon: 'heart' },
      { value: 'roommates', label: 'Avec des amies ou colocataires', description: 'Je partage mon logement avec des proches', icon: 'user-plus' },
      { value: 'family', label: 'En famille élargie', description: 'Je vis dans un cadre familial plus large', icon: 'home' },
    ],
  },
  {
    key: 'privacyLevel',
    title: 'Quel est ton besoin de confidentialité ?',
    subtitle: 'Nous activerons automatiquement le mode discret si nécessaire.',
    options: [
      { value: 'low', label: 'Peu de besoin de discrétion', description: "Je peux utiliser l'app ouvertement", icon: 'eye' },
      { value: 'medium', label: 'Besoin modéré', description: 'Je préfère rester discrète', icon: 'lock' },
      { value: 'high', label: 'Besoin élevé', description: 'La confidentialité est importante', icon: 'shield' },
      { value: 'very-high', label: 'Besoin très élevé', description: 'Ma sécurité est prioritaire', icon: 'shield-off' },
    ],
  },
  {
    key: 'socialNorms',
    title: 'Comment est ton environnement social ?',
    subtitle: 'Cela nous aide à adapter le ton aux normes culturelles.',
    options: [
      { value: 'conservative', label: 'Tabous importants', description: 'Je préfère un ton très respectueux', icon: 'users' },
      { value: 'moderate', label: 'Modéré', description: 'Équilibre entre respect et franchise', icon: 'users' },
      { value: 'open', label: 'Ouvert', description: "Je suis à l'aise avec des sujets directs", icon: 'users' },
    ],
  },
  {
    key: 'educationLevel',
    title: 'Comment préfères-tu les explications ?',
    subtitle: 'Cela nous aide à doser la complexité des réponses.',
    options: [
      { value: 'basic', label: 'Explications simples', description: 'Utiliser des mots de tous les jours', icon: 'message-circle' },
      { value: 'intermediate', label: 'Niveau intermédiaire', description: 'Mélange de vulgarisation et de termes médicaux', icon: 'message-circle' },
      { value: 'advanced', label: 'Explications détaillées', description: "J'apprécie les termes médicaux précis", icon: 'message-circle' },
    ],
  },
  {
    key: 'preferredTone',
    title: "Comment souhaites-tu que le chatbot s'adresse à toi ?",
    subtitle: 'Tu pourras changer ce ton plus tard depuis ton espace si tu veux.',
    options: [
      { value: 'sisterly', label: 'Ton complice', description: 'Chaleureux, doux et très proche', icon: 'smile' },
      { value: 'friendly', label: 'Ton bienveillant', description: 'Simple, rassurant et naturel', icon: 'sun' },
      { value: 'formal', label: 'Ton respectueux', description: 'Plus posé, plus neutre et plus formel', icon: 'bookmark' },
    ],
  },
  {
    key: 'audioPreference',
    title: "Souhaites-tu utiliser l'audio ?",
    subtitle: "Tu pourras toujours changer d'avis et demander une transcription dans l'application.",
    options: [
      { value: 'always', label: 'Toujours', description: "Je veux privilégier l'audio quand c'est possible", icon: 'volume-2' },
      { value: 'sometimes', label: 'Parfois', description: "Je veux l'audio seulement selon le moment", icon: 'headphones' },
      { value: 'never', label: 'Jamais', description: 'Je préfère rester sur du texte', icon: 'volume-x' },
    ],
  },
  {
    key: 'needsSupport',
    title: 'As-tu besoin de soutien émotionnel ?',
    subtitle: "Cela nous aide à adopter un ton plus rassurant et à mieux t'accompagner si besoin.",
    options: [
      { value: 'yes', label: "Oui, j'en ai besoin", description: "Je veux un accompagnement plus doux et réconfortant", icon: 'heart' },
      { value: 'sometimes', label: 'Parfois', description: 'Selon les sujets ou les moments, cela peut m’aider', icon: 'moon' },
      { value: 'no', label: 'Pas spécialement', description: 'Je préfère surtout des réponses directes et pratiques', icon: 'check-circle' },
    ],
  },
];

type Answers = Pick<
  PersonalizationContext,
  | 'ageRange'
  | 'livingContext'
  | 'privacyLevel'
  | 'socialNorms'
  | 'educationLevel'
  | 'preferredTone'
  | 'audioPreference'
> & {
  needsSupportChoice: 'yes' | 'sometimes' | 'no' | null;
};

type OptionCardProps = {
  icon: FeatherIcon;
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

function OptionCard({ icon, label, description, selected, onPress }: OptionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        selected && styles.optionCardSelected,
        pressed && styles.optionCardPressed,
      ]}
    >
      <View style={[styles.optionIconWrap, selected && styles.optionIconWrapSelected]}>
        <Feather color={selected ? COLORS.sand : COLORS.cocoa} name={icon} size={24} />
      </View>

      <View style={styles.optionBody}>
        <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>

      <View style={[styles.optionMarker, selected && styles.optionMarkerSelected]}>
        {selected ? <Feather color="#FFFFFF" name="check" size={18} /> : null}
      </View>
    </Pressable>
  );
}

export default function PersonnalisationScreen() {
  const router = useRouter();
  const {
    age,
    needs,
    primaryGoal,
    secondaryGoal,
    navigationDirection,
    setNavigationDirection,
  } = useOnboarding();
  const {
    personalization: currentPersonalization,
    setAge,
    setNeeds,
    setGoals,
    setPersonalization,
    setPrivacyConcern,
  } = useApp();

  const screenWidth = Dimensions.get('window').width;
  const translateX = useRef(new Animated.Value(0)).current;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    ageRange: age
      ? (age as PersonalizationContext['ageRange'])
      : currentPersonalization.ageRange,
    livingContext: currentPersonalization.livingContext,
    privacyLevel: currentPersonalization.privacyLevel,
    socialNorms: currentPersonalization.socialNorms,
    educationLevel: currentPersonalization.educationLevel,
    preferredTone: currentPersonalization.preferredTone,
    audioPreference: currentPersonalization.audioPreference,
    needsSupportChoice: currentPersonalization.needsSupport ? 'yes' : null,
  });

  useFocusEffect(
    useCallback(() => {
      const fromValue = navigationDirection === 'back' ? -screenWidth : screenWidth;
      translateX.setValue(fromValue);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 360,
        useNativeDriver: true,
      }).start();
    }, [navigationDirection, screenWidth, translateX])
  );

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentValue =
    currentQuestion.key === 'needsSupport'
      ? answers.needsSupportChoice
      : answers[currentQuestion.key];
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

  const continueLabel = useMemo(() => {
    if (isLastQuestion) {
      return 'Decouvrir mon espace';
    }
    return 'Continuer';
  }, [isLastQuestion]);

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      return;
    }

    setNavigationDirection('back');
    Animated.timing(translateX, {
      toValue: screenWidth,
      duration: 360,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };

  const handleSelect = (value: string) => {
    if (currentQuestion.key === 'needsSupport') {
      setAnswers((prev) => ({
        ...prev,
        needsSupportChoice: value as Answers['needsSupportChoice'],
      }));
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.key]: value,
    }));
  };

  const goToOrientation = (nextPersonalization: PersonalizationContext) => {
    setNavigationDirection('forward');
    Animated.timing(translateX, {
      toValue: -screenWidth,
      duration: 360,
      useNativeDriver: true,
    }).start(() => {
      setPersonalization(nextPersonalization);
      setPrivacyConcern(
        nextPersonalization.privacyLevel === 'high' ||
          nextPersonalization.privacyLevel === 'very-high'
      );
      router.replace('/orientation' as any);
    });
  };

  const commitOnboardingBasics = () => {
    const goalMap: Record<string, GoalId> = {
      'Cycle & Regles': 'cycle',
      'Cycle & Règles': 'cycle',
      'Grossesse & Fertilite': 'grossesse',
      'Grossesse & Fertilité': 'grossesse',
      'Menopause & Transitions': 'menopause',
      'Ménopause & Transitions': 'menopause',
      'Bien-etre general': 'bienetre',
      'Bien-être général': 'bienetre',
    };

    const selectedGoals: GoalId[] = [];
    if (primaryGoal && goalMap[primaryGoal]) {
      selectedGoals.push(goalMap[primaryGoal]);
    }
    if (secondaryGoal && !selectedGoals.includes('bienetre')) {
      selectedGoals.push('bienetre');
    }

    const resolvedAge = answers.ageRange ?? (age as PersonalizationContext['ageRange']) ?? null;

    if (resolvedAge) {
      setAge(resolvedAge);
    }
    setNeeds(needs);
    setGoals(selectedGoals);
  };

  const handleContinue = () => {
    if (!currentValue) {
      return;
    }

    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }

    commitOnboardingBasics();

    const nextPersonalization: PersonalizationContext = {
      ...currentPersonalization,
      ...answers,
      ageRange: answers.ageRange ?? currentPersonalization.ageRange,
      needsSupport:
        answers.needsSupportChoice === 'yes' ||
        answers.needsSupportChoice === 'sometimes',
    };

    goToOrientation(nextPersonalization);
  };

  const handleSkip = () => {
    commitOnboardingBasics();

    const nextPersonalization: PersonalizationContext = {
      ...currentPersonalization,
      ageRange: answers.ageRange ?? currentPersonalization.ageRange,
      livingContext: answers.livingContext ?? currentPersonalization.livingContext,
      privacyLevel: answers.privacyLevel ?? currentPersonalization.privacyLevel,
      socialNorms: answers.socialNorms ?? currentPersonalization.socialNorms,
      educationLevel: answers.educationLevel ?? currentPersonalization.educationLevel,
      preferredTone: answers.preferredTone ?? currentPersonalization.preferredTone,
      audioPreference: answers.audioPreference ?? currentPersonalization.audioPreference,
      needsSupport:
        answers.needsSupportChoice === 'yes' ||
        answers.needsSupportChoice === 'sometimes' ||
        currentPersonalization.needsSupport,
    };

    goToOrientation(nextPersonalization);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.screen, { transform: [{ translateX }] }]}>
        <View style={styles.headerRow}>
          <BackButton onPress={handleBack} />
          <StepIndicator activeStep={4} />
          <View style={styles.sideSpace} />
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headingBlock}>
            <Text style={styles.progressLabel}>
              Question {currentQuestionIndex + 1} / {QUESTIONS.length}
            </Text>
            <Text style={styles.title}>{currentQuestion.title}</Text>
            <Text style={styles.subtitle}>{currentQuestion.subtitle}</Text>
          </View>

          <View style={styles.optionsList}>
            {currentQuestion.options.map((option) => (
              <OptionCard
                key={option.value}
                description={option.description}
                icon={option.icon}
                label={option.label}
                onPress={() => handleSelect(option.value)}
                selected={currentValue === option.value}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            disabled={!currentValue}
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.primaryButton,
              !currentValue && styles.primaryButtonDisabled,
              pressed && currentValue && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>{continueLabel}</Text>
            <Feather color="#FFFFFF" name="arrow-right" size={20} />
          </Pressable>

          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Passer cette etape pour le moment</Text>
          </Pressable>

      <Text style={styles.footnote}>
            Tu pourras modifier ces préférences dans Mon espace à tout moment.
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  headerRow: {
    height: 74,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideSpace: {
    width: 40,
    height: 40,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headingBlock: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  progressLabel: {
    color: COLORS.sand,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 18,
  },
  title: {
    maxWidth: 720,
    textAlign: 'center',
    color: COLORS.deepGreen,
    fontSize: 34,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -0.7,
    fontFamily: Platform.OS === 'ios' ? 'CormorantGaramond-Bold' : 'serif',
  },
  subtitle: {
    marginTop: 14,
    maxWidth: 720,
    textAlign: 'center',
    color: COLORS.subtle,
    fontSize: 16,
    lineHeight: 27,
  },
  optionsList: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    gap: 18,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightBorder,
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  optionCardSelected: {
    backgroundColor: COLORS.selectedBg,
    borderColor: COLORS.selectedBorder,
    shadowColor: COLORS.sand,
    shadowOpacity: 0.12,
  },
  optionCardPressed: {
    transform: [{ scale: 0.995 }],
  },
  optionIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: COLORS.whiteSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionIconWrapSelected: {
    backgroundColor: 'rgba(201,111,61,0.12)',
  },
  optionBody: {
    flex: 1,
    paddingRight: 12,
  },
  optionLabel: {
    color: COLORS.deepGreen,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: COLORS.sand,
  },
  optionDescription: {
    color: COLORS.subtle,
    fontSize: 15,
    lineHeight: 22,
  },
  optionMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionMarkerSelected: {
    backgroundColor: COLORS.sand,
    borderColor: COLORS.sand,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  primaryButton: {
    minHeight: 62,
    borderRadius: 31,
    backgroundColor: COLORS.deepGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: COLORS.deepGreen,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: '#AAB8AE',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonPressed: {
    opacity: 0.94,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  skipButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  skipButtonText: {
    color: COLORS.sand,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  footnote: {
    textAlign: 'center',
    color: COLORS.faint,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 2,
  },
});
