import type { LifeSituation } from '../context/appcontext';

const BASE_ACCENTS: Record<string, string> = {
  beige: '#F5F1E6',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  gold: '#D4AF37',
  green2: '#2D4B42',
};

export interface SituationTheme {
  accent: string;
  greeting: { fr: string; wo: string };
  subgreeting: { fr: string; wo: string };
  heroBadge: { fr: string; wo: string };
}

const SITUATION_THEMES: Partial<Record<LifeSituation, SituationTheme>> = {
  pregnant: {
    accent: BASE_ACCENTS.copper,
    greeting: { fr: 'Bienvenue,', wo: 'Dalal-jàmm,' },
    subgreeting: {
      fr: 'Ton corps vit quelque chose de précieux. On est là.',
      wo: 'Sa yaram am na dëkk bu solo. Nunga fa.',
    },
    heroBadge: { fr: 'Grossesse', wo: 'Dëkk' },
  },
  trying: {
    accent: BASE_ACCENTS.terracotta,
    greeting: { fr: 'Bonjour,', wo: 'Nanga def,' },
    subgreeting: {
      fr: 'Chaque cycle est une nouvelle chance. Prenons soin de toi.',
      wo: 'Bépp weer mooy yenn diir. Nunga fan ci sa wér.',
    },
    heroBadge: { fr: 'Projet bébé', wo: 'Xalaat ci doom' },
  },
  postpartum: {
    accent: BASE_ACCENTS.gold,
    greeting: { fr: 'Bonjour,', wo: 'Nanga def,' },
    subgreeting: {
      fr: 'Le post-partum est une renaissance. Douceur avant tout.',
      wo: 'Gannaaw wànte bu yomb la. Jàmm ak yomb.',
    },
    heroBadge: { fr: 'Post-partum', wo: 'Gannaaw wànte' },
  },
  menopause: {
    accent: BASE_ACCENTS.cocoa,
    greeting: { fr: 'Bonjour,', wo: 'Nanga def,' },
    subgreeting: {
      fr: 'Cette transition est une sagesse. Honorons-la ensemble.',
      wo: 'Jàll bi xam-xam la. Nunga ko jébbal ci tariñ.',
    },
    heroBadge: { fr: 'Plénitude', wo: 'Kaarange' },
  },
  cycles: {
    accent: BASE_ACCENTS.deepGreen,
    greeting: { fr: 'Bonjour,', wo: 'Nanga def,' },
    subgreeting: {
      fr: 'Écoute ton corps. Chaque cycle te parle.',
      wo: 'Déglu sa yaram. Bépp weer wax na ci yaw.',
    },
    heroBadge: { fr: 'Mon cycle', wo: 'Sama cycle' },
  },
  contraception: {
    accent: BASE_ACCENTS.green2,
    greeting: { fr: 'Bonjour,', wo: 'Nanga def,' },
    subgreeting: {
      fr: 'Ton corps, tes choix. On t\'accompagne à chaque étape.',
      wo: 'Sa yaram, sa tànn. Nunga fa ci bépp étape.',
    },
    heroBadge: { fr: 'Contraception', wo: 'Contraception' },
  },
  curious: {
    accent: BASE_ACCENTS.terracotta,
    greeting: { fr: 'Bienvenue,', wo: 'Dalal-jàmm,' },
    subgreeting: {
      fr: 'Explore librement. Toutes les questions sont bienvenues.',
      wo: 'Seet ci sa bopp. Bépp laaj yeneen na.',
    },
    heroBadge: { fr: 'Découverte', wo: 'Gis-gis' },
  },
  general: {
    accent: BASE_ACCENTS.deepGreen,
    greeting: { fr: 'Bonjour,', wo: 'Nanga def,' },
    subgreeting: {
      fr: 'Cet espace est tien. Explore à ton rythme.',
      wo: 'Bii bërëb sa la. Seet ci sa yoonu.',
    },
    heroBadge: { fr: 'Bien-être', wo: 'Jàmm' },
  },
};

export function getSituationTheme(
  lifeSituation: LifeSituation | null,
  _selectedAge: string | null,
): SituationTheme | null {
  if (!lifeSituation) return null;
  return SITUATION_THEMES[lifeSituation] ?? null;
}
