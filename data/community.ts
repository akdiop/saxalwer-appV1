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
    titleFr: "Endométriose et douleurs chroniques",
    titleWo: 'Endométriose ak mettit yu yàgg',
    descFr: 'Un salon pour partager son vécu, ses repères de consultation et ses stratégies de soulagement.',
    descWo: 'Salon bu ñuy sédd seen dund, seen repères ngir consultation ak seen pexe ngir wàññi mettit.',
    iconName: 'heart',
    color: COMMUNITY_COLORS.terracotta,
  },
  {
    id: 'contraception',
    titleFr: 'Contraception et choix éclairés',
    titleWo: 'Contraception ak tànn bu leer',
    descFr: 'Comparer les méthodes, poser ses questions et échanger sans jugement sur leurs effets.',
    descWo: 'Melooy méthodes yi, laaj sa laaj yi te wax ci seen effets te amul xaste.',
    iconName: 'shield-checkmark',
    color: COMMUNITY_COLORS.deepGreen,
  },
  {
    id: 'maternite',
    titleFr: 'Maternité et projet de grossesse',
    titleWo: 'Yaay ak projet gàtt',
    descFr: 'Un espace pour parler désir d’enfant, grossesse, préparation et soutien entre femmes.',
    descWo: 'Bereb bu ñuy wax bëgg am doom, gàtt, waajal ak ndimbal ci diggante jigéen.',
    iconName: 'sparkles',
    color: COMMUNITY_COLORS.gold,
  },
  {
    id: 'menopause',
    titleFr: 'Ménopause et transitions de vie',
    titleWo: 'Ménopause ak jall yu dund',
    descFr: 'Bouffées, sommeil, humeur, confort : parler de cette étape avec calme et expérience.',
    descWo: 'Bouffées, nelaw, humeur, confort : wax ci etape bii ak dal ak expérience.',
    iconName: 'leaf',
    color: COMMUNITY_COLORS.green2,
  },
  {
    id: 'intimite',
    titleFr: 'Santé intime et vie relationnelle',
    titleWo: 'Wér intime ak dund gu jëkkër',
    descFr: 'Un espace confidentiel pour poser des mots sur l’intimité, le confort et la santé sexuelle.',
    descWo: 'Bereb bu sutura ngir wax ci intimité, confort ak wér sexuelle.',
    iconName: 'moon',
    color: COMMUNITY_COLORS.copper,
  },
  {
    id: 'soutien',
    titleFr: 'Écoute, soutien et entraide',
    titleWo: 'Déglu, ndimbal ak jappale',
    descFr: 'Pour les moments plus lourds, un salon bienveillant où déposer ce que l’on traverse.',
    descWo: 'Ci jamono yu gën a metti, salon bu am yërmandé ngir wone li nga di jaar.',
    iconName: 'people',
    color: COMMUNITY_COLORS.cacao,
  },
];
