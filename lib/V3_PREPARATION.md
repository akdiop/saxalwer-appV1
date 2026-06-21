# Préparation V3 — fichiers à créer plus tard (non codés en V2)

Architecture amorcée, désactivée par défaut :
- `lib/samawer/` — espace personnel local (suivi cycle simple, notes privées).
- `lib/datalab/` — statistiques anonymisées/agrégées, sous consentement explicite.

À ajouter en V3 :
- Chatbot « Ndeye » (assistant conversationnel encadré).
- Scoring socio-culturel & autonomie numérique : versions avancées (déjà amorcées
  dans `lib/scoring/`).
- Suivi de cycle simple (UI) relié à `SamaWerProfile`.
- Feedback utilisatrice structuré.
- Pipeline données anonymisées → laboratoire de données / préparation pilote-recherche.

Garde-fous V2 : `SAMAWER_ENABLED = false`, `DATALAB_ENABLED = false`,
collecte refusée par `canCollect()`. Sénégal uniquement.
