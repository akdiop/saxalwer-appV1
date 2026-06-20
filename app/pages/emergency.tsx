import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React from 'react';
import {
  Animated,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useApp, type Language } from '../../context/appcontext';

const BASE = {
  beige: '#F5F1E6',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  gold: '#D4AF37',
  white: '#FFFFFF',
};

type Contact = {
  name: string;
  number: string;
  telNumber: string;
  desc: string;
  urgent: boolean;
};

type GuideSection = {
  key: string;
  title: Record<Language, string>;
  icon: React.ComponentProps<typeof Feather>['name'];
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
  steps: Record<Language, string[]>;
};

const CONTACTS: Contact[] = [
  {
    name: 'SAMU National',
    number: '1515',
    telNumber: 'tel:1515',
    desc: 'Assistance médicale urgente 24h/24, gratuite.',
    urgent: true,
  },
  {
    name: 'Sapeurs Pompiers',
    number: '18',
    telNumber: 'tel:18',
    desc: 'Sénégal - Urgences médicales et secours.',
    urgent: true,
  },
  {
    name: 'Police Secours',
    number: '17',
    telNumber: 'tel:17',
    desc: 'En cas de danger immédiat ou de violence.',
    urgent: true,
  },
  {
    name: 'Centre Roi Baudouin',
    number: '33 837 00 00',
    telNumber: 'tel:+221338370000',
    desc: 'Urgences gynécologiques, Guédiawaye.',
    urgent: false,
  },
  {
    name: 'Clinique de la Paix',
    number: '33 821 12 12',
    telNumber: 'tel:+221338211212',
    desc: "Plateau technique gynécologique d'urgence.",
    urgent: false,
  },
  {
    name: 'Marie Stopes Senegal',
    number: '800 00 84 84',
    telNumber: 'tel:+221800008484',
    desc: 'Ligne gratuite - conseils en santé reproductive.',
    urgent: false,
  },
];

const GUIDE_SECTIONS: GuideSection[] = [
  {
    key: 'bleeding',
    title: {
      fr: 'Saignement abondant',
      wo: 'Deverse bu bari',
    },
    icon: 'alert-triangle',
    accentColor: BASE.terracotta,
    backgroundColor: BASE.beige,
    borderColor: 'rgba(181,98,42,0.16)',
    steps: {
      fr: [
        'Allonger la personne et surelever les jambes',
        'Appeler le 1515 immédiatement',
        'Ne pas bouger, attendre les secours',
        'Rassurer, ne pas laisser seule',
      ],
      wo: [
        'Noppi ak ligge bu set',
        'Jappale 1515 gaaw-gaaw',
        'Bul doxe, attane tabax',
        'Rassureel ko, bul bayi mu nekk rekkam',
      ],
    },
  },
  {
    key: 'pain',
    title: {
      fr: 'Douleurs violentes',
      wo: 'Metit yu gena njool',
    },
    icon: 'heart',
    accentColor: BASE.terracotta,
    backgroundColor: BASE.beige,
    borderColor: 'rgba(181,98,42,0.16)',
    steps: {
      fr: [
        'Installer en position confortable',
        'Appeler un centre de santé ou le 1515',
        'Ne pas donner de médicament sans avis médical',
        'Surveiller et rassurer',
      ],
      wo: [
        'Noppi ci position bu am ngelaw',
        'Jappale ker wu jamm wala 1515',
        'Bul jox medicament bu nekk',
        'Sama xol ko te rassureel ko',
      ],
    },
  },
  {
    key: 'consciousness',
    title: {
      fr: 'Perte de connaissance',
      wo: 'Fas ak xel',
    },
    icon: 'activity',
    accentColor: BASE.terracotta,
    backgroundColor: BASE.beige,
    borderColor: 'rgba(181,98,42,0.16)',
    steps: {
      fr: [
        'Mettre en position laterale de securite (PLS)',
        'Appeler le 1515 immediatement',
        'Verifier respiration et pouls',
        'Ne pas laisser seule et ne rien donner a boire',
      ],
      wo: [
        'Noppi ci saagante (PLS)',
        'Jappale 1515 gaaw',
        'Woor respiration ak pouls',
        'Bul bayi mu nekk doomu boppam te bul ko jox lu muy naan',
      ],
    },
  },
  {
    key: 'violence',
    title: {
      fr: 'Violence ou agression',
      wo: 'Jawwu wala yef',
    },
    icon: 'shield',
    accentColor: BASE.deepGreen,
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderColor: 'rgba(212,175,55,0.25)',
    steps: {
      fr: [
        'Appeler le 17 (Police) en urgence',
        'Se rendre dans un lieu sur',
        'Ne pas detruire les preuves (vetements, etc.)',
        'Se rendre dans un centre de sante pour certificat medical',
      ],
      wo: [
        'Jappale 17 (Police) ci kaarange',
        'Dem ci bereb bu am kaarange',
        'Bul saxe preuve yi',
        'Dem ci ker wu jamm ngir certificat medical',
      ],
    },
  },
];

