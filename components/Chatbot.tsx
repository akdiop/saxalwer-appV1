
import { Feather } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Lang = 'fr' | 'wo' | 'en';
type Role = 'assistant' | 'user';
interface Message { id: string; role: Role; text: string; time: string; }

const C = {
  deepGreen: '#0F3D2E',
  green2: '#1A3C34',
  beige: '#F5F1E6',
  beige2: '#EDE5D0',
  sand: '#E8DCC8',
  terracotta: '#C26A3D',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  white: '#FDFAF5',
  error: '#C0392B',
};

const langConfig: Record<Lang, {
  placeholder: string;
  conv: Message[];
  quickReplies: string[];
  disclaimer: string;
  confidential: string;
  wolofVoiceNote?: string;
}> = {
  fr: {
    placeholder: 'Écris ta question ici…',
    disclaimer: 'Cet assistant fournit des informations générales. Il ne remplace pas un avis médical professionnel.',
    confidential: 'Tes messages restent confidentiels.',
    quickReplies: ['Calculer mon cycle', 'Signes d\'ovulation', 'Contraception naturelle', 'Douleurs pelviennes'],
    conv: [
      { id: 'a1', role: 'assistant', time: '09:41', text: 'Bonjour. Je suis là pour toi.\nPose-moi ta question en toute liberté — cet espace est discret, bienveillant et fait pour toi.' },
      { id: 'u1', role: 'user', time: '09:42', text: 'Mon cycle est irrégulier depuis deux mois. Est-ce normal ?' },
      { id: 'a2', role: 'assistant', time: '09:43', text: 'Je comprends ton inquiétude, et c\'est courageux de poser la question. 💚\n\nLes variations du cycle peuvent être liées à :\n• Du stress ou de la fatigue\n• Des changements alimentaires\n• Des fluctuations hormonales naturelles\n\nSi cela persiste plus de 3 mois ou s\'accompagne de douleurs, consulte un professionnel de santé. Tu n\'es pas seule.' },
      { id: 'u2', role: 'user', time: '09:44', text: 'Merci. Et comment savoir si j\'ovule normalement ?' },
    ],
  },
  wo: {
    placeholder: 'Bind sa laaj fii…',
    disclaimer: 'Assistant bii dafa jox xam-xam bu bari rekk. Dafa dëkkul yoon wi ak tabax.',
    confidential: 'Sa xaramu yi dañu siiw.',
    wolofVoiceNote: 'Audio: voix française (plus proche du wolof disponible)',
    quickReplies: ['Lan mooy cycle bi ?', 'Signes ci ovulation', 'Contrasepsiyon', 'Douleur ci biir'],
    conv: [
      { id: 'a1', role: 'assistant', time: '09:41', text: 'Salamalekum. Mangi fii ci sa dëkk.\nLaaj ma sa laaj bu am solo — fii dafa siiw ak yêgël ci sa bërébu.' },
      { id: 'u1', role: 'user', time: '09:42', text: 'Say cycle bi dafa yees ci fukk ak ñaar fan. Normal lañu ?' },
      { id: 'a2', role: 'assistant', time: '09:43', text: 'Dégg naa sa ngelaw, te bëgg-bëgg nga laaj. 💚\n\nCycle bi dina yees ci yëgël yu bari :\n• Stress walla ñuul\n• Lëkk-lëkk bu yees\n• Hormone yi dañuy dolsi\n\nBu dëkk ag ñett weer, dem ci tabax bu dëkk. Dafa am nit yu ëpp ci yaw.' },
      { id: 'u2', role: 'user', time: '09:44', text: 'Jërejëf. Lan mooy wax ma jaaxal ba ovulation bi am ?' },
    ],
  },
  en: {
    placeholder: 'Write your question here…',
    disclaimer: 'This assistant provides general information only. It does not replace professional medical advice.',
    confidential: 'Your messages remain confidential.',
    quickReplies: ['Track my cycle', 'Signs of ovulation', 'Natural contraception', 'Pelvic pain'],
    conv: [
      { id: 'a1', role: 'assistant', time: '09:41', text: 'Hello. I am here for you.\nAsk me anything freely — this space is private, caring, and made just for you.' },
      { id: 'u1', role: 'user', time: '09:42', text: 'My cycle has been irregular for two months. Is that normal?' },
      { id: 'a2', role: 'assistant', time: '09:43', text: 'I understand your concern, and it\'s brave of you to ask. 💚\n\nCycle changes are commonly linked to :\n• Stress or fatigue\n• Dietary changes\n• Natural hormonal fluctuations\n\nIf it persists beyond 3 months or comes with pain, please consult a trusted health professional. You are not alone.' },
      { id: 'u2', role: 'user', time: '09:44', text: 'Thank you. How do I know if I\'m ovulating normally?' },
    ],
  },
};

