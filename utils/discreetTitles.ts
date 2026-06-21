export function getDiscreetTitle(title: string, discreteMode?: boolean): string {
  if (discreteMode) {
    const discreteTitles: Record<string, string> = {
      'Contraception': 'Guide 1',
      'Grossesse': 'Guide 2',
      'Fertilité': 'Guide 3',
      'Ménopause': 'Guide 4',
      'IST & Prévention': 'Guide 5',
      'Maladies chroniques': 'Guide 6',
      'Post-partum': 'Guide 7',
      'Infertilité': 'Guide 8',
      'Pour toi': 'Guide personnel',
      'Tout': 'Tous les guides',
      'Ngir yaw': 'Guide personnel',
      'Yépp': 'Tous les guides',
    };
    return discreteTitles[title] || title;
  }
  return title;
}
