import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function LifeStagePoster() {
  return (
    <View style={styles.card}>
      <View style={styles.topGlow} />
      <View style={styles.ringLarge} />
      <View style={styles.ringSmall} />
      <View style={styles.dot} />

      <View style={styles.content}>
        <Text style={styles.eyebrow}>Life stage</Text>
        <Text style={styles.title}>A calm visual placeholder poster</Text>
        <Text style={styles.caption}>
          Temporary UI until the final Figma-generated version is ready.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 260,
    borderRadius: 24,
    backgroundColor: "#1F3D36",
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: 24,
  },
  topGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "58%",
    backgroundColor: "#2F5A50",
  },
  ringLarge: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: "rgba(231, 196, 126, 0.22)",
    top: -36,
    right: -52,
  },
  ringSmall: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "rgba(231, 196, 126, 0.18)",
    bottom: 52,
    left: -24,
  },
  dot: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(231, 196, 126, 0.18)",
    right: 34,
    bottom: 72,
  },
  content: {
    gap: 8,
  },
  eyebrow: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    maxWidth: "85%",
  },
  caption: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: "78%",
  },
});
