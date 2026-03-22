**SAXALWER - Application de Santé Reproductive**

_Ton sanctuaire de santé reproductive en Afrique de l'Ouest_

SaxalWér signifie "prendre soin de sa santé" en Wolof

**Mission**

Démocratiser l'accès à l'information sur la santé reproductive pour les femmes d'Afrique de l'Ouest, dans un espace intelligent, sécurisé, confidentiel et culturellement sensible.

**Fonctionnalités Principales**
- Confidentialité & Sécurité
- Mode Discret : Flou automatique sur 17 pages sensibles
- Données Locales : Stockage chiffré sur ton appareil
- Anonymat : Option mode anonyme dans la communauté
- Education & Information
- Bibliothèque : 150+ articles validés par experts
- Chat IA : Assistant Ndeye pour réponses personnalisées
- Glossaire : Termes médicaux expliqués simplement
- FAQ : Réponses aux questions fréquentes
- Suivi de Santé
- Tracker Cycle : Suivi personnalisé de tes règles
- Journal Intime : Espace privé pour tes pensées
- Statistiques : Graphiques détaillés de ton cycle 
- Calendrier : Gestion de tes rendez-vous médicaux 
- Orientation & Support
- Carte Interactive : Centres de santé au Sénégal
- Annuaire Médecins : Professionnels sensibilisés
- Urgence : Numéros disponibles 24h/24
- Orientation Personnalisée : Parcours adapté à ta situation
- Communauté : 6 Salons Thématiques : Endométriose, contraception, maternité... / Matching Intelligent : Connexion avec profils similaires / Espace Sécurisé : Modération active

**Langues & Pays**
**Langues**
Français
Wolof
Peulh, serere, dioula etc. (prochainement)

Pays Couverts
Sénégal - sous région éventuellement 

**Démarrage Rapide**

Prérequis
_bash
Node.js 18+
npm ou pnpm
Installation_

bash
# Cloner le repo
git clone https://github.com/saxalwer/app.git

# Installer les dépendances
cd app
npm install

# Lancer en développement
npm run dev
```

### Accès
```
http://localhost:5173
```

---

## Structure du Projet
```
saxalwer/
├── src/
│   ├── app/
│   │   ├── components/      # Composants réutilisables
│   │   ├── context/         # AppContext (state global)
│   │   ├── layouts/         # RootLayout
│   │   ├── pages/           # 29 pages de l'app
│   │   │   ├── Welcome.tsx
│   │   │   ├── WelcomeImproved.tsx  
│   │   │   ├── HealthStats.tsx      
│   │   │   ├── CalendarPage.tsx     
│   │   │   └── ...
│   │   └── utils/           # Utilitaires
│   ├── styles/              # CSS global
│   └── imports/             # Assets Figma
├── supabase/                # Backend (Edge Functions)
├── docs/                    # Documentation
│   ├── INDEX.md             # Index de toute la doc
│   ├── WELCOME_DESIGN.md    # Design écran d'accueil
│   ├── NAVIGATION_GUIDE.md  # Guide de navigation
│   ├── VERIFICATION.md      # Tests et vérification
│   └── ...
├── package.json
└── README.md                # Ce fichier
Design System

**Palette de Couleurs**
css
**/* Palette Principale */**
--beige: #F5F1E6;
--deep-green: #1A3C34;
--terracotta: #A65D40;
--copper: #B5622A;
--cocoa: #4A2F27;
--gold: #D4AF37;

**Typographie**
Serif : Cormorant Garamond (titres)
Sans-serif : Inter (corps de texte)

**Icônes**
Lucide React (open-source)

**Nouveautés (Mars 2026)**
- Page Statistiques de Santé
- Graphique d'évolution du flux menstruel (30 jours)
- Répartition de l'humeur (graphique circulaire)
- Top 5 des symptômes fréquents
- Observance contraception
- Vue d'ensemble du cycle actuel
- Page Calendrier
- Calendrier mensuel interactif
- Ajout/suppression de rendez-vous
- 4 types : Médical, Contraception, Cycle, Autre
- Rappels activables
- Intégration avec les données de cycle
- Ecran d'Accueil Amélioré
- Sélection de langue en première position (FR/Wolof)
- Illustration culturelle : Silhouette africaine + symboles

**Palette ajustée**

