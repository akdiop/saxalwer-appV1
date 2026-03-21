import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  navigation: any;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SaxalWér</Text>
      <Text style={styles.subtitle}>
        Un sanctuaire de douceur pour ta santé.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Onboarding')}
      >
        <Text style={styles.buttonText}>Entrer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.beige,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.deepGreen,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.cocoaDark,
    textAlign: 'center',
    marginBottom: 28,
  },
  button: {
    backgroundColor: COLORS.deepGreen,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
  },
  buttonText: {
    color: COLORS.beige,
    fontSize: 16,
    fontWeight: '600',
  },
});