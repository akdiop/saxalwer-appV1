import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    COMMUNITY_COLORS,
    CommunityProfile,
    DEFAULT_COMMUNITY_PROFILE,
    THEMATIC_ROOMS,
} from '../../data/community';
import { getCommunityProfile, saveCommunityProfile } from '../../utils/communityApi';
import { useApp } from '../../context/appcontext';
import { useSpeak } from '../../hooks/usespeak';

const TEXT = {
  fr: {
    title: 'Espace de discussion',
    subtitle: 'Connecte-toi avec des femmes qui te comprennent',
    secureTitle: 'Espace sécurisé et confidentiel',
    secureDesc:
      "Tes échanges sont privés. Tu peux choisir d'être anonyme. Signale tout message inapproprié.",
    thematic: 'Salons thématiques',
    profileTitle: 'Profil communautaire',
    profileDesc: 'Choisis ce que tu partages avec la communauté',
    pseudoLabel: 'Pseudonyme (optionnel)',
    pseudoPlaceholder: 'Ex: Fatoumata_2024, Khady, etc.',
    pseudoHint:
      "Si tu ne choisis pas de pseudonyme, ton nom de profil sera utilisé. Tu peux basculer en mode anonyme à tout moment.",
    visibleInfo: 'Informations visibles',
    showAge: 'Afficher mon âge',
    showSituation: 'Afficher ma situation',
    showNeeds: 'Afficher mes besoins',
    empty: 'Non renseigné',
    emptyFemale: 'Non renseignée',
    privacyHint:
      "Ces informations sont facultatives et t'aident à te connecter avec d'autres femmes dans des situations similaires. Tu peux les modifier à tout moment.",
    save: 'Enregistrer',
  },
  wo: {
    title: 'Bereb bu wax',
    subtitle: 'Jappale jigeen nu la xam',
    secureTitle: 'Bereb bu jafe te sutura',
    secureDesc: 'Sa wax yi sutura na. Men nga tannal anonyme. Signale lekku bu bees.',
    thematic: 'Salons yi',
    profileTitle: 'Profil communautaire',
    profileDesc: 'Tannal lu nga begg wax ak communaute bi',
    pseudoLabel: 'Pseudonyme (bu nekk)',
    pseudoPlaceholder: 'Misaal: Fatoumata_2024, Khady...',
    pseudoHint:
      'Su tannalee pseudonyme, sa tur ci profil bi dina nu jefandikoo. Men nga soppi ci anonyme wakhtukoy.',
    visibleInfo: 'Xetu yu gem',
    showAge: 'Wone sama at',
    showSituation: 'Wone sama waxtu',
    showNeeds: 'Wone suma soxla',
    empty: 'Amul',
    emptyFemale: 'Amul',
    privacyHint:
      'Xetu yi dagnu la jox ngir jappale jigéen yu am waxtu bu mel ni sa yow. Men nga soppi ko kenn wakhtukoy.',
    save: 'Teg',
  },
} as const;

