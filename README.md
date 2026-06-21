# SaxalWér — Application officielle

**Ton corps, ton rythme, ta paix.**

SaxalWér est une application de santé numérique féminine, pensée depuis le Sénégal, pour améliorer l’accès à l’information et à l’orientation en santé sexuelle et reproductive dans un cadre confidentiel, culturellement sensible et non diagnostique.

Le nom **SaxalWér** vient du wolof : **Saxal** renvoie à l’idée d’éclairer, faire comprendre et rendre durable ; **Wér** signifie santé. L’usage commercial retenu est **SaxalWér**, avec accent.

## Positionnement

SaxalWér n’est pas seulement une application de santé sexuelle et reproductive. C’est une plateforme d’information, d’orientation, d’autonomie féminine et de production de connaissances anonymisées utiles à la recherche et aux politiques publiques.

Le périmètre actuel est le **Sénégal**. Les langues prioritaires sont le **français** et le **wolof**.

## Cadre médical

SaxalWér fournit des informations éducatives et une orientation générale. L’application :

- ne pose aucun diagnostic médical ;
- ne prescrit aucun traitement ;
- ne remplace pas une consultation avec une professionnelle de santé ;
- ne donne pas d’avis médical personnalisé ;
- encourage la consultation en cas de doute ou de symptôme inquiétant.

En cas d’urgence au Sénégal :

- **SAMU National : 1515** ;
- **Sapeurs-pompiers : 18** ;
- **Police secours : 17**.

## Fonctionnalités principales

- Accueil personnalisé.
- Bibliothèque santé.
- Assistant conversationnel.
- Orientation santé non diagnostique.
- Orientation sensible intégrant tabous, normes sociales et contraintes d’accès aux soins.
- Mode discret.
- Mode écouter.
- Mode guidé / mode complet.
- Suivi du cycle.
- Journal intime.
- Calendrier santé.
- Carte des structures de santé au Sénégal.
- Annuaire de professionnelles et professionnels de santé.
- Pages juridiques : CGU, politique de confidentialité, mentions légales, avertissement médical.

## Confidentialité et données

SaxalWér applique une logique de minimisation des données. La version actuelle privilégie les préférences locales et les données de démonstration. Aucune donnée de santé sensible ou nominative ne doit être collectée sans consentement explicite et cadre spécifique.

Les données personnelles ne doivent jamais être vendues, louées ou cédées à des annonceurs ou partenaires commerciaux.

## Identité visuelle

Palette officielle :

```css
--beige: #F5F1E6;
--deep-green: #1A3C34;
--terracotta: #A65D40;
--copper: #B5622A;
--cocoa: #4A2F27;
--gold: #D4AF37;
```

Typographies de référence :

- Titres : Cormorant Garamond, Playfair ou serif élégante.
- Corps : Inter, Lato, Poppins ou sans-serif lisible.

L’univers visuel doit rester sobre, intime, africain, non hypersexualisé et non médicalisé de manière froide.

## Installation

```bash
npm install
```

## Développement web

```bash
npm run web
```

## Build web

```bash
npm run build
```

## Preview du build

```bash
npm run preview
```

## Déploiement Vercel

Build command :

```bash
npm run build
```

Output directory :

```text
dist
```

## Structure simplifiée

```text
app/            Routes Expo Router
components/     Composants réutilisables
context/        État global et préférences
data/           Contenus éducatifs et données mockées
utils/          Logiques d’orientation et personnalisation
assets/         Images et logo
```

## Statut

Version de travail officielle basée sur la V1 préférée, avec intégration progressive du référentiel final SaxalWér 2026.

## Propriété intellectuelle

Le projet SaxalWér, son concept, son architecture fonctionnelle, ses contenus, ses logiques d’orientation, son identité visuelle et ses éléments de marque sont protégés. Toute reproduction, distribution, modification, exploitation commerciale ou création d’un produit dérivé nécessite une autorisation écrite préalable de SaxalWér.

## Contact

Aïdalaye Diop  
Fondatrice — SaxalWér  
www.saxalwer.com  
contact@saxalwer.com  
Dakar, Sénégal
