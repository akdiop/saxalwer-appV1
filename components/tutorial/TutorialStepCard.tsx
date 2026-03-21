import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';
import { TutorialStep } from '../../constants/tutorialSteps';

type TutorialStepCardProps = {
  step: TutorialStep;
  language: 'fr' | 'wo';
};

export default function TutorialStepCard({ step, language }: TutorialStepCardProps) {
  const title = language === 'wo' ? step.titleWo : step.titleFr;
  const description = language === 'wo' ? step.descWo : step.descFr;
  const tip = language === 'wo' ? step.tipWo : step.tipFr;

  return (
    <View style={styles.container}>
      <View style={[styles.illustrationCard, { backgroundColor: `${step.color}08`, borderColor: `${step.color}20` }]}> 
        <View style={[styles.circleLarge, { borderColor: `${step.color}16` }]} />
        <View style={[styles.circleSmall, { borderColor: `${step.color}12` }]} />
        <View style={[styles.iconHolder, { backgroundColor: step.color }]}>
          <Ionicons name={step.icon} size={24} color={colors.white} />
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.tipCard}>
        <View style={styles.tipIconWrap}>
          <Ionicons name="bulb-outline" size={18} color={colors.copper} />
        </View>
        <Text style={styles.tipText}>{tip}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  illustrationCard: {
    width: '100%',
    minHeight: 156,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 16,
    padding: 24,
  },
  circleLarge: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -20,
    right: -20,
    borderWidth: 1.5,
  },
  circleSmall: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    bottom: -10,
    left: 10,
    borderWidth: 1,
  },
  iconHolder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    color: colors.deepGreen,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    color: colors.cocoa,
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.75,
    marginBottom: 12,
  },
  tipCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    color: colors.cocoa,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    opacity: 0.8,
  },
});