export default function CommunityRoomsScreen() {
  const router = useRouter();
  const { language, oralMode, selectedAge, lifeSituation, selectedNeeds } = useApp();
  const { speak } = useSpeak();

  const copy = TEXT[language];
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [communityProfile, setCommunityProfile] = useState<CommunityProfile>(DEFAULT_COMMUNITY_PROFILE);

  useEffect(() => {
    getCommunityProfile().then(setCommunityProfile).catch(() => setCommunityProfile(DEFAULT_COMMUNITY_PROFILE));
  }, []);

  const needsSummary = useMemo(() => {
    if (!selectedNeeds || selectedNeeds.length === 0) {
      return copy.empty;
    }

    return selectedNeeds.join(', ');
  }, [copy.empty, selectedNeeds]);

  const saveProfile = async () => {
    await saveCommunityProfile(communityProfile);
    setShowProfileSettings(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerCircleButton}>
            <Ionicons name="chevron-back" size={22} color={COMMUNITY_COLORS.beige} />
          </Pressable>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>{copy.title}</Text>
            <Text style={styles.headerSubtitle}>{copy.subtitle}</Text>
          </View>

          <Pressable onPress={() => setShowProfileSettings(true)} style={styles.headerCircleButtonCopper}>
            <Ionicons name="settings-outline" size={19} color={COMMUNITY_COLORS.warmWhite} />
          </Pressable>

          {oralMode ? (
            <Pressable
              onPress={() => speak(copy.title)}
              style={[styles.headerCircleButtonCopper, styles.headerCircleButtonVoice]}
            >
              <Ionicons name="volume-high-outline" size={19} color={COMMUNITY_COLORS.warmWhite} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.privacyNotice}>
            <Ionicons name="lock-closed-outline" size={20} color={COMMUNITY_COLORS.deepGreen} style={styles.noticeIcon} />
            <View style={styles.noticeTextWrap}>
              <Text style={styles.noticeTitle}>{copy.secureTitle}</Text>
              <Text style={styles.noticeDesc}>{copy.secureDesc}</Text>
            </View>
          </View>

          <Text style={styles.thematicTitle}>{copy.thematic}</Text>

          <View style={styles.roomsWrap}>
            {THEMATIC_ROOMS.map((room) => (
              <Pressable
                key={room.id}
                onPress={() => {
                  router.push(`/communaute/${room.id}` as never);
                  if (oralMode) {
                    speak(language === 'fr' ? room.titleFr : room.titleWo);
                  }
                }}
                style={({ pressed }) => [
                  styles.roomCard,
                  { borderColor: `${room.color}40` },
                  pressed && styles.roomCardPressed,
                ]}
              >
                <View style={[styles.roomIconWrap, { backgroundColor: `${room.color}22` }]}>
                  <Ionicons name={room.iconName} size={24} color={room.color} />
                </View>

                <View style={styles.roomTextWrap}>
                  <Text style={styles.roomTitle}>{language === 'fr' ? room.titleFr : room.titleWo}</Text>
                  <Text style={styles.roomDesc}>{language === 'fr' ? room.descFr : room.descWo}</Text>
                </View>

                <Ionicons name="chatbubble-ellipses-outline" size={20} color={room.color} />
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent
          visible={showProfileSettings}
          onRequestClose={() => setShowProfileSettings(false)}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setShowProfileSettings(false)}>
            <Pressable style={styles.modalSheet} onPress={() => undefined}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>{copy.profileTitle}</Text>
                  <Text style={styles.modalSubtitle}>{copy.profileDesc}</Text>
                </View>
                <Pressable onPress={() => setShowProfileSettings(false)} style={styles.modalCloseButton}>
                  <Ionicons name="close" size={20} color={COMMUNITY_COLORS.deepGreen} />
                </Pressable>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.inputLabel}>{copy.pseudoLabel}</Text>
                <TextInput
                  value={communityProfile.pseudonym}
                  onChangeText={(value) =>
                    setCommunityProfile((prev) => ({
                      ...prev,
                      pseudonym: value,
                    }))
                  }
                  placeholder={copy.pseudoPlaceholder}
                  placeholderTextColor="rgba(74,47,39,0.45)"
                  style={styles.textInput}
                />
                <Text style={styles.inputHint}>{copy.pseudoHint}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>{copy.visibleInfo}</Text>

                <View style={styles.settingRow}>
                  <View style={styles.settingTextWrap}>
                    <Text style={styles.settingTitle}>{copy.showAge}</Text>
                    <Text style={styles.settingValue}>{selectedAge ?? copy.empty}</Text>
                  </View>
                  <Switch
                    value={communityProfile.shareAge}
                    onValueChange={(value) =>
                      setCommunityProfile((prev) => ({
                        ...prev,
                        shareAge: value,
                      }))
                    }
                    thumbColor={communityProfile.shareAge ? COMMUNITY_COLORS.copper : '#f4f3f4'}
                    trackColor={{ false: '#d8d8d8', true: '#e4b79f' }}
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingTextWrap}>
                    <Text style={styles.settingTitle}>{copy.showSituation}</Text>
                    <Text style={styles.settingValue}>{lifeSituation ?? copy.emptyFemale}</Text>
                  </View>
                  <Switch
                    value={communityProfile.shareSituation}
                    onValueChange={(value) =>
                      setCommunityProfile((prev) => ({
                        ...prev,
                        shareSituation: value,
                      }))
                    }
                    thumbColor={communityProfile.shareSituation ? COMMUNITY_COLORS.copper : '#f4f3f4'}
                    trackColor={{ false: '#d8d8d8', true: '#e4b79f' }}
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingTextWrap}>
                    <Text style={styles.settingTitle}>{copy.showNeeds}</Text>
                    <Text style={styles.settingValue}>{needsSummary}</Text>
                  </View>
                  <Switch
                    value={communityProfile.shareNeeds}
                    onValueChange={(value) =>
                      setCommunityProfile((prev) => ({
                        ...prev,
                        shareNeeds: value,
                      }))
                    }
                    thumbColor={communityProfile.shareNeeds ? COMMUNITY_COLORS.copper : '#f4f3f4'}
                    trackColor={{ false: '#d8d8d8', true: '#e4b79f' }}
                  />
                </View>
              </View>

              <View style={styles.infoPanel}>
                <Ionicons name="lock-closed-outline" size={18} color={COMMUNITY_COLORS.deepGreen} />
                <Text style={styles.infoText}>{copy.privacyHint}</Text>
              </View>

              <Pressable onPress={saveProfile} style={styles.saveButton}>
                <Ionicons name="checkmark" size={18} color={COMMUNITY_COLORS.warmWhite} />
                <Text style={styles.saveButtonText}>{copy.save}</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COMMUNITY_COLORS.beige,
  },
  screen: {
    flex: 1,
    backgroundColor: COMMUNITY_COLORS.beige,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(194,106,61,0.14)',
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: COMMUNITY_COLORS.deepGreen,
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    marginTop: 3,
    color: COMMUNITY_COLORS.cacao,
    fontSize: 12,
  },
  headerCircleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COMMUNITY_COLORS.deepGreen,
  },
  headerCircleButtonCopper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COMMUNITY_COLORS.copper,
  },
  headerCircleButtonVoice: {
    marginLeft: -2,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(15,61,46,0.08)',
    borderLeftWidth: 3,
    borderLeftColor: COMMUNITY_COLORS.deepGreen,
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
  },
  noticeIcon: {
    marginTop: 2,
  },
  noticeTextWrap: {
    flex: 1,
  },
  noticeTitle: {
    color: COMMUNITY_COLORS.deepGreen,
    fontWeight: '700',
    marginBottom: 4,
    fontSize: 14,
  },
  noticeDesc: {
    color: COMMUNITY_COLORS.cacao,
    fontSize: 12,
    lineHeight: 18,
  },
  thematicTitle: {
    marginBottom: 12,
    color: COMMUNITY_COLORS.deepGreen,
    fontSize: 17,
    fontWeight: '700',
  },
  roomsWrap: {
    gap: 12,
  },
  roomCard: {
    backgroundColor: COMMUNITY_COLORS.warmWhite,
    borderWidth: 2,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roomCardPressed: {
    transform: [{ translateX: 4 }],
  },
  roomIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomTextWrap: {
    flex: 1,
  },
  roomTitle: {
    color: COMMUNITY_COLORS.deepGreen,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  roomDesc: {
    color: COMMUNITY_COLORS.cacao,
    fontSize: 12,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COMMUNITY_COLORS.warmWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  modalTitle: {
    color: COMMUNITY_COLORS.deepGreen,
    fontSize: 24,
    fontWeight: '700',
  },
  modalSubtitle: {
    marginTop: 4,
    color: COMMUNITY_COLORS.cacao,
    fontSize: 12,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COMMUNITY_COLORS.sand,
  },
  modalSection: {
    marginBottom: 16,
  },
  inputLabel: {
    color: COMMUNITY_COLORS.deepGreen,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
  },
  textInput: {
    borderWidth: 2,
    borderColor: 'rgba(194,106,61,0.2)',
    borderRadius: 12,
    backgroundColor: COMMUNITY_COLORS.beige,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: COMMUNITY_COLORS.cacao,
    fontSize: 14,
  },
  inputHint: {
    marginTop: 8,
    color: 'rgba(74,47,39,0.72)',
    fontSize: 11,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(194,106,61,0.16)',
    marginBottom: 16,
  },
  sectionTitle: {
    color: COMMUNITY_COLORS.deepGreen,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COMMUNITY_COLORS.beige,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 10,
  },
  settingTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    color: COMMUNITY_COLORS.deepGreen,
    fontSize: 14,
    fontWeight: '700',
  },
  settingValue: {
    marginTop: 2,
    color: 'rgba(74,47,39,0.72)',
    fontSize: 11,
  },
  infoPanel: {
    borderWidth: 1,
    borderColor: 'rgba(15,61,46,0.16)',
    borderRadius: 12,
    backgroundColor: 'rgba(15,61,46,0.06)',
    padding: 12,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    color: COMMUNITY_COLORS.cacao,
    fontSize: 11,
    lineHeight: 16,
  },
  saveButton: {
    backgroundColor: COMMUNITY_COLORS.deepGreen,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveButtonText: {
    color: COMMUNITY_COLORS.warmWhite,
    fontSize: 15,
    fontWeight: '700',
  },
});
