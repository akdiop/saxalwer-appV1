
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const C = {
  deepGreen: '#0F3D2E',
  beige: '#F5F1E6',
  terracotta: '#C26A3D',
  cocoa: '#4A2F27',
  white: '#FDFAF5',
};

export default function ConsentScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable style={styles.headerBtn} onPress={() => {}}>
          <Feather name="chevron-left" size={20} color={C.beige} />
        </Pressable>
        <Text style={styles.headerTitle}>Consentement & Confidentialité</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Ton consentement, ta sécurité</Text>
        <Text style={styles.paragraph}>
          Chez SAXALWÉR, ta vie privée est notre priorité. Toutes les informations que tu partages sont strictement confidentielles et utilisées uniquement pour t’offrir la meilleure expérience possible.
        </Text>
        <Text style={styles.sectionTitle}>Pourquoi demander ton consentement ?</Text>
        <Text style={styles.paragraph}>
          Nous recueillons certaines données pour :
          {'\n'}• Personnaliser ton parcours
          {'\n'}• Améliorer nos services
          {'\n'}• Garantir la sécurité de tes informations
        </Text>
        <Text style={styles.sectionTitle}>Tes droits</Text>
        <Text style={styles.paragraph}>
          Tu peux à tout moment :
          {'\n'}• Accéder à tes données
          {'\n'}• Demander leur suppression
          {'\n'}• Modifier tes préférences
        </Text>
        <Text style={styles.sectionTitle}>Notre engagement</Text>
        <Text style={styles.paragraph}>
          Nous ne partageons jamais tes données avec des tiers sans ton accord explicite. Ton anonymat est garanti.
        </Text>
        <View style={styles.ctaRow}>
          <Pressable style={styles.ctaBtn} onPress={() => {}}>
            <Text style={styles.ctaBtnText}>J’ai compris et je continue</Text>
            <Feather name="arrow-right" size={18} color={C.beige} style={{ marginLeft: 8 }} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.beige },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.deepGreen, padding: 16, paddingTop: Platform.OS === 'ios' ? 48 : 24, gap: 12 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  headerTitle: { color: C.beige, fontWeight: '700', fontSize: 18, letterSpacing: 0.2, flex: 1 },
  scroll: { flex: 1, backgroundColor: 'transparent', paddingHorizontal: 18, paddingTop: 18 },
  title: { fontSize: 20, fontWeight: '700', color: C.deepGreen, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: C.terracotta, marginTop: 18, marginBottom: 6 },
  paragraph: { fontSize: 15, color: C.cocoa, marginBottom: 8, lineHeight: 22 },
  ctaRow: { alignItems: 'center', marginTop: 32 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.deepGreen, borderRadius: 99, paddingVertical: 12, paddingHorizontal: 28 },
  ctaBtnText: { color: C.beige, fontWeight: '700', fontSize: 15, letterSpacing: 0.2 },
});
