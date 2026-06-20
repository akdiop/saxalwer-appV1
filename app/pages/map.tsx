/**
 * Map page — Figma → React Native conversion
 * Uses expo-location for geolocation, expo-router for navigation.
 */
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import NoticeCard from '../../components/NoticeCard';
import { useApp } from '../../context/appcontext';
import {
  HEALTH_CENTERS,
  type HealthCenter,
  buildNavigationUrl,
  distanceKm,
} from '../../data/healthcenters';
import {
  getSensitiveMapPresets,
  getSensitiveMapSummary,
  scoreHealthCenterForSensitiveOrientation,
  type SensitiveMapPreset,
} from '../../utils/sensitiveOrientation';

const BASE = {
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  gold: '#D4AF37',
  beige: '#F5F1E6',
};

const TYPE_LABELS: Record<string, { fr: string; wo: string; color: string; bg: string }> = {
  public:   { fr: 'Public',   wo: 'Dëkk bu réy',  color: BASE.deepGreen, bg: `${BASE.deepGreen}12` },
  prive:    { fr: 'Privé',    wo: 'Xel bu bëgg',  color: BASE.copper,    bg: `${BASE.copper}12` },
  ong:      { fr: 'ONG',      wo: 'ONG',           color: BASE.gold,      bg: `${BASE.gold}18` },
  hopital:  { fr: 'Hôpital',  wo: 'Dëkk bu xam',  color: BASE.terracotta,bg: `${BASE.terracotta}12` },
  poste:    { fr: 'Poste',    wo: 'Poste de santé',color: BASE.cocoa,     bg: `${BASE.cocoa}10` },
};

const CENTER_TAGS = [
  'Contraception', 'Grossesse', 'IST', 'Gynécologie', 'Pédiatrie',
  'Urgences', 'Dépistage', 'Planning familial', 'Conseils', 'Consultations', 'Cancers', 'Maternité',
];

function typeIcon(type: string) {
  switch (type) {
    case 'hopital': return <MaterialCommunityIcons name="hospital-building" size={16} color={BASE.terracotta} />;
    case 'ong':     return <MaterialCommunityIcons name="shield-check-outline" size={16} color={BASE.gold} />;
    default:        return <MaterialCommunityIcons name="stethoscope" size={16} color={BASE.deepGreen} />;
  }
}

async function openPhoneDialer(phone: string, wo: boolean) {
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
}

async function openNavigationRoute(url: string, wo: boolean, isOffline: boolean) {
  if (isOffline) {
    Alert.alert(
      'SaxalWer',
      wo
        ? 'Connexion internet la soxla ngir ubbi itineraire bi.'
        : "Une connexion internet est nécessaire pour ouvrir l'itinéraire."
    );
    return;
  }

  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    Alert.alert(
      'SaxalWer',
      wo ? 'Manul ubbi Maps ci appareil bii.' : "Impossible d'ouvrir Maps sur cet appareil."
    );
    return;
  }

  await Linking.openURL(url);
}

