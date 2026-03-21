export type CenterType = 'Public' | 'Privé' | 'ONG';

export type CenterService = {
  icon:
    | 'medical-outline'
    | 'baby-outline'
    | 'shield-checkmark-outline'
    | 'heart-outline'
    | 'people-outline'
    | 'chatbubble-ellipses-outline'
    | 'leaf-outline';
  label: string;
};

export type CenterHour = {
  day: string;
  time: string;
};

export type CenterReview = {
  name: string;
  rating: number;
  date: string;
  text: string;
};

export type Center = {
  id: number;
  name: string;
  type: CenterType;
  location: string;
  fullAddress: string;
  distance: string;
  phone: string;
  phoneAlt: string | null;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openUntil: string | null;
  description: string;
  services: CenterService[];
  hours: CenterHour[];
  reviews: CenterReview[];
  tags: string[];
  languages: string[];
  acceptsInsurance: boolean;
  freeConsultation: boolean;
  wheelchairAccess: boolean;
};

export const CENTERS_DATA: Record<string, Center> = {
  '1': {
    id: 1,
    name: 'Centre de Santé Roi Baudouin',
    type: 'Public',
    location: 'Guédiawaye, Dakar',
    fullAddress: 'Route de Guédiawaye, en face du marché Boubess, Dakar',
    distance: '2.4 km',
    phone: '+221 33 837 00 00',
    phoneAlt: '+221 77 123 45 67',
    rating: 4.6,
    reviewCount: 128,
    isOpen: true,
    openUntil: '18h00',
    description:
      'Le Centre de Santé Roi Baudouin est un établissement public de référence offrant des services de santé maternelle et reproductive de qualité. Créé en partenariat avec la coopération belge, il dessert la communauté de Guédiawaye et ses environs.',
    services: [
      { icon: 'medical-outline', label: 'Consultations gynécologiques' },
      { icon: 'baby-outline', label: 'Suivi de grossesse & maternité' },
      { icon: 'medical-outline', label: 'Planning familial' },
      { icon: 'shield-checkmark-outline', label: 'Dépistage IST/VIH' },
      { icon: 'heart-outline', label: 'Suivi post-partum' },
      { icon: 'people-outline', label: 'Groupes de soutien' },
    ],
    hours: [
      { day: 'Lundi - Vendredi', time: '08h00 - 18h00' },
      { day: 'Samedi', time: '08h00 - 13h00' },
      { day: 'Dimanche', time: 'Fermé' },
    ],
    reviews: [
      {
        name: 'Aïssatou D.',
        rating: 5,
        date: 'Février 2026',
        text: "Accueil très chaleureux. La sage-femme m'a vraiment mise à l'aise pour ma première consultation.",
      },
      {
        name: 'Mariama F.',
        rating: 4,
        date: 'Janvier 2026',
        text: "Bon centre de santé. Parfois l'attente est longue, mais le personnel est très compétent et bienveillant.",
      },
      {
        name: 'Ndèye S.',
        rating: 5,
        date: 'Décembre 2025',
        text: "Je recommande vivement pour le suivi de grossesse. On se sent vraiment écoutée et accompagnée.",
      },
    ],
    tags: ['Planning', 'Maternité', 'Urgences'],
    languages: ['Français', 'Wolof'],
    acceptsInsurance: true,
    freeConsultation: true,
    wheelchairAccess: true,
  },
  '2': {
    id: 2,
    name: 'Clinique de la Renaissance',
    type: 'Privé',
    location: 'Ouakam, Dakar',
    fullAddress: 'Avenue Cheikh Anta Diop, Ouakam, Dakar',
    distance: '4.1 km',
    phone: '+221 33 869 00 00',
    phoneAlt: null,
    rating: 4.8,
    reviewCount: 87,
    isOpen: true,
    openUntil: '20h00',
    description:
      'La Clinique de la Renaissance est un établissement privé moderne spécialisé dans la gynécologie et la pédiatrie, offrant un cadre confortable et des soins personnalisés.',
    services: [
      { icon: 'medical-outline', label: 'Gynécologie avancée' },
      { icon: 'baby-outline', label: 'Pédiatrie' },
      { icon: 'heart-outline', label: 'Échographie obstétricale' },
      { icon: 'medical-outline', label: 'Consultation fertilité' },
    ],
    hours: [
      { day: 'Lundi - Vendredi', time: '07h30 - 20h00' },
      { day: 'Samedi', time: '08h00 - 16h00' },
      { day: 'Dimanche', time: '09h00 - 13h00' },
    ],
    reviews: [
      {
        name: 'Fatou K.',
        rating: 5,
        date: 'Mars 2026',
        text: 'Un cadre magnifique et un personnel aux petits soins. Le Dr Ndiaye est exceptionnel.',
      },
      {
        name: 'Coumba B.',
        rating: 5,
        date: 'Février 2026',
        text: "Très propre, moderne et l'accueil est impeccable. Prix un peu élevé mais la qualité est là.",
      },
    ],
    tags: ['Gynécologie', 'Pédiatrie'],
    languages: ['Français', 'Wolof', 'Anglais'],
    acceptsInsurance: true,
    freeConsultation: false,
    wheelchairAccess: true,
  },
  '3': {
    id: 3,
    name: 'Marie Stopes Sénégal',
    type: 'ONG',
    location: 'Dakar-Plateau',
    fullAddress: 'Rue Moussé Diop x Rue Vincens, Dakar-Plateau',
    distance: '5.8 km',
    phone: '+221 800 00 84 84',
    phoneAlt: null,
    rating: 4.5,
    reviewCount: 203,
    isOpen: false,
    openUntil: null,
    description:
      'Marie Stopes Sénégal est une ONG internationale dédiée à la santé reproductive. Elle offre des services de contraception, de conseil et de planification familiale accessibles et confidentiels.',
    services: [
      { icon: 'medical-outline', label: 'Contraception (toutes méthodes)' },
      { icon: 'chatbubble-ellipses-outline', label: 'Conseil confidentiel' },
      { icon: 'shield-checkmark-outline', label: 'Dépistage & prévention' },
      { icon: 'leaf-outline', label: 'Éducation à la santé' },
    ],
    hours: [
      { day: 'Lundi - Vendredi', time: '08h00 - 17h00' },
      { day: 'Samedi - Dimanche', time: 'Fermé' },
    ],
    reviews: [
      {
        name: 'Khady M.',
        rating: 5,
        date: 'Janvier 2026',
        text: 'Service gratuit et confidentiel. Le personnel ne juge jamais, on se sent en sécurité.',
      },
      {
        name: 'Aby T.',
        rating: 4,
        date: 'Décembre 2025',
        text: "Très informatif et bienveillant. J'ai pu choisir ma méthode de contraception en toute connaissance de cause.",
      },
    ],
    tags: ['Contraception', 'Conseils'],
    languages: ['Français', 'Wolof'],
    acceptsInsurance: false,
    freeConsultation: true,
    wheelchairAccess: false,
  },
};
