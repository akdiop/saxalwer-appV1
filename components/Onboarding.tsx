import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { useApp } from "../context/appcontext";

const COLORS = {
  deepGreen: "#1A3C34",
  cacaoBrown: "#4A2F27",
  bone: "#F5F1E6",
};

const CONTENT = {
  fr: {
    subtitle: "Un sanctuaire de douceur pour ta santé.",
    caption: "Écoute le rythme de ton corps.",
    button: "Entrer dans l'espace",
    footer: "Sagesse et science - Confidentialité absolue",
  },
  wo: {
    subtitle: "Berebu karange ak sellel ngir sa wer-gi-yaram.",
    caption: "Deglul bet-u sa yaram.",
    button: "Duggu ci biir",
    footer: "Xam-xam ak Teggine - Sutura bu mat sekk",
  },
};

interface OnboardingProps {
  onFinish: () => void;
}

export default function Onboarding({ onFinish }: OnboardingProps) {
  const { language } = useApp();
  const t = CONTENT[language] || CONTENT.fr;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topWrap}>
          <View style={styles.logoFrame}>
            <View style={styles.outerRing} />
            <View style={styles.innerRing} />
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>SW</Text>
            </View>
          </View>

          <View style={styles.titleWrap}>
            <Text style={styles.subtitle}>{t.subtitle}</Text>
            <Text style={styles.caption}>{t.caption}</Text>
          </View>
        </View>

        <View style={styles.bottomWrap}>
          <Pressable onPress={onFinish} style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
            <Text style={styles.ctaText}>{t.button}</Text>
            <Feather name="arrow-right" size={18} color={COLORS.bone} />
          </Pressable>

          <Text style={styles.footer}>{t.footer}</Text>
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 26,
  },
  topWrap: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  logoFrame: {
    width: 288,
    height: 288,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: "rgba(26,60,52,0.08)",
  },
  innerRing: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: "rgba(26,60,52,0.12)",
  },
  logoCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,60,52,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: COLORS.deepGreen,
    fontSize: 60,
    lineHeight: 64,
    fontWeight: "700",
    letterSpacing: 1,
  },
  titleWrap: {
    maxWidth: 280,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 31,
    lineHeight: 39,
    fontWeight: "500",
    color: COLORS.deepGreen,
    textAlign: "center",
  },
  caption: {
    marginTop: 12,
    fontSize: 14,
    color: "rgba(74,47,39,0.5)",
    fontStyle: "italic",
    textAlign: "center",
  },
  bottomWrap: {
    width: "100%",
    alignItems: "center",
    gap: 18,
    marginBottom: 8,
  },
  cta: {
    width: "100%",
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: COLORS.deepGreen,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: COLORS.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 2,
  },
  ctaPressed: {
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    color: COLORS.bone,
    fontSize: 17,
    fontWeight: "600",
  },
  footer: {
    fontSize: 10,
    color: "rgba(74,47,39,0.3)",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    lineHeight: 16,
    maxWidth: 260,
  },
});
