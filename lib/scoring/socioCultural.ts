/**
 * Scoring socio-culturel renforcé — SaxalWér.
 *
 * Logique PURE et transparente (aucune dépendance UI). Estime le niveau de
 * sensibilité socio-culturelle d'un contexte d'usage, pour adapter :
 *  - le ton (sororal / amical / formel) ;
 *  - le degré de discrétion (activation du mode discret, titres neutres) ;
 *  - la prudence sur les contenus tabous.
 *
 * ⚠️ Aucun jugement : il s'agit d'adapter l'accompagnement au contexte de la
 * personne (entourage, normes, besoin de confidentialité). Calcul local,
 * jamais transmis. Renforce/complète utils/personalizationMapper.ts.
 */

export type SocialNorms = 'conservative' | 'moderate' | 'open';
export type LivingContext =
  | 'alone'
  | 'parents'
  | 'partner'
  | 'roommates'
  | 'family';
export type PrivacyLevel = 'low' | 'medium' | 'high' | 'very-high';
export type PreferredTone = 'formal' | 'friendly' | 'sisterly';

export interface SocioCulturalInput {
  socialNorms?: SocialNorms | null;
  livingContext?: LivingContext | null;
  privacyLevel?: PrivacyLevel | null;
  preferredTone?: PreferredTone | null;
  needsSupport?: boolean;
}

export type SensitivityTier = 'ouvert' | 'modere' | 'prudent' | 'tres-prudent';

export interface SocioCulturalResult {
  /** 0–100 : 0 = contexte très ouvert, 100 = contexte très sensible. */
  sensitivityScore: number;
  tier: SensitivityTier;
  /** Recommander l'activation du mode discret par défaut ? */
  recommendDiscreet: boolean;
  /** Neutraliser les titres explicites (cf. utils/discreetTitles). */
  recommendNeutralTitles: boolean;
  /** Ton conseillé pour les messages. */
  suggestedTone: PreferredTone;
  explanation: string;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function computeSocioCultural(
  input: SocioCulturalInput
): SocioCulturalResult {
  let s = 40;

  switch (input.socialNorms) {
    case 'conservative':
      s += 28;
      break;
    case 'moderate':
      s += 8;
      break;
    case 'open':
      s -= 16;
      break;
    default:
      break;
  }

  switch (input.livingContext) {
    case 'parents':
    case 'family':
      s += 14; // moins d'intimité => plus de discrétion
      break;
    case 'roommates':
      s += 8;
      break;
    case 'partner':
      s += 2;
      break;
    case 'alone':
      s -= 10;
      break;
    default:
      break;
  }

  switch (input.privacyLevel) {
    case 'very-high':
      s += 16;
      break;
    case 'high':
      s += 8;
      break;
    case 'low':
      s -= 8;
      break;
    default:
      break;
  }

  if (input.needsSupport) s += 6;

  const sensitivityScore = clamp(s);

  const tier: SensitivityTier =
    sensitivityScore >= 75
      ? 'tres-prudent'
      : sensitivityScore >= 55
        ? 'prudent'
        : sensitivityScore >= 35
          ? 'modere'
          : 'ouvert';

  const recommendDiscreet = sensitivityScore >= 55;
  const recommendNeutralTitles = sensitivityScore >= 45;

  const suggestedTone: PreferredTone =
    input.preferredTone ??
    (tier === 'tres-prudent'
      ? 'formal'
      : tier === 'ouvert'
        ? 'sisterly'
        : 'friendly');

  const explanation =
    tier === 'tres-prudent'
      ? "Contexte très sensible : le mode discret et les titres neutres sont conseillés, avec un ton mesuré et beaucoup de confidentialité."
      : tier === 'prudent'
        ? "Contexte sensible : on privilégie la discrétion et un ton bienveillant, sans rien imposer."
        : tier === 'modere'
          ? "Contexte intermédiaire : accompagnement clair et bienveillant, discrétion disponible si besoin."
          : "Contexte ouvert : tu peux accéder librement aux contenus, avec un ton proche et chaleureux.";

  return {
    sensitivityScore,
    tier,
    recommendDiscreet,
    recommendNeutralTitles,
    suggestedTone,
    explanation,
  };
}
