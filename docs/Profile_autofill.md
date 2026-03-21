# 🔗 LIAISON PERSONNALISATION → PROFIL

**Date** : 4 mars 2026  
**Feature** : Auto-remplissage intelligent du profil utilisateur  
**Statut** : ✅ Opérationnel

---

## 🎯 OBJECTIF

Préremplir automatiquement les champs du profil utilisateur basés sur les réponses données lors de la personnalisation contextuelle, pour éviter de redemander des informations déjà collectées.

---

## 📂 ARCHITECTURE

### Fichiers Créés/Modifiés

1. **`/src/app/utils/personalizationMapper.ts`** ✅ NOUVEAU
   - Fonctions de mapping intelligent
   - Logique d'inférence de données

2. **`/src/app/context/AppContext.tsx`** ✅ MODIFIÉ
   - Import `mapPersonalizationToProfile`
   - Fonction `setPersonalization` mise à jour
   - Application automatique du mapping

3. **`/src/app/pages/EditProfile.tsx`** ✅ MODIFIÉ
   - Import `getPersonalizationSummary`
   - Affichage infos pré-remplies (future enhancement)

---

## 🗺️ MAPPING AUTOMATIQUE

### 1. AGE RANGE → BIRTHDATE

**Logique** : Estimation de l'année de naissance basée sur la tranche d'âge

```typescript
ageRange → estimatedBirthYear

'13-17' → currentYear - 15  // Milieu de la tranche
'18-24' → currentYear - 21
'25-34' → currentYear - 29
'35-45' → currentYear - 40
'46+'   → currentYear - 50
```

**Exemple** :
```
Input:  ageRange: '25-34'
Output: birthdate: '1997-01-01' (si 2026)
```

**Condition** : Ne s'applique que si `birthdate` est vide

---

### 2. LIVING CONTEXT → MARITAL STATUS

**Logique** : Inférence statut marital selon le contexte de vie

```typescript
livingContext → maritalStatus

'partner'   → 'En couple'
'alone'     → 'Célibataire'
'parents'   → 'Célibataire'
'family'    → 'En famille'
'roommates' → 'Célibataire'
```

**Exemple** :
```
Input:  livingContext: 'partner'
Output: maritalStatus: 'En couple'
```

**Condition** : Ne s'applique que si `maritalStatus` est vide

---

### 3. SOCIAL NORMS → RELIGIOUS FAITH

**Logique** : Suggestion confession religieuse selon normes sociales

```typescript
socialNorms → religiousFaith

'conservative' → 'Pratiquante'
'moderate'     → 'Modérée'
'open'         → 'Ouverte'
```

**Exemple** :
```
Input:  socialNorms: 'conservative'
Output: religiousFaith: 'Pratiquante'
```

**Condition** : Ne s'applique que si `religiousFaith` est vide

---

### 4. EDUCATION LEVEL → PERSONALITY

**Logique** : Suggestion personnalité selon niveau éducation

```typescript
educationLevel → personality

'basic'        → 'Curieuse et attentive'
'intermediate' → 'Engagée et réfléchie'
'advanced'     → 'Analytique et informée'
```

**Exemple** :
```
Input:  educationLevel: 'advanced'
Output: personality: 'Analytique et informée'
```

**Condition** : Ne s'applique que si `personality` est vide

---

### 5. PREFERRED TONE → PERSONALITY

**Logique** : Suggestion personnalité selon ton préféré (priorité sur educationLevel)

```typescript
preferredTone → personality

'sisterly'  → 'Complice et chaleureuse'
'friendly'  → 'Ouverte et bienveillante'
'formal'    → 'Professionnelle et sérieuse'
```

**Exemple** :
```
Input:  preferredTone: 'sisterly'
Output: personality: 'Complice et chaleureuse'
```

**Condition** : Ne s'applique que si `personality` est vide

---

### 6. AGE RANGE + LIVING CONTEXT → CHILDREN COUNT

**Logique** : Estimation nombre d'enfants selon âge et contexte

```typescript
if (ageRange === '13-17' || ageRange === '18-24' || livingContext === 'parents') {
  childrenCount = 0
}
```

