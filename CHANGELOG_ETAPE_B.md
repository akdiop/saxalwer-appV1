# Étape B — fonctionnalités ajoutées

## Sénégal uniquement
- `app/pages/map.tsx` : l'annuaire des centres est filtré sur `country === 'Sénégal'`
  (Burkina, Mali, Guinée, Côte d'Ivoire, Gambie, Mauritanie, Niger ne s'affichent plus).
  La donnée brute reste dans `data/healthcenters.ts` pour usage futur.

## Mode Guidé / Mode Complet
- `context/appcontext.tsx` : nouvelle préférence `experienceMode` ('guide' | 'complet'),
  persistée localement, avec `setExperienceMode`. Défaut : 'complet'.
- `components/ExperienceModeToggle.tsx` : bascule réutilisable.
- `app/pages/preferences.tsx` (route `/preferences`) : écran réglages (mode + mode discret + liens).
- L'écran audio s'adapte au mode (boutons plus gros, moins de texte en mode guidé).
- À étendre ensuite : appliquer le mode guidé à la bibliothèque et au dashboard
  (non fait ici pour ne pas risquer ces gros écrans sans test Expo).

## Score d'autonomie numérique + scoring socio-culturel renforcé
- `lib/scoring/digitalAutonomy.ts` et `lib/scoring/socioCultural.ts` : logique PURE,
  typée strict, **vérifiée par compilation TypeScript** (zéro erreur) et testée.
- `app/pages/profil-numerique.tsx` (route `/profil-numerique`) : affiche les deux scores
  à partir des préférences de personnalisation (calcul local, jamais transmis), avec
  bouton pour activer le mode conseillé. Calcul transparent, non médical.

## Contenus audio
- `data/audioContent.ts` : 6 pistes placeholder (fr/wo, types éducatif/orientation/
  apaisement/sécurité/urgence, statut « disponible bientôt »).
- `app/pages/audio.tsx` (route `/audio`) : interface prête, sans fichier audio requis.

## Urgence Sénégal
- Déjà correcte dans `app/pages/emergency.tsx` (SAMU 1515, Pompiers 18, Police 17 + `tel:`).
  Aucune modification nécessaire.

## Préparation SamaWér / laboratoire de données (V3, non activé)
- `lib/samawer/index.ts`, `lib/datalab/index.ts` : types + garde-fous
  (`SAMAWER_ENABLED=false`, `DATALAB_ENABLED=false`, `canCollect()` refuse toute collecte).
- `lib/V3_PREPARATION.md` : liste des fichiers/chantiers V3.

## Menu
- Nouvelles entrées : Écouter (audio), Préférences, Profil numérique.

## À tester dans Expo de ton côté
`npm install` puis `npm run web` / `npm run ios` / `npm run android`.
La logique de scoring est vérifiée ; le rendu des écrans (web + mobile) reste à confirmer
chez toi, car je ne peux pas lancer Expo dans mon environnement.
