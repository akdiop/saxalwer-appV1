import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
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

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

            {/* Primary button */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.btnPressed,
              ]}
              onPress={() => router.push('/profile-selection' as never)}
              accessibilityRole="button"
            >
              <Text style={styles.primaryBtnText}>Créer mon compte</Text>
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
