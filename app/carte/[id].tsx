import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import NoticeCard from '../../components/NoticeCard';
import { useSpeak } from '../../hooks/usespeak';
import { useApp } from '../../context/appcontext';
import { type Center, type CenterService, CENTERS_DATA } from '../../data/centers';

const BASE = {
  beige: '#F5F1E6',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  gold: '#D4AF37',
  white: '#FFFFFF',
  success: '#4CAF50',
  paper: '#FCFAF6',
  muted: 'rgba(74,47,39,0.65)',
};

type SectionTab = 'info' | 'services' | 'avis';

const COPY = {
  fr: {
    back: 'Retour',
    share: 'Partager',
    call: 'Appeler',
    navigate: 'Naviguer',
    info: 'Informations',
    services: 'Services',
    reviews: 'Avis',
    about: 'À propos',
    openingHours: "Horaires d'ouverture",
    contact: 'Contact',
    specialties: 'Spécialités',
    freeConsult: 'Consultation gratuite',
    accessible: 'Accès PMR',
    insurance: 'Assurance acceptée',
    openUntil: (time: string) => `Ouvert · Ferme à ${time}`,
    closed: 'Fermé actuellement',
    reviewLabel: (count: number) => `${count} avis`,
    centerShared: 'Le centre a été partagé.',
    shareFailed: 'Impossible de partager pour le moment.',
  },
  wo: {
    back: 'Dellu',
    share: 'Bokk',
    call: 'Woo',
    navigate: 'Dem',
    info: 'Xibaar',
    services: 'Services',
    reviews: 'Avis',
    about: 'Ci mbirum',
    openingHours: 'Waxtu yi ubbeeku',
    contact: 'Jokkondiral',
    specialties: 'Spécialités',
    freeConsult: 'Consultation gratuite',
    accessible: 'Accès PMR',
    insurance: 'Assurance aceptée',
    openUntil: (time: string) => `Ubbeeku · Tëj ci ${time}`,
    closed: 'Tëjna léegi',
    reviewLabel: (count: number) => `${count} avis`,
    centerShared: 'Centre bi bokk na.',
    shareFailed: 'Manul bokk leegi.',
  },
} as const;

function getTypeColor(type: Center['type']) {
  if (type === 'Public') return BASE.deepGreen;
  if (type === 'ONG') return BASE.copper;
  return BASE.terracotta;
}

function serviceMeta(icon: CenterService['icon']) {
  switch (icon) {
    case 'medical-outline':
      return { set: 'mci' as const, name: 'stethoscope' };
    case 'baby-outline':
      return { set: 'mci' as const, name: 'baby-face-outline' };
    case 'shield-checkmark-outline':
      return { set: 'mci' as const, name: 'shield-check-outline' };
    case 'heart-outline':
      return { set: 'ion' as const, name: 'heart-outline' };
    case 'people-outline':
      return { set: 'mci' as const, name: 'account-group-outline' };
    case 'chatbubble-ellipses-outline':
      return { set: 'mci' as const, name: 'message-text-outline' };
    case 'leaf-outline':
      return { set: 'mci' as const, name: 'leaf' };
    default:
      return { set: 'ion' as const, name: 'medkit-outline' };
  }
}

function IconBadge({
  service,
  color,
}: {
  service: CenterService;
  color: string;
}) {
  const meta = serviceMeta(service.icon);

  return (
    <View style={[styles.serviceIconWrap, { backgroundColor: `${color}14` }]}>
      {meta.set === 'ion' ? (
        <Ionicons name={meta.name as any} size={20} color={color} />
      ) : (
        <MaterialCommunityIcons name={meta.name as any} size={20} color={color} />
      )}
    </View>
  );
}

