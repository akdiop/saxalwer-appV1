import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';

import NotificationCategoryCard, {
  NotificationFrequency,
} from '../components/profile/NotificationCategoryCard';
import ProfileRowItem from '../components/profile/ProfileRowItem';
import ProfileStatCard from '../components/profile/ProfileStatCard';
import { colors } from '../constants/colors';
import { useProfileMock } from '../context/ProfileMockContext';
import { ARTICLES } from '../data/mockArticles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function ProfilContent() {
  const router = useRouter();
  const {
    language,
    setLanguage,
    selectedAge,
    favorites,
    removeFavorite,
    selectedNeeds,
    selectedGoals,
    discreteMode,
    toggleDiscreteMode,
    oralMode,
    toggleOralMode,
    unreadCount,
    clearNotifications,
    userProfile,
    sensitiveOrientation,
    notificationPreferences,
    setNotificationPreferenceEnabled,
    setNotificationPreferenceFrequency,
    cycleNotifications,
    firstName,
  } = useProfileMock();

  const [menuOpen, setMenuOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(true);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const menuAnim = useRef(new Animated.Value(0)).current;
  const favChevron = useRef(new Animated.Value(1)).current;
  const notifChevron = useRef(new Animated.Value(1)).current;
  const prefChevron = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(menuAnim, {
      toValue: menuOpen ? 1 : 0,
      duration: 210,
      useNativeDriver: true,
    }).start();
  }, [menuAnim, menuOpen]);

  useEffect(() => {
    Animated.timing(favChevron, {
      toValue: favoritesOpen ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [favChevron, favoritesOpen]);

  useEffect(() => {
    Animated.timing(notifChevron, {
      toValue: notificationsOpen ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [notifChevron, notificationsOpen]);

  useEffect(() => {
    Animated.timing(prefChevron, {
      toValue: preferencesOpen ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [prefChevron, preferencesOpen]);

  const favoriteArticles = useMemo(
    () => ARTICLES.filter((item) => favorites.includes(item.id)),
    [favorites]
  );

  const profileTitle = firstName ? `SamaWér · ${firstName}` : 'SamaWér';

  const rotateFromAnim = (value: Animated.Value) =>
    value.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

  const toggleWithAnimation = (setter: (value: boolean) => void, current: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter(!current);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerCard}>
            <View style={styles.headerBlurOne} />
            <View style={styles.headerBlurTwo} />

            <View style={styles.headerTopRow}>
              <View style={styles.avatarCard}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{firstName.slice(0, 1).toUpperCase()}</Text>
                </View>
                <View style={styles.badgeSparkle}>
                  <MaterialCommunityIcons
                    name="star-four-points"
                    size={12}
                    color={colors.gold}
                  />
                </View>
              </View>

              <View style={styles.headerActions}>
                <Pressable
                  onPress={() => setMenuOpen((prev) => !prev)}
                  style={({ pressed }) => [styles.settingsButton, pressed && styles.pressedScale]}
                >
                  <Ionicons name="settings-outline" size={18} color={colors.white} />
                </Pressable>
                <View style={styles.securePill}>
                  <Ionicons name="shield-checkmark" size={12} color={colors.white} />
                  <Text style={styles.securePillText}>Session Sécurisée</Text>
                </View>
              </View>
            </View>

            <Text style={styles.headerTitle}>{profileTitle}</Text>
            <Text style={styles.headerSubtitle}>Ton Sanctuaire Personnel</Text>

            <Animated.View
              style={[
                styles.settingsMenu,
                {
                  opacity: menuAnim,
                  transform: [
                    {
                      translateY: menuAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-8, 0],
                      }),
                    },
                    {
                      scale: menuAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.97, 1],
                      }),
                    },
                  ],
                  pointerEvents: menuOpen ? 'auto' : 'none',
                },
              ]}
            >
              <ProfileRowItem
                icon="language"
                title="Changer la langue"
                subtitle="Basculer entre Français et Wolof"
                rightText={language === 'fr' ? 'Français' : 'Wolof'}
                onPress={() => setLanguage(language === 'fr' ? 'wo' : 'fr')}
              />
              <ProfileRowItem
                icon="person-outline"
                title="Modifier mon profil"
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/edit-profile' as never);
                }}
              />
              <ProfileRowItem
                icon="refresh-circle-outline"
                title="Refaire onboarding"
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/onboarding/age' as never);
                }}
              />
              <ProfileRowItem
                icon="log-in-outline"
                title="Connexion / compte"
                subtitle="Se connecter ou créer un compte"
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/login' as never);
                }}
              />
              <ProfileRowItem
                icon="volume-high-outline"
                title="Mode oral"
                subtitle="Lecture vocale des contenus"
                rightText={oralMode ? 'Actif' : 'Off'}
                onPress={toggleOralMode}
              />
            </Animated.View>
          </View>

          <View style={styles.section}>
            <View style={styles.grid2}>
              <ProfileStatCard
                icon="leaf-outline"
                title="Etape de vie"
                value={selectedAge ? `${selectedAge} ans` : 'Non renseigné'}
                subtitle="Mise a jour aujourd'hui"
                onPress={() => router.push('/onboarding/age' as never)}
              />
              <ProfileStatCard
                icon="heart-outline"
                title="Favoris"
                value={`${favorites.length}`}
                subtitle="Articles sauvegardés"
                onPress={() => toggleWithAnimation(setFavoritesOpen, favoritesOpen)}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.grid2}>
              <ProfileStatCard
                icon="fitness-outline"
                title="Profil santé"
                value={userProfile.healthConditions[0] || 'General'}
                subtitle={`${userProfile.healthConditions.length} indicateurs suivis`}
              />
              <ProfileStatCard
                icon="layers-outline"
                title="Mon contexte"
                value={selectedNeeds[0] || 'Non defini'}
                subtitle={`${selectedNeeds.length} besoins actifs`}
                showEdit
                onEditPress={() => router.push('/mon-contexte' as never)}
              />
            </View>
          </View>

          {(selectedGoals.includes('grossesse') || userProfile.pregnancyStatus === 'pregnant') && (
            <View style={styles.section}>
              <View style={styles.singleCardWrap}>
                <ProfileStatCard
                  icon="medical-outline"
                  title="Suivi grossesse"
                  value={
                    userProfile.pregnancyStatus === 'pregnant'
                      ? `${userProfile.pregnancyWeeks || '?'} semaines`
                      : userProfile.pregnancyStatus === 'trying'
                        ? 'Projet de grossesse'
                        : userProfile.pregnancyStatus === 'postpartum'
                          ? 'Post-partum'
                          : 'À renseigner'
                  }
                  subtitle={
                    userProfile.pregnancyStatus === 'pregnant' && userProfile.pregnancyDueDate
                      ? `Terme prévu : ${userProfile.pregnancyDueDate}`
                      : 'Ajoute ton statut et ton terme dans le profil'
                  }
                  showEdit
                  onEditPress={() => router.push('/edit-profile' as never)}
                />
              </View>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.grid2}>
              <ProfileStatCard
                icon="stats-chart-outline"
                title="Statistiques"
                value="72%"
                subtitle="Progression hebdomadaire"
              />
              <ProfileStatCard
                icon="calendar-outline"
                title="Calendrier"
                value="3 rappels"
                subtitle="Cette semaine"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Pressable
              onPress={toggleDiscreteMode}
              style={[styles.discreteCard, discreteMode && styles.discreteCardActive]}
            >
              <View style={styles.discreteLeft}>
                <View style={[styles.discreteIconWrap, discreteMode && styles.discreteIconWrapActive]}>
                  <Ionicons
                    name="eye-off-outline"
                    size={18}
                    color={discreteMode ? colors.white : colors.deepGreen}
                  />
                </View>
                <View style={styles.discreteTextWrap}>
                  <Text style={[styles.discreteTitle, discreteMode && styles.discreteTitleActive]}>
                    Mode Discret
                  </Text>
                  <Text style={[styles.discreteDesc, discreteMode && styles.discreteDescActive]}>
                    Notifications et contenus adoucis pour plus de confidentialité
                  </Text>
                </View>
              </View>

              <View style={[styles.switch, discreteMode && styles.switchOn]}>
                <View style={[styles.switchThumb, discreteMode && styles.switchThumbOn]} />
              </View>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Pressable
              onPress={() => toggleWithAnimation(setFavoritesOpen, favoritesOpen)}
              style={styles.expandHeaderCard}
            >
              <Text style={styles.expandTitle}>Mes Favoris</Text>
              <Animated.View style={{ transform: [{ rotate: rotateFromAnim(favChevron) }] }}>
                <Ionicons name="chevron-down" size={18} color={colors.deepGreen} />
              </Animated.View>
            </Pressable>

            {favoritesOpen && (
              <View style={styles.expandedBodyCard}>
                {favoriteArticles.length === 0 && (
                  <View style={styles.emptyWrap}>
                    <Ionicons name="bookmark-outline" size={20} color={colors.mutedSage} />
                    <Text style={styles.emptyText}>Aucun favori pour le moment.</Text>
                  </View>
                )}

                {favoriteArticles.map((article) => (
                  <View key={article.id} style={styles.favoriteRow}>
                    <Pressable
                      style={styles.favoriteTextWrap}
                      onPress={() => router.push(article.route as never)}
                    >
                      <Text style={styles.favoriteTitle}>{article.title}</Text>
                      <Text style={styles.favoriteMeta}>
                        {article.category} · {article.readTime}
                      </Text>
                    </Pressable>
                    <Pressable onPress={() => removeFavorite(article.id)} style={styles.removeBtn}>
                      <Ionicons name="close" size={16} color={colors.terracotta} />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.notificationsHeaderRow}>
              <Pressable
                style={styles.notificationsHeaderMain}
                onPress={() => toggleWithAnimation(setNotificationsOpen, notificationsOpen)}
              >
                <Text style={styles.expandTitle}>Notifications</Text>
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{unreadCount}</Text>
                </View>
                <Animated.View style={{ transform: [{ rotate: rotateFromAnim(notifChevron) }] }}>
                  <Ionicons name="chevron-down" size={18} color={colors.deepGreen} />
                </Animated.View>
              </Pressable>
              <Pressable
                style={styles.notifGearBtn}
                onPress={() => toggleWithAnimation(setPreferencesOpen, preferencesOpen)}
              >
                <Ionicons name="settings-outline" size={18} color={colors.deepGreen} />
              </Pressable>
            </View>

            {notificationsOpen && (
              <View style={styles.expandedBodyCard}>
                {cycleNotifications.map((item) => (
                  <View key={item.id} style={styles.notifItem}>
                    <View style={styles.notifDot} />
                    <View style={styles.notifTextWrap}>
                      <Text style={styles.notifTitle}>{item.title}</Text>
                      <Text style={styles.notifTime}>{item.time}</Text>
                    </View>
                  </View>
                ))}
                <Pressable style={styles.clearBtn} onPress={clearNotifications}>
                  <Text style={styles.clearBtnText}>Effacer les notifications</Text>
                </Pressable>
              </View>
            )}

            <Pressable
              onPress={() => toggleWithAnimation(setPreferencesOpen, preferencesOpen)}
              style={styles.expandHeaderCard}
            >
              <Text style={styles.expandTitle}>Choisis tes rappels</Text>
              <Animated.View style={{ transform: [{ rotate: rotateFromAnim(prefChevron) }] }}>
                <Ionicons name="chevron-down" size={18} color={colors.deepGreen} />
              </Animated.View>
            </Pressable>

            {preferencesOpen && (
              <View style={[styles.expandedBodyCard, styles.preferencesList]}>
                <NotificationCategoryCard
                  title="Cycle"
                  description="Rappels de suivi et fenetres importantes"
                  enabled={notificationPreferences.cycle.enabled}
                  frequency={notificationPreferences.cycle.frequency as NotificationFrequency}
                  onToggle={() =>
                    setNotificationPreferenceEnabled(
                      'cycle',
                      !notificationPreferences.cycle.enabled
                    )
                  }
                  onChangeFrequency={(value) =>
                    setNotificationPreferenceFrequency('cycle', value)
                  }
                />
                <NotificationCategoryCard
                  title="Medication"
                  description="Rappels de prise et suivi regulier"
                  enabled={notificationPreferences.medication.enabled}
                  frequency={notificationPreferences.medication.frequency as NotificationFrequency}
                  onToggle={() =>
                    setNotificationPreferenceEnabled(
                      'medication',
                      !notificationPreferences.medication.enabled
                    )
                  }
                  onChangeFrequency={(value) =>
                    setNotificationPreferenceFrequency('medication', value)
                  }
                />
                <NotificationCategoryCard
                  title="Bien-etre"
                  description="Hydratation, respiration et repos"
                  enabled={notificationPreferences.wellness.enabled}
                  frequency={notificationPreferences.wellness.frequency as NotificationFrequency}
                  onToggle={() =>
                    setNotificationPreferenceEnabled(
                      'wellness',
                      !notificationPreferences.wellness.enabled
                    )
                  }
                  onChangeFrequency={(value) =>
                    setNotificationPreferenceFrequency('wellness', value)
                  }
                />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Pressable
              onPress={() => router.push('/orientation-sensible' as never)}
              style={styles.orientationCard}
            >
              <View>
                <Text style={styles.orientationTitle}>Orientation sensible</Text>
                <Text style={styles.orientationMeta}>
                  Niveau: {sensitiveOrientation.level} · {sensitiveOrientation.answers} réponses
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.deepGreen} />
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aide & Support</Text>
            <View style={styles.groupCard}>
              <ProfileRowItem
                icon="help-circle-outline"
                title="FAQ & Questions"
                onPress={() => router.push('/faq' as never)}
              />
              <View style={styles.rowDivider} />
              <ProfileRowItem
                icon="book-outline"
                title="Glossaire Santé"
                onPress={() => router.push('/glossaire' as never)}
              />
              <View style={styles.rowDivider} />
              <ProfileRowItem
                icon="chatbubble-ellipses-outline"
                title="Suggestions & Feedback"
                onPress={() => router.push('/feedback' as never)}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.legalStrip}>
              <Ionicons name="lock-closed" size={14} color={colors.deepGreen} />
              <Text style={styles.legalText}>Vos données sont cryptées localement.</Text>
            </View>
          </View>

          <View style={styles.sectionBottom}>
            <Pressable style={styles.dangerBtn}>
              <Text style={styles.dangerText}>Effacer mes données et quitter</Text>
            </Pressable>
          </View>
        </ScrollView>

        {menuOpen && (
          <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />
        )}
      </View>
    </SafeAreaView>
  );
}

export default function ProfilScreen() {
  return <ProfilContent />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  scrollContent: {
    paddingBottom: 34,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 20,
  },
  headerCard: {
    marginHorizontal: 14,
    marginTop: 10,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    paddingBottom: 20,
    backgroundColor: colors.cocoaDark,
    overflow: 'visible',
    zIndex: 25,
  },
  headerBlurOne: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#88695D',
    opacity: 0.26,
    top: -30,
    left: -16,
  },
  headerBlurTwo: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#6F544A',
    opacity: 0.25,
    right: -16,
    top: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarCard: {
    width: 74,
    height: 74,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EFE6D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.deepGreen,
    fontSize: 22,
    fontWeight: '800',
  },
  badgeSparkle: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EADFCF',
  },
  headerActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6C4A40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedScale: {
    opacity: 0.85,
  },
  securePill: {
    height: 28,
    borderRadius: 999,
    paddingHorizontal: 10,
    backgroundColor: '#6C4A40',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securePillText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    marginTop: 4,
    color: '#E8D9CE',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  settingsMenu: {
    position: 'absolute',
    top: 58,
    right: 16,
    width: 268,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EEE4D8',
    paddingVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
    zIndex: 40,
  },
  section: {
    paddingHorizontal: 14,
    marginTop: 12,
  },
  singleCardWrap: {
    width: '100%',
  },
  sectionBottom: {
    paddingHorizontal: 14,
    marginTop: 14,
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.cocoaDark,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  grid2: {
    flexDirection: 'row',
    gap: 10,
  },
  discreteCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.khaki,
    backgroundColor: colors.white,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  discreteCardActive: {
    backgroundColor: colors.terracotta,
    borderColor: colors.terracotta,
  },
  discreteLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 12,
  },
  discreteIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF3F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discreteIconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  discreteTextWrap: {
    flex: 1,
  },
  discreteTitle: {
    color: colors.deepGreen,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  discreteTitleActive: {
    color: colors.white,
  },
  discreteDesc: {
    color: colors.mutedSage,
    fontSize: 12,
    lineHeight: 17,
  },
  discreteDescActive: {
    color: '#FFF7F2',
  },
  switch: {
    width: 46,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#D7CEC0',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  switchOn: {
    backgroundColor: '#9B4E34',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
  },
  expandHeaderCard: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.khaki,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expandTitle: {
    color: colors.cocoaDark,
    fontSize: 16,
    fontWeight: '800',
  },
  expandedBodyCard: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.khaki,
    backgroundColor: colors.white,
    padding: 12,
    gap: 10,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  emptyText: {
    color: colors.mutedSage,
    fontSize: 13,
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECE2D6',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  favoriteTextWrap: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: 14,
    color: colors.deepGreen,
    fontWeight: '700',
    marginBottom: 2,
  },
  favoriteMeta: {
    fontSize: 12,
    color: colors.mutedSage,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FAEFEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationsHeaderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  notificationsHeaderMain: {
    flex: 1,
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.khaki,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeCount: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    backgroundColor: colors.terracotta,
  },
  badgeCountText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  notifGearBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.khaki,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECE2D6',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  notifDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.copper,
  },
  notifTextWrap: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    color: colors.cocoaDark,
    fontWeight: '700',
  },
  notifTime: {
    marginTop: 2,
    fontSize: 12,
    color: colors.mutedSage,
  },
  clearBtn: {
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8EEE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    color: colors.terracotta,
    fontWeight: '800',
    fontSize: 13,
  },
  preferencesList: {
    gap: 8,
  },
  orientationCard: {
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.khaki,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orientationTitle: {
    color: colors.cocoaDark,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 3,
  },
  orientationMeta: {
    color: colors.mutedSage,
    fontSize: 12,
  },
  groupCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.khaki,
    backgroundColor: colors.white,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#EFE6D8',
    marginHorizontal: 12,
  },
  legalStrip: {
    minHeight: 42,
    borderRadius: 14,
    backgroundColor: '#E8F0EB',
    borderWidth: 1,
    borderColor: '#DCE8E1',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  legalText: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: '600',
  },
  dangerBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FAEDEA',
    borderWidth: 1,
    borderColor: '#F0D5CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerText: {
    color: '#8F3529',
    fontSize: 14,
    fontWeight: '800',
  },
});
