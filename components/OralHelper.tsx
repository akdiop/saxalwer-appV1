import { Feather } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import React, { useCallback } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { useApp } from "../context/appcontext";

const BASE = {
  copper: "#B5622A",
  cocoa: "#4A2F27",
};

export function useOralSpeak() {
  const { oralMode, language } = useApp();
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const speak = useCallback(
    (text: string) => {
      if (!oralMode || !text) {
        return;
      }

      Speech.stop();
      Speech.speak(text, {
        language: language === "wo" ? "fr-FR" : "fr-FR",
        rate: 0.85,
        onStart: () => setIsSpeaking(true),
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    },
    [oralMode, language]
  );

  const stop = useCallback(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, oralMode, isSpeaking };
}

export function OralBadge({
  size = 10,
  color = BASE.copper,
  style,
}: {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.badgeWrap, style]}>
      <Feather name="volume-2" size={size} color={color} />
    </View>
  );
}

export function Speakable({
  text,
  children,
  style,
  onPress,
  badge = true,
  badgeColor,
}: {
  text: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  badge?: boolean;
  badgeColor?: string;
}) {
  const { speak, oralMode } = useOralSpeak();

  const handlePress = () => {
    speak(text);
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress} style={[styles.speakable, style]}>
      {children}
      {oralMode && badge ? (
        <Feather
          name="volume-2"
          size={10}
          color={badgeColor || BASE.copper}
          style={styles.speakIcon}
        />
      ) : null}
    </Pressable>
  );
}

export default function OralHelper() {
  return null;
}

const styles = StyleSheet.create({
  badgeWrap: {
    position: "absolute",
    bottom: -2,
    right: -2,
  },
  speakable: {
    position: "relative",
  },
  speakIcon: {
    position: "absolute",
    top: 4,
    right: 4,
    opacity: 0.6,
  },
});
