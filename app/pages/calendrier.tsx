import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useApp } from '../../context/appcontext';
import { colors } from '../../constants/colors';
type AppointmentType = 'medical' | 'contraception' | 'cycle' | 'other';

type Appointment = {
  id: string;
  date: string;
  time: string;
  title: string;
  type: AppointmentType;
  location?: string;
  doctor?: string;
  notes?: string;
  reminder?: boolean;
};

type CycleData = {
  lastPeriodDate: string;
  periodLength: number;
  cycleLength: number;
};

type NewAppointmentDraft = {
  type: AppointmentType;
  title: string;
  time: string;
  doctor: string;
  location: string;
  notes: string;
  reminder: boolean;
};

const STORAGE_KEY = 'saxalwer_appointments';

const CYCLE_DATA_MOCK: CycleData = {
  lastPeriodDate: '2026-03-04',
  periodLength: 5,
  cycleLength: 28,
};

const WEEK_DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const TYPE_COLORS: Record<AppointmentType, string> = {
  medical: colors.deepGreen,
  contraception: colors.copper,
  cycle: colors.terracotta,
  other: colors.gold,
};

const TYPE_ICONS: Record<AppointmentType, keyof typeof Ionicons.glyphMap> = {
  medical: 'person-outline',
  contraception: 'medical-outline',
  cycle: 'water-outline',
  other: 'calendar-outline',
};

const INITIAL_DRAFT: NewAppointmentDraft = {
  type: 'medical',
  title: '',
  time: '',
  doctor: '',
  location: '',
  notes: '',
  reminder: true,
};

function toDateKey(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function sameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDaysForMonth(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: (Date | null)[] = [];

  for (let i = 0; i < startingDayOfWeek; i += 1) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i += 1) {
    days.push(new Date(year, month, i));
  }

  return days;
}

