import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { Fonts } from '@/constants/theme';

import { useApp } from '../../context/appcontext';

type FaqQuestion = {
  q: string;
  a: string;
};

type FaqCategory = {
  category: string;
  icon: 'shield' | 'flower' | 'sparkles' | 'message' | 'phone' | 'heart';
  color: string;
  questions: FaqQuestion[];
};

const BASE = {
  beige: colors.beige,
  deepGreen: colors.deepGreen,
  terracotta: colors.terracotta,
  copper: colors.copper,
  cocoa: colors.cocoa,
  gold: colors.gold,
  sage: '#7A8C5A',
  white: colors.white,
};

const FAQ_ITEMS: Record<'fr' | 'wo', FaqCategory[]> = {
  fr: [
    {
      category: 'Confidentialité & Sécurité',
      icon: 'shield',
      color: BASE.deepGreen,
      questions: [
        {
          q: 'Mes données sont-elles vraiment sécurisées ?',
          a: "Oui, toutes vos données sont stockées localement sur votre téléphone. Aucune information n'est envoyée à des serveurs externes. Le mode discret ajoute une couche supplémentaire de protection en masquant visuellement vos informations sensibles.",
        },
        {
          q: "Qu'est-ce que le mode discret ?",
          a: "Le mode discret floute automatiquement toutes vos données personnelles (journal, historique, favoris). Activez-le d'un simple tap sur l'icône d'œil en bas à droite pour protéger votre vie privée si quelqu'un regarde votre écran.",
        },
        {
          q: 'Qui peut voir mon journal intime ?',
          a: "Personne. Votre journal est chiffré et stocké uniquement sur votre appareil. Même nous, les créateurs de SaxalWér, ne pouvons pas y accéder. C'est votre espace sacré et privé.",
        },
      ],
    },
    {
      category: 'Santé Sexuelle & Reproductive',
      icon: 'flower',
      color: BASE.sage,
      questions: [
        {
          q: "C'est quoi la santé sexuelle et reproductive (SSR) ?",
          a: "La SSR concerne tout ce qui touche à votre bien-être physique, émotionnel et social lié à la sexualité et à la reproduction. Cela inclut les cycles menstruels, la contraception, la grossesse, la fertilité, la ménopause, mais aussi le droit de vivre sa sexualité de manière libre, informée et respectée. Ce n'est pas seulement l'absence de maladie — c'est un état de bien-être global.",
        },
        {
          q: "Pourquoi c'est important d'en parler ?",
          a: "Au Sénégal, la SSR reste souvent un sujet tabou. Pourtant, s'informer est un droit fondamental. Connaître son corps, comprendre ses cycles, savoir quelles méthodes de contraception existent, ou reconnaître les signes d'une grossesse à risque peut sauver des vies. SaxalWér existe pour briser ces silences avec douceur et dignité.",
        },
        {
          q: 'Est-ce que la SSR concerne seulement les femmes mariées ?',
          a: "Non, absolument pas. La SSR concerne toutes les femmes, quel que soit leur âge, leur statut marital ou leur situation de vie. Une adolescente qui découvre ses premières règles, une femme célibataire qui souhaite se protéger, ou une grand-mère en ménopause — toutes méritent des informations fiables et un accompagnement respectueux.",
        },
        {
          q: 'Comment parler de SSR à ma fille ou à une jeune proche ?',
          a: "Commencez par des conversations simples et ouvertes, sans jugement. Vous pouvez utiliser les articles de la bibliothèque SaxalWér comme point de départ — ils sont rédigés dans un langage accessible et bienveillant. L'important est de créer un espace de confiance où elle se sent libre de poser des questions.",
        },
        {
          q: 'Existe-t-il des méthodes de contraception accessibles au Sénégal ?',
          a: "Oui, plusieurs méthodes sont disponibles : pilules, injections, implants, dispositifs intra-utérins (DIU/stérilet), préservatifs, et méthodes naturelles. Leur disponibilité varie selon les régions et les centres de santé. Consultez la carte des centres dans SaxalWér pour trouver un point d'accès près de chez vous, ou parlez-en avec un professionnel de santé.",
        },
        {
          q: "Qu'est-ce que l'orientation santé dans SaxalWér ?",
          a: "C'est un parcours confidentiel de quelques questions qui évalue vos besoins de santé reproductive de manière personnalisée. Il vous oriente vers les ressources (articles, centres, conseils) les plus adaptées à votre situation, sans jamais porter de jugement. Vos réponses restent 100% privées sur votre téléphone.",
        },
        {
          q: "Je vis une situation difficile liée à ma santé reproductive. SaxalWér peut-il m'aider ?",
          a: "SaxalWér vous offre un espace sûr et discret pour vous informer. L'Orientation Sensible prend en compte les situations délicates (pressions familiales, violences, accès limité aux soins) et vous propose un accompagnement adapté. En cas d'urgence, la page Urgence vous connecte directement à des lignes d'écoute et centres d'aide disponibles 24h/24.",
        },
        {
          q: "Les infections sexuellement transmissibles (IST), c'est quoi exactement ?",
          a: "Les IST sont des infections transmises lors de rapports sexuels non protégés. Les plus courantes incluent la chlamydia, la gonorrhée, la syphilis, le VIH/SIDA et l'hépatite B. Beaucoup sont silencieuses (aucun symptôme visible) mais peuvent avoir des conséquences graves si elles ne sont pas traitées. Le dépistage régulier et l'utilisation de préservatifs sont les meilleurs moyens de prévention.",
        },
        {
          q: 'À quel âge devrait-on commencer à consulter un gynécologue ?',
          a: "Il n'y a pas d'âge strict, mais une première consultation est recommandée dès les premières règles, ou dès qu'on a des questions sur son corps, sa sexualité ou la contraception. Au Sénégal, les sage-femmes sont aussi des interlocutrices de confiance pour la santé reproductive. N'attendez pas d'avoir un problème pour consulter — la prévention est précieuse.",
        },
        {
          q: "Je n'ai pas accès à un médecin spécialisé. Que faire ?",
          a: "SaxalWér peut vous aider à trouver le centre de santé le plus proche grâce à la carte interactive (centres à travers tout le Sénégal). Les sage-femmes, infirmières et agents communautaires de santé sont aussi des ressources précieuses. En attendant, nos articles vous fournissent des informations fiables et vérifiées pour mieux comprendre votre situation.",
        },
      ],
    },
    {
      category: "Utilisation de l'App",
      icon: 'sparkles',
      color: BASE.terracotta,
      questions: [
        {
          q: 'Comment modifier mon parcours (âge, besoins) ?',
          a: `Allez dans l'onglet "Parcours", puis sélectionnez "Changer Mon Parcours". Vous pourrez mettre à jour votre tranche d'âge et vos besoins de santé pour recevoir du contenu adapté.`,
        },
        {
          q: "L'assistant IA peut-il remplacer un médecin ?",
          a: "Non, jamais. L'assistant SaxalWér fournit des informations générales éducatives, mais ne pose aucun diagnostic. En cas de symptômes ou questions médicales, consultez toujours un professionnel de santé.",
        },
        {
          q: 'Comment retrouver mes articles favoris ?',
          a: `Tous vos articles sauvegardés sont accessibles dans l'onglet "Parcours", section "Mes Favoris". Tapez sur le cœur d'un article pour le sauvegarder.`,
        },
        {
          q: 'Le tracker de cycle est-il une méthode de contraception ?',
          a: 'Non. Le tracker vous aide à mieux comprendre votre cycle, mais il ne doit PAS être utilisé comme seule méthode contraceptive. Consultez la section Contraception pour des méthodes fiables.',
        },
      ],
    },
    {
      category: 'Langues & Accessibilité',
      icon: 'message',
      color: BASE.copper,
      questions: [
        {
          q: "Puis-je changer la langue de l'application ?",
          a: `Oui, SaxalWér est disponible en Français et en Wolof. Vous pouvez modifier la langue dans l'onglet Parcours > Réglages & Préférences > Langue & Audio.`,
        },
        {
          q: 'Y a-t-il une version audio pour celles qui ne lisent pas ?',
          a: "Nous travaillons activement sur une fonctionnalité audio en Wolof pour rendre l'app accessible à toutes, quelle que soit leur aisance avec la lecture. Cette fonction sera bientôt disponible.",
        },
      ],
    },
    {
      category: 'Urgences & Aide',
      icon: 'phone',
      color: BASE.gold,
      questions: [
        {
          q: "Où trouver de l'aide en urgence ?",
          a: `La page "Urgence" (accessible depuis le menu) contient tous les numéros d'urgence, centres de santé et lignes d'écoute disponibles 24h/24. Vous y trouverez aussi des ressources contre les violences.`,
        },
        {
          q: 'Les médecins listés acceptent-ils les assurances ?',
          a: 'La plupart des professionnels listés dans notre répertoire acceptent les assurances. Cette information est indiquée sur chaque fiche médecin. En cas de doute, appelez directement le cabinet.',
        },
      ],
    },
    {
      category: 'À Propos de SaxalWér',
      icon: 'heart',
      color: BASE.terracotta,
      questions: [
        {
          q: 'Que signifie "SaxalWér" ?',
          a: `En Wolof, "Saxal" signifie "prendre soin" et "Wér" signifie "corps/santé". SaxalWér est donc votre espace pour prendre soin de votre santé reproductive avec douceur et dignité.`,
        },
        {
          q: 'Qui a créé cette application ?',
          a: "SaxalWér a été co-conçue avec et pour les femmes du Sénégal. Nous sommes une équipe de professionnels de santé, designers et développeurs engagés pour l'accès à l'information de santé reproductive.",
        },
        {
          q: "Comment puis-je contribuer à améliorer l'app ?",
          a: 'Vos retours sont précieux ! Allez dans Parcours > Suggestions & Feedback pour partager vos idées, signaler des bugs ou proposer de nouvelles fonctionnalités. Vous co-construisez SaxalWér avec nous.',
        },
      ],
    },
  ],
  wo: [
    {
      category: 'Sutura ak Kàràngë',
      icon: 'shield',
      color: BASE.deepGreen,
      questions: [
        {
          q: 'Ndax sama xibaarkat yooyu am na kàràngë ?',
          a: 'Waaw, lépp sa xibaarkat doxal na ci sa téléphone bi rekk. Xamunu kenn. Mode discret bi ëpp na ci sutura bu gën a baax, mu nëbb sa xibaarkat.',
        },
        {
          q: 'Lu tax mode discret bi ?',
          a: 'Mode discret bi dafa blur automatiquement lépp sa xibaarkat yu bëri solo (journal, historique, favoris). Jëfandil ko bu fekkee ku nekk dafa xoolal sa écran.',
        },
        {
          q: 'Kan moo man a xool sama journal intime ?',
          a: 'Kenn. Sa journal bi chiffré na te doxal na ci sa téléphone bi rekk. Waaye ñunu, ñi defar SaxalWér, du ñu man a gis. Sa boppu la, sutura bu mat.',
        },
      ],
    },
    {
      category: 'Wéeru Yaram — Santé Sexuelle ak Reproductive',
      icon: 'flower',
      color: BASE.sage,
      questions: [
        {
          q: 'Lan la SSR (Santé Sexuelle et Reproductive) mooy ?',
          a: 'SSR mooy lépp lu aar sa yaram, sa xol ak sa dund bu nekk ci wàllu sexualité ak jur. Ci biir am na weer yi, contraception, tur, fertilité, ménopause, ak sa sañ-sañ ngir dund sa sexualité ak sutura, xam-xam ak njàmbaar. Du malaadi rekk — mooy nekk wéer ci yaram boppam.',
        },
        {
          q: 'Lu tax war nañu wax ci ?',
          a: 'Ci Senegaal, SSR dafa sax tabou. Waaye xam-xam mooy sañ-sañ bu am solo. Xam sa yaram, dégg sa weer yi, xam methodes contraception yi, walla gis mandarga yi ci tur bu am risque — lépp loolu man na aar dundël. SaxalWér nekk na foofu ngir tëral yi ci kaw ndànk ak njàmbaar.',
        },
        {
          q: 'Ndax SSR dafa aar jigéen ju seyee rekk ?',
          a: 'Deedeet. SSR aar na jigéen yépp, bu dul xam ndax am nañu sey, lu ñu am at, walla naka dund bi. Xale bu njël bu gis weer gi ci awal, jigéen ju seyul ju bëgg a aar boppam, walla maam ju am ménopause — ñépp war nañu am xibaarkat yu dëgër ak dimbali bu am njàmbaar.',
        },
        {
          q: 'Naka laa man a wax ci SSR ak sama doom walla jigéen ju ndaw ?',
          a: 'Tambali ak waxtan yu yomb te bul xëy ci. Mën nga jëfandikoo articles yi ci bibliothèque SaxalWér — bindees nañu ci làkk bu leer te bu am xel-faju. Lu am solo mooy defar gox bu am deglu te mu neex ko laaj.',
        },
        {
          q: 'Am na méthodes contraception yu am ci Senegaal ?',
          a: 'Waaw, am na bëri : pilules, injections, implants, stérilet (DIU), capotes, ak méthodes naturelles. Nekk nañu ci centres de santé yu bëri. Xoolal carte yi ci SaxalWér ngir gis centre bu jege sa wàllu, walla waxal ak professionnel santé.',
        },
        {
          q: 'Lan la orientation santé ci SaxalWér ?',
          a: 'Mooy yoon bu sutura bu am ay laaj ngir sàmm sa besoins ci SSR bu baax. Dina la yónne ci xibaarkat yi (articles, centres, digalante) yu gën a baax ak sa boppam, te du xëy ci keneen. Sa tontu yi doxal na ci sa téléphone bi rekk.',
        },
        {
          q: 'Dinaa ci dimbali su fekkee dama nekk ci jafe-jafe ?',
          a: 'SaxalWér jox la gox bu aar te bu sutura ngir xam-xam. Orientation Sensible bi xam na ay jafe-jafe yu am solo (pression ci wàll kër, violence, jèle ci soins bu àmm) te dina la yónne ci dimbali bu baax. Su fekkee urgence, page Urgence bi dina la joxe numéros ak centres yu dimbali 24h/24.',
        },
        {
          q: 'IST (Infections Sexuellement Transmissibles) lan la ?',
          a: 'IST mooy infections yu ñu jële ci rapport sexuel bu dul protéger. Yu gën a am na : chlamydia, gonorrhée, syphilis, VIH/SIDA ak hépatite B. Bëri ci ñoom amul mandarga bu gis waaye man nañu am jafe-jafe bu am solo su dul safarawaat. Dépistage bu yàgg ak capotes mooy gën a baax ngir aar boppam.',
        },
        {
          q: 'Ban at laa war a dëkk ci gynécologue ?',
          a: 'Amul at bu mat, waaye consultation bu awal dafa baax lu ko weer gi nekk ci awal, walla su fekkee laaj am nga ci sa yaram, sa sexualité walla contraception. Ci Senegaal, sage-femmes yi ëpp nañu nekk ki nga man a deglu ci SSR. Bul xaar ba am malaadi — prévention am na solo bu bëri.',
        },
        {
          q: 'Amuma médecin bu spécialisé. Naka laa def ?',
          a: 'SaxalWér man na la dimbali gis centre de santé bu jege sa wàllu ak carte interactive bi (centres ci Senegaal bu ëpp). Sage-femmes yi, infirmières yi ak agents communautaires de santé yi ëpp nañu nekk ressources yu am solo. Ci diggante, articles yi dinañu la jox xibaarkat yu dëgër ngir gën a dégg sa yaram.',
        },
      ],
    },
    {
      category: 'Jëfandikoo App bi',
      icon: 'sparkles',
      color: BASE.terracotta,
      questions: [
        {
          q: 'Naka laa man a soppi sama parcours (yoon, besoins) ?',
          a: 'Dem ci onglet "Parcours", te tànnal "Changer Mon Parcours". Mën nga soppi sa yoon ak sa besoins ngir am contenu bu am solo ak sa boppam.',
        },
        {
          q: 'Ndax assistant IA bi mn na remplaceewaat médecin ?',
          a: 'Deedeet. Assistant SaxalWér bi dina jox informations générales, waaye du diagnostic. Su fekkee symptômes walla questions médicales, toog ci professionnel santé bi.',
        },
        {
          q: 'Naka laa man a gis sama articles favoris ?',
          a: 'Lépp sa articles yi sauvegardé nekk na ci onglet "Parcours", section "Mes Favoris". Bët ci cœur bi ci article ngir sauvegarder.',
        },
      ],
    },
    {
      category: 'Làkk ak Accessibilité',
      icon: 'message',
      color: BASE.copper,
      questions: [
        {
          q: 'Ndax mën na soppi làkk bi ?',
          a: 'Waaw, SaxalWér am na ci Français ak Wolof. Mën nga soppi làkk bi ci Parcours > Réglages & Préférences > Langue & Audio.',
        },
        {
          q: 'Ndax am na version audio ?',
          a: 'Danu liggéey ci fonctionnalité audio ci Wolof ngir app bi nekk accessible ci ñépp. Dina am ci kanam bu jot.',
        },
      ],
    },
  ],
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function CategoryIcon({ type, color }: { type: FaqCategory['icon']; color: string }) {
  if (type === 'shield') {
    return <Ionicons name="shield-checkmark-outline" size={16} color={color} />;
  }
  if (type === 'flower') {
    return <MaterialCommunityIcons name="flower-tulip-outline" size={16} color={color} />;
  }
  if (type === 'sparkles') {
    return <Ionicons name="sparkles-outline" size={16} color={color} />;
  }
  if (type === 'message') {
    return <Ionicons name="chatbubble-ellipses-outline" size={16} color={color} />;
  }
  if (type === 'phone') {
    return <Ionicons name="call-outline" size={16} color={color} />;
  }
  return <Ionicons name="heart-outline" size={16} color={color} />;
}

function QuestionItem({
  item,
  isExpanded,
  onPress,
  color,
  showDivider,
}: {
  item: FaqQuestion;
  isExpanded: boolean;
  onPress: () => void;
  color: string;
  showDivider: boolean;
}) {
  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const answerAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(answerAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [answerAnim, isExpanded, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.questionItem, showDivider && styles.questionDivider]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.questionButton,
          isExpanded && { backgroundColor: `${color}0D` },
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.questionText}>{item.q}</Text>
        <Animated.View style={[styles.chevronWrap, { transform: [{ rotate }] }]}>
          <Ionicons name="chevron-down" size={18} color={color} />
        </Animated.View>
      </Pressable>

      {isExpanded ? (
        <Animated.View
          style={[
            styles.answerWrap,
            {
              backgroundColor: `${color}0D`,
              opacity: answerAnim,
              transform: [
                {
                  translateY: answerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-4, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.answerText}>{item.a}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

export default function FAQScreen() {
  const router = useRouter();
  const { language, oralMode } = useApp();
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const lang = language === 'wo' ? 'wo' : 'fr';
  const faqData = FAQ_ITEMS[lang] ?? FAQ_ITEMS.fr;

  const speakText = (text: string) => {
    if (!oralMode) {
      return;
    }

    Speech.stop();
    Speech.speak(text, {
      language: lang === 'wo' ? 'fr-FR' : 'fr-FR',
      rate: 0.85,
      pitch: 1,
    });
  };

  const toggleQuestion = (categoryIndex: number, questionIndex: number, question: FaqQuestion) => {
    const key = `${categoryIndex}-${questionIndex}`;
    const isOpening = expandedIndex !== key;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(isOpening ? key : null);

    if (isOpening) {
      speakText(`${question.q}. ${question.a}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerWrap}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
              <Ionicons name="chevron-back" size={22} color={BASE.deepGreen} />
            </Pressable>

            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>
                {lang === 'wo' ? 'Laaj yi gën a jàppante' : 'Questions Fréquentes'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {lang === 'wo' ? 'Yit-yit ak réponses' : 'Trouvez vos réponses'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.introCard}>
            <Text style={styles.introText}>
              {lang === 'wo'
                ? 'Sa laaj yooyu important na. Waxal ñu ngir dimbali ci xam-xam bu baax.'
                : 'Vos questions sont importantes. Nous sommes là pour vous accompagner avec des réponses claires et bienveillantes.'}
            </Text>
          </View>

          {faqData.map((category, catIndex) => (
            <View key={`${category.category}-${catIndex}`} style={styles.categorySection}>
              <View style={styles.categoryHeaderRow}>
                <View style={[styles.categoryIconWrap, { backgroundColor: `${category.color}20` }]}>
                  <CategoryIcon type={category.icon} color={category.color} />
                </View>
                <Text style={styles.categoryTitle}>{category.category}</Text>
              </View>

              <View style={styles.questionsCard}>
                {category.questions.map((item, qIndex) => {
                  const key = `${catIndex}-${qIndex}`;

                  return (
                    <QuestionItem
                      key={key}
                      item={item}
                      isExpanded={expandedIndex === key}
                      onPress={() => toggleQuestion(catIndex, qIndex, item)}
                      color={category.color}
                      showDivider={qIndex < category.questions.length - 1}
                    />
                  );
                })}
              </View>
            </View>
          ))}

          <View style={styles.contactCtaCard}>
            <View style={styles.ctaOrbPrimary} />
            <View style={styles.ctaOrbSecondary} />
            <Ionicons name="notifications-outline" size={32} color="rgba(255,255,255,0.92)" style={styles.ctaBell} />
            <Text style={styles.ctaTitle}>{lang === 'wo' ? 'Am na laaj wu yëg ?' : 'Une autre question ?'}</Text>
            <Text style={styles.ctaDesc}>
              {lang === 'wo'
                ? 'Waxal ñu ci Suggestions & Feedback.'
                : "N'hésitez pas à nous la partager dans Suggestions & Feedback."}
            </Text>
            <Pressable
              onPress={() => router.push('/feedback' as never)}
              style={({ pressed }) => [styles.ctaButton, pressed && styles.pressed]}
            >
              <Text style={styles.ctaButtonText}>{lang === 'wo' ? 'Yónne sa xalaat' : 'Partager mon avis'}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  headerWrap: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: BASE.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(181, 98, 42, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: BASE.deepGreen,
    fontFamily: Fonts.serif,
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    marginTop: 2,
    color: BASE.terracotta,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  introCard: {
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: BASE.white,
    paddingHorizontal: 24,
    paddingVertical: 22,
    shadowColor: BASE.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(181, 98, 42, 0.1)',
  },
  introText: {
    color: BASE.cocoa,
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    paddingLeft: 4,
  },
  categoryIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    flex: 1,
    color: BASE.deepGreen,
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
  },
  questionsCard: {
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: BASE.white,
    shadowColor: BASE.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(181, 98, 42, 0.08)',
  },
  questionItem: {
    backgroundColor: BASE.white,
  },
  questionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(181, 98, 42, 0.08)',
  },
  questionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  questionText: {
    flex: 1,
    color: BASE.deepGreen,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  chevronWrap: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerWrap: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  answerText: {
    color: 'rgba(74, 47, 39, 0.88)',
    fontSize: 13,
    lineHeight: 22,
  },
  contactCtaCard: {
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 24,
    backgroundColor: BASE.deepGreen,
    paddingHorizontal: 24,
    paddingVertical: 26,
    alignItems: 'center',
    shadowColor: BASE.deepGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 5,
  },
  ctaOrbPrimary: {
    position: 'absolute',
    top: -34,
    right: -22,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(181, 98, 42, 0.35)',
  },
  ctaOrbSecondary: {
    position: 'absolute',
    bottom: -32,
    left: -18,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(212, 175, 55, 0.18)',
  },
  ctaBell: {
    marginBottom: 16,
  },
  ctaTitle: {
    marginBottom: 8,
    color: BASE.white,
    fontFamily: Fonts.serif,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  ctaDesc: {
    marginBottom: 16,
    color: 'rgba(255,255,255,0.86)',
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
  },
  ctaButton: {
    minWidth: 190,
    borderRadius: 16,
    backgroundColor: BASE.white,
    paddingHorizontal: 24,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  ctaButtonText: {
    color: BASE.deepGreen,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
});