**Exemple** :
```
Input:  ageRange: '18-24', livingContext: 'parents'
Output: childrenCount: 0
```

**Condition** : Ne s'applique que si `childrenCount === 0` (défaut)

---

### 7. AGE RANGE + LIVING CONTEXT → DESIRE CHILDREN

**Logique** : Estimation désir enfants selon âge

```typescript
ageRange → desireChildren

'13-17' || '18-24' → 'Pas encore décidé'
'46+'              → 'Non applicable'
autres             → 'Oui, dans le futur'
```

**Exemple** :
```
Input:  ageRange: '18-24'
Output: desireChildren: 'Pas encore décidé'
```

**Condition** : Ne s'applique que si `desireChildren` est vide

---

## 🔧 FONCTIONS UTILITAIRES

### `mapPersonalizationToProfile()`

**Signature** :
```typescript
mapPersonalizationToProfile(
  personalization: PersonalizationContext,
  currentProfile: UserProfile
): Partial<UserProfile>
```

**Description** : Mappe les données de personnalisation vers le profil

**Retour** : Objet partiel avec seulement les champs à mettre à jour

**Logique clé** :
- Ne met à jour que les champs vides
- Respecte les données existantes
- Inférences intelligentes

---

### `generateDefaultName()`

**Signature** :
```typescript
generateDefaultName(
  personalization: PersonalizationContext,
  language: 'fr' | 'wo'
): string
```

**Description** : Génère un nom par défaut basé sur le ton préféré

**Exemples** :
```typescript
// FR
preferredTone: 'sisterly'  → 'Ma Sœur'
preferredTone: 'friendly'  → 'Belle Âme'
preferredTone: 'formal'    → 'Utilisatrice'

// Wolof
preferredTone: 'sisterly'  → 'Rakk'
preferredTone: 'friendly'  → 'Jigéen'
preferredTone: 'formal'    → 'Jigéen'
```

---

### `getPersonalizedWelcomeMessage()`

**Signature** :
```typescript
getPersonalizedWelcomeMessage(
  personalization: PersonalizationContext,
  profile: UserProfile,
  language: 'fr' | 'wo'
): string
```

**Description** : Génère un message de bienvenue personnalisé

**Exemples** :
```typescript
// Ton sisterly (FR)
→ "Bienvenue ma belle Aïcha ! On est ravies de t'avoir parmi nous 💚"

// Ton friendly (FR)
→ "Salut Fatou, bienvenue dans ton espace SaxalWér !"

// Ton formal (FR)
→ "Bienvenue, Utilisatrice. Nous sommes honorés de vous accompagner."
```

---

### `suggestLocation()`

**Signature** :
```typescript
suggestLocation(
  personalization: PersonalizationContext,
  language: 'fr' | 'wo'
): string
```

**Description** : Suggère une localisation par défaut

**Exemples** :
```
language: 'wo' → 'Dakar, Sénégal'
language: 'fr' → 'Afrique de l\'Ouest'
```

---

### `getPersonalizationSummary()`

**Signature** :
```typescript
getPersonalizationSummary(
  personalization: PersonalizationContext,
  language: 'fr' | 'wo'
): string
```

**Description** : Résumé textuel de la personnalisation

**Exemple** :
```
Input:
  ageRange: '25-34'
  livingContext: 'alone'
  preferredTone: 'friendly'

Output (FR):
  "Âge: 25-34 ans • Je vis seule • Ton amical"

Output (Wolof):
  "At: 25-34 at • Dama nékk rekk • Ton amical"
```

---

## 🔄 FLUX UTILISATEUR

