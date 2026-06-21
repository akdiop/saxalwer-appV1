import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useApp } from '../../context/appcontext';
import { LEGAL_DOCUMENTS, type LegalDocument } from '../../data/legalContent';

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

const HEADER = {
  fr: { eyebrow: 'Informations légales', back: 'Retour' },
  wo: { eyebrow: 'Xibaar yu yoon', back: 'Dellusi' },
} as const;

export default function LegalScreen() {
  const router = useRouter();
  const { language } = useApp();
  const head = HEADER[language === 'wo' ? 'wo' : 'fr'];

  const [activeSlug, setActiveSlug] = React.useState<LegalDocument['slug']>(
    'avertissement-medical'
  );
  const activeDoc =
    LEGAL_DOCUMENTS.find((d) => d.slug === activeSlug) ?? LEGAL_DOCUMENTS[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={head.back}
          >
            <Ionicons name="arrow-back" size={18} color={COLORS.deepGreen} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>{head.eyebrow}</Text>
            <Text style={styles.title}>{activeDoc.title}</Text>
            <Text style={styles.subtitle}>{activeDoc.updated}</Text>
          </View>
        </View>

        {/* Sélecteur des 4 documents */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {LEGAL_DOCUMENTS.map((doc) => {
            const active = doc.slug === activeSlug;
            return (
              <Pressable
                key={doc.slug}
                onPress={() => setActiveSlug(doc.slug)}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{doc.title}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.notePill}>
          <Ionicons name="information-circle-outline" size={14} color={COLORS.terracotta} />
          <Text style={styles.noteText}>
            Version de travail — à valider par un conseil juridique.
          </Text>
        </View>

        <View style={styles.sectionList}>
          {activeDoc.sections.map((section) => (
            <View key={section.heading} style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{section.heading}</Text>
              <Text style={styles.sectionBody}>{section.body}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>www.saxalwer.com · contact@saxalwer.com</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.beige },
  content: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 36, gap: 16 },
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
  title: { fontSize: 27, lineHeight: 33, fontWeight: '700', color: COLORS.deepGreen },
  subtitle: { fontSize: 13, lineHeight: 20, color: COLORS.cocoa },
  tabsRow: { gap: 8, paddingVertical: 2, paddingRight: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.deepGreen, borderColor: COLORS.deepGreen },
  tabText: { fontSize: 12, fontWeight: '600', color: COLORS.cocoa },
  tabTextActive: { color: COLORS.white },
  notePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF1E7',
  },
  noteText: { fontSize: 12, fontWeight: '600', color: COLORS.terracotta },
  sectionList: { gap: 12 },
  sectionCard: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.deepGreen },
  sectionBody: { fontSize: 14, lineHeight: 21, color: COLORS.cocoa },
  footer: { fontSize: 12, color: COLORS.terracotta, textAlign: 'center', marginTop: 8 },
  pressed: { opacity: 0.85 },
});
