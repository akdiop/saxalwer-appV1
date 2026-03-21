import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import type { GoalId } from "../context/appcontext";

const C = {
  deepGreen: "#0F3D2E",
  beige: "#F5F1E6",
  beige2: "#EDE5D0",
  terracotta: "#C26A3D",
  copper: "#B5622A",
  cocoa: "#4A2F27",
};

interface Goal {
  id: GoalId;
  title: string;
  tagline: string;
  description: string;
  accent: string;
  bg: string;
  icon: React.ComponentProps<typeof Feather>["name"];
}

const GOALS: Goal[] = [
  {
    id: "cycle",
    title: "Cycle et règles",
    tagline: "Comprendre mon rythme",
    description: "Suivi des phases et signaux du corps",
    accent: C.deepGreen,
    bg: "#EFF5F2",
    icon: "moon",
  },
  {
    id: "grossesse",
    title: "Grossesse et fertilité",
    tagline: "Mon chemin vers la maternité",
    description: "Fertilité, conception et accompagnement",
    accent: C.terracotta,
    bg: "#FAF2EA",
    icon: "heart",
  },
  {
    id: "menopause",
    title: "Ménopause et transitions",
    tagline: "Traverser cette étape sereinement",
    description: "Périménopause et équilibre hormonal",
    accent: C.cocoa,
    bg: "#F5EEE8",
    icon: "sun",
  },
  {
    id: "bienetre",
    title: "Bien-être général",
    tagline: "Prendre soin de moi chaque jour",
    description: "Énergie, repos et écoute de soi",
    accent: C.copper,
    bg: "#FAF2EA",
    icon: "star",
  },
];

interface PersonalGoalsProps {
  selectedAge: string | null;
  onFinish: (goals: GoalId[]) => void;
}

