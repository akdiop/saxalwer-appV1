export const COMMUNITY_COLORS = {
  deepGreen: '#0F3D2E',
  green2: '#1A3C34',
  sand: '#E8DCC8',
  beige: '#F5F1E6',
  copper: '#C26A3D',
  terracotta: '#B87050',
  cacao: '#4A2F27',
  warmWhite: '#FDFAF5',
  gold: '#D4AF37',
};

export type CommunityLanguage = 'fr' | 'wo';

export type CommunityMessage = {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
  isAnonymous: boolean;
};

export type CommunityRoom = {
  id: string;
  titleFr: string;
  titleWo: string;
  descFr: string;
  descWo: string;
  iconName:
    | 'heart'
    | 'shield-checkmark'
    | 'sparkles'
    | 'leaf'
    | 'moon'
    | 'people';
  color: string;
};

export type CommunityProfile = {
  pseudonym: string;
  shareAge: boolean;
  shareSituation: boolean;
  shareNeeds: boolean;
};

export const DEFAULT_COMMUNITY_PROFILE: CommunityProfile = {
  pseudonym: '',
  shareAge: false,
  shareSituation: false,
  shareNeeds: false,
};

export const THEMATIC_ROOMS: CommunityRoom[] = [
  {
    id: 'endometriose',
    titleFr: "Vivre avec l'endometriose",
    titleWo: 'Dund ak endometriose',
    descFr: 'Partager nos experiences et strategies face a la douleur',
    descWo: 'Wax ci suma xalaat ak strategies ci douleur',
    iconName: 'heart',
    color: COMMUNITY_COLORS.terracotta,
  },
  {
    id: 'contraception',
    titleFr: 'Choisir sa contraception',
    titleWo: 'Tannal contraception',
    descFr: 'Echanger sur les methodes, leurs effets et nos choix',
    descWo: 'Wax ci methodes yi, seen effet ak suma tann',
    iconName: 'shield-checkmark',
    color: COMMUNITY_COLORS.deepGreen,
  },
  {
    id: 'maternite',
    titleFr: 'Projet maternel',
    titleWo: 'Xalaat ci yaay',
    descFr: 'Soutien et conseils pour celles qui souhaitent devenir meres',
    descWo: 'Ndigal ak conseil ngir nu begg am doom',
    iconName: 'sparkles',
    color: COMMUNITY_COLORS.gold,
  },
  {
    id: 'menopause',
    titleFr: 'Menopause et transitions',
    titleWo: 'Menopause ak jall yi',
    descFr: 'Vivre cette etape avec serenite et sagesse',
    descWo: 'Dund etape bi ak kaarange te xam-xam',
    iconName: 'leaf',
    color: COMMUNITY_COLORS.green2,
  },
  {
    id: 'intimite',
    titleFr: 'Sante sexuelle et intimite',
    titleWo: 'Wer bu sexuel ak intimite',
    descFr: 'Un espace confidentiel pour parler de plaisir et bien-etre',
    descWo: 'Benn bereb bu sutura ngir wax ci neex ak jamm',
    iconName: 'moon',
    color: COMMUNITY_COLORS.copper,
  },
  {
    id: 'soutien',
    titleFr: 'Ecoute et soutien',
    titleWo: 'Deglu ak ndigal',
    descFr: "Pour les moments difficiles, un espace d'entraide",
    descWo: 'Ci jamano yu metit, benn bereb bu jappale',
    iconName: 'people',
    color: COMMUNITY_COLORS.cacao,
  },
];
