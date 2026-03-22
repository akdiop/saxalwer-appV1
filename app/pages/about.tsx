import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import { useApp } from '../../context/appcontext';

const BASE = {
  beige: '#F5F1E6',
  beige2: '#EDE5D0',
  deepGreen: '#1A3C34',
  green2: '#2D4B42',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  gold: '#D4AF37',
};

type MethodStep = {
  icon: keyof typeof Ionicons.glyphMap;
  titleFr: string;
  titleWo: string;
  descFr: string;
  descWo: string;
  color: string;
};

const METHODOLOGY_STEPS: MethodStep[] = [
  {
    icon: 'ear-outline',
    titleFr: 'Écoute communautaire',
    titleWo: 'Dégg ci gox gi',
    descFr:
      'Des cercles de parole avec des femmes de différentes générations, dans des quartiers de Dakar, Saint-Louis, Thiès et en zones rurales. Nous avons écouté leurs réalités, leurs silences, leurs besoins non-dits.',
    descWo:
      'Ñu dëkkal ay rondu waxtaan ak jigéen yu bari att, ci Ndakaaru, Ndar, Cees ak dëkk bi. Ñu dégg seen dooleel, seen nëbb, ak seen soxla.',
    color: BASE.copper,
  },
  {
    icon: 'people-outline',
    titleFr: 'Co-création participative',
    titleWo: 'Bokk-liggéey',
    descFr:
      'Chaque fonctionnalité a été imaginée, testée et validée avec les utilisatrices. Les sages-femmes, les bajenu gox (marraines de quartier), et les associations locales ont guidé nos choix.',
    descWo:
      'Bépp njëlbéen jëfandikukat yi ko sàmm, jàngal ko, te baal ko. Bajenu gox yi ak liggéeykat yi ci wér gi ñu ngi ci nekk.',
    color: BASE.deepGreen,
  },
  {
    icon: 'earth-outline',
    titleFr: 'Ancrage culturel profond',
    titleWo: 'Cosaan ci biir',
    descFr:
      'Les métaphores naturelles (lune, baobab, saisons) remplacent le vocabulaire clinique froid. Le wolof côtoie le français. Les illustrations s\'inspirent de l\'art visuel sénégalais.',
    descWo:
      'Nataali askan wi (weer, guy, évèn) moo ci am, du baat yu sedd. Wolof ak français ñu bokk. Nataal yi jëm naa ci njàng Senegaal.',
    color: BASE.terracotta,
  },
  {
    icon: 'shield-checkmark-outline',
    titleFr: 'Respect des tabous & sécurité',
    titleWo: 'Aar sëriñ ak kaarange',
    descFr:
      'Le mode discret protège votre intimité. Aucun jugement, aucune donnée partagée. Nous savons que parler de santé reproductive est un acte de courage dans beaucoup de nos communautés.',
    descWo:
      'Mode bu nëbb mooy aar sa biir. Amul ñàkk jëf, amul ay jëfëndiku baat. Xam nañu ne wax ci wéru jur dafa nekk jëf bu am fit.',
    color: BASE.green2,
  },
  {
    icon: 'bulb-outline',
    titleFr: 'Savoir validé & accessible',
    titleWo: 'Xam-xam bu dëgg',
    descFr:
      'Tout le contenu est révisé par des professionnels de santé sénégalais et adapté au contexte local : plantes médicinales reconnues, structures de soins proches, droits des femmes.',
    descWo:
      'Bépp baat ci biir dafay wëral ak doktoor yu Senegaal. Garab gu dëgg, jumtukaay yu jege, ak sañ-sañu jigéen.',
    color: BASE.gold,
  },
];

type Principle = {
  titleFr: string;
  titleWo: string;
  descFr: string;
  descWo: string;
};

