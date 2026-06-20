import type { Session, User } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import { getSupabaseConfigError, supabase, supabaseConfig } from '../lib/supabase';

type AuthResult = {
  error: string | null;
};

type SignUpResult = AuthResult & {
  requiresEmailConfirmation: boolean;
};

type SupabaseAuthContextValue = {
  initialized: boolean;
  isConfigured: boolean;
  configurationError: string | null;
  session: Session | null;
  user: User | null;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (
    firstName: string,
    email: string,
    password: string
  ) => Promise<SignUpResult>;
  signOut: () => Promise<AuthResult>;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextValue | undefined>(undefined);

const normalizeEmail = (value: string) => value.trim().toLowerCase();

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(!supabaseConfig.isConfigured);

  useEffect(() => {
    if (!supabaseConfig.isConfigured) {
      setInitialized(true);
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return;
      }

      if (error) {
        console.warn('Unable to restore Supabase session', error.message);
      }

      setSession(data.session ?? null);
      setInitialized(true);
    });

    if (AppState.currentState === 'active') {
      supabase.auth.startAutoRefresh();
    }

    const authListener = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setInitialized(true);
    });

    const appStateListener = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        supabase.auth.startAutoRefresh();
        return;
      }

      supabase.auth.stopAutoRefresh();
    });

    return () => {
      isMounted = false;
      authListener.data.subscription.unsubscribe();
      appStateListener.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, []);

  const configurationError = getSupabaseConfigError();
  const user = session?.user ?? null;

  const value = useMemo<SupabaseAuthContextValue>(
    () => ({
      initialized,
      isConfigured: supabaseConfig.isConfigured,
      configurationError,
      session,
      user,
      signInWithPassword: async (email, password) => {
        if (!supabaseConfig.isConfigured) {
          return { error: configurationError ?? "Supabase n'est pas configuré." };
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: normalizeEmail(email),
          password,
        });

        return { error: error?.message ?? null };
      },
      signUpWithPassword: async (firstName, email, password) => {
        if (!supabaseConfig.isConfigured) {
          return {
            error: configurationError ?? "Supabase n'est pas configuré.",
            requiresEmailConfirmation: false,
          };
        }

        const { data, error } = await supabase.auth.signUp({
          email: normalizeEmail(email),
          password,
          options: {
            data: {
              first_name: firstName.trim(),
            },
          },
        });

        return {
          error: error?.message ?? null,
          requiresEmailConfirmation: !error && !data.session,
        };
      },
      signOut: async () => {
        if (!supabaseConfig.isConfigured) {
          return { error: configurationError ?? "Supabase n'est pas configuré." };
        }

        const { error } = await supabase.auth.signOut();
        return { error: error?.message ?? null };
      },
    }),
    [configurationError, initialized, session, user]
  );

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>;
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);

  if (!context) {
    throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider');
  }

  return context;
}
