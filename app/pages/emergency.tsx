import { Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useApp } from '../../context/appcontext';

const COLORS = {
  beige: '#F5F1E6',
  white: '#FFFFFF',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  cocoa: '#4A2F27',
  red: '#B83227',
  border: '#E8DCCB',
};

const CONTACTS = [
  { name: 'SAMU National', number: '1515', tel: 'tel:1515' },
  { name: 'Sapeurs-pompiers', number: '18', tel: 'tel:18' },
  { name: 'Police secours', number: '17', tel: 'tel:17' },
];

export default function EmergencyScreen() {
  const router = useRouter();
  const { language } = useApp();
  const wo = language === 'wo';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Retour">
          <Feather name="chevron-left" size={22} color={COLORS.deepGreen} />
        </Pressable>

        <Text style={styles.eyebrow}>Urgence Sénégal</Text>
        <Text style={styles.title}>{wo ? 'Ndimbal bu gaaw' : 'Consulter sans attendre'}</Text>
        <Text style={styles.subtitle}>
          {wo
            ? 'Su la yaram jaaxalee walla xaalis bu metti amee, demal ci structure de santé bu gëna jege walla wooteel numéro urgence.'
            : 'En cas de danger immédiat ou de symptôme inquiétant, rends-toi dans la structure de santé la plus proche ou appelle un numéro d’urgence.'}
        </Text>

        <View style={styles.notice}>
          <Feather name="alert-triangle" size={20} color={COLORS.red} />
          <Text style={styles.noticeText}>SaxalWér fournit une information éducative et une orientation. L’application ne remplace pas une consultation médicale.</Text>
        </View>

        {CONTACTS.map((contact) => (
          <Pressable key={contact.number} style={styles.card} onPress={() => Linking.openURL(contact.tel)} accessibilityRole="button" accessibilityLabel={`Appeler ${contact.name}`}>
            <View>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.number}>{contact.number}</Text>
            </View>
            <View style={styles.callPill}>
              <Feather name="phone" size={16} color={COLORS.white} />
              <Text style={styles.callText}>{wo ? 'Woote' : 'Appeler'}</Text>
            </View>
          </Pressable>
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{wo ? 'Foo mën a dem' : 'Où consulter'}</Text>
          <Text style={styles.infoText}>Hôpitaux, centres de santé, postes de santé, maternités et services gynécologiques au Sénégal.</Text>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/carte' as never)}>
            <Feather name="map-pin" size={16} color={COLORS.deepGreen} />
            <Text style={styles.secondaryButtonText}>{wo ? 'Xool centres yi' : 'Voir les centres de santé'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.beige },
  content: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 44, gap: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8 },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', color: COLORS.terracotta },
  title: { fontSize: 32, lineHeight: 38, fontWeight: '800', color: COLORS.deepGreen },
  subtitle: { fontSize: 15, lineHeight: 23, color: COLORS.cocoa },
  notice: { flexDirection: 'row', gap: 12, borderRadius: 20, padding: 16, backgroundColor: '#FFF1E7', borderWidth: 1, borderColor: 'rgba(184,50,39,0.18)' },
  noticeText: { flex: 1, fontSize: 13.5, lineHeight: 20, color: COLORS.cocoa },
  card: { borderRadius: 22, padding: 18, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  contactName: { fontSize: 18, fontWeight: '800', color: COLORS.deepGreen },
  number: { fontSize: 30, lineHeight: 36, fontWeight: '900', color: COLORS.red, letterSpacing: 0.5 },
  callPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: COLORS.red },
  callText: { color: COLORS.white, fontWeight: '800', fontSize: 13 },
  infoCard: { borderRadius: 22, padding: 18, backgroundColor: '#FFF9F1', borderWidth: 1, borderColor: COLORS.border, gap: 10 },
  infoTitle: { fontSize: 19, fontWeight: '800', color: COLORS.deepGreen },
  infoText: { fontSize: 14, lineHeight: 22, color: COLORS.cocoa },
  secondaryButton: { marginTop: 8, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 14, paddingVertical: 12, backgroundColor: '#EEF3F0', borderWidth: 1, borderColor: 'rgba(26,60,52,0.14)' },
  secondaryButtonText: { fontSize: 14, fontWeight: '800', color: COLORS.deepGreen },
});