export default function CenterDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { discreteMode, oralMode, language, isOffline } = useApp();
  const { speak } = useSpeak();
  const copy = COPY[language];
  const wo = language === 'wo';

  const [activeSection, setActiveSection] = useState<SectionTab>('info');
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslate, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardFade, cardTranslate]);

  const center = useMemo(() => CENTERS_DATA[id ?? '1'] ?? CENTERS_DATA['1'], [id]);
  const typeColor = getTypeColor(center.type);

  const openPhone = async (phone: string) => {
    const telUrl = `tel:${phone.replace(/\s/g, '')}`;
    const supported = await Linking.canOpenURL(telUrl);

    if (!supported) {
      Alert.alert(
        'SaxalWer',
        wo ? 'Manul ubbi woote bi ci appareil bii.' : "Impossible de lancer l'appel sur cet appareil."
      );
      return;
    }

    await Linking.openURL(telUrl);
  };

  const openMaps = async () => {
    if (isOffline) {
      Alert.alert(
        'SaxalWer',
        wo
          ? 'Connexion internet la soxla ngir ubbi itineraire bi ci Maps.'
          : "Une connexion internet est nécessaire pour ouvrir l'itinéraire dans Maps."
      );
      return;
    }

    const query = encodeURIComponent(`${center.name}, ${center.fullAddress}`);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    const supported = await Linking.canOpenURL(mapUrl);

    if (!supported) {
      Alert.alert(
        'SaxalWer',
        wo ? 'Manul ubbi Maps ci appareil bii.' : "Impossible d'ouvrir Maps sur cet appareil."
      );
      return;
    }

    await Linking.openURL(mapUrl);
  };

  const shareCenter = async () => {
    try {
      await Share.share({
        title: center.name,
        message: `${center.name}\n${center.fullAddress}\n${center.phone}`,
      });
      if (oralMode) {
        speak(copy.centerShared);
      }
    } catch {
      Alert.alert(copy.share, copy.shareFailed);
    }
  };

  const readSummary = () => {
    const text = `${center.name}. ${center.location}. ${
      center.isOpen && center.openUntil ? copy.openUntil(center.openUntil) : copy.closed
    }`;
    speak(text);
  };

  const renderReviewStars = (value: number, size = 10) => (
    <View style={styles.reviewStarsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name="star"
          size={size}
          color={BASE.gold}
          style={{ opacity: star <= value ? 1 : 0.2 }}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={[styles.heroMapSurface, discreteMode && styles.discreteLayer]}>
            <View style={styles.mapGridVerticals}>
              {Array.from({ length: 18 }).map((_, index) => (
                <View key={`grid-v-${index}`} style={styles.mapGridVerticalLine} />
              ))}
            </View>
            {Array.from({ length: 10 }).map((_, index) => (
              <View
                key={`grid-h-${index}`}
                style={[
                  styles.mapGridHorizontalLine,
                  { top: `${(index + 1) * 10}%` },
                ]}
              />
            ))}

            <View style={styles.mapPinWrap}>
              <View style={[styles.mapPin, { backgroundColor: typeColor }]}>
                <View style={styles.mapPinCenter} />
              </View>
            </View>

            <View style={styles.heroBottomGradient} />
          </View>

          <View style={styles.heroNavRow}>
            <Pressable
              onPress={() => router.back()}
              style={styles.heroNavButton}
              accessibilityLabel={copy.back}
            >
              <Ionicons name="chevron-back" size={22} color={BASE.deepGreen} />
            </Pressable>

            <View style={styles.heroNavRight}>
              {oralMode ? (
                <Pressable
                  onPress={readSummary}
                  style={styles.heroNavButton}
                  accessibilityLabel="Lire"
                >
                  <Ionicons name="volume-high-outline" size={18} color={BASE.deepGreen} />
                </Pressable>
              ) : null}

              <Pressable
                onPress={() => void shareCenter()}
                style={styles.heroNavButton}
                accessibilityLabel={copy.share}
              >
                <Ionicons name="share-social-outline" size={18} color={BASE.deepGreen} />
              </Pressable>
            </View>
          </View>
        </View>

        <Animated.View
          style={[
            styles.mainCardWrap,
            {
              opacity: cardFade,
              transform: [{ translateY: cardTranslate }],
            },
          ]}
        >
          <View style={[styles.mainCard, discreteMode && styles.discreteLayer]}>
            <View style={styles.paperTexture} />

            <View style={styles.typeStatusRow}>
              <Text style={[styles.typeBadge, { color: typeColor, backgroundColor: `${typeColor}12` }]}>
                {center.type}
              </Text>

              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: center.isOpen ? BASE.success : BASE.terracotta },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: center.isOpen ? BASE.success : BASE.terracotta },
                  ]}
                >
                  {center.isOpen && center.openUntil ? copy.openUntil(center.openUntil) : copy.closed}
                </Text>
              </View>
            </View>

            <Text style={styles.centerName}>{center.name}</Text>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="rgba(74,47,39,0.5)" />
              <Text style={styles.locationText}>{center.fullAddress}</Text>
            </View>

            <View style={styles.ratingDistanceRow}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={BASE.gold} />
                <Text style={styles.ratingValue}>{center.rating}</Text>
                <Text style={styles.ratingCount}>{copy.reviewLabel(center.reviewCount)}</Text>
              </View>

              <View style={styles.distanceRow}>
                <MaterialCommunityIcons name="navigation-variant-outline" size={13} color={BASE.copper} />
                <Text style={styles.distanceText}>{center.distance}</Text>
              </View>
            </View>

            <View style={styles.badgesWrap}>
              {center.languages.map((item) => (
                <View key={item} style={styles.languageBadge}>
                  <Text style={styles.languageBadgeText}>{item}</Text>
                </View>
              ))}

              {center.freeConsultation ? (
                <View style={styles.successBadge}>
                  <Text style={styles.successBadgeText}>{copy.freeConsult}</Text>
                </View>
              ) : null}

              {center.acceptsInsurance ? (
                <View style={styles.neutralBadge}>
                  <Text style={styles.neutralBadgeText}>{copy.insurance}</Text>
                </View>
              ) : null}

              {center.wheelchairAccess ? (
                <View style={styles.neutralBadge}>
                  <Text style={styles.neutralBadgeText}>{copy.accessible}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.actionsRow}>
              <Pressable onPress={() => void openPhone(center.phone)} style={styles.primaryAction}>
                <Ionicons name="call-outline" size={16} color={BASE.white} />
                <Text style={styles.primaryActionText}>{copy.call}</Text>
              </Pressable>

              <Pressable onPress={() => void openMaps()} style={styles.secondaryAction}>
                <MaterialCommunityIcons name="navigation-variant-outline" size={18} color={BASE.copper} />
              </Pressable>
            </View>

            {isOffline ? (
              <NoticeCard
                title={wo ? 'Mode hors ligne' : 'Mode hors ligne'}
                description={
                  wo
                    ? 'Fiche bi nekk na disponible. Ngir ubbi Maps, connexion internet la soxla.'
                    : 'La fiche reste disponible hors ligne. Une connexion internet est nécessaire pour ouvrir Maps.'
                }
                iconName="cloud-offline-outline"
                accentColor={BASE.copper}
                style={styles.offlineHint}
              />
            ) : null}
          </View>
        </Animated.View>

        <View style={styles.tabsRow}>
          {([
            { key: 'info' as const, label: copy.info },
            { key: 'services' as const, label: copy.services },
            { key: 'avis' as const, label: copy.reviews },
          ]).map((tab) => {
            const active = activeSection === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveSection(tab.key)}
                style={[styles.tabButton, active && styles.tabButtonActive]}
              >
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionPad}>
          {activeSection === 'info' ? (
            <View style={styles.stack}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>{copy.about}</Text>
                <Text style={styles.sectionParagraph}>{center.description}</Text>
              </View>

              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="time-outline" size={16} color={BASE.deepGreen} />
                  <Text style={styles.sectionTitle}>{copy.openingHours}</Text>
                </View>

                {center.hours.map((hour, index) => (
                  <View
                    key={`${hour.day}-${index}`}
                    style={[
                      styles.hourRow,
                      index < center.hours.length - 1 && styles.hourRowBorder,
                    ]}
                  >
                    <Text style={styles.hourDay}>{hour.day}</Text>
                    <Text style={[styles.hourTime, hour.time === 'Fermé' && styles.hourTimeClosed]}>
                      {wo && hour.time === 'Fermé' ? 'Tëjna' : hour.time}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>{copy.contact}</Text>

                <Pressable onPress={() => void openPhone(center.phone)} style={styles.contactRow}>
                  <View style={styles.contactIconWrap}>
                    <Ionicons name="call-outline" size={16} color={BASE.deepGreen} />
                  </View>
                  <Text style={styles.contactText}>{center.phone}</Text>
                </Pressable>

                {center.phoneAlt ? (
                  <Pressable onPress={() => void openPhone(center.phoneAlt!)} style={styles.contactRow}>
                    <View style={styles.contactIconWrapMuted}>
                      <Ionicons name="call-outline" size={16} color={BASE.cocoa} />
                    </View>
                    <Text style={styles.contactTextMuted}>{center.phoneAlt}</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          ) : null}

          {activeSection === 'services' ? (
            <View style={styles.stack}>
              {center.services.map((service, index) => (
                <Animated.View
                  key={`${service.label}-${index}`}
                  style={[
                    styles.serviceCard,
                    {
                      opacity: cardFade,
                      transform: [{ translateX: cardTranslate.interpolate({
                        inputRange: [0, 20],
                        outputRange: [0, -6],
                      }) }],
                    },
                  ]}
                >
                  <IconBadge service={service} color={BASE.deepGreen} />
                  <View style={styles.serviceTextWrap}>
                    <Text style={styles.serviceLabel}>{service.label}</Text>
                  </View>
                  <Ionicons name="checkmark-circle-outline" size={18} color="rgba(26,60,52,0.4)" />
                </Animated.View>
              ))}

              <View style={styles.tagsArea}>
                <Text style={styles.tagsHeader}>{copy.specialties.toUpperCase()}</Text>
                <View style={styles.tagsWrap}>
                  {center.tags.map((tag) => (
                    <View key={tag} style={styles.tagPill}>
                      <Text style={styles.tagPillText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : null}

          {activeSection === 'avis' ? (
            <View style={styles.stack}>
              <View style={styles.ratingSummaryCard}>
                <View style={styles.ratingBigWrap}>
                  <Text style={styles.ratingBigValue}>{center.rating}</Text>
                  {renderReviewStars(Math.round(center.rating), 12)}
                  <Text style={styles.ratingBigCount}>{copy.reviewLabel(center.reviewCount)}</Text>
                </View>

                <View style={styles.ratingBarsWrap}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === 5 ? 65 : star === 4 ? 25 : star === 3 ? 7 : star === 2 ? 2 : 1;
                    return (
                      <View key={star} style={styles.ratingBarRow}>
                        <Text style={styles.ratingBarLabel}>{star}</Text>
                        <View style={styles.ratingBarTrack}>
                          <View style={[styles.ratingBarFill, { width: `${pct}%` }]} />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {center.reviews.map((review, index) => (
                <View key={`${review.name}-${index}`} style={styles.reviewCard}>
                  <View style={styles.reviewTopRow}>
                    <View style={styles.reviewIdentity}>
                      <View style={styles.reviewAvatar}>
                        <Text style={styles.reviewAvatarText}>{review.name.charAt(0)}</Text>
                      </View>
                      <View>
                        <Text style={styles.reviewName}>{review.name}</Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                    </View>

                    {renderReviewStars(review.rating)}
                  </View>

                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  scroll: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  discreteLayer: {
    opacity: 0.38,
  },
  hero: {
    position: 'relative',
    height: 220,
  },
  heroMapSurface: {
    flex: 1,
    backgroundColor: '#DDD8C8',
    overflow: 'hidden',
  },
  mapGridVerticals: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    opacity: 0.06,
  },
  mapGridVerticalLine: {
    flex: 1,
    borderLeftWidth: 0.5,
    borderLeftColor: BASE.cocoa,
  },
  mapGridHorizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: BASE.cocoa,
    opacity: 0.06,
  },
  mapPinWrap: {
    position: 'absolute',
    top: '35%',
    left: '40%',
    marginTop: -36,
    marginLeft: -20,
  },
  mapPin: {
    width: 40,
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  mapPinCenter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: BASE.white,
    transform: [{ rotate: '45deg' }],
  },
  heroBottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 84,
    backgroundColor: 'rgba(245,241,230,0.95)',
  },
  heroNavRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroNavRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroNavButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCardWrap: {
    paddingHorizontal: 24,
    marginTop: -30,
    zIndex: 2,
  },
  mainCard: {
    backgroundColor: BASE.white,
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    overflow: 'hidden',
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  paperTexture: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BASE.cocoa,
    opacity: 0.015,
  },
  typeStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  centerName: {
    fontSize: 31,
    lineHeight: 37,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: BASE.muted,
  },
  ratingDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingValue: {
    color: BASE.cocoa,
    fontSize: 14,
    fontWeight: '700',
  },
  ratingCount: {
    color: 'rgba(74,47,39,0.5)',
    fontSize: 11,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: BASE.copper,
  },
  badgesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  languageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(26,60,52,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.1)',
  },
  languageBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: BASE.deepGreen,
  },
  successBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(76,175,80,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.15)',
  },
  successBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: BASE.success,
  },
  neutralBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(74,47,39,0.08)',
  },
  neutralBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: BASE.cocoa,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  offlineHint: {
    marginTop: 12,
  },
  primaryAction: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: BASE.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: BASE.deepGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
  primaryActionText: {
    color: BASE.white,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryAction: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(181,98,42,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: BASE.deepGreen,
  },
  tabLabel: {
    color: 'rgba(74,47,39,0.6)',
    fontSize: 13,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: BASE.deepGreen,
    fontWeight: '700',
  },
  sectionPad: {
    paddingHorizontal: 24,
  },
  stack: {
    gap: 16,
  },
  sectionCard: {
    backgroundColor: BASE.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  sectionTitle: {
    color: BASE.deepGreen,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  sectionParagraph: {
    color: 'rgba(74,47,39,0.78)',
    fontSize: 13,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  hourRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26,60,52,0.06)',
  },
  hourDay: {
    color: BASE.cocoa,
    fontSize: 13,
    fontWeight: '500',
  },
  hourTime: {
    color: BASE.deepGreen,
    fontSize: 13,
    fontWeight: '600',
  },
  hourTimeClosed: {
    color: BASE.terracotta,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  contactIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(26,60,52,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactIconWrapMuted: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(74,47,39,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: {
    color: BASE.deepGreen,
    fontSize: 14,
    fontWeight: '500',
  },
  contactTextMuted: {
    color: BASE.cocoa,
    fontSize: 14,
    fontWeight: '500',
  },
  serviceCard: {
    backgroundColor: BASE.white,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTextWrap: {
    flex: 1,
  },
  serviceLabel: {
    color: BASE.deepGreen,
    fontSize: 14,
    fontWeight: '600',
  },
  tagsArea: {
    marginTop: 4,
  },
  tagsHeader: {
    color: 'rgba(74,47,39,0.6)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 10,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(26,60,52,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.12)',
  },
  tagPillText: {
    color: BASE.deepGreen,
    fontSize: 11,
    fontWeight: '500',
  },
  ratingSummaryCard: {
    backgroundColor: BASE.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  ratingBigWrap: {
    width: 90,
    alignItems: 'center',
  },
  ratingBigValue: {
    color: BASE.deepGreen,
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 40,
  },
  ratingBigCount: {
    color: 'rgba(74,47,39,0.6)',
    fontSize: 10,
    marginTop: 4,
  },
  ratingBarsWrap: {
    flex: 1,
    gap: 6,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingBarLabel: {
    width: 8,
    color: 'rgba(74,47,39,0.6)',
    fontSize: 10,
  },
  ratingBarTrack: {
    flex: 1,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(74,47,39,0.08)',
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: 5,
    borderRadius: 999,
    backgroundColor: BASE.gold,
  },
  reviewCard: {
    backgroundColor: BASE.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  reviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(26,60,52,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: {
    color: BASE.deepGreen,
    fontSize: 14,
    fontWeight: '700',
  },
  reviewName: {
    color: BASE.deepGreen,
    fontSize: 13,
    fontWeight: '600',
  },
  reviewDate: {
    color: 'rgba(74,47,39,0.5)',
    fontSize: 10,
    marginTop: 2,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reviewText: {
    color: 'rgba(74,47,39,0.76)',
    fontSize: 13,
    lineHeight: 21,
  },
});
