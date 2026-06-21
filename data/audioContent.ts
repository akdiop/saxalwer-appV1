/**
 * Contenus audio éducatifs — SaxalWér (placeholders V2).
 * Additif. Aucun vrai fichier audio n'est requis : l'interface est prête,
 * les pistes passent en statut « disponible » quand le fichier existe.
 *
 * Français et wolof uniquement (démarrage Sénégal).
 */

export type AudioType =
  | 'educatif'
  | 'orientation'
  | 'apaisement'
  | 'securite'
  | 'urgence';

export type AudioStatus = 'bientot' | 'disponible';

export interface AudioContent {
  id: string;
  title: string;
  titleWo?: string;
  type: AudioType;
  language: 'fr' | 'wo';
  /** Durée cible en secondes (indicative). */
  durationTarget: number;
  description: string;
  /** Déclencheur / contexte d'écoute conseillé. */
  trigger: string;
  status: AudioStatus;
  /** Source réelle quand disponible (sinon null). */
  source?: string | null;
}

export const AUDIO_TYPE_LABEL: Record<AudioType, string> = {
  educatif: 'Éducatif',
  orientation: 'Orientation',
  apaisement: 'Apaisement',
  securite: 'Sécurité',
  urgence: 'Urgence',
};

export const AUDIO_CONTENTS: AudioContent[] = [
  {
    id: 'audio-cycle-fr',
    title: 'Comprendre son cycle, simplement',
    titleWo: 'Xam sa weer ci yoon wu woyof',
    type: 'educatif',
    language: 'fr',
    durationTarget: 180,
    description:
      "Les grandes phases du cycle expliquées calmement, sans jargon, pour mieux se repérer.",
    trigger: "À écouter au début du parcours « Cycle & règles ».",
    status: 'bientot',
    source: null,
  },
  {
    id: 'audio-douleur-fr',
    title: 'Quand consulter pour une douleur',
    type: 'orientation',
    language: 'fr',
    durationTarget: 150,
    description:
      "Repères pour distinguer un inconfort courant d'un signe qui mérite une consultation.",
    trigger: "Proposé après l'orientation par symptômes.",
    status: 'bientot',
    source: null,
  },
  {
    id: 'audio-respiration-fr',
    title: 'Respiration apaisante (3 minutes)',
    titleWo: 'Noyyi bu dal (3 simili)',
    type: 'apaisement',
    language: 'fr',
    durationTarget: 180,
    description: "Un court exercice de respiration pour relâcher la tension.",
    trigger: "Disponible depuis l'espace Soutien & écoute.",
    status: 'bientot',
    source: null,
  },
  {
    id: 'audio-securite-wo',
    title: 'Mettre sa sécurité en premier',
    titleWo: 'Teg sa kaaraange ci bopp',
    type: 'securite',
    language: 'wo',
    durationTarget: 120,
    description:
      "Repères calmes en wolof sur les premiers réflexes de sécurité après une violence.",
    trigger: "Lié aux contenus VBG (volet Soutien VBG).",
    status: 'bientot',
    source: null,
  },
  {
    id: 'audio-urgence-fr',
    title: 'Numéros et gestes en cas d\'urgence',
    type: 'urgence',
    language: 'fr',
    durationTarget: 90,
    description:
      "Rappel des numéros nationaux (SAMU 1515, Pompiers 18, Police 17) et des bons réflexes.",
    trigger: "Accessible depuis la page Urgence.",
    status: 'bientot',
    source: null,
  },
  {
    id: 'audio-menopause-fr',
    title: 'La ménopause, étape de la vie',
    type: 'educatif',
    language: 'fr',
    durationTarget: 200,
    description:
      "Ce qui change, ce qui est normal, et quand demander conseil — sans dramatiser.",
    trigger: "Suggéré dans la rubrique « Ménopause ».",
    status: 'bientot',
    source: null,
  },
];
