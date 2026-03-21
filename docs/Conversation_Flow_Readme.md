# 🤖 Système de Conversation Contextuelle - Assistant SaxalWér

## 📋 Vue d'ensemble

Le système de conversation contextuelle permet à l'assistant SaxalWér de guider les utilisatrices à travers des flows conversationnels structurés, posant des questions de suivi intelligentes basées sur les réponses précédentes.

## 🎯 Flows Implémentés

### 1. **Flow Symptômes** (`symptoms`)
**Déclencheurs :** symptôme, douleur, saignement, pertes, mal

**Étapes :**
1. "Quels symptômes ressens-tu ?" → Chips: Douleurs pelviennes, Saignements, Fatigue, etc.
2. "Depuis combien de temps ?" → Chips: Aujourd'hui, Quelques jours, Une semaine, Plus d'un mois
3. "Lien avec le cycle menstruel ?" → Chips: Oui pendant, Oui avant, Non, Je ne sais pas
4. **Résultat :** Conseils adaptés selon la durée et le type de symptômes

### 2. **Flow Cycle Menstruel** (`cycle`)
**Déclencheurs :** cycle, règles, menstruation, calculer, suivre, irrégulier

**Étapes :**
1. "Date des dernières règles ?" → Chips: Moins d'une semaine, 1-2 semaines, 3-4 semaines, Plus d'un mois
2. "Durée habituelle du cycle ?" → Chips: 21-25 jours, 26-30 jours, 31-35 jours, Irrégulier
3. "Durée des règles ?" → Chips: 2-3 jours, 4-5 jours, 6-7 jours, Plus de 7 jours
4. **Résultat :** Analyse du cycle + redirection vers l'onglet Suivi

### 3. **Flow Contraception** (`contraception`)
**Déclencheurs :** contraception, pilule, préservatif, stérilet, implant, méthode

**Étapes :**
1. "Utilises-tu une méthode actuellement ?" → Chips: Oui, Non, Je ne sais pas
2. "Quelle méthode t'intéresse ?" → Chips: Pilule, Implant, Stérilet, Injection, Méthodes naturelles, Préservatif
3. "Préoccupations spécifiques ?" → Chips: Effets secondaires, Efficacité, Où l'obtenir, Prix
4. **Résultat :** Informations détaillées sur la méthode choisie + redirection vers la carte des professionnels

### 4. **Flow Grossesse** (`pregnancy`)
**Déclencheurs :** enceinte, grossesse, gàtt, bébé, test, retard

**Étapes :**
1. "Penses-tu être enceinte ?" → Chips: Je pense que oui, Je ne sais pas, Je suis enceinte, Juste des questions
2. "Qu'est-ce qui te fait penser à une grossesse ?" → Chips: Retard de règles, Nausées, Fatigue, Test positif
3. "As-tu fait un test ?" → Chips: Oui positif, Oui négatif, Pas encore
4. **Résultat :** Conseils adaptés selon le résultat du test + prochaines étapes

## 🔧 Architecture Technique

### Fichiers créés :
- **`/src/app/utils/conversationFlows.ts`** : Définition des flows, logique de détection et conseils

### Structure d'un Flow :
```typescript
{
  trigger: { fr: string[], wo: string[] },  // Mots-clés déclencheurs
  steps: [
    {
      question: { fr: string, wo: string },  // Question à poser
      chips: [{ fr: string, wo: string }],   // Suggestions de réponses
      onComplete?: (data) => { fr: string, wo: string } // Message final
    }
  ]
}
```

### État Conversationnel :
```typescript
{
  flow: string | null,        // ID du flow actif
  step: number,               // Étape actuelle (0-based)
  data: Record<string, any>   // Réponses collectées
}
```

## 🎨 Expérience Utilisateur

### Avant (conversation simple) :
```
Utilisateur: "J'ai des douleurs"
Bot: "Je te conseille de consulter un professionnel..."
```

