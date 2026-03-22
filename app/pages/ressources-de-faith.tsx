import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useProfileMock } from '../../context/ProfileMockContext';

const BASE = {
  beige: '#F5F1E6',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  gold: '#D4AF37',
};

type FaithType = 'christianity' | 'islam' | 'universal';

type FaithResource = {
  id: string;
  titleFr: string;
  titleWo: string;
  contentFr: string;
  contentWo: string;
  faith: FaithType;
  icon: 'heart' | 'moon' | 'sparkles' | 'star' | 'users';
  color: string;
  category: string;
};

const FAITH_RESOURCES: FaithResource[] = [
  {
    id: 'christian-fertility',
    titleFr: 'Christianisme et Fertilite',
    titleWo: 'Kersa-yalla ak Fertilite',
    contentFr:
      "La fertilite est vue comme un don de Dieu. La Bible parle d'ouverture a la vie. Il est important de dialoguer avec ton conjoint et avec des conseillers spirituels de confiance pour naviguer les questions de planification familiale dans la foi.",
    contentWo:
      'Fertilite mooy baro bu Yalla jox. Bible bi wax na ci ubbeeku dund. Am na solo ci waxale ak sa jekkar ak conseils bu Yalla ci sunu yoon bu njeg.',
    faith: 'christianity',
    icon: 'heart',
    color: '#7A8C5A',
    category: 'Fertilite & Contraception',
  },
  {
    id: 'islam-fertility',
    titleFr: 'Islam et Planification Familiale',
    titleWo: 'Islam ak Planification familiale',
    contentFr:
      "L'Islam permet la planification familiale pour proteger la sante de la mere et de la famille. Le Prophete (PSL) a autorise l'espacement des naissances. Consulte un imam ou un savant de confiance pour des avis adaptes a ta situation.",
    contentWo:
      'Islam dafa yamal planification familiale ngir kaarange weru yaay ak ndey. Prophete (PSL) yamal na espacement ci doom yi. Jel Imam wala kenn ku xam Koran ngir gis tey wu la jem.',
    faith: 'islam',
    icon: 'moon',
    color: '#1A3C34',
    category: 'Fertilite & Contraception',
  },
  {
    id: 'christian-pregnancy',
    titleFr: 'Christianisme et Grossesse',
    titleWo: 'Kersa-yalla ak Gatt',
    contentFr:
      "La grossesse est un moment sacre. Prier, demander conseil aupres de ta communaute chretienne et prendre soin de ton corps et de ton bebe sont essentiels. Dieu t'accompagne a chaque etape.",
    contentWo:
      'Gatt mooy jamano bu tann. Takusaan, jel conseil ci sa communaute chretienne ak tangal sa yaram ak sa doom dagnu am solo. Yalla nekk na ci yaw ci jamano bu nekk.',
    faith: 'christianity',
    icon: 'heart',
    color: '#B5622A',
    category: 'Grossesse',
  },
  {
    id: 'islam-pregnancy',
    titleFr: 'Islam et Maternite',
    titleWo: 'Islam ak Maternite',
    contentFr:
      "Le Coran honore les meres et les femmes enceintes. L'allaitement est encourage jusqu'a 2 ans si possible. La periode post-partum (Nifas) a des regles specifiques : demande conseil a un savant.",
    contentWo:
      'Coran bi rafet na yaay yi ak jigeen yi mu gatt. Allaitement bi dagnu ko digal ba naar at su men. Post-partum (Nifas) am na leer yu bokk : jel xetu ci expert bu Coran.',
    faith: 'islam',
    icon: 'moon',
    color: '#D4AF37',
    category: 'Grossesse & Post-partum',
  },
  {
    id: 'christian-body',
    titleFr: 'Christianisme et Soins du Corps',
    titleWo: 'Kersa-yalla ak Tangal yaram',
    contentFr:
      "Ton corps est un temple du Saint-Esprit (1 Cor 6:19). Prendre soin de ta sante reproductive est un acte de respect envers toi-meme et envers Dieu. Ne neglige jamais ton bien-etre.",
    contentWo:
      'Sa yaram mooy ker gu Saint-Esprit (1 Cor 6:19). Tangal sa weru yaram mooy boole bu rafetal sa bopp ak Yalla. Bul feey sa weru boppam.',
    faith: 'christianity',
    icon: 'sparkles',
    color: '#A65D40',
    category: 'Bien-etre',
  },
  {
    id: 'islam-body',
    titleFr: 'Islam et Sante Corporelle',
    titleWo: 'Islam ak Weru yaram',
    contentFr:
      "Le Prophete (PSL) a dit : \"Ton corps a un droit sur toi\". Proteger ta sante est une obligation religieuse. Le depistage, la contraception, et le soin de soi ne sont pas contraires a l'Islam.",
    contentWo:
      'Prophete (PSL) ko wax : "Sa yaram am na jamono ci yaw". Kaarange sa weru yaram mooy buro ci islam. Depistage, contraception, ak tangal bopp dagnu xamul ci Islam.',
    faith: 'islam',
    icon: 'star',
    color: '#4A2F27',
    category: 'Bien-etre',
  },
  {
    id: 'universal-compassion',
    titleFr: 'Toutes confessions : Compassion envers soi',
    titleWo: 'Yepp : Nob ci sa bopp',
    contentFr:
      "Quelle que soit ta foi, tu merites compassion, dignite et acces aux soins de sante. Ta spiritualite peut etre une force dans ton parcours de sante. Tu n'es jamais seule.",
    contentWo:
      'Kon ngir sa gem, am nga jamono ci nob, dignite ak soxla ci weru yaram. Sa gem-gem ci Yalla men na dimbali la ci sa yoon bu wer. Amula benn ci sa biir.',
    faith: 'universal',
    icon: 'users',
    color: '#7A8C5A',
    category: 'Spiritualite & Soutien',
  },
];

