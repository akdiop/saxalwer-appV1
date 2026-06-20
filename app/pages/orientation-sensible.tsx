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

type QuestionBlockProps = {
  titleFr: string;
  titleWo: string;
  descFr?: string;
  descWo?: string;
  options: Choice[];
  value: string | null;
  onChange: (value: string) => void;
  wo: boolean;
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
  { id: 'isolated', fr: 'Seule face à cela', wo: 'Damaa am solo sama bopp', icon: 'account-off-outline', iconSet: 'mci' },
  { id: 'ready', fr: 'Prête à avancer', wo: 'Jàmm ngir dem kanam', icon: 'check-circle', iconSet: 'feather' },
];

const TABOO_OPTIONS: Choice[] = [
  { id: 'taboo-open', fr: 'On peut en parler sans grand malaise autour de moi', wo: 'Man nanu ko wax ci ndànk ak jàmm', icon: 'check-circle', iconSet: 'feather' },
  { id: 'taboo-sensitive', fr: 'Le sujet est sensible, on en parle peu', wo: 'Mbir mi jafe na, waxuñu ko lu bari', icon: 'alert-circle', iconSet: 'feather' },
  { id: 'very-taboo', fr: 'Le sujet est très tabou autour de moi', wo: 'Mbir mi tabou la lool', icon: 'shield-off', iconSet: 'feather' },
];

const JUDGMENT_OPTIONS: Choice[] = [
  { id: 'judgment-low', fr: 'Je crains peu les réactions autour de moi', wo: 'Ragaluma ay réaction yu bari', icon: 'shield', iconSet: 'feather' },
  { id: 'judgment-family', fr: 'Je crains surtout les réactions du foyer ou de la famille', wo: 'Ragal naa li kër gi walla njaboot gi di wax', icon: 'home', iconSet: 'feather' },
  { id: 'judgment-partner', fr: 'Je crains surtout le partenaire ou la belle-famille', wo: 'Ragal naa partenaire bi walla famille bi', icon: 'user', iconSet: 'feather' },
  { id: 'judgment-community', fr: 'Je crains surtout le voisinage, la communauté ou les rumeurs', wo: 'Ragal naa dëkkandoo yi, askan wi walla yenn wax', icon: 'users', iconSet: 'feather' },
  { id: 'judgment-wide', fr: 'J’ai l’impression que je serais jugée par plusieurs côtés', wo: 'Dama feel ne ñu ma di àtte fu nekk', icon: 'message-square', iconSet: 'feather' },
];

const NORM_OPTIONS: Choice[] = [
  { id: 'norms-flexible', fr: 'J’ai une marge de choix personnelle sur ces sujets', wo: 'Am naa marge ngir tànn ci sama bopp', icon: 'compass', iconSet: 'feather' },
  { id: 'norms-discuss', fr: 'Je dois tenir compte des attentes du foyer avant d’agir', wo: 'War naa jàpp ci li kër gi bëgg bala may jëf', icon: 'users', iconSet: 'feather' },
  { id: 'norms-role', fr: 'On attend de moi de rester discrète ou de ne pas décider seule', wo: 'Ñu ngi xaar ma des ci sutura walla bañ a tànn sama bopp rekk', icon: 'eye-off', iconSet: 'feather' },
  { id: 'norms-control', fr: 'Des règles familiales, sociales ou religieuses limitent clairement ma marge', wo: 'Ay règle yu njaboot, askan walla religion dañuy gàññi sama marge', icon: 'lock', iconSet: 'feather' },
];

const EXPRESSION_OPTIONS: Choice[] = [
  { id: 'expression-free', fr: 'Je peux nommer clairement le sujet', wo: 'Man naa wax ko ci lu leer', icon: 'message-circle', iconSet: 'feather' },
  { id: 'expression-neutral', fr: 'Je préfère employer des mots neutres ou indirects', wo: 'Bëgg naa jëfandikoo ay wax yu dal walla yu jubadi', icon: 'type', iconSet: 'feather' },
  { id: 'expression-hidden', fr: 'Je parle en généralités pour éviter d’être repérée', wo: 'Wax naa ci lu yàgg ba kenn bañ a xam li may tekki', icon: 'slash', iconSet: 'feather' },
  { id: 'cannot-name', fr: 'Je n’arrive pas à nommer clairement ce qui me préoccupe', wo: 'Manuma wax ci lu leer li ma jaaxal', icon: 'help-circle', iconSet: 'feather' },
];

