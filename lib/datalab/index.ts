/**
 * Laboratoire de données — PRÉPARATION V3 (non activé en V2).
 *
 * Objectif futur : produire des statistiques d'usage ANONYMISÉES et AGRÉGÉES
 * (jamais nominatives), uniquement après consentement explicite, pour la
 * recherche et l'amélioration du service. Cadre : politique de confidentialité
 * SaxalWér + CDP (Sénégal).
 *
 * V2 = contrat de types + garde-fous. Aucune collecte n'est effectuée.
 */

export interface AnonymizedUsageEvent {
  /** Pas d'identifiant nominatif. Catégorie d'événement uniquement. */
  category: 'screen_view' | 'orientation_done' | 'audio_play' | 'article_open';
  /** Horodatage arrondi (jour) pour réduire la ré-identification. */
  day: string; // YYYY-MM-DD
  /** Région au niveau large, jamais d'adresse. */
  region?: 'Sénégal';
}

export const DATALAB_ENABLED = false; // bascule V3
export const REQUIRES_EXPLICIT_CONSENT = true;

/** Garde-fou : toute collecte est refusée tant que V3 n'est pas validée. */
export function canCollect(consentGiven: boolean): boolean {
  return DATALAB_ENABLED && REQUIRES_EXPLICIT_CONSENT && consentGiven;
}
