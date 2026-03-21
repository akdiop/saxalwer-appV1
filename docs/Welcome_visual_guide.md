# 🎨 GUIDE VISUEL - ÉCRAN D'ACCUEIL AMÉLIORÉ

## 🖼️ Hiérarchie Visuelle

```
┌───────────────────────────────────────────┐
│  NIVEAU 1: LANGUE (2rem top margin)       │  ← Première décision
│  - Texte explicatif 0.75rem               │
│  - 2 boutons côte à côte                  │
│  - Gap 0.75rem                            │
└───────────────────────────────────────────┘
                    ↓ 2.5rem gap
┌───────────────────────────────────────────┐
│  NIVEAU 2: ILLUSTRATION (280x280px)       │  ← Point focal
│  - Cercle protecteur animé                │
│  - Silhouette féminine                    │
│  - Symboles culturels                     │
└───────────────────────────────────────────┘
                    ↓ 2rem gap
┌───────────────────────────────────────────┐
│  NIVEAU 3: TITRE (2.5rem)                 │  ← Identité
│  - SAXALWÉR                               │
│  - Tagline 0.9rem                         │
└───────────────────────────────────────────┘
                    ↓ 2rem gap
┌───────────────────────────────────────────┐
│  NIVEAU 4: VALEURS (3 cartes)             │  ← Promesses
│  - Confidentialité                        │
│  - Accompagnement                         │
│  - Informations fiables                   │
└───────────────────────────────────────────┘
                    ↓ 2.5rem gap
┌───────────────────────────────────────────┐
│  NIVEAU 5: CTA (1.25rem padding)          │  ← Action
│  - Commencer / Tambali                    │
└───────────────────────────────────────────┘
                    ↓ 1.5rem gap
┌───────────────────────────────────────────┐
│  NIVEAU 6: FOOTER (0.65rem)               │  ← Réassurance finale
│  - Message personnel                      │
└───────────────────────────────────────────┘
```

---

## 🎨 Détails de l'Illustration

### Cercle Protecteur (Layers)

```
Layer 1: Outer Glow (animated)
┌─────────────────────────────────┐
│    ╭───────────────────╮        │
│  ╱   pulse animation    ╲       │
│ │   scale: 1 → 1.05 → 1 │      │
│ │   opacity: 0.3 → 0.5   │     │
│ │   duration: 4s         │     │
│  ╲                      ╱       │
│    ╰───────────────────╯        │
└─────────────────────────────────┘

Layer 2: Main Circle
┌─────────────────────────────────┐
│    ╭───────────────────╮        │
│  ╱  90% width & height  ╲       │
│ │   border: 1.5px #0F3D2E│     │
│ │   gradient: beige→white│     │
│ │   shadow: soft         │     │
│  ╲                      ╱       │
│    ╰───────────────────╯        │
└─────────────────────────────────┘

Layer 3: Crescent Moon (top-right)
┌─────────────────────────────────┐
│              ☾                  │
│         32x32px                 │
│    border: 2px terracotta       │
│    clipPath: inset(0 0 0 40%)   │
│    opacity: 0.6                 │
│    rotation: 0→5→0° (6s)        │
└─────────────────────────────────┘

Layer 4: Woman Silhouette (center)
┌─────────────────────────────────┐
│      👩 140x180px               │
│                                 │
│   ╭───────────╮ Afro hair      │
│  ( ●       ● ) Face             │
│   ╰─────────╯                  │
│       │││   Neck                │
│   ╭───┴───╮ Shoulders          │
│  │         │ Torso              │
│  │    ●●   │ Decorative dots    │
│  ╰─────────╯                   │
└─────────────────────────────────┘

Layer 5: Africa + Baobab (bottom-left)
┌─────────────────────────────────┐
│                                 │
│  🌍                             │
│  50x50px                        │
│  opacity: 0.4                   │
│  position: bottom 8%, left 12%  │
│                                 │
│  Africa outline + tree icon     │
└─────────────────────────────────┘
```

---

## 📏 Dimensions & Spacing

### Conteneur Principal
```
┌─────────────────────────────────┐
│  max-width: 480px               │
│  padding: 2rem 1.5rem 2.5rem    │
│  margin: 0 auto                 │
│  width: 100%                    │
└─────────────────────────────────┘
```

### Boutons de Langue
```
Conteneur:
┌─────────────────────────────────┐
│  display: flex                  │
│  gap: 0.75rem (12px)            │
│  justify-content: center        │
└─────────────────────────────────┘

Chaque bouton:
┌───────────────┐
│  flex: 1      │
│  padding:     │
│  1rem 1.5rem  │
│  radius:      │
│  1.5rem       │
└───────────────┘
```

### Illustration Centrale
```
┌─────────────────┐
│  280 x 280px    │
│                 │
│  Cercle: 90%    │
│  SVG: 140x180   │
│                 │
│  margin:        │
│  0 auto 2rem    │
└─────────────────┘
```

