import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio, InterruptionModeIOS } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { LocationFinder } from '../components/article/LocationFinder';
import {
    useApp,
    type GoalId,
    type LifeSituation,
    type PersonalizationContext,
    type SensitiveOrientationSession,
    type UserProfile,
} from '../context/appcontext';
import { ARTICLES, type Article } from '../data/articles';
import {
    requestChatAssistantReply,
    type ChatAssistantReply,
} from '../utils/chatAssistantApi';
import {
    detectSensitiveChatIntent,
    getSensitiveChatFollowUpOptions,
    getSensitiveChatSupportLines,
    getSensitiveLocationTags,
} from '../utils/sensitiveOrientation';

const C = {
  deepGreen: '#1A3C34',
  green2: '#0F3D2E',
  beige: '#F5F1E6',
  beige2: '#EDE5D0',
  sand: '#E8DCC8',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  white: '#FDFAF5',
  gold: '#D4AF37',
  success: '#4CAF50',
  danger: '#C0392B',
};

type Message = {
  id: string;
  role: 'bot' | 'user';
  text: string;
  articles?: Article[];
  showLocation?: boolean;
  locationTags?: string[];
  audioUri?: string;
  audioDuration?: number;
  followUpOptions?: { fr: string; wo: string }[];
  imageUri?: string;
  referToProfessional?: boolean;
};

type SymptomFlow = {
  trigger: RegExp;
  questionsFr: string[];
  questionsWo: string[];
  severityKeywords: string[];
  articleIds: number[];
  locationTags: string[];
};

type Definition = {
  keywords: string[];
  fr: string;
  wo: string;
};

type ChipCategory = {
  labelFr: string;
  labelWo: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap | keyof typeof Ionicons.glyphMap;
  iconSet: 'mci' | 'ion';
  chips: { fr: string; wo: string }[];
};

type AdaptiveResponseOptions = {
  text: string;
  topic?: 'symptom' | 'orientation' | 'definition' | 'fallback' | 'welcome';
  severity?: 'normal' | 'urgent';
};

type FollowUpOption = { fr: string; wo: string };

const URGENT_KEYWORDS = [
  'urgence',
  'urgent',
  'hémorragie',
  'hemorragie',
  'saignement abondant',
  'beaucoup de sang',
  'douleur intense',
  'douleur insupportable',
  'évanouissement',
  'evanouissement',
  'malaise',
  'fièvre',
  'fievre',
  'je saigne beaucoup',
  'viol',
  'agression',
  'violence',
  'impossible de respirer',
];

const KEYWORD_MAP: Record<string, number[]> = {
  contraception: [1],
  pilule: [1],
  implant: [1],
  'préservatif': [1],
  preservatif: [1],
  'planning familial': [1],
  'stérilet': [1],
  diu: [1],
  grossesse: [2],
  enceinte: [2],
  'bébé': [2],
  bebe: [2],
  nutrition: [2],
  'prénatal': [2],
  prenatal: [2],
  'sage-femme': [2],
  'fertilité': [3],
  fertilite: [3],
  ovulation: [3],
  concevoir: [3],
  'tomber enceinte': [3],
  ist: [4],
  vih: [4],
  sida: [4],
  infection: [4],
  'dépistage': [4, 11, 12],
  depistage: [4, 11, 12],
  chlamydia: [4],
  'gonorrhée': [4],
  syphilis: [4],
  'hépatite': [4],
  'endométriose': [5],
  endometriose: [5],
  douleur: [5],
  'règles douloureuses': [5],
  'dysménorrhée': [5],
  sopk: [6],
  'ovaires polykystiques': [6],
  'cycle irrégulier': [6],
  irregulier: [6],
  hormones: [6, 8],
  'post-partum': [7],
  postpartum: [7],
  'après accouchement': [7],
  allaitement: [7],
  'baby blues': [7],
  'ménopause': [8],
  menopause: [8],
  'bouffées': [8],
  'bouffées de chaleur': [8],
  'infertilité': [9],
  infertilite: [9],
  pma: [9],
  fiv: [9],
  'diabète': [10],
  diabete: [10],
  hypertension: [10],
  'drépanocytose': [10],
  drepanocytose: [10],
  cancer: [11, 12, 13],
  'cancer col': [11],
  'cancer sein': [12],
  'cancer ovaire': [13],
  hpv: [11],
  papillomavirus: [11],
  mammographie: [12],
  autopalpation: [12],
  frottis: [11],
  tumeur: [11, 12, 13],
  oncologie: [11, 12, 13],
  'règles': [1, 3],
  regles: [1, 3],
  menstruation: [1, 3],
  cycle: [3, 6],
  'hygiène': [4],
  hygiene: [4],
  intime: [4],
  'bien-être': [8],
  bienetre: [8],
  stress: [5, 8],
};

const BRIEF_RESPONSES: Record<number, { fr: string; wo: string }> = {
  1: {
    fr: "La contraception, c'est un choix personnel. Pilule, implant, DIU, preservatif, methodes naturelles : chacune a ses avantages.",
    wo: 'Contraception moo di tannal bu dal ci sa yaram. Pilule, implant, DIU, preservatif, methodes naturelles.',
  },
  2: {
    fr: "Un bon suivi prenatal, une alimentation equilibree et un soutien emotionnel sont essentiels.",
    wo: 'Suivi prenatal bu baax, lekk bu sell ak ndimbal dagnuy am solo.',
  },
  3: {
    fr: "L'ovulation survient generalement 14 jours avant les regles. Glaire claire, legere douleur au bas-ventre.",
    wo: 'Ovulation dafay am ci fukk ak nent fan balaa regles yi.',
  },
  4: {
    fr: "Le depistage regulier est essentiel : beaucoup d'IST sont silencieuses mais traitables.",
    wo: 'Depistage bu siiw am na solo : IST yu bari danyu siiw waaye men nanu ko faj.',
  },
  5: {
    fr: "L'endometriose touche environ 1 femme sur 10. Un diagnostic precoce permet une meilleure prise en charge.",
    wo: 'Endometriose dafay am ci 1 jigeen ci 10. Diagnostic bu gaaw dafay dimbali.',
  },
  6: {
    fr: "Le SOPK peut provoquer des cycles irreguliers, de l'acne, et parfois une prise de poids. C'est traitable.",
    wo: 'SOPK men na def cycles yuy yees, acne, ak epp ci tolluwaayu yaram.',
  },
  7: {
    fr: "Les changements d'humeur, la fatigue et les defis de l'allaitement sont normaux. Prends soin de toi.",
    wo: 'Humeur buy soppi, nuul ak jafe-jafe ci allaitement dagnu normal.',
  },
  8: {
    fr: 'La menopause est une transition naturelle. Des solutions existent pour chaque symptome.',
    wo: 'Menopause mooy waxtu bu yaram bi di soppi, du feebar. Am na solution ci lepp.',
  },
  9: {
    fr: "L'infertilite touche femmes et hommes. La PMA offre des solutions.",
    wo: 'Infertilite dafa am ci jigeen ak goor. PMA am na solutions.',
  },
  10: {
    fr: 'Les maladies chroniques necessitent un suivi specifique pendant la vie reproductive.',
    wo: 'Feebar yu gudd soxla na suivi bu baax ci sa dund.',
  },
  11: {
    fr: 'Le cancer du col est presque entierement evitable grace au depistage et a la vaccination HPV.',
    wo: 'Cancer col uterus men nanu ko jiitu ci depistage ak vaccination HPV.',
  },
  12: {
    fr: "L'autopalpation mensuelle et la mammographie reguliere sauvent des vies.",
    wo: 'Autopalpation ci weer wu nekk ak mammographie dagnuy musal dund.',
  },
  13: {
    fr: 'Consulte rapidement si tu remarques des saignements inhabituels ou douleurs persistantes.',
    wo: 'Dem tabax bu gaaw bu gisee saignement wala douleur bu yagg.',
  },
};

const SYMPTOM_FLOWS: SymptomFlow[] = [
  {
    trigger: /\b(douleur|mal|maux|crampe|metti|yoor)\b/i,
    questionsFr: [
      'Ou ressens-tu cette douleur ? (bas-ventre, poitrine, dos, tete...)',
      'Depuis combien de temps as-tu ces douleurs ?',
      "Sur une echelle de 1 a 5, comment evaluerais-tu l'intensite ?",
    ],
    questionsWo: [
      'Fan la douleur bi nekk ? (biir, poitrine, ginnaaw, bopp...)',
      'Ndax yagg na la ?',
      'Ci 1 ba 5, naka la ?',
    ],
    severityKeywords: ['intense', 'insupportable', 'très', 'fort', 'forte', 'saigne', 'sang', '4', '5', 'urgence', 'epp', 'bu metti'],
    articleIds: [5, 6],
    locationTags: ['Gynecologie', 'Urgences'],
  },
  {
    trigger: /\b(saignement|sang|hémorragie|perte|tache|bleeding)\b/i,
    questionsFr: [
      'Est-ce que ce saignement est en dehors de tes regles habituelles ?',
      'Quelle est la couleur ? (rouge vif, brun, rose)',
      'Depuis combien de temps cela dure-t-il ?',
    ],
    questionsWo: [
      'Ndax saignement bi di nekk biir sa regles wala ci biti ?',
      'Ban couleur la ? (xonq, socolaat, rose)',
      'Yagg na naata bes ?',
    ],
    severityKeywords: ['abondant', 'beaucoup', 'caillot', 'rouge vif', "ne s'arrête", '3 jours', 'semaine', 'epp'],
    articleIds: [5, 11],
    locationTags: ['Gynecologie', 'Urgences'],
  },
  {
    trigger: /\b(démangeaison|brûlure|pertes|odeur|gratte|irritation|mycose)\b/i,
    questionsFr: [
      'Ou exactement ? (zone intime, vulve, vagin)',
      "As-tu des pertes inhabituelles (couleur, odeur) ?",
      'Depuis quand ressens-tu ces symptômes ?',
    ],
    questionsWo: [
      'Fan la ? (zone intime, vulve, vagin)',
      'Am nga pertes yu bees (couleur, semm) ?',
      'Ndax yagg na la ?',
    ],
    severityKeywords: ['fièvre', 'douleur', 'pus', 'verdâtre', 'fort', 'insupportable'],
    articleIds: [4],
    locationTags: ['IST', 'Gynecologie', 'Depistage'],
  },
  {
    trigger: /\b(retard|règles.*pas|ñàkk.*règles|pas.*règles|absence|aménorrhée)\b/i,
    questionsFr: [
      'Depuis combien de temps as-tu ce retard de regles ?',
      'As-tu eu des rapports sexuels non proteges recemment ?',
      "Ressens-tu d'autres symptômes ? (nausées, fatigue, seins sensibles)",
    ],
    questionsWo: [
      'Naata weer la naakk regles ?',
      'Am nga rapports sexuels bu naakk protection ?',
      'Am na lu la di am ? (nausee, nuul, sein buy metti)',
    ],
    severityKeywords: ['3 mois', 'plusieurs mois', 'test positif', 'enceinte'],
    articleIds: [2, 3, 6],
    locationTags: ['Gynecologie', 'Maternite'],
  },
  {
    trigger: /\b(bouffée|chaleur|sueur|insomnie|sécheresse|ménopause|50|45)\b/i,
    questionsFr: [
      'Quel âge as-tu ? Ces symptômes sont-ils récents ?',
      'Combien de bouffees de chaleur as-tu par jour environ ?',
      "Comment cela affecte-t-il ton quotidien ? (sommeil, humeur, energie)",
    ],
    questionsWo: [
      'Naata at ngaa am ? Ndax symptomes yi bees nanu ?',
      'Naata bouffees de chaleur ngay am ci bes bi ?',
      'Naka mu di soppee sa dund ? (nelaw, humeur, doole)',
    ],
    severityKeywords: ['beaucoup', 'ne dort plus', 'dépression', 'anxiété', 'tous les jours', 'epp'],
    articleIds: [8],
    locationTags: ['Gynecologie'],
  },
];

