export type MockArticle = {
  id: string;
  title: string;
  category: string;
  readTime: string;
  route: string;
};

export const ARTICLES: MockArticle[] = [
  {
    id: 'cycle-01',
    title: 'Comprendre ton cycle en 4 phases',
    category: 'Cycle & Regles',
    readTime: '6 min',
    route: '/cycle-module',
  },
  {
    id: 'fertilite-02',
    title: 'Fertilité: signes et moments clés',
    category: 'Fertilité',
    readTime: '5 min',
    route: '/fertility-module',
  },
  {
    id: 'douleurs-03',
    title: 'Soulager les douleurs en douceur',
    category: 'Douleurs & Symptômes',
    readTime: '7 min',
    route: '/symptoms-module',
  },
  {
    id: 'prevention-04',
    title: 'Prévention IST: les bons réflexes',
    category: 'Prévention IST',
    readTime: '4 min',
    route: '/providers-module',
  },
];
