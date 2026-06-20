import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp, type SensitiveOrientationLevel } from '../../context/appcontext';

type Step = 1 | 2 | 3 | 4;

type Choice = {
  id: string;
  fr: string;
  wo: string;
  icon: string;
  iconSet: 'feather' | 'mci';
};

const COLORS = {
  bg: '#FDFAF5',
  deepGreen: '#1A3C34',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  terracotta: '#A65D40',
  border: 'rgba(26,60,52,0.1)',
};

const MOOD_OPTIONS: Choice[] = [
  { id: 'anxious', fr: 'Anxieuse', wo: 'Tiit', icon: 'alert-circle', iconSet: 'feather' },
  { id: 'ashamed', fr: 'Gênée ou honteuse', wo: 'Rus ak gàcce', icon: 'eye-off', iconSet: 'feather' },
  { id: 'isolated', fr: 'Seule face à cela', wo: 'Damaa ama solo sama bopp', icon: 'account-off-outline', iconSet: 'mci' },
  { id: 'ready', fr: 'Prête à avancer', wo: 'Jàmm ngir dem kanam', icon: 'check-circle', iconSet: 'feather' },
];

const TABOO_OPTIONS: Choice[] = [
  { id: 'very-taboo', fr: 'Le sujet est très tabou autour de moi', wo: 'Mbir mi tabou la lool', icon: 'shield-off', iconSet: 'feather' },
  { id: 'judged', fr: 'Je crains le jugement ou les reproches', wo: 'Damaa ragal àtte ak xasti', icon: 'message-square', iconSet: 'feather' },
  { id: 'religious-pressure', fr: 'Je ressens une pression sociale ou religieuse', wo: 'Am naa pression sociale walla religion', icon: 'users', iconSet: 'feather' },
  { id: 'cannot-name', fr: 'Je n’arrive pas à nommer clairement le sujet', wo: 'Manuma wax ko ci lu leer', icon: 'help-circle', iconSet: 'feather' },
];

const DECISION_OPTIONS: Choice[] = [
  { id: 'decision-independent', fr: 'Je peux décider seule pour une consultation', wo: 'Maa mën a tànn sama bopp ngir consultation', icon: 'check-circle', iconSet: 'feather' },
  { id: 'decision-shared', fr: 'La décision se prend souvent avec le foyer ou le partenaire', wo: 'Decision bi dañuy ko jël ak kër gi walla partenaire bi', icon: 'home', iconSet: 'feather' },
  { id: 'needs-permission', fr: 'Je dois demander une permission avant une consultation', wo: 'Damaa wara laaj ndigël bala consultation', icon: 'lock', iconSet: 'feather' },
];

const MONEY_OPTIONS: Choice[] = [
  { id: 'money-independent', fr: 'J’ai les moyens et je contrôle l’argent pour consulter', wo: 'Am naa moyens te xaalis bi nekk na ci sama loxo ngir consultation', icon: 'credit-card', iconSet: 'feather' },
  { id: 'money-shared', fr: 'L’argent pour les soins dépend souvent d’une autre personne', wo: 'Xaalis bu jëm ci soins mi ngi aju ci keneen lu bari', icon: 'users', iconSet: 'feather' },
  { id: 'money-control', fr: 'Je ne contrôle pas toujours l’argent pour me déplacer ou consulter', wo: 'Xaalis bi jëm ci déplacement walla consultation nekkul saa su ne ci sama loxo', icon: 'wallet', iconSet: 'mci' },
];

const MOBILITY_OPTIONS: Choice[] = [
  { id: 'mobility-independent', fr: 'Je peux me rendre seule dans un centre de santé', wo: 'Man naa dem sama bopp ci centre de santé', icon: 'map-pin', iconSet: 'feather' },
  { id: 'mobility-supported', fr: 'J’ai parfois besoin d’être accompagnée ou aidée', wo: 'Yenn saa yi soxla naa ñu and ak man walla ñu dimbali ma', icon: 'user-check', iconSet: 'feather' },
  { id: 'mobility-limit', fr: 'Je ne peux pas toujours aller seule à un centre de santé', wo: 'Manuma dem sama bopp ci centre de santé saa su ne', icon: 'navigation-off-outline', iconSet: 'mci' },
];

const ACCESS_OPTIONS: Choice[] = [
  { id: 'discreet-chat', fr: 'Un espace très discret pour poser mes questions', wo: 'Bérab bu suufe ngir laaj', icon: 'message-circle', iconSet: 'feather' },
  { id: 'neutral-words', fr: 'Des mots neutres, moins frontaux', wo: 'Ay wax yu dal te dul tar', icon: 'type', iconSet: 'feather' },
  { id: 'prepare-consultation', fr: 'Préparer ce que je peux dire en consultation', wo: 'Waajal li ma mën a wax ci consultation', icon: 'file-text', iconSet: 'feather' },
  { id: 'know-rights', fr: 'Comprendre mes marges de décision et mes droits', wo: 'Xam sama sañ-sañ ak sama marge de décision', icon: 'compass', iconSet: 'feather' },
];