const COPY: Record<
  Language,
  {
    headerTitle: string;
    headerSubtitle: string;
    emergencyTitle: string;
    warning: string;
    nearby: string;
    nearbyHint: string;
    guideTitle: string;
    guideHint: string;
    contactsTitle: string;
    urgentBadge: string;
    audioTitle: string;
    audioSubtitle: string;
    guideModalTitle: string;
    guideModalSubtitle: string;
    guideNotice: string;
  }
> = {
  fr: {
    headerTitle: "Centre d'Urgence",
    headerSubtitle: 'Assistance immediate et contacts de secours',
    emergencyTitle: 'Urgences',
    warning: 'En cas de danger immediat, appuie sur un numero ci-dessous pour appeler directement.',
    nearby: 'Maternite Proche',
    nearbyHint: 'Voir les centres',
    guideTitle: 'Guide de Secours',
    guideHint: 'Gestes de 1ers soins',
    contactsTitle: 'Contacts de secours',
    urgentBadge: 'Urgence',
    audioTitle: 'Assistance Vocale',
    audioSubtitle: 'Consignes de securite en Wolof',
    guideModalTitle: 'Guide de Secours',
    guideModalSubtitle: 'Gestes de premiers soins pour les urgences de sante reproductive.',
    guideNotice:
      "En cas d'urgence grave, toujours appeler le 1515 ou se rendre au centre de sante le plus proche. N'hesite jamais !",
  },
  wo: {
    headerTitle: 'Centre d`Urgence',
    headerSubtitle: 'Ndimbal bu gaaw ak numero yu jafe-jafe',
    emergencyTitle: 'Urgences',
    warning: 'Su amee danger bu gaaw, bessel ci benn numero ci suuf ngir woyofal ci yoon wu gaaw.',
    nearby: 'Maternite Proche',
    nearbyHint: 'Xool centres yi',
    guideTitle: 'Guide ndimbal',
    guideHint: 'Gestes yu jekk',
    contactsTitle: 'Contacts de secours',
    urgentBadge: 'Urgence',
    audioTitle: 'Assistance Vocale',
    audioSubtitle: 'Ndigali kaarange ci Wolof',
    guideModalTitle: 'Guide Ndimbal',
    guideModalSubtitle: 'Gestes yu jekk ci waxtu yu gena njool ci weru reproductive.',
    guideNotice:
      'Ci lepp waxtu yu gena njool, jappale 1515 wala dem ci ker wu jamm bu jege gaaw-gaaw. Bul ragal!',
  },
};

