import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding</Text>
      <Text style={styles.subtitle}>Ton prochain écran arrive ici.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.linen,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.deepGreen,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.cocoaDark,
    textAlign: 'center',
  },
});