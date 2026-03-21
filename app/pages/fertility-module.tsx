import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';

export default function FertilityModuleScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.safe}>
        <View style={styles.backRow}>
          <BackButton />
        </View>
        <View style={styles.container}>
          <View style={styles.accentBar} />
          <Text style={styles.title}>Fertilité & bien-être</Text>
          <Text style={styles.subtitle}>
            Un accompagnement doux pour ton équilibre hormonal et ton bien-être global.
          </Text>
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
  backRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 16,
  },
  accentBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4AF37',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A3C34',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 15,
    color: '#4A2F27',
    textAlign: 'center',
    lineHeight: 23,
    opacity: 0.75,
  },
});
