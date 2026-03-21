import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <BackButton />

        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCard}>
            <Image
              source={require('../assets/images/logo-saxalwer.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.logoAccent} />
        </View>

        {/* Text block */}
        <View style={styles.textBlock}>
          <Text style={styles.title}>SAXALWÉR</Text>
          <Text style={styles.subtitle}>Un sanctuaire de douceur pour ta santé.</Text>
          <Text style={styles.caption}>Écoute le rythme de ton corps.</Text>
        </View>

        {/* CTA */}
        <View style={styles.bottom}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => router.push('/login' as never)}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Entrer dans l&apos;espace</Text>
          </Pressable>

          <Text style={styles.footer}>Sagesse & Science · Confidentialité Absolue</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F1E6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /* Logo */
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoCard: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A3C34',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  logo: {
    width: 110,
    height: 110,
  },
  logoAccent: {
    width: 40,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#A65D40',
    marginTop: 18,
    opacity: 0.5,
  },

  /* Text */
  textBlock: {
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 6,
    color: '#1A3C34',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4A2F27',
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.9,
    maxWidth: 280,
  },
  caption: {
    fontSize: 13,
    color: '#4A2F27',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.6,
    letterSpacing: 0.3,
  },

  /* Bottom */
  bottom: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: '#1A3C34',
    alignItems: 'center',
    shadowColor: '#1A3C34',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 7,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#F5F1E6',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  footer: {
    fontSize: 10,
    color: '#4A2F27',
    opacity: 0.4,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
});
