import React from "react";
import Svg, { Path } from "react-native-svg";

interface AfricaOutlineProps {
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
}

export default function AfricaOutline({
  width = 400,
  height = 500,
  color = "#1A3C34",
  opacity = 0.05,
}: AfricaOutlineProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 400 500" fill="none" opacity={opacity}>
      <Path
        d="M200 50 C180 60, 160 80, 150 100 C140 120, 135 140, 130 160 C125 180, 120 200, 115 220 C110 240, 105 260, 100 280 C95 300, 90 320, 95 340 C100 360, 110 380, 125 395 C140 410, 160 420, 180 425 C200 430, 220 430, 240 425 C260 420, 280 410, 295 395 C310 380, 320 360, 325 340 C330 320, 330 300, 325 280 C320 260, 310 240, 300 220 C290 200, 280 180, 275 160 C270 140, 268 120, 265 100 C260 80, 250 60, 235 50 C220 40, 210 45, 200 50 Z M210 70 L220 90 M230 110 L240 125"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        opacity={0.4}
      />
    </Svg>
  );
}
