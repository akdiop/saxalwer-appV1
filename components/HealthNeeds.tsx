
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const C = {
  deepGreen: '#0F3D2E',
  green2: '#1A3C34',
  beige: '#F5F1E6',
  beige2: '#EDE5D0',
  terracotta: '#C26A3D',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  muted: 'rgba(15,61,46,0.08)',
};

// SVG Motifs
function ProtectionRings() {
  return (
    <Svg style={styles.rings} width={340} height={340} viewBox="0 0 340 340" fill="none">
      <Circle cx={170} cy={170} r={160} stroke={C.deepGreen} strokeWidth={1} />
      <Circle cx={170} cy={170} r={128} stroke={C.deepGreen} strokeWidth={0.8} />
      <Circle cx={170} cy={170} r={96} stroke={C.deepGreen} strokeWidth={0.6} />
      <Circle cx={170} cy={170} r={64} stroke={C.deepGreen} strokeWidth={0.5} />
      <Circle cx={170} cy={170} r={32} stroke={C.deepGreen} strokeWidth={0.4} />
    </Svg>
  );
}
function CrescentAccent({ x, y, size, rotate, op }: { x: number; y: number; size: number; rotate: number; op: number }) {
  return (
    <Svg style={[styles.crescent, { left: x, top: y, opacity: op, transform: [{ rotate: `${rotate}deg` }] }]} width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M20 3C11 3 4 10 4 20s7 17 16 17C12 33 7 26.5 7 20S12 7 20 3Z" fill={C.deepGreen} />
    </Svg>
  );
}
function DotField() {
  return (
    <Svg style={styles.dotfield} width={120} height={120} viewBox="0 0 120 120" fill={C.cocoa}>
      {[0,1,2,3,4].map(row =>
        [0,1,2,3,4].map(col => (
          <Circle key={`${row}-${col}`} cx={col*24+12} cy={row*24+12} r={2.5} fill={C.cocoa} />
        ))
      )}
    </Svg>
  );
}

// Card icons (SVG)
function IconCycle({ color }: { color: string }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path d="M16 5a11 11 0 1 1-7.8 3.2" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 2l0.2 6.4L14.6 7" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={16} cy={16} r={2.5} fill={color} />
    </Svg>
  );
}
function IconDouleurs({ color }: { color: string }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path d="M16 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 28v-8a6 6 0 0 1 12 0v8" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 19h3l2-4 3 8 2-5 2 3 1-2h4" stroke={color} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconContraception({ color }: { color: string }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path d="M16 3l10 4v8c0 6-4 10-10 13C10 25 6 21 6 15V7l10-4z" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={16} cy={15} r={4} stroke={color} strokeWidth={1.6} />
      <Circle cx={16} cy={15} r={1.5} fill={color} />
    </Svg>
  );
}
function IconIST({ color }: { color: string }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path d="M4 16s4-8 12-8 12 8 12 8-4 8-12 8-12-8-12-8z" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={16} cy={16} r={3.5} stroke={color} strokeWidth={1.6} />
      <Circle cx={16} cy={16} r={1.2} fill={color} />
      <Path d="M9 10.5 C11 7 21 7 23 10.5" stroke={color} strokeDasharray="1.5 2" strokeWidth={1.2} />
    </Svg>
  );
}
function IconFertilite({ color }: { color: string }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path d="M16 28V15" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 15c0 0-6-1-7-7 4 0 7 4 7 7z" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 15c0 0 6-1 7-7-4 0-7 4-7 7z" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={16} cy={10} r={4} stroke={color} strokeWidth={1.6} />
      <Path d="M16 6 C14 4 12 5 13 7" stroke={color} strokeWidth={1.2} />
      <Path d="M16 6 C18 4 20 5 19 7" stroke={color} strokeWidth={1.2} />
      <Circle cx={16} cy={10} r={1.5} fill={color} />
    </Svg>
  );
}
function IconUrgence({ color }: { color: string }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path d="M16 3C10 3 6 8 6 14c0 4 2 7 5 9l5 6 5-6c3-2 5-5 5-9 0-6-4-11-10-11z" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 14v-4a1 1 0 0 1 2 0v3" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
      <Path d="M14 13v-1.5a1 1 0 0 1 2 0v3" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
      <Path d="M16 14.5V13a1 1 0 0 1 2 0v3" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
      <Path d="M18 15v0.5a4 4 0 0 1-4 4h-.5" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
    </Svg>
  );
}
function IconMenopause({ color }: { color: string }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Circle cx={16} cy={16} r={6} stroke={color} strokeWidth={1.6} />
      <Circle cx={16} cy={16} r={2} fill={color} />
      <Path d="M16 6V3" stroke={color} strokeWidth={1.6} />
      <Path d="M16 29V26" stroke={color} strokeWidth={1.6} />
      <Path d="M6 16H3" stroke={color} strokeWidth={1.6} />
      <Path d="M29 16H26" stroke={color} strokeWidth={1.6} />
      <Path d="M9 9L7 7" stroke={color} strokeWidth={1.3} />
      <Path d="M25 25L23 23" stroke={color} strokeWidth={1.3} />
      <Path d="M23 9L25 7" stroke={color} strokeWidth={1.3} />
      <Path d="M7 25L9 23" stroke={color} strokeWidth={1.3} />
      <Path d="M6 28 Q10 24 16 28 Q22 32 26 28" stroke={color} strokeWidth={1.2} />
    </Svg>
  );
}

