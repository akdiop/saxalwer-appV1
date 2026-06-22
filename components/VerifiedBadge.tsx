import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

interface VerifiedBadgeProps {
  size?: 'small' | 'medium' | 'large';
  status?: 'verified' | 'pending';
  style?: any;
}

export default function VerifiedBadge({
  size = 'small',
  status = 'verified',
  style,
}: VerifiedBadgeProps) {
  const sizeConfig = {
    small: {
      container: { paddingHorizontal: 6, paddingVertical: 2, gap: 3 },
      iconSize: 12,
      fontSize: 10,
    },
    medium: {
      container: { paddingHorizontal: 8, paddingVertical: 3, gap: 4 },
      iconSize: 13,
      fontSize: 11,
    },
    large: {
      container: { paddingHorizontal: 10, paddingVertical: 4, gap: 5 },
      iconSize: 14,
      fontSize: 12,
    },
  };

  const config = sizeConfig[size];
  const isPending = status === 'pending';

  return (
    <View style={[styles.badge, isPending && styles.badgePending, config.container, style]}>
      <MaterialCommunityIcons
        name={isPending ? 'clock-outline' : 'check-circle'}
        size={config.iconSize}
        color={isPending ? colors.terracotta : colors.deepGreen}
      />
      <Text
        style={[
          styles.text,
          isPending && styles.textPending,
          { fontSize: config.fontSize },
        ]}
      >
        {isPending ? 'En vérification' : 'Vérifié'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 61, 46, 0.08)',
    borderRadius: 99,
    borderWidth: 0.5,
    borderColor: 'rgba(15, 61, 46, 0.2)',
  },
  badgePending: {
    backgroundColor: 'rgba(166, 93, 64, 0.08)',
    borderColor: 'rgba(166, 93, 64, 0.2)',
  },
  text: {
    color: colors.cocoa,
    fontWeight: '600',
  },
  textPending: {
    color: colors.terracotta,
  },
});
