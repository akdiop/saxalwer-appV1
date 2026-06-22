import { useRouter } from 'expo-router';
import React from 'react';

import MonEspace from '../../components/MonEspace';

/**
 * Route /samawer — Espace personnel SaxalWér (« Mon Espace » / « SamaWér »).
 * Rend le composant MonEspace déjà existant, jusqu'ici non branché.
 */
export default function SamawerScreen() {
  const router = useRouter();
  return <MonEspace onBack={() => router.back()} />;
}
