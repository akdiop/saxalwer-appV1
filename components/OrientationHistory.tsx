import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../constants/colors';
import type { Orientation } from '../context/ActionTrackingContext';
import { useActionTracking } from '../context/ActionTrackingContext';
import UrgencyBadge from './UrgencyBadge';

interface OrientationHistoryProps {
  maxItems?: number;
}

export default function OrientationHistory({ maxItems }: OrientationHistoryProps) {
  const { orientations, completeOrientation } = useActionTracking();

  const displayedOrientations = maxItems
    ? orientations.slice(0, maxItems)
    : orientations;

  const handleMarkComplete = (id: string) => {
    Alert.alert(
      'Consultation effectuée?',
      'Marquer cette orientation comme complétée?',
      [
        { text: 'Annuler' },
        {
          text: 'Oui',
          onPress: () => completeOrientation(id),
        },
      ]
    );
  };

  const renderOrientation = ({ item }: { item: Orientation }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badgeSection}>
          <UrgencyBadge
            urgencyLevel={item.urgencyLevel}
            size="medium"
            showLabel={true}
          />
        </View>
        <Text style={styles.subject} numberOfLines={2}>
          {item.subject}
        </Text>
      </View>

      <Text style={styles.recommendation} numberOfLines={2}>
        {item.recommendation}
      </Text>

      <View style={styles.footer}>
        <View>
          <Text style={styles.date}>
            {new Date(item.timestamp).toLocaleDateString('fr-FR')}
          </Text>
          {item.completed && (
            <Text style={styles.completed}>✓ Consultation effectuée</Text>
          )}
        </View>
        {!item.completed && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleMarkComplete(item.id)}
          >
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={20}
              color={colors.deepGreen}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (displayedOrientations.length === 0) {
    return (
      <View style={styles.empty}>
        <MaterialCommunityIcons
          name="history"
          size={32}
          color={colors.mutedText}
        />
        <Text style={styles.emptyText}>Aucune orientation enregistrée</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Historique d'orientation</Text>
        <Text style={styles.count}>{displayedOrientations.length}</Text>
      </View>
      <FlatList
        data={displayedOrientations}
        renderItem={renderOrientation}
        keyExtractor={item => item.id}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.deepGreen,
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedSage,
    backgroundColor: colors.linen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.copper,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  badgeSection: {
    minWidth: 100,
  },
  subject: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.deepGreen,
  },
  recommendation: {
    fontSize: 12,
    color: colors.deepUmber,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 11,
    color: colors.mutedText,
  },
  completed: {
    fontSize: 11,
    color: colors.mutedSage,
    fontWeight: '600',
    marginTop: 2,
  },
  completeButton: {
    padding: 8,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  emptyText: {
    fontSize: 12,
    color: colors.mutedText,
  },
});
