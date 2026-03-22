import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TutorialNavigation from '../../components/tutorial/TutorialNavigation';
import TutorialProgressBar from '../../components/tutorial/TutorialProgressBar';
import TutorialStepCard from '../../components/tutorial/TutorialStepCard';
import { useApp } from '../../context/appcontext';
import { colors } from '../../constants/colors';
import { tutorialSteps } from '../../constants/tutorialSteps';
import { speakTutorialStep, stopTutorialSpeech } from '../../utils/tutorialSpeech';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TutorialScreen() {
  const router = useRouter();
  const { completeTutorial, language, setLanguage, oralMode, toggleOralMode } = useApp();
  const totalSteps = tutorialSteps.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const step = tutorialSteps[currentStep];
  const title = language === 'wo' ? step.titleWo : step.titleFr;
  const description = language === 'wo' ? step.descWo : step.descFr;

  const nextLabel = useMemo(() => {
    if (currentStep === totalSteps - 1) {
      return language === 'wo' ? 'Jeex' : 'Terminer';
    }
    return language === 'wo' ? 'Bi ci topp' : 'Suivant';
  }, [currentStep, language, totalSteps]);

  const skipLabel = language === 'wo' ? 'Génn' : 'Passer';

  useEffect(() => {
    speakTutorialStep(oralMode, title, description);
    return () => {
      stopTutorialSpeech();
    };
  }, [description, oralMode, title]);

  const animateToStep = (targetIndex: number, moveDirection: 'next' | 'prev') => {
    const startOffset = moveDirection === 'next' ? SCREEN_WIDTH * 0.18 : -SCREEN_WIDTH * 0.18;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 110,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: moveDirection === 'next' ? -SCREEN_WIDTH * 0.08 : SCREEN_WIDTH * 0.08,
          duration: 110,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(translateX, {
        toValue: startOffset,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    setCurrentStep(targetIndex);
  };

  const handlePrevious = () => {
    if (currentStep === 0) {
      return;
    }
    animateToStep(currentStep - 1, 'prev');
  };

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      setCompleted(true);
      return;
    }
    animateToStep(currentStep + 1, 'next');
  };

  const handleSelectStep = (index: number) => {
    if (index === currentStep) {
      return;
    }
    animateToStep(index, index > currentStep ? 'next' : 'prev');
  };

  const resetTutorial = () => {
    setCompleted(false);
    setCurrentStep(0);
  };

  const finishTutorial = () => {
    completeTutorial();
    router.replace('/onboarding' as never);
  };

  if (completed) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.completionWrap}>
          <View style={styles.completionIconOuter}>
            <View style={styles.completionIconInner}>
              <Ionicons name="checkmark" size={34} color={colors.white} />
            </View>
          </View>

          <Text style={styles.completionTitle}>
            {language === 'wo' ? 'Pare nga!' : 'Tu es prête !'}
          </Text>
          <Text style={styles.completionText}>
            {language === 'wo'
              ? 'Léegi xam nga naka ngay jëfandikoo SaxalWér. Seet ci sa bopp, laajal sa laaj yi, te bul ragal — ñu nekk fi ngir la.'
              : "Maintenant tu sais comment utiliser SaxalWér. Explore à ton rythme, pose tes questions, et n'hésite jamais — nous sommes là pour toi."}
          </Text>

          <Pressable style={styles.primaryCompletionButton} onPress={finishTutorial}>
            <Ionicons name="sparkles-outline" size={16} color={colors.beige} />
            <Text style={styles.primaryCompletionText}>
              {language === 'wo' ? 'Tambali sama yoon' : 'Commencer mon parcours'}
            </Text>
          </Pressable>

          <Pressable onPress={resetTutorial} style={styles.secondaryCompletionButton}>
            <Text style={styles.secondaryCompletionText}>
              {language === 'wo' ? 'Déllu ci tutoriel bi' : 'Revoir le tutoriel'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setLanguage(language === 'fr' ? 'wo' : 'fr')}
            style={styles.languagePill}
          >
            <Text style={styles.languagePillText}>{language === 'fr' ? 'Français' : 'Wolof'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerCircleButton}>
            <Ionicons name="chevron-back" size={18} color={colors.deepGreen} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerLabel}>Tutoriel</Text>
            <Text style={styles.headerProgress}>{currentStep + 1} / {totalSteps}</Text>
          </View>

          <Pressable onPress={finishTutorial} style={styles.skipButton}>
            <Text style={styles.skipText}>{skipLabel}</Text>
          </Pressable>
        </View>

        <View style={styles.progressWrap}>
          <TutorialProgressBar progress={(currentStep + 1) / totalSteps} color={step.color} />
        </View>

        <ScrollView
          style={styles.contentArea}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.stepWrap,
              {
                opacity,
                transform: [{ translateX }],
              },
            ]}
          >
            <TutorialStepCard step={step} language={language} />
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <TutorialNavigation
            canGoBack={currentStep > 0}
            nextLabel={nextLabel}
            color={step.color}
            total={totalSteps}
            current={currentStep}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSelect={handleSelectStep}
          />

          <View style={styles.footerMetaRow}>
            <Pressable
              onPress={() => setLanguage(language === 'fr' ? 'wo' : 'fr')}
              style={styles.metaPill}
            >
              <Ionicons name="language-outline" size={14} color={colors.deepGreen} />
              <Text style={styles.metaPillText}>{language === 'fr' ? 'Français' : 'Wolof'}</Text>
            </Pressable>

            <Pressable onPress={toggleOralMode} style={styles.metaPillMuted}>
              <Ionicons
                name={oralMode ? 'volume-high-outline' : 'volume-medium-outline'}
                size={14}
                color={colors.mutedSage}
              />
              <Text style={styles.metaPillMutedText}>{oralMode ? 'Oral ON' : 'Oral OFF'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  header: {
    height: 72,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCircleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9DFD2',
  },
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    color: 'rgba(74,47,39,0.5)',
    marginBottom: 2,
  },
  headerProgress: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.cocoaDark,
  },
  skipButton: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
  skipText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(74,47,39,0.60)',
  },
  progressWrap: {
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 18,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 10,
  },
  stepWrap: {
    width: '100%',
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(74,47,39,0.08)',
    backgroundColor: '#F7F2E9',
    gap: 12,
  },
  footerMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaPill: {
    height: 32,
    borderRadius: 999,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7DDD0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaPillText: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: '700',
  },
  metaPillMuted: {
    height: 32,
    borderRadius: 999,
    paddingHorizontal: 12,
    backgroundColor: '#F2ECE1',
    borderWidth: 1,
    borderColor: '#E7DDD0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaPillMutedText: {
    color: colors.mutedSage,
    fontSize: 12,
    fontWeight: '700',
  },
  completionWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.beige,
  },
  completionIconOuter: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26,60,52,0.08)',
    marginBottom: 22,
  },
  completionIconInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.deepGreen,
  },
  completionTitle: {
    textAlign: 'center',
    color: colors.deepGreen,
    fontSize: 31,
    fontWeight: '800',
    marginBottom: 12,
  },
  completionText: {
    textAlign: 'center',
    color: colors.cocoaDark,
    fontSize: 16,
    lineHeight: 26,
    opacity: 0.88,
    marginBottom: 28,
  },
  primaryCompletionButton: {
    width: '100%',
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryCompletionText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryCompletionButton: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  secondaryCompletionText: {
    color: colors.cocoaDark,
    fontSize: 14,
    fontWeight: '700',
  },
  languagePill: {
    height: 34,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E7DDD0',
    backgroundColor: '#FFFFFF',
  },
  languagePillText: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: '800',
  },
});