### Cartes de Valeurs
```
Chaque carte:
┌─────────────────────────────────┐
│ ┌──┐  Texte                     │
│ │40│  fontSize: 0.85rem         │
│ │px│  fontWeight: 600           │
│ └──┘  lineHeight: 1.4           │
│                                 │
│ padding: 1rem 1.25rem           │
│ radius: 1.25rem                 │
└─────────────────────────────────┘

Gap entre cartes: 0.75rem
```

### CTA Button
```
┌─────────────────────────────────┐
│                                 │
│    Commencer / Tambali    →     │
│                                 │
│  width: 100%                    │
│  padding: 1.25rem               │
│  radius: 1.5rem                 │
│  fontSize: 1rem                 │
│  fontWeight: 700                │
└─────────────────────────────────┘
```

---

## 🌈 États Interactifs

### Boutons de Langue

**État Normal (non sélectionné)**
```css
background: white
border: 1px solid rgba(74, 47, 39, 0.2)
color: #4A2F27
box-shadow: 0 2px 8px rgba(0,0,0,0.04)
```

**État Sélectionné**
```css
background: rgba(15, 61, 46, 0.08)
border: 2px solid #0F3D2E
color: #0F3D2E
box-shadow: 0 4px 12px rgba(15, 61, 46, 0.15)
```

**État Tap/Active**
```css
transform: scale(0.96)
transition: all 0.2s ease
```

### Cartes de Valeurs

**État Repos**
```css
background: white
border: 1px solid rgba(color, 0.15)
box-shadow: 0 2px 8px rgba(color, 0.06)
```

**Pas d'interaction** (cards informationnelles)

### CTA Button

**État Normal**
```css
background: #0F3D2E
color: white
box-shadow: 0 8px 24px rgba(15, 61, 46, 0.35)
```

**État Hover** (desktop)
```css
background: #0d3326 (légèrement plus clair)
```

**État Tap**
```css
transform: scale(0.97)
transition: all 0.15s ease
```

---

## 🎭 SVG de la Silhouette

### Code Détaillé

```svg
<svg width="140" height="180" viewBox="0 0 140 180">
  <!-- Hair (Afro) -->
  <ellipse
    cx="70" cy="45"
    rx="50" ry="45"
    fill="#0F3D2E"
    opacity="0.85"
  />
  
  <!-- Head -->
  <ellipse
    cx="70" cy="65"
    rx="35" ry="40"
    fill="#0F3D2E"
    opacity="0.85"
  />
  
  <!-- Neck -->
  <rect
    x="60" y="95"
    width="20" height="15"
    fill="#0F3D2E"
    opacity="0.85"
  />
  
  <!-- Body (path complex) -->
  <path
    d="M 40 110 Q 30 115 25 130 L 25 160 L 55 160 L 55 145 L 70 140 L 85 145 L 85 160 L 115 160 L 115 130 Q 110 115 100 110 Z"
    fill="#0F3D2E"
    opacity="0.85"
  />

  <!-- Decorative dots (traditional patterns) -->
  <circle cx="70" cy="70" r="2" fill="#C26A3D" opacity="0.6" />
  <circle cx="75" cy="75" r="1.5" fill="#C26A3D" opacity="0.6" />
  <circle cx="65" cy="75" r="1.5" fill="#C26A3D" opacity="0.6" />
</svg>
```

### Modifications Possibles

**Plus de Détails**
```svg
<!-- Ajouter collier -->
<ellipse cx="70" cy="105" rx="12" ry="3" fill="none" stroke="#C26A3D" stroke-width="1" />

<!-- Ajouter boucles d'oreilles -->
<circle cx="45" cy="68" r="3" fill="#C26A3D" opacity="0.7" />
<circle cx="95" cy="68" r="3" fill="#C26A3D" opacity="0.7" />
```

**Plus de Patterns**
```svg
<!-- Motifs géométriques sur vêtements -->
<rect x="60" y="130" width="4" height="4" fill="#C26A3D" opacity="0.5" />
<rect x="76" y="130" width="4" height="4" fill="#C26A3D" opacity="0.5" />
```

---

## 🌍 SVG Afrique + Baobab

### Code Détaillé

```svg
<svg width="50" height="50" viewBox="0 0 50 50">
  <!-- Simplified Africa outline -->
  <path
    d="M 25 5 
       Q 30 8 32 12 
       L 35 15 
       Q 38 20 38 25 
       L 40 30 
       Q 40 35 38 38 
       L 35 42 
       Q 30 45 25 46 
       L 20 45 
       Q 15 43 12 40 
       L 8 35 
       Q 5 30 5 25 
       L 8 18 
       Q 12 12 18 8 
       Z"
    fill="none"
    stroke="#0F3D2E"
    stroke-width="1.5"
  />
  
  <!-- Baobab tree trunk -->
  <line 
    x1="28" y1="28" 
    x2="28" y2="35" 
    stroke="#0F3D2E" 
    stroke-width="1.5" 
  />
  
  <!-- Baobab canopy -->
  <ellipse 
    cx="28" cy="26" 
    rx="4" ry="3" 
    fill="#0F3D2E" 
    opacity="0.6" 
  />
</svg>
```

