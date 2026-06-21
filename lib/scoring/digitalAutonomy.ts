/**
 * Score d'autonomie numérique — SaxalWér.
 *
 * Logique PURE et transparente (aucune dépendance UI / React Native),
 * donc testable en isolation. Le score estime à quel point une utilisatrice
 * peut naviguer seule dans l'application, afin d'adapter l'accompagnement
 * (mode guidé vs complet, recours à l'audio, simplification du langage).
 *
 * ⚠️ Ce n'est PAS une mesure médicale ni un jugement de valeur. C'est un
 * réglage d'expérience, calculé localement, jamais transmis.
 */

export type EducationLevel = 'basic' | 'intermediate' | 'advanced';
export type AudioPreference = 'always' | 'sometimes' | 'never';
export type PrivacyLevel = 'low' | 'medium' | 'high' | 'very-high';
export type Language = 'fr' | 'wo';

export interface DigitalAutonomyInput {
  educationLevel?: EducationLevel | null;
  /** Préférence audio = proxy d'aisance à la lecture sur écran. */
  audioPreference?: AudioPreference | null;
  /** Une langue d'interface non maîtrisée réduit l'autonomie perçue. */
  language?: Language | null;
  /** Plus le besoin de discrétion est fort, plus on simplifie les parcours. */
  privacyLevel?: PrivacyLevel | null;
  /** A déjà terminé l'onboarding / un tutoriel. */
  completedTutorial?: boolean;
}

export type AutonomyLevel = 'accompagnee' | 'intermediaire' | 'autonome';

export interface DigitalAutonomyResult {
  /** 0–100. */
  score: number;
  level: AutonomyLevel;
  /** Mode d'expérience recommandé (l'utilisatrice reste libre de le changer). */
  recommendedMode: 'guide' | 'complet';
  /** Faut-il mettre l'audio en avant ? */
  suggestAudio: boolean;
  /** Explication calme, affichable telle quelle. */
  explanation: string;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function computeDigitalAutonomy(
  input: DigitalAutonomyInput
): DigitalAutonomyResult {
  let score = 50; // point de départ neutre

  switch (input.educationLevel) {
    case 'advanced':
      score += 22;
      break;
    case 'intermediate':
      score += 8;
      break;
    case 'basic':
      score -= 18;
      break;
    default:
      break;
  }

  switch (input.audioPreference) {
    case 'always':
      score -= 16; // forte préférence audio => lecture écran moins aisée
      break;
    case 'sometimes':
      score -= 4;
      break;
    case 'never':
      score += 8;
      break;
    default:
      break;
  }

  if (input.completedTutorial) score += 10;
  if (input.privacyLevel === 'very-high') score -= 6;

  score = clamp(score);

  const level: AutonomyLevel =
    score >= 67 ? 'autonome' : score >= 40 ? 'intermediaire' : 'accompagnee';

  const recommendedMode: 'guide' | 'complet' =
    level === 'autonome' ? 'complet' : 'guide';

  const suggestAudio =
    input.audioPreference === 'always' ||
    input.audioPreference === 'sometimes' ||
    level === 'accompagnee';

  const explanation =
    level === 'autonome'
      ? "Tu navigues à l'aise : le mode complet te donne accès à toutes les rubriques, filtres et détails."
      : level === 'intermediaire'
        ? "Un parcours guidé, avec des étapes claires et l'audio disponible, peut rendre l'expérience plus confortable."
        : "Le mode guidé met en avant de gros boutons, peu de texte et l'audio, pour avancer pas à pas et sans pression.";

  return { score, level, recommendedMode, suggestAudio, explanation };
}
