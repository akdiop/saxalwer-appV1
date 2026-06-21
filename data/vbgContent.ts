export interface SupportArticle {
  id: string;
  category: 'VBG' | 'Psychologique' | 'Ressources';
  title: string;
  titleWo?: string;
  summary: string;
  content: string;
  disclaimer: string;
  audioPlanned: boolean;
  sensitivity: 'ouvert' | 'sensible';
}

export interface VbgEmergency {
  intro: string;
  numbers: Array<{
    tel: string;
    label: string;
  }>;
  note: string;
}

export const VBG_EMERGENCY: VbgEmergency = {
  intro:
    'Si tu es en danger immédiat ou victime de violence, contacte rapidement les autorités ou l\'une de ces structures d\'urgence.',
  numbers: [
    {
      tel: '17',
      label: 'Police',
    },
    {
      tel: '18',
      label: 'Pompiers',
    },
    {
      tel: '1515',
      label: 'SAMU',
    },
  ],
  note: 'Toutes les appels sont confidentiels. Tu peux aussi te rendre aux urgences de l\'hôpital le plus proche.',
};

export const SUPPORT_ARTICLES: SupportArticle[] = [
  {
    id: 'vbg-1',
    category: 'VBG',
    title: 'Reconnaître les violences dans une relation',
    titleWo: 'Jangle xarala ci demb',
    summary: 'Les différentes formes de violence dans les relations, comment les reconnaître.',
    content:
      'Les violences dans les relations peuvent prendre plusieurs formes : physiques, émotionnelles, sexuelles ou économiques. Si tu reconnais des comportements abusifs dans ta relation, tu n\'es pas seule et de l\'aide est disponible.',
    disclaimer:
      'Si tu es en situation de danger, contacte les autorités ou une professionnelle immédiatement.',
    audioPlanned: false,
    sensitivity: 'sensible',
  },
  {
    id: 'vbg-2',
    category: 'VBG',
    title: 'Comment obtenir de l\'aide',
    titleWo: 'Kànn gëna jang',
    summary: 'Les ressources et professionnelles qui peuvent t\'aider en cas de violence.',
    content:
      'Plusieurs ressources sont disponibles : psychologues spécialisés, structures d\'accueil, lignes d\'écoute confidentielles. N\'hésite pas à parler à quelqu\'un de confiance.',
    disclaimer:
      'Toute information partagée est confidentielle. SaxalWér respecte absolument ta vie privée.',
    audioPlanned: true,
    sensitivity: 'sensible',
  },
  {
    id: 'psy-1',
    category: 'Psychologique',
    title: 'Gestion du stress et de l\'anxiété',
    titleWo: 'Kat stress ci jang',
    summary: 'Des techniques simples pour mieux gérer le stress au quotidien.',
    content:
      'La respiration profonde, la méditation et l\'activité physique peuvent aider à réduire le stress. Prends soin de toi et accorde-toi des moments de détente.',
    disclaimer: 'Ces conseils ne remplacent pas une consultation professionnelle si tu en as besoin.',
    audioPlanned: false,
    sensitivity: 'ouvert',
  },
  {
    id: 'ressource-1',
    category: 'Ressources',
    title: 'Ressources en ligne pour la santé reproductive',
    titleWo: 'Ressources',
    summary: 'Des outils et informations pour comprendre ta santé reproductive.',
    content:
      'Consulte des professionnelles de santé, lis des articles fiables, ou utilise des applications de suivi de cycle pour mieux comprendre ton corps.',
    disclaimer:
      'Les informations ici sont éducatives. Consulte une professionnelle pour un diagnostic ou traitement.',
    audioPlanned: false,
    sensitivity: 'ouvert',
  },
];
