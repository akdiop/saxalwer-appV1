import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../constants/colors';
import { useActionTracking, type SavedQuestion } from '../context/ActionTrackingContext';

interface SavedQuestionsProps {
  topicId?: number;
  topicTitle?: string;
}

export default function SavedQuestions({
  topicId,
  topicTitle = 'Ma consultation',
}: SavedQuestionsProps) {
  const { savedQuestions, addQuestion, removeQuestion, getQuestionsByTopic } =
    useActionTracking();
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  const topicQuestions = topicTitle
    ? getQuestionsByTopic(topicTitle)
    : savedQuestions;

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) {
      Alert.alert('Question vide', 'Veuillez entrer une question');
      return;
    }

    await addQuestion(newQuestion.trim(), topicTitle, topicId);
    setNewQuestion('');
    setIsAddingQuestion(false);
    Alert.alert('Succès', 'Question enregistrée');
  };

  const handleDeleteQuestion = (id: string) => {
    Alert.alert('Supprimer', 'Êtes-vous sûr?', [
      { text: 'Annuler' },
      {
        text: 'Supprimer',
        onPress: () => removeQuestion(id),
        style: 'destructive',
      },
    ]);
  };

  const renderQuestion = ({ item }: { item: SavedQuestion }) => (
    <View style={styles.questionCard}>
      <View style={styles.questionContent}>
        <MaterialCommunityIcons
          name="help-circle-outline"
          size={18}
          color={colors.deepGreen}
        />
        <Text style={styles.questionText} numberOfLines={2}>
          {item.question}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteQuestion(item.id)}
        style={styles.deleteButton}
      >
        <MaterialCommunityIcons
          name="close-circle-outline"
          size={20}
          color={colors.terracotta}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes questions ({topicQuestions.length})</Text>
        <TouchableOpacity onPress={() => setIsAddingQuestion(true)}>
          <MaterialCommunityIcons
            name="plus-circle"
            size={24}
            color={colors.deepGreen}
          />
        </TouchableOpacity>
      </View>

      {topicQuestions.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={32}
            color={colors.mutedText}
          />
          <Text style={styles.emptyText}>
            Aucune question enregistrée pour {topicTitle.toLowerCase()}
          </Text>
        </View>
      ) : (
        <FlatList
          data={topicQuestions}
          renderItem={renderQuestion}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      )}

      <Modal visible={isAddingQuestion} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter une question</Text>
              <TouchableOpacity onPress={() => setIsAddingQuestion(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.deepGreen}
                />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Ma question..."
              placeholderTextColor={colors.mutedText}
              value={newQuestion}
              onChangeText={setNewQuestion}
              multiline
              maxLength={200}
            />

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => setIsAddingQuestion(false)}
              >
                <Text style={styles.buttonSecondaryText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleAddQuestion}
              >
                <Text style={styles.buttonPrimaryText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.deepGreen,
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.linen,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    gap: 8,
  },
  questionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questionText: {
    fontSize: 13,
    color: colors.deepUmber,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  emptyText: {
    fontSize: 12,
    color: colors.mutedText,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.deepGreen,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.deepGreen,
    minHeight: 80,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.deepGreen,
  },
  buttonPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.deepGreen,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});