const LOCATION_KEYWORDS: { keywords: string[]; tags: string[] }[] = [
  { keywords: ['cancer', 'tumeur', 'mammographie', 'frottis', 'hpv'], tags: ['Oncologie', 'Depistage cancer'] },
  { keywords: ['urgence', 'hémorragie', 'douleur intense', 'fièvre'], tags: ['Urgences', 'Maternite'] },
  { keywords: ['ist', 'vih', 'sida', 'dépistage', 'chlamydia'], tags: ['IST', 'Depistage'] },
  { keywords: ['grossesse', 'enceinte', 'sage-femme'], tags: ['Maternite', 'Gynecologie'] },
  { keywords: ['contraception', 'planning familial', 'pilule'], tags: ['Planning familial'] },
  { keywords: ['gynécologue', 'médecin', 'hôpital', 'clinique'], tags: ['Gynecologie'] },
  { keywords: ['violence', 'viol', 'agression', 'excision'], tags: ['Urgences'] },
];

const FOLLOW_UPS: Record<
  string,
  {
    questionFr: string;
    questionWo: string;
    options: { fr: string; wo: string; refineKeywords: string[] }[];
  }
> = {
  contraception: {
    questionFr: 'Pour mieux te guider, peux-tu me preciser ta situation ?',
    questionWo: 'Ngir ma gena la dimbali, waxal ma sa waxtu :',
    options: [
      { fr: 'Je decouvre la contraception', wo: 'Mangi foog xam contraception', refineKeywords: ['contraception', 'pilule'] },
      { fr: 'Je veux changer de methode', wo: 'Begg naa soppi methode', refineKeywords: ['implant', 'stérilet'] },
      { fr: 'Contraception apres accouchement', wo: 'Contraception gannaaw doom', refineKeywords: ['post-partum', 'contraception'] },
      { fr: 'Planning familial / couple', wo: 'Planning familial / jekeur', refineKeywords: ['planning familial'] },
    ],
  },
  grossesse: {
    questionFr: 'A quel stade es-tu ?',
    questionWo: 'Fan ngay nekk ci gatt gi ?',
    options: [
      { fr: 'Je veux tomber enceinte', wo: 'Begg naa am doom', refineKeywords: ['fertilité', 'ovulation'] },
      { fr: 'Je suis enceinte', wo: 'Am naa gatt', refineKeywords: ['grossesse', 'prénatal'] },
      { fr: "Apres l'accouchement", wo: 'Gannaaw doom bi', refineKeywords: ['post-partum', 'allaitement'] },
    ],
  },
  cancer: {
    questionFr: 'De quel cancer souhaites-tu en savoir plus ?',
    questionWo: 'Ban cancer ngay begg xam ?',
    options: [
      { fr: 'Cancer du sein', wo: 'Cancer sein', refineKeywords: ['cancer sein', 'mammographie'] },
      { fr: 'Cancer du col uterin / HPV', wo: 'Cancer col uterus / HPV', refineKeywords: ['cancer col', 'hpv'] },
      { fr: 'Depistage en general', wo: 'Depistage bu epp', refineKeywords: ['dépistage'] },
    ],
  },
  ist: {
    questionFr: 'Que souhaites-tu savoir exactement ?',
    questionWo: 'Lu la begg xam ci IST ?',
    options: [
      { fr: 'Se proteger des IST', wo: 'Naakkati IST', refineKeywords: ['préservatif', 'ist'] },
      { fr: 'Je veux me faire depister', wo: 'Begg naa depistage', refineKeywords: ['dépistage', 'ist'] },
      { fr: 'Symptomes et traitements', wo: 'Signes ak faj', refineKeywords: ['infection', 'ist'] },
    ],
  },
  cycle: {
    questionFr: "Qu'est-ce qui te preoccupe ?",
    questionWo: 'Lu la di xalaat ?',
    options: [
      { fr: 'Regles douloureuses', wo: 'Regles yuy metti', refineKeywords: ['endométriose', 'douleur'] },
      { fr: 'Cycles irreguliers', wo: 'Cycle buy yees', refineKeywords: ['sopk', 'cycle irrégulier'] },
      { fr: 'Comprendre mon ovulation', wo: 'Xam sama ovulation', refineKeywords: ['ovulation', 'fertilité'] },
    ],
  },
  menopause: {
    questionFr: "Qu'est-ce qui te preoccupe le plus ?",
    questionWo: 'Lu la gena di xalaat ?',
    options: [
      { fr: 'Bouffees de chaleur', wo: 'Bouffees de chaleur', refineKeywords: ['ménopause', 'bouffées'] },
      { fr: "Changements d'humeur et sommeil", wo: 'Humeur ak nelaw', refineKeywords: ['ménopause', 'bien-être'] },
      { fr: 'Secheresse et inconfort', wo: 'Secheresse ak jafe-jafe', refineKeywords: ['ménopause'] },
      { fr: 'Traitements et solutions', wo: 'Faj ak solution', refineKeywords: ['ménopause', 'hormones'] },
    ],
  },
};

const DEFINITIONS: Definition[] = [
  {
    keywords: ['libido', 'désir sexuel', 'désir'],
    fr: "La libido, c'est le desir sexuel. Elle varie selon les hormones, le stress, l'age, la fatigue ou les emotions. C'est normal qu'elle fluctue.",
    wo: 'Libido mooy begg ci jef bu nit. Dafa soppi selon hormones, stress, at, nuul wala xalaat. Normal la bu am soppi.',
  },
  {
    keywords: ['utérus', 'uterus'],
    fr: "L'uterus est un organe situe dans le bas-ventre. C'est la que le bebe grandit pendant la grossesse.",
    wo: 'Uterus mooy organe bu nekk ci biir. Foofu la doom bi di mag ci gatt gi.',
  },
  {
    keywords: ['ovulation'],
    fr: "L'ovulation, c'est le moment ou un ovule est libere par l'ovaire. C'est la periode la plus fertile.",
    wo: 'Ovulation mooy waxtu bu ovule bi di genn ci ovaire bi. Mooy waxtu bu gena am fertilite.',
  },
  {
    keywords: ['clitoris'],
    fr: 'Le clitoris est un organe situe au sommet de la vulve, dont la fonction principale est le plaisir.',
    wo: 'Clitoris mooy organe bu nekk ci kaw vulve bi, bu am fonction neex.',
  },
  {
    keywords: ['vagin', 'vulve'],
    fr: "Le vagin est le canal interieur. La vulve, c'est la partie exterieure visible.",
    wo: 'Vagin mooy yoonu biir bi. Vulve mooy partie bu ci biti.',
  },
  {
    keywords: ['ménopause', 'menopause', 'préménopause'],
    fr: "La menopause marque l'arret definitif des regles, generalement entre 45 et 55 ans.",
    wo: 'Menopause mooy jeex ci regles yi, ci 45 ba 55 at.',
  },
];

const CHIP_CATEGORIES: ChipCategory[] = [
  {
    labelFr: 'Symptomes',
    labelWo: 'Signes',
    icon: 'stethoscope',
    iconSet: 'mci',
    chips: [
      { fr: "J'ai des douleurs au bas-ventre", wo: 'Am naa douleur ci biir' },
      { fr: 'Mes regles sont tres douloureuses', wo: 'Sama regles yi danyuy metti' },
      { fr: "J'ai des pertes inhabituelles", wo: 'Am naa pertes yu bees' },
      { fr: "J'ai un retard de regles", wo: 'Sama regles yi yaggul' },
    ],
  },
  {
    labelFr: 'Corps et cycles',
    labelWo: 'Yaram ak cycles',
    icon: 'moon-outline',
    iconSet: 'ion',
    chips: [
      { fr: 'Mon cycle est irregulier', wo: 'Sama cycle buy yees' },
      { fr: "Signes d'ovulation", wo: 'Signes ci ovulation' },
      { fr: 'Bouffees de chaleur', wo: 'Bouffees de chaleur' },
      { fr: "Fatigue et changements d'humeur", wo: 'Nuul ak humeur buy soppi' },
    ],
  },
  {
    labelFr: 'Contraception',
    labelWo: 'Contraception',
    icon: 'shield-outline',
    iconSet: 'ion',
    chips: [
      { fr: 'Quelle contraception choisir ?', wo: 'Ban contraception maa tann ?' },
      { fr: 'Effets secondaires de la pilule', wo: 'Pilule bi ak effets secondaires' },
      { fr: 'Implant ou DIU ?', wo: 'Implant wala DIU ?' },
    ],
  },
  {
    labelFr: 'Grossesse',
    labelWo: 'Gatt',
    icon: 'baby-face-outline',
    iconSet: 'mci',
    chips: [
      { fr: 'Suivi de grossesse', wo: 'Suivi gatt' },
      { fr: 'Nutrition prenatale', wo: 'Lekk ci gatt' },
      { fr: 'Post-partum', wo: 'Apres doom' },
    ],
  },
  {
    labelFr: 'Depistage',
    labelWo: 'Depistage',
    icon: 'ribbon',
    iconSet: 'mci',
    chips: [
      { fr: 'Quand faire une mammographie ?', wo: 'Kan la def mammographie ?' },
      { fr: 'Depistage HPV', wo: 'Depistage HPV' },
      { fr: 'Je veux me faire depister IST', wo: 'Begg naa depistage IST' },
    ],
  },
  {
    labelFr: 'Menopause',
    labelWo: 'Menopause',
    icon: 'leaf',
    iconSet: 'mci',
    chips: [
      { fr: "Qu'est-ce que la menopause ?", wo: 'Lan la menopause ?' },
      { fr: 'Solutions naturelles', wo: 'Solutions bu aada' },
      { fr: 'Secheresse vaginale', wo: 'Secheresse vaginale' },
    ],
  },
  {
    labelFr: 'Comprendre',
    labelWo: 'Xam',
    icon: 'book-open-outline',
    iconSet: 'ion',
    chips: [
      { fr: "Qu'est-ce que la libido ?", wo: 'Lan la libido ?' },
      { fr: "Explique-moi l'ovulation", wo: 'Lan la ovulation ?' },
      { fr: "C'est quoi le clitoris ?", wo: 'Lan la clitoris ?' },
      { fr: "Qu'est-ce que l'uterus ?", wo: 'Lan la uterus ?' },
    ],
  },
];

