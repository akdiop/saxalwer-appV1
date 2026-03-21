import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { SymptomEntry, SymptomId } from "../context/appcontext";
import { useApp } from "../context/appcontext";
import { SYMPTOM_DEFINITIONS } from "../utils/cyclesymptoms";

const C = {
  deepGreen: "#0F3D2E",
  sand: "#E8DCC8",
  ivory: "#F3EADF",
  copper: "#C26A3D",
  cacao: "#4A2F27",
  beige: "#F5F1E6",
  warmWhite: "#FDFAF5",
};

interface SymptomLoggerProps {
  date: string;
  onSave: (symptoms: SymptomEntry[], notes?: string) => void;
  onCancel?: () => void;
  existingSymptoms?: SymptomEntry[];
  existingNotes?: string;
}
export function SymptomLogger({
  date,
  onSave,
  onCancel,
  existingSymptoms = [],
  existingNotes = "",
}: SymptomLoggerProps) {
  const { language } = useApp();
  const wo = language === "wo";

  const [selectedSymptoms, setSelectedSymptoms] = useState<
    Record<SymptomId, { intensity: 1 | 2 | 3; notes?: string }>
  >(
    existingSymptoms.reduce((acc, symptom) => {
      acc[symptom.symptomId] = {
        intensity: symptom.intensity,
        notes: symptom.notes,
      };
      return acc;
    }, {} as Record<SymptomId, { intensity: 1 | 2 | 3; notes?: string }>)
  );
  const [generalNotes, setGeneralNotes] = useState(existingNotes);
  const [expandedSymptom, setExpandedSymptom] = useState<SymptomId | null>(null);

  const groupedSymptoms = useMemo(() => {
    const grouped: Record<string, typeof SYMPTOM_DEFINITIONS> = {
      physical: [],
      hormonal: [],
      emotional: [],
    };

    SYMPTOM_DEFINITIONS.forEach((symptom) => {
      grouped[symptom.category].push(symptom);
    });

    return grouped;
  }, []);

  const categoryLabels = {
    physical: { fr: "Physiques", wo: "Yaram" },
    hormonal: { fr: "Hormonaux", wo: "Hormone" },
    emotional: { fr: "Emotionnels", wo: "Xel" },
  };

  const toggleSymptom = (id: SymptomId) => {
    if (selectedSymptoms[id]) {
      const copy = { ...selectedSymptoms };
      delete copy[id];
      setSelectedSymptoms(copy);
      if (expandedSymptom === id) {
        setExpandedSymptom(null);
      }
      return;
    }

    setSelectedSymptoms({
      ...selectedSymptoms,
      [id]: { intensity: 2 },
    });
    setExpandedSymptom(id);
  };

  const setIntensity = (id: SymptomId, intensity: 1 | 2 | 3) => {
    setSelectedSymptoms({
      ...selectedSymptoms,
      [id]: {
        ...selectedSymptoms[id],
        intensity,
      },
    });
  };

  const setSymptomNotes = (id: SymptomId, notes: string) => {
    setSelectedSymptoms({
      ...selectedSymptoms,
      [id]: {
        ...selectedSymptoms[id],
        notes,
      },
    });
  };

  const handleSave = () => {
    const symptomsArray: SymptomEntry[] = Object.entries(selectedSymptoms).map(
      ([id, data]) => ({
        symptomId: id as SymptomId,
        intensity: data.intensity,
        notes: data.notes,
      })
    );
    onSave(symptomsArray, generalNotes);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={onCancel}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          hitSlop={10}
        >
          <Feather name="chevron-left" size={22} color={C.deepGreen} />
          <Text style={styles.backText}>{wo ? 'Précédent' : 'Précédent'}</Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View style={styles.sparkleWrap}>
            <Feather name="activity" size={18} color={C.copper} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{wo ? "Enregistrer tes symptomes" : "Enregistrer tes symptomes"}</Text>
            <Text style={styles.dateText}>
              {new Date(date).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
          </View>
        </View>

        <View style={styles.categoriesWrap}>
          {Object.entries(groupedSymptoms).map(([category, symptoms]) => (
            <View key={category}>
              <Text style={styles.categoryLabel}>
                {wo
                  ? categoryLabels[category as keyof typeof categoryLabels].wo
                  : categoryLabels[category as keyof typeof categoryLabels].fr}
              </Text>

              <View style={styles.symptomList}>
                {symptoms.map((symptom) => {
                  const isSelected = Boolean(selectedSymptoms[symptom.id]);
                  const isExpanded = expandedSymptom === symptom.id;

                  return (
                    <View key={symptom.id}>
                      <Pressable
                        onPress={() => toggleSymptom(symptom.id)}
                        style={({ pressed }) => [
                          styles.symptomButton,
                          isSelected && styles.symptomButtonSelected,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text style={styles.symptomEmoji}>{symptom.icon}</Text>
                        <Text style={[styles.symptomLabel, isSelected && styles.symptomLabelSelected]}>
                          {wo ? symptom.labelWo : symptom.labelFr}
                        </Text>
                        {isSelected ? (
                          <View style={styles.checkWrap}>
                            <Feather name="check" size={12} color={C.warmWhite} />
                          </View>
                        ) : null}
                      </Pressable>

                      {isSelected && isExpanded ? (
                        <View style={styles.expandedWrap}>
                          <Text style={styles.intensityLabel}>{wo ? "Intensite :" : "Intensite :"}</Text>
                          <View style={styles.intensityRow}>
                            {[
                              { level: 1, labelFr: "Leger", labelWo: "Ndaw" },
                              { level: 2, labelFr: "Modere", labelWo: "Taxaw" },
                              { level: 3, labelFr: "Intense", labelWo: "Gatt" },
                            ].map(({ level, labelFr, labelWo }) => {
                              const isActive = selectedSymptoms[symptom.id]?.intensity === level;
                              return (
                                <Pressable
                                  key={level}
                                  onPress={() => setIntensity(symptom.id, level as 1 | 2 | 3)}
                                  style={({ pressed }) => [
                                    styles.intensityBtn,
                                    isActive && styles.intensityBtnActive,
                                    pressed && styles.pressed,
                                  ]}
                                >
                                  <Text style={[styles.intensityBtnText, isActive && styles.intensityBtnTextActive]}>
                                    {wo ? labelWo : labelFr}
                                  </Text>
                                </Pressable>
                              );
                            })}
                          </View>

                          <TextInput
                            value={selectedSymptoms[symptom.id]?.notes || ""}
                            onChangeText={(value) => setSymptomNotes(symptom.id, value)}
                            placeholder={wo ? "Notes (optionnel)" : "Notes (optionnel)"}
                            placeholderTextColor={`${C.cacao}70`}
                            multiline
                            style={styles.notesInput}
                          />
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginBottom: 18 }}>
          <Text style={styles.generalLabel}>{wo ? "Notes generales (optionnel)" : "Notes generales (optionnel)"}</Text>
          <TextInput
            value={generalNotes}
            onChangeText={setGeneralNotes}
            placeholder={
              wo
                ? "Comment te sens-tu aujourd'hui ?"
                : "Comment te sens-tu aujourd'hui ?"
            }
            placeholderTextColor={`${C.deepGreen}66`}
            multiline
            style={styles.generalInput}
          />
        </View>

        <View style={styles.actionsRow}>
          {onCancel ? (
            <Pressable onPress={onCancel} style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}>
              <Text style={styles.cancelText}>{wo ? "Annuler" : "Annuler"}</Text>
            </Pressable>
          ) : null}

          <Pressable onPress={handleSave} style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}>
            <Text style={styles.saveText}>{wo ? "Enregistrer" : "Enregistrer"}</Text>
            <Feather name="chevron-right" size={16} color={C.warmWhite} />
          </Pressable>
        </View>

        <Text style={styles.reassurance}>
          {wo
            ? "Tes donnees restent privees et securisees sur ton telephone."
            : "Tes donnees restent privees et securisees sur ton telephone."}
        </Text>
      </ScrollView>
    </View>
  );
}

export default SymptomLogger;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: C.warmWhite,
    borderRadius: 20,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: "rgba(194,106,61,0.2)",
    shadowColor: C.cacao,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 2,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 2,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  backText: {
    color: C.deepGreen,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 2,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 18,
    minHeight: 400,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  sparkleWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(194,106,61,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: C.deepGreen,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "600",
  },
  dateText: {
    marginTop: 2,
    fontSize: 11,
    color: `${C.cacao}8C`,
  },
  categoriesWrap: {
    marginBottom: 18,
    gap: 16,
  },
  categoryLabel: {
    marginBottom: 10,
    fontSize: 11,
    fontWeight: "600",
    color: `${C.deepGreen}B3`,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  symptomList: {
    gap: 8,
  },
  symptomButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    backgroundColor: C.beige,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: `${C.cacao}14`,
  },
  symptomButtonSelected: {
    backgroundColor: "rgba(15,61,46,0.06)",
    borderColor: "rgba(194,106,61,0.35)",
  },
  symptomEmoji: {
    fontSize: 20,
    lineHeight: 22,
  },
  symptomLabel: {
    flex: 1,
    fontSize: 13,
    color: C.cacao,
  },
  symptomLabelSelected: {
    color: C.deepGreen,
    fontWeight: "600",
  },
  checkWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.copper,
    alignItems: "center",
    justifyContent: "center",
  },
  expandedWrap: {
    marginTop: 8,
    marginLeft: 36,
    gap: 8,
  },
  intensityLabel: {
    fontSize: 11,
    color: `${C.cacao}99`,
  },
  intensityRow: {
    flexDirection: "row",
    gap: 6,
  },
  intensityBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: `${C.deepGreen}1A`,
    backgroundColor: "rgba(15,61,46,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  intensityBtnActive: {
    backgroundColor: C.copper,
    borderColor: C.copper,
  },
  intensityBtnText: {
    fontSize: 12,
    color: C.deepGreen,
    fontWeight: "500",
  },
  intensityBtnTextActive: {
    color: C.warmWhite,
    fontWeight: "600",
  },
  notesInput: {
    minHeight: 58,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${C.deepGreen}1A`,
    backgroundColor: C.beige,
    fontSize: 12,
    color: C.deepGreen,
    textAlignVertical: "top",
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  generalLabel: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "600",
    color: C.deepGreen,
  },
  generalInput: {
    minHeight: 76,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${C.deepGreen}26`,
    backgroundColor: C.beige,
    fontSize: 13,
    color: C.deepGreen,
    textAlignVertical: "top",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: `${C.deepGreen}33`,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: C.deepGreen,
    fontSize: 13,
    fontWeight: "500",
  },
  saveBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: C.deepGreen,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  saveText: {
    color: C.warmWhite,
    fontSize: 13,
    fontWeight: "600",
  },
  reassurance: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 10,
    color: `${C.cacao}66`,
    fontStyle: "italic",
    lineHeight: 14,
  },
  pressed: {
    opacity: 0.9,
  },
});