function ResourceIcon({ icon, color }: { icon: FaithResource['icon']; color: string }) {
  if (icon === 'heart') {
    return <Ionicons name="heart" size={18} color={color} />;
  }
  if (icon === 'moon') {
    return <Ionicons name="moon" size={18} color={color} />;
  }
  if (icon === 'star') {
    return <Ionicons name="star" size={18} color={color} />;
  }
  if (icon === 'users') {
    return <Ionicons name="people" size={18} color={color} />;
  }
  return <Ionicons name="sparkles" size={18} color={color} />;
}

function ResourceCard({ resource, wo, index }: { resource: FaithResource; wo: boolean; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const delay = index * 50;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.resourceCard,
        {
          opacity,
          transform: [{ translateY }],
          borderColor: `${resource.color}25`,
        },
      ]}
    >
      <View style={[styles.resourceAccentBar, { backgroundColor: resource.color }]} />

      <View style={styles.resourceMainRow}>
        <View style={[styles.resourceIconWrap, { backgroundColor: `${resource.color}20` }]}> 
          <ResourceIcon icon={resource.icon} color={resource.color} />
        </View>

        <View style={styles.resourceContentWrap}>
          <Text style={[styles.resourceCategory, { color: resource.color }]}>{resource.category}</Text>
          <Text style={styles.resourceTitle}>{wo ? resource.titleWo : resource.titleFr}</Text>
          <Text style={styles.resourceText}>{wo ? resource.contentWo : resource.contentFr}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

