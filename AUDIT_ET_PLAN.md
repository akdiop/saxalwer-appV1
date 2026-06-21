# SaxalWér V1 — Audit & plan de finalisation

Version : audit du 20 juin 2026. Projet : Expo / React Native (expo-router, RN 0.81).

## 1. Le constat qui change tout

La plupart des fonctionnalités de ta liste **existent déjà dans le code**, mais elles ne
sont **branchées à aucun écran**. Une session précédente a créé les contenus/modules sans
les câbler. Résultat : tu ne les vois pas dans l'appli, et tu penses qu'elles manquent.

| Demande | État réel | Fichier existant | Câblé à un écran ? |
|---|---|---|---|
| Pages légales (CGU, confidentialité, mentions) | **Déjà écrit, fidèle aux PDF** | `data/legalContent.ts` (`LEGAL_DOCUMENTS`) | ❌ 0 écran |
| Avertissement médical renforcé | **Déjà écrit** | `data/legalContent.ts` | ❌ (écran legal affiche un texte codé en dur, plus pauvre) |
| Annuaire « à vérifier » + psychologue + femme | **Déjà écrit** (`verified:false`, `womanProvider`) | `data/providersExtra.ts` | ❌ 0 écran |
| Contenus VBG + soutien psychologique | **Déjà écrit** | `data/vbgContent.ts` (`SUPPORT_ARTICLES`, `VBG_EMERGENCY`) | ❌ 0 écran |
| Mode discret — titres neutres | **Déjà écrit** (tes exemples exacts) | `utils/discreetTitles.ts` (`getDiscreetTitle`, `isSensitiveTopic`) | ❌ 0 écran |
| Urgence Sénégal (1515 / 18 / 17) | Présent dans `data/legalContent.ts` + écran `app/pages/emergency.tsx` | — | ✅ écran urgence existe |
| Score d'autonomie numérique | Référencé partiellement | `orientation-sensible`, `library` | partiel |
| Préparation SamaWér | Référencé | `context/appcontext.tsx` + docs | amorcé |
| Scoring socioculturel renforcé | **Réellement absent** sous ce nom | (proche : `utils/personalizationMapper.ts`) | — |

**Conclusion : le travail n'est pas de générer, c'est de CÂBLER l'existant + corriger.**
Générer « la V2 » à l'aveugle aurait créé une 3ᵉ copie de ces modules.

## 2. Ce que j'ai déjà fait dans cette livraison (sûr et vérifié)

- Supprimé le code mort confirmé : `app_old/` (template Expo), `src/` (stack React
  Navigation morte, incompatible avec expo-router), `verify_files.js`,
  `scripts/reset-project.js`, `app/dev.tsx` (route de debug).
- Intégré le **logo officiel** : `assets/brand/SAXALWER_Logo_fond-transparent.png`.

## 3. Correction de mon audit initial (important)

J'avais d'abord annoncé « 17 écrans dupliqués, supprimer `app/pages/` ». **C'était faux.**
`app/pages/` contient le **vrai code**. Les 21 fichiers `app/*.tsx` sont des **alias d'URL
en français** (ex. `app/urgence.tsx` = `export { default } from './pages/emergency'`).
Supprimer `app/pages/` aurait cassé toute l'appli.

**Vrais doublons** (contenu réel des deux côtés), à résoudre au cas par cas :
- `app/chat.tsx` (2901 l.) vs `app/pages/chat.tsx` (1255 l.)
- `app/profil.tsx` (1051 l.) vs `app/pages/profil.tsx` (1078 l.)
- `app/orientation-sensible.tsx` (544 l.) vs `app/pages/orientation-sensible.tsx` (673 l.)

→ Ne PAS supprimer à l'aveugle. Il faut vérifier vers quelle route pointe la navigation,
garder l'implémentation utilisée, et transformer l'autre en alias (ou la supprimer).

## 4. Problème de fond : affichage web ET mobile

Le projet mélange du React Native (`View`/`Text`, 104 fichiers) avec des librairies
**web uniquement** : 26 fichiers importent `@radix-ui`, 19 utilisent des balises DOM
(`<div>`), 42 utilisent `className=` alors que **NativeWind n'est pas installé** (ce style
ne s'applique nulle part). Ces fichiers sont surtout dans `components/ui/` (style shadcn).
Tant qu'ils sont importés par des écrans actifs, l'« affichage web et mobile » restera
fragile. Décision à prendre : soit retirer ces composants web, soit assumer une cible
Expo Web et installer/réparer le système de style.

## 5. Plan de finalisation recommandé (par ordre de risque croissant)

**Étape A — câblage sûr (pur RN, faible risque) :**
1. Écran légal → afficher `LEGAL_DOCUMENTS` (sélecteur des 4 docs) au lieu du texte codé en dur.
2. Annuaire → afficher `PROVIDERS_EXTRA` avec badge « À vérifier » (`verified:false`),
   filtre « professionnelle femme » (`womanProvider`), entrées psychologue.
3. Section soutien → afficher `SUPPORT_ARTICLES` (VBG + psychologique) + bloc `VBG_EMERGENCY`.
4. Bibliothèque → appliquer `getDiscreetTitle()` sur les titres de rubriques et masquer
   les rubriques sensibles via `isSensitiveTopic()` + `SensitiveContent` quand `discreteMode`.

**Étape B — nettoyage des 3 vrais doublons** (après vérification des routes de navigation).

**Étape C — manque réel : scoring socioculturel renforcé** (nouveau module + écran).

**Étape D — santé web/mobile** : décider du sort de `components/ui/` (radix/DOM/className).

Chaque étape se teste dans Expo (`npm install` puis `npm run web` / `npm run ios`) avant
de passer à la suivante.