export default function Chatbot() {
  const [lang, setLang] = useState<Lang>('fr');
  const [messages, setMessages] = useState<Message[]>(langConfig.fr.conv);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, typing]);

  useEffect(() => {
    setMessages(langConfig[lang].conv);
    setTyping(false);
    setInput('');
    setPlayingId(null);
  }, [lang]);

  const speakMessage = useCallback((msg: Message) => {
    if (playingId === msg.id) {
      Speech.stop();
      setPlayingId(null);
      return;
    }
    setPlayingId(msg.id);
    Speech.speak(msg.text, {
      language: lang === 'wo' ? 'fr-FR' : lang === 'fr' ? 'fr-FR' : 'en-US',
      rate: 0.9,
      pitch: 1.05,
      onDone: () => setPlayingId(null),
      onStopped: () => setPlayingId(null),
      onError: () => setPlayingId(null),
    });
  }, [lang, playingId]);

  const sendMessage = useCallback((text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setInput('');
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: content,
      time: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const replies: Record<Lang, string> = {
        fr: "Je t'entends. Cette question mérite une réponse honnête et douce. Je te conseille de consulter un professionnel de santé près de toi pour un suivi personnalisé. Tu peux aussi explorer la bibliothèque de ressources de l'application.",
        wo: "Dégg naa la. Laaj bii dafa am solo. Dem ci tabax bu dëkk ngir jëf bu rafet. Xool ci bibliothèque bi ci app bi.",
        en: "I hear you. This is an important question that deserves an honest and caring answer. I recommend consulting a nearby health professional for personalized guidance. You can also explore the app's resource library.",
      };
      const botMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: replies[lang],
        time: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1800);
  }, [input, lang]);

  const cfg = langConfig[lang];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={() => {}}>
            <Feather name="chevron-left" size={20} color={C.beige} />
          </Pressable>
          <View style={styles.headerAvatar}><Feather name="moon" size={22} color={C.terracotta} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Assistant SAXALWÉR</Text>
            <Text style={styles.headerSub}>Information générale, jamais un diagnostic.</Text>
          </View>
        </View>
        {/* Language tabs */}
        <View style={styles.langTabs}>
          {(['fr','wo','en'] as Lang[]).map(l => (
            <Pressable
              key={l}
              style={[styles.langTab, lang === l && styles.langTabActive]}
              onPress={() => setLang(l)}
            >
              <Text style={[styles.langTabText, lang === l && styles.langTabTextActive]}>
                {l === 'fr' ? 'Français' : l === 'wo' ? 'Wolof' : 'English'}
              </Text>
            </Pressable>
          ))}
        </View>
        {/* Disclaimer */}
        <View style={styles.disclaimerRow}>
          <Feather name="info" size={14} color={C.terracotta} style={{ marginRight: 6 }} />
          <Text style={styles.disclaimerText}>{cfg.disclaimer}</Text>
        </View>
        {/* Chat area */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => (
            <View key={msg.id} style={[styles.bubbleRow, msg.role === 'user' ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}> 
              <View style={[styles.bubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                <Text style={[styles.bubbleText, msg.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextBot]}>{msg.text}</Text>
              </View>
              {msg.role === 'assistant' && (
                <Pressable style={styles.ttsBtn} onPress={() => speakMessage(msg)}>
                  <Feather name={playingId === msg.id ? 'volume-x' : 'volume-2'} size={16} color={playingId === msg.id ? C.terracotta : C.deepGreen} />
                </Pressable>
              )}
            </View>
          ))}
          {typing && (
            <View style={styles.bubbleRow}><View style={styles.bubbleBot}><Text style={styles.bubbleTextBot}>…</Text></View></View>
          )}
        </ScrollView>
        {/* Quick replies */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRow} contentContainerStyle={{ gap: 8 }}>
          {cfg.quickReplies.map(q => (
            <Pressable key={q} style={styles.quickBtn} onPress={() => sendMessage(q)}>
              <Text style={styles.quickBtnText}>{q}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {/* Input bar */}
        <View style={styles.inputBar}>
          <Feather name="lock" size={12} color={C.cocoa} style={{ opacity: 0.32, marginRight: 4 }} />
          <Text style={styles.inputBarConf}>{cfg.confidential}</Text>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={cfg.placeholder}
            placeholderTextColor={C.cocoa + '80'}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
          />
          <Pressable style={styles.sendBtn} onPress={() => sendMessage()}>
            <Feather name="send" size={18} color={input.trim() ? C.beige : C.cocoa + '45'} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.beige },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.deepGreen, padding: 16, paddingTop: Platform.OS === 'ios' ? 48 : 24, gap: 12 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  headerTitle: { color: C.beige, fontWeight: '700', fontSize: 18, letterSpacing: 0.2 },
  headerSub: { color: 'rgba(245,241,230,0.52)', fontSize: 11, fontStyle: 'italic', marginTop: 2 },
  langTabs: { flexDirection: 'row', gap: 8, backgroundColor: C.deepGreen, paddingHorizontal: 16, paddingBottom: 8 },
  langTab: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.06)', marginRight: 6 },
  langTabActive: { backgroundColor: 'rgba(255,255,255,0.22)' },
  langTabText: { color: 'rgba(245,241,230,0.5)', fontSize: 13 },
  langTabTextActive: { color: C.beige, fontWeight: '600' },
  disclaimerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.terracotta + '14', borderBottomWidth: 1, borderBottomColor: C.terracotta + '1E', padding: 10, gap: 8 },
  disclaimerText: { fontSize: 12, color: C.cocoa, opacity: 0.7, fontStyle: 'italic', flex: 1 },
  chatScroll: { flex: 1, backgroundColor: 'transparent', paddingHorizontal: 12, paddingTop: 8 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8, gap: 6 },
  bubble: { maxWidth: '78%', borderRadius: 18, paddingVertical: 10, paddingHorizontal: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  bubbleUser: { backgroundColor: C.sand, alignSelf: 'flex-end' },
  bubbleBot: { backgroundColor: C.green2, alignSelf: 'flex-start' },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTextUser: { color: C.cocoa },
  bubbleTextBot: { color: C.beige },
  ttsBtn: { marginLeft: 4, width: 32, height: 32, borderRadius: 16, backgroundColor: C.deepGreen + '14', alignItems: 'center', justifyContent: 'center' },
  quickRow: { flexGrow: 0, backgroundColor: 'transparent', paddingHorizontal: 12, paddingVertical: 6 },
  quickBtn: { backgroundColor: 'transparent', borderWidth: 1.2, borderColor: C.deepGreen + '33', borderRadius: 99, paddingVertical: 6, paddingHorizontal: 16 },
  quickBtnText: { color: C.deepGreen, fontSize: 13, fontWeight: '500' },
  inputBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 2, marginBottom: 0 },
  inputBarConf: { fontSize: 11, color: C.cocoa, opacity: 0.32, fontStyle: 'italic' },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: C.white, borderRadius: 99, margin: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  input: { flex: 1, fontSize: 15, color: C.cocoa, paddingVertical: 8, paddingHorizontal: 12 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.deepGreen, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
});
