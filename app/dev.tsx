import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { markSplashAsShown } from '../utils/splashUtils';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Fonts } from '@/constants/theme';

const BASE = {
  beige: '#F5F1E6',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  white: '#FFFFFF',
};

type IconSet = 'feather' | 'ionicons' | 'material';

type RouteItem = {
  path: string;
  name: string;
  color: string;
  target: string;
  iconSet: IconSet;
  icon: string;
};

const routes: RouteItem[] = [
  { path: '/splash', name: '✨ Splash Screen', icon: 'sparkles', iconSet: 'ionicons', color: BASE.deepGreen, target: '/splash' },
  { path: '/welcome', name: 'Welcome', icon: 'home', iconSet: 'feather', color: BASE.deepGreen, target: '/welcome' },
  { path: '/onboarding', name: 'Onboarding - Privacy', icon: 'shield', iconSet: 'feather', color: BASE.terracotta, target: '/onboarding' },
  { path: '/onboarding/age', name: 'Onboarding - Age', icon: 'user', iconSet: 'feather', color: BASE.terracotta, target: '/onboarding/age' },
  { path: '/onboarding/besoins', name: 'Onboarding - Besoins', icon: 'heart', iconSet: 'feather', color: BASE.terracotta, target: '/onboarding/besoins' },
  { path: '/', name: 'Dashboard', icon: 'home', iconSet: 'feather', color: BASE.deepGreen, target: '/' },
  { path: '/parcours', name: 'Profil (SamaWér)', icon: 'user', iconSet: 'feather', color: BASE.copper, target: '/profil' },
  { path: '/chat', name: 'Chatbot Ndeysaan', icon: 'message-square', iconSet: 'feather', color: BASE.terracotta, target: '/chat' },
  { path: '/bibliotheque', name: 'Bibliothèque', icon: 'book-open', iconSet: 'feather', color: BASE.copper, target: '/bibliotheque' },
  { path: '/carte', name: 'Lieux de soin', icon: 'map-pin', iconSet: 'feather', color: BASE.deepGreen, target: '/carte' },
  { path: '/mon-contexte', name: 'Mon Contexte', icon: 'settings', iconSet: 'feather', color: BASE.terracotta, target: '/mon-contexte' },
  { path: '/communaute', name: 'Communauté (Liggéey)', icon: 'users', iconSet: 'feather', color: BASE.copper, target: '/communaute' },
  { path: '/calendrier', name: 'Calendrier', icon: 'calendar', iconSet: 'feather', color: BASE.deepGreen, target: '/calendrier' },
  { path: '/stats-sante', name: 'Statistiques Santé', icon: 'bar-chart-3', iconSet: 'feather', color: BASE.terracotta, target: '/suivi' },
  { path: '/suivi', name: 'Suivi Santé', icon: 'heart', iconSet: 'feather', color: BASE.copper, target: '/suivi' },
  { path: '/urgence', name: 'Urgence', icon: 'alert-circle', iconSet: 'feather', color: BASE.terracotta, target: '/urgence' },
  { path: '/journal', name: 'Journal Intime', icon: 'book', iconSet: 'feather', color: BASE.copper, target: '/suivi' },
  { path: '/medecins', name: 'Médecins', icon: 'user', iconSet: 'feather', color: BASE.deepGreen, target: '/medecins' },
  { path: '/faq', name: 'FAQ', icon: 'help-circle', iconSet: 'feather', color: BASE.terracotta, target: '/faq' },
  { path: '/a-propos', name: 'À propos', icon: 'file-text', iconSet: 'feather', color: BASE.copper, target: '/a-propos' },
  { path: '/orientation', name: 'Orientation', icon: 'target', iconSet: 'feather', color: BASE.deepGreen, target: '/orientation' },
  { path: '/glossaire', name: 'Glossaire', icon: 'book-open-page-variant-outline', iconSet: 'material', color: BASE.terracotta, target: '/bibliotheque' },
  { path: '/ressources', name: 'Ressources', icon: 'book-open', iconSet: 'feather', color: BASE.copper, target: '/ressources' },
  { path: '/tutoriel', name: 'Tutoriel', icon: 'help-circle', iconSet: 'feather', color: BASE.deepGreen, target: '/tutoriel' },
  { path: '/notifications', name: 'Notifications', icon: 'alert-circle', iconSet: 'feather', color: BASE.terracotta, target: '/notifications' },
];

