import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../constants/colors';
import { useActionTracking } from '../context/ActionTrackingContext';

interface ConsultationPrepProps {
  articleTitle: string;
  articleId?: number;
}

export default function ConsultationPrep({
  articleTitle,
  articleId,
}: ConsultationPrepProps) {
  const { actions, orientations, getQuestionsByTopic } =
    useActionTracking();
  const [isGenerating, setIsGenerating] = useState(false);

  // Gather all relevant data
  const topicQuestions = getQuestionsByTopic(articleTitle);
  const recentActions = actions.slice(0, 5);
  const pendingOrientations = orientations.filter(o => !o.completed);

  const generateSheet = async () => {
    setIsGenerating(true);
    try {
      const timestamp = new Date().toLocaleDateString('fr-FR');
      
      const sheetContent = `📋 FICHE DE CONSULTATION PRÉPARÉE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sujet: ${articleTitle}
Date: ${timestamp}

📚 INFORMATIONS CONSULTÉES
${recentActions.length > 0 
  ? recentActions.map((a, i) => `${i + 1}. ${a.subject} (${new Date(a.timestamp).toLocaleDateString()})`).join('\n')
  : 'Aucune'}

❓ MES QUESTIONS POUR LE PROFESSIONNEL
${topicQuestions.length > 0
  ? topicQuestions.map((q, i) => `${i + 1}. ${q.question}`).join('\n')
  : 'Aucune question enregistrée'}

⚠️  POINTS À SURVEILLER
${pendingOrientations.length > 0
  ? pendingOrientations.map((o, i) => `${i + 1}. ${o.recommendation} (Niveau: ${o.urgencyLevel})`).join('\n')
  : 'Aucun point particulier'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Ce document est un aide-mémoire personnel, pas un diagnostic.
Généré par SaxalWér - Ton corps, ton rythme, ta paix. 🌿`;

      // Share or copy
      await Share.share({
        message: sheetContent,
        title: 'Fiche de consultation SaxalWér',
      });

      Alert.alert('Succès', 'Fiche préparée et partagée');
    } catch (error) {
      if ((error as any).code !== 'E_SHARE_CANCELLED') {
        Alert.alert('Erreur', 'Impossible de partager');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="file-document-outline"
          size={24}
          color={colors.deepGreen}
        />
        <Text style={styles.title}>Préparer ma consultation</Text>
      </View>

      <ScrollView style={styles.preview} scrollEnabled={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Articles consultés</Text>
          <Text style={styles.sectionContent}>
            {recentActions.length > 0
              ? `${recentActions.length} article(s) exploré(s)`
              : 'Aucun article exploré'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ Mes questions</Text>
          <Text style={styles.sectionContent}>
            {topicQuestions.length > 0
              ? `${topicQuestions.length} question(s) enregistrée(s)`
              : 'Aucune question'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Points à surveiller</Text>
          <Text style={styles.sectionContent}>
            {pendingOrientations.length > 0
              ? `${pendingOrientations.length} point(s) à aborder`
              : 'Aucun point spécifique'}
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, isGenerating && styles.buttonDisabled]}
        onPress={generateSheet}
        disabled={isGenerating}
      >
        <MaterialCommunityIcons
          name={isGenerating ? 'loading' : 'share-variant'}
          size={20}
          color={colors.white}
        />
        <Text style={styles.buttonText}>
          {isGenerating ? 'Génération...' : 'Partager la fiche'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.linen,
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.deepGreen,
  },
  preview: {
    maxHeight: 150,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.deepGreen,
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 12,
    color: colors.mutedText,
  },
  button: {
    backgroundColor: colors.copper,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