const DECISION_OPTIONS: Choice[] = [
  { id: 'decision-independent', fr: 'Je décide seule si je veux consulter', wo: 'Maa di tànn sama bopp su ma bëggee consultation', icon: 'check-circle', iconSet: 'feather' },
  { id: 'decision-discussed', fr: 'Je peux décider, mais j’en parle souvent avec quelqu’un du foyer', wo: 'Man naa tànn, waaye dama koy wax ak kenn ci kër gi lu bari', icon: 'message-circle', iconSet: 'feather' },
  { id: 'decision-shared', fr: 'La décision se prend généralement à plusieurs', wo: 'Decision bi dañuy ko jël ak ay nit ñu bari', icon: 'users', iconSet: 'feather' },
  { id: 'decision-controlled', fr: 'Une autre personne a souvent le dernier mot', wo: 'Keneen moo bari ci baat bu mujj bi', icon: 'lock', iconSet: 'feather' },
];

const PERMISSION_OPTIONS: Choice[] = [
  { id: 'permission-none', fr: 'Je n’ai pas besoin d’autorisation pour consulter', wo: 'Soxlawuma ndigël ngir consultation', icon: 'shield', iconSet: 'feather' },
  { id: 'permission-inform', fr: 'Je préfère prévenir quelqu’un, sans permission formelle', wo: 'Bëgg naa yëgël kenn, waaye du ndigël bu leer', icon: 'bell', iconSet: 'feather' },
  { id: 'permission-implicit', fr: 'Il vaut mieux obtenir un accord implicite avant d’y aller', wo: 'Baax na am ndigal lu nuy xam lu xóot bala ngay dem', icon: 'check-square', iconSet: 'feather' },
  { id: 'permission-explicit', fr: 'Je dois demander une permission claire avant une consultation', wo: 'Damaa wara laaj ndigël bu leer bala consultation', icon: 'key', iconSet: 'feather' },
];

const EXPLANATION_OPTIONS: Choice[] = [
  { id: 'explanation-free', fr: 'Je peux consulter sans me justifier', wo: 'Man naa dem consultation te soxlawuma firi', icon: 'check-circle', iconSet: 'feather' },
  { id: 'explanation-brief', fr: 'Je donne parfois une explication rapide', wo: 'Yenn saa yi damay wax lu gatt rekk', icon: 'file-text', iconSet: 'feather' },
  { id: 'explanation-detailed', fr: 'Je dois expliquer pourquoi, avec qui et pour combien de temps', wo: 'War naa wax lu tax, ak kan, ak fan yu tollu', icon: 'clipboard', iconSet: 'feather' },
  { id: 'explanation-avoid', fr: 'Je reporte parfois la consultation pour éviter d’avoir à me justifier', wo: 'Yenn saa yi damay yeesal consultation ngir bañ a firi', icon: 'clock', iconSet: 'feather' },
];

const MONEY_OPTIONS: Choice[] = [
  { id: 'money-independent', fr: 'J’ai les moyens et je contrôle l’argent pour consulter', wo: 'Am naa moyens te xaalis bi nekk na ci sama loxo ngir consultation', icon: 'credit-card', iconSet: 'feather' },
  { id: 'money-shared', fr: 'L’argent pour les soins dépend souvent d’une autre personne', wo: 'Xaalis bu jëm ci soins mi ngi aju ci keneen lu bari', icon: 'users', iconSet: 'feather' },
  { id: 'money-discreet', fr: 'Je dois parfois trouver l’argent discrètement ou sans tout expliquer', wo: 'Yenn saa yi war naa sàkku xaalis ci sutura walla bañ a wax lépp', icon: 'eye-off', iconSet: 'feather' },
  { id: 'money-control', fr: 'Je ne contrôle pas toujours l’argent pour me déplacer ou consulter', wo: 'Xaalis bi jëm ci déplacement walla consultation nekkul saa su ne ci sama loxo', icon: 'wallet', iconSet: 'mci' },
];