function detectLocationTags(text: string): string[] | null {
  const lower = text.toLowerCase();
  for (const group of LOCATION_KEYWORDS) {
    if (group.keywords.some((keyword) => lower.includes(keyword))) {
      return group.tags;
    }
  }
  return null;
}

function hasUrgentSignal(text: string) {
  const lower = text.toLowerCase();
  return URGENT_KEYWORDS.some((keyword) => lower.includes(keyword));
}

function scoreArticleRelevance(text: string) {
  const lower = text.toLowerCase();
  const scores = new Map<number, number>();

  Object.entries(KEYWORD_MAP).forEach(([keyword, ids]) => {
    if (lower.includes(keyword)) {
      ids.forEach((id) => {
        scores.set(id, (scores.get(id) ?? 0) + keyword.length);
      });
    }
  });

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
}

function findDefinition(text: string): { fr: string; wo: string } | null {
  const lower = text.toLowerCase();
  const isQuestion =
    /qu.?est.?ce.?que|c.?est.?quoi|définition|defini|explique|explain|lan la|lu mu di|lu mooy|naka la|comment ça marche|comment ca marche|à quoi sert|a quoi sert/i.test(
      lower
    );

  if (!isQuestion) {
    return null;
  }

  for (const definition of DEFINITIONS) {
    if (definition.keywords.some((keyword) => lower.includes(keyword))) {
      return definition;
    }
  }

  return null;
}

function detectBroadTopic(text: string): string | null {
  const lower = text.toLowerCase();
  const preciseKeywords = [
    'pilule',
    'implant',
    'diu',
    'stérilet',
    'mammographie',
    'frottis',
    'autopalpation',
    'hpv',
    'vih',
    'sida',
    'chlamydia',
    'ovulation',
    'allaitement',
    'sopk',
    'endométriose',
    'fiv',
    'pma',
    'diabète',
    'hypertension',
    'drépanocytose',
  ];

  if (preciseKeywords.some((keyword) => lower.includes(keyword))) {
    return null;
  }

  const topicMap: [string[], string][] = [
    [['contraception', 'contracepti', 'méthode contra'], 'contraception'],
    [['grossesse', 'enceinte', 'bébé', 'maternité', 'accouche'], 'grossesse'],
    [['cancer', 'tumeur', 'oncologie'], 'cancer'],
    [['ist', 'infection sexuel', 'maladie sexuel'], 'ist'],
    [['ménopause', 'menopause', 'periménopause', 'bouffées de chaleur'], 'menopause'],
    [['règles', 'cycle', 'menstruation', 'regles'], 'cycle'],
  ];

  for (const [keywords, topic] of topicMap) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      return topic;
    }
  }

  return null;
}

function inferLifeStage(
  personalization: PersonalizationContext,
  lifeSituation: LifeSituation | null,
  goals: GoalId[]
): 'adolescent' | 'contraception' | 'pregnancy' | 'postpartum' | 'menopause' | 'general' {
  if (lifeSituation === 'pregnant' || goals.includes('grossesse')) {
    return 'pregnancy';
  }
  if (lifeSituation === 'postpartum') {
    return 'postpartum';
  }
  if (lifeSituation === 'contraception') {
    return 'contraception';
  }
  if (lifeSituation === 'menopause' || goals.includes('menopause') || personalization.ageRange === '50+') {
    return 'menopause';
  }
  if (personalization.ageRange === '15-17') {
    return 'adolescent';
  }
  return 'general';
}

function applySocialNorms(text: string, personalization: PersonalizationContext, wo: boolean): string {
  let adapted = text;

  if (personalization.socialNorms === 'conservative') {
    const replacements = wo
      ? [
          ['rapports sexuels', 'rapports intimes'],
          ['sexe', 'intimite'],
        ]
      : [
          ['rapports sexuels', 'rapports intimes'],
          ['rapport sexuel', 'rapport intime'],
          ['sexe', 'intimite'],
        ];

    replacements.forEach(([from, to]) => {
      adapted = adapted.replace(new RegExp(from, 'gi'), to);
    });
  }

  return adapted;
}

function adaptEducationLevel(text: string, personalization: PersonalizationContext, wo: boolean): string {
  let adapted = text;

  if (personalization.educationLevel === 'basic') {
    const replacements = wo
      ? [
          ['professionnel de sante', 'sage-femme walla docteur'],
          ['diagnostic', 'xam bu leer ci sa xaalis wergu-yaram'],
        ]
      : [
          ['professionnel de sante', 'sage-femme ou médecin'],
          ['consultation', 'avis d’un soignant'],
          ['diagnostic', 'avis médical précis'],
        ];

    replacements.forEach(([from, to]) => {
      adapted = adapted.replace(new RegExp(from, 'gi'), to);
    });
  }

  if (personalization.educationLevel === 'advanced') {
    const detail = wo
      ? '\n\nSu fekkee dangay soxla lu gën a leer, man naa joxe itam leeral bu gëna tekinik ci anatomi, hormones walla facteurs de risque.'
      : '\n\nSi tu le souhaites, je peux aussi détailler les mécanismes biologiques, les facteurs de risque et le vocabulaire médical précis.';
    adapted += detail;
  }

  return adapted;
}

function buildAdaptiveText(
  options: AdaptiveResponseOptions,
  personalization: PersonalizationContext,
  userProfile: UserProfile,
  discreteMode: boolean,
  sensitiveOrientation: SensitiveOrientationSession,
  wo: boolean
): string {
  const { text, topic = 'fallback', severity = 'normal' } = options;
  const tone = personalization.preferredTone ?? 'friendly';
  const needsSupport = personalization.needsSupport;
  const lines: string[] = [];
  const firstName = userProfile.name?.trim().split(' ')[0] ?? '';

  if (topic === 'welcome') {
    return adaptEducationLevel(applySocialNorms(text, personalization, wo), personalization, wo);
  }

  if (tone === 'sisterly') {
    lines.push(
      wo
        ? firstName
          ? `${firstName}, dégg naa la.`
          : 'Dégg naa la.'
        : firstName
          ? `${firstName}, je t'ecoute.`
          : "Je t'ecoute."
    );
  } else if (tone === 'formal') {
    lines.push(
      wo
        ? 'Jerejef ci sa confiance.'
        : 'Merci pour votre confiance.'
    );
  } else {
    lines.push(
      wo
        ? 'Jerejef ci sa confiance.'
        : 'Merci pour ta confiance.'
    );
  }

  if (needsSupport && topic !== 'definition') {
    lines.push(
      severity === 'urgent'
        ? wo
          ? 'Li ngay yëgël am na solo, te doo ci nekk doomu-ream rekk.'
          : "Ce que tu decris merite de l'attention, et tu n'as pas a porter cela seule."
        : wo
          ? 'Doo ci yoon bi rekk.'
          : "Tu n'es pas seule."
    );
  }

  if (discreteMode && (personalization.privacyLevel === 'high' || personalization.privacyLevel === 'very-high')) {
    lines.push(
      wo
        ? 'Soo bëggee, men nga wax ak baat yu gatt ngir nga des ci sutura.'
        : 'Si tu preferes rester discrete, tu peux aussi ecrire avec des mots simples ou tres courts.'
    );
  }

  getSensitiveChatSupportLines(
    sensitiveOrientation,
    wo ? 'wo' : 'fr',
    topic === 'definition' ? 'definition' : topic
  ).forEach((line) => lines.push(line));

  lines.push(text);

  const adapted = lines.join('\n\n');
  return adaptEducationLevel(applySocialNorms(adapted, personalization, wo), personalization, wo);
}