export default function PersonalGoals({ onFinish }: PersonalGoalsProps) {
  const [primaryGoal, setPrimaryGoal] = React.useState<GoalId | null>(null);
  const [includeBienetre, setIncludeBienetre] = React.useState(false);

  const canContinue = primaryGoal !== null;

  const handleConfirm = () => {
    if (!primaryGoal) {
      return;
    }

    const goals: GoalId[] = [primaryGoal];
    if (includeBienetre && primaryGoal !== "bienetre") {
      goals.push("bienetre");
    }

    onFinish(goals);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.stepRow}>
            <View style={styles.stepBars}>
              <View style={styles.stepBarOn} />
              <View style={styles.stepBarOn} />
              <View style={styles.stepBarOn} />
            </View>
            <Text style={styles.stepLabel}>ÉTAPE 3 / 3</Text>
          </View>

          <Text style={styles.title}>Quel est ton objectif principal ?</Text>
          <Text style={styles.subtitle}>
            {!primaryGoal
              ? "Choisis ton objectif principal. Tu peux aussi ajouter le bien-être général."
              : primaryGoal === "bienetre"
              ? "Tu as choisi de te concentrer sur ton bien-être général."
              : includeBienetre
              ? "Objectif principal et bien-être général sélectionnés."
              : "Tu peux ajouter le bien-être général à ton objectif."}
          </Text>

          <View style={styles.goalList}>
            {GOALS.map((goal) => {
              const isSelected = primaryGoal === goal.id;

              return (
                <Pressable
                  key={goal.id}
                  onPress={() => setPrimaryGoal(goal.id)}
                  style={({ pressed }) => [
                    styles.goalCard,
                    {
                      backgroundColor: isSelected ? `${goal.accent}1A` : goal.bg,
                      borderColor: isSelected ? goal.accent : "rgba(15,61,46,0.12)",
                    },
                    pressed && styles.goalCardPressed,
                  ]}
                >
                  <View style={[styles.goalIconWrap, { backgroundColor: `${goal.accent}1F` }]}>
                    <Feather
                      name={goal.icon}
                      size={22}
                      color={isSelected ? goal.accent : `${C.cocoa}CC`}
                    />
                  </View>

                  <View style={styles.goalTextWrap}>
                    <Text style={[styles.goalTitle, { color: isSelected ? goal.accent : C.deepGreen }]}>
                      {goal.title}
                    </Text>
                    <Text style={styles.goalTagline}>{goal.tagline}</Text>
                    <Text style={[styles.goalDescription, { opacity: isSelected ? 0.75 : 0.45 }]}>
                      {goal.description}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.checkCircle,
                      {
                        borderColor: isSelected ? goal.accent : "rgba(15,61,46,0.2)",
                        backgroundColor: isSelected ? goal.accent : "transparent",
                      },
                    ]}
                  >
                    {isSelected ? <Feather name="check" size={13} color="#FFFFFF" /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {primaryGoal && primaryGoal !== "bienetre" ? (
            <View style={[styles.extraWrap, includeBienetre && styles.extraWrapOn]}>
              <View style={styles.extraTextWrap}>
                <Text style={[styles.extraTitle, includeBienetre && { color: C.copper }]}>
                  + Ajouter le bien-etre general
                </Text>
                <Text style={styles.extraSub}>Pour prendre soin de toi au quotidien</Text>
              </View>
              <Switch
                value={includeBienetre}
                onValueChange={setIncludeBienetre}
                thumbColor="#FFFFFF"
                trackColor={{ false: "rgba(15,61,46,0.25)", true: C.copper }}
              />
            </View>
          ) : null}

          <View style={styles.spacer} />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={handleConfirm}
            disabled={!canContinue}
            style={({ pressed }) => [
              styles.cta,
              !canContinue && styles.ctaDisabled,
              pressed && canContinue && styles.ctaPressed,
            ]}
          >
            <Text style={styles.ctaText}>Decouvrir mon espace</Text>
            <Feather name="arrow-right" size={18} color={C.beige} />
          </Pressable>
          <Text style={styles.footerCaption}>Tu pourras modifier cela dans Mon Espace</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.beige,
  },
  container: {
    flex: 1,
    backgroundColor: C.beige,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  stepBars: {
    flexDirection: "row",
    gap: 6,
  },
  stepBarOn: {
    width: 24,
    height: 4,
    borderRadius: 99,
    backgroundColor: C.deepGreen,
  },
  stepLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: `${C.cocoa}80`,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    color: C.deepGreen,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 18,
    fontSize: 14,
    lineHeight: 22,
    color: `${C.cocoa}B3`,
  },
  goalList: {
    gap: 12,
  },
  goalCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  goalCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  goalIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  goalTextWrap: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "600",
  },
  goalTagline: {
    marginTop: 2,
    fontSize: 12,
    color: `${C.cocoa}99`,
  },
  goalDescription: {
    marginTop: 4,
    fontSize: 11,
    color: `${C.cocoa}CC`,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.6,
    alignItems: "center",
    justifyContent: "center",
  },
  extraWrap: {
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(15,61,46,0.1)",
    backgroundColor: C.beige2,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  extraWrapOn: {
    backgroundColor: `${C.copper}1F`,
    borderColor: `${C.copper}66`,
  },
  extraTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  extraTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: C.deepGreen,
  },
  extraSub: {
    marginTop: 3,
    fontSize: 12,
    color: `${C.cocoa}B3`,
  },
  spacer: {
    height: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 26,
    backgroundColor: C.beige,
  },
  cta: {
    borderRadius: 16,
    backgroundColor: C.deepGreen,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: C.deepGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 3,
  },
  ctaDisabled: {
    opacity: 0.4,
  },
  ctaPressed: {
    transform: [{ scale: 0.97 }],
  },
  ctaText: {
    color: C.beige,
    fontSize: 16,
    fontWeight: "500",
  },
  footerCaption: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 10,
    color: `${C.cocoa}66`,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
