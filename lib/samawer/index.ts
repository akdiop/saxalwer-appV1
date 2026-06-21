/**
 * SamaWér — espace personnel (PRÉPARATION V3, non activé en V2).
 *
 * Objectif futur : un volet « mon espace » où l'utilisatrice retrouve, EN LOCAL
 * et de façon privée, ses préférences, son suivi simple de cycle et ses repères.
 * Aucune donnée de santé nominative n'est transmise.
 *
 * V2 = types et points d'extension uniquement. Ne pas brancher d'écran ici tant
 * que le cadre de consentement V3 n'est pas validé.
 */

export interface SamaWerProfile {
  /** Préférences déjà gérées par le contexte (langue, mode, discrétion). */
  version: 1;
  createdAt: number;
  /** Suivi de cycle simple — V3. */
  cycle?: { lastPeriodStart?: number; averageCycleLength?: number } | null;
  /** Notes personnelles chiffrées localement — V3. */
  privateNotes?: string[] | null;
}

export const SAMAWER_ENABLED = false; // bascule V3

export function createEmptySamaWerProfile(): SamaWerProfile {
  return { version: 1, createdAt: Date.now(), cycle: null, privateNotes: null };
}
