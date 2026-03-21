import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useApp } from '../../context/appcontext';

const BASE = {
  beige: '#F5F1E6',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  gold: '#D4AF37',
};

const FEEDBACK_TYPES = [
  {
    id: 'suggestion',
    icon: 'edit-3' as const,
    label: { fr: 'Suggestion', wo: 'Proposition' },
    color: BASE.gold,
    description: { fr: "Une idee pour ameliorer l'app", wo: 'Xalaat bu mat ngir yaggal app bi' },
  },
  {
    id: 'bug',
    icon: 'alert-triangle' as const,
    label: { fr: 'Probleme technique', wo: 'Bug / Probleme' },
    color: BASE.terracotta,
    description: { fr: 'Signaler un bug ou dysfonctionnement', wo: 'Signaler bug walla probleme' },
  },
  {
    id: 'appreciation',
    icon: 'heart' as const,
    label: { fr: 'Appreciation', wo: 'Begg na lool' },
    color: BASE.deepGreen,
    description: { fr: 'Ce qui vous plait dans SaxalWer', wo: 'Lu la neex ci SaxalWer' },
  },
  {
    id: 'request',
    icon: 'star' as const,
    label: { fr: 'Demande de fonctionnalite', wo: 'Demande fonctionnalite' },
    color: BASE.copper,
    description: { fr: 'Une nouvelle fonctionnalite souhaitee', wo: 'Fonctionnalite bu bees bu la begg' },
  },
];

