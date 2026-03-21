import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';

export type NotificationFrequency = 'Quotidien' | 'Hebdo' | 'Mensuel';

type NotificationCategoryCardProps = {
  title: string;
  description: string;
  enabled: boolean;
  frequency: NotificationFrequency;
  onToggle: () => void;
  onChangeFrequency: (value: NotificationFrequency) => void;
};

const FREQUENCIES: NotificationFrequency[] = ['Quotidien', 'Hebdo', 'Mensuel'];

export default function NotificationCategoryCard({
  title,
  description,
  enabled,
  frequency,
  onToggle,
  onChangeFrequency,
}: NotificationCategoryCardProps) {
  return (
    <View style={[styles.card, enabled && styles.cardEnabled]}>
      <View style={styles.topRow}>
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <Pressable onPress={onToggle} style={[styles.switch, enabled && styles.switchOn]}>
          <View style={[styles.thumb, enabled && styles.thumbOn]} />
        </Pressable>
      </View>

      <View style={styles.freqRow}>
        {FREQUENCIES.map((item) => {
          const active = frequency === item;
          return (
            <Pressable
              key={item}
              onPress={() => onChangeFrequency(item)}
              style={[styles.freqPill, active && styles.freqPillActive]}
            >
              <Text style={[styles.freqText, active && styles.freqTextActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 12,
  },
  cardEnabled: {
    borderColor: '#D8C4BA',
    backgroundColor: '#FFF8F5',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.cocoa,
    marginBottom: 3,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.mutedText,
  },
  switch: {
    width: 46,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#D8D0C2',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  switchOn: {
    backgroundColor: colors.terracotta,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
  freqRow: {
    flexDirection: 'row',
    gap: 8,
  },
  freqPill: {
    flex: 1,
    height: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D8D0C2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBF7EF',
  },
  freqPillActive: {
    borderColor: colors.terracotta,
    backgroundColor: '#F8E9E0',
  },
  freqText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.mutedText,
  },
  freqTextActive: {
    color: colors.terracotta,
  },
});