```
1. Onboarding Complet
   ↓
2. Étape Personnalisation
   │ • Sélection ageRange: '25-34'
   │ • Sélection livingContext: 'alone'
   │ • Sélection socialNorms: 'moderate'
   │ • Sélection preferredTone: 'friendly'
   │ • ... autres questions
   ↓
3. onComplete(context)
   ↓
4. setPersonalization(context) ✅
   │
   ├─ Sauvegarde personalization
   │
   └─ mapPersonalizationToProfile() ✅
      │
      ├─ birthdate: '1997-01-01'
      ├─ maritalStatus: 'Célibataire'
      ├─ religiousFaith: 'Modérée'
      ├─ personality: 'Ouverte et bienveillante'
      ├─ childrenCount: 0
      └─ desireChildren: 'Oui, dans le futur'
   ↓
5. Dashboard
   ↓
6. Navigation vers "Edit Profile"
   ↓
7. Affichage Profil Pré-rempli ✅
   │ • Date de naissance: 1997-01-01
   │ • Situation maritale: Célibataire
   │ • Confession religieuse: Modérée
   │ • Personnalité: Ouverte et bienveillante
   │ • Nombre d'enfants: 0
   │ • Désir d'enfants: Oui, dans le futur
   ↓
8. Utilisatrice peut modifier/compléter
```

---

## 📊 EXEMPLES DE MAPPING

### Exemple 1 : Adolescente conservatrice

**Input Personnalisation** :
```typescript
{
  ageRange: '13-17',
  livingContext: 'parents',
  socialNorms: 'conservative',
  educationLevel: 'basic',
  preferredTone: 'sisterly',
  // ...
}
```

**Output Profil** :
```typescript
{
  birthdate: '2011-01-01',          // 2026 - 15
  maritalStatus: 'Célibataire',     // living with parents
  religiousFaith: 'Pratiquante',    // conservative norms
  personality: 'Complice et chaleureuse', // sisterly tone
  childrenCount: 0,                 // young age
  desireChildren: 'Pas encore décidé',    // 13-17 age range
}
```

---

### Exemple 2 : Femme indépendante modérée

**Input Personnalisation** :
```typescript
{
  ageRange: '25-34',
  livingContext: 'alone',
  socialNorms: 'moderate',
  educationLevel: 'advanced',
  preferredTone: 'friendly',
  // ...
}
```

**Output Profil** :
```typescript
{
  birthdate: '1997-01-01',          // 2026 - 29
  maritalStatus: 'Célibataire',     // living alone
  religiousFaith: 'Modérée',        // moderate norms
  personality: 'Ouverte et bienveillante', // friendly tone (priority)
  childrenCount: 0,                 // default
  desireChildren: 'Oui, dans le futur',    // 25-34 age range
}
```

---

### Exemple 3 : Femme en couple ouverte

**Input Personnalisation** :
```typescript
{
  ageRange: '35-45',
  livingContext: 'partner',
  socialNorms: 'open',
  educationLevel: 'intermediate',
  preferredTone: 'formal',
  // ...
}
```

**Output Profil** :
```typescript
{
  birthdate: '1986-01-01',                // 2026 - 40
  maritalStatus: 'En couple',             // living with partner
  religiousFaith: 'Ouverte',              // open norms
  personality: 'Professionnelle et sérieuse', // formal tone (priority)
  childrenCount: 0,                       // default (could be modified)
  desireChildren: 'Oui, dans le futur',   // default
}
```

---

## ⚙️ IMPLÉMENTATION TECHNIQUE

### Dans AppContext.tsx

```typescript
import { mapPersonalizationToProfile } from '../utils/personalizationMapper';

const setPersonalization = (context: PersonalizationContext) => {
  setState(prev => {
    // Mapper automatiquement
    const profileUpdates = mapPersonalizationToProfile(context, prev.userProfile);
    
    return {
      ...prev,
      personalization: context,
      userProfile: {
        ...prev.userProfile,
        ...profileUpdates, // Fusion intelligente
      },
    };
  });
};
```

**Principe** : Mise à jour atomique du state avec mapping automatique

---

### Protection des Données Existantes

```typescript
// Dans mapPersonalizationToProfile()
if (!currentProfile.birthdate) {
  updates.birthdate = estimatedBirthdate;
}
// Ne met à jour QUE si le champ est vide
```

**Garantie** : Jamais d'écrasement de données existantes

---

## ✅ AVANTAGES

### Pour l'Utilisatrice

