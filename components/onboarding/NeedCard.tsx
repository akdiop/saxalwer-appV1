import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type NeedCardProps = {
  label: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  tint: 'sage' | 'sand';
  selected?: boolean;
  onPress: () => void;
};

const TONES = {
  sage: {
    background: '#EDF4F1',
    border: 'rgba(26,60,52,0.10)',
    iconBg: 'rgba(26,60,52,0.06)',
    icon: '#6A4B3D',
    title: '#1A4A3F',
    subtitle: 'rgba(97,79,70,0.48)',
    ring: 'rgba(26,60,52,0.08)',
    selected: '#1A3C34',
  },
  sand: {
    background: '#FAF0E8',
    border: 'rgba(166,93,64,0.10)',
    iconBg: 'rgba(166,93,64,0.06)',
    icon: '#6A4B3D',
    title: '#1A4A3F',
    subtitle: 'rgba(97,79,70,0.48)',
    ring: 'rgba(166,93,64,0.08)',
    selected: '#A65D40',
  },
} as const;

export default function NeedCard({
  label,
  subtitle,
  icon,
  tint,
  selected = false,
  onPress,
}: NeedCardProps) {
  const tone = TONES[tint];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: tone.background,
          borderColor: selected ? tone.selected : tone.border,
        },
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: tone.iconBg }]}>
          <Feather name={icon} size={24} color={tone.icon} />
        </View>

        <View
          style={[
            styles.checkCircle,
            { borderColor: selected ? tone.selected : 'rgba(97,79,70,0.22)' },
            selected && { backgroundColor: tone.selected },
          ]}
        >
          {selected ? <View style={styles.checkInner} /> : null}
        </View>
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.label, { color: tone.title }]}>{label}</Text>
        <Text style={[styles.subtitle, { color: tone.subtitle }]}>{subtitle}</Text>
      </View>

      <View style={[styles.ringLarge, { borderColor: tone.ring }]} />
      <View style={[styles.ringSmall, { borderColor: tone.ring }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 146,
    borderRadius: 26,
    borderWidth: 1.5,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 20,
    overflow: 'hidden',
    shadowColor: '#C9B9A2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3,
  },
  cardSelected: {
    shadowOpacity: 0.18,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  checkInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  textWrap: {
    marginTop: 18,
    paddingRight: 42,
    gap: 6,
  },
  label: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  ringLarge: {
    position: 'absolute',
    right: -14,
    bottom: -18,
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.2,
  },
  ringSmall: {
    position: 'absolute',
    right: 6,
    bottom: 2,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
  },
});