### Alternative Plus Détaillée

```svg
<!-- Africa avec plus de régions -->
<path d="M 25 5 Q 30 8 32 12 L 35 15 Q 38 20 38 25 L 40 30 Q 40 35 38 38 L 35 42 Q 30 45 25 46 L 20 45 Q 15 43 12 40 L 8 35 Q 5 30 5 25 L 8 18 Q 12 12 18 8 Z" />

<!-- Baobab plus réaliste -->
<path d="M 28 35 L 28 28 M 26 30 L 28 28 L 30 30" stroke="#0F3D2E" />
<ellipse cx="28" cy="26" rx="5" ry="3.5" />
```

---

## 📱 Breakpoints Responsive

### Mobile Small (320px - 375px)
```css
.container {
  padding: 1.5rem 1rem 2rem;
}

h1 {
  font-size: 2rem; /* réduire de 2.5rem */
}

.illustration {
  width: 240px;
  height: 240px;
}
```

### Mobile Medium (375px - 414px)
```css
/* Design par défaut - optimal */
```

### Mobile Large (414px - 768px)
```css
.container {
  padding: 2rem 1.5rem 2.5rem;
}
```

### Tablet (768px+)
```css
.container {
  max-width: 520px;
}

.illustration {
  width: 320px;
  height: 320px;
}
```

---

## 🎬 Timeline d'Animations

```
  0ms: Page load
  ↓
100ms: Background gradient fade in
  ↓
200ms: Language buttons appear (opacity + translateY)
  ↓
400ms: Illustration scale up (scale + opacity)
  ↓
600ms: Title appear (opacity + translateY)
  ↓
800ms: Value cards appear (opacity + translateY)
  ↓
1000ms: CTA button appear (opacity + translateY)
  ↓
1200ms: Footer text fade in (opacity only)
  ↓
∞: Continuous animations (pulse, rotation)
```

### Easing Functions

```css
ease-in-out: Entrées et sorties
easeInOut: Animations continues (pulse, rotation)
ease: Interactions utilisateur (tap)
```

---

## 🔤 Typographie Détaillée

### Headline (Titre SAXALWÉR)
```css
font-family: "Cormorant Garamond", "Playfair Display", serif
font-size: 2.5rem (40px)
font-weight: 700
letter-spacing: 0.05em (2px)
line-height: 1.2 (48px)
color: #0F3D2E
text-align: center
```

### Tagline
```css
font-family: Inter, system-ui, sans-serif
font-size: 0.9rem (14.4px)
font-weight: 400
line-height: 1.6 (23px)
color: #4A2F27
opacity: 0.8
text-align: center
max-width: 320px
```

### Langue Subtitle
```css
font-family: Inter, system-ui, sans-serif
font-size: 0.75rem (12px)
font-weight: 400
line-height: 1.5 (18px)
color: rgba(74, 47, 39, 0.9)
text-align: center
```

### Boutons de Langue
```css
font-family: Inter, system-ui, sans-serif
font-size: 0.9rem (14.4px)
font-weight: 600
letter-spacing: 0.02em
text-transform: uppercase
```

### Cartes de Valeurs
```css
font-family: Inter, system-ui, sans-serif
font-size: 0.85rem (13.6px)
font-weight: 600
line-height: 1.4 (19px)
color: #0F3D2E
```

### CTA Button
```css
font-family: Inter, system-ui, sans-serif
font-size: 1rem (16px)
font-weight: 700
letter-spacing: 0.03em (0.48px)
text-transform: none
```

### Footer Note
```css
font-family: Inter, system-ui, sans-serif
font-size: 0.65rem (10.4px)
font-weight: 400
font-style: italic
line-height: 1.5 (15.6px)
color: rgba(74, 47, 39, 0.6)
text-align: center
```

---

## 🎯 Focus États (Accessibilité)

### Boutons de Langue
```css
:focus-visible {
  outline: 2px solid #0F3D2E;
  outline-offset: 2px;
}
```

### CTA Button
```css
:focus-visible {
  outline: 2px solid #C26A3D;
  outline-offset: 3px;
}
```

---

## 📐 Grille de Layout

```
┌─────────────────────────────────────┐
│  ← 1.5rem →                         │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  max-width: 480px             │ │
│  │  margin: 0 auto               │ │
│  │                               │ │
│  │  [Langue]    ← 2rem top      │ │
│  │       ↓ 2.5rem gap           │ │
│  │  [Illustration]              │ │
│  │       ↓ 2rem gap             │ │
│  │  [Titre]                     │ │
│  │       ↓ 2rem gap             │ │
│  │  [Valeurs]                   │ │
│  │       ↓ auto (flex)          │ │
│  │  [CTA]                       │ │
│  │       ↓ 1.5rem gap           │ │
│  │  [Footer]    ← 2.5rem bottom│ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  ← 1.5rem →                         │
└─────────────────────────────────────┘
```

---

Date : 3 mars 2026  
Version : 1.0  
Statut : ✅ Guide complet pour implémentation
