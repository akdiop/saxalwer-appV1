# 🗺️ GUIDE DE NAVIGATION - SAXALWÉR

## 📱 Structure de Navigation

### 🏠 Navigation Principale (Bottom Bar)

La barre de navigation inférieure (visible sur toutes les pages sauf onboarding/welcome) contient 5 icônes :

| Icône | Destination | Description FR | Description Wolof |
|-------|------------|----------------|-------------------|
| 🏠 Home | `/` | Tableau de bord | Dashboard |
| 📚 Book | `/bibliotheque` | Bibliothèque | Jàngale yi |
| 💬 Chat | `/chat` | Assistant IA Ndeye | Jàppale IA |
| 📍 Map | `/carte` | Centres de santé | Ndimbal ci gox |
| 👤 User | `/parcours` | Profil SamaWér | Sa bërëbu kàràngë |

---

## 🎯 Accès Rapides (Dashboard)

Le Dashboard propose un système d'accès rapide **personnalisable** (max 8, min 2) :

### Options Disponibles (13 au total)

1. **📚 Bibliothèque** → `/bibliotheque`
2. **📊 Suivi Cycle** → `/suivi`
3. **📍 Aide locale** → `/carte`
4. **🧭 Orientation** → `/orientation`
5. **🛡️ Orient. sensible** → `/orientation-sensible`
6. **✨ Conseils IA** → `/chat`
7. **🩺 Médecins** → `/medecins`
8. **📓 Journal intime** → `/journal`
9. **❓ FAQ** → `/faq`
10. **📄 Glossaire** → `/glossaire`
11. **⚠️ Urgence** → `/urgence`
12. **📊 Statistiques** → `/stats-sante` 🆕
13. **📅 Calendrier** → `/calendrier` 🆕

**Comment personnaliser** : Cliquer sur le bouton "⚙️ Personnaliser" en haut de la grille d'accès rapide.

---

## 🔐 Pages Protégées (Mode Discret)

Quand le **mode discret** est activé, ces pages appliquent un flou (`blur(10px)`) :

### Pages Sensibles (17)
1. Dashboard (`/`)
2. Bibliothèque (`/bibliotheque`)
3. Détail Article (`/bibliotheque/:id`)
4. Chat (`/chat`)
5. Suivi Cycle (`/suivi`)
6. Journal (`/journal`)
7. Orientation (`/orientation`)
8. Orientation Sensible (`/orientation-sensible`)
9. Profil (`/parcours`)
10. Communauté (`/communaute`)
11. Chat Communauté (`/communaute/:roomId`)
12. Mon Contexte (`/mon-contexte`)
13. Modifier Profil (`/edit-profile`)
14. Centre de Notifications (`/notifications`)
15. Médecins (`/medecins`)
16. Détails Étapes de Vie (`/etape/:stage`)
17. **Statistiques** (`/stats-sante`) 🆕
18. **Calendrier** (`/calendrier`) 🆕

### Activation
- Bouton flottant en bas à droite (icône 🛡️ Shield)
- Menu hamburger → "Mode Discret"
- Profil → Toggle "Mode Discret"

---

## 🆕 Nouvelles Fonctionnalités

### 1. 📊 Page Statistiques de Santé (`/stats-sante`)

**Accès** :
- Dashboard → Accès rapide "Statistiques"
- Profil → Carte "Statistiques" (grille du haut)
- URL directe : `/stats-sante`

**Contenu** :
- Vue d'ensemble cycle actuel (jour, phase)
- Graphique flux menstruel (30 jours)
- Répartition humeur (graphique circulaire)
- Top 5 symptômes fréquents
- Observance contraception (si active)
- Résumé profil santé

**Données utilisées** :
- `cycleData` (tracker)
- `journalEntries` (journal)
- `userProfile` (profil)

---

### 2. 📅 Page Calendrier (`/calendrier`)

**Accès** :
- Dashboard → Accès rapide "Calendrier"
- Profil → Carte "Calendrier" (grille du haut)
- URL directe : `/calendrier`

**Fonctionnalités** :
- Vue calendrier mensuel
- Navigation mois précédent/suivant
- Sélection de date
- Ajout de rendez-vous :
  - 🩺 Médical
  - 💊 Contraception
  - 🩸 Cycle
  - 📌 Autre