1. ✅ **Pas de redondance** : Ne redemande pas ce qui a déjà été dit
2. ✅ **Gain de temps** : Profil pré-rempli dès le premier accès
3. ✅ **Cohérence** : Les données sont cohérentes entre personnalisation et profil
4. ✅ **Contrôle total** : Peut toujours modifier les champs pré-remplis
5. ✅ **Expérience fluide** : Transition naturelle onboarding → profil

### Pour l'Application

1. ✅ **Données riches** : Profils plus complets dès le départ
2. ✅ **Engagement** : Utilisatrice voit la valeur de la personnalisation
3. ✅ **Intelligence** : Système qui comprend et utilise le contexte
4. ✅ **Évolution** : Base pour personnalisation future (chatbot, etc.)
5. ✅ **Différenciation** : Feature unique et intelligente

---

## 🧪 TESTS RECOMMANDÉS

### Tests Unitaires

```typescript
test('ageRange 25-34 → birthdate ~1997', () => {
  const result = mapPersonalizationToProfile(
    { ageRange: '25-34', /* ... */ },
    { birthdate: '', /* ... */ }
  );
  expect(result.birthdate).toContain('1997');
});

test('livingContext partner → maritalStatus En couple', () => {
  const result = mapPersonalizationToProfile(
    { livingContext: 'partner', /* ... */ },
    { maritalStatus: '', /* ... */ }
  );
  expect(result.maritalStatus).toBe('En couple');
});

test('Ne pas écraser birthdate existant', () => {
  const result = mapPersonalizationToProfile(
    { ageRange: '25-34', /* ... */ },
    { birthdate: '1990-05-15', /* ... */ }
  );
  expect(result.birthdate).toBeUndefined();
});
```

### Tests d'Intégration

1. [ ] Compléter personnalisation → vérifier profil pré-rempli
2. [ ] Skip personnalisation → profil vide
3. [ ] Modifier profil manuellement → ne pas écraser au prochain mapping
4. [ ] Plusieurs sessions → persistence correcte

---

## 🔮 ÉVOLUTIONS FUTURES

### Court Terme

1. **Badge visuel "Pré-rempli"**
   ```tsx
   <label>
     Date de naissance
     <span style={{ badge }}> ✨ Pré-rempli</span>
   </label>
   ```

2. **Tooltip explicatif**
   ```
   "Cette information a été déduite de ta personnalisation.
   Tu peux la modifier librement."
   ```

### Moyen Terme

1. **Affichage résumé personnalisation**
   ```tsx
   <InfoCard>
     Ton contexte : {getPersonalizationSummary(personalization, language)}
   </InfoCard>
   ```

2. **Page "Modifier ma personnalisation"**
   - Permettre de re-personnaliser
   - Re-mapper automatiquement le profil si souhaité

### Long Terme

1. **Mapping bidirectionnel**
   - Profil → Personnalisation (si pas fait)
   - Détection incohérences et suggestions

2. **Machine Learning**
   - Amélioration mapping basé sur comportement utilisatrices
   - Suggestions plus précises

3. **Validation intelligente**
   - Alerter si incohérence détectée
   - Ex: "Tu as 17 ans mais 2 enfants. Est-ce correct ?"

---

## 📈 MÉTRIQUES

### À Suivre

1. **Taux de complétion profil**
   - Avant mapping : X%
   - Après mapping : Y%
   - Objectif : +30% minimum

2. **Nombre champs pré-remplis en moyenne**
   - Objectif : 4-6 champs sur 12

3. **Taux de modification champs pré-remplis**
   - Si >50% : revoir logique mapping
   - Si <10% : excellent

4. **Satisfaction utilisatrices**
   - Enquête : "Apprécie-tu que certains champs soient pré-remplis ?"
   - Objectif : >80% "Oui"

---

## 🎉 RÉSULTAT

Un système de **liaison intelligente** qui transforme les réponses de personnalisation en données de profil, offrant une expérience **fluide**, **cohérente** et **respectueuse** du temps de l'utilisatrice.

**Principe** : *"Demande une fois, utilise partout"*

---

**Date** : 4 mars 2026  
**Version** : 1.0  
**Statut** : ✅ **PRODUCTION READY**

---

*"L'intelligence, c'est de ne jamais redemander ce que tu sais déjà."* 💚
