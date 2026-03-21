import { Ionicons } from '@expo/vector-icons';

export type TutorialStep = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  titleFr: string;
  titleWo: string;
  descFr: string;
  descWo: string;
  tipFr: string;
  tipWo: string;
  color: string;
};

export const tutorialSteps: TutorialStep[] = [
  {
    id: 'dashboard',
    icon: 'home-outline',
    titleFr: 'Tableau de bord',
    titleWo: 'Kër gi',
    descFr: 'Ton espace personnel adapté à ton âge et ta situation. Tu y trouves des suggestions personnalisées, un accès rapide à toutes les fonctionnalités, et le carrousel des étapes de vie.',
    descWo: 'Sa bërëb bu la jëm ci sa at ak sa waxtu. Foofu ngay gis suggestions, accès rapide ci lépp, ak carrousel ci yoonu dund.',
    tipFr: 'Astuce : Tu peux personnaliser tes raccourcis en appuyant sur le bouton « Personnaliser ».',
    tipWo: 'Astuce : Mën nga soppi sa raccourcis bu tëjee bouton « Soppi ».',
    color: '#1A3C34',
  },
  {
    id: 'assistant',
    icon: 'chatbubble-ellipses-outline',
    titleFr: 'Assistant SaxalWér',
    titleWo: 'Jàppale SaxalWér',
    descFr: 'Pose n\'importe quelle question sur ta santé reproductive. L\'assistant te guide avec des réponses adaptées, des articles, et peut même t\'orienter vers un professionnel.',
    descWo: 'Laajal laaj bu nekk ci sa wér reproductive. Assistant bi dafay la guide ak tontu yu la jëm, jàngale yi, te mën na la yónni ci tabax.',
    tipFr: 'Tu peux aussi envoyer une photo ou un message vocal. Tout est confidentiel.',
    tipWo: 'Mën nga yónni nataal wala message vocal. Lépp siiw la fii.',
    color: '#2D4B42',
  },
  {
    id: 'cycle',
    icon: 'pulse-outline',
    titleFr: 'Suivi de cycle',
    titleWo: 'Sàmm Weer',
    descFr: 'Enregistre tes règles, tes symptômes et ton humeur jour après jour. L\'app calcule automatiquement tes phases (fertile, ovulation, règles prévues).',
    descWo: 'Bindal sa règles, sa signes ak sa humeur bésu nekk. App bi dafay calculer sa phases (fertile, ovulation, règles yu ñëw).',
    tipFr: 'Note aussi tes symptômes pour mieux comprendre ton corps au fil du temps.',
    tipWo: 'Bindal itam sa signes ngir gëna xam sa yaram ci diggante.',
    color: '#A65D40',
  },
  {
    id: 'map',
    icon: 'location-outline',
    titleFr: 'Carte des centres',
    titleWo: 'Carte kër wu jàmm yi',
    descFr: 'Trouve les centres de santé les plus proches de toi au Sénégal. Tu peux filtrer par spécialité (gynécologie, maternité, IST, urgences...).',
    descWo: 'Seetlu kër wu jàmm yi jëge ci yow ci Senegaal. Mën nga filtrer ci spécialité (gynécologie, maternité, IST, urgences...).',
    tipFr: 'L\'app affiche uniquement des centres vérifiés au Sénégal.',
    tipWo: 'App bi dafay wone kër wu jàmm yu siiw ci Senegaal rekk.',
    color: '#B5622A',
  },
  {
    id: 'library',
    icon: 'book-outline',
    titleFr: 'Bibliothèque & Glossaire',
    titleWo: 'Jàngale yi & Baat yi',
    descFr: 'Des articles bilingues (français/wolof) sur tous les sujets : contraception, grossesse, ménopause, IST, fertilité... Plus un glossaire médical de ~60 termes expliqués simplement.',
    descWo: 'Jàngale yi ci 2 làkk (français/wolof) ci lépp sujet : contraception, gàtt, ménopause, IST, fertilité... Ak glossaire tabax ~60 baat yu leer.',
    tipFr: 'Tu peux ajouter des articles en favoris pour les retrouver facilement.',
    tipWo: 'Mën nga def jàngale yi ci favoris ngir gëna gaaw gis ko.',
    color: '#1A3C34',
  },
  {
    id: 'orientation',
    icon: 'compass-outline',
    titleFr: 'Orientation santé',
    titleWo: 'Orientation wér',
    descFr: 'Un parcours de 14 questions pour évaluer ta situation de santé reproductive et recevoir un bilan personnalisé avec des recommandations adaptées.',
    descWo: 'Yoonu 14 laaj ngir seet sa waxtu ci wér reproductive te am bilan ak recommandations bu la jëm.',
    tipFr: 'Il existe aussi une orientation « sensible » pour les situations plus délicates (confidentiel).',
    tipWo: 'Am na itam orientation « sensible » ngir waxtu yi gëna délicate (siiw).',
    color: '#D4AF37',
  },
  {
    id: 'discrete-security',
    icon: 'moon-outline',
    titleFr: 'Mode discret & Sécurité',
    titleWo: 'Mode bu nëbb & Kaarange',
    descFr: 'Active le mode discret pour flouter l\'écran instantanément. L\'icône œil en bas à droite te permet de basculer rapidement. Tout reste confidentiel et stocké uniquement sur ton téléphone.',
    descWo: 'Taal mode bu nëbb ngir blur écran bi gaaw. Icône bët bi ci suuf ci ndijoor dafay soppi gaaw. Lépp siiw la te nekk ci sa téléphone rekk.',
    tipFr: 'Aucune donnée n\'est envoyée sur internet. Tout reste sur ton appareil.',
    tipWo: 'Dara du dem ci internet. Lépp dafa nekk ci sa appareil.',
    color: '#4A2F27',
  },
  {
    id: 'menu-navigation',
    icon: 'menu-outline',
    titleFr: 'Menu & Navigation',
    titleWo: 'Menu & Navigation',
    descFr: 'Le menu hamburger en haut à droite te donne accès à TOUTES les fonctionnalités. La barre de navigation en bas permet d\'accéder rapidement aux sections principales.',
    descWo: 'Menu hamburger ci kaw ci ndijoor dafay jox accès ci LÉPP fonctionnalités yi. Barre de navigation ci suuf dafay jox accès gaaw ci section yi.',
    tipFr: 'Tu peux changer la langue (FR ↔ Wolof) depuis le menu hamburger ou les réglages.',
    tipWo: 'Mën nga soppi làkk bi (FR ↔ Wolof) ci menu hamburger wala réglages yi.',
    color: '#2D4B42',
  },
];
