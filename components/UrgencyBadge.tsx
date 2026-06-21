import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { URGENCY_CONFIG, type UrgencyLevel } from '../constants/urgency';

interface UrgencyBadgeProps {
  urgencyLevel: UrgencyLevel;
  size?: 'small' | 'medium' | 'large';
  style?: any;
  showLabel?: boolean;
}

export default function UrgencyBadge({
  urgencyLevel,
  size = 'small',
  style,
  showLabel = true,
}: UrgencyBadgeProps) {
  const config = URGENCY_CONFIG[urgencyLevel];

  const sizes = {
    small: { icon: 14, text: 10, padding: 6, gap: 4 },
    medium: { icon: 16, text: 11, padding: 8, gap: 6 },
    large: { icon: 20, text: 12, padding: 10, gap: 8 },
  };

  const sizeConfig = sizes[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          padding: sizeConfig.padding,
          gap: sizeConfig.gap,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name={config.icon as any}
        size={sizeConfig.icon}
        color={config.color}
      />
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              fontSize: sizeConfig.text,
              color: config.color,
            },
          ]}
          numberOfLines={1}
        >
          {config.labelFr}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  label: {
    fontWeight: '600',
  },
});