// ---------------------------------------------------------------------------
// CenterCard
// ---------------------------------------------------------------------------
function CenterCard({
  center,
  userLat,
  userLng,
  wo,
  isOffline,
}: {
  center: HealthCenter;
  userLat: number | null;
  userLng: number | null;
  wo: boolean;
  isOffline: boolean;
}) {
  const typeInfo = TYPE_LABELS[center.type] ?? TYPE_LABELS.public;
  const dist =
    userLat && userLng
      ? distanceKm(userLat, userLng, center.lat, center.lng).toFixed(1)
      : null;

  return (
    <View style={styles.centerCard}>
      {/* Header row */}
      <View style={styles.centerHeader}>
        <View style={styles.centerIconWrap}>{typeIcon(center.type)}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.centerName}>{wo && center.nameWo ? center.nameWo : center.name}</Text>
          <View style={styles.centerMetaRow}>
            <View style={[styles.typeBadge, { backgroundColor: typeInfo.bg }]}>
              <Text style={[styles.typeText, { color: typeInfo.color }]}>
                {wo ? typeInfo.wo : typeInfo.fr}
              </Text>
            </View>
            {dist && (
              <View style={styles.distRow}>
                <Feather name="map-pin" size={10} color={`${BASE.cocoa}60`} />
                <Text style={styles.distText}>{dist} km</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Address */}
      <View style={styles.addressRow}>
        <Feather name="map-pin" size={12} color={`${BASE.cocoa}50`} />
        <Text style={styles.addressText}>
          {center.address} · {wo && center.cityWo ? center.cityWo : center.city}
        </Text>
      </View>

      {/* Tags */}
      {center.tags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsRow}
        >
          {(wo ? center.tagsWo : center.tags).map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Actions */}
      <View style={styles.actionsRow}>
        {center.phone && (
          <Pressable
            onPress={() => {
              void openPhoneDialer(center.phone!, wo);
            }}
            style={styles.callBtn}
          >
            <Feather name="phone" size={13} color="white" />
            <Text style={styles.callBtnText}>{wo ? 'Woyofal' : 'Appeler'}</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => {
            void openNavigationRoute(
              buildNavigationUrl(center.lat, center.lng, center.name),
              wo,
              isOffline
            );
          }}
          style={[styles.navBtn, !center.phone && { flex: 1 }]}
        >
          <Feather name="navigation" size={13} color={BASE.deepGreen} />
          <Text style={styles.navBtnText}>{wo ? 'Dem fii' : "Y aller"}</Text>
          <Feather name="external-link" size={11} color={`${BASE.deepGreen}70`} />
        </Pressable>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function MapScreen() {
  const router = useRouter();
  const { language, sensitiveOrientation, isOffline } = useApp();
  const wo = language === 'wo';

  const [userLat, setUserLat] = React.useState<number | null>(null);
  const [userLng, setUserLng] = React.useState<number | null>(null);
  const [geoStatus, setGeoStatus] = React.useState<'idle' | 'loading' | 'success' | 'denied' | 'error'>('idle');

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);

  const sensitiveSummary = React.useMemo(
    () => getSensitiveMapSummary(sensitiveOrientation, language),
    [language, sensitiveOrientation]
  );
  const sensitivePresets = React.useMemo(
    () => getSensitiveMapPresets(sensitiveOrientation),
    [sensitiveOrientation]
  );

  // Request GPS on mount
  React.useEffect(() => {
    (async () => {
      try {
        setGeoStatus('loading');
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setGeoStatus('denied');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setUserLat(loc.coords.latitude);
        setUserLng(loc.coords.longitude);
        setGeoStatus('success');
      } catch {
        setGeoStatus('error');
      }
    })();
  }, []);

  const filteredCenters = React.useMemo(() => {
    let centers = [...HEALTH_CENTERS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      centers = centers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (selectedType) {
      centers = centers.filter((c) => c.type === selectedType);
    }
    if (selectedTags.length > 0) {
      centers = centers.filter((c) =>
        selectedTags.every((tag) =>
          c.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())),
        ),
      );
    }

    return centers
      .map((center) => ({
        center,
        score: scoreHealthCenterForSensitiveOrientation(center, sensitiveOrientation),
        distance:
          userLat != null && userLng != null
            ? distanceKm(userLat, userLng, center.lat, center.lng)
            : null,
      }))
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        if (a.distance != null && b.distance != null) {
          return a.distance - b.distance;
        }
        return a.center.name.localeCompare(b.center.name);
      })
      .map((entry) => entry.center);
  }, [searchQuery, selectedType, selectedTags, sensitiveOrientation, userLat, userLng]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function applySensitivePreset(preset: SensitiveMapPreset) {
    setSelectedType(preset.type);
    setSelectedTags(preset.tags);
    setShowFilters(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={20} color={BASE.deepGreen} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{wo ? 'Biir ji' : 'Carte des centres'}</Text>
            <View style={styles.geoRow}>
              {geoStatus === 'loading' && (
                <>
                  <ActivityIndicator size="small" color={BASE.copper} />
                  <Text style={styles.geoText}>{wo ? 'Seetlu...' : 'Localisation...'}</Text>
                </>
              )}
              {geoStatus === 'success' && (
                <>
                  <View style={styles.geoDot} />
                  <Text style={styles.geoText}>{wo ? 'Yoon wi xam' : 'Position détectée'}</Text>
                </>
              )}
              {geoStatus === 'denied' && (
                <Text style={styles.geoTextDenied}>
                  {wo ? 'Yoon wi dafa sàqq' : 'Localisation refusée'}
                </Text>
              )}
              {geoStatus === 'error' && (
                <Text style={styles.geoTextDenied}>
                  {wo ? 'Manul jël sa position léegi' : 'Position indisponible pour le moment'}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {filteredCenters.length} {wo ? 'biir' : 'centres'}
            </Text>
          </View>
        </View>

        {/* Emergency strip */}
        <View style={styles.emergencyStrip}>
          <Feather name="alert-triangle" size={14} color="white" />
          <Text style={styles.emergencyText}>
            {wo ? 'Jiibo bu cas : 15 · Samu :' : 'Urgence : 15 · Samu :'}{' '}
            <Text
              style={styles.emergencyLink}
              onPress={() => {
                void openPhoneDialer('15', wo);
              }}
            >
              15
            </Text>
          </Text>
        </View>

        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>
            {wo ? 'Leeral bu am solo' : 'Centres en cours de validation'}
          </Text>
          <Text style={styles.disclaimerText}>
            {wo
              ? "Liste bii indicatif la. Centres yi, services yi, horaires yi ak coordonnées yi ñu ngi leen di seetaat te di leen validaat ndànk-ndànk. Bala ngay dem walla woo, gën na nga firndeel ne centre bi ubbeeku te li ñu bind dafa baax."
              : "Cette liste est fournie à titre indicatif. Les centres, services, horaires et coordonnées sont encore en cours de vérification et de validation progressive. Avant de vous déplacer ou d'appeler, confirmez si possible que le centre est disponible et que les informations affichées sont à jour."}
          </Text>
        </View>

        {isOffline ? (
          <NoticeCard
            title={wo ? 'Mode hors ligne' : 'Mode hors ligne'}
            description={
              wo
                ? 'Liste centres yi ak sa position men nañu dox sans internet. Waaye ngir ubbi itinéraire ci Maps, connexion internet la soxla.'
                : "La liste des centres et ta position peuvent rester disponibles hors ligne. Une connexion internet est nécessaire pour ouvrir un itinéraire dans Maps."
            }
            iconName="cloud-offline-outline"
            accentColor={BASE.copper}
            style={styles.offlineCard}
          />
        ) : null}

        {sensitiveSummary ? (
          <View style={styles.contextCard}>
            <View style={styles.contextHeadingRow}>
              <View style={styles.contextIconWrap}>
                <MaterialCommunityIcons name="shield-check-outline" size={16} color={BASE.deepGreen} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contextTitle}>
                  {wo ? 'Orientation adaptee' : 'Orientation adaptee'}
                </Text>
                <Text style={styles.contextText}>{sensitiveSummary}</Text>
              </View>
            </View>

            {sensitivePresets.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contextPresetRow}
              >
                {sensitivePresets.map((preset) => (
                  <Pressable
                    key={preset.id}
                    onPress={() => applySensitivePreset(preset)}
                    style={styles.contextPresetCard}
                  >
                    <Text style={styles.contextPresetTitle}>
                      {wo ? preset.labelWo : preset.labelFr}
                    </Text>
                    <Text style={styles.contextPresetText}>
                      {wo ? preset.hintWo : preset.hintFr}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}
          </View>
        ) : null}

        {/* Search + filter toggle */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name="search" size={16} color={`${BASE.cocoa}60`} />
            <TextInput
              placeholder={wo ? 'Seetlu biir...' : 'Rechercher un centre...'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor={`${BASE.cocoa}60`}
            />
            {!!searchQuery && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Feather name="x" size={15} color={`${BASE.cocoa}60`} />
              </Pressable>
            )}
          </View>
          <Pressable
            onPress={() => setShowFilters((v) => !v)}
            style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
          >
            <Feather name="filter" size={16} color={showFilters ? 'white' : BASE.deepGreen} />
          </Pressable>
        </View>

        {/* Expanded filters */}
        {showFilters && (
          <View style={styles.filtersPanel}>
            {/* Type filter */}
            <Text style={styles.filterSectionLabel}>
              {wo ? 'Sunu biir' : 'Type de centre'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.typeChipsRow}
            >
              {Object.entries(TYPE_LABELS).map(([key, val]) => (
                <Pressable
                  key={key}
                  onPress={() => setSelectedType(selectedType === key ? null : key)}
                  style={[
                    styles.typeChip,
                    selectedType === key && { backgroundColor: BASE.deepGreen },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      selectedType === key && { color: 'white' },
                    ]}
                  >
                    {wo ? val.wo : val.fr}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Service tags */}
            <Text style={[styles.filterSectionLabel, { marginTop: 12 }]}>
              {wo ? 'Jëfandikoo' : 'Services'}
            </Text>
            <View style={styles.tagGrid}>
              {CENTER_TAGS.map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[
                    styles.serviceTag,
                    selectedTags.includes(tag) && styles.serviceTagActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.serviceTagText,
                      selectedTags.includes(tag) && styles.serviceTagTextActive,
                    ]}
                  >
                    {tag}
                  </Text>
                </Pressable>
              ))}
            </View>

            {(selectedType || selectedTags.length > 0) && (
              <Pressable
                onPress={() => { setSelectedType(null); setSelectedTags([]); }}
                style={styles.clearAllBtn}
              >
                <Feather name="x" size={13} color={BASE.copper} />
                <Text style={styles.clearAllText}>{wo ? 'Sàcc lépp' : 'Effacer filtres'}</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Results */}
        <View style={styles.listContainer}>
          {filteredCenters.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="map-pin" size={40} color={`${BASE.cocoa}30`} />
              <Text style={styles.emptyTitle}>
                {wo ? 'Amul biir' : 'Aucun centre trouvé'}
              </Text>
            </View>
          ) : (
            filteredCenters.map((c) => (
              <CenterCard
                key={c.id}
                center={c}
                userLat={userLat}
                userLng={userLng}
                wo={wo}
                isOffline={isOffline}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDFAF5' },

  header: { padding: 24, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: {
    width: 40, height: 40, backgroundColor: 'white', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: { fontSize: 26, fontWeight: '600', color: BASE.deepGreen },
  geoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  geoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  geoText: { fontSize: 11, color: `${BASE.cocoa}70` },
  geoTextDenied: { fontSize: 11, color: BASE.terracotta },
  countBadge: {
    backgroundColor: `${BASE.deepGreen}12`, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  countBadgeText: { fontSize: 10, fontWeight: '700', color: BASE.deepGreen },

  emergencyStrip: {
    marginHorizontal: 24, marginBottom: 16,
    backgroundColor: BASE.terracotta, borderRadius: 14,
    padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  emergencyText: { fontSize: 12, color: 'white', fontWeight: '600' },
  emergencyLink: { textDecorationLine: 'underline' },
  disclaimerCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#FFF7EF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.18)',
  },
  disclaimerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BASE.copper,
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
    color: `${BASE.cocoa}88`,
  },
  offlineCard: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  contextCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#F2F6F2',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.10)',
    gap: 12,
  },
  contextHeadingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  contextIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26,60,52,0.10)',
  },
  contextTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 4,
  },
  contextText: {
    fontSize: 12,
    lineHeight: 18,
    color: `${BASE.cocoa}88`,
  },
  contextPresetRow: {
    gap: 10,
    paddingRight: 8,
  },
  contextPresetCard: {
    width: 176,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.08)',
  },
  contextPresetTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 4,
  },
  contextPresetText: {
    fontSize: 11,
    lineHeight: 16,
    color: `${BASE.cocoa}78`,
  },

  searchRow: { paddingHorizontal: 24, marginBottom: 12, flexDirection: 'row', gap: 10 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'white', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(15,61,46,0.1)',
    shadowColor: '#0F3D2E', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: BASE.cocoa, padding: 0 },
  filterToggle: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: 'white', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(15,61,46,0.1)',
  },
  filterToggleActive: { backgroundColor: BASE.deepGreen, borderColor: BASE.deepGreen },

  filtersPanel: {
    marginHorizontal: 24, marginBottom: 16,
    backgroundColor: 'white', borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  filterSectionLabel: {
    fontSize: 10, fontWeight: '700', color: `${BASE.cocoa}60`,
    textTransform: 'uppercase', letterSpacing: 1.3, marginBottom: 8,
  },
  typeChipsRow: { gap: 8 },
  typeChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99,
    backgroundColor: `${BASE.deepGreen}08`,
    borderWidth: 1, borderColor: `${BASE.deepGreen}14`,
  },
  typeChipText: { fontSize: 12, fontWeight: '500', color: BASE.deepGreen },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceTag: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99,
    backgroundColor: `${BASE.cocoa}08`,
    borderWidth: 1, borderColor: `${BASE.cocoa}12`,
  },
  serviceTagActive: { backgroundColor: BASE.copper, borderColor: BASE.copper },
  serviceTagText: { fontSize: 11, color: BASE.cocoa },
  serviceTagTextActive: { color: 'white', fontWeight: '600' },
  clearAllBtn: {
    marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-end',
  },
  clearAllText: { fontSize: 12, color: BASE.copper, fontWeight: '600' },

  listContainer: { paddingHorizontal: 24, gap: 12 },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyTitle: { fontSize: 14, fontWeight: '500', color: BASE.cocoa, opacity: 0.5, marginTop: 12 },

  // Center card
  centerCard: {
    backgroundColor: 'white', borderRadius: 20, padding: 18,
    marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#0F3D2E', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
  },
  centerHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  centerIconWrap: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: `${BASE.deepGreen}10`,
    alignItems: 'center', justifyContent: 'center',
  },
  centerName: { fontSize: 15, fontWeight: '600', color: BASE.deepGreen, lineHeight: 20 },
  centerMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  typeText: { fontSize: 10, fontWeight: '700' },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  distText: { fontSize: 10, color: `${BASE.cocoa}60` },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 10 },
  addressText: { fontSize: 12, color: `${BASE.cocoa}70`, flex: 1, lineHeight: 17 },
  tagsRow: { gap: 6, marginBottom: 14 },
  tag: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99,
    backgroundColor: `${BASE.deepGreen}08`,
    borderWidth: 1, borderColor: `${BASE.deepGreen}10`,
  },
  tagText: { fontSize: 10, color: BASE.deepGreen },
  actionsRow: { flexDirection: 'row', gap: 10 },
  callBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: BASE.deepGreen, borderRadius: 12,
    paddingVertical: 10,
  },
  callBtnText: { fontSize: 13, fontWeight: '600', color: 'white' },
  navBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: `${BASE.deepGreen}10`, borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1, borderColor: `${BASE.deepGreen}14`,
  },
  navBtnText: { fontSize: 13, fontWeight: '600', color: BASE.deepGreen },
});
