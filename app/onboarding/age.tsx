import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import AgeCard from '../../components/onboarding/AgeCard';
import StepIndicator from '../../components/onboarding/StepIndicator';
import { useOnboarding } from '../../context/OnboardingContext';

const AGE_OPTIONS = ['15-17', '18-24', '25-34', '35-49', '50+'];

export default function AgeScreen() {
  const router = useRouter();
  const { age, setAge, navigationDirection, setNavigationDirection } = useOnboarding();
  const screenWidth = Dimensions.get('window').width;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fromValue = navigationDirection === 'back' ? -screenWidth : screenWidth;
    translateX.setValue(fromValue);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [navigationDirection, screenWidth, translateX]);

  const handleSelectAge = (value: string) => {
    setAge(value);
    setNavigationDirection('forward');

    Animated.timing(translateX, {
      toValue: -screenWidth,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/besoins');
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.screen, { transform: [{ translateX }] }]}>
        <View style={styles.headerRow}>
          <View style={styles.sideSpace} />
          <StepIndicator activeStep={1} />
          <View style={styles.sideSpace} />
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.contentBlock}>
            <Text style={styles.title}>Choisis ta tranche d&apos;age</Text>
            <Text style={styles.subtitle}>Pour un accompagnement adapte a ton parcours.</Text>

            <View style={styles.grid}>
              {AGE_OPTIONS.map((item) => (
                <View key={item} style={styles.gridItem}>
                  <AgeCard label={item} selected={age === item} onPress={() => handleSelectAge(item)} />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F1E6',
  },
  screen: {
    flex: 1,
  },
  headerRow: {
    height: 64,
    paddingHorizontal: 20,
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  contentBlock: {
    gap: 14,
  },
  title: {
    textAlign: 'center',
    color: '#4A2F27',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  subtitle: {
    textAlign: 'center',
    color: '#4A2F27',
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.88,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
});
