import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import SymptomLogger from '../../components/SymptomLogger';
import type { SymptomEntry } from '../../context/appcontext';
import { useApp } from '../../context/appcontext';
import { usePredictiveNotifications } from '../../hooks/usepredictivenotification';

const BASE = {
  beige: '#F5F1E6',
  deepGreen: '#0F3D2E',
  terracotta: '#C26A3D',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  gold: '#D4AF37',
};

type TrackerView = 'cycle' | 'journal' | 'pilule';

const MOODS = [
  { id: 'joyful', label: 'Joyeuse', labelWo: 'Neex', icon: 'sun', color: BASE.gold },
  { id: 'calm', label: 'Calme', labelWo: 'Dal', icon: 'moon', color: BASE.deepGreen },
  { id: 'neutral', label: 'Neutre', labelWo: 'Normal', icon: 'minus-circle', color: BASE.copper },
  { id: 'difficult', label: 'Difficile', labelWo: 'Metti', icon: 'frown', color: BASE.terracotta },
];

const FLOW = [
  { value: 0, fr: 'Aucun', wo: 'Amul' },
  { value: 1, fr: 'Leger', wo: 'Tuuti' },
  { value: 2, fr: 'Moyen', wo: 'Diggante' },
  { value: 3, fr: 'Abondant', wo: 'Bari' },
];

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function diffDays(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 86400000);
}

