import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../constants/colors';
import { useActionTracking } from '../context/ActionTrackingContext';

interface ActionPickerProps {
  articleId: number;
  articleTitle: string;
  onActionSelected?: () => void;
}

const ACTIONS = [
  {
    id: 'continue_learning',
    label: 'Continuer à apprendre',
    labelEn: 'Continue learning',
    description: 'Explorer d\'autres ressources',
    icon: 'book-open-outline',
    color: colors.cocoa,
  },
  {
    id: 'schedule_appointment',
    label: 'Planifier une consultation',
    labelEn: 'Schedule appointment',
    description: 'Avec une professionnelle',
    icon: 'calendar-outline',
    color: colors.terracotta,
  },
  {
    id: 'prepare_consultation',
    label: 'Préparer ma consultation',
    labelEn: 'Prepare consultation',
    description: 'Générer un résumé à montrer',
    icon: 'file-document-outline',
    color: colors.copper,
  },
  {
    id: 'record_intention',
    label: 'Enregistrer mon intention',
    labelEn: 'Record intention',
    description: 'J\'agis sur cela',
    icon: 'checkbox-marked-circle-outline',
    color: colors.mutedSage,
  },
  {
    id: 'prepare_questions',
    label: 'Préparer mes questions',
    labelEn: 'Prepare questions',
    description: 'Pour une future consultation',
    icon: 'help-circle-outline',
    color: colors.espresso,
  },
];

export default function ActionPicker({
  articleId,
  articleTitle,
  onActionSelected,
}: ActionPickerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { addAction } = useActionTracking();

  const handleActionSelect = async (actionId: string) => {
    const action = ACTIONS.find(a => a.id === actionId);
    if (!action) return;

    await addAction({
      type: 'read_article',
      subject: articleTitle,
      subjectId: articleId,
      details: action.label,
    });

    setIsVisible(false);
    onActionSelected?.();
    Alert.alert(
      'Merci!',
      `Action enregistrée: ${action.label}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsVisible(true)}
      >
        <MaterialCommunityIcons
          name="plus-circle"
          size={20}
          color={colors.white}
        />
        <Text style={styles.buttonText}>Quoi faire maintenant?</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Votre prochain pas</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.deepGreen}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.actionsList}>
              {ACTIONS.map(action => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionCard}
                  onPress={() => handleActionSelect(action.id)}
                >
                  <View style={[styles.iconBox, { backgroundColor: `${action.color}20` }]}>
                    <MaterialCommunityIcons
                      name={action.icon as any}
                      size={24}
                      color={action.color}
                    />
                  </View>
                  <View style={styles.actionInfo}>
                    <Text style={styles.actionLabel}>{action.label}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={colors.mutedText}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.deepGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.cocoa,
  },
  actionsList: {
    paddingVertical: 8,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.cocoa,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.mutedText,
  },
});
