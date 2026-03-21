import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type GoalCardProps = {
  label: string;
  tagline: string;
  detail?: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  tint: 'sage' | 'sand' | 'rose';
  selected?: boolean;
  onPress: () => void;
};

const TONES = {
  sage: {
    background: '#EDF4F1',
    border: 'rgba(26,60,52,0.10)',
    title: '#1A4A3F',
    text: 'rgba(93,67,55,0.70)',
    detail: 'rgba(93,67,55,0.56)',
    iconBg: 'rgba(26,60,52,0.07)',
    accent: '#1A3C34',
    ring: 'rgba(26,60,52,0.08)',
  },
  sand: {
    background: '#FBF2EA',
    border: 'rgba(166,93,64,0.14)',
    title: '#D27B45',
    text: 'rgba(93,67,55,0.78)',
    detail: 'rgba(210,123,69,0.72)',
    iconBg: 'rgba(210,123,69,0.08)',
    accent: '#D27B45',
    ring: 'rgba(210,123,69,0.10)',
  },
  rose: {
    background: '#F7EFEA',
    border: 'rgba(181,130,110,0.12)',
    title: '#1A4A3F',
    text: 'rgba(93,67,55,0.72)',
    detail: 'rgba(93,67,55,0.54)',
    iconBg: 'rgba(181,130,110,0.08)',
    accent: '#B5826E',
    ring: 'rgba(181,130,110,0.10)',
  },
} as const;

export default function GoalCard({
  label,
  tagline,
  detail,
  icon,
  tint,
  selected = false,
  onPress,
}: GoalCardProps) {
  const tone = TONES[tint];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: tone.background,
          borderColor: selected ? tone.accent : tone.border,
        },
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.leftCol}>
        <View style={[styles.iconWrap, { backgroundColor: tone.iconBg }]}>
          <Feather name={icon} size={28} color={tone.accent} />
        </View>
      </View>

      <View style={styles.contentCol}>
        <Text style={[styles.label, { color: tone.title }]}>{label}</Text>
        <Text style={[styles.tagline, { color: tone.text }]}>{tagline}</Text>
        {detail ? <Text style={[styles.detail, { color: tone.detail }]}>{detail}</Text> : null}
      </View>

      <View style={styles.rightCol}>
        <View
          style={[
            styles.checkCircle,
            { borderColor: selected ? tone.accent : 'rgba(93,67,55,0.20)' },
            selected && { backgroundColor: tone.accent },
          ]}
        >
          {selected ? <Feather name="check" size={18} color="#FFFFFF" /> : null}
        </View>
      </View>

      <View style={[styles.ringLarge, { borderColor: tone.ring }]} />
      <View style={[styles.ringSmall, { borderColor: tone.ring }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 146,
    borderRadius: 28,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#C9B9A2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 5,
  },
  cardSelected: {
    shadowOpacity: 0.2,
  },
  cardPressed: {
    transform: [{ scale: 0.987 }],
  },
  leftCol: {
    paddingTop: 6,
    marginRight: 16,
  },
  iconWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCol: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 14,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: 4,
  },
  checkCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  label: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  detail: {
    marginTop: 10,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ringLarge: {
    position: 'absolute',
    right: -18,
    top: 10,
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1.2,
  },
  ringSmall: {
    position: 'absolute',
    right: 12,
    top: 40,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
  },
});
