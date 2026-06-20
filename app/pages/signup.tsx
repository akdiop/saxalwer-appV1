import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import BackButton from '../../components/BackButton';
import NoticeCard from '../../components/NoticeCard';
import { useApp } from '../../context/appcontext';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { isOffline } = useApp();
  const {
    configurationError,
    initialized,
    isConfigured,
    signUpWithPassword,
    user,
  } = useSupabaseAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialized && user) {
      router.replace('/profile-selection' as never);
    }
  }, [initialized, router, user]);

  const handleSignup = async () => {
    if (isSubmitting) {
      return;
    }

    if (isOffline) {
      setInfoMessage(null);
      setErrorMessage(null);
      return;
    }

    if (!name.trim() || !email.trim() || !password) {
      setInfoMessage(null);
      setErrorMessage('Renseigne ton prénom, ton email et ton mot de passe.');
      return;
    }

    if (password.length < 6) {
      setInfoMessage(null);
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    const { error, requiresEmailConfirmation } = await signUpWithPassword(
      name,
      email,
      password
    );

    if (error) {
      setErrorMessage(error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);

    if (requiresEmailConfirmation) {
      setInfoMessage("Compte créé. Vérifie ton email pour confirmer l'inscription.");
      return;
    }

    router.replace('/profile-selection' as never);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BackButton />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>
              Commence ton parcours SaxalWér.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ton prénom"
                placeholderTextColor="#4A2F2745"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Adresse email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="ton@email.com"
                placeholderTextColor="#4A2F2745"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="********"
                placeholderTextColor="#4A2F2745"
                secureTextEntry
              />
            </View>

            {!initialized ? (
              <View style={styles.feedbackRow}>
                <ActivityIndicator size="small" color="#1A3C34" />
                <Text style={styles.feedbackInfo}>Chargement de la session...</Text>
              </View>
            ) : null}

            {configurationError ? (
              <Text style={styles.feedbackError}>{configurationError}</Text>
            ) : null}

            {isOffline ? (
              <NoticeCard
                title="Mode hors ligne"
                description="Une connexion internet est nécessaire pour créer un compte."
                iconName="cloud-offline-outline"
                style={styles.noticeCard}
              />
            ) : null}

            {errorMessage ? (
              <Text style={styles.feedbackError}>{errorMessage}</Text>
            ) : null}

            {infoMessage ? (
              <Text style={styles.feedbackInfo}>{infoMessage}</Text>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                (!isConfigured || isSubmitting || isOffline) && styles.primaryBtnDisabled,
                pressed && isConfigured && !isSubmitting && !isOffline && styles.btnPressed,
              ]}
              onPress={handleSignup}
              disabled={!isConfigured || isSubmitting || isOffline}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.primaryBtnText,
                  (!isConfigured || isSubmitting || isOffline) && styles.primaryBtnTextDisabled,
                ]}
              >
                {isSubmitting ? 'Creation du compte...' : 'Créer mon compte'}
              </Text>
            </Pressable>
          </View>

          {/* Secondary link */}
          <View style={styles.secondaryRow}>
            <Text style={styles.secondaryNote}>Déjà un compte ?</Text>
            <Pressable
              onPress={() => router.push('/login' as never)}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryLink}>J&apos;ai déjà un compte</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F1E6',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 56,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },

  /* Header */
  header: {
    marginBottom: 44,
    gap: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A3C34',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#4A2F27',
    lineHeight: 24,
    opacity: 0.8,
    maxWidth: 300,
  },

  /* Form */
  form: {
    gap: 20,
    marginBottom: 32,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A2F27',
    letterSpacing: 0.3,
    opacity: 0.75,
  },
  input: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#4A2F2718',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    fontSize: 15,
    color: '#4A2F27',
    shadowColor: '#4A2F27',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },

  /* Primary button */
  primaryBtn: {
    marginTop: 8,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#1A3C34',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A3C34',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryBtnDisabled: {
    backgroundColor: '#4A2F2720',
    shadowOpacity: 0,
    elevation: 0,
  },
  btnPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  primaryBtnText: {
    color: '#F5F1E6',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  primaryBtnTextDisabled: {
    color: '#4A2F2760',
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  feedbackInfo: {
    fontSize: 13,
    color: '#1A3C34',
    lineHeight: 20,
  },
  feedbackError: {
    fontSize: 13,
    color: '#A0442D',
    lineHeight: 20,
  },
  noticeCard: {
    marginTop: -4,
  },

  /* Secondary */
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
  },
  secondaryNote: {
    fontSize: 14,
    color: '#4A2F27',
    opacity: 0.6,
  },
  secondaryLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A3C34',
    textDecorationLine: 'underline',
  },
});
