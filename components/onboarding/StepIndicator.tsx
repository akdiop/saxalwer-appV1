import React from 'react';
import { StyleSheet, View } from 'react-native';

type StepIndicatorProps = {
  activeStep: number;
  totalSteps?: number;
};

export default function StepIndicator({ activeStep, totalSteps = 4 }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index + 1 === activeStep;
        return <View key={index} style={[styles.dot, isActive && styles.activeDot]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(74,47,39,0.2)',
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#1A3C34',
  },
});
