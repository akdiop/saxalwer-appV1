import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const fallbackSupabaseUrl = 'https://placeholder.supabase.co';
const fallbackSupabaseKey = 'placeholder-publishable-key';

const projectId = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID?.trim();

const resolveSupabaseUrl = () => {
  const explicitUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();

  if (explicitUrl) {
    return explicitUrl;
  }

  if (projectId) {
    return `https://${projectId}.supabase.co`;
  }

  return null;
};

const resolveSupabasePublicKey = () => {
  return (
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.EXPO_PUBLIC_SUPABASE_PUBLIC_ANON_KEY?.trim() ||
    null
  );
};

const url = resolveSupabaseUrl();
const publicKey = resolveSupabasePublicKey();

export const supabaseConfig = {
  url,
  publicKey,
  projectId: projectId ?? null,
  functionsBaseUrl: url ? `${url}/functions/v1` : null,
  isConfigured: Boolean(url && publicKey),
};

export const getSupabaseConfigError = () => {
  const missing: string[] = [];

  if (!supabaseConfig.url) {
    missing.push('EXPO_PUBLIC_SUPABASE_URL (ou EXPO_PUBLIC_SUPABASE_PROJECT_ID)');
  }

  if (!supabaseConfig.publicKey) {
    missing.push(
      'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ou EXPO_PUBLIC_SUPABASE_ANON_KEY)'
    );
  }

  if (missing.length === 0) {
    return null;
  }

  return `Configuration Supabase manquante: ${missing.join(', ')}`;
};

export const supabase = createClient(
  supabaseConfig.url ?? fallbackSupabaseUrl,
  supabaseConfig.publicKey ?? fallbackSupabaseKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