export default function TrackerScreen() {
  const router = useRouter();
  const { cycleData, updateCycleData, language, discreteMode } = useApp();
  usePredictiveNotifications();

  const wo = language === 'wo';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view, setView] = useState<TrackerView>('cycle');
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<number | null>(null);
  const [showSymptomLogger, setShowSymptomLogger] = useState(false);
  const [showPeriodModal, setShowPeriodModal] = useState(false);

  const cd = cycleData;
  const cycleLength = cd.cycleLength || 28;
  const periodLength = cd.periodLength || 5;
  const lastPeriod = cd.lastPeriodDate ? new Date(cd.lastPeriodDate) : null;
  const cycleDay = lastPeriod ? Math.max(1, diffDays(today, lastPeriod) + 1) : null;

  const selectedDateKey = toDateKey(new Date(today.getFullYear(), today.getMonth(), selectedDay));

  const pillStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(today.getTime() - i * 86400000);
      const key = toDateKey(d);
      if (cd.pillLogs?.[key]?.taken) streak += 1;
      else if (i > 0) break;
    }
    return streak;
  }, [cd.pillLogs, today]);

  const saveJournal = () => {
    setShowSymptomLogger(true);
  };

  const onSymptomSave = (symptoms: SymptomEntry[], notes?: string) => {
    const logs = { ...(cd.dailyLogs || {}) };
    logs[selectedDateKey] = {
      ...logs[selectedDateKey],
      mood: selectedMood || undefined,
      flow: selectedFlow,
      symptoms,
      notes,
    };
    updateCycleData({ dailyLogs: logs });
    setShowSymptomLogger(false);
  };

  const togglePill = (key: string) => {
    const logs = { ...(cd.pillLogs || {}) };
    if (logs[key]) {
      delete logs[key];
    } else {
      logs[key] = { taken: true, time: Date.now() };
    }
    updateCycleData({ pillLogs: logs });
  };

  const weekPills = useMemo(() => {
    const rows: { key: string; label: string; day: number }[] = [];
    const dayNames = wo ? ['Dib', 'Alt', 'Tal', 'Ala', 'Alx', 'Ajj', 'Gaa'] : ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 86400000);
      rows.push({ key: toDateKey(d), day: d.getDate(), label: dayNames[d.getDay()] });
    }
    return rows;
  }, [today, wo]);

  const views: TrackerView[] = cd.pillTracking ? ['cycle', 'journal', 'pilule'] : ['cycle', 'journal'];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Pressable style={styles.back} onPress={() => router.back()}>
            <Feather name="chevron-left" size={20} color={BASE.deepGreen} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{wo ? 'Suivi Cycle' : 'Suivi du cycle'}</Text>
            <Text style={styles.subtitle}>{wo ? 'Sa boussole bu biir' : 'Ta boussole interieure'}</Text>
          </View>
        </View>

        <View style={styles.segment}>
          {views.map((v) => (
            <Pressable
              key={v}
              onPress={() => setView(v)}
              style={[styles.segmentBtn, view === v && styles.segmentBtnActive]}
            >
              <Text style={[styles.segmentText, view === v && styles.segmentTextActive]}>
                {v === 'cycle' ? (wo ? 'Sama cycle' : 'Mon cycle') : v === 'journal' ? 'Journal' : 'Pilule'}
              </Text>
            </Pressable>
          ))}
        </View>

        {view === 'cycle' ? (
          <View style={[styles.card, discreteMode && styles.blurred]}>
            <Text style={styles.cardTitle}>{wo ? 'Resume du cycle' : 'Resume du cycle'}</Text>
            <Text style={styles.cardLine}>{wo ? 'Bessu tey:' : 'Jour actuel :'} {cycleDay ?? '-'}</Text>
            <Text style={styles.cardLine}>{wo ? 'Durée cycle:' : 'Duree cycle :'} {cycleLength} {wo ? 'fan' : 'jours'}</Text>
            <Text style={styles.cardLine}>{wo ? 'Durée règles:' : 'Duree regles :'} {periodLength} {wo ? 'fan' : 'jours'}</Text>
            <View style={styles.rowGap}>
              <Pressable style={styles.smallAction} onPress={() => setShowPeriodModal(true)}>
                <Text style={styles.smallActionText}>{wo ? 'Definir dernieres regles' : 'Definir dernieres regles'}</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {view === 'journal' ? (
          <View style={[styles.card, discreteMode && styles.blurred]}>
            <Text style={styles.cardTitle}>{wo ? 'Journal bés bi' : 'Journal du jour'}</Text>
            <Text style={styles.dateLabel}>{selectedDateKey}</Text>

            <Text style={styles.sectionTitle}>{wo ? 'Humeur' : 'Humeur'}</Text>
            <View style={styles.moodRow}>
              {MOODS.map((m) => (
                <Pressable
                  key={m.id}
                  onPress={() => setSelectedMood(m.id)}
                  style={[styles.moodBtn, selectedMood === m.id && { borderColor: m.color, backgroundColor: `${m.color}22` }]}
                >
                  <Feather name={m.icon as never} size={16} color={selectedMood === m.id ? m.color : BASE.cocoa} />
                  <Text style={[styles.moodText, selectedMood === m.id && { color: m.color }]}>{wo ? m.labelWo : m.label}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionTitle}>{wo ? 'Flux' : 'Flux'}</Text>
            <View style={styles.flowRow}>
              {FLOW.map((f) => (
                <Pressable
                  key={f.value}
                  onPress={() => setSelectedFlow(f.value)}
                  style={[styles.flowBtn, selectedFlow === f.value && styles.flowBtnActive]}
                >
                  <Text style={[styles.flowText, selectedFlow === f.value && styles.flowTextActive]}>{wo ? f.wo : f.fr}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.primaryBtn} onPress={saveJournal}>
              <Feather name="check" size={16} color="#fff" />
              <Text style={styles.primaryText}>{wo ? 'Continuer vers symptomes' : 'Continuer vers symptomes'}</Text>
            </Pressable>
          </View>
        ) : null}

        {view === 'pilule' ? (
          <View style={[styles.card, discreteMode && styles.blurred]}>
            <Text style={styles.cardTitle}>{wo ? 'Suivi pilule' : 'Suivi pilule'}</Text>
            <Text style={styles.cardLine}>{wo ? 'Serie actuelle' : 'Serie actuelle'}: {pillStreak}</Text>

            <Pressable style={styles.todayPill} onPress={() => togglePill(toDateKey(today))}>
              <Feather name={cd.pillLogs?.[toDateKey(today)]?.taken ? 'check-circle' : 'circle'} size={20} color={BASE.deepGreen} />
              <Text style={styles.todayPillText}>
                {cd.pillLogs?.[toDateKey(today)]?.taken
                  ? (wo ? 'Pilule prise aujourd\'hui' : 'Pilule prise aujourd\'hui')
                  : (wo ? 'Marquer pilule prise' : 'Marquer pilule prise')}
              </Text>
            </Pressable>

            <View style={styles.weekRow}>
              {weekPills.map((d) => {
                const taken = cd.pillLogs?.[d.key]?.taken;
                return (
                  <Pressable key={d.key} style={styles.weekDay} onPress={() => togglePill(d.key)}>
                    <Text style={styles.weekLabel}>{d.label}</Text>
                    <View style={[styles.weekDot, taken && styles.weekDotOn]} />
                    <Text style={styles.weekNum}>{d.day}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <Modal visible={showSymptomLogger} transparent animationType="slide" onRequestClose={() => setShowSymptomLogger(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <SymptomLogger
              date={selectedDateKey}
              onSave={onSymptomSave}
              onCancel={() => setShowSymptomLogger(false)}
              existingSymptoms={cd.dailyLogs?.[selectedDateKey]?.symptoms || []}
              existingNotes={cd.dailyLogs?.[selectedDateKey]?.notes}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={showPeriodModal} transparent animationType="fade" onRequestClose={() => setShowPeriodModal(false)}>
        <View style={styles.modalBg}>
          <View style={styles.periodCard}>
            <Text style={styles.cardTitle}>{wo ? 'Dernieres regles' : 'Dernieres regles'}</Text>
            <Text style={styles.dateLabel}>{selectedDateKey}</Text>
            <Pressable
              style={styles.primaryBtn}
              onPress={() => {
                updateCycleData({ lastPeriodDate: selectedDateKey });
                setShowPeriodModal(false);
              }}
            >
              <Text style={styles.primaryText}>{wo ? 'Enregistrer cette date' : 'Enregistrer cette date'}</Text>
            </Pressable>
            <Pressable style={styles.ghostBtn} onPress={() => setShowPeriodModal(false)}>
              <Text style={styles.ghostText}>{wo ? 'Annuler' : 'Annuler'}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BASE.beige },
  scroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: BASE.deepGreen, fontSize: 22, fontWeight: '700' },
  subtitle: { color: `${BASE.cocoa}AA`, fontSize: 12 },
  segment: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    flexDirection: 'row',
    marginTop: 10,
  },
  segmentBtn: { flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  segmentBtnActive: { backgroundColor: BASE.deepGreen },
  segmentText: { color: `${BASE.cocoa}88`, fontWeight: '600', fontSize: 13 },
  segmentTextActive: { color: '#fff' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: `${BASE.copper}22`,
    gap: 10,
  },
  blurred: { opacity: 0.35 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: BASE.deepGreen },
  cardLine: { fontSize: 14, color: BASE.cocoa },
  dateLabel: { fontSize: 12, color: `${BASE.cocoa}99` },
  sectionTitle: { fontSize: 13, color: BASE.deepGreen, fontWeight: '700', marginTop: 8 },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: `${BASE.cocoa}22`,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  moodText: { color: BASE.cocoa, fontSize: 12, fontWeight: '600' },
  flowRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  flowBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${BASE.cocoa}22`,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  flowBtnActive: { backgroundColor: `${BASE.terracotta}22`, borderColor: BASE.terracotta },
  flowText: { color: BASE.cocoa, fontSize: 12, fontWeight: '600' },
  flowTextActive: { color: BASE.terracotta },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: BASE.deepGreen,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  rowGap: { marginTop: 6 },
  smallAction: {
    backgroundColor: `${BASE.terracotta}18`,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  smallActionText: { color: BASE.terracotta, fontWeight: '700', fontSize: 12 },
  todayPill: {
    borderRadius: 12,
    backgroundColor: `${BASE.deepGreen}10`,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  todayPillText: { color: BASE.deepGreen, fontWeight: '700', fontSize: 13 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginTop: 8 },
  weekDay: { alignItems: 'center', gap: 6, flex: 1, backgroundColor: `${BASE.cocoa}06`, borderRadius: 10, paddingVertical: 8 },
  weekLabel: { fontSize: 11, color: `${BASE.cocoa}88`, fontWeight: '600' },
  weekDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: `${BASE.cocoa}33` },
  weekDotOn: { backgroundColor: BASE.deepGreen, borderColor: BASE.deepGreen },
  weekNum: { fontSize: 12, color: BASE.cocoa },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: { width: '100%', maxHeight: '90%' },
  periodCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  ghostBtn: {
    marginTop: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${BASE.cocoa}22`,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ghostText: { color: BASE.cocoa, fontWeight: '600' },
});
