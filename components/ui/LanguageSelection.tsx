import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import type { Language } from "../../context/appcontext";

const COLORS = {
  deepGreen: "#1A3C34",
  terracotta: "#A65D40",
  cocoa: "#4A2F27",
  bone: "#F5F1E6",
};

interface LanguageSelectionProps {
  onSelect?: (lang: Language) => void;
}

function BaobabMark() {
  return (
    <View style={styles.baobabMark}>
      <Svg width={80} height={80} viewBox="0 0 100 100" fill={COLORS.deepGreen}>
        <Path d="M45 90 C40 85 35 70 35 60 C35 50 45 35 50 25 C55 35 65 50 65 60 C65 70 60 85 55 90 Z" />
      </Svg>
    </View>
  );
}

function LanguageCard({
  code,
  title,
  subtitle,
  withAudio,
  onPress,
}: {
  code: "FR" | "WO";
  title: string;
  subtitle: string;
  withAudio?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.cardLeft}>
        <View style={styles.langBadge}>
          <Text style={styles.langBadgeText}>{code}</Text>
        </View>

        <View style={styles.cardTextWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>{title}</Text>
            {withAudio ? (
              <View style={styles.audioPill}>
                <Feather name="volume-2" size={12} color={COLORS.terracotta} />
              </View>
            ) : null}
          </View>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </View>

      <Feather name="chevron-right" size={20} color="rgba(74,47,39,0.3)" />
    </Pressable>
  );
}

export default function LanguageSelection({ onSelect }: LanguageSelectionProps) {
  const fade = useRef(new Animated.Value(0)).current;
  const move = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(move, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, move]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: move }] }]}>
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>SW</Text>
            </View>
            <Text style={styles.title}>Choisissez votre langue d&apos;accueil.</Text>
            <View style={styles.underline} />
          </View>

          <View style={styles.cardsWrap}>
            <LanguageCard
              code="FR"
              title="Français"
              subtitle="Accès textuel complet."
              onPress={() => onSelect?.("fr")}
            />

            <View>
              <BaobabMark />
              <LanguageCard
                code="WO"
                title="Wolof"
                subtitle="Support audio et textuel inclus."
                withAudio
                onPress={() => onSelect?.("wo")}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerTop}>
              Vous pourrez modifier ce choix à tout moment dans les réglages.
            </Text>
            <Text style={styles.footerBottom}>
              D&apos;autres langues locales sont à venir : Bambara, Peul, Sérère, Diola...
            </Text>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bone,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bone,
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 44,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,60,52,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.deepGreen,
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "700",
    color: COLORS.deepGreen,
    textAlign: "center",
  },
  underline: {
    width: 48,
    height: 2,
    backgroundColor: COLORS.terracotta,
    marginTop: 16,
    opacity: 0.3,
  },
  cardsWrap: {
    rowGap: 24,
    flex: 1,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,60,52,0.1)",
    borderRadius: 16,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 14,
    flex: 1,
  },
  langBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bone,
    alignItems: "center",
    justifyContent: "center",
  },
  langBadgeText: {
    color: COLORS.deepGreen,
    fontWeight: "700",
    fontSize: 13,
  },
  cardTextWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  cardTitle: {
    color: COLORS.deepGreen,
    fontSize: 24,
    fontWeight: "700",
  },
  audioPill: {
    backgroundColor: "rgba(166,93,64,0.1)",
    borderRadius: 999,
    padding: 4,
  },
  cardSubtitle: {
    color: "rgba(74,47,39,0.5)",
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
    fontStyle: "italic",
  },
  baobabMark: {
    position: "absolute",
    right: -8,
    bottom: -16,
    opacity: 0.03,
    transform: [{ rotate: "12deg" }],
    zIndex: 1,
  },
  footer: {
    marginTop: 40,
  },
  footerTop: {
    fontSize: 10,
    textAlign: "center",
    color: "rgba(74,47,39,0.4)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    lineHeight: 16,
  },
  footerBottom: {
    fontSize: 11,
    textAlign: "center",
    color: "rgba(74,47,39,0.35)",
    fontStyle: "italic",
    marginTop: 12,
    lineHeight: 16,
  },
});