const MOBILITY_OPTIONS: Choice[] = [
  { id: 'mobility-independent', fr: 'Je peux me rendre seule dans un centre de santé', wo: 'Man naa dem sama bopp ci centre de santé', icon: 'map-pin', iconSet: 'feather' },
  { id: 'mobility-supported', fr: 'J’ai parfois besoin d’être aidée pour m’organiser ou me déplacer', wo: 'Yenn saa yi soxla naa ndimbal ngir waajal walla dem', icon: 'navigation', iconSet: 'feather' },
  { id: 'mobility-accompanied', fr: 'Le déplacement est plus simple si quelqu’un m’accompagne ou le valide', wo: 'Dem bi gëna yomb su kenn andee ak man walla ko nangu', icon: 'user-check', iconSet: 'feather' },
  { id: 'mobility-limit', fr: 'Je ne peux pas toujours aller seule à un centre de santé', wo: 'Manuma dem sama bopp ci centre de santé saa su ne', icon: 'navigation-off-outline', iconSet: 'mci' },
];

const CONSULT_ACCESS_OPTIONS: Choice[] = [
  { id: 'consult-free', fr: 'Je peux choisir seule le lieu et le moment de la consultation', wo: 'Man naa tànn sama bopp fu may dem ak kañ', icon: 'compass', iconSet: 'feather' },
  { id: 'consult-discreet', fr: 'Je peux consulter, mais il faut trouver le bon moment ou un prétexte discret', wo: 'Man naa consulter, waaye war naa seet waxtu wu baax walla lu ma ko firi', icon: 'clock', iconSet: 'feather' },
  { id: 'consult-accompanied', fr: 'L’accès est plus simple si quelqu’un sait, m’accompagne ou organise', wo: 'Accès bi gëna yomb su kenn xamee ko, and ak man walla ko waaj', icon: 'users', iconSet: 'feather' },
  { id: 'consult-authorized', fr: 'L’accès dépend d’un accord ou d’une autorisation explicite', wo: 'Accès bi aju na ci ndigël walla nangu gu leer', icon: 'lock', iconSet: 'feather' },
];

const PRIVATE_TALK_OPTIONS: Choice[] = [
  { id: 'private-talk-free', fr: 'Je peux parler seule avec la soignante ou le soignant', wo: 'Man naa wax sama bopp ak soignant bi', icon: 'message-circle', iconSet: 'feather' },
  { id: 'private-talk-limited', fr: 'Même en consultation, je n’ose pas toujours dire le fond du sujet', wo: 'Benn consultation sax, yenn saa yi manuma wax lu neexul', icon: 'message-square', iconSet: 'feather' },
  { id: 'private-talk-present', fr: 'Une personne de mon entourage veut souvent être présente ou tout savoir', wo: 'Kenn ci sama entourage bëgg na nekk fa walla xam lépp', icon: 'user', iconSet: 'feather' },
  { id: 'private-talk-none', fr: 'Il est difficile d’avoir un échange vraiment privé', wo: 'Jafe na am waxtaan wu sutura bu dëgg', icon: 'slash', iconSet: 'feather' },
];

const ACCESS_OPTIONS: Choice[] = [
  { id: 'discreet-chat', fr: 'Un espace très discret pour poser mes questions', wo: 'Bérab bu suufe ngir laaj', icon: 'message-circle', iconSet: 'feather' },
  { id: 'neutral-words', fr: 'Des mots neutres, moins frontaux', wo: 'Ay wax yu dal te dul tar', icon: 'type', iconSet: 'feather' },
  { id: 'prepare-consultation', fr: 'Préparer ce que je peux dire en consultation', wo: 'Waajal li ma mën a wax ci consultation', icon: 'file-text', iconSet: 'feather' },
  { id: 'safe-center', fr: 'Repérer un lieu ou un moment plus sûr pour consulter', wo: 'Seet fu gëna wóor walla waxtu wu gëna baax ngir consultation', icon: 'map-pin', iconSet: 'feather' },
  { id: 'trusted-support', fr: 'Identifier une personne de confiance qui peut m’appuyer', wo: 'Xam kenn ku ma wóor ku mën ma dimbali', icon: 'user-check', iconSet: 'feather' },
  { id: 'know-rights', fr: 'Comprendre mes marges de décision et mes droits', wo: 'Xam sama sañ-sañ ak sama marge de décision', icon: 'compass', iconSet: 'feather' },
];

