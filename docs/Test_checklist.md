# ✅ CHECKLIST DE TEST - SAXALWÉR

## 🎯 Tests de Base (Obligatoire)

### 1. Navigation Principale
- [ ] Dashboard (`/`) charge correctement
- [ ] Bibliothèque (`/bibliotheque`) affiche les articles
- [ ] Chat (`/chat`) affiche l'assistant IA
- [ ] Carte (`/carte`) affiche la carte et centres
- [ ] Profil (`/parcours`) affiche SamaWér

### 2. 🆕 Nouvelles Pages
- [ ] **Statistiques** (`/stats-sante`) :
  - [ ] Header avec titre "Mes Statistiques" / "Liggéeyam wér"
  - [ ] Graphique de flux menstruel s'affiche
  - [ ] Graphique d'humeur (si données disponibles)
  - [ ] Top symptômes (si données disponibles)
  - [ ] Observance contraception (si active)
  - [ ] Bouton retour fonctionne
  - [ ] Mode discret applique le flou
  
- [ ] **Calendrier** (`/calendrier`) :
  - [ ] Header avec titre "Mon Calendrier" / "Sama calendrier"
  - [ ] Calendrier mensuel s'affiche
  - [ ] Navigation mois précédent/suivant fonctionne
  - [ ] Sélection de date fonctionne
  - [ ] Modal "Ajouter rendez-vous" s'ouvre
  - [ ] Formulaire complet (type, titre, heure, médecin, lieu, notes, rappel)
  - [ ] Ajout de rendez-vous persiste
  - [ ] Suppression de rendez-vous fonctionne
  - [ ] Légende affichée
  - [ ] Indicateurs cycle (règles, ovulation) apparaissent
  - [ ] Bouton retour fonctionne
  - [ ] Mode discret applique le flou

### 3. Navigation vers Nouvelles Pages
- [ ] Dashboard → Accès rapide "Statistiques" → Page s'ouvre
- [ ] Dashboard → Accès rapide "Calendrier" → Page s'ouvre
- [ ] Profil → Carte "Statistiques" → Page s'ouvre
- [ ] Profil → Carte "Calendrier" → Page s'ouvre
- [ ] URL directe `/stats-sante` → Page s'ouvre
- [ ] URL directe `/calendrier` → Page s'ouvre

---

## 🎨 Tests Visuels

### Design Cohérent
- [ ] Palette de couleurs vintage africaine respectée
- [ ] Icônes Lucide affichées correctement
- [ ] Animations Motion fluides (scale, opacity)
- [ ] Ombres et dégradés harmonieux
- [ ] Typography cohérente (Cormorant Garamond pour titres)

### Responsive
- [ ] Mobile (320px) : grilles 1 colonne
- [ ] Tablet (768px) : grilles 2 colonnes
- [ ] Desktop (1024px+) : affichage optimal

---

## 🔒 Tests Mode Discret

### Activation
- [ ] Bouton flottant (Shield) active/désactive le mode
- [ ] Menu hamburger → Mode Discret fonctionne
- [ ] Profil → Toggle Mode Discret fonctionne

### Application du Flou
- [ ] Dashboard flouté quand mode actif
- [ ] Statistiques floutées quand mode actif
- [ ] Calendrier flouté quand mode actif
- [ ] Profil flouté quand mode actif
- [ ] Autres pages sensibles floutées

---

## 🌍 Tests Multilingue

### Français
- [ ] Statistiques : "Mes Statistiques", "Cycle Actuel", "Évolution sur 30 jours"
- [ ] Calendrier : "Mon Calendrier", "Nouveau rendez-vous", "Ajouter"

### Wolof
- [ ] Statistiques : "Liggéeyam wér", "Weer bi ngay fi", "Yéenekaay 30 fan"
- [ ] Calendrier : "Sama calendrier", "Yokk rendez-vous", "Yokk"

### Toggle Langue
- [ ] Menu hamburger → Changer de langue → Textes changent
- [ ] Profil → Settings → Changer de langue → Textes changent

---

## 📊 Tests Fonctionnels Avancés

### Page Statistiques

#### Données de Cycle
- [ ] Sans données : message "Aucune donnée" ou valeurs par défaut
- [ ] Avec données partielles : graphiques partiels affichés
- [ ] Avec données complètes : tous les graphiques remplis

#### Graphiques Recharts
- [ ] Graphique flux menstruel interactif (hover tooltip)
- [ ] Graphique humeur (pie chart) avec légende
- [ ] Barres symptômes animées
- [ ] Graphique observance pilule (si active)

#### Intégration Données
- [ ] cycleData.dailyLogs utilisé pour flux
- [ ] cycleData.dailyLogs utilisé pour humeur
- [ ] cycleData.dailyLogs utilisé pour symptômes
- [ ] cycleData.pillLogs utilisé pour observance
- [ ] userProfile.healthConditions affiché
- [ ] journalEntries.length affiché

### Page Calendrier

#### Vue Calendrier
- [ ] Mois actuel affiché par défaut
- [ ] Jours de la semaine affichés (Dim, Lun, Mar, etc.)
- [ ] Cases vides avant le 1er du mois
- [ ] Aujourd'hui surligné (border gold)
- [ ] Date sélectionnée surlignée (background terracotta)

#### Gestion Rendez-vous
- [ ] Formulaire validation : champs requis (titre, heure)
- [ ] Types de rendez-vous : 4 options (médical, contraception, cycle, autre)
- [ ] Icônes par type affichées correctement
- [ ] Couleurs par type appliquées
- [ ] Médecin optionnel
- [ ] Lieu optionnel
- [ ] Notes optionnelles
- [ ] Rappel toggle fonctionne

