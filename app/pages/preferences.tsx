import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';

import ExperienceModeToggle from '../../components/ExperienceModeToggle';
import { useApp } from '../../context/appcontext';

const COLORS = {
  beige: '#F5F1E6',
  card: '#FFF9F1',
  white: '#FFFFFF',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  border: '#E8DCCB',
};

export default function PreferencesScreen() {
  const router = useRouter();
  const { discreteMode, toggleDiscreteMode } = useApp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <Feather name="arrow-left" size={18} color={COLORS.deepGreen} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Préférences</Text>
            <Text style={styles.title}>Mon expérience</Text>
            <Text style={styles.subtitle}>
              Tu peux changer ces réglages à tout moment. Ils restent sur ton appareil.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Mode d&apos;expérience</Text>
        <ExperienceModeToggle />

        <Text style={styles.sectionLabel}>Confidentialité</Text>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Mode discret</Text>
            <Text style={styles.rowHint}>
              Masque les contenus sensibles et neutralise les titres des rubriques.
            </Text>
          </View>
          <Switch
            value={discreteMode}
            onValueChange={toggleDiscreteMode}
            trackColor={{ false: '#D8CDBC', true: COLORS.deepGreen }}
            thumbColor={COLORS.white}
          />
        </View>

        <Pressable
          onPress={() => router.push('/profil-numerique' as any)}
          style={({ pressed }) => [styles.linkCard, pressed && styles.pressed]}
        >
          <Feather name="bar-chart-2" size={18} color={COLORS.deepGreen} />
          <Text style={styles.linkText}>Mon profil numérique & socio-culturel</Text>
          <Feather name="chevron-right" size={18} color={COLORS.copper} />
        </Pressable>

        <Pressable
          onPress={() => router.push('/legal' as any)}
          style={({ pressed }) => [styles.linkCard, pressed && styles.pressed]}
        >
          <Feather name="file-text" size={18} color={COLORS.deepGreen} />
          <Text style={styles.linkText}>Informations légales</Text>
          <Feather name="chevron-right" size={18} color={COLORS.copper} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.beige },
  content: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 40, gap: 14 },
  header: { gap: 16 },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerText: { gap: 8 },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLORS.terracotta,
  },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700', color: COLORS.deepGreen },
  subtitle: { fontSize: 14, lineHeight: 22, color: COLORS.cocoa },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.deepGreen, marginTop: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rowText: { flex: 1, gap: 4 },
  rowTitle: { fontSize: 15, fontWeight: '700', color: COLORS.deepGreen },
  rowHint: { fontSize: 12, lineHeight: 17, color: COLORS.cocoa },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  linkText: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.deepGreen },
  pressed: { opacity: 0.85 },
});