### Après (conversation guidée) :
```
Utilisateur: [Clique sur "Douleurs pelviennes"]
Bot: "Quels symptômes ressens-tu ?" 
    [Douleurs pelviennes] [Saignements] [Fatigue] [Maux de tête]

Utilisateur: [Clique sur "Douleurs pelviennes"]
Bot: "Depuis combien de temps ?"
    [Aujourd'hui] [Quelques jours] [Une semaine] [Plus d'un mois]

Utilisateur: [Clique sur "Plus d'un mois"]
Bot: "Ces symptômes sont-ils liés à ton cycle ?"
    [Oui, pendant mes règles] [Oui, avant] [Non] [Je ne sais pas]

Utilisateur: [Clique sur "Oui, pendant mes règles"]
Bot: "⚠️ Tes symptômes durent depuis un certain temps.
     Je te conseille vivement de consulter...
     🏥 Tu peux trouver des centres de santé dans l'onglet Carte."
```

## 🌍 Support Bilingue

Chaque flow est entièrement bilingue (FR/Wolof) :
- Questions traduites
- Chips traduits
- Conseils finaux traduits

## 🔄 Intégration dans Chatbot.tsx

### Modifications nécessaires :

1. **État conversationnel** :
```typescript
const [conversationState, setConversationState] = React.useState<ConversationState>({
  flow: null,
  step: 0,
  data: {},
});
```

2. **Logique sendMessage modifiée** :
```typescript
const sendMessage = useCallback((text?: string) => {
  const content = (text ?? input).trim();
  if (!content) return;

  // Ajouter le message utilisateur
  // ...

  // Si un flow est actif, enregistrer la réponse et passer à l'étape suivante
  if (conversationState.flow) {
    const newData = { ...conversationState.data, [conversationState.step]: content };
    const nextStep = conversationState.step + 1;
    const flowStep = getFlowStep(conversationState.flow, nextStep, lang as 'fr' | 'wo');

    if (flowStep) {
      // Continuer le flow
      setTimeout(() => {
        const botMsg = { question: flowStep.question, chips: flowStep.chips };
        // Afficher la question + chips
      }, 1800);
      
      setConversationState({
        flow: conversationState.flow,
        step: nextStep,
        data: newData,
      });
    } else {
      // Flow terminé
      const finalMessage = completeFlow(conversationState.flow, newData, lang as 'fr' | 'wo');
      // Afficher le message final
      setConversationState({ flow: null, step: 0, data: {} });
    }
  } else {
    // Détectersi un flow doit être déclenché
    const detectedFlow = detectFlow(content, lang as 'fr' | 'wo');
    
    if (detectedFlow) {
      const flowStep = getFlowStep(detectedFlow, 0, lang as 'fr' | 'wo');
      // Démarrer le flow
      setConversationState({ flow: detectedFlow, step: 0, data: {} });
    } else {
      // Réponse générique
    }
  }
}, [input, lang, conversationState]);
```

3. **Affichage des chips contextuels** :
Les chips doivent changer dynamiquement selon l'étape du flow actif.

## 🎯 Bénéfices

✅ **Conversations structurées** : Guide l'utilisatrice étape par étape
✅ **Conseils personnalisés** : Réponses adaptées aux données collectées
✅ **Expérience intuitive** : Chips contextuels pour réponses rapides
✅ **Bilingue** : FR/Wolof sur tous les flows
✅ **Extensible** : Facile d'ajouter de nouveaux flows

## 📝 Ajout d'un Nouveau Flow

1. Définir le flow dans `conversationFlows.ts`
2. Ajouter les triggers (mots-clés)
3. Définir les étapes avec questions et chips
4. Créer la fonction de conseils finaux
5. Ajouter au `CONVERSATION_FLOWS` object

## 🚀 Prochaines Étapes

Pour activer complètement le système, il faut :
1. ✅ Créer le fichier `conversationFlows.ts` (FAIT)
2. ⏳ Modifier la fonction `sendMessage` dans `Chatbot.tsx`
3. ⏳ Rendre les chips dynamiques selon le flow actif
4. ⏳ Tester chaque flow FR et Wolof
5. ⏳ Ajouter des flows supplémentaires (fertilité, IST, etc.)

---

**Note :** Le système est déjà fonctionnel côté back-end (détection, flows, conseils). Il ne reste qu'à l'intégrer dans l'interface du chatbot pour l'activer.