const PRINCIPLES: Principle[] = [
  {
    titleFr: 'Rien sur nous sans nous',
    titleWo: 'Dara ci nun, te nun nekku ci',
    descFr:
      'Chaque décision de design est discutée et validée avec les communautés concernées.',
    descWo: 'Bépp tànn ci nataal bi dañu ko wëral ak gox yi.',
  },
  {
    titleFr: 'Le silence n\'est pas un consentement',
    titleWo: 'Nëbb du nangu',
    descFr:
      'Nous créons des espaces sûrs pour que les questions non posées trouvent enfin des réponses.',
    descWo: 'Ñu sos ay bërëb buy aar ngir laaj yi nëbboon am tontu.',
  },
  {
    titleFr: 'La santé est un droit, pas un privilège',
    titleWo: 'Wér sañ-sañ la, du njëg',
    descFr: 'Information gratuite, accessible, dans votre langue, à votre rythme.',
    descWo: 'Xam-xam bu amul fay, bu leer, ci sa lak, ci sa yoon.',
  },
  {
    titleFr: 'Chaque parcours est unique',
    titleWo: 'Bépp yoon mooy benn',
    descFr:
      'Pas de jugement, pas de norme unique. Votre réalité, vos choix, votre rythme.',
    descWo: 'Amul ñàkk jëf, amul yoon benn rekk. Sa dooleel, sa tànn, sa diir.',
  },
];

type Partner = {
  nameFr: string;
  nameWo: string;
  roleFr: string;
  roleWo: string;
};

const PARTNERS: Partner[] = [
  {
    nameFr: 'Bajenu Gox',
    nameWo: 'Bajenu Gox',
    roleFr: 'Marraines de quartier — relais communautaires',
    roleWo: 'Yaay gox — liggéeykat ci gox',
  },
  {
    nameFr: 'Sages-femmes communautaires',
    nameWo: 'Jur-kaay ci gox',
    roleFr: 'Validation médicale & formation',
    roleWo: 'Sëlëktu dooktoor ak jàng',
  },
  {
    nameFr: 'Associations de femmes',
    nameWo: 'Mbotaay jigéen',
    roleFr: 'Groupes de parole & retours terrain',
    roleWo: 'Rondu waxtaan ak defar',
  },
  {
    nameFr: 'Jeunes ambassadrices',
    nameWo: 'Ndaw si yu jiitu',
    roleFr: 'Voix des adolescentes & jeunes femmes',
    roleWo: 'Baat yu ndaw si',
  },
];

const PARTNER_COLORS = [BASE.copper, BASE.deepGreen, BASE.terracotta, BASE.gold];

