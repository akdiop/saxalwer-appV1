import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../constants/colors';
import { useActionTracking } from '../context/ActionTrackingContext';
import UrgencyBadge from './UrgencyBadge';

interface NextStepProps {
  onPress?: () => void;
}

export default function NextStep({ onPress }: NextStepProps) {
  const { nextStep, completeOrientation } = useActionTracking();

  if (!nextStep) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="check-circle"
          size={32}
          color={colors.mutedSage}
        />
        <Text style={styles.emptyText}>Vous êtes à jour! 🌿</Text>
      </View>
    );
  }

  const isOrientation = 'urgencyLevel' in nextStep;
  const title = isOrientation
    ? nextStep.recommendation
    : nextStep.details || nextStep.subject;
  const subtitle = isOrientation
    ? `Suite à: ${nextStep.subject}`
    : new Date(nextStep.timestamp).toLocaleDateString('fr-FR');

  const handlePress = () => {
    if (isOrientation) {
      Alert.alert(
        'Vous avez consulté?',
        'Marquer cette orientation comme complétée?',
        [
          { text: 'Plus tard' },
          {
            text: 'Oui, j\'ai consulté',
            onPress: () => completeOrientation(nextStep.id),
          },
        ]
      );
    } else {
      onPress?.();
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name={isOrientation ? 'flag-outline' : 'lightning-bolt-outline'}
          size={20}
          color={colors.copper}
        />
        <Text style={styles.label}>
          {isOrientation ? 'Orientation prioritaire' : 'Votre prochain pas'}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {isOrientation && (
            <UrgencyBadge
              urgencyLevel={nextStep.urgencyLevel}
              size="small"
              showLabel={false}
            />
          )}
        </View>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={colors.mutedText}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderLeftWidth: 4,
    borderLeftColor: colors.copper,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.copper,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.deepGreen,
  },
  subtitle: {
    fontSize: 12,
    color: colors.mutedText,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mutedSage,
  },
});
