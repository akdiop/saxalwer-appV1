import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type SensitiveContentProps = {
  children: React.ReactNode;
  masked?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export default function SensitiveContent({
  children,
  masked = false,
  label = 'Contenu flouté',
  style,
}: SensitiveContentProps) {
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    if (!masked) {
      setRevealed(false);
    }
  }, [masked]);

  const isMasked = masked && !revealed;

  return (
    <View style={style}>
      <View style={isMasked ? styles.maskedContent : undefined}>{children}</View>
      {isMasked ? (
        <View style={styles.overlay}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setRevealed(true)}
            style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
          >
            <Feather color="#1A3C34" name="eye-off" size={14} />
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.action}>Afficher</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  maskedContent: {
    opacity: 0.18,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.08)',
  },
  pillPressed: {
    opacity: 0.82,
  },
  label: {
    color: '#1A3C34',
    fontSize: 13,
    fontWeight: '700',
  },
  action: {
    color: 'rgba(26,60,52,0.68)',
    fontSize: 12,
    fontWeight: '600',
  },
});
