import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

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

const legalBlocks = [
  {
    title: 'Avertissement médical',
    icon: 'medkit-outline' as const,
    paragraphs: [
      'SaxalWér est une plateforme adaptative, culturellement sensible, d’éducation et d’orientation en santé sexuelle et reproductive.',
      'SaxalWér n’est pas un outil médical. L’application ne pose pas de diagnostic, ne prescrit aucun traitement, ne remplace pas une consultation et ne fournit pas d’avis médical personnalisé.',
    ],
    bullets: [
      'Douleur abdominale ou pelvienne intense ou soudaine.',
      'Saignement abondant ou hémorragie.',
      'Malaise, perte de conscience ou vertiges importants.',
      'Fièvre élevée persistante.',
      'Grossesse avec saignement, douleur ou fièvre.',
      'Violence physique ou sexuelle récente.',
      'Pensées suicidaires ou détresse psychologique grave.',
    ],
  },
  {
    title: 'Numéros utiles au Sénégal',
    icon: 'call-outline' as const,
    paragraphs: ['En cas d’urgence vitale au Sénégal, contacte immédiatement les services compétents ou rends-toi dans la structure de santé la plus proche.'],
    bullets: ['SAMU National : 1515.', 'Sapeurs-pompiers : 18.', 'Police secours : 17.'],
  },
  {
    title: 'Conditions générales d’utilisation',
    icon: 'document-text-outline' as const,
    paragraphs: [
      'SaxalWér est un service numérique d’information, de sensibilisation et d’orientation concernant la santé des femmes et la santé sexuelle et reproductive.',
      'L’accès est gratuit, hors coûts éventuels de connexion internet. Les fonctionnalités peuvent évoluer pendant la phase de prototypage et de tests.',
      'La plateforme s’adresse aux utilisatrices à partir de 13 ans. Une protection renforcée s’applique aux mineures, notamment pour les tests ou activités de recherche.',
    ],
  },
  {
    title: 'Politique de confidentialité',
    icon: 'shield-checkmark-outline' as const,
    paragraphs: [
      'SaxalWér respecte les principes de licéité, transparence, minimisation des données, sécurité et limitation de la conservation.',
      'Le site public ne collecte pas de données de santé nominatives via ses formulaires. Aucune donnée de santé sensible ou nominative ne doit être collectée sans consentement explicite.',
      'Les données personnelles ne sont jamais vendues, louées ou cédées à des annonceurs ou partenaires commerciaux.',
      'Les demandes relatives aux données peuvent être adressées à contact@saxalwer.com.',
    ],
  },
  {
    title: 'Mentions légales et propriété intellectuelle',
    icon: 'business-outline' as const,
    paragraphs: [
      'Le site www.saxalwer.com est édité par SaxalWér, initiative de santé numérique basée à Dakar, Sénégal, portée par Aïdalaye Diop.',
      'Les contenus, textes, images, logos, code source, identité graphique, bases de données et architecture éditoriale sont protégés par le droit de la propriété intellectuelle.',
      'Les présentes mentions sont régies par le droit sénégalais. Tout litige relatif à l’utilisation du site relève de la compétence des juridictions sénégalaises.',
    ],
  },
];

export default function LegalScreen() {
  const router = useRouter();
  const { language } = useApp();
  const wo = language === 'wo';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()} accessibilityRole="button">
          <Ionicons name="chevron-back" size={18} color={COLORS.deepGreen} />
          <Text style={styles.backText}>{wo ? 'Delluwaat' : 'Retour'}</Text>
        </Pressable>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>SAXALWÉR · CADRE DE CONFIANCE</Text>
          <Text style={styles.title}>Documents juridiques et médicaux</Text>
          <Text style={styles.subtitle}>
            {wo
              ? 'Xibaar yii dañu leen jagleel ngir leeral ni SaxalWér di doxe ak ni say données di aar.'
              : 'Cette page rassemble les informations essentielles à intégrer dans l’application : usage responsable, confidentialité, limites médicales, urgence et droit applicable.'}
          </Text>
        </View>

        <View style={styles.notice}>
          <Ionicons name="alert-circle-outline" size={20} color={COLORS.terracotta} />
          <Text style={styles.noticeText}>
            Version de travail — Juin 2026. Ces éléments doivent être relus et validés par un conseil juridique avant usage définitif.
          </Text>
        </View>

        {legalBlocks.map((block) => (
          <View key={block.title} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconRound}>
                <Ionicons name={block.icon} size={20} color={COLORS.terracotta} />
              </View>
              <Text style={styles.cardTitle}>{block.title}</Text>
            </View>
            {block.paragraphs.map((paragraph) => (
              <Text key={paragraph} style={styles.paragraph}>{paragraph}</Text>
            ))}
            {block.bullets?.map((bullet) => (
              <View key={bullet} style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Contact — contact@saxalwer.com</Text>
          <Text style={styles.footerText}>Site — www.saxalwer.com</Text>
          <Text style={styles.footerText}>Dakar, Sénégal</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.beige },
  container: { padding: 20, paddingBottom: 54 },
  backButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, backgroundColor: COLORS.white, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  backText: { color: COLORS.deepGreen, fontWeight: '700' },
  hero: { backgroundColor: COLORS.card, borderRadius: 28, padding: 22, borderWidth: 1, borderColor: COLORS.border, marginBottom: 14 },
  eyebrow: { color: COLORS.copper, fontSize: 11, letterSpacing: 1.8, fontWeight: '800', marginBottom: 10 },
  title: { color: COLORS.deepGreen, fontSize: 28, lineHeight: 34, fontWeight: '900', marginBottom: 10 },
  subtitle: { color: COLORS.cocoa, fontSize: 14.5, lineHeight: 22 },
  notice: { flexDirection: 'row', gap: 10, backgroundColor: '#FFF1E7', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(181,98,42,0.2)', marginBottom: 14 },
  noticeText: { flex: 1, color: COLORS.cocoa, fontSize: 13, lineHeight: 19 },
  card: { backgroundColor: COLORS.white, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: COLORS.border, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  iconRound: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF1E7', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { flex: 1, color: COLORS.deepGreen, fontSize: 18, fontWeight: '900' },
  paragraph: { color: COLORS.cocoa, fontSize: 14, lineHeight: 21, marginBottom: 10 },
  bulletRow: { flexDirection: 'row', gap: 9, alignItems: 'flex-start', marginBottom: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.terracotta, marginTop: 7 },
  bulletText: { flex: 1, color: COLORS.cocoa, fontSize: 13.5, lineHeight: 20 },
  footer: { alignItems: 'center', gap: 3, marginTop: 8 },
  footerText: { color: COLORS.cocoa, fontSize: 12.5 },
});
