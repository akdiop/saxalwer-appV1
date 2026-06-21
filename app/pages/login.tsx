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
import { DEFAULT_COMMUNITY_PROFILE } from '../../data/community';
import {
  ensureCommunityProfile,
  generateCommunityPseudonym,
  saveCommunityProfile,
} from '../../utils/communityApi';

export default function LoginScreen() {
  const router = useRouter();
  const [communityProfile, setCommunityProfile] = useState(DEFAULT_COMMUNITY_PROFILE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    ensureCommunityProfile()
      .then((profile) => {
        if (active) {
          setCommunityProfile(profile);
        }
      })
      .catch(() => {
        if (active) {
          setCommunityProfile(DEFAULT_COMMUNITY_PROFILE);
          setErrorMessage('Impossible de charger ton pseudonyme pour le moment.');
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleGenerate = () => {
    setCommunityProfile((prev) => ({
      ...prev,
      pseudonym: generateCommunityPseudonym(),
    }));
    setErrorMessage(null);
  };

  const handleContinue = async () => {
    if (isSaving) {
      return;
    }

    setErrorMessage(null);
    setIsSaving(true);

    try {
      const nextProfile = await saveCommunityProfile({
        ...communityProfile,
        pseudonym: communityProfile.pseudonym.trim() || generateCommunityPseudonym(),
      });

      setCommunityProfile(nextProfile);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/communaute' as never);
      }
    } catch {
      setErrorMessage("Impossible d'enregistrer ton pseudonyme pour le moment.");
    } finally {
      setIsSaving(false);
    }
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

          <View style={styles.header}>
            <Text style={styles.title}>Pseudonyme</Text>
            <Text style={styles.subtitle}>
              Aucun compte, aucun email. Choisis simplement le pseudo que tu veux
              utiliser dans la communauté.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Ton pseudonyme</Text>
              <TextInput
                style={styles.input}
                value={communityProfile.pseudonym}
                onChangeText={(value) =>
                  setCommunityProfile((prev) => ({
                    ...prev,
                    pseudonym: value,
                  }))
                }
                placeholder="Ex: BaobabCalme247"
                placeholderTextColor="#4A2F2745"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {isLoading ? (
              <View style={styles.feedbackRow}>
                <ActivityIndicator size="small" color="#1A3C34" />
                <Text style={styles.feedbackInfo}>Chargement du pseudonyme...</Text>
              </View>
            ) : null}

            <NoticeCard
              title="Confidentialité locale"
              description="Ton pseudo est conservé sur cet appareil et sert uniquement à t'identifier dans la communauté."
              iconName="shield-checkmark-outline"
              style={styles.noticeCard}
            />

            {errorMessage ? (
              <Text style={styles.feedbackError}>{errorMessage}</Text>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                (isLoading || isSaving) && styles.primaryBtnDisabled,
                pressed && !isLoading && !isSaving && styles.btnPressed,
              ]}
              onPress={handleContinue}
              disabled={isLoading || isSaving}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.primaryBtnText,
                  (isLoading || isSaving) && styles.primaryBtnTextDisabled,
                ]}
              >
                {isSaving ? 'Enregistrement...' : 'Continuer'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleGenerate}
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && !isSaving && styles.btnPressed,
              ]}
              disabled={isSaving}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryBtnText}>Générer un autre pseudo</Text>
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
    maxWidth: 320,
  },
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
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  feedbackInfo: {
    fontSize: 14,
    color: '#1A3C34',
  },
  feedbackError: {
    fontSize: 13,
    color: '#A0442D',
    lineHeight: 20,
  },
  noticeCard: {
    marginTop: -4,
  },
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
  secondaryBtn: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#1A3C3422',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A3C34',
  },
});
