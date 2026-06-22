export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalDocument {
  slug: 'avertissement-medical' | 'cgu' | 'confidentialite' | 'mentions-legales';
  title: string;
  updated: string;
  sections: LegalSection[];
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: 'avertissement-medical',
    title: 'Avertissement médical',
    updated: 'Mise à jour : Juin 2026',
    sections: [
      {
        heading: 'Avertissement important',
        body: 'SaxalWér est une application éducative qui ne remplace pas un avis médical professionnel. Les informations fournies sont à titre informatif uniquement.',
      },
      {
        heading: 'Quand consulter',
        body: 'En cas de symptôme grave ou persistant, consultez un professionnel de santé qualifié ou rendez-vous aux urgences.',
      },
    ],
  },
  {
    slug: 'cgu',
    title: 'Conditions d\'utilisation',
    updated: 'Mise à jour : Juin 2026',
    sections: [
      {
        heading: 'Utilisation de l\'application',
        body: 'En utilisant SaxalWér, vous acceptez ces conditions d\'utilisation et notre politique de confidentialité.',
      },
      {
        heading: 'Responsabilités',
        body: 'L\'utilisateur est responsable de ses données et de son utilisation de l\'application.',
      },
    ],
  },
  {
    slug: 'confidentialite',
    title: 'Politique de confidentialité',
    updated: 'Mise à jour : Juin 2026',
    sections: [
      {
        heading: 'Protection des données',
        body: 'Vos données personnelles sont protégées selon les standards de sécurité actuels.',
      },
      {
        heading: 'Utilisation des données',
        body: 'Nous ne partageons jamais vos données personnelles sans votre consentement.',
      },
    ],
  },
  {
    slug: 'mentions-legales',
    title: 'Mentions légales',
    updated: 'Mise à jour : Juin 2026',
    sections: [
      {
        heading: 'Éditeur',
        body: 'SaxalWér - Application mobile de santé reproductive.',
      },
      {
        heading: 'Contact',
        body: 'Pour toute question, contactez-nous à contact@saxalwer.com',
      },
    ],
  },
];

export const LEGAL_ROUTES = ['/legal', '/cgu', '/conditions-utilisation', '/confidentialite', '/mentions-legales', '/avertissement-medical'] as const;