function getAdaptiveFollowUpOptions(
  topic: 'symptom' | 'orientation' | 'definition' | 'fallback' | 'image' | 'welcome',
  personalization: PersonalizationContext,
  stage: 'adolescent' | 'contraception' | 'pregnancy' | 'postpartum' | 'menopause' | 'general',
  sensitiveOrientation: SensitiveOrientationSession
): FollowUpOption[] {
  const priorityOptions: FollowUpOption[] = [];
  const options: FollowUpOption[] = [];

  const pushPriority = (option: FollowUpOption) => {
    if (!priorityOptions.some((item) => item.fr === option.fr && item.wo === option.wo)) {
      priorityOptions.push(option);
    }
  };

  const pushUnique = (option: FollowUpOption) => {
    if (!options.some((item) => item.fr === option.fr && item.wo === option.wo)) {
      options.push(option);
    }
  };

  if (topic !== 'definition') {
    getSensitiveChatFollowUpOptions(sensitiveOrientation).forEach((option) =>
      pushPriority(option)
    );
  }

  if (topic === 'welcome') {
    if (stage === 'pregnancy') {
      pushUnique({ fr: 'Question sur ma grossesse', wo: 'Laaj ci sama gatt' });
      pushUnique({ fr: 'Signes qui doivent faire consulter', wo: 'Signes yu war a tax ma dem tabax' });
    } else if (stage === 'postpartum') {
      pushUnique({ fr: 'Fatigue apres accouchement', wo: 'Fatigue gannaaw doom' });
      pushUnique({ fr: "Question sur l'allaitement", wo: "Laaj ci allaitement" });
    } else if (stage === 'menopause') {
      pushUnique({ fr: 'Bouffees de chaleur', wo: 'Bouffees de chaleur' });
      pushUnique({ fr: 'Sommeil et humeur', wo: 'Nelaw ak humeur' });
    } else if (stage === 'contraception') {
      pushUnique({ fr: 'Choisir une contraception', wo: 'Tannal contraception' });
      pushUnique({ fr: 'Effets secondaires', wo: 'Effets secondaires' });
    } else {
      pushUnique({ fr: "J'ai des symptômes à décrire", wo: 'Am naa signes begg naa wax' });
      pushUnique({ fr: 'J’ai une question de santé', wo: 'Am naa laaj ci wer' });
    }
    pushUnique({ fr: 'Trouver un centre de santé', wo: 'Seet ker wu jamm' });
  }

  if (topic === 'symptom') {
    pushUnique({ fr: 'Trouver un professionnel pres de moi', wo: 'Seet tabax bu jege ci man' });
    if (personalization.needsSupport) {
      pushUnique({ fr: "J'ai besoin d'etre rassuree", wo: 'Soxla naa ndimbal ak rassurance' });
    }
    if (personalization.privacyLevel === 'high' || personalization.privacyLevel === 'very-high') {
      pushUnique({ fr: 'Je prefere rester discrete', wo: 'Begg naa des ci sutura' });
    }
    pushUnique({ fr: "J'ai d'autres questions", wo: 'Am naa yeneen laaj' });
  }

  if (topic === 'definition') {
    pushUnique({ fr: "Explique-moi plus simplement", wo: 'Leeral ma ko bu gëna yomb' });
    if (personalization.educationLevel === 'advanced') {
      pushUnique({ fr: 'Donne-moi plus de details medicaux', wo: 'Jox ma detalles medicaux' });
    }
    pushUnique({ fr: 'Trouver un professionnel', wo: 'Seet tabax' });
  }

  if (topic === 'orientation') {
    if (stage === 'contraception') {
      pushUnique({ fr: 'Comparer les methodes', wo: 'Melooy méthodes yi' });
    }
    if (stage === 'pregnancy') {
      pushUnique({ fr: 'Suivi de grossesse', wo: 'Suivi gatt' });
    }
    if (stage === 'menopause') {
      pushUnique({ fr: 'Solutions pour la menopause', wo: 'Solutions ci menopause' });
    }
    if (personalization.privacyLevel === 'high' || personalization.privacyLevel === 'very-high') {
      pushUnique({ fr: 'Conseils discrets', wo: 'Conseils yu sutura' });
    }
    pushUnique({ fr: "J'ai une autre question", wo: 'Am naa beneen laaj' });
  }

  if (topic === 'image') {
    pushUnique({ fr: "J'ai des douleurs", wo: 'Am naa douleur' });
    pushUnique({ fr: "J'ai des demangeaisons", wo: 'Am naa demangeaison' });
    if (personalization.privacyLevel !== 'low') {
      pushUnique({ fr: "Je prefere lecrire discretement", wo: 'Begg naa ko bind ci sutura' });
    }
    pushUnique({ fr: 'Consulter un professionnel', wo: 'Dem tabax' });
  }

  if (topic === 'fallback') {
    if (stage === 'adolescent') {
      pushUnique({ fr: 'Question sur mon cycle', wo: 'Laaj ci sama cycle' });
      pushUnique({ fr: 'Mon corps change', wo: 'Sama yaram day soppi' });
    } else if (stage === 'pregnancy') {
      pushUnique({ fr: 'Question sur ma grossesse', wo: 'Laaj ci sama gatt' });
      pushUnique({ fr: 'Je ne me sens pas bien', wo: 'Dama sonn' });
    } else if (stage === 'menopause') {
      pushUnique({ fr: 'Question sur la menopause', wo: 'Laaj ci menopause' });
      pushUnique({ fr: 'Bouffees de chaleur', wo: 'Bouffees de chaleur' });
    } else {
      pushUnique({ fr: "J'ai des symptomes", wo: 'Am naa signes' });
      pushUnique({ fr: 'Question sur mon cycle', wo: 'Laaj ci sama cycle' });
    }
    pushUnique({ fr: 'Trouver un centre de sante', wo: 'Seet ker wu jamm' });
  }

  return [...priorityOptions, ...options].slice(0, 4);
}

function getAdaptiveChipCategories(
  personalization: PersonalizationContext,
  stage: 'adolescent' | 'contraception' | 'pregnancy' | 'postpartum' | 'menopause' | 'general',
  wo: boolean
): ChipCategory[] {
  let categories = CHIP_CATEGORIES;

  if (personalization.privacyLevel === 'high' || personalization.privacyLevel === 'very-high') {
    categories = categories.map((category) => {
      if (category.labelFr === 'Comprendre') {
        return {
          ...category,
          chips: category.chips.filter((chip) => !/(clitoris|libido)/i.test(chip.fr)),
        };
      }
      return category;
    });
  }

  const prioritizedLabels =
    stage === 'pregnancy'
      ? ['Grossesse', 'Symptomes', 'Depistage']
      : stage === 'postpartum'
        ? ['Grossesse', 'Symptomes', 'Corps et cycles']
        : stage === 'menopause'
          ? ['Menopause', 'Corps et cycles', 'Symptomes']
          : stage === 'contraception'
            ? ['Contraception', 'Symptomes', 'Depistage']
            : stage === 'adolescent'
              ? ['Corps et cycles', 'Symptomes', 'Comprendre']
              : ['Symptomes', 'Corps et cycles', 'Contraception'];

  const ordered = [...categories].sort((a, b) => {
    const ai = prioritizedLabels.indexOf(a.labelFr);
    const bi = prioritizedLabels.indexOf(b.labelFr);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  if (personalization.socialNorms === 'conservative' && !wo) {
    return ordered.map((category) => ({
      ...category,
      chips: category.chips.map((chip) => ({
        ...chip,
        fr: chip.fr.replace(/sexuel/gi, 'intime'),
      })),
    }));
  }

  return ordered;
}

function PulseDots() {
  const values = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const loops = values.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 140),
          Animated.timing(value, { toValue: -4, duration: 280, useNativeDriver: true }),
          Animated.timing(value, { toValue: 0, duration: 280, useNativeDriver: true }),
          Animated.delay(140),
        ])
      )
    );

    loops.forEach((loop) => loop.start());

    return () => {
      loops.forEach((loop) => loop.stop());
    };
  }, [values]);

  return (
    <View style={styles.typingWrap}>
      {values.map((value, index) => (
        <Animated.View
          key={index}
          style={[
            styles.typingDot,
            {
              transform: [{ translateY: value }],
            },
          ]}
        />
      ))}
    </View>
  );
}

function RecordingWaveform() {
  const bars = useRef(Array.from({ length: 12 }, () => new Animated.Value(0.35))).current;

  useEffect(() => {
    const loops = bars.map((bar, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 45),
          Animated.timing(bar, { toValue: 1, duration: 220, useNativeDriver: false }),
          Animated.timing(bar, { toValue: 0.35, duration: 220, useNativeDriver: false }),
        ])
      )
    );
    loops.forEach((loop) => loop.start());
    return () => {
      loops.forEach((loop) => loop.stop());
    };
  }, [bars]);

  return (
    <View style={styles.recordingWaveform}>
      {bars.map((bar, index) => (
        <Animated.View
          key={index}
          style={[
            styles.recordingBar,
            {
              transform: [{ scaleY: bar }],
            },
          ]}
        />
      ))}
    </View>
  );
}

function VoiceMessagePlayer({
  uri,
  duration,
  isUser,
}: {
  uri: string;
  duration?: number;
  isUser: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (soundRef.current) {
        void soundRef.current.unloadAsync();
      }
    };
  }, []);

  const stop = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => undefined);
      await soundRef.current.unloadAsync().catch(() => undefined);
      soundRef.current = null;
    }
    setPlaying(false);
    setProgress(0);
  }, []);

  const toggle = useCallback(async () => {
    if (playing) {
      await stop();
      return;
    }

    const sound = new Audio.Sound();
    try {
      await sound.loadAsync({ uri });
      soundRef.current = sound;
      await sound.playAsync();
      setPlaying(true);

      timerRef.current = setInterval(async () => {
        if (!soundRef.current) {
          return;
        }
        const status = await soundRef.current.getStatusAsync();
        if (!status.isLoaded) {
          return;
        }
        if (status.didJustFinish) {
          await stop();
          return;
        }
        if (status.durationMillis && status.positionMillis != null) {
          setProgress(status.positionMillis / status.durationMillis);
        }
      }, 150);
    } catch {
      await stop();
    }
  }, [playing, stop, uri]);

  const waveColor = isUser ? C.beige : C.terracotta;
  const idleColor = isUser ? 'rgba(245,241,230,0.28)' : 'rgba(26,60,52,0.15)';

  return (
    <View style={styles.voicePlayer}>
      <Pressable onPress={() => void toggle()} style={[styles.voiceButton, isUser ? styles.voiceButtonUser : styles.voiceButtonBot]}>
        <Ionicons name={playing ? 'pause' : 'play'} size={14} color={isUser ? C.beige : C.deepGreen} />
      </Pressable>

      <View style={styles.voiceBars}>
        {Array.from({ length: 20 }).map((_, index) => {
          const heights = [0.3, 0.6, 0.9, 0.5, 0.8, 0.4, 1, 0.6, 0.7, 0.3, 0.5, 0.8, 0.4, 0.9, 0.6, 0.5, 0.7, 0.3, 0.8, 0.5];
          return (
            <View
              key={index}
              style={[
                styles.voiceBar,
                {
                  height: 18 * heights[index],
                  backgroundColor: index / 20 <= progress ? waveColor : idleColor,
                },
              ]}
            />
          );
        })}
      </View>

      <Text style={[styles.voiceDuration, isUser ? styles.voiceDurationUser : styles.voiceDurationBot]}>
        {duration ? `${Math.floor(duration)}s` : ''}
      </Text>
    </View>
  );
}

