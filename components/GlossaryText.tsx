
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const C = {
  deepGreen: '#0F3D2E',
  beige: '#F5F1E6',
  terracotta: '#C26A3D',
  cocoa: '#4A2F27',
  white: '#FDFAF5',
};

type GlossaryTextProps = {
  term: string;
  definition: string;
};

export default function GlossaryText({ term, definition }: GlossaryTextProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.term}>{term}</Text>
      <Text style={styles.definition}>{definition}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { marginBottom: 18, backgroundColor: C.white, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  term: { fontSize: 16, fontWeight: '700', color: C.deepGreen, marginBottom: 6 },
  definition: { fontSize: 15, color: C.cocoa, lineHeight: 22 },
});