function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatSelectedDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export default function CalendrierScreen() {
  const router = useRouter();
  const { language, setLanguage, oralMode, toggleOralMode, discreteMode } = useApp();
  const [cycleData] = useState<CycleData>(CYCLE_DATA_MOCK);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [draft, setDraft] = useState<NewAppointmentDraft>(INITIAL_DRAFT);
  const wo = language === 'wo';

  useEffect(() => {
    let cancelled = false;

    const loadAppointments = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw || cancelled) return;
        const parsed = JSON.parse(raw) as Appointment[];
        if (Array.isArray(parsed)) {
          setAppointments(parsed.slice(0, 1000));
        }
      } catch {
      }
    };

    loadAppointments();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const saveAppointments = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
      } catch {
      }
    };

    saveAppointments();
  }, [appointments]);

  const goToPreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const days = useMemo(() => getDaysForMonth(currentDate), [currentDate]);

  const getAppointmentsForDate = useCallback((date: Date | null) => {
    if (!date) return [];
    const key = toDateKey(date);
    return appointments.filter((appt) => appt.date === key);
  }, [appointments]);

  const getCycleEventForDate = (date: Date | null) => {
    if (!date || !cycleData.lastPeriodDate) return null;

    const periodStart = new Date(cycleData.lastPeriodDate);
    const diffDays = Math.floor(
      (date.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays >= 0 && diffDays < cycleData.periodLength) {
      return { type: 'period' as const, label: wo ? 'Règles' : 'Règles' };
    }
    if (diffDays >= 12 && diffDays <= 16) {
      return { type: 'ovulation' as const, label: wo ? 'Ovulation' : 'Ovulation' };
    }
    if (diffDays === cycleData.cycleLength) {
      return {
        type: 'expected' as const,
        label: wo ? 'Règles prévues' : 'Règles prévues',
      };
    }

    return null;
  };

  const selectedDateAppts = useMemo(
    () => getAppointmentsForDate(selectedDate),
    [getAppointmentsForDate, selectedDate]
  );

  const addAppointment = () => {
    if (!selectedDate || !draft.title.trim() || !draft.time.trim()) return;

    const appointment: Appointment = {
      id: Date.now().toString(),
      date: toDateKey(selectedDate),
      time: draft.time.trim(),
      title: draft.title.trim(),
      type: draft.type,
      location: draft.location.trim() || undefined,
      doctor: draft.doctor.trim() || undefined,
      notes: draft.notes.trim() || undefined,
      reminder: draft.reminder,
    };

    setAppointments((prev) => [appointment, ...prev].slice(0, 1000));
    setShowAddModal(false);
    setDraft(INITIAL_DRAFT);
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSpeak = () => {
    const text = wo
      ? `Sama calendrier. ${formatMonthYear(currentDate)}. ${selectedDate ? formatSelectedDate(selectedDate) : 'Tannal bés.'}`
      : `Mon calendrier. ${formatMonthYear(currentDate)}. ${selectedDate ? formatSelectedDate(selectedDate) : 'Selectionne une date.'}`;

    Speech.stop();
    Speech.speak(text, {
      language: wo ? 'fr-SN' : 'fr-FR',
      rate: 0.9,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={discreteMode ? styles.discreteBlur : undefined}
      >
        <View style={styles.headerWrap}>
          <View style={styles.headerGlow} />

          <View style={styles.headerTopRow}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </Pressable>

            <View style={styles.headerActionsRow}>
              <Pressable onPress={() => setLanguage(wo ? 'fr' : 'wo')} style={styles.headerPill}>
                <Text style={styles.headerPillText}>{wo ? 'FR' : 'WO'}</Text>
              </Pressable>

              <Pressable onPress={toggleOralMode} style={styles.headerPillIcon}>
                <Ionicons
                  name={oralMode ? 'volume-high-outline' : 'volume-mute-outline'}
                  size={16}
                  color="#FFFFFF"
                />
              </Pressable>

              <Pressable onPress={handleSpeak} style={styles.headerPillIcon}>
                <Ionicons name="play-outline" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconWrap}>
              <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.headerTitle}>{wo ? 'Sama calendrier' : 'Mon Calendrier'}</Text>
          </View>

          <Text style={styles.headerSubtitle}>
            {wo ? 'Sàmm rendez-vous yi ak jot yi' : 'Gère tes rendez-vous et rappels'}
          </Text>
        </View>

        <View style={styles.pagePad}>
          <View style={styles.monthCard}>
            <Pressable onPress={goToPreviousMonth} style={styles.monthNavButton}>
              <Ionicons name="chevron-back" size={20} color={colors.deepGreen} />
            </Pressable>

            <Text style={styles.monthTitle}>{formatMonthYear(currentDate)}</Text>

            <Pressable onPress={goToNextMonth} style={styles.monthNavButton}>
              <Ionicons name="chevron-forward" size={20} color={colors.deepGreen} />
            </Pressable>
          </View>

          <View style={styles.calendarCard}>
            <View style={styles.weekRow}>
              {WEEK_DAYS_FR.map((day) => (
                <View key={day} style={styles.weekLabelCell}>
                  <Text style={styles.weekLabelText}>{day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.daysWrap}>
              {days.map((day, index) => {
                if (!day) {
                  return <View key={`empty-${index}`} style={styles.emptyDayCell} />;
                }

                const isToday = sameDay(day, new Date());
                const isSelected = sameDay(day, selectedDate);
                const appts = getAppointmentsForDate(day);
                const cycleEvent = getCycleEventForDate(day);

                return (
                  <Pressable
                    key={`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`}
                    onPress={() => setSelectedDate(day)}
                    style={[
                      styles.dayCell,
                      isSelected && styles.dayCellSelected,
                      !isSelected && isToday && styles.dayCellToday,
                      !isSelected && cycleEvent?.type === 'period' && styles.dayCellPeriod,
                      !isSelected && cycleEvent?.type === 'ovulation' && styles.dayCellOvulation,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        (isToday || isSelected) && styles.dayTextStrong,
                        isSelected && styles.dayTextSelected,
                      ]}
                    >
                      {day.getDate()}
                    </Text>

                    <View style={styles.dayDotsRow}>
                      {appts.length > 0 && (
                        <View
                          style={[
                            styles.dayDot,
                            { backgroundColor: isSelected ? colors.white : colors.copper },
                          ]}
                        />
                      )}

                      {cycleEvent && (
                        <View
                          style={[
                            styles.dayDot,
                            {
                              backgroundColor:
                                cycleEvent.type === 'period'
                                  ? colors.terracotta
                                  : colors.gold,
                            },
                          ]}
                        />
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {selectedDate && (
            <View style={styles.dayAppointmentsCard}>
              <View style={styles.dayAppointmentsHeader}>
                <View style={styles.dayAppointmentsTitleWrap}>
                  <Text style={styles.dayAppointmentsTitle}>{formatSelectedDate(selectedDate)}</Text>
                  <Text style={styles.dayAppointmentsCount}>
                    {selectedDateAppts.length} {wo ? 'rendez-vous' : 'rendez-vous'}
                  </Text>
                </View>

                <Pressable onPress={() => setShowAddModal(true)} style={styles.addButton}>
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>{wo ? 'Yokk' : 'Ajouter'}</Text>
                </Pressable>
              </View>

              {selectedDateAppts.length === 0 ? (
                <View style={styles.emptyAppointmentsWrap}>
                  <Ionicons name="calendar-outline" size={34} color="rgba(74,47,39,0.25)" />
                  <Text style={styles.emptyAppointmentsText}>
                    {wo ? 'Amul rendez-vous' : 'Aucun rendez-vous'}
                  </Text>
                </View>
              ) : (
                <View style={styles.appointmentsList}>
                  {selectedDateAppts.map((appt) => {
                    const itemColor = TYPE_COLORS[appt.type];

                    return (
                      <View
                        key={appt.id}
                        style={[
                          styles.appointmentItem,
                          {
                            borderLeftColor: itemColor,
                            backgroundColor: `${itemColor}10`,
                          },
                        ]}
                      >
                        <View style={styles.apptTopRow}>
                          <View style={styles.apptLeftRow}>
                            <View
                              style={[
                                styles.apptIconWrap,
                                { backgroundColor: `${itemColor}20` },
                              ]}
                            >
                              <Ionicons
                                name={TYPE_ICONS[appt.type]}
                                size={16}
                                color={itemColor}
                              />
                            </View>

                            <View style={styles.apptTextBlock}>
                              <Text style={styles.apptTitle}>{appt.title}</Text>
                              <View style={styles.apptTimeRow}>
                                <Ionicons
                                  name="time-outline"
                                  size={12}
                                  color="rgba(74,47,39,0.65)"
                                />
                                <Text style={styles.apptSubText}>{appt.time}</Text>
                              </View>
                            </View>
                          </View>

                          <Pressable
                            onPress={() => deleteAppointment(appt.id)}
                            style={styles.deleteButton}
                          >
                            <Ionicons name="close" size={16} color={colors.terracotta} />
                          </Pressable>
                        </View>

                        {!!appt.doctor && (
                          <View style={styles.apptInfoRow}>
                            <Ionicons name="person-outline" size={12} color="rgba(74,47,39,0.65)" />
                            <Text style={styles.apptInfoText}>{appt.doctor}</Text>
                          </View>
                        )}

                        {!!appt.location && (
                          <View style={styles.apptInfoRow}>
                            <Ionicons name="location-outline" size={12} color="rgba(74,47,39,0.65)" />
                            <Text style={styles.apptInfoText}>{appt.location}</Text>
                          </View>
                        )}

                        {!!appt.notes && (
                          <Text style={styles.apptNotes}>{appt.notes}</Text>
                        )}

                        {!!appt.reminder && (
                          <View style={styles.apptReminderRow}>
                            <Ionicons name="notifications-outline" size={12} color={itemColor} />
                            <Text style={[styles.apptReminderText, { color: itemColor }]}>
                              {wo ? 'Rappel actif' : 'Rappel activé'}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          <View style={styles.legendCard}>
            <Text style={styles.legendTitle}>{wo ? 'Légende' : 'Légende'}</Text>

            <View style={styles.legendList}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.terracotta }]} />
                <Text style={styles.legendText}>{wo ? 'Règles' : 'Période de règles'}</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.gold }]} />
                <Text style={styles.legendText}>{wo ? 'Ovulation' : "Période d'ovulation"}</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.copper }]} />
                <Text style={styles.legendText}>{wo ? 'Rendez-vous' : 'Rendez-vous planifié'}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable onPress={() => setShowAddModal(false)} style={styles.modalBackdrop} />

          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{wo ? 'Yokk rendez-vous' : 'Nouveau rendez-vous'}</Text>
              <Pressable onPress={() => setShowAddModal(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={18} color={colors.terracotta} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContent}>
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>{wo ? 'Xeetu rendez-vous' : 'Type de rendez-vous'}</Text>

                <View style={styles.typeGrid}>
                  {[
                    { value: 'medical' as const, labelFr: 'Médical', labelWo: 'Médical' },
                    { value: 'contraception' as const, labelFr: 'Contraception', labelWo: 'Contraception' },
                    { value: 'cycle' as const, labelFr: 'Cycle', labelWo: 'Weer' },
                    { value: 'other' as const, labelFr: 'Autre', labelWo: 'Beneen' },
                  ].map((typeItem) => {
                    const isSelected = draft.type === typeItem.value;
                    const iconColor = isSelected
                      ? TYPE_COLORS[typeItem.value]
                      : 'rgba(74,47,39,0.65)';

                    return (
                      <Pressable
                        key={typeItem.value}
                        onPress={() => setDraft((prev) => ({ ...prev, type: typeItem.value }))}
                        style={[
                          styles.typeButton,
                          isSelected && {
                            borderColor: TYPE_COLORS[typeItem.value],
                            backgroundColor: `${TYPE_COLORS[typeItem.value]}16`,
                          },
                        ]}
                      >
                        <Ionicons name={TYPE_ICONS[typeItem.value]} size={16} color={iconColor} />
                        <Text
                          style={[
                            styles.typeButtonText,
                            isSelected && { color: TYPE_COLORS[typeItem.value] },
                          ]}
                        >
                          {wo ? typeItem.labelWo : typeItem.labelFr}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>{wo ? 'Turu' : 'Titre'} *</Text>
                <TextInput
                  value={draft.title}
                  onChangeText={(value) => setDraft((prev) => ({ ...prev, title: value }))}
                  placeholder={wo ? 'Bind turu bi' : 'Ex: Consultation gynéco'}
                  placeholderTextColor="rgba(74,47,39,0.45)"
                  style={styles.input}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>{wo ? 'Waxtu' : 'Heure'} *</Text>
                <TextInput
                  value={draft.time}
                  onChangeText={(value) => setDraft((prev) => ({ ...prev, time: value }))}
                  placeholder="HH:mm"
                  placeholderTextColor="rgba(74,47,39,0.45)"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>{wo ? 'Doxtooru' : 'Médecin / Praticien'}</Text>
                <TextInput
                  value={draft.doctor}
                  onChangeText={(value) => setDraft((prev) => ({ ...prev, doctor: value }))}
                  placeholder={wo ? 'Bind tur bi' : 'Ex: Dr. Diallo'}
                  placeholderTextColor="rgba(74,47,39,0.45)"
                  style={styles.input}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>{wo ? 'Taasu' : 'Lieu'}</Text>
                <TextInput
                  value={draft.location}
                  onChangeText={(value) => setDraft((prev) => ({ ...prev, location: value }))}
                  placeholder={wo ? 'Bind taasu bi' : 'Ex: Centre de santé de Plateau'}
                  placeholderTextColor="rgba(74,47,39,0.45)"
                  style={styles.input}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>{wo ? 'Bind yi' : 'Notes'}</Text>
                <TextInput
                  value={draft.notes}
                  onChangeText={(value) => setDraft((prev) => ({ ...prev, notes: value }))}
                  placeholder={wo ? 'Yokk bind yi...' : 'Ajoute des notes...'}
                  placeholderTextColor="rgba(74,47,39,0.45)"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  style={[styles.input, styles.inputMultiline]}
                />
              </View>

              <Pressable
                onPress={() =>
                  setDraft((prev) => ({
                    ...prev,
                    reminder: !prev.reminder,
                  }))
                }
                style={styles.reminderRow}
              >
                <View style={styles.reminderLeft}>
                  <Ionicons name="notifications-outline" size={18} color={colors.gold} />
                  <Text style={styles.reminderLabel}>{wo ? 'Rappel' : 'Activer rappel'}</Text>
                </View>

                <View style={[styles.toggleTrack, draft.reminder && styles.toggleTrackOn]}>
                  <View style={[styles.toggleThumb, draft.reminder && styles.toggleThumbOn]} />
                </View>
              </Pressable>

              <View style={styles.modalButtonsRow}>
                <Pressable onPress={() => setShowAddModal(false)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>{wo ? 'Dindi' : 'Annuler'}</Text>
                </Pressable>

                <Pressable
                  onPress={addAppointment}
                  disabled={!draft.title.trim() || !draft.time.trim()}
                  style={[
                    styles.confirmButton,
                    (!draft.title.trim() || !draft.time.trim()) && styles.confirmButtonDisabled,
                  ]}
                >
                  <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                  <Text style={styles.confirmButtonText}>{wo ? 'Yokk' : 'Ajouter'}</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  discreteBlur: {
    opacity: 0.78,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  headerWrap: {
    paddingTop: 24,
    paddingBottom: 34,
    paddingHorizontal: 24,
    backgroundColor: colors.terracotta,
    position: 'relative',
    overflow: 'hidden',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerGlow: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(181,98,42,0.45)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPill: {
    minWidth: 46,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerPillText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  headerPillIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  headerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 34,
    lineHeight: 40,
    color: colors.white,
    fontWeight: '700',
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.72)',
  },
  pagePad: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 20,
  },
  monthCard: {
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthNavButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(26,60,52,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '700',
    color: colors.deepGreen,
    textTransform: 'capitalize',
  },
  calendarCard: {
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.12)',
    padding: 12,
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekLabelCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  weekLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(74,47,39,0.60)',
    textTransform: 'uppercase',
  },
  daysWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 4,
  },
  emptyDayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 4,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.08)',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 6,
  },
  dayCellSelected: {
    backgroundColor: colors.terracotta,
    borderColor: colors.terracotta,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: 'rgba(212,175,55,0.18)',
  },
  dayCellPeriod: {
    backgroundColor: 'rgba(166,93,64,0.12)',
  },
  dayCellOvulation: {
    backgroundColor: 'rgba(212,175,55,0.12)',
  },
  dayText: {
    fontSize: 13,
    color: colors.deepGreen,
    fontWeight: '500',
  },
  dayTextStrong: {
    fontWeight: '700',
  },
  dayTextSelected: {
    color: colors.white,
  },
  dayDotsRow: {
    marginTop: 2,
    flexDirection: 'row',
    gap: 2,
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dayAppointmentsCard: {
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.12)',
    padding: 20,
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  dayAppointmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  dayAppointmentsTitleWrap: {
    flex: 1,
    gap: 2,
  },
  dayAppointmentsTitle: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '700',
    color: colors.deepGreen,
    textTransform: 'capitalize',
  },
  dayAppointmentsCount: {
    fontSize: 12,
    color: 'rgba(74,47,39,0.6)',
  },
  addButton: {
    borderRadius: 12,
    backgroundColor: colors.terracotta,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyAppointmentsWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  emptyAppointmentsText: {
    fontSize: 13,
    color: 'rgba(74,47,39,0.52)',
  },
  appointmentsList: {
    gap: 12,
  },
  appointmentItem: {
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 14,
  },
  apptTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  apptLeftRow: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  apptIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apptTextBlock: {
    flex: 1,
  },
  apptTitle: {
    fontSize: 14,
    color: colors.deepGreen,
    fontWeight: '700',
  },
  apptTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  apptSubText: {
    fontSize: 11,
    color: 'rgba(74,47,39,0.65)',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apptInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  apptInfoText: {
    fontSize: 11,
    color: 'rgba(74,47,39,0.72)',
  },
  apptNotes: {
    marginTop: 8,
    fontSize: 11,
    color: 'rgba(74,47,39,0.75)',
    fontStyle: 'italic',
  },
  apptReminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  apptReminderText: {
    fontSize: 10,
    fontWeight: '700',
  },
  legendCard: {
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.12)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 24,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.deepGreen,
    marginBottom: 12,
  },
  legendList: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.deepGreen,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    maxHeight: '84%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 30,
    lineHeight: 34,
    color: colors.deepGreen,
    fontWeight: '700',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(166,93,64,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    gap: 14,
    paddingBottom: 16,
  },
  formSection: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.deepGreen,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
    columnGap: 8,
  },
  typeButton: {
    width: '48.5%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(26,60,52,0.04)',
    paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeButtonText: {
    fontSize: 13,
    color: colors.deepGreen,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: colors.deepGreen,
  },
  inputMultiline: {
    minHeight: 84,
  },
  reminderRow: {
    borderRadius: 12,
    backgroundColor: 'rgba(212,175,55,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reminderLabel: {
    fontSize: 13,
    color: colors.deepGreen,
    fontWeight: '600',
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 99,
    backgroundColor: 'rgba(74,47,39,0.20)',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackOn: {
    backgroundColor: colors.gold,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.20)',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  cancelButtonText: {
    fontSize: 13,
    color: colors.deepGreen,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 14,
  },
  confirmButtonDisabled: {
    backgroundColor: 'rgba(74,47,39,0.20)',
  },
  confirmButtonText: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '700',
  },
});
