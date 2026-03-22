import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';

import BackButton from '../../components/BackButton';
import { colors } from '../../constants/colors';
import { useProfileMock } from '../../context/ProfileMockContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ThemeOption = {
  id: string;
  fr: string;
  wo: string;
};

type SpecialtyOption = {
  fr: string;
  wo: string;
};

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  location: string;
  phone: string;
  schedule: string;
  rating: number;
  distance: string;
  languages: string[];
  acceptsInsurance: boolean;
  themes: string[];
};

const SPECIALTIES: SpecialtyOption[] = [
  { fr: 'Tous', wo: 'Yepp' },
  { fr: 'Gynécologie', wo: 'Gynecologie' },
  { fr: 'Sage-femme', wo: 'Bajenu gox' },
  { fr: 'Médecine générale', wo: 'Tabax bu wer' },
  { fr: 'Endocrinologie', wo: 'Endocrinologie' },
  { fr: 'Psychologie', wo: 'Weeru xel' },
  { fr: 'Nutrition', wo: 'Lekk bu wer' },
  { fr: 'Dermatologie', wo: 'Dermatologie' },
];

const THEMES: ThemeOption[] = [
  { id: 'all', fr: 'Tous les thèmes', wo: 'Yepp' },
  { id: 'cycle', fr: 'Cycle & Règles', wo: 'Weer gi' },
  { id: 'grossesse', fr: 'Grossesse', wo: 'Gatt' },
  { id: 'contraception', fr: 'Contraception', wo: 'Contraception' },
  { id: 'ist', fr: 'IST / Dépistage', wo: 'IST / Depistage' },
  { id: 'menopause', fr: 'Ménopause', wo: 'Menopause' },
  { id: 'fertilite', fr: 'Fertilité', wo: 'Fertilite' },
  { id: 'mental', fr: 'Santé mentale', wo: 'Weeru xel' },
];

const LANGUAGES_FILTER = ['Tous', 'Wolof', 'Français', 'Sérère', 'Peul', 'Anglais'];

const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Aissatou Diallo',
    specialty: 'Gynécologie',
    location: 'Dakar - Plateau',
    phone: '+22133821XXXX',
    schedule: 'Lun-Ven: 9h-18h',
    rating: 4.8,
    distance: '1.2 km',
    languages: ['Français', 'Wolof'],
    acceptsInsurance: true,
    themes: ['cycle', 'grossesse', 'contraception', 'ist'],
  },
  {
    id: 2,
    name: 'Mme. Fatou Sall',
    specialty: 'Sage-femme',
    location: 'Dakar - Medina',
    phone: '+22177XXXXXXX',
    schedule: 'Lun-Sam: 8h-17h',
    rating: 4.9,
    distance: '2.5 km',
    languages: ['Français', 'Wolof', 'Sérère'],
    acceptsInsurance: true,
    themes: ['grossesse', 'cycle', 'contraception'],
  },
  {
    id: 3,
    name: 'Dr. Khady Ndiaye',
    specialty: 'Endocrinologie',
    location: 'Dakar - Almadies',
    phone: '+22133XXXXXXX',
    schedule: 'Mar-Sam: 10h-19h',
    rating: 4.7,
    distance: '4.8 km',
    languages: ['Français'],
    acceptsInsurance: true,
    themes: ['menopause', 'fertilite', 'cycle'],
  },
  {
    id: 4,
    name: 'Dr. Marie-Claire Faye',
    specialty: 'Psychologie',
    location: 'Dakar - Mermoz',
    phone: '+22177XXXXXXX',
    schedule: 'Lun-Ven: 14h-20h',
    rating: 4.9,
    distance: '3.2 km',
    languages: ['Francais', 'Wolof'],
    acceptsInsurance: false,
    themes: ['mental', 'grossesse'],
  },
  {
    id: 5,
    name: 'Dr. Aminata Toure',
    specialty: 'Medecine generale',
    location: 'Dakar - Ouakam',
    phone: '+22133XXXXXXX',
    schedule: 'Lun-Ven: 8h-16h',
    rating: 4.6,
    distance: '5.1 km',
    languages: ['Francais', 'Wolof'],
    acceptsInsurance: true,
    themes: ['cycle', 'ist', 'contraception'],
  },
  {
    id: 6,
    name: 'Mme. Mariama Ba',
    specialty: 'Nutrition',
    location: 'Dakar - Point E',
    phone: '+22177XXXXXXX',
    schedule: 'Mar-Sam: 9h-18h',
    rating: 4.8,
    distance: '2.8 km',
    languages: ['Francais', 'Wolof', 'Peul'],
    acceptsInsurance: true,
    themes: ['grossesse', 'menopause', 'fertilite'],
  },
  {
    id: 7,
    name: 'Dr. Yaye Soukeye Diop',
    specialty: 'Gynecologie',
    location: 'Dakar - Sacre-Coeur',
    phone: '+22133XXXXXXX',
    schedule: 'Lun-Ven: 10h-19h',
    rating: 4.7,
    distance: '3.6 km',
    languages: ['Francais', 'Wolof'],
    acceptsInsurance: true,
    themes: ['cycle', 'grossesse', 'ist', 'fertilite', 'contraception'],
  },
  {
    id: 8,
    name: 'Dr. Oumy Dieng',
    specialty: 'Dermatologie',
    location: 'Dakar - Fann',
    phone: '+22133XXXXXXX',
    schedule: 'Lun-Ven: 9h-17h',
    rating: 4.5,
    distance: '3.9 km',
    languages: ['Francais', 'Wolof', 'Anglais'],
    acceptsInsurance: true,
    themes: ['cycle', 'menopause'],
  },
];