const needs = [
  { id: 'cycle', label: 'Cycle & Règles', sub: 'Suivi, irrégularités, douleurs', icon: IconCycle, accent: C.deepGreen, bg: '#EFF5F2' },
  { id: 'douleurs', label: 'Douleurs & Symptômes', sub: 'Corps, inconfort, signaux', icon: IconDouleurs, accent: C.copper, bg: '#FAF2EA' },
  { id: 'contraception', label: 'Contraception', sub: 'Méthodes, conseils, choix', icon: IconContraception, accent: C.green2, bg: '#EFF5F2' },
  { id: 'ist', label: 'Prévention IST', sub: 'Protection, dépistage', icon: IconIST, accent: C.cocoa, bg: '#F5EEE8' },
  { id: 'fertilite', label: 'Fertilité', sub: "Désir d'enfant, ovulation", icon: IconFertilite, accent: C.terracotta, bg: '#FAF2EA' },
  { id: 'urgence', label: 'Protection & Urgence', sub: 'Aide, ressources, sécurité', icon: IconUrgence, accent: C.deepGreen, bg: '#EFF5F2' },
  { id: 'menopause', label: 'Ménopause & Transition', sub: 'Périménopause, bouffées, bien-être', icon: IconMenopause, accent: '#8B6F5A', bg: '#F5EEE8' },
];

type HealthNeedsProps = {
  onFinish: (needs: string[]) => void;
};

