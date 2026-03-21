import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const BASE = {
  beige: "#F5F1E6",
  deepGreen: "#1A3C34",
  terracotta: "#A65D40",
  copper: "#B5622A",
  cocoa: "#4A2F27",
};

interface PrivacyCommitmentProps {
  onAccept?: () => void;
}

export default function PrivacyCommitment({ onAccept }: PrivacyCommitmentProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>SW</Text>
          </View>
        </View>

        <Text style={styles.title}>Votre vie privée, notre engagement sacré.</Text>

        <View style={styles.featureList}>
          <Feature
            icon={<Feather name="shield" size={24} color={BASE.deepGreen} />}
            iconBg="rgba(26,60,52,0.15)"
            title="Confidentialité totale"
            text="Vos données de santé sont cryptées et ne seront jamais partagées. SaxalWér est votre espace sécurisé."
          />

          <Feature
            icon={<Feather name="eye" size={24} color={BASE.terracotta} />}
            iconBg="rgba(166,93,64,0.15)"
            title="Mode discret"
            text="Activez le mode discret à tout moment pour masquer instantanément vos informations sensibles d'un simple geste."
          />

          <Feature
            icon={<MaterialIcons name="storage" size={24} color={BASE.copper} />}
            iconBg="rgba(181,98,42,0.15)"
            title="Contrôle de vos données"
            text="Vous restez maître de vos informations. Vous pouvez les supprimer définitivement à tout moment."
          />
        </View>

        <Text style={styles.disclaimer}>
          En continuant, vous acceptez nos conditions d&apos;utilisation et notre politique de protection des données.
        </Text>

        <Pressable onPress={onAccept} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Je comprends et j&apos;accepte</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Feature({
  icon,
  iconBg,
  title,
  text,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.featureRow}>
      <View style={[styles.featureIconWrap, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.featureTextWrap}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    maxWidth: 560,
    width: "100%",
    alignSelf: "center",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 18,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(26,60,52,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: BASE.deepGreen,
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 31,
    lineHeight: 40,
    fontWeight: "700",
    color: BASE.deepGreen,
    textAlign: "center",
    marginBottom: 20,
  },
  featureList: {
    gap: 18,
  },
  featureRow: {
    flexDirection: "row",
    gap: 14,
  },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: BASE.deepGreen,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 15,
    lineHeight: 23,
    color: BASE.cocoa,
  },
  disclaimer: {
    marginTop: 26,
    marginBottom: 22,
    fontSize: 13,
    lineHeight: 21,
    color: `${BASE.cocoa}DD`,
    textAlign: "center",
  },
  button: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: BASE.deepGreen,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(26,60,52,0.5)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 2,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: BASE.beige,
    fontSize: 17,
    fontWeight: "600",
  },
});
