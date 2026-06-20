import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';

type ProfileStatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  subtitle?: string;
  onPress?: () => void;
  showEdit?: boolean;
  onEditPress?: () => void;
};

export default function ProfileStatCard({
  icon,
  title,
  value,
  subtitle,
  onPress,
  showEdit,
  onEditPress,
}: ProfileStatCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={18} color={colors.deepGreen} />
        </View>
        {showEdit && (
          <Pressable
            onPress={onEditPress}
            style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.7 }]}
            hitSlop={8}
          >
            <Feather name="edit-3" size={16} color={colors.deepGreen} />
          </Pressable>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    minHeight: 126,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EEF3F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F5F1E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  title: {
    fontSize: 13,
    color: colors.cocoa,
    opacity: 0.8,
    marginBottom: 4,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    color: colors.deepGreen,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: colors.mutedText,
    lineHeight: 18,
  },
});
