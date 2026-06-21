import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
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
import NeedCard from '../../components/onboarding/NeedCard';
import StepIndicator from '../../components/onboarding/StepIndicator';
import { useOnboarding } from '../../context/OnboardingContext';

type NeedOption = {
  label: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  tint: 'sage' | 'sand';
  minAge?: string;
  age50Label?: string;
  age50Subtitle?: string;
};

const COLORS = {
  bg: '#F7F0E4',
  deepGreen: '#1A3C34',
  terracotta: '#D39B83',
  cocoa: '#5D4337',
  sage: '#A7B8AC',
  mist: '#EDF4F1',
  sand: '#FAF0E8',
  muted: 'rgba(93,67,55,0.72)',
};

const NEED_OPTIONS: NeedOption[] = [
  {
    label: 'Cycle & Règles',
    subtitle: 'Suivi, irrégularités, douleurs',
    icon: 'clock',
    tint: 'sage' as const,
  },
  {
    label: 'Douleurs & Symptômes',
    subtitle: 'Corps, inconfort, signaux',
    icon: 'activity',
    tint: 'sand' as const,
  },
  {
    label: 'Contraception',
    subtitle: 'Méthodes, conseils, choix',
    icon: 'shield',
    tint: 'sage' as const,
  },
  {
    label: 'Prévention IST',
    subtitle: 'Protection, dépistage',
    icon: 'eye',
    tint: 'sand' as const,
  },
  {
    label: 'Fertilité',
    subtitle: "Désir d'enfant, ovulation",
    icon: 'sun',
    tint: 'sand' as const,
  },
  {
    label: 'Ménopause',
    subtitle: 'Bouffées de chaleur, sommeil, changements du corps',
    icon: 'sunrise',
    tint: 'sand' as const,
    minAge: '50+',
    age50Label: 'Infos ménopause 50+',
    age50Subtitle: 'Pré, péri ou post-ménopause, symptômes et repères utiles',
  },
  {
    label: 'Protection & Urgence',
    subtitle: 'Aide, ressources, sécurité',
    icon: 'map-pin',
    tint: 'sage' as const,
  },
];

export default function BesoinsScreen() {
  const router = useRouter();
  const { age, needs, toggleNeed, navigationDirection, setNavigationDirection } = useOnboarding();
  const screenWidth = Dimensions.get('window').width;
  const translateX = useRef(new Animated.Value(0)).current;

  const visibleNeeds = React.useMemo(
    () => NEED_OPTIONS.filter((item) => !item.minAge || item.minAge === age),
    [age]
  );

  useEffect(() => {
    const fromValue = navigationDirection === 'back' ? -screenWidth : screenWidth;
    translateX.setValue(fromValue);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [navigationDirection, screenWidth, translateX]);

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
      router.push('/onboarding/objectifs');
    });
  };

  const isDisabled = needs.length === 0;
  const buttonLabel = isDisabled ? 'Choisis au moins un besoin' : 'Continuer';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.screen, { transform: [{ translateX }] }]}>
        <View style={styles.headerRow}>
          <BackButton onPress={handleBack} />
          <View style={styles.progressWrap}>
            <StepIndicator activeStep={2} totalSteps={3} />
            <Text style={styles.progressLabel}>ÉTAPE 2 / 3</Text>
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
            <Text style={styles.title}>Quel est ton besoin{"\n"}aujourd&apos;hui ?</Text>
            <Text style={styles.subtitle}>
              Sélectionne tous les besoins qui te concernent. Le premier deviendra ton objectif principal.
            </Text>

            <View style={styles.list}>
              {visibleNeeds.map((item) => {
                const resolvedLabel = age === '50+' && item.age50Label ? item.age50Label : item.label;
                const resolvedSubtitle =
                  age === '50+' && item.age50Subtitle ? item.age50Subtitle : item.subtitle;

                return (
                  <NeedCard
                    key={resolvedLabel}
                    label={resolvedLabel}
                    subtitle={resolvedSubtitle}
                    icon={item.icon}
                    tint={item.tint}
                    selected={needs.includes(resolvedLabel)}
                    onPress={() => toggleNeed(resolvedLabel)}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={handleNext}
            disabled={isDisabled}
            style={[styles.primaryButton, isDisabled && styles.primaryButtonDisabled]}
          >
            <Text style={[styles.primaryButtonText, isDisabled && styles.primaryButtonTextDisabled]}>
              {buttonLabel}
            </Text>
          </Pressable>
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
    gap: 20,
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
    top: 0,
    right: -40,
    width: 220,
    height: 240,
    opacity: 0.45,
  },
  arcOne: {
    position: 'absolute',
    right: -30,
    top: 8,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(167,184,172,0.16)',
  },
  arcTwo: {
    position: 'absolute',
    right: 0,
    top: 36,
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: 'rgba(167,184,172,0.12)',
  },
  arcThree: {
    position: 'absolute',
    right: 34,
    top: 64,
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 1,
    borderColor: 'rgba(167,184,172,0.10)',
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
    maxWidth: 720,
  },
  list: {
    gap: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 18,
    paddingTop: 12,
    backgroundColor: COLORS.bg,
  },
  primaryButton: {
    height: 76,
    borderRadius: 24,
    backgroundColor: COLORS.sage,
    borderWidth: 1,
    borderColor: 'rgba(93,67,55,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C9B9A2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: '#CDD8D0',
    borderColor: 'rgba(93,67,55,0.14)',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#FFF9EF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  primaryButtonTextDisabled: {
    color: '#FFF9EF',
  },
});
