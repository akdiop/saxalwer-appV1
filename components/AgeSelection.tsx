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
import Svg, { Circle, Ellipse, Line, Path, Rect } from "react-native-svg";

interface AgeRange {
  id: string;
  label: string;
  description: string;
  symbol: React.ReactNode;
  accentColor: string;
  bgColor: string;
  textColor: string;
}

interface AgeSelectionProps {
  onSelect?: (ageRange: string) => void;
}

const CrescentWatermark = ({
  x,
  y,
  size,
  opacity,
  rotate,
}: {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotate: number;
}) => (
  <View style={[styles.crescentWrap, { left: x, top: y, opacity, transform: [{ rotate: `${rotate}deg` }] }]}>
    <Svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <Path
        d="M30 5 C15 5, 5 17, 5 30 C5 43, 15 55, 30 55 C18 50, 10 40, 10 30 C10 20, 18 10, 30 5Z"
        fill="#0F3D2E"
      />
    </Svg>
  </View>
);

const BaobabWatermark = () => (
  <View style={styles.baobabWrap}>
    <Svg width={200} height={200} viewBox="0 0 100 120" fill="#0F3D2E">
      <Rect x="46" y="60" width="8" height="50" rx="3" />
      <Ellipse cx="50" cy="50" rx="30" ry="25" />
      <Ellipse cx="25" cy="45" rx="18" ry="14" />
      <Ellipse cx="75" cy="45" rx="18" ry="14" />
      <Ellipse cx="15" cy="55" rx="12" ry="9" />
      <Ellipse cx="85" cy="55" rx="12" ry="9" />
      <Path d="M50 25 C40 15 30 18 25 25 C30 20 40 22 50 25Z" />
      <Path d="M50 25 C60 15 70 18 75 25 C70 20 60 22 50 25Z" />
    </Svg>
  </View>
);

const PetaleSymbol = ({ color }: { color: string }) => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Circle cx="14" cy="14" r="4" fill={color} opacity={0.6} />
    <Ellipse cx="14" cy="7" rx="3" ry="5" fill={color} opacity={0.25} />
    <Ellipse cx="14" cy="21" rx="3" ry="5" fill={color} opacity={0.25} />
    <Ellipse cx="7" cy="14" rx="5" ry="3" fill={color} opacity={0.25} />
    <Ellipse cx="21" cy="14" rx="5" ry="3" fill={color} opacity={0.25} />
  </Svg>
);

const CrescentSymbol = ({ color }: { color: string }) => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 4 C8 4, 4 8.5, 4 14 C4 19.5, 8 24, 14 24 C10 21.5, 7.5 18, 7.5 14 C7.5 10, 10 6.5, 14 4Z"
      fill={color}
      opacity={0.7}
    />
  </Svg>
);

const CircleSymbol = ({ color }: { color: string }) => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Circle cx="14" cy="14" r="10" stroke={color} strokeWidth={1.5} opacity={0.5} />
    <Circle cx="14" cy="14" r="6" stroke={color} strokeWidth={1} opacity={0.35} />
    <Circle cx="14" cy="14" r="2.5" fill={color} opacity={0.6} />
  </Svg>
);

const LeafSymbol = ({ color }: { color: string }) => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 24 C14 24, 4 18, 5 10 C8 4, 16 4, 20 9 C24 14, 14 24, 14 24Z"
      fill={color}
      opacity={0.45}
    />
    <Line x1="14" y1="24" x2="12" y2="12" stroke={color} strokeWidth={1} opacity={0.5} />
  </Svg>
);

const StarSymbol = ({ color }: { color: string }) => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 4 L15.8 10.5 L22.5 10.5 L17 14.5 L19 21 L14 17 L9 21 L11 14.5 L5.5 10.5 L12.2 10.5Z"
      fill={color}
      opacity={0.45}
    />
  </Svg>
);

const ageRanges: AgeRange[] = [
  {
    id: "15-17",
    label: "15 - 17",
    description: "Découverte et premières questions",
    symbol: <PetaleSymbol color="#C26A3D" />,
    accentColor: "#C26A3D",
    bgColor: "#FDF8F2",
    textColor: "#4A2F27",
  },
  {
    id: "18-24",
    label: "18 - 24",
    description: "Eveil, autonomie et exploration",
    symbol: <CrescentSymbol color="#0F3D2E" />,
    accentColor: "#0F3D2E",
    bgColor: "#F4F8F6",
    textColor: "#0F3D2E",
  },
  {
    id: "25-34",
    label: "25 - 34",
    description: "Épanouissement et projets de vie",
    symbol: <CircleSymbol color="#C26A3D" />,
    accentColor: "#BF5B40",
    bgColor: "#FDF8F2",
    textColor: "#4A2F27",
  },
  {
    id: "35-49",
    label: "35 - 49",
    description: "Maturite, equilibre et transitions",
    symbol: <LeafSymbol color="#1A3C34" />,
    accentColor: "#1A3C34",
    bgColor: "#F4F8F6",
    textColor: "#1A3C34",
  },
  {
    id: "50+",
    label: "50 +",
    description: "Plenitude, sagesse et serenite",
    symbol: <StarSymbol color="#4A2F27" />,
    accentColor: "#4A2F27",
    bgColor: "#F9F5EE",
    textColor: "#4A2F27",
  },
];