- Détails personnalisables :
  - Heure
  - Médecin/Praticien
  - Lieu
  - Notes
  - Rappel activable
- Suppression de rendez-vous
- Indicateurs visuels :
  - 🔴 Période de règles
  - 🟡 Période d'ovulation
  - 🔵 Rendez-vous planifiés

**Stockage** :
- LocalStorage (`saxalwer_appointments`)
- Persistant entre sessions

---

## 🎨 Navigation par Profil (SamaWér)

### Grille Supérieure (2x2)

| Carte | Destination | Données Affichées |
|-------|------------|-------------------|
| 📊 Étape de vie | `/edit-profile` | Âge sélectionné |
| 💾 Favoris | Toggle inline | Nombre d'articles favoris |

### Grille Profil Santé (2x2)

| Carte | Destination | Données Affichées |
|-------|------------|-------------------|
| ❤️ Profil santé | `/edit-profile` | Conditions + contraception |
| 🛡️ Mon contexte | `/mon-contexte` | État orientation sensible |

### 🆕 Grille Statistiques & Calendrier (2x2)

| Carte | Destination | Description |
|-------|------------|-------------|
| 📊 Statistiques | `/stats-sante` | Vue santé détaillée |
| 📅 Calendrier | `/calendrier` | Gestion rendez-vous |

### Autres Sections
- 🛡️ Mode Discret (toggle)
- ⭐ Favoris (accordéon)
- 🔔 Notifications (accordéon)
- 🔔 Préférences notifications (modal)
- 🧭 Orientation & Santé
- 🆘 Aide & Support (FAQ, Glossaire, Feedback)

---

## 🌐 Navigation par Thème

### Santé Reproductive
```
Dashboard
  └─ Suivi Cycle (/suivi)
  └─ Journal (/journal)
  └─ Statistiques (/stats-sante) 🆕
  └─ Calendrier (/calendrier) 🆕
  └─ Orientation Sensible (/orientation-sensible)
```

### Éducation
```
Dashboard
  └─ Bibliothèque (/bibliotheque)
      └─ Détail Article (/bibliotheque/:id)
  └─ Glossaire (/glossaire)
  └─ FAQ (/faq)
  └─ Ressources (/ressources)
  └─ Ressources de Foi (/ressources-de-faith)
```

### Support & Orientation
```
Dashboard
  └─ Chat IA (/chat)
  └─ Carte Centres (/carte)
      └─ Détail Centre (/carte/:id)
  └─ Médecins (/medecins)
  └─ Urgence (/urgence)
  └─ Orientation (/orientation)
```

### Communauté
```
Dashboard
  └─ Communauté (/communaute)
      └─ Salon thématique (/communaute/:roomId)
          - endometriose
          - contraception
          - maternite
          - menopause
          - sante-sexuelle
          - soutien
```

### Profil & Paramètres
```
Profil (/parcours)
  └─ Modifier Profil (/edit-profile)
  └─ Mon Contexte (/mon-contexte)
  └─ Notifications (/notifications)
  └─ Statistiques (/stats-sante) 🆕
  └─ Calendrier (/calendrier) 🆕
```

---

## 🔄 Flux d'Onboarding

```
1. Welcome (/welcome)
    ↓
2. Onboarding (/onboarding)
    ↓ Étapes :
    - Consentement
    - Âge
    - Besoins
    - Objectif
    - Situation de vie
    - Préoccupations vie privée
    ↓
3. Dashboard (/)
```

---

## 🎯 Raccourcis Clavier (Future)

| Touche | Action | Destination |
|--------|--------|-------------|
| `H` | Home | `/` |
| `B` | Bibliothèque | `/bibliotheque` |
| `C` | Chat | `/chat` |
| `M` | Map | `/carte` |
| `P` | Profil | `/parcours` |
| `S` | Statistiques | `/stats-sante` 🆕 |
| `K` | Calendrier | `/calendrier` 🆕 |
| `D` | Mode Discret | Toggle |

---

## 📊 Hiérarchie Visuelle

