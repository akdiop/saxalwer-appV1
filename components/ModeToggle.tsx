import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../constants/colors';
import { useModes } from '../context/ModesContext';

interface ModeToggleProps {
  showModal?: boolean;
}

export default function ModeToggle() {
  const { mode, setMode, toggleMode } = useModes();
  const [showInfo, setShowInfo] = React.useState(false);

  const handleModeChange = () => {
    const newMode = mode === 'guided' ? 'complete' : 'guided';
    Alert.alert(
      `Passer en mode ${newMode === 'guided' ? 'Guidé' : 'Complet'}?`,
      newMode === 'guided'
        ? 'Mode Guidé: Interface simplifiée, audio prioritaire'
        : 'Mode Complet: Toutes les fonctionnalités disponibles',
      [
        { text: 'Annuler' },
        {
          text: 'Confirmer',
          onPress: () => {
            setMode(newMode);
            Alert.alert(
              'Succès',
              `Mode ${newMode === 'guided' ? 'Guidé' : 'Complet'} activé`
            );
          },
        },
      ]
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handleModeChange}
        onLongPress={() => setShowInfo(true)}
      >
        <MaterialCommunityIcons
          name={mode === 'guided' ? 'book' : 'layers'}
          size={20}
          color={colors.deepGreen}
        />
        <Text style={styles.label}>
          Mode {mode === 'guided' ? 'Guidé' : 'Complet'}
        </Text>
      </TouchableOpacity>

      <Modal visible={showInfo} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Modes d'expérience</Text>
              <TouchableOpacity onPress={() => setShowInfo(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.deepGreen}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <View style={styles.modeCard}>
                <MaterialCommunityIcons
                  name="book"
                  size={24}
                  color={colors.terracotta}
                />
                <View style={styles.modeInfo}>
                  <Text style={styles.modeName}>Mode Guidé</Text>
                  <Text style={styles.modeDescription}>
                    Interface simplifiée{'\n'}Audio prioritaire{'\n'}Contenu
                    essentiel
                  </Text>
                </View>
              </View>

              <View style={styles.modeCard}>
                <MaterialCommunityIcons
                  name="layers"
                  size={24}
                  color={colors.deepGreen}
                />
                <View style={styles.modeInfo}>
                  <Text style={styles.modeName}>Mode Complet</Text>
                  <Text style={styles.modeDescription}>
                    Toutes les fonctionnalités{'\n'}Options avancées{'\n'}
                    Personnalisation complète
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowInfo(false)}
            >
              <Text style={styles.buttonText}>Compris</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.linen,
    borderRadius: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.deepGreen,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    width: '85%',
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.deepGreen,
  },
  content: {
    gap: 12,
    marginBottom: 16,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: colors.beige,
    borderRadius: 8,
  },
  modeInfo: {
    flex: 1,
  },
  modeName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.deepGreen,
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 12,
    color: colors.mutedText,
    lineHeight: 16,
  },
  button: {
    backgroundColor: colors.deepGreen,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
