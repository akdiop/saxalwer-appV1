import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const COLORS = {
  card: '#FFF1E7',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  cocoa: '#4A2F27',
  border: 'rgba(181,98,42,0.2)',
};

type Props = {
  compact?: boolean;
  language?: 'fr' | 'wo';
};

export default function MedicalDisclaimer({ compact = false, language = 'fr' }: Props) {
  const wo = language === 'wo';

  return (
    <View style={[styles.card, compact && styles.compact]}>
      <Ionicons name="information-circle-outline" size={18} color={COLORS.terracotta} />
      <View style={styles.textWrap}>
        <Text style={styles.title}>{wo ? 'Xibaar rekk' : 'Information éducative'}</Text>
        <Text style={styles.text}>
          {wo
            ? 'SaxalWér dafay joxe xibaar ak yoonu orientation. Du wuutu ndimbal professionnel de santé. Su amee urgence, demal ci structure de santé bu gëna jege.'
            : 'SaxalWér fournit une information éducative et une orientation générale. La plateforme ne remplace pas une consultation. En cas d’urgence, consulte immédiatement une structure de santé.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 18,
    padding: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  compact: {
    padding: 12,
    borderRadius: 16,
  },
  textWrap: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.deepGreen,
  },
  text: {
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.cocoa,
  },
});