function RouteIcon({
  iconSet,
  icon,
  color,
}: {
  iconSet: IconSet;
  icon: string;
  color: string;
}) {
  if (iconSet === 'ionicons') {
    return <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color={color} />;
  }

  if (iconSet === 'material') {
    return (
      <MaterialCommunityIcons
        name={icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
        size={20}
        color={color}
      />
    );
  }

  return <Feather name={icon as React.ComponentProps<typeof Feather>['name']} size={20} color={color} />;
}

export default function DevNavigationScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 760;
  const isMedium = width >= 540;
  const cardWidth = isTablet ? '48%' : isMedium ? '47.5%' : '100%';

  // Debug: Reset onboarding/splash state
  const handleResetState = async () => {
    try {
      await AsyncStorage.removeItem('splash_shown');
      await AsyncStorage.removeItem('samawer_state');
      // If you use other keys for onboarding, add them here
      // Reset in-memory flag if needed
      if (typeof markSplashAsShown === 'function') {
        // This will only mark as shown, so you may want to reload the app after clearing storage
      }
      // Optionally reload app or navigate to splash
      router.replace('/splash');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to reset onboarding/splash state', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>🔧 Navigation Développement</Text>
          <Text style={styles.subtitle}>SaxalWér - Toutes les pages de l&apos;application</Text>

          {/* Debug button to reset onboarding/splash state */}
          <Pressable
            onPress={handleResetState}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? '#B5622A' : '#E8DCC8',
                borderRadius: 10,
                padding: 14,
                marginBottom: 24,
                alignItems: 'center',
                borderWidth: 1.5,
                borderColor: '#B5622A',
              },
            ]}
          >
            <Text style={{ color: '#4A2F27', fontWeight: '700', fontSize: 15 }}>
              🧹 Réinitialiser Splash & Onboarding
            </Text>
            <Text style={{ color: '#B5622A', fontSize: 12, marginTop: 2 }}>
              (Pour revoir l&apos;accueil, le splash et l&apos;onboarding)
            </Text>
          </Pressable>

          <View style={styles.grid}>
            {routes.map((route) => (
              <Pressable
                key={route.path}
                onPress={() => router.push(route.target as never)}
                style={({ pressed }) => [
                  styles.card,
                  {
                    width: cardWidth,
                    borderColor: `${route.color}33`,
                    shadowColor: route.color,
                  },
                  pressed && {
                    borderColor: route.color,
                    transform: [{ translateY: -2 }],
                    shadowOpacity: 0.16,
                    elevation: 4,
                  },
                ]}
              >
                <View style={[styles.iconWrap, { backgroundColor: `${route.color}15` }]}>
                  <RouteIcon iconSet={route.iconSet} icon={route.icon} color={route.color} />
                </View>

                <View style={styles.cardTextBlock}>
                  <Text style={styles.cardTitle}>{route.name}</Text>
                  <Text style={styles.cardPath}>{route.path}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>💡 Note de développement</Text>
            <Text style={styles.noteText}>
              Cette page permet de naviguer rapidement entre toutes les pages de l&apos;application
              pendant le développement. Pour accéder à cette page, visitez{' '}
              <Text style={styles.noteStrong}>/dev</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 36,
  },
  container: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  title: {
    marginBottom: 12,
    color: BASE.deepGreen,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: Fonts.serif,
  },
  subtitle: {
    marginBottom: 40,
    color: BASE.cocoa,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.86,
    fontFamily: Fonts.sans,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: BASE.white,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0,
    shadowRadius: 12,
    elevation: 0,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTextBlock: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: BASE.deepGreen,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  cardPath: {
    color: BASE.cocoa,
    fontSize: 12,
    opacity: 0.7,
    fontFamily: Fonts.sans,
  },
  noteCard: {
    marginTop: 40,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: `${BASE.deepGreen}4D`,
    backgroundColor: `${BASE.deepGreen}10`,
  },
  noteTitle: {
    marginBottom: 8,
    color: BASE.deepGreen,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  noteText: {
    color: BASE.cocoa,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: Fonts.sans,
  },
  noteStrong: {
    color: BASE.deepGreen,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
});
