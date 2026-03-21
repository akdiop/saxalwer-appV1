import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type AgeCardProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export default function AgeCard({ label, selected = false, onPress }: AgeCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, selected && styles.cardSelected]}>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74,47,39,0.12)',
    minHeight: 76,
  },
  cardSelected: {
    backgroundColor: '#1A3C34',
    borderColor: '#1A3C34',
  },
  label: {
    color: '#4A2F27',
    fontSize: 18,
    fontWeight: '700',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
});
