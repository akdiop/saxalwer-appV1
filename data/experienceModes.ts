export type ModeId = 'guided' | 'complete';

export type ModeDefinition = {
  id: ModeId;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  bestFor: string[];
  visibleFunctions: string[];
  navigationPrinciple: string;
};

export const EXPERIENCE_MODES: Record<ModeId, ModeDefinition> = {
  guided: {
    id: 'guided',
    title: 'Mode guidé',
    shortTitle: 'Guidé',
    subtitle: 'Navigation simplifiée, progressive et plus accessible.',
    description:
      'Le Mode guidé réduit le nombre d’options visibles et met en avant les fonctions essentielles : comprendre, s’orienter, écouter, demander de l’aide et trouver une structure.',
    bestFor: [
      'Utilisatrices peu à l’aise avec le numérique.',
      'Femmes âgées ou utilisatrices qui préfèrent une navigation simple.',
      'Personnes qui veulent aller rapidement à l’essentiel.',
      'Utilisatrices qui préfèrent l’audio ou les parcours pas à pas.',
    ],
    visibleFunctions: [
      'Bibliothèque santé',
      'Orientation santé',
      'Urgence Sénégal',
      'Carte locale',
      'Répertoire médecins',
      'FAQ',
      'Mode écouter',
      'Mode discret',
    ],
    navigationPrinciple:
      'Moins d’écrans, moins de choix visibles, plus de repères, avec priorité aux fonctions utiles en situation de besoin immédiat.',
  },
  complete: {
    id: 'complete',
    title: 'Mode complet',
    shortTitle: 'Complet',
    subtitle: 'Toutes les fonctionnalités SaxalWér restent accessibles.',
    description:
      'Le Mode complet conserve toute la richesse de la V1 : suivi, journal, assistant, orientation sensible, contexte personnel, ressources, carte, annuaire, calendrier et communauté.',
    bestFor: [
      'Utilisatrices autonomes avec le numérique.',
      'Femmes qui veulent explorer l’ensemble de l’application.',
      'Utilisatrices intéressées par le suivi, le journal et la personnalisation.',
      'Tests avancés, recherche utilisateur et amélioration produit.',
    ],
    visibleFunctions: [
      'Toutes les fonctions du Mode guidé',
      'Assistant IA',
      'Orientation sensible',
      'Mon contexte',
      'Suivi du cycle',
      'Journal intime',
      'Calendrier',
      'Glossaire',
      'Communauté',
      'Feedback',
    ],
    navigationPrinciple:
      'Expérience complète, plus riche, adaptée aux utilisatrices qui veulent personnaliser leur parcours et explorer plusieurs modules.',
  },
};

export const GUIDED_MODE_ROUTES = new Set([
  '/',
  '/mode',
  '/bibliotheque',
  '/orientation',
  '/urgence',
  '/carte',
  '/medecins',
  '/faq',
  '/tutoriel',
  '/about',
  '/legal',
]);

export function isRouteVisibleInMode(route: string, mode: ModeId) {
  if (mode === 'complete') return true;
  return GUIDED_MODE_ROUTES.has(route);
}

export function getModeLabel(mode: ModeId) {
  return EXPERIENCE_MODES[mode].title;
}
