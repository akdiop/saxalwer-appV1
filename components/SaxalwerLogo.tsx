import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

interface SaxalwerLogoProps {
  size?: number;
  showMoon?: boolean;
  variant?: "light" | "dark";
}

export function SaxalwerLogo({
  size = 144,
  showMoon = true,
  variant = "light",
}: SaxalwerLogoProps) {
  const bgColor = variant === "light" ? "#E8DCC8" : "#0F3D2E";
  const fgColor = variant === "light" ? "#0F3D2E" : "#E8DCC8";
  const moonColor = variant === "light" ? "#E8DCC8" : "#0F3D2E";

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.mainCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bgColor,
          },
        ]}
      >
        <Svg
          width={size * 0.625}
          height={size * 0.625}
          viewBox="0 0 90 90"
          fill="none"
        >
          <Circle cx="45" cy="45" r="4" fill={fgColor} />

          <Path d="M45 25 Q35 35, 45 45 Q55 35, 45 25 Z" fill={fgColor} opacity={0.3} />
          <Path d="M65 45 Q55 35, 45 45 Q55 55, 65 45 Z" fill={fgColor} opacity={0.4} />
          <Path d="M45 65 Q35 55, 45 45 Q55 55, 45 65 Z" fill={fgColor} opacity={0.3} />
          <Path d="M25 45 Q35 35, 45 45 Q35 55, 25 45 Z" fill={fgColor} opacity={0.4} />

          <Path d="M45 30 A15 15 0 0 1 60 45" stroke={fgColor} strokeWidth="1.5" opacity={0.6} />
          <Path d="M60 45 A15 15 0 0 1 45 60" stroke={fgColor} strokeWidth="1.5" opacity={0.6} />
          <Path d="M45 60 A15 15 0 0 1 30 45" stroke={fgColor} strokeWidth="1.5" opacity={0.6} />
          <Path d="M30 45 A15 15 0 0 1 45 30" stroke={fgColor} strokeWidth="1.5" opacity={0.6} />
        </Svg>
      </View>

      {showMoon ? (
        <View
          style={{
            position: "absolute",
            top: -size * 0.04,
            right: -size * 0.04,
          }}
        >
          <Feather
            name="moon"
            size={size * 0.333}
            color={moonColor}
            style={{ opacity: 0.95 }}
          />
        </View>
      ) : null}
    </View>
  );
}

export default SaxalwerLogo;

const styles = StyleSheet.create({
  mainCircle: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
});