function FaithResourcesContent() {
  const router = useRouter();
  const { language, oralMode, discreteMode } = useProfileMock();
  const wo = language === 'wo';

  const christianityResources = useMemo(
    () =>
      FAITH_RESOURCES.filter(
        (resource) => resource.faith === 'christianity' || resource.faith === 'universal'
      ),
    []
  );

  const islamResources = useMemo(
    () => FAITH_RESOURCES.filter((resource) => resource.faith === 'islam' || resource.faith === 'universal'),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.pageWrap, discreteMode && styles.discreteWrap]}>
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <Ionicons name="chevron-back" size={20} color="white" />
            </Pressable>

            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>{wo ? 'Gem-gem ak Wer' : 'Foi & Sante'}</Text>
              <Text style={styles.headerSubtitle}>
                {wo
                  ? 'Liggeey ci kersa-yalla ak weru yaram'
                  : 'Ressources spirituelles et sante reproductive'}
              </Text>
            </View>

            <View style={styles.headerSparkleWrap}>
              <Ionicons name="sparkles" size={20} color="white" />
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.introCard}>
              <View style={styles.introTitleRow}>
                <View style={styles.introHeartWrap}>
                  <Ionicons name="heart" size={16} color={BASE.terracotta} />
                </View>
                <Text style={styles.introTitle}>{wo ? 'Yeg-yegal ci sa gem ak sa wer' : 'Harmoniser foi et sante'}</Text>
              </View>

              <Text style={styles.introText}>
                {wo
                  ? 'SaxalWer rafetal ni sa gem-gem ci Yalla dafa am solo ci sa yoon bu wer. Fii, amal na ressources ngir japp naka nga men a liggeey ci gem-gem ak wer ci ker wu bees.'
                  : 'SaxalWer reconnait que la foi et la spiritualite sont souvent au coeur des choix de sante. Voici des ressources pour comprendre comment christianisme et islam abordent la sante reproductive, sans jugement.'}
              </Text>
            </View>

            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="sunny" size={20} color={BASE.gold} />
                <Text style={styles.sectionTitle}>{wo ? 'Christianisme' : 'Christianisme'}</Text>
              </View>

              <View style={styles.sectionCardsWrap}>
                {christianityResources.map((resource, index) => (
                  <ResourceCard key={resource.id} resource={resource} wo={wo} index={index} />
                ))}
              </View>
            </View>

            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="moon" size={20} color={BASE.deepGreen} />
                <Text style={styles.sectionTitle}>Islam</Text>
              </View>

              <View style={styles.sectionCardsWrap}>
                {islamResources.map((resource, index) => (
                  <ResourceCard key={resource.id} resource={resource} wo={wo} index={index} />
                ))}
              </View>
            </View>

            <View style={styles.externalCard}>
              <View style={styles.externalTitleRow}>
                <Ionicons name="open-outline" size={14} color={BASE.copper} />
                <Text style={styles.externalTitle}>{wo ? 'Liggeey yu yees' : 'Aller plus loin'}</Text>
              </View>

              <Text style={styles.externalText}>
                {wo
                  ? 'Jel na xetu ci imam, pasteur, wala expert bu spirituel ngir gis tey wu la jem ci sa situation.'
                  : "N'hesite pas a consulter un imam, pasteur, ou conseiller spirituel de confiance pour des avis adaptes a ta situation personnelle."}
              </Text>
            </View>

            <View style={styles.footerAssistWrap}>
              <MaterialCommunityIcons
                name={oralMode ? 'volume-high' : 'volume-off'}
                size={14}
                color={BASE.copper}
              />
              <Text style={styles.footerAssistText}>
                {wo
                  ? oralMode
                    ? 'Mode vocal actif'
                    : 'Mode vocal desactive'
                  : oralMode
                    ? 'Mode vocal actif'
                    : 'Mode vocal desactive'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function FaithResourcesScreen() {
  return <FaithResourcesContent />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  scroll: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  pageWrap: {
    minHeight: '100%',
    backgroundColor: BASE.beige,
  },
  discreteWrap: {
    opacity: 0.82,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: BASE.deepGreen,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: 'white',
    lineHeight: 34,
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.7,
    color: 'white',
    marginTop: 2,
  },
  headerSparkleWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  introCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    shadowColor: BASE.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 24,
  },
  introTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  introHeartWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: `${BASE.terracotta}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BASE.deepGreen,
    flex: 1,
  },
  introText: {
    fontSize: 13,
    color: BASE.cocoa,
    opacity: 0.72,
    lineHeight: 21,
  },
  sectionWrap: {
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: BASE.deepGreen,
  },
  sectionCardsWrap: {
    gap: 12,
  },
  resourceCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: BASE.deepGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  resourceAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  resourceMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginLeft: 8,
  },
  resourceIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resourceContentWrap: {
    flex: 1,
  },
  resourceCategory: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  resourceTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: BASE.deepGreen,
    marginBottom: 8,
    lineHeight: 22,
  },
  resourceText: {
    fontSize: 12,
    color: BASE.cocoa,
    opacity: 0.75,
    lineHeight: 19,
  },
  externalCard: {
    backgroundColor: `${BASE.copper}12`,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: `${BASE.copper}20`,
    marginBottom: 18,
  },
  externalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  externalTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: BASE.copper,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  externalText: {
    fontSize: 12,
    color: BASE.cocoa,
    opacity: 0.7,
    lineHeight: 19,
  },
  footerAssistWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: `${BASE.copper}25`,
  },
  footerAssistText: {
    fontSize: 11,
    color: BASE.copper,
    fontWeight: '600',
  },
});
