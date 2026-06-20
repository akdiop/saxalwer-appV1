import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useApp } from '../../context/appcontext';

const COLORS = {
  beige: '#F5F1E6',
  card: '#FFF9F1',
  white: '#FFFFFF',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  cocoa: '#4A2F27',
  border: '#E8DCCB',
};

const COPY = {
  fr: {
    eyebrow: 'Informations legales',
    title: 'CGU et confidentialite',
    subtitle:
      "Ces informations expliquent simplement comment Saxalwer fonctionne, protege tes donnees et encadre l'utilisation de l'application.",
    back: 'Retour',
    note: 'Version resumee avant entree dans l espace',
    sections: [
      {
        icon: 'document-text-outline',
        title: "Conditions d'utilisation",
        body:
          "Saxalwer propose des contenus d'information, d'orientation et d'accompagnement. L'application ne remplace pas une consultation medicale, un diagnostic ou un traitement.",
      },
      {
        icon: 'shield-checkmark-outline',
        title: 'Confidentialite',
        body:
          "Tes informations servent uniquement a personnaliser ton experience dans l'application. Elles ne sont pas revendues et ne sont pas partagees sans ton accord explicite.",
      },
      {
        icon: 'phone-portrait-outline',
        title: 'Stockage local',
        body:
          "Les donnees de demonstration et de parcours sont conservees principalement sur cet appareil. Tu peux les consulter, les modifier ou les effacer depuis ton espace profil.",
      },
      {
        icon: 'medkit-outline',
        title: 'Limites medicales',
        body:
          "En cas d'urgence, de douleur intense, de saignement important ou de doute clinique, il faut consulter une professionnelle de sante ou un service d'urgence.",
      },
    ],
  },
  wo: {
    eyebrow: 'Xibaar yu yoon',
    title: 'CGU ak sutura',
    subtitle:
      'Xibaar yii dafay leeral ni Saxalwer di doxee, ni mu di aar sa donnees ak ni ngay jefandikoo app bi.',
    back: 'Dellusi',
    note: 'Version bu gatt bala ngay dugg ci espace bi',
    sections: [
      {
        icon: 'document-text-outline',
        title: 'Sartu jefandikoo',
        body:
          "Saxalwer dafay joxe xibaar, jubbanti ak àndale. App bi du wuutu set-setalu doktoor, diagnostic walla faj.",
      },
      {
        icon: 'shield-checkmark-outline',
        title: 'Sutura',
        body:
          'Sa xibaar yi dañuy jariñ rekk ngir defar sa experience ci app bi. Duñu ko jaay te duñu ko bokk ak kenn ku dul sa nangu bu leer.',
      },
      {
        icon: 'phone-portrait-outline',
        title: 'Denc ci telefon bi',
        body:
          'Donnees yi ak yoonu jefandikoo yi dañuy des ci appareil bii ci lu ëpp. Mën nga leen gis, soppi walla far ci sa espace profil.',
      },
      {
        icon: 'medkit-outline',
        title: 'Mbiri wergu-yaram',
        body:
          'Su amee urgence, metit bu tar, deret bu bari walla benn xel mu la jaaxal, war nga laaj liggeykat wergu-yaram walla urgence.',
      },
    ],
  },
} as const;

export default function LegalScreen() {
  const router = useRouter();
  const { language } = useApp();
  const copy = COPY[language === 'wo' ? 'wo' : 'fr'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={copy.back}
          >
            <Ionicons name="arrow-back" size={18} color={COLORS.deepGreen} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>{copy.eyebrow}</Text>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
          </View>
        </View>

        <View style={styles.notePill}>
          <Ionicons name="information-circle-outline" size={14} color={COLORS.terracotta} />
          <Text style={styles.noteText}>{copy.note}</Text>
        </View>

        <View style={styles.sectionList}>
          {copy.sections.map((section) => (
            <View key={section.title} style={styles.sectionCard}>
              <View style={styles.sectionIcon}>
                <Ionicons name={section.icon} size={18} color={COLORS.terracotta} />
              </View>
              <View style={styles.sectionTextWrap}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionBody}>{section.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.beige,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 36,
    gap: 18,
  },
  header: {
    gap: 16,
  },
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
  headerText: {
    gap: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLORS.terracotta,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: COLORS.deepGreen,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.cocoa,
  },
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
  noteText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.terracotta,
  },
  sectionList: {
    gap: 12,
  },
  sectionCard: {
    flexDirection: 'row',
    gap: 14,
    borderRadius: 22,
    padding: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  sectionTextWrap: {
    flex: 1,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.deepGreen,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.cocoa,
  },
  pressed: {
    opacity: 0.85,
  },
});
