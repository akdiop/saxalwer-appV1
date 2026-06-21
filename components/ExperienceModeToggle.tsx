import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/appcontext';

const COLORS = {
  white: '#FFFFFF',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  cocoa: '#4A2F27',
  border: '#E8DCCB',
  card: '#FFF9F1',
};

/**
 * Bascule Mode Guidé / Mode Complet.
 * - Guidé : interface simplifiée, gros boutons, audio mis en avant.
 * - Complet : accès à toutes les rubriques, filtres et détails.
 * Lit/écrit `experienceMode` dans le contexte (persisté en local).
 */
export default function ExperienceModeToggle() {
  const { experienceMode, setExperienceMode } = useApp();

  const options: { value: 'guide' | 'complet'; label: string; icon: 'compass' | 'grid'; hint: string }[] = [
    { value: 'guide', label: 'Mode Guidé', icon: 'compass', hint: 'Pas à pas, gros boutons, audio' },
    { value: 'complet', label: 'Mode Complet', icon: 'grid', hint: 'Toutes les rubriques et filtres' },
  ];

  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const active = experienceMode === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => setExperienceMode(opt.value)}
            style={[styles.card, active && styles.cardActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt.label}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <Feather name={opt.icon} size={18} color={active ? COLORS.white : COLORS.deepGreen} />
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
            <Text style={[styles.hint, active && styles.hintActive]}>{opt.hint}</Text>
            {active ? (
              <View style={styles.check}>
                <Feather name="check" size={12} color={COLORS.white} />
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 8,
  },
  cardActive: { borderColor: COLORS.deepGreen, backgroundColor: '#EFF4F0' },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: COLORS.deepGreen },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.cocoa },
  labelActive: { color: COLORS.deepGreen },
  hint: { fontSize: 11, lineHeight: 15, color: COLORS.terracotta },
  hintActive: { color: COLORS.terracotta },
  check: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
