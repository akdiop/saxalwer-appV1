import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '../../constants/colors';

type TutorialDotsProps = {
  total: number;
  current: number;
  color: string;
  onSelect: (index: number) => void;
};

export default function TutorialDots({ total, current, color, onSelect }: TutorialDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, index) => {
        const active = index === current;
        return (
          <Pressable
            key={index}
            onPress={() => onSelect(index)}
            style={[styles.dot, active && styles.dotActive, active && { backgroundColor: color }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(74,47,39,0.18)',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.deepGreen,
  },
});
