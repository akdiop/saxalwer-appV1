export type ProviderSpecialty = 'Psychologue' | 'Soutien VBG' | 'Gynécologie' | 'Infirmière';

export interface ProviderExtra {
  id: string;
  name: string;
  specialty: ProviderSpecialty;
  city: string;
  region: string;
  contact: string;
  languages: string[];
  womanProvider: boolean;
  vbg: boolean;
  verified: boolean;
  orientationNotes: string;
}

export const PROVIDER_REGIONS = [
  'Dakar',
  'Thiès',
  'Kaolack',
  'Tambacounda',
  'Kolda',
  'Ziguinchor',
  'Saint-Louis',
  'Louga',
  'Matam',
  'Kédougou',
] as const;

export const PROVIDER_SPECIALTIES: ProviderSpecialty[] = [
  'Psychologue',
  'Soutien VBG',
  'Gynécologie',
  'Infirmière',
];

export const PROVIDERS_EXTRA: ProviderExtra[] = [
  {
    id: '1',
    name: 'Dr. Awa Ndiaye',
    specialty: 'Gynécologie',
    city: 'Dakar',
    region: 'Dakar',
    contact: '+221 77 123 4567',
    languages: ['Français', 'Wolof'],
    womanProvider: true,
    vbg: false,
    verified: false,
    orientationNotes: 'Spécialiste en santé reproductive',
  },
  {
    id: '2',
    name: 'Mme Fatou Sow',
    specialty: 'Psychologue',
    city: 'Dakar',
    region: 'Dakar',
    contact: '+221 77 234 5678',
    languages: ['Français', 'Wolof'],
    womanProvider: true,
    vbg: true,
    verified: false,
    orientationNotes: 'Psychologue clinicienne spécialisée en trauma',
  },
  {
    id: '3',
    name: 'Dr. Moussa Ba',
    specialty: 'Gynécologie',
    city: 'Thiès',
    region: 'Thiès',
    contact: '+221 77 345 6789',
    languages: ['Français'],
    womanProvider: false,
    vbg: false,
    verified: false,
    orientationNotes: 'Cabinet privé avec équipement moderne',
  },
];