```
┌─────────────────────────────────┐
│         HEADER / LOGO            │
├─────────────────────────────────┤
│                                  │
│         MAIN CONTENT             │
│                                  │
│  - Dashboard                     │
│  - Bibliothèque                  │
│  - Chat                          │
│  - Carte                         │
│  - Suivi                         │
│  - Profil                        │
│  - Statistiques 🆕               │
│  - Calendrier 🆕                 │
│  - ... autres pages              │
│                                  │
├─────────────────────────────────┤
│     BOTTOM NAVIGATION BAR        │
│  [Home] [Biblio] [Chat] [Map] [User]
└─────────────────────────────────┘
      [Mode Discret FAB]
```

---

## 🚀 Performance & Optimisation

### Pages Lourdes
- **Bibliothèque** : ~150 articles → Pagination/Filtres
- **Statistiques** : Recharts (~60KB) → Lazy loading
- **Calendrier** : LocalStorage → Limite 1000 rendez-vous

### Pages Légères
- Dashboard : ~40KB
- Profil : ~35KB
- FAQ : ~25KB

### Optimisations
- React Router lazy loading
- Images via `figma:asset` (optimisées)
- LocalStorage pour cache
- Motion animations GPU-accelerated

---

## 🌍 Multilingue

Toutes les pages supportent FR/Wolof :
- Textes traduits
- Dates localisées
- Navigation adaptée

**Toggle langue** :
- Menu hamburger → Changer de langue
- Profil → Settings → Changer de langue

---

## 📱 Responsive Design

### Mobile First (320px - 768px)
- Navigation bottom bar
- Grilles 2x2 ou 1 colonne
- Formulaires verticaux
- Calendrier tactile

### Tablet (768px - 1024px)
- Grilles 3x2
- Sidebar optionnelle
- Calendrier élargi

### Desktop (1024px+)
- Grilles 4x3
- Navigation sidebar
- Multi-colonnes
- Graphiques agrandis

### **1. Ajout du bouton retour dans ContextualPersonalization**

**Fichier :** `/src/app/components/ContextualPersonalization.tsx`

#### **Modifications :**

**A. Interface Props étendue**
```tsx
interface Props {
  onComplete: (context: PersonalizationContext) => void;
  onSkip: () => void;
  onBack?: () => void;  // ✅ NOUVEAU
}
```

**B. Import ChevronLeft**
```tsx
import { ChevronLeft } from 'lucide-react';
```

**C. Fonction handleBack ajoutée**
```tsx
const handleBack = () => {
  const prevIndex = currentStepIndex - 1;
  if (prevIndex >= 0) {
    // Navigation interne : revenir à l'étape précédente de la personnalisation
    setCurrentStep(steps[prevIndex]);
  } else if (onBack) {
    // Navigation externe : revenir à l'étape Goals de l'onboarding
    onBack();
  }
};
```

**D. Logique canGoBack**
```tsx
const canGoBack = currentStepIndex > 0 || onBack;
```

**E. Bouton retour ajouté**
```tsx
{canGoBack && (
  <motion.button
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    whileTap={{ scale: 0.9 }}
    onClick={handleBack}
    style={{
      position: 'fixed',
      top: 20,
      left: 16,
      zIndex: 1001,  // Au-dessus de la progress bar (1000)
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'white',
      border: `1px solid ${COLORS.cocoa}15`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}
  >
    <ChevronLeft size={20} color={COLORS.deepGreen} />
  </motion.button>
)}
```

---

### **2. Connexion avec OnboardingPage**

**Fichier :** `/src/app/pages/OnboardingPage.tsx`

#### **Modifications :**

**A. Callback onBack passé au composant**
```tsx
{step === 'personalization' && (
  <ContextualPersonalization
    onComplete={context => { setPersonalization(context); handleFinish(); }}
    onSkip={handleFinish}
    onBack={goBack}  // ✅ NOUVEAU
  />
)}
```

**B. Masquage du bouton retour global**
```tsx
{canGoBack && step !== 'personalization' && (
  <motion.button onClick={goBack}>
    {/* Bouton retour global de l'onboarding */}
  </motion.button>
)}
```

**Raison :** Éviter d'avoir deux boutons retour simultanés (global + interne)