#### Persistance
- [ ] Rendez-vous sauvegardés dans localStorage
- [ ] Rendez-vous chargés au reload
- [ ] Suppression persiste
- [ ] Limite 1000 rendez-vous respectée

#### Indicateurs Cycle
- [ ] Règles (terracotta) apparaissent si cycleData.lastPeriodDate défini
- [ ] Ovulation (gold) apparaît aux bons jours (12-16)
- [ ] Règles prévues (expected) apparaissent

---

## 🚀 Tests Performance

### Chargement
- [ ] Dashboard < 2s
- [ ] Statistiques < 3s (recharts)
- [ ] Calendrier < 2s
- [ ] Navigation instantanée entre pages

### Animations
- [ ] Motion animations fluides (60fps)
- [ ] Pas de lag au scroll
- [ ] Hover effects réactifs

### Mémoire
- [ ] Pas de memory leak (vérifier DevTools)
- [ ] LocalStorage < 5MB
- [ ] Recharts unmount proprement

---

## 🔧 Tests Techniques

### React Router
- [ ] Routes définies dans App.tsx
- [ ] Navigation programmatique fonctionne (`navigate`)
- [ ] Bouton retour (`navigate(-1)`) fonctionne
- [ ] Redirections onboarding fonctionnent

### Context API
- [ ] useApp() retourne les bonnes données
- [ ] cycleData accessible
- [ ] userProfile accessible
- [ ] discreteMode toggle fonctionne
- [ ] language toggle fonctionne

### LocalStorage
- [ ] saxalwer_appointments créé au premier rendez-vous
- [ ] JSON parsing/stringifying sans erreur
- [ ] Données corrompues gérées (try/catch)

### TypeScript
- [ ] Aucune erreur de type
- [ ] QuickAccessId étendu correctement
- [ ] Props typées correctement

---

## 🐛 Tests Cas Limites

### Données Manquantes
- [ ] cycleData vide → graphiques vides élégamment
- [ ] userProfile.healthConditions undefined → "Aucune condition"
- [ ] journalEntries vide → "0 entrées"

### Dates Extrêmes
- [ ] Calendrier : mois de février (28/29 jours)
- [ ] Calendrier : navigation années multiples
- [ ] Statistiques : 0 jours de données
- [ ] Statistiques : 365+ jours de données

### Limites
- [ ] Calendrier : 1000 rendez-vous max
- [ ] Statistiques : 30 jours max affichés
- [ ] Accès rapides : 8 max, 2 min

### Erreurs
- [ ] LocalStorage plein → message d'erreur
- [ ] Recharts erreur render → fallback
- [ ] Date invalide → message utilisateur

---

## 📱 Tests Mobile Spécifiques

### Touch Events
- [ ] Tap sur carte calendrier sélectionne date
- [ ] Swipe mois précédent/suivant (optionnel)
- [ ] Modal formulaire scroll vertical
- [ ] Graphiques tactiles (tooltip au tap)

### Clavier
- [ ] Input heure affiche clavier natif
- [ ] Input texte avec autocomplete
- [ ] Submit au clavier "Enter"

---

## ✅ Tests d'Accessibilité

### Navigation Clavier
- [ ] Tab entre éléments
- [ ] Enter pour submit
- [ ] Escape pour fermer modals

### Contraste
- [ ] Textes lisibles sur fonds colorés
- [ ] Boutons visibles

### Screen Readers
- [ ] Labels présents
- [ ] Alt text sur images (si ajoutées)

---

## 🎉 Tests d'Intégration

### Workflow Complet Statistiques
1. [ ] Ouvrir Dashboard
2. [ ] Aller dans Tracker (`/suivi`)
3. [ ] Ajouter des logs quotidiens (flux, humeur, symptômes)
4. [ ] Retourner Dashboard
5. [ ] Cliquer "Statistiques"
6. [ ] Vérifier que graphiques affichent les données ajoutées
7. [ ] Changer de langue → vérifier traduction
8. [ ] Activer mode discret → vérifier flou
9. [ ] Désactiver mode discret → vérifier netteté

### Workflow Complet Calendrier
1. [ ] Ouvrir Dashboard
2. [ ] Cliquer "Calendrier"
3. [ ] Sélectionner une date future
4. [ ] Cliquer "+ Ajouter"
5. [ ] Remplir formulaire (médical, Dr Diallo, 14h30, Centre de Plateau)
6. [ ] Activer rappel
7. [ ] Cliquer "Ajouter"
8. [ ] Vérifier que rendez-vous apparaît sur calendrier
9. [ ] Reload page → vérifier persistance
10. [ ] Supprimer rendez-vous
11. [ ] Vérifier disparition

---

## 🔍 Checklist Finale

### Code Quality
- [ ] Aucune erreur console
- [ ] Aucun warning React
- [ ] Code formatté
- [ ] Imports organisés

### Performance
- [ ] Lighthouse score > 80
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 4s

### UX
- [ ] Navigation intuitive
- [ ] Feedback visuel sur actions
- [ ] Messages d'erreur clairs
- [ ] États de chargement (si async ajouté)

---

## 📊 Résumé des Tests

### Tests Critiques (Bloquants)
- ✅ Navigation fonctionne
- ✅ Nouvelles pages chargent
- ✅ Mode discret appliqué
- ✅ Traductions présentes

### Tests Importants (Prioritaires)
- ✅ Graphiques s'affichent
- ✅ Calendrier interactif
- ✅ Rendez-vous persistent
- ✅ Responsive mobile

### Tests Optionnels (Nice-to-have)
- ⚪ Animations parfaites
- ⚪ Edge cases gérés
- ⚪ Performance optimale

---

Date: 3 mars 2026
Testeur: ______________
Statut: [ ] En cours [ ] Terminé [ ] Validé
