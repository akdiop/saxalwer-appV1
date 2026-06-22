import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { SaxalHeroCard, SaxalPage, SaxalPageHeading } from '../../components/ui/SaxalPage';
import { colors } from '../../constants/colors';
import { Fonts } from '../../constants/theme';
import { useApp } from '../../context/appcontext';
import { secureStorage } from '../../utils/secureStorage';

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

  for (let index = 0; index < startingDayOfWeek; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day));
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
  const { width } = useWindowDimensions();
  const {
    language,
    setLanguage,
    oralMode,
    toggleOralMode,
    discreteMode,
    cycleData,
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [draft, setDraft] = useState<NewAppointmentDraft>(INITIAL_DRAFT);

  const wo = language === 'wo';
  const isWide = width >= 1120;

  useEffect(() => {
    let cancelled = false;

    const loadAppointments = async () => {
      try {
        const parsed = await secureStorage.getJSON<Appointment[]>(STORAGE_KEY);
        if (!parsed || cancelled) return;
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
        await secureStorage.setJSON(STORAGE_KEY, appointments);
      } catch {
      }
    };

    saveAppointments();
  }, [appointments]);

  const days = useMemo(() => getDaysForMonth(currentDate), [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate((previousDate) => new Date(previousDate.getFullYear(), previousDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((previousDate) => new Date(previousDate.getFullYear(), previousDate.getMonth() + 1, 1));
  };

  const getAppointmentsForDate = useCallback(
    (date: Date | null) => {
      if (!date) return [];
      const key = toDateKey(date);
      return appointments.filter((appointment) => appointment.date === key);
    },
    [appointments],
  );

  const getCycleEventForDate = (date: Date | null) => {
    if (!date || !cycleData.lastPeriodDate) return null;

    const periodStart = new Date(cycleData.lastPeriodDate);
    const diffDays = Math.floor(
      (date.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays >= 0 && diffDays < cycleData.periodLength) {
      return { type: 'period' as const, label: 'Regles' };
    }

    if (diffDays >= 12 && diffDays <= 16) {
      return { type: 'ovulation' as const, label: 'Ovulation' };
    }

    if (diffDays === cycleData.cycleLength) {
      return { type: 'expected' as const, label: 'Regles prevues' };
    }

    return null;
  };

  const selectedDateAppointments = useMemo(
    () => getAppointmentsForDate(selectedDate),
    [getAppointmentsForDate, selectedDate],
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

    setAppointments((previousAppointments) => [appointment, ...previousAppointments].slice(0, 1000));
    setShowAddModal(false);
    setDraft(INITIAL_DRAFT);
  };

  const deleteAppointment = (id: string) => {
    setAppointments((previousAppointments) =>
      previousAppointments.filter((appointment) => appointment.id !== id),
    );
  };

  const handleSpeak = () => {
    const text = wo
      ? `Sama calendrier. ${formatMonthYear(currentDate)}. ${
          selectedDate ? formatSelectedDate(selectedDate) : 'Tannal bes.'
        }`
      : `Mon calendrier. ${formatMonthYear(currentDate)}. ${
          selectedDate ? formatSelectedDate(selectedDate) : 'Selectionne une date.'
        }`;

    Speech.stop();
    Speech.speak(text, {
      language: wo ? 'fr-SN' : 'fr-FR',
      rate: 0.9,
    });
  };

  return (
    <>
      <SaxalPage contentContainerStyle={styles.pageContent}>
        <View style={discreteMode ? styles.discreteBlur : undefined}>
          <SaxalPageHeading
            eyebrow={wo ? 'Topptoo' : 'Suivi'}
            title={wo ? 'Sama calendrier' : 'Mon calendrier'}
            subtitle={
              wo
                ? 'Samm sa rendez-vous yi, xam sa weer ak jox sa bopp benn taxawaay bu dal.'
                : 'Le calendrier garde maintenant le meme souffle que le site: plus calme, plus doux et plus intentionnel.'
            }
            onBack={() => router.back()}
            rightSlot={
              <View style={styles.headerActions}>
                <Pressable onPress={() => setLanguage(wo ? 'fr' : 'wo')} style={styles.actionPill}>
                  <Text style={styles.actionPillText}>{wo ? 'Francais' : 'Wolof'}</Text>
                </Pressable>

                <Pressable onPress={toggleOralMode} style={styles.actionIconPill}>
                  <Ionicons
                    name={oralMode ? 'volume-high-outline' : 'volume-mute-outline'}
                    size={16}
                    color={colors.deepGreen}
                  />
                </Pressable>

                <Pressable onPress={handleSpeak} style={styles.actionIconPill}>
                  <Ionicons name="play-outline" size={16} color={colors.deepGreen} />
                </Pressable>
              </View>
            }
          />

          <SaxalHeroCard
            badge={wo ? 'Rendez-vous ak cycle' : 'Rendez-vous et cycle'}
            title={
              wo
                ? 'Wone sa bopp lu am solo, du ci xacc'
                : 'Voir l’essentiel sans perdre la douceur du parcours'
            }
            description={
              wo
                ? 'Jox nañu ko benn nataal bu gën a xel, bu mel ni site bi: lees, leer, te xam ne dafa sutura.'
                : 'Le calendrier garde ses fonctions pratiques, mais il adopte maintenant le langage du site: plus d’air, plus de lisibilite, plus de confiance.'
            }
            footer={
              <View style={styles.heroMetaRow}>
                <View style={styles.heroMetaPill}>
                  <Text style={styles.heroMetaLabel}>Mois</Text>
                  <Text style={styles.heroMetaText}>{formatMonthYear(currentDate)}</Text>
                </View>

                <View style={styles.heroMetaPill}>
                  <Text style={styles.heroMetaLabel}>Mode</Text>
                  <Text style={styles.heroMetaText}>
                    {discreteMode ? 'Discret actif' : 'Affichage ouvert'}
                  </Text>
                </View>
              </View>
            }
          />

          <View style={[styles.dashboardGrid, isWide && styles.dashboardGridWide]}>
            <View style={styles.calendarColumn}>
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
                    const dayAppointments = getAppointmentsForDate(day);
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
                          {dayAppointments.length > 0 ? (
                            <View
                              style={[
                                styles.dayDot,
                                {
                                  backgroundColor: isSelected ? colors.white : colors.copper,
                                },
                              ]}
                            />
                          ) : null}

                          {cycleEvent ? (
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
                          ) : null}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.legendCard}>
                <Text style={styles.legendTitle}>Legende</Text>

                <View style={styles.legendList}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.terracotta }]} />
                    <Text style={styles.legendText}>Periode de regles</Text>
                  </View>

                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.gold }]} />
                    <Text style={styles.legendText}>Periode d&apos;ovulation</Text>
                  </View>

                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.copper }]} />
                    <Text style={styles.legendText}>Rendez-vous planifie</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.detailsColumn}>
              {selectedDate ? (
                <View style={styles.dayAppointmentsCard}>
                  <View style={styles.dayAppointmentsHeader}>
                    <View style={styles.dayAppointmentsTitleWrap}>
                      <Text style={styles.dayAppointmentsTitle}>
                        {formatSelectedDate(selectedDate)}
                      </Text>
                      <Text style={styles.dayAppointmentsCount}>
                        {selectedDateAppointments.length} rendez-vous
                      </Text>
                    </View>

                    <Pressable onPress={() => setShowAddModal(true)} style={styles.addButton}>
                      <Ionicons name="add" size={16} color={colors.white} />
                      <Text style={styles.addButtonText}>{wo ? 'Yokk' : 'Ajouter'}</Text>
                    </Pressable>
                  </View>

                  {selectedDateAppointments.length === 0 ? (
                    <View style={styles.emptyAppointmentsWrap}>
                      <Ionicons
                        name="calendar-outline"
                        size={34}
                        color="rgba(74,47,39,0.25)"
                      />
                      <Text style={styles.emptyAppointmentsTitle}>Aucun rendez-vous</Text>
                      <Text style={styles.emptyAppointmentsText}>
                        Ajoute un rappel, une consultation ou une note de suivi pour garder une
                        trace claire de cette journee.
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.appointmentsList}>
                      {selectedDateAppointments.map((appointment) => {
                        const itemColor = TYPE_COLORS[appointment.type];

                        return (
                          <View
                            key={appointment.id}
                            style={[
                              styles.appointmentItem,
                              {
                                borderLeftColor: itemColor,
                                backgroundColor: `${itemColor}10`,
                              },
                            ]}
                          >
                            <View style={styles.appointmentTopRow}>
                              <View style={styles.appointmentLead}>
                                <View
                                  style={[
                                    styles.appointmentIconWrap,
                                    { backgroundColor: `${itemColor}20` },
                                  ]}
                                >
                                  <Ionicons
                                    name={TYPE_ICONS[appointment.type]}
                                    size={16}
                                    color={itemColor}
                                  />
                                </View>

                                <View style={styles.appointmentCopy}>
                                  <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                                  <View style={styles.inlineMetaRow}>
                                    <Ionicons
                                      name="time-outline"
                                      size={12}
                                      color="rgba(74,47,39,0.6)"
                                    />
                                    <Text style={styles.inlineMetaText}>{appointment.time}</Text>
                                  </View>
                                </View>
                              </View>

                              <Pressable
                                onPress={() => deleteAppointment(appointment.id)}
                                style={styles.deleteButton}
                              >
                                <Ionicons name="close" size={16} color={colors.terracotta} />
                              </Pressable>
                            </View>

                            {appointment.doctor ? (
                              <View style={styles.inlineMetaRow}>
                                <Ionicons
                                  name="person-outline"
                                  size={12}
                                  color="rgba(74,47,39,0.6)"
                                />
                                <Text style={styles.inlineMetaText}>{appointment.doctor}</Text>
                              </View>
                            ) : null}

                            {appointment.location ? (
                              <View style={styles.inlineMetaRow}>
                                <Ionicons
                                  name="location-outline"
                                  size={12}
                                  color="rgba(74,47,39,0.6)"
                                />
                                <Text style={styles.inlineMetaText}>{appointment.location}</Text>
                              </View>
                            ) : null}

                            {appointment.notes ? (
                              <Text style={styles.appointmentNotes}>{appointment.notes}</Text>
                            ) : null}

                            {appointment.reminder ? (
                              <View style={styles.reminderActiveRow}>
                                <Ionicons
                                  name="notifications-outline"
                                  size={12}
                                  color={itemColor}
                                />
                                <Text style={[styles.reminderActiveText, { color: itemColor }]}>
                                  Rappel active
                                </Text>
                              </View>
                            ) : null}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.emptySelectionCard}>
                  <Text style={styles.emptySelectionEyebrow}>Detail du jour</Text>
                  <Text style={styles.emptySelectionTitle}>Choisis une date pour continuer</Text>
                  <Text style={styles.emptySelectionText}>
                    Les rendez-vous, les rappels et le suivi du cycle apparaissent ici quand une
                    journee est selectionnee.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </SaxalPage>

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

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>{wo ? 'Xeetu rendez-vous' : 'Type de rendez-vous'}</Text>

                <View style={styles.typeGrid}>
                  {[
                    { value: 'medical' as const, labelFr: 'Medical', labelWo: 'Medical' },
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
                        onPress={() => setDraft((previousDraft) => ({ ...previousDraft, type: typeItem.value }))}
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
                  onChangeText={(value) => setDraft((previousDraft) => ({ ...previousDraft, title: value }))}
                  placeholder={wo ? 'Bind turu bi' : 'Ex: Consultation gyneco'}
                  placeholderTextColor="rgba(74,47,39,0.45)"
                  style={styles.input}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>{wo ? 'Waxtu' : 'Heure'} *</Text>
                <TextInput
                  value={draft.time}
                  onChangeText={(value) => setDraft((previousDraft) => ({ ...previousDraft, time: value }))}
                  placeholder="HH:mm"
                  placeholderTextColor="rgba(74,47,39,0.45)"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>{wo ? 'Doxtooru' : 'Medecin / Praticien'}</Text>
                <TextInput
                  value={draft.doctor}
                  onChangeText={(value) => setDraft((previousDraft) => ({ ...previousDraft, doctor: value }))}
                  placeholder={wo ? 'Bind tur bi' : 'Ex: Dr. Diallo'}
                  placeholderTextColor="rgba(74,47,39,0.45)"
                  style={styles.input}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>{wo ? 'Taasu' : 'Lieu'}</Text>
                <TextInput
                  value={draft.location}
                  onChangeText={(value) => setDraft((previousDraft) => ({ ...previousDraft, location: value }))}
                  placeholder={wo ? 'Bind taasu bi' : 'Ex: Centre de sante du Plateau'}
                  placeholderTextColor="rgba(74,47,39,0.45)"
                  style={styles.input}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>{wo ? 'Bind yi' : 'Notes'}</Text>
                <TextInput
                  value={draft.notes}
                  onChangeText={(value) => setDraft((previousDraft) => ({ ...previousDraft, notes: value }))}
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
                  setDraft((previousDraft) => ({
                    ...previousDraft,
                    reminder: !previousDraft.reminder,
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
                  <MaterialCommunityIcons name="check" size={18} color={colors.white} />
                  <Text style={styles.confirmButtonText}>{wo ? 'Yokk' : 'Ajouter'}</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    gap: 24,
  },
  discreteBlur: {
    opacity: 0.84,
  },
  headerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionPill: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: colors.cocoa,
    textTransform: 'uppercase',
  },
  actionIconPill: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  heroMetaPill: {
    minWidth: 150,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 3,
  },
  heroMetaLabel: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  heroMetaText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600',
  },
  dashboardGrid: {
    gap: 18,
  },
  dashboardGridWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  calendarColumn: {
    flex: 1.15,
    gap: 18,
  },
  detailsColumn: {
    flex: 0.95,
    gap: 18,
  },
  monthCard: {
    borderRadius: 24,
    backgroundColor: '#FFFBF6',
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  monthNavButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(26,60,52,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    flex: 1,
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 32,
    color: colors.cocoa,
    fontWeight: '600',
    fontFamily: Fonts.serif,
    textTransform: 'capitalize',
  },
  calendarCard: {
    borderRadius: 28,
    backgroundColor: '#FFFBF6',
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.12)',
    padding: 14,
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
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
    color: 'rgba(74,47,39,0.58)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  daysWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
  },
  emptyDayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 4,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.08)',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 9,
  },
  dayCellSelected: {
    backgroundColor: colors.deepGreen,
    borderColor: colors.deepGreen,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: 'rgba(212,175,55,0.14)',
  },
  dayCellPeriod: {
    backgroundColor: 'rgba(166,93,64,0.08)',
  },
  dayCellOvulation: {
    backgroundColor: 'rgba(212,175,55,0.1)',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.cocoa,
  },
  dayTextStrong: {
    fontWeight: '700',
  },
  dayTextSelected: {
    color: colors.white,
  },
  dayDotsRow: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 3,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  legendCard: {
    borderRadius: 24,
    backgroundColor: '#FFF8EF',
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.12)',
    padding: 18,
    gap: 12,
  },
  legendTitle: {
    fontSize: 24,
    lineHeight: 28,
    color: colors.cocoa,
    fontWeight: '600',
    fontFamily: Fonts.serif,
  },
  legendList: {
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  legendText: {
    fontSize: 13,
    color: 'rgba(74,47,39,0.76)',
  },
  dayAppointmentsCard: {
    borderRadius: 28,
    backgroundColor: '#FFFBF6',
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.12)',
    padding: 20,
    gap: 16,
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  dayAppointmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  dayAppointmentsTitleWrap: {
    flex: 1,
    gap: 4,
  },
  dayAppointmentsTitle: {
    fontSize: 30,
    lineHeight: 34,
    color: colors.cocoa,
    fontWeight: '600',
    fontFamily: Fonts.serif,
    textTransform: 'capitalize',
  },
  dayAppointmentsCount: {
    fontSize: 12,
    color: 'rgba(74,47,39,0.58)',
  },
  addButton: {
    borderRadius: 999,
    backgroundColor: colors.terracotta,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyAppointmentsWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 26,
    gap: 10,
  },
  emptyAppointmentsTitle: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.cocoa,
    fontWeight: '600',
    fontFamily: Fonts.serif,
    textAlign: 'center',
  },
  emptyAppointmentsText: {
    maxWidth: 360,
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(74,47,39,0.72)',
    textAlign: 'center',
  },
  appointmentsList: {
    gap: 12,
  },
  appointmentItem: {
    borderRadius: 18,
    borderLeftWidth: 4,
    padding: 14,
    gap: 8,
  },
  appointmentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  appointmentLead: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  appointmentIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentCopy: {
    flex: 1,
    gap: 4,
  },
  appointmentTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.cocoa,
  },
  inlineMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inlineMetaText: {
    fontSize: 12,
    color: 'rgba(74,47,39,0.72)',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  appointmentNotes: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(74,47,39,0.78)',
  },
  reminderActiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reminderActiveText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  emptySelectionCard: {
    borderRadius: 28,
    backgroundColor: '#FFFBF6',
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.12)',
    padding: 22,
    gap: 8,
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  emptySelectionEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.terracotta,
  },
  emptySelectionTitle: {
    fontSize: 30,
    lineHeight: 34,
    color: colors.cocoa,
    fontWeight: '600',
    fontFamily: Fonts.serif,
  },
  emptySelectionText: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(74,47,39,0.74)',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,61,46,0.34)',
  },
  modalSheet: {
    maxHeight: '86%',
    borderRadius: 30,
    backgroundColor: '#FFF9F2',
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.14)',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 30,
    lineHeight: 34,
    color: colors.cocoa,
    fontWeight: '600',
    fontFamily: Fonts.serif,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(166,93,64,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    gap: 16,
    paddingBottom: 8,
  },
  formSection: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.terracotta,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.08)',
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.cocoa,
  },
  input: {
    minHeight: 48,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.cocoa,
  },
  inputMultiline: {
    minHeight: 104,
  },
  reminderRow: {
    borderRadius: 20,
    backgroundColor: '#FFF4E9',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.14)',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  reminderLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.cocoa,
  },
  toggleTrack: {
    width: 46,
    height: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(74,47,39,0.16)',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackOn: {
    backgroundColor: 'rgba(166,93,64,0.36)',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.cocoa,
  },
  confirmButton: {
    flex: 1.1,
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: colors.terracotta,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmButtonDisabled: {
    opacity: 0.45,
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
});
