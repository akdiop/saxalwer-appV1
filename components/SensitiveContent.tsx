import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type SensitiveContentProps = {
  children: React.ReactNode;
  masked?: boolean;
  label?: string;
  actionLabel?: string;
  resetKey?: string;
  style?: StyleProp<ViewStyle>;
  strength?: 'soft' | 'strong';
};

export default function SensitiveContent({
  children,
  masked = false,
  label = 'Contenu flouté',
  actionLabel = 'Afficher',
  resetKey,
  style,
  strength = 'soft',
}: SensitiveContentProps) {
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    if (!masked) {
      setRevealed(false);
    }
  }, [masked]);

  React.useEffect(() => {
    if (masked) {
      setRevealed(false);
    }
  }, [masked, resetKey]);

  const isMasked = masked && !revealed;
  const isStrong = strength === 'strong';

  return (
    <View style={style}>
      <View
        style={[
          isMasked ? styles.maskedContent : undefined,
          isMasked && isStrong ? styles.maskedContentStrong : undefined,
        ]}
      >
        {children}
      </View>
      {isMasked ? (
        <View style={[styles.overlay, isStrong ? styles.overlayStrong : styles.overlaySoft]}>
          {isStrong ? (
            <View pointerEvents="none" style={styles.privacyPattern}>
              <View style={styles.privacyPatternLine} />
              <View style={styles.privacyPatternLine} />
              <View style={styles.privacyPatternLine} />
            </View>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={() => setRevealed(true)}
            style={({ pressed }) => [
              styles.pill,
              isStrong ? styles.pillStrong : styles.pillSoft,
              pressed && styles.pillPressed,
            ]}
          >
            <Feather color="#1A3C34" name="eye-off" size={14} />
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.action}>{actionLabel}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  maskedContent: {
    opacity: 0.24,
  },
  maskedContentStrong: {
    opacity: 0.08,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlaySoft: {
    backgroundColor: 'transparent',
  },
  overlayStrong: {
    backgroundColor: 'rgba(245,241,230,0.78)',
    paddingHorizontal: 18,
  },
  privacyPattern: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    gap: 18,
    opacity: 0.65,
  },
  privacyPatternLine: {
    height: 14,
    marginHorizontal: 24,
    borderRadius: 999,
    backgroundColor: 'rgba(74,47,39,0.08)',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillSoft: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderColor: 'rgba(26,60,52,0.08)',
  },
  pillStrong: {
    backgroundColor: 'rgba(255,253,249,0.98)',
    borderColor: 'rgba(26,60,52,0.14)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  pillPressed: {
    opacity: 0.82,
  },
  label: {
    color: '#4A2F27',
    fontSize: 13,
    fontWeight: '700',
  },
  action: {
    color: 'rgba(26,60,52,0.68)',
    fontSize: 12,
    fontWeight: '600',
  },
});
