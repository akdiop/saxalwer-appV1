import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';
import TutorialDots from './TutorialDots';

type TutorialNavigationProps = {
  canGoBack: boolean;
  nextLabel: string;
  color: string;
  total: number;
  current: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

export default function TutorialNavigation({
  canGoBack,
  nextLabel,
  color,
  total,
  current,
  onPrevious,
  onNext,
  onSelect,
}: TutorialNavigationProps) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onPrevious}
        disabled={!canGoBack}
        style={[styles.circleButton, !canGoBack && styles.circleButtonDisabled]}
      >
        <Ionicons
          name="chevron-back"
          size={18}
          color={canGoBack ? colors.deepGreen : 'rgba(26,60,52,0.35)'}
        />
      </Pressable>

      <View style={styles.dotsWrap}>
        <TutorialDots total={total} current={current} color={color} onSelect={onSelect} />
      </View>

      <Pressable onPress={onNext} style={[styles.nextButton, { backgroundColor: color }]}>
        <Text style={styles.nextButtonText}>{nextLabel}</Text>
        <Ionicons name="chevron-forward" size={16} color="#F5F1E6" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8DDCF',
  },
  circleButtonDisabled: {
    backgroundColor: '#F2ECE2',
    borderColor: '#ECE1D4',
  },
  dotsWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    minWidth: 132,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  nextButtonText: {
    color: '#F5F1E6',
    fontSize: 13,
    fontWeight: '700',
  },
});
