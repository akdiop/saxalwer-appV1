import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

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
  return (
    <View style={style}>
      <View style={masked ? styles.maskedContent : undefined}>{children}</View>
      {masked ? (
        <View pointerEvents="none" style={styles.overlay}>
          <View style={styles.pill}>
            <Feather color="#1A3C34" name="eye-off" size={14} />
            <Text style={styles.label}>{label}</Text>
          </View>
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
  label: {
    color: '#1A3C34',
    fontSize: 13,
    fontWeight: '700',
  },
});
