import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef } from 'react';
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
import GoalCard from '../../components/onboarding/GoalCard';
import StepIndicator from '../../components/onboarding/StepIndicator';
import { useOnboarding } from '../../context/OnboardingContext';

type GoalOption = {
  key: string;
  label: string;
  tagline: string;
  detail?: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  tint: 'sage' | 'sand' | 'rose';
};

const COLORS = {
  bg: '#F7F0E4',
  deepGreen: '#1A3C34',
  cocoa: '#5D4337',
  sage: '#A7B8AC',
  sand: '#D27B45',
  muted: 'rgba(93,67,55,0.72)',
  subtle: 'rgba(93,67,55,0.46)',
};

const GOAL_OPTIONS: GoalOption[] = [
  {
    key: 'Cycle & Règles',
    label: 'Cycle & Règles',
    tagline: 'Comprendre et apprivoiser mon rythme',
    icon: 'clock',
    tint: 'sage',
  },
  {
    key: 'Grossesse & Fertilité',
    label: 'Grossesse & Fertilité',
    tagline: 'Mon chemin vers la maternité',
    detail: 'Fertilité · Conception · Accompagnement prénatal',
    icon: 'heart',
    tint: 'sand',
  },
  {
    key: 'Ménopause & Transitions',
    label: 'Ménopause & Transitions',
    tagline: 'Traverser cette étape avec sérénité',
    icon: 'sunrise',
    tint: 'rose',
  },
  {
    key: 'Bien-être général',
    label: 'Bien-être général',
    tagline: 'Prendre soin de moi au quotidien',
    icon: 'shield',
    tint: 'rose',
  },
];

export default function ObjectifsScreen() {
  const router = useRouter();
  const {
    primaryGoal,
    setPrimaryGoal,
    secondaryGoal,
    setSecondaryGoal,
    navigationDirection,
    setNavigationDirection,
  } = useOnboarding();
  const screenWidth = Dimensions.get('window').width;
  const translateX = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      const fromValue = navigationDirection === 'back' ? -screenWidth : screenWidth;
      translateX.setValue(fromValue);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, [navigationDirection, screenWidth, translateX])
  );

  const handleBack = () => {
    setNavigationDirection('back');
    Animated.timing(translateX, {
      toValue: screenWidth,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };

  const handleNext = () => {
    setNavigationDirection('forward');
    Animated.timing(translateX, {
      toValue: -screenWidth,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/personnalisation');
    });
  };

  const isDisabled = !primaryGoal;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.screen, { transform: [{ translateX }] }]}>
        <View style={styles.headerRow}>
          <BackButton onPress={handleBack} />
          <View style={styles.progressWrap}>
            <StepIndicator activeStep={3} totalSteps={3} />
            <Text style={styles.progressLabel}>ÉTAPE 3 / 3</Text>
          </View>
          <View style={styles.sideSpace} />
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.heroArt} pointerEvents="none">
            <View style={styles.arcOne} />
            <View style={styles.arcTwo} />
            <View style={styles.arcThree} />
          </View>

          <View style={styles.contentBlock}>
            <Text style={styles.title}>Quel est ton objectif{"\n"}principal ?</Text>
            <Text style={styles.subtitle}>Tu peux aussi ajouter le bien-être général à ton objectif.</Text>

            <View style={styles.list}>
              {GOAL_OPTIONS.map((item) => (
                <GoalCard
                  key={item.key}
                  label={item.label}
                  tagline={item.tagline}
                  detail={item.detail}
                  icon={item.icon}
                  tint={item.tint}
                  selected={primaryGoal === item.key}
                  onPress={() => setPrimaryGoal(item.key)}
                />
              ))}
            </View>

            <Pressable
              onPress={() => setSecondaryGoal(!secondaryGoal)}
              style={[styles.secondaryToggle, secondaryGoal && styles.secondaryToggleActive]}
            >
              <View style={[styles.secondaryIndicator, secondaryGoal && styles.secondaryIndicatorActive]}>
                {secondaryGoal ? <Feather name="check" size={12} color="#FFFFFF" /> : null}
              </View>
              <Text style={[styles.secondaryToggleText, secondaryGoal && styles.secondaryToggleTextActive]}>
                Ajouter aussi « Bien-être général »
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={handleNext}
            disabled={isDisabled}
            style={[styles.primaryButton, isDisabled && styles.primaryButtonDisabled]}
          >
            <View style={styles.primaryButtonInner}>
              <Text style={[styles.primaryButtonText, isDisabled && styles.primaryButtonTextDisabled]}>
                Découvrir mon espace
              </Text>
              <Feather
                name="arrow-right"
                size={22}
                color={isDisabled ? 'rgba(255,249,239,0.92)' : '#FFF9EF'}
              />
            </View>
          </Pressable>
          <Text style={styles.footerHint}>TU POURRAS MODIFIER CELA DANS MON ESPACE</Text>
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
    paddingTop: 10,
    paddingBottom: 24,
  },
  contentBlock: {
    gap: 18,
  },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressLabel: {
    color: 'rgba(93,67,55,0.48)',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  heroArt: {
    position: 'absolute',
    top: -8,
    right: -48,
    width: 280,
    height: 240,
    opacity: 0.4,
  },
  arcOne: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 1,
    borderColor: 'rgba(167,184,172,0.12)',
  },
  arcTwo: {
    position: 'absolute',
    right: 36,
    top: 34,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(167,184,172,0.10)',
  },
  arcThree: {
    position: 'absolute',
    right: 64,
    top: 62,
    width: 102,
    height: 102,
    borderRadius: 51,
    borderWidth: 1,
    borderColor: 'rgba(167,184,172,0.08)',
  },
  title: {
    color: COLORS.deepGreen,
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 46,
    letterSpacing: -0.8,
    fontFamily: Platform.OS === 'ios' ? 'CormorantGaramond-Bold' : 'serif',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 24,
  },
  list: {
    gap: 14,
  },
  secondaryToggle: {
    marginTop: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(93,67,55,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  secondaryToggleActive: {
    borderColor: COLORS.sand,
    backgroundColor: 'rgba(210,123,69,0.10)',
  },
  secondaryIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: 'rgba(93,67,55,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryIndicatorActive: {
    borderColor: COLORS.sand,
    backgroundColor: COLORS.sand,
  },
  secondaryToggleText: {
    color: COLORS.cocoa,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryToggleTextActive: {
    color: COLORS.sand,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 18,
    paddingTop: 12,
    backgroundColor: COLORS.bg,
  },
  primaryButton: {
    height: 78,
    borderRadius: 24,
    backgroundColor: COLORS.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C9B9A2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: 'rgba(26,60,52,0.52)',
  },
  primaryButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primaryButtonText: {
    color: '#FFF9EF',
    fontSize: 18,
    fontWeight: '700',
  },
  primaryButtonTextDisabled: {
    color: 'rgba(255,249,239,0.92)',
  },
  footerHint: {
    marginTop: 18,
    textAlign: 'center',
    color: COLORS.subtle,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
});