export default function AgeSelection({ onSelect }: AgeSelectionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 650,
      useNativeDriver: true,
    }).start();
  }, [titleOpacity]);

  useEffect(() => {
    Animated.timing(ctaOpacity, {
      toValue: selected ? 1 : 0.45,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [ctaOpacity, selected]);

  const handleContinue = () => {
    if (selected && onSelect) {
      onSelect(selected);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CrescentWatermark x={-18} y={60} size={90} opacity={0.06} rotate={20} />
        <CrescentWatermark x={300} y={36} size={60} opacity={0.05} rotate={-30} />
        <CrescentWatermark x={28} y={390} size={50} opacity={0.04} rotate={60} />
        <CrescentWatermark x={290} y={460} size={80} opacity={0.05} rotate={-15} />
        <CrescentWatermark x={10} y={620} size={45} opacity={0.04} rotate={40} />
        <BaobabWatermark />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: titleOpacity }}>
            <View style={styles.stepRow}>
              <View style={styles.stepBars}>
                <View style={[styles.stepBar, { backgroundColor: "#0F3D2E" }]} />
                <View style={styles.stepBarMuted} />
                <View style={styles.stepBarMuted} />
              </View>
              <Text style={styles.stepText}>ETAPE 1 / 3</Text>
            </View>

            <Text style={styles.title}>Choisis ta{"\n"}tranche d&apos;age</Text>
            <Text style={styles.subtitle}>Pour un accompagnement adapte a ton parcours.</Text>
          </Animated.View>

          <View style={styles.cardList}>
            {ageRanges.map((range) => {
              const isSelected = selected === range.id;
              return (
                <Pressable
                  key={range.id}
                  onPress={() => setSelected(range.id)}
                  style={({ pressed }) => [
                    styles.card,
                    {
                      backgroundColor: isSelected ? `${range.accentColor}1A` : range.bgColor,
                      borderColor: isSelected ? range.accentColor : "rgba(15,61,46,0.08)",
                    },
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.symbolWrap,
                      {
                        backgroundColor: isSelected
                          ? `${range.accentColor}1A`
                          : "rgba(15,61,46,0.04)",
                      },
                    ]}
                  >
                    {range.symbol}
                  </View>

                  <View style={styles.cardTextWrap}>
                    <Text
                      style={[
                        styles.cardLabel,
                        { color: isSelected ? range.accentColor : "#1A3C34" },
                      ]}
                    >
                      {range.label}
                    </Text>
                    <Text
                      style={[
                        styles.cardDescription,
                        { color: range.textColor, opacity: isSelected ? 0.7 : 0.4 },
                      ]}
                    >
                      {range.description}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.checkCircle,
                      {
                        borderColor: isSelected
                          ? range.accentColor
                          : "rgba(15,61,46,0.15)",
                        backgroundColor: isSelected ? range.accentColor : "transparent",
                      },
                    ]}
                  >
                    {isSelected ? <Feather name="check" size={14} color="#FFFFFF" /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.bottomGap} />
        </ScrollView>

        <View style={styles.footer}>
          <Animated.View style={{ opacity: ctaOpacity }}>
            <Pressable
              onPress={handleContinue}
              disabled={!selected}
              style={({ pressed }) => [
                styles.continueButton,
                pressed && selected ? styles.continuePressed : null,
              ]}
            >
              <Text style={styles.continueText}>Continuer</Text>
              <Feather name="arrow-right" size={18} color="#F5F1E6" />
            </Pressable>
          </Animated.View>
          <Text style={styles.footerCaption}>
            Information generale - Ne remplace pas une consultation medicale
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F1E6",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F1E6",
    position: "relative",
  },
  crescentWrap: {
    position: "absolute",
    pointerEvents: "none",
  },
  baobabWrap: {
    position: "absolute",
    bottom: 80,
    right: -20,
    opacity: 0.035,
    pointerEvents: "none",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    marginBottom: 28,
  },
  stepBars: {
    flexDirection: "row",
    columnGap: 6,
  },
  stepBar: {
    width: 24,
    height: 4,
    borderRadius: 10,
  },
  stepBarMuted: {
    width: 24,
    height: 4,
    borderRadius: 10,
    backgroundColor: "#D8CCB8",
  },
  stepText: {
    color: "rgba(74,47,39,0.5)",
    fontSize: 11,
    letterSpacing: 1.2,
  },
  title: {
    color: "#0F3D2E",
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "500",
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(74,47,39,0.55)",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  cardList: {
    rowGap: 12,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 20,
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    shadowColor: "#0F3D2E",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
  },
  symbolWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTextWrap: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomGap: {
    height: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    backgroundColor: "#F5F1E6",
  },
  continueButton: {
    width: "100%",
    backgroundColor: "#0F3D2E",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 10,
    shadowColor: "#0F3D2E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 2,
  },
  continuePressed: {
    transform: [{ scale: 0.97 }],
  },
  continueText: {
    color: "#F5F1E6",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  footerCaption: {
    marginTop: 14,
    color: "rgba(74,47,39,0.35)",
    fontSize: 10,
    textAlign: "center",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    lineHeight: 14,
  },
});
