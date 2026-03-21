
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const C = {
  deepGreen: '#0F3D2E',
  beige: '#F5F1E6',
  terracotta: '#C26A3D',
  cocoa: '#4A2F27',
  white: '#FDFAF5',
};

export default function ContextualPersonalization() {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable style={styles.headerBtn} onPress={() => {}}>
          <Feather name="chevron-left" size={20} color={C.beige} />
        </Pressable>
        <Text style={styles.headerTitle}>Personnalisation contextuelle</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Un parcours qui s’adapte à toi</Text>
        <Text style={styles.paragraph}>
          SAXALWÉR personnalise ton expérience selon tes besoins, ton âge, et tes objectifs. Plus tu renseignes d’informations, plus l’application pourra t’accompagner de façon pertinente et bienveillante.
        </Text>
        <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
        <Text style={styles.paragraph}>
          • Tu renseignes tes préférences et besoins lors de l’onboarding ou dans ton profil.
          {'\n'}• L’application adapte les contenus, conseils et rappels à ta situation.
          {'\n'}• Tu restes libre de modifier tes choix à tout moment.
        </Text>
        <Text style={styles.sectionTitle}>Confidentialité</Text>
        <Text style={styles.paragraph}>
          Toutes tes données sont confidentielles et utilisées uniquement pour améliorer ton expérience. Tu peux consulter ou supprimer tes informations à tout moment.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.beige },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.deepGreen, padding: 16, paddingTop: Platform.OS === 'ios' ? 48 : 24, gap: 12 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  headerTitle: { color: C.beige, fontWeight: '700', fontSize: 18, letterSpacing: 0.2, flex: 1 },
  content: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: '700', color: C.deepGreen, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: C.terracotta, marginTop: 18, marginBottom: 6 },
  paragraph: { fontSize: 15, color: C.cocoa, marginBottom: 8, lineHeight: 22 },
});