function GuideCard({
  section,
  language,
}: {
  section: GuideSection;
  language: Language;
}) {
  return (
    <View
      style={[
        styles.guideCard,
        {
          backgroundColor: section.backgroundColor,
          borderColor: section.borderColor,
        },
      ]}
    >
      <View style={styles.guideTitleRow}>
        <Feather name={section.icon} size={18} color={section.accentColor} />
        <Text style={[styles.guideCardTitle, { color: section.accentColor }]}>
          {section.title[language]}
        </Text>
      </View>

      {section.steps[language].map((step, index) => (
        <View key={`${section.key}-${index}`} style={styles.guideStepRow}>
          <Text style={styles.guideBullet}>{'\u2022'}</Text>
          <Text style={styles.guideStepText}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

export default function EmergencyScreen() {
  const router = useRouter();
  const { language, oralMode, toggleOralMode } = useApp();
  const copy = COPY[language];

  const [showGuide, setShowGuide] = React.useState(false);

  const pulseAnim = React.useRef(new Animated.Value(0.9)).current;
  const arrowAnim = React.useRef(new Animated.Value(0)).current;
  const guideTranslateY = React.useRef(new Animated.Value(520)).current;
  const guideOverlay = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.22,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.9,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    const arrow = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(arrowAnim, {
          toValue: 0,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    arrow.start();

    return () => {
      pulse.stop();
      arrow.stop();
      Speech.stop();
    };
  }, [arrowAnim, pulseAnim]);

  React.useEffect(() => {
    if (showGuide) {
      Animated.parallel([
        Animated.timing(guideOverlay, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(guideTranslateY, {
          toValue: 0,
          damping: 26,
          stiffness: 240,
          mass: 0.9,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    guideOverlay.setValue(0);
    guideTranslateY.setValue(520);
  }, [guideOverlay, guideTranslateY, showGuide]);

  const arrowTranslate = arrowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
  });

  const speakText = React.useCallback(
    (text: string) => {
      if (!oralMode) return;

      Speech.stop();
      Speech.speak(text, {
        language: 'fr-FR',
        rate: 0.85,
      });
    },
    [oralMode]
  );

  const openDialer = React.useCallback(async (telNumber: string) => {
    try {
      await Linking.openURL(telNumber);
    } catch {
      // Swallow dialer failures to keep the emergency screen resilient.
    }
  }, []);

  const handleOpenContact = React.useCallback(
    async (contact: Contact) => {
      speakText(`${contact.name}. ${contact.desc}`);
      await openDialer(contact.telNumber);
    },
    [openDialer, speakText]
  );

  const closeGuide = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(guideOverlay, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(guideTranslateY, {
        toValue: 520,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setShowGuide(false);
      }
    });
  }, [guideOverlay, guideTranslateY]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.headerPulse,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />

          <View style={styles.headerTopRow}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Feather name="chevron-left" size={20} color={BASE.white} />
            </Pressable>

            <View style={styles.headerIconWrap}>
              <MaterialCommunityIcons
                name="shield-alert-outline"
                size={28}
                color={BASE.white}
              />
            </View>
          </View>

          <Text style={styles.headerTitle}>{copy.headerTitle}</Text>
          <Text style={styles.headerSubtitle}>{copy.headerSubtitle}</Text>
        </View>

        <View style={styles.content}>
          <Pressable
            onPress={() => openDialer('tel:1515')}
            style={({ pressed }) => [
              styles.emergencyCard,
              pressed ? styles.cardPressed : null,
            ]}
          >
            <View style={styles.emergencyIconWrap}>
              <Feather name="phone" size={28} color={BASE.white} />
            </View>

            <View style={styles.emergencyTextWrap}>
              <Text style={styles.emergencyTitle}>{copy.emergencyTitle}</Text>
              <Text style={styles.emergencyNumber}>1515</Text>
            </View>

            <Animated.View
              style={[
                styles.emergencyArrowWrap,
                {
                  transform: [{ translateX: arrowTranslate }],
                },
              ]}
            >
              <Feather name="arrow-right" size={22} color={BASE.terracotta} />
            </Animated.View>
          </Pressable>

          <View style={styles.warningBanner}>
            <Feather name="alert-triangle" size={16} color={BASE.gold} />
            <Text style={styles.warningText}>{copy.warning}</Text>
          </View>

          <View style={styles.infoGrid}>
            <Pressable
              onPress={() => router.push('/carte' as any)}
              style={({ pressed }) => [styles.infoCard, pressed ? styles.cardPressed : null]}
            >
              <View style={styles.infoIconCircle}>
                <Feather name="map-pin" size={22} color={BASE.deepGreen} />
              </View>
              <Text style={styles.infoTitle}>{copy.nearby}</Text>
              <Text style={styles.infoSubtitle}>{copy.nearbyHint}</Text>
            </Pressable>

            <Pressable
              onPress={() => setShowGuide(true)}
              style={({ pressed }) => [styles.infoCard, pressed ? styles.cardPressed : null]}
            >
              <View style={styles.infoIconCircle}>
                <MaterialCommunityIcons
                  name="heart-pulse"
                  size={22}
                  color={BASE.deepGreen}
                />
              </View>
              <Text style={styles.infoTitle}>{copy.guideTitle}</Text>
              <Text style={styles.infoSubtitle}>{copy.guideHint}</Text>
            </Pressable>
          </View>

          <View style={styles.contactsHeaderRow}>
            <Text style={styles.contactsTitle}>{copy.contactsTitle}</Text>
            <Feather name="shield" size={18} color={BASE.terracotta} />
          </View>

          <View style={styles.contactsList}>
            {CONTACTS.map((contact) => (
              <Pressable
                key={contact.name}
                onPress={() => handleOpenContact(contact)}
                style={({ pressed }) => [
                  styles.contactCard,
                  contact.urgent ? styles.contactCardUrgent : null,
                  pressed ? styles.cardPressed : null,
                ]}
              >
                <View style={styles.contactBackgroundTexture} />

                <View style={styles.contactLeft}>
                  <View style={styles.contactTitleRow}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    {contact.urgent ? (
                      <View style={styles.urgentBadge}>
                        <Text style={styles.urgentBadgeText}>{copy.urgentBadge}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.contactDesc}>{contact.desc}</Text>
                </View>

                <View
                  style={[
                    styles.phonePill,
                    contact.urgent ? styles.phonePillUrgent : null,
                  ]}
                >
                  <Feather
                    name="phone"
                    size={14}
                    color={contact.urgent ? BASE.terracotta : BASE.deepGreen}
                  />
                  <Text
                    style={[
                      styles.phoneText,
                      contact.urgent ? styles.phoneTextUrgent : null,
                    ]}
                  >
                    {contact.number}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={toggleOralMode}
            style={({ pressed }) => [styles.audioBanner, pressed ? styles.cardPressed : null]}
          >
            <View style={styles.audioIconCircle}>
              <Feather name="volume-2" size={22} color={BASE.white} />
            </View>

            <View style={styles.audioTextWrap}>
              <Text style={styles.audioTitle}>{copy.audioTitle}</Text>
              <Text style={styles.audioSubtitle}>
                {copy.audioSubtitle}
                {oralMode ? ' - ON' : ' - OFF'}
              </Text>
            </View>

            <Feather name="play" size={18} color="rgba(255,255,255,0.45)" />
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={showGuide}
        transparent
        animationType="none"
        onRequestClose={closeGuide}
      >
        <Pressable style={styles.modalRoot} onPress={closeGuide}>
          <Animated.View style={[styles.modalOverlay, { opacity: guideOverlay }]} />

          <Animated.View
            style={[
              styles.modalSheet,
              {
                transform: [{ translateY: guideTranslateY }],
              },
            ]}
          >
            <Pressable onPress={(event) => event.stopPropagation()} style={styles.modalInner}>
              <Pressable onPress={closeGuide} style={styles.closeButton}>
                <Feather name="x" size={18} color={BASE.deepGreen} />
              </Pressable>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
              >
                <View style={styles.modalHeaderIcon}>
                  <MaterialCommunityIcons
                    name="heart-pulse"
                    size={28}
                    color={BASE.terracotta}
                  />
                </View>

                <Text style={styles.modalTitle}>{copy.guideModalTitle}</Text>
                <Text style={styles.modalSubtitle}>{copy.guideModalSubtitle}</Text>

                <View style={styles.modalGuideList}>
                  {GUIDE_SECTIONS.map((section) => (
                    <GuideCard key={section.key} section={section} language={language} />
                  ))}
                </View>

                <View style={styles.noticeCard}>
                  <Feather
                    name="alert-triangle"
                    size={18}
                    color={BASE.terracotta}
                    style={styles.noticeIcon}
                  />
                  <Text style={styles.noticeText}>{copy.guideNotice}</Text>
                </View>
              </ScrollView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    backgroundColor: BASE.terracotta,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 48,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    shadowColor: BASE.terracotta,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  headerPulse: {
    position: 'absolute',
    top: -80,
    left: -40,
    right: -40,
    bottom: -80,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 220,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  headerTitle: {
    fontSize: 31,
    lineHeight: 34,
    fontWeight: '700',
    color: BASE.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.82)',
  },
  content: {
    paddingHorizontal: 24,
    marginTop: -28,
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    backgroundColor: BASE.white,
    borderRadius: 32,
    padding: 24,
    marginBottom: 20,
    shadowColor: BASE.deepGreen,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(181,98,42,0.14)',
  },
  emergencyIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BASE.terracotta,
    shadowColor: BASE.terracotta,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  emergencyTextWrap: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 2,
  },
  emergencyNumber: {
    fontSize: 30,
    fontWeight: '800',
    color: BASE.terracotta,
    letterSpacing: -0.6,
  },
  emergencyArrowWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(166,93,64,0.08)',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: BASE.cocoa,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 26,
  },
  infoCard: {
    flex: 1,
    backgroundColor: BASE.white,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.1)',
    shadowColor: BASE.copper,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  infoIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BASE.beige,
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    color: BASE.deepGreen,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 10,
    lineHeight: 14,
    color: 'rgba(74,47,39,0.55)',
    textAlign: 'center',
  },
  contactsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  contactsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: BASE.deepGreen,
  },
  contactsList: {
    gap: 10,
  },
  contactCard: {
    backgroundColor: BASE.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  contactCardUrgent: {
    borderWidth: 1.5,
    borderColor: 'rgba(166,93,64,0.2)',
  },
  contactBackgroundTexture: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    backgroundColor: BASE.cocoa,
  },
  contactLeft: {
    flex: 1,
    paddingRight: 12,
  },
  contactTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: BASE.deepGreen,
  },
  urgentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(166,93,64,0.08)',
  },
  urgentBadgeText: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: BASE.terracotta,
  },
  contactDesc: {
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(74,47,39,0.72)',
    maxWidth: 210,
  },
  phonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: BASE.beige,
  },
  phonePillUrgent: {
    backgroundColor: 'rgba(166,93,64,0.08)',
  },
  phoneText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: BASE.deepGreen,
  },
  phoneTextUrgent: {
    color: BASE.terracotta,
  },
  audioBanner: {
    marginTop: 24,
    backgroundColor: BASE.deepGreen,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: BASE.deepGreen,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  audioIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  audioTextWrap: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BASE.white,
    marginBottom: 2,
  },
  audioSubtitle: {
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(255,255,255,0.68)',
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    backgroundColor: BASE.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalInner: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BASE.beige,
    zIndex: 2,
  },
  modalScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
  },
  modalHeaderIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(166,93,64,0.08)',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(74,47,39,0.72)',
    marginBottom: 18,
  },
  modalGuideList: {
    gap: 16,
  },
  guideCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  guideTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  guideCardTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
  },
  guideStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  guideBullet: {
    fontSize: 14,
    lineHeight: 20,
    color: BASE.cocoa,
    marginRight: 8,
  },
  guideStepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: BASE.cocoa,
  },
  noticeCard: {
    marginTop: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.2)',
    backgroundColor: 'rgba(166,93,64,0.08)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noticeIcon: {
    marginTop: 1,
    marginRight: 10,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: BASE.cocoa,
  },
});