#0F3D2E, 
#E8DCC8, 
#C26A3D

Design minimal : Focus sur confidentialité et sécurité
3 valeurs clés : Confidentialité, Accompagnement, Fiabilité

**Documentation**

_Pour Commencer_
INDEX.md - Index complet de la documentation
SUMMARY.md - Résumé exécutif du projet

_Design_
WELCOME_DESIGN.md - Design écran d'accueil amélioré
WELCOME_VISUAL_GUIDE.md - Guide visuel développeurs
WELCOME_ASCII_ART.md - Aperçu visuel ASCII
Navigation
NAVIGATION_GUIDE.md - Guide de navigation complet
VERIFICATION.md - Vérification des 29 pages

_Tests_
TEST_CHECKLIST.md - Checklist de tests détaillée

_Technologies_
Frontend
React 18.3.1
React Router 7.13.0
Motion (Framer Motion fork) 12.23.24
Tailwind CSS 4
Recharts 2.15.2
Lucide React
Backend
Supabase (PostgreSQL)
Supabase Edge Functions (Deno)
Supabase Storage
Supabase Auth
Dev Tools
TypeScript
Vite
pnpm

Pages (29 au total)

**Principales**
Dashboard (/)
Bibliothèque (/bibliotheque)
Chat IA (/chat)
Carte (/carte)
Profil (/parcours)
Santé
Tracker (/suivi)
Journal (/journal)
Statistiques (/stats-sante) - nouveau
Calendrier (/calendrier) - nouveau
Orientation (/orientation)
Orientation Sensible (/orientation-sensible)
Communauté
Communauté (/communaute)
Médecins (/medecins)
Urgence (/urgence)
Contenu
FAQ (/faq)
Glossaire (/glossaire)
Ressources (/ressources)
A propos (/a-propos)
Tutoriel (/tutoriel)
... et 10 autres pages

Tests
Lancer les Tests
bash

# Tests manuels
npm run dev
# Suivre TEST_CHECKLIST.md

# Tests de build
npm run build
Checklist
 Navigation fonctionnelle
 Mode discret actif
 Traductions FR/Wolof
 Graphiques s'affichent
 Calendrier interactif
 Responsive mobile
Déploiement
Build Production
bash
npm run build
Preview
bash
npm run preview
Environnements
Staging : A configurer

**Guidelines**
Code TypeScript strict
Respect de la palette de couleurs
Tests manuels obligatoires
Documentation des nouvelles features
Statistiques
Métrique	Valeur
Pages	29
Lignes de Code	~15,000
Composants React	~40
Langues	2 (FR, WO)
Pays Couverts	8
Articles	150+
Centres de Santé	100+
Roadmap

Q3 2026 - Complété
 Statistiques de santé
 Calendrier rendez-vous
 Ecran d'accueil amélioré
 Documentation complète
 
Q2 2027
 Export PDF statistiques
 Notifications push
 Synchronisation cloud
 Mode hors ligne
 
Q3 2027
 Langues supplémentaires 
 Extension autres pays
 Téléconsultation intégrée
 
Q4 2027
 Intégration wearables
 Marketplace produits santé
 Programme ambassadrices
 
Support
Utilisatrices
FAQ : Voir /faq dans l'app
Feedback : Formulaire dans l'app (/feedback)

Email : contact@saxalwer.com 

Développeurs
Issues : GitHub Issues

Docs : INDEX.md

Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

Remerciements
Merci à :
Toutes les femmes d'Afrique de l'Ouest qui ont inspiré ce projet
Les professionnels de santé pour leur validation médicale
La communauté open-source pour les outils utilisés
Les bêta-testeuses pour leurs retours précieux

Soutenir le Projet
Si SaxalWér t'aide, tu peux soutenir le projet :
Star le repo GitHub
Partager avec d'autres femmes
Contribuer au code ou à la doc
Donner (lien Patreon/Ko-fi fictif)
Contact
Website : saxalwer.com 
Email : contact@saxalwer.com 
Twitter : @SaxalWer 
Instagram : @saxalwer 

_**Avec Amour
"Chaque femme mérite de comprendre et célébrer son corps."**_

Créé avec amour pour les femmes d'Afrique de l'Ouest
Par des femmes, pour des femmes

Date : Mars 2026 Version : 1.2 Statut : Production
Made with love in Senegal and beyond