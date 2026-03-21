import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { DimensionValue } from "react-native";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";

interface LifeStagePosterProps {
  title: string;
  stage: "young" | "pregnant" | "mature";
  accent?: string;
  height?: DimensionValue;
  showBaobabWatermark?: boolean;
}

const BASE = {
  beige: "#F5F1E6",
  deepGreen: "#1A3C34",
  green2: "#2D4B42",
  copper: "#B5622A",
  cocoa: "#4A2F27",
};

function StageShape({ stage }: { stage: "young" | "pregnant" | "mature" }) {
  if (stage === "pregnant") {
    return (
      <Svg width={80} height={80} viewBox="0 0 100 100" fill={BASE.deepGreen}>
        <Path d="M50 42 C46 38 44 34 44 30 C44 24 47 20 50 20 C53 20 56 24 56 30 C56 34 54 38 50 42 Z" />
        <Path d="M50 42 C42 45 38 50 36 58 C32 62 30 68 30 75 C30 84 35 90 45 90 L55 90 C65 90 70 84 70 75 C70 68 68 62 64 58 C62 50 58 45 50 42 Z" />
      </Svg>
    );
  }

  if (stage === "mature") {
    return (
      <Svg width={80} height={80} viewBox="0 0 100 100" fill={BASE.deepGreen}>
        <Path d="M50 40 C47 37 45 34 45 31 C45 26 47 23 50 23 C53 23 55 26 55 31 C55 34 53 37 50 40 Z" />
        <Path d="M50 40 C43 43 40 48 38 55 L35 85 L65 85 L62 55 C60 48 57 43 50 40 Z" />
        <Path d="M42 85 L35 95 L65 95 L58 85 Z" />
      </Svg>
    );
  }

  return (
    <Svg width={80} height={80} viewBox="0 0 100 100" fill={BASE.deepGreen}>
      <Path d="M50 45 C45 40 42 35 42 30 C42 22 46 18 50 18 C54 18 58 22 58 30 C58 35 55 40 50 45 Z" />
      <Path d="M50 45 C40 48 35 55 33 65 L33 90 L67 90 L67 65 C65 55 60 48 50 45 Z" />
    </Svg>
  );
}

export default function LifeStagePoster({
  title,
  stage,
  accent = BASE.deepGreen,
  height = 240,
  showBaobabWatermark = false,
}: LifeStagePosterProps) {
  return (
    <View style={[styles.wrap, { height }]}> 
      <View style={styles.topGradient} />

      <View style={styles.rings}>
        <Svg width={340} height={340} viewBox="0 0 340 340" fill="none">
          <Circle cx="170" cy="170" r="150" stroke={BASE.cocoa} strokeWidth={1} opacity={0.08} />
          <Circle cx="170" cy="170" r="120" stroke={BASE.cocoa} strokeWidth={0.8} opacity={0.06} />
        </Svg>
      </View>

      {showBaobabWatermark ? (
        <View style={styles.baobab}>
          <Svg width={160} height={160} viewBox="0 0 100 120" fill={BASE.cocoa}>
            <Rect x="46" y="65" width="8" height="45" rx="3" opacity={0.18} />
            <Ellipse cx="50" cy="50" rx="32" ry="28" opacity={0.18} />
            <Ellipse cx="22" cy="48" rx="20" ry="16" opacity={0.15} />
            <Ellipse cx="78" cy="48" rx="20" ry="16" opacity={0.15} />
          </Svg>
        </View>
      ) : null}

      <View style={styles.moon}>
        <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
          <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#E8DCC8" />
        </Svg>
      </View>

      <View style={styles.centerWrap}>
        <View style={[styles.frameOuter, { borderColor: accent }]} />
        <View style={[styles.frameInner, { borderColor: `${accent}66` }]} />
        <StageShape stage={stage} />
      </View>

      <View style={styles.bottomShade} />

      {title ? (
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    backgroundColor: BASE.beige,
    borderRadius: 24,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "65%",
    backgroundColor: BASE.green2,
    opacity: 0.85,
  },
  rings: {
    position: "absolute",
    top: -90,
    right: -90,
  },
  baobab: {
    position: "absolute",
    left: 6,
    bottom: 10,
  },
  moon: {
    position: "absolute",
    top: 16,
    right: 30,
    opacity: 0.55,
  },
  centerWrap: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  frameOuter: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    opacity: 0.4,
  },
  frameInner: {
    position: "absolute",
    width: 122,
    height: 122,
    borderRadius: 61,
    borderWidth: 1,
    opacity: 0.3,
  },
  bottomShade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "42%",
    backgroundColor: "rgba(26,60,52,0.82)",
  },
  titleWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 23,
    lineHeight: 28,
    fontWeight: "600",
  },
});