export default function ChatScreen() {
  const router = useRouter();
  const {
    language,
    oralMode,
    userProfile,
    discreteMode,
    personalization,
    selectedGoals,
    lifeSituation,
    sensitiveOrientation,
  } = useApp();
  const wo = language === 'wo';
  const lifeStage = inferLifeStage(personalization, lifeSituation, selectedGoals);
  const chipCategories = React.useMemo(
    () => getAdaptiveChipCategories(personalization, lifeStage, wo),
    [lifeStage, personalization, wo]
  );

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [activeChipCat, setActiveChipCat] = useState(0);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [pendingBotSpeechId, setPendingBotSpeechId] = useState<string | null>(null);

  const messagesEndRef = useRef<ScrollView | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const symptomFlowRef = useRef<{ flow: SymptomFlow; step: number; answers: string[] } | null>(null);
  const pendingTopicRef = useRef<string | null>(null);

  const getFirstName = useCallback(() => {
    const fullName = userProfile.name?.trim();
    if (!fullName) {
      return '';
    }
    return fullName.split(' ')[0] ?? '';
  }, [userProfile.name]);

  const buildWelcomeText = useCallback(() => {
    const firstName = getFirstName();
    const stage = inferLifeStage(personalization, lifeSituation, selectedGoals);
    const sensitiveWelcomeLines = getSensitiveChatSupportLines(
      sensitiveOrientation,
      wo ? 'wo' : 'fr',
      'welcome'
    );
    const privacyHint =
      discreteMode || personalization.privacyLevel === 'high' || personalization.privacyLevel === 'very-high'
        ? wo
          ? 'Soo bëggee, men nga wax ak baat yu gatt ngir nga des ci sutura.'
          : 'Si tu veux, tu peux parler de facon tres discrete et avec peu de details.'
        : wo
          ? 'Lu nekk siiw la fii.'
          : 'Tout est confidentiel ici.';
    const stageHint = (() => {
      if (wo) {
        switch (stage) {
          case 'adolescent':
            return 'Men nga laaj ci sa cycle, changements yu yaram walla laaj yu bees.';
          case 'contraception':
            return 'Men nga laaj ci contraception, effets secondaires walla ban methode moo gën ci yaw.';
          case 'pregnancy':
            return 'Men nga laaj ci gatt, suivi, lekk ak signes yu war a tax nga seet tabax.';
          case 'postpartum':
            return 'Men nga laaj ci gannaaw doom, allaitement, fatigue walla soppi humeur.';
          case 'menopause':
            return 'Men nga laaj ci menopause, bouffees de chaleur, nelaw walla bien-etre.';
          default:
            return 'Men nga wax sa symptomes, laaj ci sa cycle, wala yonni ma nataal ngir ma gena xam.';
        }
      }

      switch (stage) {
        case 'adolescent':
          return 'Tu peux me parler de ton cycle, des changements de ton corps ou de questions intimes en toute securite.';
        case 'contraception':
          return 'Tu peux me demander un comparatif des methodes, des effets secondaires ou une aide pour faire un choix.';
        case 'pregnancy':
          return 'Tu peux me parler de grossesse, de suivi, d\'alimentation ou de signes qui doivent faire consulter.';
        case 'postpartum':
          return "Tu peux me parler du post-partum, de l'allaitement, de la fatigue ou des changements d'humeur.";
        case 'menopause':
          return 'Tu peux me parler de menopause, de bouffees de chaleur, du sommeil ou du confort intime.';
        default:
          return "Tu peux me décrire tes symptômes, poser une question, ou m'envoyer une photo pour m'aider à comprendre.";
      }
    })();

    if (wo) {
      const greeting = firstName
        ? `Salaam aleikum ${firstName}! Man la sa assistante SaxalWer.`
        : 'Salaam aleikum! Man la sa assistante SaxalWer.';
      return buildAdaptiveText(
        {
          text: [greeting, stageHint, privacyHint, ...sensitiveWelcomeLines].join('\n\n'),
          topic: 'welcome',
        },
        personalization,
        userProfile,
        discreteMode,
        sensitiveOrientation,
        wo
      );
    }
    const greeting = firstName
      ? `Bonjour ${firstName} ! Je suis ton assistante SaxalWer.`
      : 'Bonjour ! Je suis ton assistante SaxalWer.';
    return buildAdaptiveText(
      {
        text: [greeting, stageHint, privacyHint, ...sensitiveWelcomeLines].join('\n\n'),
        topic: 'welcome',
      },
      personalization,
      userProfile,
      discreteMode,
      sensitiveOrientation,
      wo
    );
  }, [
    discreteMode,
    getFirstName,
    lifeSituation,
    personalization,
    selectedGoals,
    sensitiveOrientation,
    userProfile,
    wo,
  ]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'bot',
          text: buildWelcomeText(),
          followUpOptions: getAdaptiveFollowUpOptions(
            'welcome',
            personalization,
            lifeStage,
            sensitiveOrientation
          ),
        },
      ]);
    }
  }, [buildWelcomeText, lifeStage, messages.length, personalization, sensitiveOrientation]);

  useEffect(() => {
    if (activeChipCat >= chipCategories.length) {
      setActiveChipCat(0);
    }
  }, [activeChipCat, chipCategories.length]);

  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages, isTyping]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    return () => {
      Speech.stop();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (recordingRef.current) {
        void recordingRef.current.stopAndUnloadAsync().catch(() => undefined);
      }
    };
  }, []);

  const findRelevantArticles = useCallback((text: string): Article[] => {
    const rankedIds = scoreArticleRelevance(text);
    return rankedIds
      .map((id) => ARTICLES.find((article) => article.id === id))
      .filter((article): article is Article => Boolean(article))
      .slice(0, 3);
  }, []);

  const isSevere = useCallback((answers: string[], flow: SymptomFlow) => {
    const combined = answers.join(' ').toLowerCase();
    return flow.severityKeywords.some((keyword) => combined.includes(keyword));
  }, []);

  const stopTTS = useCallback(() => {
    Speech.stop();
    setPlayingMsgId(null);
  }, []);

  const speakMessage = useCallback(
    (message: Message) => {
      if (playingMsgId === message.id) {
        stopTTS();
        return;
      }

      stopTTS();
      setPlayingMsgId(message.id);
      Speech.speak(message.text, {
        language: 'fr-FR',
        rate: 0.9,
        onDone: () => setPlayingMsgId(null),
        onStopped: () => setPlayingMsgId(null),
        onError: () => setPlayingMsgId(null),
      });
    },
    [playingMsgId, stopTTS]
  );

  useEffect(() => {
    if (!oralMode || !pendingBotSpeechId) {
      return;
    }
    const message = messages.find((item) => item.id === pendingBotSpeechId);
    if (message && message.role === 'bot' && !message.audioUri) {
      speakMessage(message);
    }
    setPendingBotSpeechId(null);
  }, [messages, oralMode, pendingBotSpeechId, speakMessage]);

  const generateLocalResponse = useCallback(
    (userText: string, imageUri?: string): Message => {
      const adaptText = (
        text: string,
        options?: Omit<AdaptiveResponseOptions, 'text'>
      ) =>
        buildAdaptiveText(
          { text, ...options },
          personalization,
          userProfile,
          discreteMode,
          sensitiveOrientation,
          wo
        );

      const resolvedLocationTags = (tags: string[] | null | undefined) =>
        getSensitiveLocationTags(sensitiveOrientation, tags ?? []);

      if (hasUrgentSignal(userText)) {
        return {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: adaptText(
            wo
              ? 'Li ngay wax dafay wone ne dafa wara jëfandikoo jàppale bu gaaw. Manuma def diagnostic, waaye li gëna am solo mooy nga seet professionnel de sante wala service d’urgence bu gaaw.'
              : "Ce que tu décris peut demander une aide médicale rapide. Je ne peux pas poser de diagnostic, mais le plus important est de consulter rapidement un professionnel de santé ou un service d'urgence.",
            { topic: 'orientation', severity: 'urgent' }
          ),
          referToProfessional: true,
          showLocation: true,
          locationTags: resolvedLocationTags(
            detectLocationTags(userText) ?? ['Urgences', 'Gynecologie']
          ),
          followUpOptions: getAdaptiveFollowUpOptions(
            'orientation',
            personalization,
            lifeStage,
            sensitiveOrientation
          ),
        };
      }

      const sensitiveIntent = detectSensitiveChatIntent(userText);
      if (sensitiveIntent) {
        if (sensitiveIntent === 'neutral-words') {
          return {
            id: `bot-${Date.now()}`,
            role: 'bot',
            text: adaptText(
              wo
                ? 'Baax na. Men nga wax ko ak ay kadu yu yomb te yu dal. Ci misaal: "damaa am metit ci suuf", "am naa xel mu dalul", walla "am naa benn doute". Dinaa la topp te du ma la àtte.'
                : 'Tres bien. Tu peux utiliser des mots simples et neutres. Par exemple : "j ai une gene", "j ai mal en bas", "je ne me sens pas bien", ou "j ai un doute". Je te suivrai sans jugement.',
              { topic: 'symptom' }
            ),
            followUpOptions: getAdaptiveFollowUpOptions(
              'symptom',
              personalization,
              lifeStage,
              sensitiveOrientation
            ),
          };
        }

        if (sensitiveIntent === 'prepare-consultation') {
          return {
            id: `bot-${Date.now()}`,
            role: 'bot',
            text: adaptText(
              wo
                ? 'Men nga tambalee ak lii: "Salaam, soxla naa conseil ci benn mbir bu sutura. Am naa [symptome] depuis [duree]." Soo bëggee, man naa la dimbali nga ko soppi ci sa waxin.'
                : 'Tu peux partir de cette phrase courte : "Bonjour, j ai besoin d un conseil pour un souci intime. J ai [symptome] depuis [duree]." Si tu veux, je peux t aider a la reformuler avec tes mots.',
              { topic: 'orientation' }
            ),
            followUpOptions: getAdaptiveFollowUpOptions(
              'orientation',
              personalization,
              lifeStage,
              sensitiveOrientation
            ),
          };
        }

        if (sensitiveIntent === 'decision-support') {
          return {
            id: `bot-${Date.now()}`,
            role: 'bot',
            text: adaptText(
              wo
                ? 'Man nanu xool ndank ndank li nga mën a dogal sa bopp, li nga mën a laaj ci professionnel de sante, ak naka nga mën a ubbi waxtaan bi ci sutura.'
                : 'On peut clarifier ensemble ce qui depend de toi, ce que tu peux demander a un soignant, et comment ouvrir la discussion sans tout dire d un coup.',
              { topic: 'orientation' }
            ),
            followUpOptions: getAdaptiveFollowUpOptions(
              'orientation',
              personalization,
              lifeStage,
              sensitiveOrientation
            ),
          };
        }

        if (sensitiveIntent === 'step-by-step') {
          return {
            id: `bot-${Date.now()}`,
            role: 'bot',
            text: adaptText(
              wo
                ? 'Baax na. Dem nanu ndank ndank: 1. Ban mbir moo gëna la sonal leegi ? 2. Kañ la tambali ? 3. Ndax dafa metti lool walla man nga ko muñ ?'
                : 'D accord. On va faire simple, pas a pas : 1. Qu est-ce qui te gene le plus en ce moment ? 2. Depuis quand ? 3. Est-ce supportable ou tres intense ?',
              { topic: 'symptom' }
            ),
            followUpOptions: getAdaptiveFollowUpOptions(
              'symptom',
              personalization,
              lifeStage,
              sensitiveOrientation
            ),
          };
        }

        const locationIntentTags =
          sensitiveIntent === 'accessible-location'
            ? ['Planning familial']
            : sensitiveIntent === 'nearby-location'
              ? ['Consultations']
              : ['Conseils', 'Planning familial'];

        const locationIntentText =
          sensitiveIntent === 'accessible-location'
            ? wo
              ? 'Maa ngi jox la ay options yu gëna yomb ak premier recours:'
              : 'Je te montre d abord des options souvent plus accessibles ou de premier recours :'
            : sensitiveIntent === 'nearby-location'
              ? wo
                ? 'Maa ngi jox la ay berab yu gëna jege ngir yombal deplacement bi:'
                : 'Je te montre d abord des lieux plus proches pour limiter le deplacement :'
              : wo
                ? 'Maa ngi jox la ay berab yu gëna sutura te jëm ci conseils:'
                : 'Je te montre d abord des lieux plus discrets et orientes conseil :';

        return {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: adaptText(locationIntentText, { topic: 'orientation' }),
          showLocation: true,
          locationTags: resolvedLocationTags(locationIntentTags),
          followUpOptions: getAdaptiveFollowUpOptions(
            'orientation',
            personalization,
            lifeStage,
            sensitiveOrientation
          ),
        };
      }

      if (symptomFlowRef.current) {
        const { flow, step, answers } = symptomFlowRef.current;
        const nextAnswers = [...answers, userText];

        if (step < flow.questionsFr.length - 1) {
          symptomFlowRef.current = { flow, step: step + 1, answers: nextAnswers };
          return {
            id: `bot-${Date.now()}`,
            role: 'bot',
            text: adaptText(
              wo
                ? `Jerejef ci sa tontu. ${flow.questionsWo[step + 1]}`
                : `Merci pour ta reponse. ${flow.questionsFr[step + 1]}`,
              { topic: 'symptom' }
            ),
          };
        }

        symptomFlowRef.current = null;
        const severe = isSevere(nextAnswers, flow);
        const articles = ARTICLES.filter((article) => flow.articleIds.includes(article.id)).slice(0, 2);

        if (severe) {
          return {
            id: `bot-${Date.now()}`,
            role: 'bot',
            text: adaptText(
              wo
                ? 'Ci li ngay wax, dafay am solo nga dem tabax bu gaaw. Soo amee symptomes yu mel nii, professionnel de sante moo men la dimbali bu baax.\n\nMen naa la wone ker wu jamm wu jege ci yow :'
                : "D'après ce que tu me décris, je te recommande de consulter un professionnel de santé rapidement. Ces symptômes méritent une attention médicale.\n\nJe peux te localiser un centre de santé près de toi :",
              { topic: 'orientation', severity: 'urgent' }
            ),
            showLocation: true,
            locationTags: resolvedLocationTags(flow.locationTags),
            articles,
            referToProfessional: true,
          };
        }

        const brief = BRIEF_RESPONSES[flow.articleIds[0]];
        return {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: adaptText(
            wo
              ? `Ci li ngay wax, mangi la jox xam-xam :\n\n${brief?.wo ?? ''}\n\nBu symptomes yi di yees wala epp, waxal tabax.`
              : `D'après ce que tu me décris :\n\n${brief?.fr ?? ''}\n\nSi les symptômes persistent ou s'aggravent, n'hésite pas à consulter un professionnel.`,
            { topic: 'symptom' }
          ),
          articles,
          followUpOptions: getAdaptiveFollowUpOptions(
            'symptom',
            personalization,
            lifeStage,
            sensitiveOrientation
          ),
        };
      }

      if (/\b(trouver.*professionnel|centre.*santé|tabax|médecin|gynéco|hôpital|seet.*kër|seet.*tabax)\b/i.test(userText)) {
        return {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: adaptText(
            wo
              ? 'Mangi la wone ker wu jamm yi jege ci yow ci Senegaal :'
              : 'Voici les centres de santé les plus proches de toi au Sénégal :',
            { topic: 'orientation' }
          ),
          showLocation: true,
          locationTags: resolvedLocationTags(['Gynecologie']),
        };
      }

      if (pendingTopicRef.current) {
        const topic = pendingTopicRef.current;
        const followUp = FOLLOW_UPS[topic];
        pendingTopicRef.current = null;

        if (followUp) {
          const lower = userText.toLowerCase();
          const match = followUp.options.find(
            (option) => option.fr.toLowerCase() === lower || option.wo.toLowerCase() === lower
          );
          if (match) {
            const articles = findRelevantArticles(match.refineKeywords.join(' '));
            if (articles.length > 0) {
              const brief = BRIEF_RESPONSES[articles[0].id];
              return {
                id: `bot-${Date.now()}`,
                role: 'bot',
                text: adaptText(
                  wo
                    ? `Mangi la jox xam-xam :\n\n${brief?.wo ?? ''}\n\nXoolal bii jangale ngir xam lu gena bari:`
                    : `Voici ce que je peux te dire :\n\n${brief?.fr ?? ''}\n\nVoici l'article le plus pertinent pour toi :`,
                  { topic: 'orientation' }
                ),
                articles: articles.slice(0, 1),
                followUpOptions: getAdaptiveFollowUpOptions(
                  'orientation',
                  personalization,
                  lifeStage,
                  sensitiveOrientation
                ),
              };
            }
          }
        }
      }

      const matchedFlow = SYMPTOM_FLOWS.find((flow) => flow.trigger.test(userText));
      if (matchedFlow) {
        symptomFlowRef.current = { flow: matchedFlow, step: 0, answers: [] };
        return {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: adaptText(
            wo
              ? `Ngir ma gena xam, men naa la laaj nyaari laaj?\n\n${matchedFlow.questionsWo[0]}`
              : `Pour mieux t'aider, j'aimerais te poser quelques questions :\n\n${matchedFlow.questionsFr[0]}`,
            { topic: 'symptom' }
          ),
        };
      }

      if (imageUri) {
        return {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: adaptText(
            wo
              ? "Jerejef ci nataal bi. Mangi ko xool.\n\nManuma def diagnostic ci nataal rekk. Waaye men naa la orienter.\n\nMen nga wax ma lu ngay yoor ngir ma gena la dimbali ?"
              : "Merci pour la photo. Je la prends en compte.\n\nJe ne suis pas en mesure de poser un diagnostic a partir d'une image. Mais je peux t'orienter.\n\nPeux-tu me decrire ce que tu ressens pour que je te guide mieux ?",
            { topic: 'orientation' }
          ),
          followUpOptions: getAdaptiveFollowUpOptions(
            'image',
            personalization,
            lifeStage,
            sensitiveOrientation
          ),
        };
      }

      const definition = findDefinition(userText);
      if (definition) {
        const articles = findRelevantArticles(userText);
        return {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: adaptText(wo ? definition.wo : definition.fr, { topic: 'definition' }),
          articles: articles.length > 0 ? articles.slice(0, 2) : undefined,
          followUpOptions: getAdaptiveFollowUpOptions(
            'definition',
            personalization,
            lifeStage,
            sensitiveOrientation
          ),
        };
      }

      const broadTopic = detectBroadTopic(userText);
      if (broadTopic && FOLLOW_UPS[broadTopic]) {
        pendingTopicRef.current = broadTopic;
        return {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: adaptText(wo ? FOLLOW_UPS[broadTopic].questionWo : FOLLOW_UPS[broadTopic].questionFr, {
            topic: 'orientation',
          }),
          followUpOptions: [
            ...FOLLOW_UPS[broadTopic].options.map((option) => ({
              fr: option.fr,
              wo: option.wo,
            })),
            ...getAdaptiveFollowUpOptions(
              'orientation',
              personalization,
              lifeStage,
              sensitiveOrientation
            ).slice(0, 1),
          ].slice(0, 4),
        };
      }

      const articles = findRelevantArticles(userText);
      const locationTags = detectLocationTags(userText);

      if (articles.length > 0) {
        const brief = BRIEF_RESPONSES[articles[0].id];
        return {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: adaptText(
            wo
              ? `Mangi la jox xam-xam bu nyekk:\n\n${brief?.wo ?? ''}\n\nXoolal ${articles.length > 1 ? 'yii' : 'bii'} jangale:`
              : `Voici ce que je peux te dire :\n\n${brief?.fr ?? ''}\n\nVoici ${articles.length > 1 ? 'des articles qui pourraient' : 'un article qui pourrait'} t'aider :`,
            { topic: 'orientation' }
          ),
          articles,
          showLocation: !!locationTags,
          locationTags: locationTags
            ? resolvedLocationTags(locationTags)
            : undefined,
          followUpOptions: getAdaptiveFollowUpOptions(
            'orientation',
            personalization,
            lifeStage,
            sensitiveOrientation
          ),
        };
      }

      if (locationTags) {
        return {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: adaptText(
            wo
              ? 'Men nga wut ker wu jamm wu jege ci yow :'
              : 'Je te recommande de consulter un professionnel. Tu peux trouver un centre pres de toi :',
            { topic: 'orientation' }
          ),
          showLocation: true,
          locationTags: resolvedLocationTags(locationTags),
          followUpOptions: getAdaptiveFollowUpOptions(
            'orientation',
            personalization,
            lifeStage,
            sensitiveOrientation
          ),
        };
      }

      return {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: adaptText(
          wo
            ? "Ngir ma gena la dimbali, men nga :\n\n- Wax ma sa symptomes\n- Laaj ma ci contraception, grossesse, menopause\n- Yonni ma nataal"
            : "Pour mieux t'aider, tu peux :\n\n- Me décrire tes symptômes\n- Me poser une question sur la contraception, la grossesse ou la ménopause\n- M'envoyer une photo",
          { topic: 'fallback' }
        ),
        followUpOptions: getAdaptiveFollowUpOptions(
          'fallback',
          personalization,
          lifeStage,
          sensitiveOrientation
        ),
      };
    },
    [
      discreteMode,
      findRelevantArticles,
      isSevere,
      lifeStage,
      personalization,
      sensitiveOrientation,
      userProfile,
      wo,
    ]
  );

  const buildRecentMessagesForAssistant = useCallback(
    (currentUserText: string, imageUri?: string) => {
      const recentMessages: { role: 'user' | 'assistant'; text: string }[] = messagesRef.current
        .slice(-5)
        .map((message) => {
          const role: 'user' | 'assistant' =
            message.role === 'bot' ? 'assistant' : 'user';

          if (message.audioUri) {
            return {
              role,
              text: message.text || (wo ? '[Message vocal]' : '[Message vocal]'),
            };
          }

          if (message.imageUri) {
            return {
              role,
              text: `${message.text}\n${wo ? '[Nataal]' : '[Photo]'}`,
            };
          }

          return {
            role,
            text: message.text,
          };
        })
        .filter((message) => message.text.trim().length > 0);

      recentMessages.push({
        role: 'user',
        text: imageUri
          ? `${currentUserText || (wo ? 'Nataal yonnee' : 'Photo envoyee')}\n${wo ? '[Nataal]' : '[Photo]'}`
          : currentUserText,
      });

      return recentMessages.slice(-6);
    },
    [wo]
  );

  const buildGenerativeMessage = useCallback(
    (
      reply: ChatAssistantReply,
      fallbackArticles: Article[],
      fallbackLocationTags: string[] | null
    ): Message => {
      const matchedArticles = reply.articleIds
        .map((id) => ARTICLES.find((article) => article.id === id))
        .filter((article): article is Article => Boolean(article));
      const articles =
        matchedArticles.length > 0
          ? matchedArticles
          : fallbackArticles.slice(0, Math.min(2, fallbackArticles.length));
      const baseLocationTags =
        reply.locationTags.length > 0
          ? reply.locationTags
          : reply.referToProfessional
            ? fallbackLocationTags ?? ['Gynecologie']
            : fallbackLocationTags;
      const locationTags = baseLocationTags
        ? getSensitiveLocationTags(sensitiveOrientation, baseLocationTags)
        : undefined;
      const followUpOptions =
        reply.followUpOptions.length > 0
          ? reply.followUpOptions
          : getAdaptiveFollowUpOptions(
              reply.topic,
              personalization,
              lifeStage,
              sensitiveOrientation
            );

      return {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: buildAdaptiveText(
          {
            text: reply.answer,
            topic: reply.topic,
            severity: reply.severity,
          },
          personalization,
          userProfile,
          discreteMode,
          sensitiveOrientation,
          wo
        ),
        articles: articles.length > 0 ? articles : undefined,
        showLocation: Boolean(locationTags?.length),
        locationTags,
        referToProfessional: reply.referToProfessional || reply.severity === 'urgent',
        followUpOptions,
      };
    },
    [discreteMode, lifeStage, personalization, sensitiveOrientation, userProfile, wo]
  );

  const generateResponse = useCallback(
    async (userText: string, imageUri?: string): Promise<Message> => {
      const sensitiveIntent = detectSensitiveChatIntent(userText);
      const matchedFlow = SYMPTOM_FLOWS.find((flow) => flow.trigger.test(userText));
      const definition = findDefinition(userText);
      const isDirectLocationRequest =
        /\b(trouver.*professionnel|centre.*santé|tabax|médecin|gynéco|hôpital|seet.*kër|seet.*tabax)\b/i.test(
          userText
        );

      if (
        imageUri ||
        hasUrgentSignal(userText) ||
        Boolean(sensitiveIntent) ||
        Boolean(symptomFlowRef.current) ||
        Boolean(pendingTopicRef.current) ||
        Boolean(matchedFlow) ||
        Boolean(definition) ||
        isDirectLocationRequest
      ) {
        return generateLocalResponse(userText, imageUri);
      }

      const fallbackArticles = findRelevantArticles(userText);
      const fallbackLocationTags = detectLocationTags(userText);

      try {
        const reply = await requestChatAssistantReply({
          message: userText,
          language: wo ? 'wo' : 'fr',
          lifeStage,
          discreteMode,
          recentMessages: buildRecentMessagesForAssistant(userText, imageUri),
          articleCandidates: fallbackArticles,
          personalization,
          userProfile,
          sensitiveOrientation,
        });

        if (reply) {
          return buildGenerativeMessage(reply, fallbackArticles, fallbackLocationTags);
        }
      } catch (error) {
        console.error('Failed to generate remote chat response', error);
      }

      return generateLocalResponse(userText, imageUri);
    },
    [
      buildGenerativeMessage,
      buildRecentMessagesForAssistant,
      discreteMode,
      findRelevantArticles,
      generateLocalResponse,
      lifeStage,
      personalization,
      sensitiveOrientation,
      userProfile,
      wo,
    ]
  );

  const appendUserMessage = useCallback(
    (text: string, imageUri?: string) => {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: text || (wo ? 'Nataal yonnee' : 'Photo envoyee'),
        imageUri,
      };

      setMessages((prev) => [...prev, userMessage]);
      setShowChips(false);
      setIsTyping(true);

      setTimeout(() => {
        void (async () => {
          const botMessage = await generateResponse(text, imageUri);
          setPendingBotSpeechId(botMessage.id);
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
        })();
      }, 1100 + Math.random() * 500);
    },
    [generateResponse, wo]
  );

  const handleSend = useCallback(
    (overrideText?: string) => {
      const text = (overrideText ?? input).trim();
      if (!text && !pendingImage) {
        return;
      }

      const imageUri = pendingImage ?? undefined;
      setInput('');
      setPendingImage(null);
      Keyboard.dismiss();
      appendUserMessage(text || (wo ? 'Nataal' : 'Photo'), imageUri);
    },
    [appendUserMessage, input, pendingImage, wo]
  );

  const handlePickImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission', wo ? 'Autorisation photo refusee.' : 'Autorisation photo refusee.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setPendingImage(result.assets[0].uri);
    }
  }, [wo]);

  const startRecording = useCallback(async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission', wo ? 'Autorisation micro refusee.' : 'Autorisation micro refusee.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordDuration(0);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      recordingTimerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      Alert.alert('Audio', wo ? "Impossible d'enregistrer." : "Impossible d'enregistrer.");
    }
  }, [wo]);

  const cancelRecording = useCallback(async () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setRecordDuration(0);
    setIsRecording(false);

    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync().catch(() => undefined);
      recordingRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(async () => {
    const active = recordingRef.current;
    if (!active) {
      return;
    }

    try {
      await active.stopAndUnloadAsync();
      const uri = active.getURI();
      const duration = recordDuration;

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      setIsRecording(false);
      setRecordDuration(0);
      recordingRef.current = null;

      if (uri) {
        const userVoiceMessage: Message = {
          id: `user-voice-${Date.now()}`,
          role: 'user',
          text: wo ? 'Message vocal' : 'Message vocal',
          audioUri: uri,
          audioDuration: duration,
        };

        setMessages((prev) => [...prev, userVoiceMessage]);
        setShowChips(false);
        setIsTyping(true);

        setTimeout(() => {
          const response: Message = {
            id: `bot-${Date.now()}`,
            role: 'bot',
            text: buildAdaptiveText(
              {
                text: wo
                  ? 'Degg naa sa baat. Ngir ma man la dimbali gëna baax, mën nga bind sa laaj wala tànnal ci themes yi ci suuf.'
                  : "J'ai bien recu ton message vocal. Pour t'aider au mieux, tu peux aussi ecrire ta question ou choisir un theme ci-dessous.",
                topic: 'fallback',
              },
              personalization,
              userProfile,
              discreteMode,
              sensitiveOrientation,
              wo
            ),
            followUpOptions: getAdaptiveFollowUpOptions(
              'fallback',
              personalization,
              lifeStage,
              sensitiveOrientation
            ),
          };
          setPendingBotSpeechId(response.id);
          setMessages((prev) => [...prev, response]);
          setIsTyping(false);
          setShowChips(true);
        }, 1400);
      }
    } catch {
      Alert.alert('Audio', wo ? 'Probleme avec lenregistrement.' : "Probleme avec l'enregistrement.");
    }
  }, [
    discreteMode,
    lifeStage,
    personalization,
    recordDuration,
    sensitiveOrientation,
    userProfile,
    wo,
  ]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${String(remaining).padStart(2, '0')}`;
  };

  const renderCategoryIcon = (category: ChipCategory, color: string) => {
    if (category.iconSet === 'mci') {
      return <MaterialCommunityIcons name={category.icon as any} size={12} color={color} />;
    }
    return <Ionicons name={category.icon as any} size={12} color={color} />;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerDecorationOuter} />
          <View style={styles.headerDecorationInner} />

          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.headerBackButton}>
              <Ionicons name="chevron-back" size={18} color={C.beige} />
            </Pressable>

            <View style={styles.headerAvatar}>
              <MaterialCommunityIcons name="star-four-points-outline" size={20} color={C.terracotta} />
              <View style={styles.headerStatusDot} />
            </View>

            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Assistant SaxalWer</Text>
              <Text style={styles.headerCaption}>
                {wo ? 'Information bu bari, du diagnostic' : 'Information, jamais un diagnostic'}
              </Text>
            </View>

            {playingMsgId ? (
              <Pressable onPress={stopTTS} style={styles.headerStopSpeechButton}>
                <Ionicons name="square" size={12} color={C.beige} />
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Ionicons name="lock-closed-outline" size={11} color={C.terracotta} />
          <Text style={styles.disclaimerText}>
            {wo
              ? 'Assistant bii dafa jox xam-xam rekk, du diagnostic.'
              : "Cet espace est confidentiel. L'assistant fournit des informations, pas de diagnostic."}
          </Text>
        </View>

        <View style={styles.chatBodyWrap}>
          <ScrollView
            ref={messagesEndRef}
            contentContainerStyle={styles.chatScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            onScrollBeginDrag={Keyboard.dismiss}
          >
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <View
                  key={message.id}
                  style={[
                    styles.messageBlock,
                    isUser ? styles.messageBlockUser : styles.messageBlockBot,
                  ]}
                >
                  {!isUser ? (
                    <View style={styles.botMeta}>
                      <View style={styles.botMetaAvatar}>
                        <MaterialCommunityIcons name="star-four-points-outline" size={11} color={C.beige} />
                      </View>
                      <Text style={styles.botMetaLabel}>SaxalWer</Text>
                    </View>
                  ) : null}

                  <View
                    style={[
                      styles.messageRow,
                      isUser ? styles.messageRowUser : styles.messageRowBot,
                    ]}
                  >
                    <View
                      style={[
                        styles.messageBubble,
                        isUser ? styles.messageBubbleUser : styles.messageBubbleBot,
                      ]}
                    >
                      {message.imageUri ? (
                        <Image source={{ uri: message.imageUri }} style={styles.messageImage} resizeMode="cover" />
                      ) : null}

                      {message.audioUri ? (
                        <VoiceMessagePlayer
                          uri={message.audioUri}
                          duration={message.audioDuration}
                          isUser={isUser}
                        />
                      ) : (
                        <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextBot]}>
                          {message.text}
                        </Text>
                      )}
                    </View>

                    {!isUser && !message.audioUri ? (
                      <Pressable
                        onPress={() => speakMessage(message)}
                        style={[
                          styles.bubbleSpeechButton,
                          playingMsgId === message.id && styles.bubbleSpeechButtonActive,
                        ]}
                      >
                        <Ionicons
                          name={playingMsgId === message.id ? 'volume-mute-outline' : 'volume-high-outline'}
                          size={13}
                          color={playingMsgId === message.id ? C.beige : C.deepGreen}
                        />
                      </Pressable>
                    ) : null}
                  </View>

                  {message.referToProfessional ? (
                    <View style={styles.referralCard}>
                      <MaterialCommunityIcons name="stethoscope" size={14} color={C.terracotta} />
                      <Text style={styles.referralText}>
                        {wo ? 'Consultation medicale recommandee' : 'Consultation médicale recommandée'}
                      </Text>
                    </View>
                  ) : null}

                  {message.articles?.length ? (
                    <View style={styles.articleList}>
                      {message.articles.map((article) => (
                        <Pressable
                          key={article.id}
                          onPress={() => router.push(`/bibliotheque/${article.id}` as never)}
                          style={styles.articleCard}
                        >
                          <View style={styles.articleIconWrap}>
                            <Ionicons name="book-outline" size={15} color={C.deepGreen} />
                          </View>
                          <View style={styles.articleTextWrap}>
                            <Text style={styles.articleTitle}>{wo ? article.titleWo : article.title}</Text>
                            <Text style={styles.articleMeta}>
                              {article.readTime} · {wo ? article.categoryWo : article.category}
                            </Text>
                          </View>
                          <Ionicons name="chevron-forward" size={14} color={C.copper} />
                        </Pressable>
                      ))}
                    </View>
                  ) : null}

                  {message.showLocation && message.locationTags ? (
                    <View style={styles.locationWrap}>
                      <LocationFinder language={language} filterTags={message.locationTags} compact />
                    </View>
                  ) : null}

                  {message.followUpOptions?.length ? (
                    <View style={styles.followUpsWrap}>
                      {message.followUpOptions.map((option, index) => (
                        <Pressable
                          key={`${message.id}-${index}`}
                          onPress={() => handleSend(wo ? option.wo : option.fr)}
                          style={styles.followUpChip}
                        >
                          <View style={styles.followUpDot} />
                          <Text style={styles.followUpText}>{wo ? option.wo : option.fr}</Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })}

            {isTyping ? (
              <View style={styles.typingBlock}>
                <PulseDots />
              </View>
            ) : null}
          </ScrollView>

          {discreteMode ? (
            <View pointerEvents="none" style={styles.discreteOverlay}>
              <Ionicons name="shield-outline" size={18} color={C.deepGreen} />
              <Text style={styles.discreteOverlayText}>
                {wo ? 'Mode discret active' : 'Mode discret active'}
              </Text>
            </View>
          ) : null}
        </View>

        {showChips ? (
          <View style={styles.chipsSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryChipsScroll}
            >
              {chipCategories.map((category, index) => {
                const active = activeChipCat === index;
                return (
                  <Pressable
                    key={category.labelFr}
                    onPress={() => setActiveChipCat(index)}
                    style={[styles.categoryChip, active && styles.categoryChipActive]}
                  >
                    {renderCategoryIcon(category, active ? C.deepGreen : 'rgba(74,47,39,0.6)')}
                    <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
                      {wo ? category.labelWo : category.labelFr}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.topicChipsScroll}
            >
              {chipCategories[activeChipCat]?.chips.map((chip, index) => (
                <Pressable
                  key={`${chip.fr}-${index}`}
                  onPress={() => handleSend(wo ? chip.wo : chip.fr)}
                  style={styles.topicChip}
                >
                  <Text style={styles.topicChipText}>{wo ? chip.wo : chip.fr}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {isRecording ? (
          <View style={styles.recordingBanner}>
            <View style={styles.recordingLeft}>
              <View style={styles.recordingMicWrap}>
                <View style={styles.recordingPulse} />
                <View style={styles.recordingMicCore}>
                  <Ionicons name="mic" size={13} color={C.beige} />
                </View>
              </View>
              <View>
                <Text style={styles.recordingTitle}>{wo ? 'Mangi enregistrer...' : 'Enregistrement...'}</Text>
                <Text style={styles.recordingTimer}>{formatDuration(recordDuration)}</Text>
              </View>
            </View>

            <RecordingWaveform />

            <View style={styles.recordingActions}>
              <Pressable onPress={() => void cancelRecording()} style={styles.recordingActionMuted}>
                <Ionicons name="mic-off" size={14} color={C.beige} />
              </Pressable>
              <Pressable onPress={() => void stopRecording()} style={styles.recordingActionSend}>
                <Ionicons name="send" size={13} color={C.beige} />
              </Pressable>
            </View>
          </View>
        ) : null}

        {pendingImage ? (
          <View style={styles.pendingImageCard}>
            <Image source={{ uri: pendingImage }} style={styles.pendingImage} />
            <Text style={styles.pendingImageText}>
              {wo ? 'Nataal bi settaati' : 'Photo prete a envoyer'}
            </Text>
            <Pressable onPress={() => setPendingImage(null)} style={styles.pendingImageClose}>
              <Ionicons name="close" size={14} color={C.cocoa} />
            </Pressable>
          </View>
        ) : null}

        <View style={styles.inputWrap}>
          <View style={styles.inputBar}>
            <Pressable onPress={() => void handlePickImage()} style={styles.inputIconButton}>
              <Ionicons name="camera-outline" size={15} color="rgba(74,47,39,0.55)" />
            </Pressable>

            <TextInput
              value={input}
              onChangeText={setInput}
              onFocus={() => setShowChips(true)}
              placeholder={wo ? 'Waxal sa symptomes fii...' : 'Décris tes symptômes ici...'}
              placeholderTextColor="rgba(74,47,39,0.42)"
              style={styles.input}
              multiline
            />

            {!isRecording ? (
              <Pressable onPress={() => void startRecording()} style={styles.inputIconButton}>
                <Ionicons name="mic-outline" size={15} color="rgba(74,47,39,0.65)" />
              </Pressable>
            ) : null}

            <Pressable
              onPress={() => handleSend()}
              style={[
                styles.sendButton,
                (input.trim() || pendingImage) && styles.sendButtonActive,
              ]}
            >
              <Ionicons
                name="send"
                size={16}
                color={input.trim() || pendingImage ? C.beige : 'rgba(74,47,39,0.35)'}
              />
            </Pressable>
          </View>

          <View style={styles.footerHint}>
            <Ionicons name="lock-closed-outline" size={9} color="rgba(74,47,39,0.3)" />
            <Text style={styles.footerHintText}>
              {wo ? 'Sa wax yi dagnu siiw' : 'Tes echanges restent strictement confidentiels'}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.beige,
  },
  screen: {
    flex: 1,
    backgroundColor: C.beige,
  },
  header: {
    backgroundColor: C.deepGreen,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    overflow: 'hidden',
  },
  headerDecorationOuter: {
    position: 'absolute',
    right: -50,
    bottom: -70,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerDecorationInner: {
    position: 'absolute',
    right: -20,
    bottom: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerStatusDot: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: C.success,
    borderWidth: 1.5,
    borderColor: C.deepGreen,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: C.beige,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  headerCaption: {
    color: 'rgba(245,241,230,0.5)',
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 2,
  },
  headerStopSpeechButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.terracotta,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(166,93,64,0.06)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(166,93,64,0.1)',
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  disclaimerText: {
    flex: 1,
    color: 'rgba(74,47,39,0.58)',
    fontSize: 10,
    lineHeight: 15,
    fontStyle: 'italic',
  },
  chatBodyWrap: {
    flex: 1,
    position: 'relative',
  },
  chatScroll: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  messageBlock: {
    marginBottom: 10,
  },
  messageBlockBot: {
    alignItems: 'flex-start',
  },
  messageBlockUser: {
    alignItems: 'flex-end',
  },
  botMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  botMetaAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botMetaLabel: {
    color: 'rgba(74,47,39,0.45)',
    fontSize: 10,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  messageRowBot: {
    alignSelf: 'flex-start',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  messageBubbleBot: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.08)',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  messageBubbleUser: {
    backgroundColor: C.deepGreen,
    borderBottomRightRadius: 4,
    shadowColor: C.deepGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 23,
  },
  messageTextBot: {
    color: C.deepGreen,
  },
  messageTextUser: {
    color: C.beige,
  },
  messageImage: {
    width: 220,
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  bubbleSpeechButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(26,60,52,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleSpeechButtonActive: {
    backgroundColor: C.terracotta,
    borderColor: C.terracotta,
  },
  referralCard: {
    marginTop: 8,
    maxWidth: '82%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(166,93,64,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  referralText: {
    color: C.terracotta,
    fontSize: 11,
    fontWeight: '600',
  },
  articleList: {
    marginTop: 8,
    gap: 6,
    width: '82%',
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.18)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  articleIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(26,60,52,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleTextWrap: {
    flex: 1,
  },
  articleTitle: {
    color: C.deepGreen,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  articleMeta: {
    color: 'rgba(74,47,39,0.55)',
    fontSize: 10,
    marginTop: 2,
  },
  locationWrap: {
    width: '82%',
    marginTop: 8,
  },
  followUpsWrap: {
    width: '88%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  followUpChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: 'rgba(181,98,42,0.2)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  followUpDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.copper,
    opacity: 0.7,
  },
  followUpText: {
    color: C.deepGreen,
    fontSize: 11,
    fontWeight: '600',
  },
  typingBlock: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.08)',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  typingWrap: {
    flexDirection: 'row',
    gap: 5,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(74,47,39,0.3)',
  },
  discreteOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(245,241,230,0.68)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  discreteOverlayText: {
    color: C.deepGreen,
    fontSize: 12,
    fontWeight: '600',
  },
  chipsSection: {
    paddingTop: 6,
    paddingBottom: 4,
  },
  categoryChipsScroll: {
    paddingHorizontal: 16,
    gap: 6,
    paddingBottom: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(74,47,39,0.12)',
  },
  categoryChipActive: {
    backgroundColor: 'rgba(26,60,52,0.08)',
    borderColor: 'rgba(26,60,52,0.22)',
  },
  categoryChipText: {
    color: 'rgba(74,47,39,0.62)',
    fontSize: 10,
  },
  categoryChipTextActive: {
    color: C.deepGreen,
    fontWeight: '700',
  },
  topicChipsScroll: {
    paddingHorizontal: 16,
    gap: 7,
    paddingBottom: 4,
  },
  topicChip: {
    backgroundColor: C.white,
    borderWidth: 1.2,
    borderColor: 'rgba(26,60,52,0.14)',
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  topicChipText: {
    color: C.deepGreen,
    fontSize: 11,
  },
  recordingBanner: {
    marginHorizontal: 16,
    marginBottom: 6,
    borderRadius: 16,
    backgroundColor: C.deepGreen,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recordingMicWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingPulse: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.terracotta,
    opacity: 0.35,
  },
  recordingMicCore: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingTitle: {
    color: C.beige,
    fontSize: 12,
    fontWeight: '500',
  },
  recordingTimer: {
    color: 'rgba(245,241,230,0.7)',
    fontSize: 10,
    marginTop: 2,
  },
  recordingWaveform: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
    height: 22,
  },
  recordingBar: {
    width: 3,
    height: 18,
    borderRadius: 99,
    backgroundColor: C.beige,
  },
  recordingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  recordingActionMuted: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingActionSend: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingImageCard: {
    marginHorizontal: 16,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.15)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pendingImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  pendingImageText: {
    flex: 1,
    color: 'rgba(74,47,39,0.72)',
    fontSize: 11,
  },
  pendingImageClose: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(74,47,39,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 18,
    backgroundColor: C.beige,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    backgroundColor: C.white,
    borderRadius: 99,
    paddingLeft: 14,
    paddingRight: 6,
    paddingTop: 8,
    paddingBottom: 8,
    shadowColor: C.deepGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  inputIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(181,98,42,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 90,
    color: C.cocoa,
    fontSize: 14,
    lineHeight: 21,
    paddingVertical: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(26,60,52,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: C.deepGreen,
    shadowColor: C.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  footerHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 8,
  },
  footerHintText: {
    color: 'rgba(74,47,39,0.3)',
    fontSize: 9,
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },
  voicePlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 180,
  },
  voiceButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonUser: {
    backgroundColor: 'rgba(245,241,230,0.18)',
  },
  voiceButtonBot: {
    backgroundColor: 'rgba(26,60,52,0.08)',
  },
  voiceBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 28,
  },
  voiceBar: {
    width: 3,
    borderRadius: 99,
  },
  voiceDuration: {
    minWidth: 28,
    textAlign: 'right',
    fontSize: 9,
  },
  voiceDurationUser: {
    color: 'rgba(245,241,230,0.78)',
  },
  voiceDurationBot: {
    color: 'rgba(74,47,39,0.5)',
  },
});