function ChoiceIcon({ item }: { item: Choice }) {
  if (item.iconSet === 'mci') {
    return <MaterialCommunityIcons name={item.icon as any} size={16} color={COLORS.deepGreen} />;
  }
  return <Feather name={item.icon as any} size={16} color={COLORS.deepGreen} />;
}

function QuestionBlock({
  titleFr,
  titleWo,
  descFr,
  descWo,
  options,
  value,
  onChange,
  wo,
}: QuestionBlockProps) {
  return (
    <View style={styles.topicBlock}>
      <Text style={styles.topicTitle}>{wo ? titleWo : titleFr}</Text>
      {descFr || descWo ? <Text style={styles.topicDesc}>{wo ? descWo : descFr}</Text> : null}
      <View style={styles.grid}>
        {options.map((item) => {
          const active = value === item.id;
          return (
            <Pressable key={item.id} style={[styles.choice, active && styles.choiceActive]} onPress={() => onChange(item.id)}>
              <ChoiceIcon item={item} />
              <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{wo ? item.wo : item.fr}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function isOneOf(value: string | null | undefined, ids: string[]) {
  return value ? ids.includes(value) : false;
}

function hasSocialConstraint(answers: Record<string, string | null>) {
  return (
    answers['taboos'] !== 'taboo-open' ||
    answers['judgment'] !== 'judgment-low' ||
    answers['norms'] !== 'norms-flexible' ||
    answers['expression'] !== 'expression-free'
  );
}

function hasHouseholdDecisionConstraint(answers: Record<string, string | null>) {
  return (
    answers['decision'] !== 'decision-independent' ||
    answers['permission'] !== 'permission-none' ||
    answers['explanation'] !== 'explanation-free'
  );
}

function hasFinancialConstraint(answers: Record<string, string | null>) {
  return answers['money'] !== 'money-independent';
}

function hasMobilityConstraint(answers: Record<string, string | null>) {
  return answers['mobility'] !== 'mobility-independent';
}

function hasAuthorizedAccessConstraint(answers: Record<string, string | null>) {
  return answers['consultAccess'] !== 'consult-free';
}

function hasPrivateConsultConstraint(answers: Record<string, string | null>) {
  return answers['privateTalk'] !== 'private-talk-free';
}

function hasEmotionalLoad(answers: Record<string, string | null>) {
  return isOneOf(answers['mood'], ['anxious', 'ashamed', 'isolated']);
}

function getRiskDimensions(answers: Record<string, string | null>) {
  const dimensions: string[] = [];

  if (hasSocialConstraint(answers)) {
    dimensions.push('Tabous et normes sociales');
  }
  if (hasHouseholdDecisionConstraint(answers)) {
    dimensions.push('Gestion des décisions au sein du foyer');
  }
  if (hasFinancialConstraint(answers)) {
    dimensions.push('Autonomie financière');
  }
  if (hasMobilityConstraint(answers)) {
    dimensions.push('Déplacement vers les soins');
  }
  if (hasAuthorizedAccessConstraint(answers)) {
    dimensions.push('Accès autorisé à la consultation');
  }
  if (hasPrivateConsultConstraint(answers)) {
    dimensions.push('Confidentialité pendant la consultation');
  }
  if (hasEmotionalLoad(answers)) {
    dimensions.push('Charge émotionnelle');
  }

  return dimensions;
}

function getPrivacyRisk(answers: Record<string, string | null>) {
  return (
    answers['taboos'] === 'very-taboo' ||
    isOneOf(answers['judgment'], ['judgment-partner', 'judgment-community', 'judgment-wide']) ||
    answers['norms'] === 'norms-control' ||
    isOneOf(answers['expression'], ['expression-hidden', 'cannot-name']) ||
    isOneOf(answers['permission'], ['permission-implicit', 'permission-explicit']) ||
    isOneOf(answers['explanation'], ['explanation-detailed', 'explanation-avoid']) ||
    isOneOf(answers['money'], ['money-discreet', 'money-control']) ||
    isOneOf(answers['mobility'], ['mobility-accompanied', 'mobility-limit']) ||
    isOneOf(answers['consultAccess'], ['consult-discreet', 'consult-accompanied', 'consult-authorized']) ||
    isOneOf(answers['privateTalk'], ['private-talk-present', 'private-talk-none'])
  );
}

function getLevel(answers: Record<string, string | null>): SensitiveOrientationLevel {
  const strongSignals = [
    answers['taboos'] === 'very-taboo',
    isOneOf(answers['judgment'], ['judgment-partner', 'judgment-community', 'judgment-wide']),
    answers['norms'] === 'norms-control',
    isOneOf(answers['expression'], ['expression-hidden', 'cannot-name']),
    answers['decision'] === 'decision-controlled',
    answers['permission'] === 'permission-explicit',
    answers['explanation'] === 'explanation-avoid',
    isOneOf(answers['money'], ['money-discreet', 'money-control']),
    answers['mobility'] === 'mobility-limit',
    answers['consultAccess'] === 'consult-authorized',
    answers['privateTalk'] === 'private-talk-none',
    answers['mood'] === 'isolated',
  ].filter(Boolean).length;

  const moderateSignals = [
    answers['taboos'] === 'taboo-sensitive',
    answers['judgment'] === 'judgment-family',
    isOneOf(answers['norms'], ['norms-discuss', 'norms-role']),
    answers['expression'] === 'expression-neutral',
    isOneOf(answers['decision'], ['decision-discussed', 'decision-shared']),
    isOneOf(answers['permission'], ['permission-inform', 'permission-implicit']),
    isOneOf(answers['explanation'], ['explanation-brief', 'explanation-detailed']),
    answers['money'] === 'money-shared',
    isOneOf(answers['mobility'], ['mobility-supported', 'mobility-accompanied']),
    isOneOf(answers['consultAccess'], ['consult-discreet', 'consult-accompanied']),
    isOneOf(answers['privateTalk'], ['private-talk-limited', 'private-talk-present']),
    isOneOf(answers['mood'], ['anxious', 'ashamed']),
  ].filter(Boolean).length;

  if (strongSignals >= 3) {
    return 'priority';
  }
  if (strongSignals >= 1 || moderateSignals >= 2) {
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
  const [judgment, setJudgment] = React.useState<string | null>(null);
  const [norms, setNorms] = React.useState<string | null>(null);
  const [expression, setExpression] = React.useState<string | null>(null);
  const [decision, setDecision] = React.useState<string | null>(null);
  const [permission, setPermission] = React.useState<string | null>(null);
  const [explanation, setExplanation] = React.useState<string | null>(null);
  const [money, setMoney] = React.useState<string | null>(null);
  const [mobility, setMobility] = React.useState<string | null>(null);
  const [consultAccess, setConsultAccess] = React.useState<string | null>(null);
  const [privateTalk, setPrivateTalk] = React.useState<string | null>(null);
  const [access, setAccess] = React.useState<string | null>(null);

  const answers = React.useMemo(
    () => ({
      mood,
      taboos,
      judgment,
      norms,
      expression,
      decision,
      permission,
      explanation,
      money,
      mobility,
      consultAccess,
      privateTalk,
      access,
    }),
    [access, consultAccess, decision, explanation, expression, judgment, mobility, money, mood, norms, permission, privateTalk, taboos]
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
  const canStep2 = !!taboos && !!judgment && !!norms && !!expression;
  const canStep3 = !!decision && !!permission && !!explanation && !!money && !!mobility;
  const canSubmit = !!consultAccess && !!privateTalk && !!access;

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
            {wo ? 'Bii dafay xool li nga wara waajal bala consultation' : 'Ce parcours regarde aussi ce qu’il faut parfois négocier avant une consultation'}
          </Text>
          <Text style={styles.infoText}>
            {wo
              ? 'Dina laaj ci tabous, li askan walla kër gi di xaar, kan moo tànn, ndigël ngir consultation, xaalis, déplacement ak ndax man nga wax ci sutura ak soignant bi.'
              : 'Il explore plus finement les tabous, les normes sociales, la façon dont les décisions se gèrent dans le foyer, les autorisations implicites ou explicites, l’argent, le déplacement et la possibilité de parler librement en consultation.'}
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
              {wo ? 'Ci sa kawale, naka lañuy xool mbir yii ?' : 'Autour de toi, comment ces sujets sont-ils réellement perçus ?'}
            </Text>
            <Text style={styles.sectionDesc}>
              {wo ? 'Lii dina nu dimbali ngir jox la ay wax yu dal ak yoonu sutura bu gëna baax' : 'Plus on comprend les tabous, les réactions et les normes autour de toi, plus on peut adapter les mots, le ton et le niveau de discrétion'}
            </Text>
            <QuestionBlock
              titleFr="Niveau de tabou"
              titleWo="Niveau tabou"
              descFr="Le sujet est-il juste sensible, ou carrément difficile à aborder autour de toi ?"
              descWo="Mbir mi am na jafe-jafe rekk, walla dafa tabou lool ?"
              options={TABOO_OPTIONS}
              value={taboos}
              onChange={setTaboos}
              wo={wo}
            />
            <QuestionBlock
              titleFr="Source principale du jugement"
              titleWo="Fan la jugement bi gën a jóge"
              descFr="Si tu crains des réactions, d’où viennent-elles surtout ?"
              descWo="Soo ragalee ay réaction, fan lañu gën a jóge ?"
              options={JUDGMENT_OPTIONS}
              value={judgment}
              onChange={setJudgment}
              wo={wo}
            />
            <QuestionBlock
              titleFr="Normes et attentes"
              titleWo="Normes ak xaar-xaar"
              descFr="Y a-t-il des attentes familiales, sociales ou religieuses qui pèsent sur ta façon d’agir ?"
              descWo="Am na ay xaar-xaar yu njaboot, askan walla religion yu neexul ci sa tànn ?"
              options={NORM_OPTIONS}
              value={norms}
              onChange={setNorms}
              wo={wo}
            />
            <QuestionBlock
              titleFr="Façon d’en parler"
              titleWo="Naka ngay ko waxe"
              descFr="Peux-tu nommer le sujet clairement, ou dois-tu le contourner ?"
              descWo="Man nga wax ko ci lu leer, walla war nga jubadi ko ?"
              options={EXPRESSION_OPTIONS}
              value={expression}
              onChange={setExpression}
              wo={wo}
            />
            <Pressable style={[styles.nextBtn, !canStep2 && styles.nextBtnDisabled]} onPress={() => canStep2 && setStep(3)}>
              <Text style={styles.nextText}>{wo ? 'Kontine' : 'Continuer'}</Text>
              <Feather name="chevron-right" size={16} color="#fff" />
            </Pressable>
          </View>
        ) : null}

        {step === 3 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {wo ? 'Ci kër gi, naka lañuy saytu décisions yi ci wàllu soins ?' : 'Dans ton foyer, comment se gèrent réellement les décisions liées aux soins ?'}
            </Text>
            <Text style={styles.sectionDesc}>
              {wo ? 'Lii am na solo ngir xam ku tànn, ku nangu ak lan mooy tax consultation di jafe' : 'On cherche ici à comprendre qui décide, s’il faut une permission, comment tu finances le soin et ce qui peut compliquer le déplacement'}
            </Text>
            <QuestionBlock
              titleFr="Qui pèse dans la décision"
              titleWo="Kan moo bari ci décision bi"
              descFr="Quand il s’agit d’aller en consultation, qui a le plus de poids ?"
              descWo="Bu jëm ci consultation, kan moo gëna am doole ci décision bi ?"
              options={DECISION_OPTIONS}
              value={decision}
              onChange={setDecision}
              wo={wo}
            />
            <QuestionBlock
              titleFr="Permission ou accord attendu"
              titleWo="Ndigël walla nangu gu ñuy xaar"
              descFr="As-tu besoin de prévenir, d’obtenir un accord implicite, ou une permission claire ?"
              descWo="War nga yëgël kenn, am nangu lu xóot, walla ndigël bu leer ?"
              options={PERMISSION_OPTIONS}
              value={permission}
              onChange={setPermission}
              wo={wo}
            />
            <QuestionBlock
              titleFr="Justification à fournir"
              titleWo="Li ngay wara firi"
              descFr="Dois-tu expliquer pourquoi tu consultes, avec qui et pendant combien de temps ?"
              descWo="War nga wax lu tax ngay consulter, ak kan ak fan yu tollu ?"
              options={EXPLANATION_OPTIONS}
              value={explanation}
              onChange={setExplanation}
              wo={wo}
            />
            <QuestionBlock
              titleFr="Argent et moyens"
              titleWo="Xaalis ak moyens"
              descFr="Qui contrôle concrètement l’argent pour consulter ou se déplacer ?"
              descWo="Kan moo dëgër ci xaalis bi jëm ci consultation walla déplacement ?"
              options={MONEY_OPTIONS}
              value={money}
              onChange={setMoney}
              wo={wo}
            />
            <QuestionBlock
              titleFr="Déplacement vers les soins"
              titleWo="Dem ci soins"
              descFr="Peux-tu te rendre seule au centre, ou faut-il organiser, expliquer ou être accompagnée ?"
              descWo="Man nga dem sama bopp ci centre bi, walla war nga waajal, firi walla am ku and ak yaw ?"
              options={MOBILITY_OPTIONS}
              value={mobility}
              onChange={setMobility}
              wo={wo}
            />
            <Pressable style={[styles.nextBtn, !canStep3 && styles.nextBtnDisabled]} onPress={() => canStep3 && setStep(4)}>
              <Text style={styles.nextText}>{wo ? 'Kontine' : 'Continuer'}</Text>
              <Feather name="chevron-right" size={16} color="#fff" />
            </Pressable>
          </View>
        ) : null}

        {step === 4 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {wo ? 'Bu consultation mën a am, ci ban xaalis nga mën a agsi fa ?' : 'Quand une consultation devient possible, dans quelles conditions peux-tu vraiment y accéder ?'}
            </Text>
            <Text style={styles.sectionDesc}>
              {wo ? 'Lii dafa xool accès bi ci boppam: ndax am na ndigël, ndax man nga wax ci sutura, ak ban ndimbal nga gëna soxla' : 'On regarde ici l’accès autorisé à la consultation, la possibilité de parler en privé avec le personnel de santé, et le type d’appui qui t’aiderait le plus'}
            </Text>
            <QuestionBlock
              titleFr="Accès autorisé à la consultation"
              titleWo="Accès bu ñu nangu ci consultation"
              descFr="Peux-tu choisir seule quand et où consulter, ou cela dépend-il d’un accord ?"
              descWo="Man nga tànn sama bopp kañ ak fu ngay consulter, walla dafa aju ci nangu ?"
              options={CONSULT_ACCESS_OPTIONS}
              value={consultAccess}
              onChange={setConsultAccess}
              wo={wo}
            />
            <QuestionBlock
              titleFr="Parole privée pendant la consultation"
              titleWo="Waxtaan wu sutura ci consultation"
              descFr="Une fois sur place, peux-tu vraiment parler seule et poser les questions sensibles ?"
              descWo="Bu nga agsee, man nga wax sama bopp te laaj laaj yu jafe yi ?"
              options={PRIVATE_TALK_OPTIONS}
              value={privateTalk}
              onChange={setPrivateTalk}
              wo={wo}
            />
            <QuestionBlock
              titleFr="Appui le plus utile maintenant"
              titleWo="Ndimbal bi gëna am solo léegi"
              descFr="Quel levier t’aiderait le plus à garder la main et à avancer avec plus de sécurité ?"
              descWo="Ban ndimbal moo la gëna dimbali ngir nga am doole ak sutura ?"
              options={ACCESS_OPTIONS}
              value={access}
              onChange={setAccess}
              wo={wo}
            />

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
    gap: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.deepGreen },
  sectionDesc: { fontSize: 12, color: 'rgba(74,47,39,0.7)', lineHeight: 18 },
  topicBlock: { gap: 8 },
  topicTitle: { fontSize: 13, fontWeight: '700', color: COLORS.copper },
  topicDesc: { fontSize: 12, color: 'rgba(74,47,39,0.72)', lineHeight: 18 },
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
