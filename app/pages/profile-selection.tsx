import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';

const PROFILES = [
  {
    id: 'adolescente',
    label: 'Adolescente',
    description: 'Un espace clair et rassurant pour comprendre ton corps.',
  },
  {
    id: 'jeune-femme',
    label: 'Jeune femme',
    description: 'Des ressources adaptées à ton cycle, ta santé et tes besoins.',
  },
  {
    id: 'maman',
    label: 'Maman / future maman',
    description: 'Un accompagnement doux pour ta santé et ton bien-être.',
  },
];

export default function ProfileSelectionScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        <View style={styles.header}>
          <Text style={styles.title}>Choisis ton espace</Text>
          <Text style={styles.subtitle}>
            SaxalWér s&apos;adapte à ton profil pour t&apos;offrir une expérience plus adaptée, plus douce et plus utile.
          </Text>
        </View>

        <View style={styles.cards}>
          {PROFILES.map((profile) => {
            const isSelected = selected === profile.id;
            return (
              <Pressable
                key={profile.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelected(profile.id)}
                accessibilityRole="button"
              >
                <View style={[styles.indicator, isSelected && styles.indicatorSelected]} />
                <View style={styles.cardContent}>
                  <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                    {profile.label}
                  </Text>
                  <Text style={[styles.cardDescription, isSelected && styles.cardDescriptionSelected]}>
                    {profile.description}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            !selected && styles.primaryBtnDisabled,
            pressed && !!selected && styles.btnPressed,
          ]}
          onPress={() => {
            if (selected) router.push('/' as never);
          }}
          disabled={!selected}
          accessibilityRole="button"
        >
          <Text style={[styles.primaryBtnText, !selected && styles.primaryBtnTextDisabled]}>
            Continuer
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F1E6',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 32,
  },

  header: {
    marginBottom: 40,
    gap: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1A3C34',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 15,
    color: '#4A2F27',
    lineHeight: 24,
    opacity: 0.8,
  },

  cards: {
    gap: 16,
    marginBottom: 44,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#E8E0D0',
    shadowColor: '#1A3C34',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  cardSelected: {
    borderColor: '#1A3C34',
    backgroundColor: '#F0F5F3',
    shadowOpacity: 0.1,
  },
  indicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#4A2F2740',
    marginTop: 2,
  },
  indicatorSelected: {
    borderColor: '#1A3C34',
    backgroundColor: '#1A3C34',
  },
  cardContent: {
    flex: 1,
    gap: 6,
  },
  cardLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#4A2F27',
    letterSpacing: 0.2,
  },
  cardLabelSelected: {
    color: '#1A3C34',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4A2F27',
    lineHeight: 20,
    opacity: 0.7,
  },
  cardDescriptionSelected: {
    opacity: 0.9,
  },

  primaryBtn: {
    height: 56,
    backgroundColor: '#1A3C34',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A3C34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryBtnDisabled: {
    backgroundColor: '#4A2F2720',
    shadowOpacity: 0,
    elevation: 0,
  },
  btnPressed: {
    opacity: 0.85,
  },
  primaryBtnText: {
    color: '#F5F1E6',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  primaryBtnTextDisabled: {
    color: '#4A2F2760',
  },
});
