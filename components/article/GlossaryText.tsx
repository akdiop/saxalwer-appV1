import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';

import { GLOSSARY, SORTED_TERMS } from '../../data/glossary';

const C = {
  deepGreen: '#0F3D2E',
  beige: '#F5F1E6',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  white: '#FDFAF5',
  border: 'rgba(181,98,42,0.22)',
  overlay: 'rgba(15,61,46,0.26)',
};

type GlossaryCardProps = {
  term: string;
  definition: string;
};

type GlossaryInlineProps = {
  text: string;
  language?: 'fr' | 'wo';
  style?: StyleProp<TextStyle>;
};

type GlossaryTextProps = GlossaryCardProps | GlossaryInlineProps;

type MatchPart =
  | { type: 'text'; value: string }
  | { type: 'term'; value: string; lookupKey: string };

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildParts(text: string): MatchPart[] {
  const matches: { start: number; end: number; raw: string; key: string }[] = [];

  SORTED_TERMS.forEach((term) => {
    const regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi');
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const overlaps = matches.some((item) => !(end <= item.start || start >= item.end));

      if (!overlaps) {
        matches.push({ start, end, raw: match[0], key: term });
      }
    }
  });

  matches.sort((a, b) => a.start - b.start);

  if (matches.length === 0) {
    return [{ type: 'text', value: text }];
  }

  const parts: MatchPart[] = [];
  let cursor = 0;

  matches.forEach((match) => {
    if (cursor < match.start) {
      parts.push({ type: 'text', value: text.slice(cursor, match.start) });
    }

    parts.push({
      type: 'term',
      value: match.raw,
      lookupKey: match.key,
    });

    cursor = match.end;
  });

  if (cursor < text.length) {
    parts.push({ type: 'text', value: text.slice(cursor) });
  }

  return parts;
}

export function GlossaryText(props: GlossaryTextProps) {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const parts = useMemo(
    () => ('text' in props ? buildParts(props.text) : []),
    [props]
  );

  if ('text' in props) {
    const language = props.language ?? 'fr';
    const activeEntry = activeTerm ? GLOSSARY[activeTerm] : null;

    return (
      <>
        <Text style={props.style}>
          {parts.map((part, index) => {
            if (part.type === 'text') {
              return <Text key={`text-${index}`}>{part.value}</Text>;
            }

            return (
              <React.Fragment key={`term-${part.lookupKey}-${index}`}>
                <Text>{part.value}</Text>
                <Text
                  accessibilityRole="button"
                  onPress={() => setActiveTerm(part.lookupKey)}
                  style={styles.inlineQuestion}
                >
                  {' '}?{' '}
                </Text>
              </React.Fragment>
            );
          })}
        </Text>

        <Modal
          visible={!!activeEntry}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveTerm(null)}
        >
          <Pressable style={styles.overlay} onPress={() => setActiveTerm(null)}>
            <Pressable style={styles.modalCard} onPress={() => undefined}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalEyebrow}>Glossaire</Text>
                  <Text style={styles.modalTerm}>{activeTerm}</Text>
                </View>
                <Pressable onPress={() => setActiveTerm(null)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>×</Text>
                </Pressable>
              </View>

              <Text style={styles.modalDefinition}>
                {language === 'wo' ? activeEntry?.wo : activeEntry?.fr}
              </Text>
            </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.term}>{props.term}</Text>
      <Text style={styles.definition}>{props.definition}</Text>
    </View>
  );
}

export default GlossaryText;

const styles = StyleSheet.create({
  root: {
    marginBottom: 18,
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  term: { fontSize: 16, fontWeight: '700', color: C.deepGreen, marginBottom: 6 },
  definition: { fontSize: 15, color: C.cocoa, lineHeight: 22 },
  inlineQuestion: {
    color: C.deepGreen,
    backgroundColor: 'rgba(26,60,52,0.06)',
    borderColor: C.border,
    borderWidth: 1,
    fontSize: 11,
    fontWeight: '700',
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: C.overlay,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  modalEyebrow: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: C.copper,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalTerm: {
    fontSize: 20,
    lineHeight: 24,
    color: C.deepGreen,
    fontWeight: '800',
  },
  modalDefinition: {
    fontSize: 14,
    lineHeight: 22,
    color: C.cocoa,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.beige,
  },
  closeButtonText: {
    color: C.cocoa,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
  },
});