export function HealthNeeds({ onFinish }: HealthNeedsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [primary, setPrimary] = useState<string | null>(null);
  const [secondary, setSecondary] = useState<string | null>(null);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (primary === id) setPrimary(null);
        if (secondary === id) setSecondary(null);
      } else {
        next.add(id);
        if (!primary) setPrimary(id);
        else if (!secondary && primary !== id) setSecondary(id);
      }
      return next;
    });
  };

  const isPrimary = (id: string) => primary === id;
  const isSecondary = (id: string) => secondary === id;
  const canContinue = selected.size > 0 && primary !== null;

  return (
    <View style={styles.root}>
      <ProtectionRings />
      <CrescentAccent x={-12} y={120} size={56} rotate={15} op={0.06} />
      <CrescentAccent x={320} y={68} size={38} rotate={-40} op={0.05} />
      <CrescentAccent x={40} y={295} size={44} rotate={50} op={0.04} />
      <DotField />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.stepRow}>
          {[0,1,2].map(i => (
            <View key={i} style={[styles.stepDot, { backgroundColor: i < 2 ? C.deepGreen : C.terracotta, opacity: i < 2 ? 1 : 0.5 }]} />
          ))}
          <Text style={styles.stepText}>Étape 2 / 3</Text>
        </View>
        <Text style={styles.title}>Quel est ton besoin{"\n"}aujourd'hui&nbsp;?</Text>
        <Text style={styles.desc}>
          {selected.size === 0
            ? "Sélectionne tous les besoins qui te concernent. Le premier deviendra ton objectif principal."
            : selected.size === 1
              ? "Tu peux ajouter d'autres besoins. Le deuxième deviendra ton objectif secondaire."
              : `Tu as sélectionné ${selected.size} besoins${primary ? ' dont 1 principal' : ''}${secondary ? ' et 1 secondaire' : ''}.`
          }
        </Text>
        <View style={styles.grid}>
          {needs.map((need, i) => {
            const active = selected.has(need.id);
            const Icon = need.icon;
            return (
              <Pressable
                key={need.id}
                style={({ pressed }) => [
                  styles.card,
                  { backgroundColor: active
                      ? need.accent + '1A'
                      : need.bg,
                    borderColor: active ? need.accent : 'rgba(15,61,46,0.07)',
                  },
                  pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
                ]}
                onPress={() => toggle(need.id)}
              >
                {/* Selection dot */}
                <View style={[styles.selectDot, { borderColor: active ? need.accent : 'rgba(15,61,46,0.18)', backgroundColor: active ? need.accent : 'transparent' }]}> 
                  {active && (
                    <Svg width={8} height={8} viewBox="0 0 8 8">
                      <Path d="M1 4 L3 6.5 L7 1.5" stroke="white" strokeWidth={1.8} strokeLinecap="round" fill="none" />
                    </Svg>
                  )}
                </View>
                {/* Badge for primary/secondary */}
                {isPrimary(need.id) && (
                  <View style={[styles.badge, { backgroundColor: need.accent }]}><Text style={styles.badgeText}>Principal</Text></View>
                )}
                {isSecondary(need.id) && (
                  <View style={[styles.badge, { backgroundColor: need.accent + '80' }]}><Text style={styles.badgeText}>Secondaire</Text></View>
                )}
                {/* Subtle arc watermark */}
                <Svg style={styles.cardArc} width={70} height={70} viewBox="0 0 70 70" fill="none">
                  <Circle cx={35} cy={35} r={30} stroke={need.accent} strokeWidth={1.2} opacity={0.06} />
                  <Circle cx={35} cy={35} r={20} stroke={need.accent} strokeWidth={0.8} opacity={0.06} />
                </Svg>
                {/* Icon */}
                <View style={[styles.iconCircle, { backgroundColor: active ? need.accent + '18' : 'rgba(15,61,46,0.05)' }]}> <Icon color={active ? need.accent : C.cocoa} /> </View>
                {/* Text */}
                <View>
                  <Text style={[styles.cardLabel, { color: active ? need.accent : C.deepGreen }]}>{need.label}</Text>
                  <Text style={[styles.cardSub, { opacity: active ? 0.65 : 0.38 }]}>{need.sub}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.privacyRow}>
          <Feather name="lock" size={11} color={C.cocoa} style={{ opacity: 0.4 }} />
          <Text style={styles.privacyText}>Tes réponses restent confidentielles.</Text>
        </View>
      </ScrollView>
      <View style={styles.ctaRow}>
        <Pressable
          style={({ pressed }) => [
            styles.ctaBtn,
            { opacity: canContinue ? 1 : 0.4 },
            pressed && canContinue && { opacity: 0.85, transform: [{ scale: 0.97 }] },
          ]}
          disabled={!canContinue}
          onPress={() => canContinue && onFinish(Array.from(selected))}
        >
          <Text style={styles.ctaText}>
            {canContinue
              ? `Continuer${selected.size > 1 ? ` (${selected.size} besoins)` : ''}`
              : 'Choisis au moins un besoin'}
          </Text>
          {canContinue && <Feather name="arrow-right" size={17} color={C.beige} style={{ marginLeft: 8 }} />}
        </Pressable>
      </View>
    </View>
  );
}

export default HealthNeeds;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.beige,
  },
  rings: {
    position: 'absolute', top: '5%', right: '-15%', opacity: 0.045, zIndex: 0,
  },
  crescent: {
    position: 'absolute', zIndex: 0,
  },
  dotfield: {
    position: 'absolute', bottom: '12%', left: '4%', opacity: 0.05, zIndex: 0,
  },
  scroll: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexGrow: 1,
  },
  stepRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 28,
  },
  stepDot: {
    width: 24, height: 4, borderRadius: 99, marginRight: 4,
  },
  stepText: {
    fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: C.cocoa, opacity: 0.5,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'CormorantGaramond-Bold' : 'serif',
    fontSize: 30, fontWeight: '500', color: C.deepGreen, lineHeight: 36, letterSpacing: -0.2, marginBottom: 8,
  },
  desc: {
    fontSize: 14, color: C.cocoa, opacity: 0.55, lineHeight: 22, marginBottom: 24,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 16,
  },
  card: {
    width: '48%', minHeight: 130, borderRadius: 20, borderWidth: 1.5, padding: 16, marginBottom: 12,
    alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
  },
  selectDot: {
    position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  badgeText: {
    fontSize: 11, fontWeight: '600', color: C.beige, letterSpacing: 0.2,
  },
  cardArc: {
    position: 'absolute', right: -14, bottom: -14,
  },
  iconCircle: {
    width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  cardLabel: {
    fontFamily: Platform.OS === 'ios' ? 'CormorantGaramond-Bold' : 'serif', fontSize: 17, fontWeight: '600', lineHeight: 22, marginBottom: 3,
  },
  cardSub: {
    fontSize: 12, color: C.cocoa, lineHeight: 16,
  },
  privacyRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18, marginBottom: 8,
  },
  privacyText: {
    fontSize: 12, color: C.cocoa, opacity: 0.4, letterSpacing: 0.2, fontStyle: 'italic', marginLeft: 4,
  },
  ctaRow: {
    paddingHorizontal: 20, paddingBottom: 40, backgroundColor: C.beige,
  },
  ctaBtn: {
    width: '100%', backgroundColor: C.deepGreen, borderRadius: 14, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  ctaText: {
    color: C.beige, fontSize: 17, fontWeight: '500', letterSpacing: 0.2,
  },
});
