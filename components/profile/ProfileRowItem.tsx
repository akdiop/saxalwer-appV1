import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';

type ProfileRowItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightText?: string;
  destructive?: boolean;
};

export default function ProfileRowItem({
  icon,
  title,
  subtitle,
  onPress,
  rightText,
  destructive,
}: ProfileRowItemProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.iconWrap, destructive && styles.iconWrapDestructive]}>
        <Ionicons
          name={icon}
          size={18}
          color={destructive ? '#8F3529' : colors.deepGreen}
        />
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.title, destructive && styles.titleDestructive]}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {!!rightText && <Text style={styles.rightText}>{rightText}</Text>}
      {!rightText && <Ionicons name="chevron-forward" size={18} color={colors.mutedText} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 60,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF3F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDestructive: {
    backgroundColor: '#F9ECE8',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.cocoa,
  },
  titleDestructive: {
    color: '#8F3529',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.mutedText,
  },
  rightText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.cocoa,
  },
});