function ChoiceIcon({ item }: { item: Choice }) {
  if (item.iconSet === 'mci') {
    return <MaterialCommunityIcons name={item.icon as any} size={16} color={COLORS.deepGreen} />;
  }
  return <Feather name={item.icon as any} size={16} color={COLORS.deepGreen} />;
}

function getRiskDimensions(answers: Record<string, string | null>) {
  const dimensions: string[] = [];

  if (answers['taboos'] && answers['taboos'] !== 'none') {
    dimensions.push('Tabous et normes sociales');
  }
  if (answers['decision'] && answers['decision'] !== 'decision-independent') {
    dimensions.push('Autonomie de décision');
  }
  if (answers['money'] && answers['money'] !== 'money-independent') {
    dimensions.push('Autonomie financière');
  }
  if (answers['mobility'] && answers['mobility'] !== 'mobility-independent') {
    dimensions.push('Déplacement vers les soins');
  }
  if (answers['access'] && answers['access'] !== 'none') {
    dimensions.push('Accès sécurisé aux soins');
  }
  if (answers['mood'] === 'anxious' || answers['mood'] === 'ashamed' || answers['mood'] === 'isolated') {
    dimensions.push('Charge émotionnelle');
  }

  return dimensions;
}

function getPrivacyRisk(answers: Record<string, string | null>) {
  return (
    answers['taboos'] === 'very-taboo' ||
    answers['decision'] === 'needs-permission' ||
    answers['money'] === 'money-control' ||
    answers['mobility'] === 'mobility-limit'
  );
}

function getLevel(answers: Record<string, string | null>): SensitiveOrientationLevel {
  const strongSignals = [
    answers['taboos'] === 'very-taboo',
    answers['decision'] === 'needs-permission',
    answers['money'] === 'money-control',
    answers['mobility'] === 'mobility-limit',
    answers['mood'] === 'isolated',
  ].filter(Boolean).length;

  if (strongSignals >= 2) {
    return 'priority';
  }
  if (
    strongSignals >= 1 ||
    answers['taboos'] === 'judged' ||
    answers['decision'] === 'decision-shared' ||
    answers['money'] === 'money-shared' ||
    answers['mobility'] === 'mobility-supported'
  ) {
    return 'recommended';
  }
  return 'surveillance';
}

