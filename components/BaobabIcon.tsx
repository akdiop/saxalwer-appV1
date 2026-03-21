
import React from 'react';
import Svg, { Ellipse, Path, Rect } from 'react-native-svg';

export interface BaobabIconProps {
  size?: number;
  color?: string;
  opacity?: number;
  style?: any;
}

export function BaobabIcon({
  size = 56,
  color = 'currentColor',
  opacity = 0.15,
  style = {},
}: BaobabIconProps) {
  const height = (size * 72) / 56;
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 56 72"
      fill="none"
      style={[{ opacity, color }, style]}
    >
      {/* Trunk */}
      <Rect x="24" y="40" width="8" height="32" fill="currentColor" opacity={0.5} />
      {/* Crown */}
      <Ellipse cx="28" cy="28" rx="20" ry="16" fill="currentColor" opacity={0.3} />
      {/* Branches */}
      <Path
        d="M20 24 Q15 20, 12 18 M36 24 Q41 20, 44 18 M16 30 Q12 28, 10 26 M40 30 Q44 28, 46 26"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.4}
      />
    </Svg>
  );
}

export default BaobabIcon;
