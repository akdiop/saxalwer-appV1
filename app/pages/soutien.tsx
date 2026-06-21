import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Linking,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import SensitiveContent from '../../components/SensitiveContent';
import { useApp } from '../../context/appcontext';
import { SUPPORT_ARTICLES, VBG_EMERGENCY } from '../../data/vbgContent';

const COLORS = {
  beige: '#F5F1E6',
  card: '#FFF9F1',
  white: '#FFFFFF',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  border: '#E8DCCB',
  red: '#B23A2E',
};

export default function SoutienScreen() {
  const router = useRouter();
  const { language, discreteMode } = useApp();
  const wo = language === 'wo';

  const call = (tel: string) => {
    Linking.openURL(`tel:${tel}`).catch(() => {});
  };

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
            <Text style={styles.eyebrow}>Soutien & écoute</Text>
            <Text style={styles.title}>Tu n&apos;es pas seule</Text>
            <Text style={styles.subtitle}>
              Information, écoute et orientation, en toute confidentialité. SaxalWér ne juge pas
              et ne remplace pas une professionnelle de santé.
            </Text>
          </View>
        </View>

        {/* Bloc urgence VBG */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHead}>
            <Feather name="alert-triangle" size={18} color={COLORS.red} />
            <Text style={styles.emergencyTitle}>En cas de danger immédiat</Text>
          </View>
          <Text style={styles.emergencyIntro}>{VBG_EMERGENCY.intro}</Text>
          <View style={styles.callRow}>
            {VBG_EMERGENCY.numbers.map((n) => (
              <Pressable
                key={n.tel}
                onPress={() => call(n.tel)}
                style={({ pressed }) => [styles.callBtn, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`Appeler ${n.label} ${n.tel}`}
              >
                <Feather name="phone" size={14} color={COLORS.white} />
                <Text style={styles.callLabel}>{n.label}</Text>
                <Text style={styles.callTel}>{n.tel}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.emergencyNote}>{VBG_EMERGENCY.note}</Text>
        </View>

        {/* Articles VBG + soutien psychologique */}
        <View style={styles.list}>
          {SUPPORT_ARTICLES.map((a) => {
            const masked = discreteMode && a.sensitivity !== 'ouvert';
            return (
              <View key={a.id} style={styles.articleCard}>
                <View style={styles.tagRow}>
                  <View style={styles.catTag}>
                    <Text style={styles.catTagText}>{a.category}</Text>
                  </View>
                  {a.audioPlanned ? (
                    <View style={styles.audioTag}>
                      <Feather name="headphones" size={11} color={COLORS.copper} />
                      <Text style={styles.audioTagText}>Audio à venir</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.articleTitle}>{wo && a.titleWo ? a.titleWo : a.title}</Text>
                <Text style={styles.articleSummary}>{a.summary}</Text>

                <SensitiveContent masked={masked} label="Contenu sensible — appuie pour afficher">
                  <Text style={styles.articleBody}>{a.content}</Text>
                </SensitiveContent>

                <View style={styles.disclaimerBox}>
                  <Feather name="info" size={12} color={COLORS.terracotta} />
                  <Text style={styles.disclaimerText}>{a.disclaimer}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable
          onPress={() => router.push('/annuaire' as any)}
          style={({ pressed }) => [styles.linkCard, pressed && styles.pressed]}
        >
          <Feather name="list" size={18} color={COLORS.deepGreen} />
          <Text style={styles.linkText}>
            Voir l&apos;annuaire — volets Psychologue et Soutien VBG
          </Text>
          <Feather name="chevron-right" size={18} color={COLORS.copper} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.beige },
  content: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 40, gap: 18 },
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

  emergencyCard: {
    backgroundColor: '#FBEDEA',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0D2CC',
    gap: 12,
  },
  emergencyHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emergencyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.red },
  emergencyIntro: { fontSize: 13, lineHeight: 20, color: COLORS.cocoa },
  callRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.red,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
  },
  callLabel: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  callTel: { color: COLORS.white, fontSize: 12, fontWeight: '800' },
  emergencyNote: { fontSize: 11, lineHeight: 16, color: COLORS.terracotta, fontStyle: 'italic' },

  list: { gap: 14 },
  articleCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  catTag: {
    backgroundColor: 'rgba(26,60,52,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  catTagText: { fontSize: 11, fontWeight: '700', color: COLORS.deepGreen },
  audioTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  audioTagText: { fontSize: 11, fontWeight: '600', color: COLORS.copper },
  articleTitle: { fontSize: 17, fontWeight: '700', color: COLORS.deepGreen, lineHeight: 23 },
  articleSummary: { fontSize: 13, lineHeight: 20, color: COLORS.terracotta },
  articleBody: { fontSize: 14, lineHeight: 22, color: COLORS.cocoa },
  disclaimerBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: COLORS.beige,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.copper,
    borderRadius: 10,
    padding: 12,
  },
  disclaimerText: { flex: 1, fontSize: 11, lineHeight: 16, color: COLORS.cocoa },

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