export default function OrientationSensiblePage() {
  const router = useRouter();
  const { language, saveSensitiveOrientation } = useApp();
  const wo = language === 'wo';

  const [step, setStep] = React.useState<Step>(1);
  const [mood, setMood] = React.useState<string | null>(null);
  const [taboos, setTaboos] = React.useState<string | null>(null);
  const [decision, setDecision] = React.useState<string | null>(null);
  const [money, setMoney] = React.useState<string | null>(null);
  const [mobility, setMobility] = React.useState<string | null>(null);
  const [access, setAccess] = React.useState<string | null>(null);

  const answers = React.useMemo(
    () => ({
      mood,
      taboos,
      decision,
      money,
      mobility,
      access,
    }),
    [access, decision, mobility, money, mood, taboos]
  );

  const riskDimensions = React.useMemo(() => getRiskDimensions(answers), [answers]);
  const privacyRisk = React.useMemo(() => getPrivacyRisk(answers), [answers]);
  const level = React.useMemo(() => getLevel(answers), [answers]);

  function submit() {
    saveSensitiveOrientation({
      answers,
      completedAt: Date.now(),
      level,
      riskDimensions,
      privacyRisk,
    });
    router.push('/' as never);
  }

  const canStep1 = !!mood;
  const canStep2 = !!taboos;
  const canStep3 = !!decision && !!money && !!mobility;
  const canSubmit = !!access;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => (step === 1 ? router.back() : setStep((step - 1) as Step))} style={styles.backBtn}>
            <Feather name="chevron-left" size={20} color={COLORS.deepGreen} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{wo ? 'Orientation sensible' : 'Orientation sensible'}</Text>
            <Text style={styles.subtitle}>{wo ? `Etape ${step}/4` : `Étape ${step}/4`}</Text>
          </View>
        </View>

        <View style={styles.progressWrap}>
          {[1, 2, 3, 4].map((v) => (
            <View key={v} style={[styles.progressBar, step >= v && styles.progressBarActive]} />
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            {wo ? 'Bii dafa xool sa xaalis ak sa sutura' : 'Ce parcours prend aussi en compte ton contexte social'}
          </Text>
          <Text style={styles.infoText}>
            {wo
              ? 'Dina laaj ci tabous, décisions ci kër gi, ndigël ngir consultation ak naka nga bëgg ñu la topp.'
              : 'Il explore aussi les tabous, les normes sociales, la place des décisions dans le foyer, les autorisations implicites ou explicites, et les conditions réelles d’accès à une consultation.'}
          </Text>
        </View>

        {step === 1 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {wo ? 'Naka nga yëg lii ci sa biir ?' : 'Comment te sens-tu face à ces sujets ?'}
            </Text>
            <Text style={styles.sectionDesc}>
              {wo ? 'Tannal li gëna jege ci li ngay dund' : 'Choisis ce qui correspond le mieux à ton ressenti actuel'}
            </Text>
            <View style={styles.grid}>
              {MOOD_OPTIONS.map((item) => {
                const active = mood === item.id;
                return (
                  <Pressable key={item.id} style={[styles.choice, active && styles.choiceActive]} onPress={() => setMood(item.id)}>
                    <ChoiceIcon item={item} />
                    <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{wo ? item.wo : item.fr}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable style={[styles.nextBtn, !canStep1 && styles.nextBtnDisabled]} onPress={() => canStep1 && setStep(2)}>
              <Text style={styles.nextText}>{wo ? 'Kontine' : 'Continuer'}</Text>
              <Feather name="chevron-right" size={16} color="#fff" />
            </Pressable>
          </View>
        ) : null}

        {step === 2 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {wo ? 'Ci sa kawale, naka lañuy xool mbir yii ?' : 'Autour de toi, comment ces sujets sont-ils perçus ?'}
            </Text>
            <Text style={styles.sectionDesc}>
              {wo ? 'Lii dina dimbali nu jox la ay wax yu gëna dal' : 'Cela nous aide à adapter le ton, les mots employés et le niveau de discrétion'}
            </Text>
            <View style={styles.grid}>
              {TABOO_OPTIONS.map((item) => {
                const active = taboos === item.id;
                return (
                  <Pressable key={item.id} style={[styles.choice, active && styles.choiceActive]} onPress={() => setTaboos(item.id)}>
                    <ChoiceIcon item={item} />
                    <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{wo ? item.wo : item.fr}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable style={[styles.nextBtn, !canStep2 && styles.nextBtnDisabled]} onPress={() => canStep2 && setStep(3)}>
              <Text style={styles.nextText}>{wo ? 'Kontine' : 'Continuer'}</Text>
              <Feather name="chevron-right" size={16} color="#fff" />
            </Pressable>
          </View>
        ) : null}

        {step === 3 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {wo ? 'Naka la décision ak accès yi di dox ci kër gi ?' : 'Dans ton foyer, comment se passent les décisions et l’accès aux soins ?'}
            </Text>
            <Text style={styles.sectionDesc}>
              {wo ? 'Lii am na solo ngir xam lu mën a la tax nga yeg ne consultation dafa metti' : 'Nous cherchons à comprendre s’il existe des freins liés au foyer, aux déplacements, à l’argent ou aux autorisations'}
            </Text>
            <View style={styles.topicBlock}>
              <Text style={styles.topicTitle}>{wo ? 'Decision' : 'Décision'}</Text>
              <View style={styles.grid}>
                {DECISION_OPTIONS.map((item) => {
                  const active = decision === item.id;
                  return (
                    <Pressable key={item.id} style={[styles.choice, active && styles.choiceActive]} onPress={() => setDecision(item.id)}>
                      <ChoiceIcon item={item} />
                      <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{wo ? item.wo : item.fr}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={styles.topicBlock}>
              <Text style={styles.topicTitle}>{wo ? 'Xaalis ak moyens' : 'Argent et moyens'}</Text>
              <View style={styles.grid}>
                {MONEY_OPTIONS.map((item) => {
                  const active = money === item.id;
                  return (
                    <Pressable key={item.id} style={[styles.choice, active && styles.choiceActive]} onPress={() => setMoney(item.id)}>
                      <ChoiceIcon item={item} />
                      <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{wo ? item.wo : item.fr}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={styles.topicBlock}>
              <Text style={styles.topicTitle}>{wo ? 'Dem ci soins' : 'Déplacement vers les soins'}</Text>
              <View style={styles.grid}>
                {MOBILITY_OPTIONS.map((item) => {
                  const active = mobility === item.id;
                  return (
                    <Pressable key={item.id} style={[styles.choice, active && styles.choiceActive]} onPress={() => setMobility(item.id)}>
                      <ChoiceIcon item={item} />
                      <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{wo ? item.wo : item.fr}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <Pressable style={[styles.nextBtn, !canStep3 && styles.nextBtnDisabled]} onPress={() => canStep3 && setStep(4)}>
              <Text style={styles.nextText}>{wo ? 'Kontine' : 'Continuer'}</Text>
              <Feather name="chevron-right" size={16} color="#fff" />
            </Pressable>
          </View>
        ) : null}

        {step === 4 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {wo ? 'Lu nga bëgg nu def ngir nga yeg ne am nga sutura ak doole ?' : 'De quoi as-tu le plus besoin pour te sentir en sécurité et garder la main ?'}
            </Text>
            <Text style={styles.sectionDesc}>
              {wo ? 'Tannal li nga bëgg gëna am ci ndimbal bi' : 'Ce choix nous aide à proposer un accompagnement plus respectueux de tes marges de manœuvre'}
            </Text>
            <View style={styles.grid}>
              {ACCESS_OPTIONS.map((item) => {
                const active = access === item.id;
                return (
                  <Pressable key={item.id} style={[styles.choice, active && styles.choiceActive]} onPress={() => setAccess(item.id)}>
                    <ChoiceIcon item={item} />
                    <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{wo ? item.wo : item.fr}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>{wo ? 'Njiitu biñuy xool' : 'Première lecture du contexte'}</Text>
              <Text style={styles.summaryLine}>
                {wo ? 'Niveau :' : 'Niveau :'}{' '}
                {level === 'priority' ? (wo ? 'Lu jëkk' : 'Prioritaire') : level === 'recommended' ? (wo ? 'Digal nañu ko' : 'Recommandé') : (wo ? 'Surveillance' : 'Surveillance')}
              </Text>
              <Text style={styles.summaryLine}>
                {wo ? 'Risku sutura :' : 'Risque de confidentialité :'} {privacyRisk ? (wo ? 'Waaw' : 'Oui') : (wo ? 'Déedéet' : 'Non')}
              </Text>
              <Text style={styles.summaryLine}>
                {wo ? 'Wàll yi ñuy topp :' : 'Dimensions suivies :'} {riskDimensions.length > 0 ? riskDimensions.join(wo ? ' • ' : ', ') : (wo ? 'Amul' : 'Aucune')}
              </Text>
            </View>

            <Pressable style={[styles.nextBtn, !canSubmit && styles.nextBtnDisabled]} onPress={submit}>
              <Text style={styles.nextText}>{wo ? 'Jeexal' : 'Terminer'}</Text>
              <Feather name="check" size={16} color="#fff" />
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 22, paddingBottom: 110, gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { fontSize: 27, fontWeight: '700', color: COLORS.deepGreen },
  subtitle: { fontSize: 12, color: 'rgba(74,47,39,0.55)', marginTop: 2 },
  progressWrap: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  progressBar: { flex: 1, height: 6, borderRadius: 99, backgroundColor: '#E4ECE8' },
  progressBarActive: { backgroundColor: COLORS.deepGreen },
  infoCard: {
    backgroundColor: '#FFF7EF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.16)',
    padding: 14,
    gap: 6,
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: COLORS.copper },
  infoText: { fontSize: 13, lineHeight: 20, color: COLORS.cocoa },
  section: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.deepGreen },
  sectionDesc: { fontSize: 12, color: 'rgba(74,47,39,0.7)', lineHeight: 18 },
  topicBlock: { gap: 8 },
  topicTitle: { fontSize: 13, fontWeight: '700', color: COLORS.copper },
  grid: { gap: 8 },
  choice: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F4F7F5',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  choiceActive: {
    borderColor: 'rgba(181,98,42,0.45)',
    backgroundColor: '#F8E8DE',
  },
  choiceText: { flex: 1, fontSize: 14, lineHeight: 20, color: COLORS.deepGreen, fontWeight: '600' },
  choiceTextActive: { color: COLORS.copper },
  summaryCard: {
    marginTop: 2,
    borderRadius: 14,
    backgroundColor: '#F8F4ED',
    borderWidth: 1,
    borderColor: 'rgba(74,47,39,0.08)',
    padding: 12,
    gap: 6,
  },
  summaryTitle: { fontSize: 13, fontWeight: '700', color: COLORS.deepGreen },
  summaryLine: { fontSize: 13, lineHeight: 19, color: COLORS.cocoa },
  nextBtn: {
    marginTop: 2,
    borderRadius: 12,
    backgroundColor: COLORS.deepGreen,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  nextBtnDisabled: { opacity: 0.45 },
  nextText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
