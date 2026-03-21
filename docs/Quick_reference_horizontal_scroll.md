# 🚀 RÉFÉRENCE RAPIDE - Défilement Horizontal

## ⚡ **COPY-PASTE PATTERNS**

### **Pattern 1 : Chips avec Padding Externe**
```tsx
<div style={{ 
  overflowX: 'auto',
  overflowY: 'hidden',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  scrollbarWidth: 'none',
  WebkitOverflowScrolling: 'touch',
} as React.CSSProperties}>
  <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
    {items.map(item => (
      <button 
        key={item.id}
        style={{ 
          flexShrink: 0, 
          borderRadius: 99,
          padding: '8px 14px',
          whiteSpace: 'nowrap',
        }}
      >
        {item.label}
      </button>
    ))}
  </div>
</div>
```

### **Pattern 2 : Chips sans Padding (zone déjà paddée)**
```tsx
<div style={{ 
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'none',
  WebkitOverflowScrolling: 'touch',
} as React.CSSProperties}>
  <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
    {/* Vos chips ici */}
  </div>
</div>
```

### **Pattern 3 : Cartes Complexes**
```tsx
import { HorizontalScroll } from '../components/HorizontalScroll';

<HorizontalScroll gap={10} itemMinWidth={200} showArrows={false}>
  {items.map(item => <Card key={item.id} {...item} />)}
</HorizontalScroll>
```

---

## ✅ **CHECKLIST**

Avant de committer du code avec défilement horizontal :

- [ ] `flexShrink: 0` sur chaque élément
- [ ] `borderRadius: 99` pour pills
- [ ] `whiteSpace: 'nowrap'` pour éviter wrapping
- [ ] `paddingLeft/Right: '1rem'` (ou déjà dans parent)
- [ ] `WebkitOverflowScrolling: 'touch'` pour iOS
- [ ] `paddingBottom: 4` dans flex container
- [ ] `as React.CSSProperties` pour TypeScript
- [ ] Tester sur mobile (swipe fluide ?)

---

## 🎯 **ERREURS FRÉQUENTES**

### ❌ **NE PAS FAIRE**
```tsx
// ❌ MAUVAIS : Chip avec width fixe
<button style={{ width: '100%' }}>

// ❌ MAUVAIS : Wrapping activé
<div style={{ flexWrap: 'wrap' }}>

// ❌ MAUVAIS : Padding sur flex container
<div style={{ display: 'flex', padding: '1rem' }}>

// ❌ MAUVAIS : Overflow hidden
<div style={{ overflow: 'hidden' }}>
```

### ✅ **FAIRE**
```tsx
// ✅ BON : Largeur naturelle
<button style={{ flexShrink: 0 }}>

// ✅ BON : Une seule ligne
<div style={{ display: 'flex' }}>

// ✅ BON : Padding sur parent
<div style={{ paddingLeft: '1rem' }}>
  <div style={{ display: 'flex' }}>

// ✅ BON : Overflow auto
<div style={{ overflowX: 'auto' }}>
```

---

## 📱 **TEST MOBILE**

```bash
# Ouvrir sur mobile
npm run dev
# Accéder depuis téléphone sur réseau local

# Vérifier :
✓ Swipe horizontal fluide
✓ Aucun chip coupé sur les bords
✓ Scrollbar invisible
✓ Momentum scroll (iOS)
✓ 16px d'espace minimum gauche/droite
```

---

## 🎨 **EXEMPLES PAR PAGE**

| Page | Utilise | Pattern |
|------|---------|---------|
| Library | Filtres + Catégories | Pattern 1 |
| Chat | Chips suggestions | Pattern 1 |
| Journal | Humeurs + Photos | Pattern 2 |
| Doctors | Spécialités | Pattern 1 |
| NotificationCenter | Catégories | Pattern 2 |
| Glossaire | Termes + Catégories | Pattern 2 |
| Chatbot | Quick replies | Pattern 1 |
| Dashboard | Suggestions | Pattern 3 (HorizontalScroll) |
| Tracker | Phases | Pattern 3 (HorizontalScroll) |

---

## 💡 **TIPS**

### **Quand utiliser HorizontalScroll ?**
- Cartes complexes (plusieurs éléments internes)
- Besoin de flèches de navigation
- itemMinWidth > 150px
- Scroll snap souhaité

### **Quand utiliser Pattern natif ?**
- Chips simples (boutons)
- Pas besoin de flèches
- itemMinWidth < 150px
- Plus de contrôle sur le style

### **Debugging**
```tsx
// Ajouter temporairement pour voir les zones
<div style={{ 
  border: '2px solid red',  // Voir container
  ...
}}>
  <div style={{ 
    border: '2px solid blue',  // Voir flex container
    ...
  }}>
```

---

## 🔍 **ANATOMIE COMPLÈTE**

```tsx
┌─────────────────────────────────────────────┐
│ Outer Container (scroll zone)              │
│ ┌─────────────────────────────────────────┐ │
│ │ 1rem padding │                   │ 1rem│ │
│ │              │                   │     │ │
│ │   ┌──────┐  ┌──────┐  ┌──────┐        │ │
│ │   │ Chip │  │ Chip │  │ Chip │  →     │ │
│ │   └──────┘  └──────┘  └──────┘        │ │
│ │      ↑         ↑         ↑             │ │
│ │      │    gap: 8px      │             │ │
│ │      └─ flexShrink: 0 ──┘             │ │
│ │                                         │ │
│ │ Inner Flex Container                   │ │
│ └─────────────────────────────────────────┘ │
│   ↑                                         │
│   └─ overflowX: auto                        │
│      paddingBottom: 4 (pour ombres)         │
└─────────────────────────────────────────────┘
```

---

## 🎯 **EN UN COUP D'ŒIL**

### **Pour chips filtres simples :**
```tsx
<div style={{ OX:'auto', OY:'hidden', PL:'1rem', PR:'1rem', SW:'none', WOS:'touch' }}>
  <div style={{ D:'flex', G:8, PB:4 }}>
    <button style={{ FS:0, BR:99, WS:'nowrap' }}>Chip</button>
  </div>
</div>
```

### **Pour cartes complexes :**
```tsx
<HorizontalScroll gap={10} itemMinWidth={200}>
  <Card />
</HorizontalScroll>
```

---

**Référence rapide SaxalWér 🌙**