```
┌─────────────────────────────────────────────┐
│  ONBOARDING                                 │
├─────────────────────────────────────────────┤
│  1. Privacy (CGU)                           │
│  2. Age                                     │
│  3. Needs (Besoins)                         │
│  4. Goals (Objectifs)                       │
│  5. Personalization ──────────┐             │
└───────────────────────────────│─────────────┘
                                │
                                │
        ┌───────────────────────┴─────────────┐
        │  PERSONNALISATION (9 étapes)        │
        ├─────────────────────────────────────┤
        │  [←] intro                          │
        │  [←] age      ← Navigation interne  │
        │  [←] living      (entre étapes)     │
        │  [←] privacy                        │
        │  [←] social                         │
        │  [←] education                      │
        │  [←] tone                           │
        │  [←] audio                          │
        │  [←] support                        │
        └─────────────────────────────────────┘
                ↑
                │
         Si [←] sur "intro"
         → Retour à "Goals"
```

### **Flux Utilisateur**

1. **À l'étape "intro" de Personnalisation** :
   - Clic [←] → Retour à "Goals" (étape précédente de l'onboarding)

2. **Aux étapes suivantes (age, living, etc.)** :
   - Clic [←] → Retour à l'étape précédente de la personnalisation
   - Exemple : Sur "living" → Retour à "age"

3. **Navigation fluide sans double bouton** :
   - Pendant la personnalisation : bouton interne uniquement
   - Autres étapes onboarding : bouton global uniquement

### **Scénarios testés**

✅ **Scénario 1 : Navigation interne**
- Sur étape "living" de personnalisation
- Clic [←]
- ✅ Retour à étape "age" de personnalisation

✅ **Scénario 2 : Navigation externe**
- Sur étape "intro" de personnalisation (première)
- Clic [←]
- ✅ Retour à étape "Goals" de l'onboarding

✅ **Scénario 3 : Pas de double bouton**
- Sur étape "personalization"
- ✅ Un seul bouton [←] visible (interne, pas global)

✅ **Scénario 4 : Skip personnalisation**
- Clic "Passer cette étape"
- ✅ Va directement au Dashboard

## 🎨 **DESIGN DU BOUTON RETOUR**

### **ContextualPersonalization (interne)**
```tsx
{
  position: 'fixed',
  top: 20,
  left: 16,
  zIndex: 1001,           // Au-dessus de tout
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: 'white',
  border: '1px solid rgba(74,47,39,0.15)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}
```

### **OnboardingPage (global)**
```tsx
{
  position: 'absolute',   // Relatif au container
  top: 20,
  left: 16,
  zIndex: 200,
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(181,98,42,0.15)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}
```

**Différences :**
- **Interne** : `position: fixed` (reste toujours visible)
- **Global** : `position: absolute` (scroll avec le contenu)
- **zIndex** : Interne (1001) > Global (200)

---
### **Expérience Utilisateur**
✅ **Navigation intuitive** : Retour fonctionne comme attendu  
✅ **Pas de frustration** : Peut revenir en arrière à tout moment  
✅ **Contrôle total** : Navigation bidirectionnelle complète  

### **Cohérence UI**
✅ **Bouton toujours visible** : Fixed position sur personnalisation  
✅ **Un seul bouton** : Pas de confusion avec double bouton  
✅ **Design uniforme** : Style cohérent avec onboarding  

### **Architecture**
✅ **Composant autonome** : ContextualPersonalization gère sa navigation  
✅ **Couplage faible** : Communication via callback `onBack`  
✅ **Réutilisable** : Peut être utilisé ailleurs sans onboarding  

La navigation dans l'onboarding et la personnalisation est maintenant **fluide et intuitive** :

1. ✅ **Bouton retour toujours disponible** pendant la personnalisation
2. ✅ **Navigation bidirectionnelle** : avant/après sur toutes les étapes
3. ✅ **Pas de redémarrage forcé** au CGU
4. ✅ **Expérience utilisateur cohérente** avec le reste de l'app
5. ✅ **Architecture propre** : composant autonome + callback

**L'utilisateur peut maintenant naviguer librement sans frustration ! 💚✨**

---

---

Date: 3 mars 2026
Version: 1.2
Statut: ✅ Complet avec nouvelles pages

## Intellectual Ownership

Project concept, architecture and scoring logic designed by Aïdalaye Diop.
Initial prototype version released on [03.03.2026].
