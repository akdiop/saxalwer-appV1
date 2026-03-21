# SaxalWér - Splash Screen

## Vue d'ensemble

L'écran de démarrage (splash screen) de SaxalWér a été conçu avec une esthétique minimaliste et culturellement ancrée, reflétant les valeurs de discrétion, d'élégance et de respect qui définissent l'application.

## Caractéristiques du design

### Palette de couleurs
- **Fond principal** : Vert profond (`#0F3D2E`) - évoque la nature, la sécurité, et la discrétion
- **Éléments principaux** : Beige sable chaud (`#E8DCC8`) - évoque la terre, la chaleur, et l'accueil

### Éléments visuels

1. **Logo central SaxalWér**
   - Design en forme de lotus symbolisant le bien-être et les soins féminins
   - Taille : 144px
   - Composant réutilisable : `<SaxalwerLogo />`

2. **Croissant de lune**
   - Symbolise les cycles menstruels
   - Intégré élégamment en haut à droite du logo
   - Légèrement transparent pour plus de subtilité

3. **Continent africain**
   - Silhouette très discrète en arrière-plan (opacité 5%)
   - Ancrage culturel et géographique
   - Ne distrait pas de l'élément principal

4. **Baobab**
   - Icône au bas de l'écran (opacité 15%)
   - Symbolise la force, la longévité, et la sagesse africaine
   - Composant réutilisable : `<BaobabIcon />`

### Typographie

- **Titre "SAXALWÉR"** : Cormorant Garamond, 60px (6xl)
  - Police serif élégante
  - Lettres espacées pour plus de sophistication
  - Couleur beige sable

- **Tagline** : Inter, 16px
  - "Un espace discret pour comprendre ton corps."
  - Ton respectueux et rassurant
  - Légèrement transparent (85% d'opacité)

### Animations

1. **Fade-in global** : 1.2s
   - Apparition douce de tous les éléments
   - Mouvement vertical subtil

2. **Anneau pulsant** : 3s en boucle
   - Autour du logo
   - Effet de "respiration" calme

3. **Indicateur de chargement** : 3 points
   - Animation séquentielle (décalage de 250ms)
   - Pulse doux (1.5s)

## Accès et navigation

### Routes
- **URL principale** : `/splash`
- **Depuis la navigation dev** : `/dev` → "✨ Splash Screen"

### Logique de navigation automatique
Après 3 secondes, l'utilisateur est automatiquement redirigé vers :
- `/onboarding` si c'est la première visite
- `/dashboard` si l'onboarding a déjà été complété

## Composants réutilisables créés

### 1. SaxalwerLogo
```tsx
import { SaxalwerLogo } from '../components/SaxalwerLogo';

<SaxalwerLogo 
  size={144}           // Taille en pixels
  showMoon={true}      // Afficher le croissant de lune
  variant="light"      // "light" ou "dark"
  className=""         // Classes CSS additionnelles
/>
```

### 2. BaobabIcon
```tsx
import { BaobabIcon } from '../components/BaobabIcon';

<BaobabIcon 
  size={56}            // Largeur en pixels
  color="currentColor" // Couleur du SVG
  opacity={0.15}       // Opacité (0-1)
  className=""         // Classes CSS additionnelles
/>
```

### 3. Export centralisé
```tsx
// Importer depuis l'index
import { SaxalwerLogo, BaobabIcon } from '../components';
```

## Principes de design respectés

### ✅ Minimal et élégant
- Aucun élément superflu
- Composition centrée et équilibrée
- Beaucoup d'espace négatif

### ✅ Calme et rassurant
- Animations douces et lentes
- Couleurs apaisantes
- Aucun mouvement brusque

### ✅ Ancrage culturel
- Continent africain
- Baobab (arbre sacré)
- Palette de couleurs terre

### ✅ Discret et sécurisé
- Pas d'imagerie médicale froide
- Pas de contenu sexualisé
- Design respectueux et professionnel

### ✅ Symbolisme féminin
- Croissant de lune (cycles)
- Lotus (bien-être)
- Formes douces et organiques

## Format et responsivité

- **Format** : Écran mobile vertical (iPhone 14 comme référence)
- **Hauteur** : 100vh (plein écran)
- **Largeur** : 100% avec padding horizontal de 24px
- **Responsive** : S'adapte à toutes les tailles d'écran mobile

## Notes techniques

### Fichiers créés
- `/src/app/pages/SplashScreen.tsx` - Écran de démarrage
- `/src/app/components/SaxalwerLogo.tsx` - Logo réutilisable
- `/src/app/components/BaobabIcon.tsx` - Icône baobab réutilisable
- `/src/app/components/index.ts` - Export centralisé

### Modifications
- `/src/app/App.tsx` - Ajout de la route `/splash`
- `/src/app/pages/DevNavigation.tsx` - Ajout du lien vers le splash screen

### Dépendances
- `react-router` - Navigation
- `lucide-react` - Icône Moon

## Utilisation dans d'autres contextes

Les composants `SaxalwerLogo` et `BaobabIcon` peuvent être réutilisés partout dans l'application :
- Pages de connexion/inscription
- En-têtes de pages
- Écrans de chargement
- Messages d'erreur personnalisés
- À propos / Crédits

## Personnalisation future

Pour modifier le splash screen :

1. **Durée** : Modifier le `setTimeout` dans `SplashScreen.tsx` (actuellement 3000ms)
2. **Navigation** : Changer les destinations dans la logique de navigation
3. **Couleurs** : Utiliser les props `variant` du logo ou modifier les classes Tailwind
4. **Animations** : Ajuster les keyframes CSS dans la balise `<style>`