export default function AboutScreen() {
  const router = useRouter();
  const { language, setLanguage, oralMode, toggleOralMode } = useApp();
  const { width } = useWindowDimensions();
  const wo = language === 'wo';
  const isCompact = width < 820;
  const isWide = width >= 1180;

  const pageOpacity = useRef(new Animated.Value(0)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(pageOpacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(120),
        Animated.parallel([
          Animated.timing(heroOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(heroTranslate, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [heroOpacity, heroTranslate, pageOpacity]);

  const handleSpeak = () => {
    const text = wo
      ? 'Ci biir SaxalWer. Naka nyu jefandikoo, naka nyu defar. Benn jumtukaay bu jem ci gox yi, defar ak gox yi.'
      : "A propos. Notre methodologie de co-conception. Par les communautes, pour les communautes.";

    Speech.stop();
    Speech.speak(text, {
      language: wo ? 'fr-SN' : 'fr-FR',
      rate: 0.9,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.screen, { opacity: pageOpacity }]}> 
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.pageInner, isWide && styles.pageInnerWide]}>
            <View style={[styles.header, isCompact && styles.headerCompact]}>
              <Pressable onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color={BASE.deepGreen} />
              </Pressable>

              <View style={styles.headerTextWrap}>
                <Text style={[styles.headerTitle, isCompact && styles.headerTitleCompact]}>
                  {wo ? 'Ci biir SaxalWér' : 'À propos'}
                </Text>
                <Text style={[styles.headerSubtitle, isCompact && styles.headerSubtitleCompact]}>
                  {wo ? 'Naka ñu jëfandikoo, naka ñu defar' : 'Notre méthodologie de co-conception'}
                </Text>
              </View>

              <View style={[styles.headerActionsRow, isCompact && styles.headerActionsRowCompact]}>
                <Pressable onPress={() => setLanguage(wo ? 'fr' : 'wo')} style={styles.headerChip}>
                  <Text style={styles.headerChipText}>{wo ? 'Français' : 'Wolof'}</Text>
                </Pressable>

                <Pressable onPress={toggleOralMode} style={styles.headerIconButton}>
                  <Ionicons
                    name={oralMode ? 'volume-high-outline' : 'volume-mute-outline'}
                    size={16}
                    color={BASE.deepGreen}
                  />
                </Pressable>

                <Pressable onPress={handleSpeak} style={styles.headerIconButton}>
                  <Ionicons name="play-outline" size={16} color={BASE.deepGreen} />
                </Pressable>
              </View>
            </View>

            <View style={styles.sectionWrap}>
              <Animated.View
                style={[
                  styles.heroCard,
                  isWide && styles.heroCardWide,
                  { opacity: heroOpacity, transform: [{ translateY: heroTranslate }] },
                ]}
              >
                <View style={styles.heroCircleOne} />
                <View style={styles.heroCircleTwo} />
                <View style={styles.heroCircleThree} />

                <View style={styles.heroBadge}>
                  <Ionicons name="people-outline" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.heroBadgeText}>{wo ? 'Bokk-defar' : 'Co-conception'}</Text>
                </View>

                <Text style={[styles.heroTitle, isCompact && styles.heroTitleCompact]}>
                  {wo
                    ? 'Benn jumtukaay bu jëm ci gox yi, defar ak gox yi'
                    : 'Par les communautés, pour les communautés'}
                </Text>

                <Text style={[styles.heroDescription, isCompact && styles.heroDescriptionCompact]}>
                  {wo
                    ? 'SaxalWér du benn jumtukaay bu ñu defar ci kaw. Moo jëm ci biiru askan wi, jëkk ci dégg yi, ci soxla yi, ak ci cosaan yi.'
                    : 'SaxalWér n\'est pas une application conçue en surplomb. Elle est née de l\'écoute, des réalités du terrain, et du courage de celles qui ont accepté de briser le silence.'}
                </Text>
              </Animated.View>
            </View>

            <View style={styles.sectionWrap}>
              <Text style={[styles.sectionTitle, isCompact && styles.sectionTitleCompact]}>
                {wo ? 'Naka ñu defar ko' : 'Notre démarche'}
              </Text>
              <Text style={styles.sectionLead}>
                {wo
                  ? 'Juróom yoon yu ñu jëlee ngir defar SaxalWér ak gox yi'
                  : '5 piliers de notre méthodologie de co-conception communautaire'}
              </Text>

              <View style={styles.columnGap14}>
                {METHODOLOGY_STEPS.map((step, i) => (
                  <View
                    key={step.titleFr}
                    style={[styles.methodCard, isCompact && styles.methodCardCompact, { borderColor: `${step.color}18` }]}
                  >
                    <Text style={[styles.methodWatermark, { color: `${step.color}12` }]}>
                      {String(i + 1).padStart(2, '0')}
                    </Text>

                    <View style={styles.methodRow}>
                      <View style={styles.methodIconColumn}>
                        <View style={[styles.methodIconWrap, { backgroundColor: `${step.color}12` }]}>
                          <Ionicons name={step.icon} size={20} color={step.color} />
                        </View>

                        {i < METHODOLOGY_STEPS.length - 1 && (
                          <View style={[styles.connector, { backgroundColor: `${step.color}16` }]} />
                        )}
                      </View>

                      <View style={[styles.methodTextWrap, isCompact && styles.methodTextWrapCompact]}>
                        <Text style={styles.methodTitle}>{wo ? step.titleWo : step.titleFr}</Text>
                        <Text style={styles.methodDescription}>{wo ? step.descWo : step.descFr}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionWrap}>
              <Text style={[styles.sectionTitle, isCompact && styles.sectionTitleCompact]}>
                {wo ? 'Sañ-sañ yu ñu tegal' : 'Nos principes fondateurs'}
              </Text>

              <View style={styles.principlesCard}>
                {PRINCIPLES.map((p, i) => (
                  <View
                    key={p.titleFr}
                    style={[styles.principleItem, i < PRINCIPLES.length - 1 && styles.principleItemBorder]}
                  >
                    <View style={styles.principleRow}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={BASE.copper}
                        style={styles.principleIcon}
                      />
                      <View style={styles.principleTextWrap}>
                        <Text style={styles.principleTitle}>« {wo ? p.titleWo : p.titleFr} »</Text>
                        <Text style={styles.principleDescription}>{wo ? p.descWo : p.descFr}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionWrap}>
              <Text style={[styles.sectionTitle, isCompact && styles.sectionTitleCompact]}>
                {wo ? 'Ñi ñu bokk liggéey' : 'Nos partenaires communautaires'}
              </Text>

              <View style={[styles.partnerGrid, isCompact && styles.partnerGridCompact]}>
                {PARTNERS.map((partner, i) => (
                  <View key={partner.nameFr} style={[styles.partnerCard, isCompact && styles.partnerCardCompact]}>
                    <View
                      style={[
                        styles.partnerIconWrap,
                        { backgroundColor: `${PARTNER_COLORS[i]}14` },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="handshake-outline"
                        size={16}
                        color={PARTNER_COLORS[i]}
                      />
                    </View>

                    <Text style={styles.partnerName}>{wo ? partner.nameWo : partner.nameFr}</Text>
                    <Text style={styles.partnerRole}>{wo ? partner.roleWo : partner.roleFr}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionWrapLast}>
              <View style={styles.ctaCard}>
                <Ionicons name="heart" size={24} color={BASE.terracotta} style={styles.ctaIcon} />

                <Text style={styles.ctaTitle}>{wo ? 'Sa baat am na njariñ' : 'Votre voix compte'}</Text>

                <Text style={styles.ctaDescription}>
                  {wo
                    ? 'SaxalWér dafay yokk ci seen xalaat. Ndax bëgg nga bokk ci liggéey bi? Jox nu sa xalaat!'
                    : 'SaxalWér grandit avec vos retours. Envie de participer à notre prochaine session de co-conception ? Partagez-nous votre expérience !'}
                </Text>

                <Pressable onPress={() => router.push('/feedback' as never)} style={styles.ctaButton}>
                  <Text style={styles.ctaButtonText}>{wo ? 'Jox sa xalaat' : 'Partager mon retour'}</Text>
                </Pressable>

                <Pressable onPress={() => router.replace('/' as never)} style={styles.secondaryCtaButton}>
                  <Text style={styles.secondaryCtaButtonText}>
                    {wo ? 'Dem ci sama espace' : 'Découvrir mon espace'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  screen: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingTop: 8,
  },
  pageInner: {
    width: '100%',
    maxWidth: 1440,
    alignSelf: 'center',
  },
  pageInnerWide: {
    maxWidth: 1560,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerCompact: {
    flexWrap: 'wrap',
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  headerTextWrap: {
    flex: 1,
    paddingTop: 2,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  headerActionsRowCompact: {
    width: '100%',
    justifyContent: 'flex-end',
    paddingTop: 0,
  },
  headerChip: {
    minWidth: 46,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  headerChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: BASE.deepGreen,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 36,
    lineHeight: 38,
    fontWeight: '700',
    color: BASE.deepGreen,
    fontFamily: Platform.OS === 'ios' ? 'CormorantGaramond-Bold' : 'serif',
  },
  headerTitleCompact: {
    fontSize: 30,
    lineHeight: 32,
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: 'rgba(74,47,39,0.58)',
  },
  headerSubtitleCompact: {
    fontSize: 13,
  },
  sectionWrap: {
    paddingHorizontal: 24,
    marginTop: 34,
  },
  sectionWrapLast: {
    paddingHorizontal: 24,
    marginTop: 34,
    marginBottom: 24,
  },
  heroCard: {
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 34,
    backgroundColor: BASE.deepGreen,
    overflow: 'hidden',
    minHeight: 260,
    justifyContent: 'center',
  },
  heroCardWide: {
    minHeight: 300,
  },
  heroCircleOne: {
    position: 'absolute',
    top: -26,
    right: -28,
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroCircleTwo: {
    position: 'absolute',
    bottom: -32,
    left: -28,
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  heroCircleThree: {
    position: 'absolute',
    top: 36,
    right: 34,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 24,
  },
  heroBadgeText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  heroTitle: {
    maxWidth: 760,
    fontSize: 40,
    lineHeight: 48,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 14,
    fontFamily: Platform.OS === 'ios' ? 'CormorantGaramond-Bold' : 'serif',
  },
  heroTitleCompact: {
    fontSize: 33,
    lineHeight: 40,
  },
  heroDescription: {
    maxWidth: 980,
    fontSize: 16,
    lineHeight: 32,
    color: 'rgba(255,255,255,0.74)',
  },
  heroDescriptionCompact: {
    fontSize: 15,
    lineHeight: 28,
  },
  sectionTitle: {
    fontSize: 34,
    lineHeight: 40,
    color: BASE.deepGreen,
    fontWeight: '700',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'CormorantGaramond-Bold' : 'serif',
  },
  sectionTitleCompact: {
    fontSize: 30,
    lineHeight: 34,
  },
  sectionLead: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(74,47,39,0.56)',
    marginBottom: 22,
  },
  columnGap14: {
    gap: 18,
  },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingVertical: 22,
    paddingHorizontal: 24,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
    overflow: 'hidden',
  },
  methodCardCompact: {
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  methodWatermark: {
    position: 'absolute',
    top: 18,
    right: 18,
    fontSize: 46,
    lineHeight: 50,
    fontWeight: '800',
  },
  methodRow: {
    flexDirection: 'row',
    gap: 16,
  },
  methodIconColumn: {
    alignItems: 'center',
  },
  methodIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: 22,
    marginTop: 10,
    borderRadius: 1,
  },
  methodTextWrap: {
    flex: 1,
    paddingTop: 4,
    paddingRight: 34,
  },
  methodTextWrapCompact: {
    paddingRight: 18,
  },
  methodTitle: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 8,
  },
  methodDescription: {
    fontSize: 14,
    lineHeight: 28,
    color: 'rgba(74,47,39,0.62)',
  },
  principlesCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.12)',
    backgroundColor: 'rgba(181,98,42,0.08)',
    overflow: 'hidden',
  },
  principleItem: {
    paddingHorizontal: 22,
    paddingVertical: 18,
  },
  principleItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(181,98,42,0.10)',
  },
  principleRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  principleIcon: {
    marginTop: 2,
  },
  principleTextWrap: {
    flex: 1,
  },
  principleTitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 5,
    fontStyle: 'italic',
  },
  principleDescription: {
    fontSize: 13,
    lineHeight: 22,
    color: 'rgba(74,47,39,0.60)',
  },
  partnerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  partnerGridCompact: {
    marginHorizontal: 0,
  },
  partnerCard: {
    width: '50%',
    paddingHorizontal: 5,
    paddingBottom: 12,
  },
  partnerCardCompact: {
    width: '100%',
    paddingHorizontal: 0,
  },
  partnerIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  partnerName: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 4,
  },
  partnerRole: {
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(74,47,39,0.55)',
  },
  ctaCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.15)',
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    backgroundColor: BASE.beige2,
  },
  ctaIcon: {
    marginBottom: 10,
  },
  ctaTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'CormorantGaramond-Bold' : 'serif',
  },
  ctaDescription: {
    fontSize: 14,
    lineHeight: 24,
    color: 'rgba(74,47,39,0.62)',
    textAlign: 'center',
    marginBottom: 18,
  },
  ctaButton: {
    backgroundColor: BASE.deepGreen,
    borderRadius: 999,
    paddingHorizontal: 30,
    paddingVertical: 14,
    shadowColor: BASE.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryCtaButton: {
    marginTop: 10,
    borderRadius: 999,
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.14)',
    backgroundColor: 'rgba(255,255,255,0.84)',
  },
  secondaryCtaButtonText: {
    color: BASE.deepGreen,
    fontSize: 14,
    fontWeight: '700',
  },
});