export default function FeedbackScreen() {
  const router = useRouter();
  const { language, addFeedback, userProfile } = useApp();
  const wo = language === 'wo';

  const [selectedType, setSelectedType] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [photos, setPhotos] = React.useState<string[]>([]);

  async function pickPhoto() {
    if (photos.length >= 3) {
      Alert.alert(wo ? 'Limite atteinte' : 'Limite atteinte', wo ? 'Menn nga yokk 3 nataal rekk' : 'Maximum 3 photos autorisees');
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        wo ? 'Permission refusée' : 'Permission refusee',
        wo ? "Nuy soxla permission photo ngir yokk nataal." : 'Nous avons besoin de la permission photo.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setPhotos((prev) => [...prev, result.assets[0].uri].slice(0, 3));
    }
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!selectedType || !message.trim()) return;

    addFeedback({
      type: selectedType,
      message: message.trim(),
      rating,
      timestamp: Date.now(),
      userName: userProfile.name || 'Anonyme',
      photos,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      router.back();
    }, 2200);
  }

  const disabled = !selectedType || !message.trim();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={22} color={BASE.deepGreen} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Suggestions & Feedback</Text>
            <Text style={styles.subTitle}>{wo ? 'Co-conception ak yeneen' : 'Co-concevons ensemble'}</Text>
          </View>
        </View>

        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Feather name="message-square" size={24} color="white" />
          </View>
          <Text style={styles.introTitle}>{wo ? 'Sa xalaat bi important na' : 'Votre voix est precieuse'}</Text>
          <Text style={styles.introDesc}>
            {wo
              ? 'SaxalWer defar na ak yeen, te ngir yeen. Waxal nu lu la neex, lu begg soppi walla probleme bi nga gis.'
              : 'SaxalWer est concu avec vous, pour vous. Dites-nous ce qui vous plait, ce que vous voulez ameliorer, ou les problemes rencontres.'}
          </Text>
        </View>

        <Text style={styles.label}>{wo ? 'Type de retour' : 'Type de retour'}</Text>
        <View style={styles.typeGrid}>
          {FEEDBACK_TYPES.map((type) => {
            const active = selectedType === type.id;
            return (
              <Pressable
                key={type.id}
                onPress={() => setSelectedType(type.id)}
                style={[
                  styles.typeBtn,
                  {
                    borderColor: active ? type.color : `${type.color}55`,
                    backgroundColor: active ? type.color : 'white',
                  },
                ]}
              >
                <Feather name={type.icon} size={20} color={active ? 'white' : type.color} />
                <Text style={[styles.typeTitle, { color: active ? 'white' : type.color }]}>{type.label[language]}</Text>
                <Text style={[styles.typeDesc, { color: active ? 'rgba(255,255,255,0.86)' : 'rgba(74,47,39,0.66)' }]}>
                  {type.description[language]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>{wo ? 'Note globale (optionnel)' : 'Note globale (optionnel)'}</Text>
        <View style={styles.ratingCard}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => setRating(star)} style={styles.starBtn}>
              <Feather name="star" size={30} color={star <= rating ? BASE.gold : `${BASE.gold}66`} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>{wo ? 'Sa message *' : 'Votre message *'}</Text>
        <TextInput
          multiline
          value={message}
          onChangeText={setMessage}
          placeholder={
            wo
              ? 'Waxal nu lu la ci boppam... (propositions, critiques constructives, bugs...)'
              : 'Partagez vos pensees avec nous... (suggestions, critiques constructives, bugs...)'
          }
          placeholderTextColor="rgba(74,47,39,0.45)"
          style={styles.messageInput}
          textAlignVertical="top"
        />

        <Text style={styles.label}>{wo ? 'Nataal (optionnel)' : 'Photos (optionnel)'}</Text>
        <Text style={styles.photoHint}>
          {wo
            ? 'Yokk nataal ngir woneel symptome walla situation physique (max 3).'
            : 'Ajoutez des photos pour illustrer un symptome ou une situation physique (max 3).'}
        </Text>

        <View style={styles.photoRow}>
          <Pressable onPress={pickPhoto} style={styles.photoAddBtn}>
            <Feather name="camera" size={18} color={BASE.copper} />
            <Text style={styles.photoAddText}>{wo ? 'Ajouter nataal' : 'Ajouter photo'}</Text>
          </Pressable>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoList}>
            {photos.map((uri, index) => (
              <View key={`${uri}-${index}`} style={styles.photoThumbWrap}>
                <Image source={{ uri }} style={styles.photoThumb} contentFit="cover" />
                <Pressable onPress={() => removePhoto(index)} style={styles.photoRemoveBtn}>
                  <Feather name="x" size={13} color={BASE.copper} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.privacyCard}>
          <Feather name="lock" size={13} color={BASE.cocoa} style={{ marginTop: 2 }} />
          <Text style={styles.privacyText}>
            {wo
              ? 'Sa feedback bi denc na lokalement ngir sutura. Bientot, envoi securise dina am.'
              : "Votre retour est stocké localement pour le moment. Bientôt, un système d'envoi sécurisé sera disponible."}
          </Text>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={disabled}
          style={[styles.submitBtn, disabled && styles.submitBtnDisabled]}
        >
          <Feather name="send" size={19} color="white" />
          <Text style={styles.submitText}>{wo ? 'Yonne sa xalaat' : 'Envoyer mon retour'}</Text>
        </Pressable>

        <Text style={styles.footerNote}>
          {wo
            ? 'Lep feedback bi dafa important, bu touti walla bu mag. Jerejef ci sa implication.'
            : "Chaque retour compte, petit ou grand. Merci d'être actrice de SaxalWér."}
        </Text>
      </ScrollView>

      <Modal transparent visible={submitted} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <View style={styles.overlayIcon}>
              <Feather name="check" size={38} color={BASE.deepGreen} />
            </View>
            <Text style={styles.overlayTitle}>{wo ? 'Jerejef bu bari !' : 'Merci infiniment !'}</Text>
            <Text style={styles.overlayDesc}>
              {wo
                ? 'Sa xalaat bi important na lool. Danu koy jappandi ngir yaggal SaxalWer.'
                : 'Votre voix compte. Nous prenons chaque retour au serieux pour ameliorer SaxalWer.'}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  container: {
    padding: 20,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: BASE.deepGreen,
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 11,
    color: BASE.terracotta,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  introCard: {
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.18)',
  },
  introIcon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: BASE.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  introTitle: {
    color: BASE.deepGreen,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  introDesc: {
    color: 'rgba(74,47,39,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: BASE.cocoa,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  typeBtn: {
    width: '48.5%',
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
  },
  typeTitle: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  typeDesc: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
  ratingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.18)',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  starBtn: { padding: 2 },
  messageInput: {
    minHeight: 170,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(181,98,42,0.28)',
    backgroundColor: 'white',
    padding: 12,
    color: BASE.cocoa,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  photoHint: {
    fontSize: 12,
    color: 'rgba(74,47,39,0.72)',
    lineHeight: 18,
    marginBottom: 8,
  },
  photoRow: { marginBottom: 16 },
  photoAddBtn: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(181,98,42,0.25)',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'flex-start',
  },
  photoAddText: {
    color: BASE.copper,
    fontWeight: '700',
    fontSize: 12,
  },
  photoList: { gap: 10, marginTop: 10 },
  photoThumbWrap: {
    width: 84,
    height: 84,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.25)',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  photoThumb: { width: '100%', height: '100%' },
  photoRemoveBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.35)',
  },
  privacyCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)',
    backgroundColor: 'rgba(212,175,55,0.12)',
    padding: 12,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  privacyText: {
    flex: 1,
    color: 'rgba(74,47,39,0.9)',
    lineHeight: 18,
    fontSize: 12,
    fontStyle: 'italic',
  },
  submitBtn: {
    borderRadius: 18,
    backgroundColor: BASE.deepGreen,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  submitBtnDisabled: {
    opacity: 0.45,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  footerNote: {
    textAlign: 'center',
    color: 'rgba(74,47,39,0.62)',
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 19,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26,60,52,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  overlayCard: {
    width: '100%',
    alignItems: 'center',
  },
  overlayIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BASE.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  overlayTitle: { fontSize: 30, fontWeight: '800', color: 'white', marginBottom: 6, textAlign: 'center' },
  overlayDesc: {
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    lineHeight: 23,
    fontSize: 15,
    maxWidth: 330,
  },
});
