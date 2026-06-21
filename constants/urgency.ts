/**
 * Urgency Levels - Non-medicalized alerts
 * Based on SaxalWér architecture: user guidance without diagnosis
 */

export type UrgencyLevel = 'information' | 'prevention' | 'consultation' | 'prioritaire' | 'urgence';

export const URGENCY_CONFIG: Record<UrgencyLevel, {
  label: string;
  labelFr: string;
  labelWo: string;
  description: string;
  descriptionFr: string;
  descriptionWo: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  icon: string;
  actionText: string;
  actionTextFr: string;
  actionTextWo: string;
}> = {
  information: {
    label: 'General Information',
    labelFr: 'Information générale',
    labelWo: 'Xabar bu geej',
    description: 'Frequent and often benign - read/listen to content',
    descriptionFr: 'Sujet fréquent et souvent bénin → lecture / écoute',
    descriptionWo: 'Sujet bu jëm ak boroom',
    color: '#8B7355',
    backgroundColor: '#F5F1E6',
    borderColor: '#8B7355',
    icon: 'information-outline',
    actionText: 'Learn more',
    actionTextFr: 'En savoir plus',
    actionTextWo: 'Xabar lii',
  },
  prevention: {
    label: 'Prevention',
    labelFr: 'Prévention',
    labelWo: 'Jafe',
    description: 'Not urgent but monitor - practical advice',
    descriptionFr: 'Pas urgent mais à surveiller → conseils pratiques',
    descriptionWo: 'Jafe bu mën',
    color: '#88937B',
    backgroundColor: '#E8EDD5',
    borderColor: '#88937B',
    icon: 'alert-circle-outline',
    actionText: 'Monitor & take action',
    actionTextFr: 'Surveiller et agir',
    actionTextWo: 'Gis ak jafe',
  },
  consultation: {
    label: 'Consult Professional',
    labelFr: 'Consultation conseillée',
    labelWo: 'Joxewal yaram',
    description: 'Medical advice recommended - seek professional',
    descriptionFr: 'Avis médical recommandé → orienter',
    descriptionWo: 'Joxewal jëm',
    color: '#1A8F6F',
    backgroundColor: '#D4EFE8',
    borderColor: '#1A8F6F',
    icon: 'hospital-box-outline',
    actionText: 'Find a professional',
    actionTextFr: 'Trouver une professionnelle',
    actionTextWo: 'Joxewal toppal',
  },
  prioritaire: {
    label: 'Urgent Consultation',
    labelFr: 'Consultation rapide',
    labelWo: 'Joxewal rafet',
    description: 'Quick consultation recommended',
    descriptionFr: 'Consultation rapide recommandée',
    descriptionWo: 'Joxewal rafet bu jëm',
    color: '#A65D40',
    backgroundColor: '#F5E6D3',
    borderColor: '#A65D40',
    icon: 'alert-octagon-outline',
    actionText: 'Contact now',
    actionTextFr: 'Contacter maintenant',
    actionTextWo: 'Kontakti jëm',
  },
  urgence: {
    label: 'Emergency',
    labelFr: 'Urgence médicale',
    labelWo: 'Urgence bu ndaw',
    description: 'Immediate medical care needed',
    descriptionFr: 'Prise en charge immédiate nécessaire',
    descriptionWo: 'Soonga bu ndaw mën',
    color: '#8B1538',
    backgroundColor: '#FFE4E1',
    borderColor: '#8B1538',
    icon: 'alert-circle',
    actionText: 'Call emergency now',
    actionTextFr: 'Appeler urgences maintenant',
    actionTextWo: 'Joxewal urgence',
  },
};

export const URGENCY_COLORS = {
  beige: '#F5F1E6',
  softGreen: '#E8EDD5',
  green: '#D4EFE8',
  darkGreen: '#1A8F6F',
  copper: '#A65D40',
  darkRed: '#8B1538',
};
