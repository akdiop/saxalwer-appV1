# 🌍 SAXALWÉR - Application de Santé Reproductive

**Ton sanctuaire de santé reproductive en Afrique de l'Ouest**

> *SaxalWér* signifie "prendre soin de sa santé" en Wolof

[![Version](https://img.shields.io/badge/version-1.2-green)]()
[![Pages](https://img.shields.io/badge/pages-29-blue)]()
[![Languages](https://img.shields.io/badge/languages-FR%20|%20WO-orange)]()
[![Status](https://img.shields.io/badge/status-production-success)]()

---

## 🎯 Mission

Démocratiser l'accès à l'information sur la santé reproductive pour les femmes d'Afrique de l'Ouest, dans un espace **sécurisé**, **confidentiel** et **culturellement sensible**.

---

## ✨ Fonctionnalités Principales

### 🛡️ Confidentialité & Sécurité
- **Mode Discret** : Flou automatique sur 17 pages sensibles
- **Données Locales** : Stockage chiffré sur ton appareil
- **Anonymat** : Option mode anonyme dans la communauté

### 📚 Éducation & Information
- **Bibliothèque** : 150+ articles validés par experts
- **Chat IA** : Assistant Ndeye pour réponses personnalisées
- **Glossaire** : Termes médicaux expliqués simplement
- **FAQ** : Réponses aux questions fréquentes

### 🩺 Suivi de Santé
- **Tracker Cycle** : Suivi personnalisé de tes règles
- **Journal Intime** : Espace privé pour tes pensées
- **Statistiques** : 🆕 Graphiques détaillés de ton cycle
- **Calendrier** : 🆕 Gestion de tes rendez-vous médicaux

### 🗺️ Orientation & Support
- **Carte Interactive** : Centres de santé dans 8 pays
- **Annuaire Médecins** : Professionnels sensibilisés
- **Urgence** : Numéros disponibles 24h/24
- **Orientation Personnalisée** : Parcours adapté à ta situation

### 👥 Communauté
- **6 Salons Thématiques** : Endométriose, contraception, maternité...
- **Matching Intelligent** : Connexion avec profils similaires
- **Espace Sécurisé** : Modération active

---

## 🌍 Langues & Pays

### Langues
- 🇫🇷 **Français**
- 🇸🇳 **Wolof**
- 🔜 Bambara, Fulfuldé (prochainement)

### Pays Couverts
🇸🇳 Sénégal • 🇲🇱 Mali • 🇧🇫 Burkina Faso • 🇳🇪 Niger  
🇧🇯 Bénin • 🇹🇬 Togo • 🇨🇮 Côte d'Ivoire • 🇬🇼 Guinée-Bissau

---

## 🚀 Démarrage Rapide

### Prérequis
```bash
Node.js 18+
npm ou pnpm
```

### Installation
```bash
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

## 📂 Structure du Projet

```
saxalwer/
├── src/
│   ├── app/
│   │   ├── components/      # Composants réutilisables
│   │   ├── context/         # AppContext (state global)
│   │   ├── layouts/         # RootLayout
│   │   ├── pages/           # 29 pages de l'app
│   │   │   ├── Welcome.tsx
│   │   │   ├── WelcomeImproved.tsx  # 🆕
│   │   │   ├── HealthStats.tsx      # 🆕
│   │   │   ├── CalendarPage.tsx     # 🆕
│   │   │   └── ...
│   │   └── utils/           # Utilitaires
│   ├── styles/              # CSS global
│   └── imports/             # Assets Figma
├── supabase/                # Backend (Edge Functions)
├── docs/                    # Documentation
│   ├── INDEX.md             # 📚 Index de toute la doc
│   ├── WELCOME_DESIGN.md    # Design écran d'accueil
│   ├── NAVIGATION_GUIDE.md  # Guide de navigation
│   ├── VERIFICATION.md      # Tests et vérification
│   └── ...
├── package.json
└── README.md                # Ce fichier
```

---

## 🎨 Design System

### Palette de Couleurs
```css
/* Palette Principale */
--beige: #F5F1E6;
--deep-green: #1A3C34;
--terracotta: #A65D40;
--copper: #B5622A;
--cocoa: #4A2F27;
--gold: #D4AF37;
```

### Typographie
- **Serif** : Cormorant Garamond (titres)
- **Sans-serif** : Inter (corps de texte)

### Icônes
- Lucide React (open-source)

---

## 🆕 Nouveautés (Mars 2026)

### 📊 Page Statistiques de Santé
- Graphique d'évolution du flux menstruel (30 jours)
- Répartition de l'humeur (graphique circulaire)
- Top 5 des symptômes fréquents
- Observance contraception
- Vue d'ensemble du cycle actuel

### 📅 Page Calendrier
- Calendrier mensuel interactif
- Ajout/suppression de rendez-vous
- 4 types : Médical, Contraception, Cycle, Autre
- Rappels activables
- Intégration avec les données de cycle

### ✨ Écran d'Accueil Amélioré
- **Sélection de langue en première position** (FR/Wolof)
- **Illustration culturelle** : Silhouette africaine + symboles
- **Palette ajustée** : #0F3D2E, #E8DCC8, #C26A3D
- **Design minimal** : Focus sur confidentialité et sécurité
- **3 valeurs clés** : Confidentialité, Accompagnement, Fiabilité

---

## 📖 Documentation

### 🚀 Pour Commencer
- **[INDEX.md](INDEX.md)** - Index complet de la documentation
- **[SUMMARY.md](SUMMARY.md)** - Résumé exécutif du projet

### 🎨 Design
- **[WELCOME_DESIGN.md](WELCOME_DESIGN.md)** - Design écran d'accueil amélioré
- **[WELCOME_VISUAL_GUIDE.md](WELCOME_VISUAL_GUIDE.md)** - Guide visuel développeurs
- **[WELCOME_ASCII_ART.md](WELCOME_ASCII_ART.md)** - Aperçu visuel ASCII

### 🗺️ Navigation
- **[NAVIGATION_GUIDE.md](NAVIGATION_GUIDE.md)** - Guide de navigation complet
- **[VERIFICATION.md](VERIFICATION.md)** - Vérification des 29 pages

### 🧪 Tests
- **[TEST_CHECKLIST.md](TEST_CHECKLIST.md)** - Checklist de tests détaillée

---

## 🛠️ Technologies

### Frontend
- React 18.3.1
- React Router 7.13.0
- Motion (Framer Motion fork) 12.23.24
- Tailwind CSS 4
- Recharts 2.15.2
- Lucide React

### Backend
- Supabase (PostgreSQL)
- Supabase Edge Functions (Deno)
- Supabase Storage
- Supabase Auth

### Dev Tools
- TypeScript
- Vite
- pnpm

---

## 📱 Pages (29 au total)

### Principales
1. Dashboard (`/`)
2. Bibliothèque (`/bibliotheque`)
3. Chat IA (`/chat`)
4. Carte (`/carte`)
5. Profil (`/parcours`)

### Santé
6. Tracker (`/suivi`)
7. Journal (`/journal`)
8. Statistiques (`/stats-sante`) 🆕
9. Calendrier (`/calendrier`) 🆕
10. Orientation (`/orientation`)
11. Orientation Sensible (`/orientation-sensible`)

### Communauté
12. Communauté (`/communaute`)
13. Médecins (`/medecins`)
14. Urgence (`/urgence`)

### Contenu
15. FAQ (`/faq`)
16. Glossaire (`/glossaire`)
17. Ressources (`/ressources`)
18. À propos (`/a-propos`)
19. Tutoriel (`/tutoriel`)

... et 10 autres pages

---

## 🧪 Tests

### Lancer les Tests
```bash
# Tests manuels
npm run dev
# Suivre TEST_CHECKLIST.md

# Tests de build
npm run build
```

### Checklist
- [ ] Navigation fonctionnelle
- [ ] Mode discret actif
- [ ] Traductions FR/Wolof
- [ ] Graphiques s'affichent
- [ ] Calendrier interactif
- [ ] Responsive mobile

---

## 🚀 Déploiement

### Build Production
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Environnements
- **Staging** : À configurer
- **Production** : Figma Make / Vercel

---

## 🤝 Contribution

Nous accueillons les contributions ! Voici comment participer :

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Guidelines
- Code TypeScript strict
- Respect de la palette de couleurs
- Tests manuels obligatoires
- Documentation des nouvelles features

---

## 📊 Statistiques

| Métrique | Valeur |
|----------|--------|
| Pages | 29 |
| Lignes de Code | ~15,000 |
| Composants React | ~40 |
| Langues | 2 (FR, WO) |
| Pays Couverts | 8 |
| Articles | 150+ |
| Centres de Santé | 100+ |

---

## 🗓️ Roadmap

### Q1 2026 ✅
- [x] Statistiques de santé
- [x] Calendrier rendez-vous
- [x] Écran d'accueil amélioré
- [x] Documentation complète

### Q2 2026
- [ ] Export PDF statistiques
- [ ] Notifications push
- [ ] Synchronisation cloud
- [ ] Mode hors ligne

### Q3 2026
- [ ] Langues supplémentaires (Bambara, Fulfuldé)
- [ ] Extension autres pays
- [ ] Téléconsultation intégrée

### Q4 2026
- [ ] Intégration wearables
- [ ] Marketplace produits santé
- [ ] Programme ambassadrices

---

## 📞 Support

### Utilisatrices
- **FAQ** : Voir `/faq` dans l'app
- **Feedback** : Formulaire dans l'app (`/feedback`)
- **Email** : support@saxalwer.com (fictif)

### Développeurs
- **Issues** : GitHub Issues
- **Discord** : SaxalWer Dev Community (fictif)
- **Docs** : [INDEX.md](INDEX.md)

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier `LICENSE` pour plus de détails.

---

## 🙏 Remerciements

Merci à :
- **Toutes les femmes d'Afrique de l'Ouest** qui ont inspiré ce projet
- **Les professionnels de santé** pour leur validation médicale
- **La communauté open-source** pour les outils utilisés
- **Les bêta-testeuses** pour leurs retours précieux

---

## 🌟 Soutenir le Projet

Si SaxalWér t'aide, tu peux soutenir le projet :

- ⭐ **Star** le repo GitHub
- 💬 **Partager** avec d'autres femmes
- 📝 **Contribuer** au code ou à la doc
- 💰 **Donner** (lien Patreon/Ko-fi fictif)

---

## 📱 Contact

- **Website** : [saxalwer.com](https://saxalwer.com) (fictif)
- **Email** : hello@saxalwer.com (fictif)
- **Twitter** : [@SaxalWer](https://twitter.com/saxalwer) (fictif)
- **Instagram** : [@saxalwer](https://instagram.com/saxalwer) (fictif)

---

## 💚 Avec Amour

> *"Chaque femme mérite de comprendre et célébrer son corps."*

Créé avec 💚 pour les femmes d'Afrique de l'Ouest  
Par des femmes, pour des femmes

---

**Date** : Mars 2026  
**Version** : 1.2  
**Statut** : ✅ Production

---

*Made with ❤️ in Senegal 🇸🇳 and beyond 🌍*
