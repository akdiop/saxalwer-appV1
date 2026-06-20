import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { LifeSituation } from "../../context/appcontext";

const BASE = {
  beige: "#F5F1E6",
  deepGreen: "#1A3C34",
  terracotta: "#A65D40",
  copper: "#B5622A",
  cocoa: "#4A2F27",
  gold: "#D4AF37",
};

type IconName = React.ComponentProps<typeof Feather>["name"];

const SITUATIONS: {
  id: LifeSituation;
  icon: IconName;
  color: string;
  label: { fr: string; wo: string };
  description: { fr: string; wo: string };
}[] = [
  {
    id: "curious",
    icon: "star",
    color: BASE.gold,
    label: { fr: "Curieuse / Decouverte", wo: "Xam-xam / Gis-gis" },
    description: { fr: "Je veux en apprendre sur mon corps", wo: "Begg na xam ci sama yaram" },
  },
  {
    id: "cycles",
    icon: "moon",
    color: BASE.deepGreen,
    label: { fr: "Comprendre mes cycles", wo: "Xam sama cycle" },
    description: { fr: "Mieux connaitre mon cycle menstruel", wo: "Xam bu baax sama cycle bi" },
  },
  {
    id: "contraception",
    icon: "shield",
    color: BASE.copper,
    label: { fr: "Contraception", wo: "Contraception" },
    description: { fr: "Eviter une grossesse non desiree", wo: "Jiitu ci gatt bu beggul" },
  },
  {
    id: "pregnant",
    icon: "user",
    color: BASE.terracotta,
    label: { fr: "Enceinte", wo: "Gatt na" },
    description: { fr: "Je suis actuellement enceinte", wo: "Gatt na leegi" },
  },
  {
    id: "trying",
    icon: "heart",
    color: BASE.terracotta,
    label: { fr: "Essai de conception", wo: "Seet ci gatt" },
    description: { fr: "J'essaie de tomber enceinte", wo: "Dama seet ci gatt" },
  },
  {
    id: "postpartum",
    icon: "feather",
    color: BASE.deepGreen,
    label: { fr: "Post-partum", wo: "Apres gatt" },
    description: { fr: "Apres la naissance de mon bebe", wo: "Ci ginnaaw doom bi" },
  },
  {
    id: "menopause",
    icon: "sun",
    color: BASE.copper,
    label: { fr: "Menopause / Pre-menopause", wo: "Menopause" },
    description: { fr: "Transition vers la ménopause", wo: "Transition ci menopause" },
  },
  {
    id: "general",
    icon: "sunrise",
    color: BASE.gold,
    label: { fr: "Bien-être général", wo: "Jamm ak yaram" },
    description: { fr: "Prendre soin de ma santé globale", wo: "Saxal sama yaram bu mat" },
  },
  {
    id: "prefer-not-say",
    icon: "help-circle",
    color: "rgba(74,47,39,0.6)",
    label: { fr: "Préfère ne pas préciser", wo: "Begg naa du wax" },
    description: { fr: "Je souhaite garder cela privé", wo: "Begg naa mu dekk sutura" },
  },
];

interface Props {
  onSelect?: (situation: LifeSituation) => void;
  language?: "fr" | "wo";
}

export default function LifeSituationSelection({ onSelect, language = "fr" }: Props) {
  const [selected, setSelected] = useState<LifeSituation | null>(null);
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, lift]);

  const handleSelect = (id: LifeSituation) => {
    setSelected(id);
    setTimeout(() => onSelect?.(id), 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fade, transform: [{ translateY: lift }] }]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {language === "wo" ? "Sa xalaat bu leegi" : "Votre situation actuelle"}
            </Text>
            <Text style={styles.subtitle}>
              {language === "wo"
                ? "Choisissez ci lu la ci boppam leegi. Amul jafe-jafe, lepp parcours am na valeur."
                : "Choisissez ce qui correspond à votre situation actuelle. Il n'y a pas de mauvaise réponse, chaque parcours a sa valeur."}
            </Text>
          </View>

          <View style={styles.note}>
            <View style={styles.noteRow}>
              <Feather name="alert-circle" size={14} color={BASE.gold} style={styles.noteIcon} />
              <Text style={styles.noteText}>
                {language === "wo"
                  ? "Dina gen a soppi sa situation ca kanam. Sa parcours la sa boppam, nu respectal ko."
                  : "Vous pourrez modifier votre situation à tout moment. Votre parcours est unique, et nous le respectons."}
              </Text>
            </View>
          </View>

          <View style={styles.list}>
            {SITUATIONS.map((situation) => {
              const active = selected === situation.id;

              return (
                <Pressable
                  key={situation.id}
                  onPress={() => handleSelect(situation.id)}
                  style={({ pressed }) => [
                    styles.card,
                    {
                      backgroundColor: active ? situation.color : "#FFFFFF",
                      borderColor: active ? situation.color : `${situation.color}4D`,
                      shadowColor: active ? situation.color : BASE.deepGreen,
                    },
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      {
                        backgroundColor: active ? "rgba(255,255,255,0.2)" : `${situation.color}26`,
                      },
                    ]}
                  >
                    <Feather
                      name={situation.icon}
                      size={24}
                      color={active ? "#FFFFFF" : situation.color}
                    />
                  </View>

                  <View style={styles.cardTextWrap}>
                    <Text style={[styles.cardTitle, { color: active ? "#FFFFFF" : situation.color }]}>
                      {situation.label[language]}
                    </Text>
                    <Text style={[styles.cardDescription, { opacity: active ? 0.9 : 0.65, color: active ? "#FFFFFF" : BASE.cocoa }]}>
                      {situation.description[language]}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.privacyWrap}>
            <Feather name="lock" size={11} color={BASE.cocoa} />
            <Text style={styles.privacyText}>
              {language === "wo"
                ? "Sa xalaat bi sutura na lool, doxal na ci sa telephone rekk"
                : "Votre situation reste strictement confidentielle et stockee localement"}
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  container: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: BASE.deepGreen,
    lineHeight: 40,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: BASE.cocoa,
    lineHeight: 22,
    opacity: 0.85,
    maxWidth: 420,
    textAlign: "center",
  },
  note: {
    backgroundColor: "rgba(212,175,55,0.12)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.25)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  noteIcon: {
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: BASE.cocoa,
    lineHeight: 18,
    fontStyle: "italic",
  },
  list: {
    gap: 12,
    flex: 1,
  },
  card: {
    borderWidth: 2,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 18,
  },
  cardDescription: {
    fontSize: 11,
    lineHeight: 15,
  },
  privacyWrap: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  privacyText: {
    fontSize: 10,
    color: BASE.cocoa,
    opacity: 0.5,
    lineHeight: 14,
  },
});
