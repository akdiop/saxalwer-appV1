import { Feather } from "@expo/vector-icons";
import React from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { useApp } from "../context/appcontext";
import { CENTERS_DATA, type Center } from "../data/centers";
import NoticeCard from "./NoticeCard";

const BASE = {
  deepGreen: "#1A3C34",
  terracotta: "#A65D40",
  copper: "#B5622A",
  cocoa: "#4A2F27",
};

type GeoState = "idle" | "loading" | "success" | "error";

interface Props {
  language: string;
  filterTags?: string[];
  compact?: boolean;
}

type ResultCenter = Center & { distanceKm: number };

const CENTERS = Object.values(CENTERS_DATA);

export function LocationFinder({ language, filterTags = [], compact = false }: Props) {
  const wo = language === "wo";
  const { isOffline } = useApp();
  const [state, setState] = React.useState<GeoState>("idle");
  const [results, setResults] = React.useState<ResultCenter[]>([]);
  const [errorMsg, setErrorMsg] = React.useState("");

  const filteredCenters = React.useMemo(() => {
    if (filterTags.length === 0) {
      return CENTERS;
    }

    return CENTERS.filter((center) => {
      const haystack = [
        center.type,
        center.location,
        center.description,
        ...center.tags,
        ...center.services.map((service) => service.label),
      ]
        .join(" ")
        .toLowerCase();

      return filterTags.some((tag) => haystack.includes(tag.toLowerCase()));
    });
  }, [filterTags]);

  const handleGeolocate = () => {
    setState("loading");

    // We use app dataset fallback so mobile works without location permissions.
    setTimeout(() => {
      const source = filteredCenters.length > 0 ? filteredCenters : CENTERS;
      if (source.length === 0) {
        setState("error");
        setErrorMsg(wo ? "Amul centre bu jot fii." : "Aucun centre disponible pour ce filtre.");
        return;
      }

      const withDistances: ResultCenter[] = source.map((center, index) => ({
        ...center,
        distanceKm: Number.parseFloat(center.distance.replace(" km", "")) || index + 1,
      }));

      withDistances.sort((a, b) => a.distanceKm - b.distanceKm);
      setResults(withDistances.slice(0, compact ? 2 : 3));
      setState("success");
    }, 800);
  };

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    if (km < 10) {
      return `${km.toFixed(1)} km`;
    }
    return `${Math.round(km)} km`;
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "Public":
        return BASE.deepGreen;
      case "ONG":
        return BASE.terracotta;
      case "Privé":
      case "Prive":
        return BASE.copper;
      default:
        return BASE.cocoa;
    }
  };

  const openNavigation = async (center: ResultCenter) => {
    if (isOffline) {
      Alert.alert(
        "SaxalWer",
        wo
          ? "Connexion internet la soxla ngir ubbi itineraire bi ci Maps."
          : "Une connexion internet est nécessaire pour ouvrir l'itinéraire dans Maps."
      );
      return;
    }

    const q = encodeURIComponent(`${center.name}, ${center.fullAddress}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${q}`;
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert(
        "SaxalWer",
        wo ? "Manul ubbi Maps ci appareil bii." : "Impossible d'ouvrir Maps sur cet appareil."
      );
      return;
    }
    await Linking.openURL(url);
  };

  const callCenter = async (phone: string) => {
    const normalized = phone.replace(/\s/g, "");
    const telUrl = `tel:${normalized}`;
    const supported = await Linking.canOpenURL(telUrl);
    if (!supported) {
      Alert.alert(
        "SaxalWer",
        wo ? "Manul ubbi woote bi ci appareil bii." : "Impossible de lancer l'appel sur cet appareil."
      );
      return;
    }
    await Linking.openURL(telUrl);
  };

  return (
    <View
      style={[
        styles.wrap,
        compact ? styles.wrapCompact : styles.wrapRegular,
      ]}
    >
      {state === "idle" ? (
        <Pressable onPress={handleGeolocate} style={({ pressed }) => [styles.idleButton, pressed && styles.pressed]}>
          <View style={[styles.iconCircle, compact && styles.iconCircleCompact]}>
            <Feather name="navigation" size={compact ? 17 : 20} color={BASE.copper} />
          </View>
          <View style={styles.idleTextWrap}>
            <Text style={[styles.idleTitle, compact && { fontSize: 13 }]}>
              {wo ? "Gis center bu gna jege" : "Trouver le centre le plus proche"}
            </Text>
            {!compact ? (
              <Text style={styles.idleSubtitle}>
                {wo ? "Wut options yi ci sa wet" : "Voir les options proches de vous"}
              </Text>
            ) : null}
          </View>
          <View style={[styles.pinCircle, compact && styles.pinCircleCompact]}>
            <Feather name="map-pin" size={compact ? 14 : 16} color="#FFFFFF" />
          </View>
        </Pressable>
      ) : null}

      {state === "loading" ? (
        <View style={styles.loadingWrap}>
          <Feather name="loader" size={compact ? 22 : 28} color={BASE.copper} />
          <Text style={styles.loadingText}>
            {wo ? "Ci wut sa position..." : "Recherche de votre position..."}
          </Text>
        </View>
      ) : null}

      {state === "error" ? (
        <View style={styles.errorWrap}>
          <View style={styles.errorRow}>
            <Feather name="alert-circle" size={18} color={BASE.terracotta} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
          <Pressable onPress={() => { setState("idle"); setErrorMsg(""); }} style={styles.retryButton}>
            <Text style={styles.retryText}>{wo ? "Jareel" : "Reessayer"}</Text>
          </Pressable>
        </View>
      ) : null}

      {state === "success" ? (
        <View>
          {isOffline ? (
            <NoticeCard
              title={wo ? "Mode hors ligne" : "Mode hors ligne"}
              description={
                wo
                  ? "Liste bi nekk na disponible. Ngir ubbi Maps, connexion internet la soxla."
                  : "La liste reste disponible hors ligne. Une connexion internet est nécessaire pour ouvrir Maps."
              }
              iconName="cloud-offline-outline"
              accentColor={BASE.copper}
              style={styles.noticeCard}
            />
          ) : null}

          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Feather name="map-pin" size={16} color={BASE.copper} />
              <Text style={styles.headerTitle}>
                {wo ? "Centres yi gna jege" : "Centres les plus proches"}
              </Text>
            </View>
            <Pressable onPress={() => { setState("idle"); setResults([]); }} style={styles.closeButton}>
              <Feather name="x" size={14} color={BASE.cocoa} />
            </Pressable>
          </View>

          <View style={styles.resultsWrap}>
            {results.map((center) => (
              <View key={center.id} style={[styles.card, compact && styles.cardCompact]}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.centerName}>{center.name}</Text>
                    <View style={styles.metaRow}>
                      <Text style={[styles.typePill, { color: typeColor(center.type), backgroundColor: `${typeColor(center.type)}1A` }]}>
                        {center.type}
                      </Text>
                      <Text style={styles.cityText}>{center.location}</Text>
                    </View>
                  </View>
                  <View style={styles.distancePill}>
                    <Text style={styles.distanceText}>{formatDistance(center.distanceKm)}</Text>
                  </View>
                </View>

                {!compact ? (
                  <View style={styles.tagsRow}>
                    {center.tags.slice(0, 3).map((tag) => (
                      <Text key={tag} style={styles.tagPill}>{tag}</Text>
                    ))}
                  </View>
                ) : null}

                <View style={styles.actionsRow}>
                  <Pressable onPress={() => openNavigation(center)} style={({ pressed }) => [styles.mapsBtn, pressed && styles.pressed]}>
                    <Feather name="external-link" size={12} color="#FFFFFF" />
                    <Text style={styles.mapsBtnText}>{wo ? "Ubbi Maps" : "Ouvrir Maps"}</Text>
                  </Pressable>

                  <Pressable onPress={() => callCenter(center.phone)} style={({ pressed }) => [styles.callBtn, pressed && styles.pressed]}>
                    <Feather name="phone" size={12} color={BASE.deepGreen} />
                    <Text style={styles.callBtnText}>{wo ? "Woo" : "Appeler"}</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <Pressable onPress={handleGeolocate} style={styles.refreshBtn}>
            <Feather name="navigation" size={13} color={BASE.copper} />
            <Text style={styles.refreshText}>{wo ? "Yeesal" : "Actualiser"}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

export default LocationFinder;

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(181,98,42,0.25)",
    backgroundColor: "rgba(26,60,52,0.04)",
  },
  wrapRegular: {
    marginTop: 16,
    marginBottom: 24,
  },
  wrapCompact: {
    marginTop: 8,
    marginBottom: 8,
  },
  idleButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  pressed: {
    opacity: 0.9,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(181,98,42,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleCompact: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  idleTextWrap: {
    flex: 1,
  },
  idleTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: BASE.deepGreen,
  },
  idleSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "rgba(74,47,39,0.85)",
  },
  pinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BASE.copper,
    alignItems: "center",
    justifyContent: "center",
  },
  pinCircleCompact: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  loadingWrap: {
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: BASE.cocoa,
  },
  errorWrap: {
    padding: 16,
  },
  errorRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: BASE.cocoa,
    lineHeight: 18,
  },
  retryButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: "rgba(166,93,64,0.12)",
    borderWidth: 1,
    borderColor: "rgba(166,93,64,0.25)",
  },
  retryText: {
    fontSize: 12,
    fontWeight: "600",
    color: BASE.terracotta,
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: BASE.deepGreen,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(74,47,39,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  noticeCard: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  resultsWrap: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "rgba(181,98,42,0.12)",
  },
  cardCompact: {
    paddingVertical: 9,
  },
  cardTop: {
    flexDirection: "row",
    gap: 8,
  },
  centerName: {
    fontSize: 13,
    fontWeight: "700",
    color: BASE.deepGreen,
  },
  metaRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  typePill: {
    fontSize: 9,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    textTransform: "uppercase",
  },
  cityText: {
    fontSize: 10,
    color: "rgba(74,47,39,0.8)",
  },
  distancePill: {
    borderRadius: 99,
    backgroundColor: "rgba(181,98,42,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  distanceText: {
    fontSize: 11,
    color: BASE.copper,
    fontWeight: "700",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 8,
  },
  tagPill: {
    fontSize: 9,
    color: "rgba(74,47,39,0.7)",
    backgroundColor: "rgba(74,47,39,0.08)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
  },
  actionsRow: {
    marginTop: 8,
    flexDirection: "row",
    gap: 6,
  },
  mapsBtn: {
    flex: 1,
    minHeight: 32,
    borderRadius: 10,
    backgroundColor: BASE.deepGreen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  mapsBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  callBtn: {
    minWidth: 88,
    minHeight: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(26,60,52,0.15)",
    backgroundColor: "rgba(26,60,52,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 10,
  },
  callBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: BASE.deepGreen,
  },
  refreshBtn: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "rgba(181,98,42,0.1)",
    borderWidth: 1,
    borderColor: "rgba(181,98,42,0.2)",
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  refreshText: {
    fontSize: 12,
    fontWeight: "600",
    color: BASE.copper,
  },
});
