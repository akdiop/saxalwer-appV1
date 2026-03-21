import type { LifeSituation } from '../context/appcontext';

export interface ContextualMessage {
  show: boolean;
  type: 'support' | 'reassurance' | 'info';
  message: string;
}

interface MessageDef {
  fr: string;
  wo: string;
  type: 'support' | 'reassurance' | 'info';
}

const SITUATION_MESSAGES: Partial<Record<LifeSituation, MessageDef>> = {
  'prefer-not-say': {
    type: 'reassurance',
    fr: 'Tu n\'as pas à tout partager. Cet espace respecte ta vie privée à chaque étape.',
    wo: 'Du sa waajur bës bu nekk. Bii bërëb jappale na sa njëkk ci bépp étape.',
  },
  pregnant: {
    type: 'support',
    fr: 'Ton corps fait un travail incroyable. Prends soin de toi et de toi seule en premier.',
    wo: 'Sa yaram def na liggeey bu dëgg. Saxal sa bopp rekk ci njëkk.',
  },
  postpartum: {
    type: 'support',
    fr: 'Après l\'accouchement, ton corps mérite toute ta douceur. Tu ne traverses pas ça seule.',
    wo: 'Gannaaw wànte, sa yaram soxor na yomb rekk. Du yëkk sa bopp ci bii.',
  },
  trying: {
    type: 'reassurance',
    fr: 'Chaque cycle est une opportunité. Prends le temps qu\'il faut — il n\'y a pas d\'urgence.',
    wo: 'Bépp weer bëgg na jàng. Jël sa yoonu — du gaaw.',
  },
  menopause: {
    type: 'support',
    fr: 'La ménopause est une transition, pas une fin. Cette sagesse est la tienne.',
    wo: 'Ménopause jàll la, du jeex. Xam-xam bi yaw moo ko am.',
  },
};

const AGE_MESSAGES: Partial<Record<string, MessageDef>> = {
  '15-17': {
    type: 'reassurance',
    fr: 'Tes questions sont normales et importantes. Cet espace est fait pour toi, en toute sécurité.',
    wo: 'Sa laaj yi dëgg lañu te am solo. Bii bërëb defar na ci yaw, ci kàttan bu dal.',
  },
  '50+': {
    type: 'reassurance',
    fr: 'Ton bien-être à cette étape de vie mérite toute l\'attention. Tu comptes.',
    wo: 'Sa jàmm ci bii yoonu dund soxor na xool bu baax. Yaw am na solo.',
  },
};

export function getContextualMessage(
  selectedAge: string | null,
  lifeSituation: LifeSituation | null,
  language: string,
): ContextualMessage | null {
  const wo = language === 'wo';

  const def =
    (lifeSituation && SITUATION_MESSAGES[lifeSituation]) ||
    (selectedAge && AGE_MESSAGES[selectedAge]);

  if (!def) return null;

  return {
    show: true,
    type: def.type,
    message: wo ? def.wo : def.fr,
  };
}
