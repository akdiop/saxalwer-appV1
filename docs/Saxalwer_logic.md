# 📚 SaxalWér - Documentation Complète du Projet

> **Application de santé reproductive pour les femmes du Sénégal**  
> Esthétique inspirée des posters africains vintage • Bilingue FR/Wolof • Mode discret & vocal

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture du Projet](#architecture-du-projet)
3. [Système de Routing](#système-de-routing)
4. [State Management (AppContext)](#state-management-appcontext)
5. [Design System & Esthétique](#design-system--esthétique)
6. [Fonctionnalités Principales](#fonctionnalités-principales)
7. [Modes Spéciaux](#modes-spéciaux)
8. [Flux Utilisateur](#flux-utilisateur)
9. [Intégration Backend (Supabase)](#intégration-backend-supabase)
10. [Conventions de Code](#conventions-de-code)
11. [Pages & Composants](#pages--composants)
12. [Utils & Helpers](#utils--helpers)

---

## 🎯 Vue d'Ensemble

### Concept
**SaxalWér** (wolof : "Mon chemin/parcours") est une application de santé reproductive conçue spécifiquement pour les femmes sénégalaises, avec une attention particulière à la discrétion, l'accessibilité linguistique et culturelle.

### Objectifs Principaux
- ✅ Éducation sur la santé reproductive
- ✅ Suivi de cycle menstruel et contraception
- ✅ Orientation santé (générale et sensible)
- ✅ Accès aux ressources (centres de santé, médecins)
- ✅ Assistant conversationnel contextuel
- ✅ Communauté de discussion (6 salons thématiques)
- ✅ Discrétion maximale (mode discret)

### Technologies
- **Framework**: React 18.3.1
- **Routing**: React Router v7.13.0
- **Styling**: Tailwind CSS v4
- **State**: React Context + localStorage
- **Backend**: Supabase
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animation**: Motion (ex-Framer Motion)

---

## 🏗️ Architecture du Projet

```
/src
├── app/
│   ├── App.tsx                    # Point d'entrée principal avec RouterProvider
│   ├── components/                # Composants réutilisables
│   │   ├── ui/                   # Composants UI (shadcn-style)
│   │   ├── AccountChoice.tsx     # Choix création compte/invité
│   │   ├── ContextualPersonalization.tsx  # Étape personnalisation onboarding
│   │   ├── GlossaryText.tsx      # Composant pour termes avec définitions
│   │   ├── HamburgerMenu.tsx     # Menu latéral principal
│   │   ├── Onboarding.tsx        # Ancien composant onboarding
│   │   ├── OralHelper.tsx        # Hook pour synthèse vocale
│   │   └── SymptomLogger.tsx     # Logger de symptômes avec intensité
│   ├── context/
│   │   └── AppContext.tsx        # Context principal de l'application
│   ├── layouts/
│   │   └── RootLayout.tsx        # Layout avec navbar, discrete mode toggle
│   ├── pages/                    # 29+ pages de l'application
│   │   ├── SplashScreen.tsx      # Splash screen (3.5s)
│   │   ├── WelcomeImproved.tsx   # Écran de bienvenue avec sélection langue
│   │   ├── OnboardingPage.tsx    # Onboarding (âge → besoins → personnalisation)
│   │   ├── AuthPage.tsx          # Page création compte/invité
│   │   ├── Dashboard.tsx         # Page d'accueil principale
│   │   ├── Library.tsx           # Bibliothèque d'articles avec filtres
│   │   ├── ArticleDetail.tsx     # Détail article avec audio
│   │   ├── Chat.tsx              # Assistant conversationnel SaxalWér
│   │   ├── Tracker.tsx           # Suivi de cycle menstruel
│   │   ├── MapPage.tsx           # Carte des centres de santé
│   │   ├── CenterDetail.tsx      # Détail d'un centre
│   │   ├── ProfilePage.tsx       # Page profil "SamaWér"
│   │   ├── EditProfile.tsx       # Édition du profil
│   │   ├── EmergencyPage.tsx     # Page d'urgence
│   │   ├── Journal.tsx           # Journal intime
│   │   ├── Doctors.tsx           # Annuaire médecins
│   │   ├── Orientation.tsx       # Orientation santé générale
│   │   ├── OrientationSensible.tsx  # Orientation santé sensible (violences)
│   │   ├── ContextPage.tsx       # Page "Mon contexte"
│   │   ├── CommunityPage.tsx     # Espace communautaire (6 salons)
│   │   ├── HealthStats.tsx       # Statistiques de santé (graphiques)
│   │   ├── CalendarPage.tsx      # Calendrier rendez-vous
│   │   ├── NotificationCenter.tsx # Centre de notifications
│   │   ├── Glossaire.tsx         # Glossaire de termes
│   │   ├── Ressources.tsx        # Ressources par étape de vie
│   │   ├── LifeStageDetail.tsx   # Détail étape de vie
│   │   ├── FaithResources.tsx    # Ressources par confession religieuse
│   │   ├── FAQ.tsx               # Questions fréquentes
│   │   ├── Feedback.tsx          # Formulaire de feedback
│   │   ├── About.tsx             # À propos
│   │   ├── Tutorial.tsx          # Tutoriel de l'app
│   │   ├── NotFoundPage.tsx      # Page 404
│   │   └── DevNavigation.tsx     # Navigation développeur (/dev)
│   └── utils/
│       ├── conversationFlows.ts  # 4 flows conversationnels pour Chat
│       ├── splashUtils.ts        # Gestion du splash screen
│       └── personalizationMapper.ts  # Mapping personnalisation → profil
├── imports/                       # Assets importés depuis Figma
├── styles/
│   ├── theme.css                 # Thème CSS (variables, tokens)
│   └── fonts.css                 # Imports de fonts
└── index.html
```

---

## 🛤️ Système de Routing

### Configuration (App.tsx)

```typescript
// React Router v7 Data Mode avec createBrowserRouter
const router = createBrowserRouter([
  { path: "/splash", Component: SplashScreen },
  { path: "/dev", Component: DevNavigation },
  { path: "/welcome", Component: WelcomeImproved },
  { path: "/onboarding", Component: OnboardingPage },
  {
    path: "/",
    Component: RootLayout,  // Layout avec navbar
    children: [
      { index: true, Component: Dashboard },
      { path: "bibliotheque", children: [
        { index: true, Component: Library },
        { path: ":id", Component: ArticleDetail }
      ]},
      { path: "chat", Component: Chat },
      { path: "carte", children: [
        { index: true, Component: MapPage },
        { path: ":id", Component: CenterDetail }
      ]},
      { path: "suivi", Component: Tracker },
      { path: "parcours", Component: ProfilePage },
      { path: "urgence", Component: EmergencyPage },
      { path: "journal", Component: Journal },
      { path: "medecins", Component: Doctors },
      { path: "edit-profile", Component: EditProfile },
      { path: "auth", Component: AuthPage },
      { path: "faq", Component: FAQ },
      { path: "feedback", Component: Feedback },
      { path: "a-propos", Component: About },
      { path: "orientation", Component: Orientation },
      { path: "orientation-sensible", Component: OrientationSensible },
      { path: "notifications", Component: NotificationCenter },
      { path: "glossaire", Component: Glossaire },
      { path: "ressources", Component: Ressources },
      { path: "etape/:stage", Component: LifeStageDetail },
      { path: "tutoriel", Component: Tutorial },
      { path: "ressources-de-faith", Component: FaithResources },
      { path: "mon-contexte", Component: ContextPage },
      { path: "communaute", children: [
        { index: true, Component: CommunityPage },
        { path: ":roomId", Component: CommunityPage }
      ]},
      { path: "stats-sante", Component: HealthStats },
      { path: "calendrier", Component: CalendarPage },
    ]
  },
  { path: "*", Component: NotFoundPage }
]);
```

### Flux de Navigation Automatique

```
1. SPLASH SCREEN (/splash)
   ↓ 3.5s
2. WELCOME (/welcome)
   ↓ Sélection langue + consentement
3. ONBOARDING (/onboarding)
   ↓ âge → besoins → personnalisation
4. DASHBOARD (/)
   ↓ Accès à toutes les fonctionnalités
```

### Guards de Navigation (RootLayout.tsx)

```typescript
// 1. Toujours vérifier le splash d'abord
if (shouldShowSplash()) {
  return <Navigate to="/splash" replace />;
}

// 2. Vérifier si welcome a été vu
if (!hasSeenWelcome && location.pathname !== '/welcome') {
  return <Navigate to="/welcome" replace />;
}

// 3. Vérifier l'onboarding
if (!isOnboarded && !location.pathname.startsWith('/onboarding')) {
  return <Navigate to="/onboarding" replace />;
}
```

---

## 🗂️ State Management (AppContext)

### Structure du State Global

```typescript
interface AppState {
  // Onboarding
  selectedAge: string | null;
  selectedNeeds: string[];
  selectedGoals: GoalId[];  // 'cycle' | 'grossesse' | 'menopause' | 'bienetre'
  lifeSituation: LifeSituation | null;
  isOnboarded: boolean;
  hasConsented: boolean;
  hasSeenWelcome: boolean;
  
  // Personnalisation contextuelle
  personalization: PersonalizationContext;  // 8 dimensions
  
  // Modes
  discreteMode: boolean;      // Floutage de l'interface
  oralMode: boolean;          // Synthèse vocale
  language: Language;         // 'fr' | 'wo'
  
  // Contenu utilisateur
  favorites: number[];        // IDs d'articles favoris
  journalEntries: JournalEntry[];
  feedbackEntries: FeedbackEntry[];
  
  // Notifications
  cycleNotifications: CycleNotification[];
  notificationPreferences: NotificationPreferences;
  
  // Profil
  userProfile: UserProfile;   // 10 champs (name, photo, birthdate, etc.)
  
  // Tracking
  cycleData: CycleData;       // Suivi de cycle + pilule + logs quotidiens
  glossaryViews: Record<string, number>;
  
  // Orientations
  orientationSession: OrientationSession;
  sensitiveOrientation: SensitiveOrientationSession;
  
  // Accès rapide
  quickAccessItems: QuickAccessId[];
  privacyConcern: boolean;
}
```

### Persistence

- **Storage**: localStorage avec clé `'samawer_state'`
- **Stratégie**: Sauvegarde à chaque changement de state (si `isLoaded === true`)
- **Migration**: Merge avec `defaultState` pour gérer les nouveaux champs

### Personnalisation Contextuelle (PersonalizationContext)

```typescript
interface PersonalizationContext {
  ageRange: '15-17' | '18-24' | '25-34' | '35-49' | '50+' | null;
  livingContext: 'alone' | 'parents' | 'partner' | 'roommates' | 'family' | null;
  privacyLevel: 'low' | 'medium' | 'high' | 'very-high' | null;
  socialNorms: 'conservative' | 'moderate' | 'open' | null;
  educationLevel: 'basic' | 'intermediate' | 'advanced' | null;
  preferredTone: 'formal' | 'friendly' | 'sisterly' | null;
  audioPreference: 'always' | 'sometimes' | 'never' | null;
  needsSupport: boolean;
}
```

**Comportements automatiques**:
- `privacyLevel: 'high' | 'very-high'` → Active automatiquement `discreteMode`
- `audioPreference: 'always'` → Active automatiquement `oralMode`
- `livingContext: 'parents'` → Désactive notifications de cycle, fréquence mensuelle

### Notifications Intelligentes

6 catégories de notifications avec fréquences personnalisables:
1. **cycles**: Rappels de cycle menstruel
2. **contraception**: Rappels contraception
3. **articleOfDay**: Article du jour
4. **dailyTip**: Astuce quotidienne
5. **symptomLog**: Rappel de journaliser
6. **orientation**: Réévaluation orientation

**Système de fréquence**:
- `daily`: Toutes les 24h
- `weekly`: Tous les 7 jours
- `monthly`: Tous les 30 jours

**Anti-spam**: Maximum 2 notifications aléatoires envoyées à la fois.

---

## 🎨 Design System & Esthétique

### Palette de Couleurs (Tons Terre - Vintage Africain)

```css
/* Couleurs principales */
--deep-green: #0F3D2E      /* Vert profond (primaire) */
--sand-beige: #E8DCC8      /* Beige sable (background) */
--terracotta: #C26A3D      /* Terracotta (accents chauds) */
--cacao-brown: #4A2F27     /* Brun cacao (textes) */
--copper: #B5622A          /* Cuivre (détails) */

/* Usage */
--background: var(--sand-beige)
--primary: var(--deep-green)
--accent: var(--terracotta)
--text: var(--cacao-brown)
```

### Typographie

```css
/* Headers */
font-family: 'Playfair Display', serif;
/* Utilisé pour: Titres principaux, logos */

/* Body */
font-family: 'Inter', sans-serif;
/* Utilisé pour: Textes courants, UI */
```

**⚠️ IMPORTANT**: Ne pas utiliser les classes Tailwind pour `font-size`, `font-weight`, `line-height` sauf demande explicite. Utiliser les valeurs par défaut définies dans `/src/styles/theme.css`.

### Effets Visuels Signature

1. **Texture Papier**:
```css
background-image: 
  linear-gradient(rgba(181,98,42,0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(181,98,42,0.03) 1px, transparent 1px),
  radial-gradient(ellipse at 50% 50%, rgba(74,47,39,0.02) 0%, transparent 70%);
background-size: 4px 4px, 4px 4px, 100% 100%;
opacity: 0.5;
```

2. **Gradient Organique**:
```css
background: radial-gradient(circle, ${color}20 0%, transparent 70%);
border-radius: 50% 30% 70% 40%;
transform: rotate(-15deg);
filter: blur(80px);
```

3. **Ombres Douces**:
```css
box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(181,98,42,0.15);
```

### Principes de Design

- **Tutoiement systématique**: "Tu" partout (FR) / "Yow" (Wolof)
- **Métaphores naturelles**: Baobab, lune, terre, fleuve, étoiles
- **Iconographie**: Lucide React avec `strokeWidth={2}` par défaut
- **Animations**: Subtiles, 200-300ms, `ease-out`
- **Espacement**: Généreux, aéré (padding: 16-24px)

---

## ⚙️ Fonctionnalités Principales

### 1. Bibliothèque d'Articles (/bibliotheque)

**Filtres disponibles**:
- Par étape de vie (adolescence, fertilité, grossesse, ménopause)
- Par thématique (cycles, contraception, anatomie, MST, violences, bien-être)
- Recherche textuelle
- Favoris uniquement

**Fonctionnalités**:
- ❤️ Favoris persistés
- 🔊 Lecture audio (synthèse vocale si oralMode)
- 🔒 Mode discret (floute le contenu)
- 📊 700+ articles (mock data)

### 2. Suivi de Cycle (/suivi)

**Données trackées**:
- Date dernières règles
- Longueur du cycle (défaut: 28j)
- Durée des règles (défaut: 5j)
- Logs quotidiens: humeur, symptômes (avec intensité 1-3), flux, notes
- Suivi pilule (optionnel)

**Visualisations**:
- Calendrier visuel du cycle
- Prédictions prochaines règles
- Historique des symptômes

### 3. Assistant Conversationnel (/chat)

**4 Flows Principaux** (définis dans `/src/app/utils/conversationFlows.ts`):

1. **CYCLE_TRACKING**: Questions sur le cycle menstruel
2. **CONTRACEPTION_ADVICE**: Conseils contraception
3. **SYMPTOMS_INQUIRY**: Analyse de symptômes
4. **GENERAL_HEALTH**: Santé reproductive générale

**Intelligence contextuelle**:
- Adapte le ton selon `personalization.preferredTone`
- Utilise le prénom de l'utilisateur si disponible
- Référence le profil (âge, situation familiale, etc.)
- Suggère des ressources pertinentes

**Format des réponses**:
- Texte adapté au niveau d'éducation
- Métaphores culturelles
- Émojis contextuels
- Liens vers articles de la bibliothèque

### 4. Carte des Ressources (/carte)

**Données**:
- 150+ centres de santé (mock)
- Catégories: hôpital, clinique, centre de santé, planning familial, pharmacie
- Services: consultation, contraception, dépistage, urgences, etc.

**Fonctionnalités**:
- Filtrage par type et services
- Détail complet (horaires, contact, services, avis)
- Navigation GPS (simulée)

### 5. Orientations Santé

#### Orientation Générale (/orientation)
- 10 questions de triage
- Niveaux: surveillance / recommended / urgent
- Conseils adaptés au niveau

#### Orientation Sensible (/orientation-sensible)
- Focus: violences, abus, santé mentale
- Détection multi-dimensionnelle
- Niveau: surveillance / recommended / priority
- Détection risque de confidentialité → Suggestion mode discret

### 6. Communauté (/communaute)

**6 Salons Thématiques**:
1. 🌸 **Cycles & Règles**: Témoignages, questions
2. 🛡️ **Contraception**: Partage d'expériences
3. 🤰 **Grossesse & Maternité**: Conseils, soutien
4. 💬 **Questions Intimes**: Safe space
5. 🌱 **Bien-être**: Santé globale
6. 🎯 **Orientation & Urgences**: Aide rapide

**Fonctionnalités**:
- Messages anonymes (pseudonyme généré)
- Réactions (❤️, 🙏, 💪, 🌸)
- Modération simulée
- Mode discret compatible

### 7. Statistiques de Santé (/stats-sante)

**Graphiques (Recharts)**:
- Évolution des symptômes (7 derniers jours)
- Fréquence des symptômes (30 derniers jours)
- Distribution humeur (30 derniers jours)
- Historique du cycle (6 derniers mois)

**Export**: JSON (simulé)

### 8. Calendrier Rendez-vous (/calendrier)

- Intégration calendrier mensuel
- Ajout/édition/suppression rendez-vous
- Catégories: médecin, dépistage, contraception, suivi grossesse
- Rappels (simulés)

---

## 🎭 Modes Spéciaux

### Mode Discret (discreteMode)

**Activation**:
- Toggle flottant (bouton avec icône Eye/EyeOff)
- Activation automatique si `privacyLevel: 'high' | 'very-high'`
- Activation automatique si `privacyConcern: true`

**Effets** (17 pages sensibles):
```typescript
const SENSITIVE_PAGES = [
  '/bibliotheque', '/chat', '/suivi', '/orientation', 
  '/orientation-sensible', '/journal', '/mon-contexte',
  '/communaute', '/stats-sante', '/calendrier', 
  '/medecins', '/carte', '/ressources', '/etape/*',
  '/parcours', '/edit-profile', '/feedback'
];
```

**Comportement**:
- `filter: blur(20px)` sur le contenu
- Masquage textes sensibles
- Icône 👁️ dans navbar devient rouge
- Message "Tap pour déverrouiller"

### Mode Oral (oralMode)

**Activation**:
- Toggle dans le menu hamburger ou profil
- Activation automatique si `audioPreference: 'always'`

**Effets**:
- Icône 🔊 sur tous les boutons interactifs
- Synthèse vocale au tap (Web Speech API)
- Lecture automatique des articles
- Navbar élargie (64px → 74px)
- Labels agrandis

**Implémentation** (OralHelper.tsx):
```typescript
const useOralSpeak = () => {
  const { oralMode, language } = useApp();
  
  const speak = (text: string) => {
    if (!oralMode || !window.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'wo' ? 'wo-SN' : 'fr-FR';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };
  
  return { speak };
};
```

---

## 🔄 Flux Utilisateur

### Première Ouverture

```
1. SPLASH SCREEN (3.5s)
   - Logo SaxalWér
   - Tagline: "Un espace discret pour comprendre ton corps"
   - Dots de chargement

2. WELCOME
   - Sélection langue (FR/Wolof)
   - Consentement données
   - Bouton "Commencer"

3. ONBOARDING - Étape 1: Âge
   - Question: "Quel est ton âge ?"
   - Options: 15-17, 18-24, 25-34, 35-49, 50+
   - Barre de progression: 1/3

4. ONBOARDING - Étape 2: Besoins
   - Question: "Qu'est-ce qui t'intéresse le plus ?"
   - Options multiples:
     * Comprendre mon cycle
     * Choisir une contraception
     * Préparer une grossesse
     * En savoir plus sur la ménopause
     * Parler de sujets intimes
     * Trouver de l'aide près de moi
   - Barre: 2/3

5. ONBOARDING - Étape 3: Personnalisation
   - 8 questions sur le contexte
   - Adaptation de l'expérience
   - Option "Passer" disponible
   - Barre: 3/3

6. DASHBOARD
   - Accueil personnalisé
   - Accès rapide configurable
   - Suggestions basées sur le profil
```

### Navigation Quotidienne

```
NAVBAR (Bottom - 5 onglets)
├── Accueil (/)
├── Explorer (/bibliotheque)
├── Assistant (/chat)
├── Localiser (/carte)
└── Profil (/parcours)

HAMBURGER MENU (Top-right)
├── Pages principales
├── Paramètres
├── Mode Discret Toggle
├── Mode Oral Toggle
├── Langue Toggle
└── Déconnexion
```

---

## 🔌 Intégration Backend (Supabase)

### Configuration

**⚠️ État actuel**: Connecté mais non implémenté dans le code.

**Connexion faite via**: `supabase_connect` tool dans Figma Make.

### Schema Proposé (à implémenter)

```sql
-- Users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  name TEXT,
  photo_url TEXT,
  birthdate DATE,
  location TEXT,
  personality TEXT,
  marital_status TEXT,
  children_count INT,
  desire_children TEXT,
  contraception_active BOOLEAN,
  contraception_method TEXT,
  health_conditions TEXT[],
  religious_faith TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cycle Tracking
CREATE TABLE cycle_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood TEXT,
  flow INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_log_id UUID REFERENCES cycle_logs(id) ON DELETE CASCADE,
  symptom_id TEXT NOT NULL,
  intensity INT CHECK (intensity BETWEEN 1 AND 3),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Journal
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  mood TEXT,
  content TEXT,
  tags TEXT[],
  photos TEXT[],  -- Base64 ou URLs Supabase Storage
  created_at TIMESTAMP DEFAULT NOW()
);

-- Community (Messages anonymes)
CREATE TABLE community_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL,  -- 'cycles', 'contraception', etc.
  user_pseudo TEXT NOT NULL,  -- Anonyme généré
  content TEXT NOT NULL,
  reactions JSONB DEFAULT '{}',  -- { "heart": 5, "pray": 2 }
  created_at TIMESTAMP DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Feedback
CREATE TABLE feedback_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  photos TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Fonctions à Implémenter

```typescript
// Auth
- signUp(email, password)
- signIn(email, password)
- signOut()
- resetPassword(email)

// Profile
- getProfile(userId)
- updateProfile(userId, data)
- uploadProfilePhoto(file)

// Cycle
- saveCycleLog(userId, date, data)
- getCycleLogs(userId, startDate, endDate)
- saveSymptomLog(cycleLogId, symptom, intensity)

// Journal
- saveJournalEntry(userId, entry)
- getJournalEntries(userId, limit)
- deleteJournalEntry(id)

// Community
- getCommunityMessages(roomId, limit)
- postCommunityMessage(roomId, pseudo, content)
- reactToMessage(messageId, reactionType)

// Appointments
- getAppointments(userId, month)
- saveAppointment(userId, appointment)
- deleteAppointment(id)

// Feedback
- submitFeedback(userId, feedback)
```

---

## 📝 Conventions de Code

### Imports React

**✅ Standard uniforme**:
```typescript
import React from 'react';
import { useNavigate } from 'react-router';
```

**❌ À éviter**:
```typescript
import * as React from "react";  // Non cohérent
import { useEffect } from 'react';  // Préférer React.useEffect
```

### Hooks

**✅ Toujours au top du composant**:
```typescript
export function MyComponent() {
  const { language, oralMode } = useApp();
  const navigate = useNavigate();
  const [state, setState] = React.useState(initialState);
  
  React.useEffect(() => {
    // Effect
  }, [deps]);
  
  // Render
}
```

**❌ useApp() en dehors de AppProvider**:
```typescript
// Lève maintenant une erreur explicite:
// "useApp must be used within an AppProvider"
```

### Routing

**✅ Utiliser react-router (v7)**:
```typescript
import { useNavigate, useLocation, useParams } from 'react-router';
```

**❌ react-router-dom non supporté**:
```typescript
import { ... } from 'react-router-dom';  // ❌ Ne pas utiliser
```

### Langues (Bilingue FR/Wolof)

```typescript
const { language } = useApp();
const wo = language === 'wo';

// Ternaire simple
<h1>{wo ? 'Nanga def' : 'Bienvenue'}</h1>

// Ou objet de traduction
const t = {
  fr: { title: 'Mon profil' },
  wo: { title: 'Sama profil' }
};
<h1>{t[language].title}</h1>
```

### Styling

**✅ Tailwind inline pour les overrides**:
```tsx
<div className="flex items-center gap-4 p-6">
```

**✅ Inline styles pour les valeurs dynamiques**:
```tsx
<div style={{ 
  background: discreteMode ? BASE.deepGreen : 'white',
  filter: discreteMode ? 'blur(20px)' : 'none'
}}>
```

**❌ Ne pas créer tailwind.config.js** (on utilise Tailwind v4)

### Fonts

**✅ Importer dans /src/styles/fonts.css uniquement**:
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
```

**❌ Ne jamais importer de fonts dans d'autres CSS**

---

## 📄 Pages & Composants

### Pages Clés

| Route | Composant | Description | Mode Discret |
|-------|-----------|-------------|--------------|
| `/` | Dashboard.tsx | Accueil principal avec 9 tuiles d'accès rapide | ❌ |
| `/splash` | SplashScreen.tsx | Splash 3.5s (logo + tagline) | ❌ |
| `/welcome` | WelcomeImproved.tsx | Langue + consentement | ❌ |
| `/onboarding` | OnboardingPage.tsx | 3 étapes (âge/besoins/contexte) | ❌ |
| `/bibliotheque` | Library.tsx | 700+ articles avec filtres | ✅ |
| `/bibliotheque/:id` | ArticleDetail.tsx | Article complet + audio | ✅ |
| `/chat` | Chat.tsx | Assistant SaxalWér (4 flows) | ✅ |
| `/suivi` | Tracker.tsx | Suivi cycle + logs quotidiens | ✅ |
| `/carte` | MapPage.tsx | 150 centres de santé | ✅ |
| `/carte/:id` | CenterDetail.tsx | Détail centre (horaires, avis) | ✅ |
| `/parcours` | ProfilePage.tsx | Profil "SamaWér" | ✅ |
| `/edit-profile` | EditProfile.tsx | Édition profil complet | ✅ |
| `/auth` | AuthPage.tsx | Création compte / Invité | ❌ |
| `/journal` | Journal.tsx | Journal intime avec photos | ✅ |
| `/medecins` | Doctors.tsx | Annuaire médecins spécialisés | ✅ |
| `/orientation` | Orientation.tsx | Triage santé général | ✅ |
| `/orientation-sensible` | OrientationSensible.tsx | Triage violences/abus | ✅ |
| `/mon-contexte` | ContextPage.tsx | Vue complète personnalisation | ✅ |
| `/communaute` | CommunityPage.tsx | 6 salons discussion | ✅ |
| `/communaute/:roomId` | CommunityPage.tsx | Salon spécifique | ✅ |
| `/stats-sante` | HealthStats.tsx | Graphiques Recharts | ✅ |
| `/calendrier` | CalendarPage.tsx | Rendez-vous médicaux | ✅ |
| `/notifications` | NotificationCenter.tsx | Centre notifications | ❌ |
| `/glossaire` | Glossaire.tsx | Dictionnaire termes médicaux | ❌ |
| `/ressources` | Ressources.tsx | Ressources par étape de vie | ✅ |
| `/etape/:stage` | LifeStageDetail.tsx | Détail étape (puberté, etc.) | ✅ |
| `/ressources-de-faith` | FaithResources.tsx | Par confession religieuse | ❌ |
| `/faq` | FAQ.tsx | Questions fréquentes | ❌ |
| `/feedback` | Feedback.tsx | Formulaire feedback | ✅ |
| `/a-propos` | About.tsx | À propos de l'app | ❌ |
| `/tutoriel` | Tutorial.tsx | Guide de l'app | ❌ |
| `/urgence` | EmergencyPage.tsx | Numéros d'urgence | ❌ |
| `/dev` | DevNavigation.tsx | Navigation développeur | ❌ |

### Composants Réutilisables

#### UI (shadcn-style)
- `button.tsx`, `input.tsx`, `label.tsx`
- `dialog.tsx`, `sheet.tsx`, `drawer.tsx`
- `card.tsx`, `badge.tsx`, `avatar.tsx`
- `accordion.tsx`, `tabs.tsx`, `tooltip.tsx`
- `calendar.tsx`, `chart.tsx`, `carousel.tsx`
- `dropdown-menu.tsx`, `context-menu.tsx`, `select.tsx`
- Et 20+ autres composants UI

#### Logique Métier
- **HamburgerMenu.tsx**: Menu latéral avec navigation + settings
- **ContextualPersonalization.tsx**: 8 questions personnalisation onboarding
- **GlossaryText.tsx**: Composant pour afficher termes avec définitions (tooltip)
- **OralHelper.tsx**: Hook `useOralSpeak()` pour synthèse vocale
- **SymptomLogger.tsx**: Logger symptômes avec intensité 1-3
- **AccountChoice.tsx**: Écran création compte vs invité

---

## 🛠️ Utils & Helpers

### conversationFlows.ts

**4 flows conversationnels** pour l'assistant Chat:

```typescript
// 1. CYCLE_TRACKING
// Questions type: "Quand ont commencé tes dernières règles ?"
// Réponse: Explication cycle, calcul ovulation, conseils

// 2. CONTRACEPTION_ADVICE
// Questions type: "Quelle méthode de contraception me conviendrait ?"
// Réponse: Comparaison méthodes, avantages/inconvénients

// 3. SYMPTOMS_INQUIRY
// Questions type: "J'ai des douleurs pendant mes règles"
// Réponse: Analyse symptômes, conseils, orientation si nécessaire

// 4. GENERAL_HEALTH
// Questions type: "Comment prendre soin de ma santé reproductive ?"
// Réponse: Conseils généraux, ressources
```

**Détection de flow**:
```typescript
export function detectFlow(message: string): FlowType {
  const lowered = message.toLowerCase();
  
  if (lowered.match(/cycle|règles|menstruation|ovulation/)) {
    return 'CYCLE_TRACKING';
  }
  
  if (lowered.match(/contraception|pilule|stérilet|préservatif/)) {
    return 'CONTRACEPTION_ADVICE';
  }
  
  if (lowered.match(/douleur|symptôme|mal|souffre|inquiète/)) {
    return 'SYMPTOMS_INQUIRY';
  }
  
  return 'GENERAL_HEALTH';
}
```

### splashUtils.ts

```typescript
// Gestion du splash screen unique
export function shouldShowSplash(): boolean {
  const hasShown = localStorage.getItem('splash_shown');
  return !hasShown;
}

export function markSplashAsShown(): void {
  localStorage.setItem('splash_shown', 'true');
}

export function getPostSplashRoute(): string {
  const hasSeenWelcome = localStorage.getItem('samawer_state')
    ?.includes('"hasSeenWelcome":true');
  
  return hasSeenWelcome ? '/onboarding' : '/welcome';
}
```

### personalizationMapper.ts

```typescript
// Mappe PersonalizationContext vers UserProfile
export function mapPersonalizationToProfile(
  context: PersonalizationContext,
  currentProfile: UserProfile
): Partial<UserProfile> {
  const updates: Partial<UserProfile> = {};
  
  // Exemple: ageRange → birthdate estimation
  if (context.ageRange && !currentProfile.birthdate) {
    updates.birthdate = estimateBirthdate(context.ageRange);
  }
  
  // livingContext → maritalStatus inference
  if (context.livingContext === 'partner' && !currentProfile.maritalStatus) {
    updates.maritalStatus = 'En couple';
  }
  
  return updates;
}
```

---

## 🚀 Déploiement & Développement

### Commandes

```bash
# Installation
pnpm install

# Développement
pnpm dev

# Build production
pnpm build
```

### Variables d'Environnement (à créer)

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional: Analytics
VITE_ANALYTICS_ID=your_analytics_id
```

### Compatibilité

- **Browsers**: Chrome, Firefox, Safari (dernières versions)
- **Mobile**: Responsive design, PWA-ready
- **Offline**: localStorage pour persistence basique
- **A11y**: ARIA labels, keyboard navigation

---

## 🎯 Prochaines Étapes (Roadmap)

### Phase 1: Backend (En cours)
- [ ] Implémenter Supabase Auth
- [ ] Synchroniser state avec Supabase
- [ ] Upload photos profil (Supabase Storage)
- [ ] Real-time pour communauté

### Phase 2: Fonctionnalités
- [ ] Notifications push (Service Worker)
- [ ] Export PDF des statistiques
- [ ] Partage d'articles (link sharing)
- [ ] Traduction Wolof complète (actuellement partielle)

### Phase 3: Avancé
- [ ] IA pour prédiction de cycle (ML)
- [ ] Chatbot avec NLP (amélioration flows)
- [ ] Téléconsultation intégrée
- [ ] Géolocalisation réelle (Google Maps API)

---

## 📞 Support & Contact

**Développé pour**: Les femmes du Sénégal  
**Langue principale**: Français / Wolof  
**Licence**: [À définir]

---

## 🔐 Sécurité & Confidentialité

### Principes
1. **Privacy by Design**: Mode discret natif
2. **Anonymat**: Communauté sans identité réelle
3. **Local-first**: Données stockées localement par défaut
4. **Chiffrement**: Supabase RLS (Row Level Security)
5. **Aucune tracking tiers**: Pas de Google Analytics, Facebook Pixel, etc.

### Données Sensibles

**Stockées localement**:
- Logs de cycle et symptômes
- Entrées de journal
- Historique orientation sensible

**Stockées sur Supabase (avec RLS)**:
- Profil utilisateur (optionnel)
- Messages communauté (anonymisés)
- Rendez-vous médicaux

**Jamais collectées**:
- Localisation précise
- Contacts
- Photos hors contexte médical

---

## 📚 Glossaire Technique

| Terme | Définition |
|-------|------------|
| **AppContext** | Context React central avec tout le state de l'app |
| **discreteMode** | Mode de floutage du contenu pour la confidentialité |
| **oralMode** | Mode de lecture vocale automatique |
| **PersonalizationContext** | 8 dimensions de personnalisation de l'UX |
| **QuickAccessId** | ID des tuiles d'accès rapide du Dashboard |
| **CycleData** | Structure de données pour le suivi de cycle |
| **OrientationSession** | Session de triage santé (général ou sensible) |
| **NotifCategory** | 6 catégories de notifications intelligentes |
| **LifeSituation** | Situation de vie reproductive (cycles, grossesse, etc.) |
| **GoalId** | Objectif de santé (cycle, grossesse, ménopause, bien-être) |

---

## ✨ Philosophie du Projet

**SaxalWér** n'est pas qu'une app de santé reproductive. C'est:

1. **Un espace sûr** où les femmes peuvent explorer leur corps sans jugement
2. **Un outil culturellement adapté** qui parle leur langue (FR/Wolof) et utilise leurs métaphores
3. **Un compagnon discret** qui respecte leur contexte social et familial
4. **Une source de savoir** qui éduque sans infantiliser (tutoiement, ton sororité)
5. **Une communauté** où elles peuvent partager anonymement et se soutenir

### Valeurs Clés
- 🌍 **Culturellement ancré**: Métaphores africaines, langues locales
- 🔒 **Confidentialité absolue**: Mode discret, anonymat, local-first
- 💜 **Empowerment**: Information = pouvoir de décision
- 🤝 **Sororité**: Communauté, partage, entraide
- ♿ **Accessibilité**: Mode oral, design simple, gratuit

---

**Version du document**: 1.0  
**Dernière mise à jour**: Mars 2026  
**Maintenu par**: [Ton nom/équipe]

---

*Ce document est un guide vivant. Il évolue avec le projet. Contribue en proposant des améliorations !*