function ProvidersModuleContent() {
  const { language, selectedNeeds, discreteMode } = useProfileMock();
  const isWo = language === 'wo';

  const getDefaultTheme = (): string => {
    if (!selectedNeeds || selectedNeeds.length === 0) {
      return 'all';
    }

    const needToTheme: Record<string, string> = {
      'Cycle & Regles': 'cycle',
      'Règles & Cycle': 'cycle',
      'Grossesse & Maternite': 'grossesse',
      'Grossesse & Maternité': 'grossesse',
      Contraception: 'contraception',
      'Bien-etre hormonal': 'menopause',
      'Bien-être hormonal': 'menopause',
      'Droit & Sante': 'all',
      'Droit & Santé': 'all',
    };

    for (const need of selectedNeeds) {
      if (needToTheme[need]) {
        return needToTheme[need];
      }
    }

    return 'all';
  };

  const getDefaultSpecialty = (): string => {
    if (!selectedNeeds || selectedNeeds.length === 0) {
      return 'Tous';
    }

    if (
      selectedNeeds.includes('Grossesse & Maternite') ||
      selectedNeeds.includes('Grossesse & Maternité')
    ) {
      return 'Sage-femme';
    }

    if (
      selectedNeeds.includes('Bien-etre hormonal') ||
      selectedNeeds.includes('Bien-être hormonal')
    ) {
      return 'Endocrinologie';
    }

    return 'Tous';
  };

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(getDefaultSpecialty);
  const [selectedTheme, setSelectedTheme] = useState<string>(getDefaultTheme);
  const [selectedLang, setSelectedLang] = useState<string>('Tous');
  const [insuranceOnly, setInsuranceOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState<boolean>(
    () => getDefaultTheme() !== 'all' || getDefaultSpecialty() !== 'Tous'
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSpecialty !== 'Tous') {
      count += 1;
    }
    if (selectedTheme !== 'all') {
      count += 1;
    }
    if (selectedLang !== 'Tous') {
      count += 1;
    }
    if (insuranceOnly) {
      count += 1;
    }
    return count;
  }, [insuranceOnly, selectedLang, selectedSpecialty, selectedTheme]);

  const filteredDoctors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return DOCTORS.filter((doctor) => {
      const matchesSpecialty =
        selectedSpecialty === 'Tous' || doctor.specialty === selectedSpecialty;
      const matchesTheme = selectedTheme === 'all' || doctor.themes.includes(selectedTheme);
      const matchesLanguage = selectedLang === 'Tous' || doctor.languages.includes(selectedLang);
      const matchesInsurance = !insuranceOnly || doctor.acceptsInsurance;
      const matchesSearch =
        query.length === 0 ||
        doctor.name.toLowerCase().includes(query) ||
        doctor.location.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query);

      return (
        matchesSpecialty &&
        matchesTheme &&
        matchesLanguage &&
        matchesInsurance &&
        matchesSearch
      );
    });
  }, [insuranceOnly, searchQuery, selectedLang, selectedSpecialty, selectedTheme]);

  const resetFilters = () => {
    setSelectedSpecialty('Tous');
    setSelectedTheme('all');
    setSelectedLang('Tous');
    setInsuranceOnly(false);
  };

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilters((prev) => !prev);
  };

  const toggleInsurance = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setInsuranceOnly((prev) => !prev);
  };

  const handleCallPress = async (phone: string) => {
    const telUrl = 'tel:' + phone;
    if (await Linking.canOpenURL(telUrl)) {
      await Linking.openURL(telUrl);
    }
  };

  const handleLocationPress = async (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    const mapUrl = 'https://maps.google.com/?q=' + encodedLocation;
    if (await Linking.canOpenURL(mapUrl)) {
      await Linking.openURL(mapUrl);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <View style={styles.backRow}>
          <BackButton />
        </View>

        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <View style={styles.titleWrap}>
              <View style={styles.accentBar} />
              <Text style={styles.title}>
                {isWo ? 'Medecins bi yegg' : 'Professionnels de Sante'}
              </Text>
              <Text style={styles.subtitle}>
                {isWo ? 'Gis ni nga man a wool' : 'Trouvez le soutien adapte'}
              </Text>
            </View>

            <Pressable
              style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
              onPress={toggleFilters}
            >
              <MaterialCommunityIcons
                name="filter-variant"
                size={18}
                color={showFilters ? colors.white : colors.deepGreen}
              />
              {activeFiltersCount > 0 ? (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
                </View>
              ) : null}
            </Pressable>
          </View>

          <View style={styles.searchRow}>
            <MaterialCommunityIcons name="magnify" size={18} color="rgba(74, 47, 39, 0.6)" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={
                isWo ? 'Seet medecin, quartier...' : 'Rechercher par nom, quartier...'
              }
              placeholderTextColor="rgba(74, 47, 39, 0.45)"
              style={styles.searchInput}
            />
            {searchQuery.length > 0 ? (
              <Pressable style={styles.clearBtn} onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons name="close" size={14} color={colors.cocoaDark} />
              </Pressable>
            ) : null}
          </View>
        </View>

        {showFilters ? (
          <View style={styles.filtersPanel}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionLabel}>
                {isWo ? 'Ci wallu' : 'Thematique sante'}
              </Text>
              <View style={styles.filterWrapRow}>
                {THEMES.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <Pressable
                      key={theme.id}
                      style={[styles.pillChip, isSelected && styles.pillChipActive]}
                      onPress={() => setSelectedTheme(theme.id)}
                    >
                      <Text style={[styles.pillChipText, isSelected && styles.pillChipTextActive]}>
                        {isWo ? theme.wo : theme.fr}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionLabel}>
                <MaterialCommunityIcons name="earth" size={11} color={colors.deepGreen} />{' '}
                {isWo ? 'Lakk' : 'Langue parlee'}
              </Text>
              <View style={styles.filterWrapRow}>
                {LANGUAGES_FILTER.map((lang) => {
                  const isSelected = selectedLang === lang;
                  return (
                    <Pressable
                      key={lang}
                      style={[styles.pillChipCopper, isSelected && styles.pillChipCopperActive]}
                      onPress={() => setSelectedLang(lang)}
                    >
                      <Text
                        style={[
                          styles.pillChipCopperText,
                          isSelected && styles.pillChipCopperTextActive,
                        ]}
                      >
                        {lang}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Pressable
              onPress={toggleInsurance}
              style={[styles.insuranceBtn, insuranceOnly && styles.insuranceBtnActive]}
            >
              <View style={[styles.checkbox, insuranceOnly && styles.checkboxActive]}>
                {insuranceOnly ? (
                  <MaterialCommunityIcons name="check" size={12} color={colors.white} />
                ) : null}
              </View>
              <Text style={[styles.insuranceText, insuranceOnly && styles.insuranceTextActive]}>
                {isWo ? 'Assurance acceptee rekk' : 'Accepte les assurances uniquement'}
              </Text>
            </Pressable>

            {activeFiltersCount > 0 ? (
              <Pressable onPress={resetFilters} style={styles.resetBtn}>
                <Text style={styles.resetBtnText}>
                  {isWo ? 'Teral filtres yi' : 'Reinitialiser les filtres'}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        <ScrollView
          style={styles.mainScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mainScrollContent}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtyRow}
          >
            {SPECIALTIES.map((specialty) => {
              const isSelected = selectedSpecialty === specialty.fr;
              return (
                <Pressable
                  key={specialty.fr}
                  style={[styles.specialtyChip, isSelected && styles.specialtyChipActive]}
                  onPress={() => setSelectedSpecialty(specialty.fr)}
                >
                  <Text
                    style={[styles.specialtyChipText, isSelected && styles.specialtyChipTextActive]}
                  >
                    {isWo ? specialty.wo : specialty.fr}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.resultCountWrap}>
            <Text style={styles.resultCountText}>
              {filteredDoctors.length}{' '}
              {isWo ? 'professionnel(s) gis na' : 'professionnel(s) trouve(s)'}
              {activeFiltersCount > 0 ? (
                <Text style={styles.resultActiveFiltersText}>
                  {' '}
                  · {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif
                  {activeFiltersCount > 1 ? 's' : ''}
                </Text>
              ) : null}
            </Text>
          </View>

          <View style={[styles.cardsColumn, discreteMode && styles.discreteBlur]}>
            {filteredDoctors.length === 0 ? (
              <View style={styles.emptyCard}>
                <MaterialCommunityIcons
                  name="stethoscope"
                  size={38}
                  color="rgba(74, 47, 39, 0.25)"
                />
                <Text style={styles.emptyTitle}>
                  {isWo ? 'Amul medecin bu mel nii' : 'Aucun professionnel trouve'}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {isWo ? 'Essaye filtres yeneen' : 'Essayez avec d autres filtres'}
                </Text>
                <Pressable style={styles.emptyResetBtn} onPress={resetFilters}>
                  <Text style={styles.emptyResetText}>
                    {isWo ? 'Teral filtres yi' : 'Reinitialiser'}
                  </Text>
                </Pressable>
              </View>
            ) : (
              filteredDoctors.map((doctor) => (
                <View key={doctor.id} style={styles.doctorCard}>
                  <View style={styles.doctorHeader}>
                    <View style={styles.avatarBadge}>
                      <MaterialCommunityIcons name="stethoscope" size={27} color={colors.white} />
                    </View>

                    <View style={styles.doctorHeaderContent}>
                      <Text style={styles.doctorName}>{doctor.name}</Text>

                      <View style={styles.specialtyTag}>
                        <Text style={styles.specialtyTagText}>{doctor.specialty}</Text>
                      </View>

                      <View style={styles.ratingRow}>
                        <MaterialCommunityIcons name="star" size={13} color={colors.gold} />
                        <Text style={styles.ratingText}>{doctor.rating.toFixed(1)}</Text>
                        <Text style={styles.distanceText}>· {doctor.distance}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.themesRow}>
                    {doctor.themes.map((themeId) => {
                      const themeLabel = THEMES.find((item) => item.id === themeId);

                      if (!themeLabel) {
                        return null;
                      }

                      return (
                        <View key={themeId} style={styles.themeTag}>
                          <Text style={styles.themeTagText}>
                            {isWo ? themeLabel.wo : themeLabel.fr}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  <View style={styles.infoPanel}>
                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={17}
                        color={colors.copper}
                      />
                      <Text style={styles.infoText}>{doctor.location}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons
                        name="clock-time-three-outline"
                        size={17}
                        color={colors.deepGreen}
                      />
                      <Text style={styles.infoText}>{doctor.schedule}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons name="earth" size={17} color={colors.terracotta} />
                      <Text style={styles.infoText}>{doctor.languages.join(', ')}</Text>
                    </View>
                  </View>

                  <View style={styles.actionsRow}>
                    <Pressable
                      style={({ pressed }) => [styles.callBtn, pressed && styles.pressedBtn]}
                      onPress={() => {
                        void handleCallPress(doctor.phone);
                      }}
                    >
                      <MaterialCommunityIcons name="phone" size={16} color={colors.white} />
                      <Text style={styles.callBtnText}>{isWo ? 'Woote' : 'Appeler'}</Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [styles.locateBtn, pressed && styles.pressedBtn]}
                      onPress={() => {
                        void handleLocationPress(doctor.location);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={16}
                        color={colors.deepGreen}
                      />
                      <Text style={styles.locateBtnText}>{isWo ? 'Itineraire' : 'Localiser'}</Text>
                    </Pressable>
                  </View>

                  {doctor.acceptsInsurance ? (
                    <View style={styles.insuranceChip}>
                      <Text style={styles.insuranceChipText}>
                        {isWo ? '✓ Assurance acceptee' : '✓ Accepte les assurances'}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default function ProvidersModuleScreen() {
  return <ProvidersModuleContent />;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  root: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  backRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerCard: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(181, 98, 42, 0.14)',
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  titleWrap: {
    flex: 1,
  },
  accentBar: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.cocoaDark,
    marginBottom: 8,
  },
  title: {
    color: colors.deepGreen,
    fontSize: 23,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 2,
    color: colors.terracotta,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  filterToggle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26, 60, 52, 0.08)',
  },
  filterToggleActive: {
    backgroundColor: colors.deepGreen,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.terracotta,
    borderColor: colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.beige,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(181, 98, 42, 0.16)',
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.cocoaDark,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(74, 47, 39, 0.1)',
  },
  filtersPanel: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(181, 98, 42, 0.14)',
    padding: 14,
    gap: 14,
  },
  filterSection: {
    gap: 8,
  },
  filterSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.deepGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  filterWrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pillChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: 'rgba(74, 47, 39, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(74, 47, 39, 0.1)',
  },
  pillChipActive: {
    backgroundColor: colors.deepGreen,
    borderColor: colors.deepGreen,
  },
  pillChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.cocoaDark,
  },
  pillChipTextActive: {
    color: colors.white,
  },
  pillChipCopper: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: 'rgba(74, 47, 39, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(74, 47, 39, 0.1)',
  },
  pillChipCopperActive: {
    backgroundColor: colors.copper,
    borderColor: colors.copper,
  },
  pillChipCopperText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.cocoaDark,
  },
  pillChipCopperTextActive: {
    color: colors.white,
  },
  insuranceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 47, 39, 0.1)',
    backgroundColor: 'rgba(74, 47, 39, 0.04)',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  insuranceBtnActive: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(74, 47, 39, 0.25)',
    backgroundColor: 'transparent',
  },
  checkboxActive: {
    borderColor: colors.gold,
    backgroundColor: colors.gold,
  },
  insuranceText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(74, 47, 39, 0.7)',
  },
  insuranceTextActive: {
    color: '#9B7A15',
  },
  resetBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.terracotta,
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 100,
  },
  specialtyRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 6,
  },
  specialtyChip: {
    flexShrink: 0,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 99,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(181, 98, 42, 0.2)',
  },
  specialtyChipActive: {
    backgroundColor: colors.deepGreen,
    borderColor: colors.deepGreen,
  },
  specialtyChipText: {
    color: colors.cocoaDark,
    fontSize: 12,
    fontWeight: '600',
  },
  specialtyChipTextActive: {
    color: colors.white,
  },
  resultCountWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  resultCountText: {
    color: 'rgba(74, 47, 39, 0.65)',
    fontSize: 12,
  },
  resultActiveFiltersText: {
    color: colors.terracotta,
    fontWeight: '600',
  },
  cardsColumn: {
    paddingHorizontal: 16,
    gap: 14,
  },
  discreteBlur: {
    opacity: 0.35,
  },
  emptyCard: {
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 38,
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(181, 98, 42, 0.14)',
    gap: 6,
  },
  emptyTitle: {
    marginTop: 6,
    fontSize: 14,
    color: 'rgba(74, 47, 39, 0.75)',
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 12,
    color: 'rgba(74, 47, 39, 0.48)',
  },
  emptyResetBtn: {
    marginTop: 12,
    borderRadius: 99,
    backgroundColor: colors.deepGreen,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  emptyResetText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  doctorCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(181, 98, 42, 0.14)',
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  avatarBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.deepGreen,
  },
  doctorHeaderContent: {
    flex: 1,
  },
  doctorName: {
    color: colors.deepGreen,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  specialtyTag: {
    alignSelf: 'flex-start',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(166, 93, 64, 0.22)',
    backgroundColor: 'rgba(166, 93, 64, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  specialtyTagText: {
    color: colors.terracotta,
    fontSize: 11,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  distanceText: {
    marginLeft: 4,
    color: 'rgba(74, 47, 39, 0.6)',
    fontSize: 12,
  },
  themesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  themeTag: {
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(122, 140, 90, 0.28)',
    backgroundColor: 'rgba(122, 140, 90, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  themeTagText: {
    color: '#7A8C5A',
    fontSize: 9,
    fontWeight: '600',
  },
  infoPanel: {
    borderRadius: 16,
    backgroundColor: colors.beige,
    padding: 12,
    gap: 10,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: colors.cocoaDark,
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  callBtn: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  callBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  locateBtn: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(181, 98, 42, 0.32)',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  locateBtnText: {
    color: colors.deepGreen,
    fontSize: 14,
    fontWeight: '600',
  },
  pressedBtn: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  insuranceChip: {
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.22)',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  insuranceChipText: {
    color: '#9B7A15',
    fontSize: 10,
    fontWeight: '600',
  },
});
