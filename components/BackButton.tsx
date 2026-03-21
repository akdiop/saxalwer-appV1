import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Précédent"
    >
      <Text style={styles.arrow}>{'<'}</Text>
      <Text style={styles.label}>Précédent</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 4,
  },
  arrow: {
    fontSize: 28,
    lineHeight: 30,
    color: '#1A3C34',
    fontWeight: '300',
  },
  label: {
    fontSize: 15,
    color: '#1A3C34',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  pressed: {
    opacity: 0.5,
  },
});
