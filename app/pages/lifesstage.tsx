/**
 * LifeStageDetail page — Figma → React Native conversion
 * Dynamic route: /pages/lifestage-detail/[stage]
 * stage = 'young' | 'pregnant' | 'mature'
 *
 */
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { LifeStagePoster } from '../../components/article/LifeStagePoster';
import { useApp } from '../../context/appcontext';
import { ARTICLES, type Article } from '../../data/articles';
import { useSpeak } from '../../hooks/usespeak';

type StageKey = 'young' | 'pregnant' | 'mature';

const BASE = {
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  gold: '#D4AF37',
  sand: '#D4A853',
};

// ---------------------------------------------------------------------------
// Stage data
// ---------------------------------------------------------------------------
const STAGE_DATA: Record<
  StageKey,
  {
    label: string; labelWo: string;
    sub: string; subWo: string;
    color: string;
    activities: { icon: string; iconSet: 'feather' | 'mci'; title: string; titleWo: string; desc: string; descWo: string }[];
    sports: { name: string; nameWo: string; icon: string; iconSet: 'feather' | 'mci'; note: string; noteWo: string }[];
    myths: { myth: string; mythWo: string; truth: string; truthWo: string }[];
    tips: { icon: string; iconSet: 'feather' | 'mci'; title: string; titleWo: string; desc: string; descWo: string }[];
  }
> = {
  young: {
    label: 'Découverte',
    labelWo: 'Sëttali',
    sub: 'Corps, émotions et premières explorations',
    subWo: 'Yëgël sa xam-xam ci yow',
    color: '#C17F3B',
    activities: [
      { icon: 'heart', iconSet: 'feather', title: 'Écoute de soi', titleWo: 'Dégante sa boppam', desc: 'Apprends à reconnaître les émotions et les signaux de ton corps.', descWo: 'Xam sa yëgëm ak xamnaa sa yaram.' },
      { icon: 'book-open', iconSet: 'feather', title: 'Éducation sexuelle', titleWo: 'Jàngale ci yëgëm', desc: 'Comprendre la physiologie, le consentement et les relations saines.', descWo: 'Xam réewum yaram, dëggël ak waxataane bu baax.' },
      { icon: 'shield', iconSet: 'feather', title: 'Prévention IST', titleWo: 'Jiitu IST', desc: 'Méthodes de protection et dépistage régulier.', descWo: 'Yëgël jiitu ak gis-gis ci bi yëgg.' },
    ],
    sports: [
      { name: 'Yoga', nameWo: 'Yoga', icon: 'activity', iconSet: 'feather', note: 'Flexibilité et conscience corporelle', noteWo: 'Xam sa yaram ci kanam' },
      { name: 'Danse', nameWo: 'Tànk', icon: 'music', iconSet: 'feather', note: 'Expression et connexion', noteWo: 'Bàyyi sa xol jàppanti' },
      { name: 'Course à pied', nameWo: 'Daw', icon: 'activity', iconSet: 'feather', note: 'Endurance et libération d\'endorphines', noteWo: 'Teggin ak yaram bu dëgg' },
    ],
    myths: [
      { myth: 'Le premier rapport est toujours douloureux.', mythWo: 'Sax bu njëkk dafa metti.', truth: 'Avec le bon partenaire et de la préparation, ce n\'est pas nécessairement le cas.', truthWo: 'Ak partenaire bi baax ak dëggël, dafa mën fàttal.' },
      { myth: 'L\'hymen prouve la virginité.', mythWo: 'Hymen dafa wone jëfandikoo.', truth: 'L\'hymen peut varier naturellement et n\'est pas un indicateur fiable.', truthWo: 'Hymen dafa soppi ak yaram te du xewël dëgg.' },
    ],
    tips: [
      { icon: 'moon', iconSet: 'feather', title: 'Suivi du cycle', titleWo: 'Xool sa cycle', desc: 'Apprenez à connaître les phases de votre cycle menstruel.', descWo: 'Jàng ci xewël sa yaram ci kàddu.' },
      { icon: 'heart', iconSet: 'feather', title: 'Consentement', titleWo: 'Dëggël', desc: 'Comprendre et communiquer ses limites et désirs.', descWo: 'Xam te wax sa dëgg ak sa dëkk.' },
    ],
  },
  pregnant: {
    label: 'Maternité',
    labelWo: 'Yaay',
    sub: 'Grossesse, naissance et post-partum',
    subWo: 'Gàtt, wuute ak ginnaaw doom',
    color: '#8B6E6E',
    activities: [
      { icon: 'heart', iconSet: 'feather', title: 'Suivi prénatal', titleWo: 'Gis-gis ci kanam', desc: 'Consultations régulières et surveillance de la santé maternelle.', descWo: 'Gis-gis yu dëgëër ak control ci wér yaay.' },
      { icon: 'activity', iconSet: 'feather', title: 'Préparation à la naissance', titleWo: 'Dëggël wuute', desc: 'Techniques de respiration, massage et préparation mentale.', descWo: 'Yëgël émul, pétrissage ak dëggël xol.' },
      { icon: 'shield', iconSet: 'feather', title: 'Nutrition prénatale', titleWo: 'Lekk bu baax', desc: 'Alimentation équilibrée et suppléments recommandés.', descWo: 'Lekk yu dëgëër ak compléments yu jëm.' },
    ],
    sports: [
      { name: 'Yoga prénatal', nameWo: 'Yoga ci gàtt', icon: 'activity', iconSet: 'feather', note: 'Adapté aux trimestres', noteWo: 'Dëggël ci kàddu yi' },
      { name: 'Natation', nameWo: 'Daaw', icon: 'droplets', iconSet: 'feather', note: 'Faible impact, très bénéfique', noteWo: 'Dafa baax lool ak yaram' },
      { name: 'Marche douce', nameWo: 'Dem-dem bu xollu', icon: 'compass', iconSet: 'feather', note: 'Circulation et bien-être', noteWo: 'Dëllu demm ak teggin' },
    ],
    myths: [
      { myth: 'Il faut manger pour deux.', mythWo: 'Faar nañu lekk ngir ñaar.', truth: 'La qualité prime sur la quantité — 300 kcal supplémentaires suffisent.', truthWo: 'Baax bi ko gëna ko mbër — 300 kcal ci kanam ak.' },
      { myth: 'Le sport est dangereux pendant la grossesse.', mythWo: 'Spor dafa xam-xam ci gàtt.', truth: 'L\'activité physique modérée est généralement bénéfique.', truthWo: 'Jëf bu dëgëër dafa baax lool.' },
    ],
    tips: [
      { icon: 'book-open', iconSet: 'feather', title: 'Plan de naissance', titleWo: 'Plan wuute', desc: 'Préparez vos souhaits pour l\'accouchement avec votre équipe médicale.', descWo: 'Dëggël sa bëgg ci wuute ak dokteur yi.' },
      { icon: 'heart', iconSet: 'feather', title: 'Soutien post-partum', titleWo: 'Ndimbal ginnaaw doom', desc: 'Ressources pour le baby-blues et la dépression post-partum.', descWo: 'Ndimbal ci baby-blues ak dépression ginnaaw doom.' },
    ],
  },
  mature: {
    label: 'Plénitude',
    labelWo: 'Sellal',
    sub: 'Ménopause, sagesse et épanouissement',
    subWo: 'Ménopause, xam-xam ak bàyyeef',
    color: '#5C7C6B',
    activities: [
      { icon: 'activity', iconSet: 'feather', title: 'Gestion des symptômes', titleWo: 'Xaar xewël yi', desc: 'Bouffées de chaleur, troubles du sommeil et solutions naturelles.', descWo: 'Tangal, wacc nataal ak dëggër yi ci kanam.' },
      { icon: 'heart', iconSet: 'feather', title: 'Santé osseuse', titleWo: 'Wér si buur yi', desc: 'Prévention de l\'ostéoporose par l\'alimentation et l\'exercice.', descWo: 'Jiitu ostéoporose ak lekk ak jëf.' },
      { icon: 'shield', iconSet: 'feather', title: 'Santé cardiovasculaire', titleWo: 'Wér jant bi', desc: 'Suivi tensionnel, cholestérol et mode de vie sain.', descWo: 'Gis-gis tension, cholestérol ak wer bu baax.' },
    ],
    sports: [
      { name: 'Pilates', nameWo: 'Pilates', icon: 'activity', iconSet: 'feather', note: 'Force, posture et équilibre', noteWo: 'Dëgg, position ak equilibre' },
      { name: 'Qi Gong', nameWo: 'Qi Gong', icon: 'wind', iconSet: 'feather', note: 'Énergie et sérénité', noteWo: 'Teggin ak jàmm' },
      { name: 'Randonnée', nameWo: 'Dem wàll', icon: 'compass', iconSet: 'feather', note: 'Impact modéré, santé globale', noteWo: 'Dëgëër ak wer bu kanam' },
    ],
    myths: [
      { myth: 'La ménopause marque la fin de la sexualité.', mythWo: 'Ménopause doxu fenn ci yëgëm.', truth: 'La vie sexuelle peut rester épanouissante après la ménopause.', truthWo: 'Yëgëm mën dem bu baax ginnaaw ménopause.' },
      { myth: 'Les hormones sont dangereuses.', mythWo: 'Hormon yi dañu xam-xam.', truth: 'Les traitements hormonaux modernes sont sûrs pour la plupart des femmes.', truthWo: 'Traitement hormon yu dëgg yi dañu baax ngir arti dëkk.' },
    ],
    tips: [
      { icon: 'sun', iconSet: 'feather', title: 'Vitamine D & Calcium', titleWo: 'Vitamine D & Calcium', desc: 'Essentiels pour les os et l\'humeur à cette étape.', descWo: 'Dafa waral ngir buur yi ak xol ci kàddu bi.' },
      { icon: 'moon', iconSet: 'feather', title: 'Hygiène du sommeil', titleWo: 'Wer ci nataal', desc: 'Routine apaisante pour mieux dormir malgré les bouffées de chaleur.', descWo: 'Routine douce ngir nataal ak tangal yi.' },
    ],
  },
};

function SectionIcon({ icon, iconSet, color, size = 16 }: { icon: string; iconSet: 'feather' | 'mci'; color: string; size?: number }) {
  if (iconSet === 'mci') return <MaterialCommunityIcons name={icon as any} size={size} color={color} />;
  return <Feather name={icon as any} size={size} color={color} />;
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function LifeStageDetailScreen() {
  const router = useRouter();
  const rawParams = useLocalSearchParams();
  const stageParam = typeof rawParams.stage === 'string' ? rawParams.stage : 'young';
  const stage: StageKey = ['young', 'pregnant', 'mature'].includes(stageParam)
    ? (stageParam as StageKey)
    : 'young';

  const { language, oralMode } = useApp();
  const { speak, stop } = useSpeak();
  const wo = language === 'wo';
  const data = STAGE_DATA[stage];

  const stageArticles: Article[] = ARTICLES.filter(
    (a) => a.stage === stage,
  ).slice(0, 4);

  const stageSummary = React.useMemo(() => {
    const topActivities = (wo ? data.activities.map((item) => item.titleWo) : data.activities.map((item) => item.title))
      .slice(0, 3)
      .join(', ');
    const topTips = (wo ? data.tips.map((item) => item.titleWo) : data.tips.map((item) => item.title))
      .slice(0, 2)
      .join(', ');

    if (wo) {
      return `${data.labelWo}. ${data.subWo}. Jëfandikoo yi: ${topActivities}. Digalante yi: ${topTips}.`;
    }

    return `${data.label}. ${data.sub}. Activites recommandees: ${topActivities}. Conseils pratiques: ${topTips}.`;
  }, [data, wo]);

  React.useEffect(() => stop, [stop]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero */}
        <View style={{ height: 200 }}>
          <LifeStagePoster title="" stage={stage} height={200} />
          <View style={styles.heroOverlay} />
          {/* Back */}
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={20} color="white" />
          </Pressable>
          {/* Stage label */}
          <View style={styles.heroLabel}>
            <Text style={styles.heroLabelText}>{wo ? data.labelWo : data.label}</Text>
            <Text style={styles.heroSub}>{wo ? data.subWo : data.sub}</Text>
          </View>
          {/* Oral mode button */}
          {oralMode && (
            <Pressable
              onPress={() => speak(stageSummary)}
              style={styles.oralBtn}
              accessibilityRole="button"
              accessibilityLabel={wo ? 'Lire le resume de cette etape' : 'Lire le resume de cette etape'}
            >
              <Feather name="volume-2" size={16} color="white" />
            </Pressable>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>

          {/* ── Activities ── */}
          <Section
            title={wo ? 'Jëfandikoo bi' : 'Activités recommandées'}
            icon="activity"
            iconSet="feather"
            color={data.color}
            onSpeakSection={() =>
              speak(
                wo
                  ? `${data.labelWo}. Jefandikoo yi: ${data.activities
                      .map((act) => `${act.titleWo}. ${act.descWo}`)
                      .join(' ')}`
                  : `${data.label}. Activites recommandees: ${data.activities
                      .map((act) => `${act.title}. ${act.desc}`)
                      .join(' ')}`
              )
            }
          >
            {data.activities.map((act, i) => (
              <View key={i} style={styles.listCard}>
                <View style={[styles.listCardIcon, { backgroundColor: `${data.color}15` }]}>
                  <SectionIcon icon={act.icon} iconSet={act.iconSet} color={data.color} size={18} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listCardTitle}>{wo ? act.titleWo : act.title}</Text>
                  <Text style={styles.listCardDesc}>{wo ? act.descWo : act.desc}</Text>
                </View>
              </View>
            ))}
          </Section>

          {/* ── Sports ── */}
          <Section
            title={wo ? 'Spor yu jëm' : 'Sports adaptés'}
            icon="dumbbell"
            iconSet="mci"
            color={data.color}
            onSpeakSection={() =>
              speak(
                wo
                  ? `Spor yu jem: ${data.sports.map((sp) => `${sp.nameWo}. ${sp.noteWo}`).join(' ')}`
                  : `Sports adaptes: ${data.sports.map((sp) => `${sp.name}. ${sp.note}`).join(' ')}`
              )
            }
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sportRow}
            >
              {data.sports.map((sp, i) => (
                <View key={i} style={styles.sportCard}>
                  <SectionIcon icon={sp.icon} iconSet={sp.iconSet} color={data.color} size={20} />
                  <Text style={styles.sportName}>{wo ? sp.nameWo : sp.name}</Text>
                  <Text style={styles.sportNote}>{wo ? sp.noteWo : sp.note}</Text>
                </View>
              ))}
            </ScrollView>
          </Section>

          {/* ── Myths ── */}
          <Section
            title={wo ? 'Xeet yu yees' : 'Démystification'}
            icon="alert-triangle"
            iconSet="feather"
            color={BASE.terracotta}
            onSpeakSection={() =>
              speak(
                wo
                  ? `Xeet yu yees: ${data.myths
                      .map((item) => `Xel mu dul dëgg: ${item.mythWo}. Dëgg mooy: ${item.truthWo}`)
                      .join(' ')}`
                  : `Demystification: ${data.myths
                      .map((item) => `Mythe: ${item.myth}. Verite: ${item.truth}`)
                      .join(' ')}`
              )
            }
          >
            {data.myths.map((m, i) => (
              <View key={i} style={styles.mythCard}>
                <View style={styles.mythHeader}>
                  <Feather name="x" size={14} color={BASE.terracotta} />
                  <Text style={styles.mythText}>{wo ? m.mythWo : m.myth}</Text>
                </View>
                <View style={styles.truthRow}>
                  <Feather name="check" size={14} color={BASE.deepGreen} />
                  <Text style={styles.truthText}>{wo ? m.truthWo : m.truth}</Text>
                </View>
              </View>
            ))}
          </Section>

          {/* ── Tips ── */}
          <Section
            title={wo ? 'Liggéey yu baax' : 'Conseils pratiques'}
            icon="lightbulb-outline"
            iconSet="mci"
            color={BASE.gold}
            onSpeakSection={() =>
              speak(
                wo
                  ? `Digalante yi: ${data.tips.map((tip) => `${tip.titleWo}. ${tip.descWo}`).join(' ')}`
                  : `Conseils pratiques: ${data.tips.map((tip) => `${tip.title}. ${tip.desc}`).join(' ')}`
              )
            }
          >
            {data.tips.map((tip, i) => (
              <View key={i} style={[styles.tipCard, { borderLeftColor: data.color }]}>
                <View style={[styles.tipIconWrap, { backgroundColor: `${data.color}12` }]}>
                  <SectionIcon icon={tip.icon} iconSet={tip.iconSet} color={data.color} size={18} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tipTitle}>{wo ? tip.titleWo : tip.title}</Text>
                  <Text style={styles.tipDesc}>{wo ? tip.descWo : tip.desc}</Text>
                </View>
              </View>
            ))}
          </Section>

          {/* ── Related articles ── */}
          {stageArticles.length > 0 && (
            <Section
              title={wo ? 'Jàngale yu am' : 'Articles liés'}
              icon="book-open"
              iconSet="feather"
              color={BASE.deepGreen}
              onSpeakSection={() =>
                speak(
                  wo
                    ? `Jangale yu am: ${stageArticles.map((article) => article.titleWo).join(', ')}`
                    : `Articles lies: ${stageArticles.map((article) => article.title).join(', ')}`
                )
              }
            >
              {stageArticles.map((article) => (
                <Pressable
                  key={article.id}
                  onPress={() => router.push(`/bibliotheque/${article.id}` as any)}
                  style={styles.relatedCard}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.relatedTitle}>{wo ? article.titleWo : article.title}</Text>
                    <View style={styles.relatedMeta}>
                      <Feather name="clock" size={10} color={`${BASE.cocoa}60`} />
                      <Text style={styles.relatedTime}>{article.readTime}</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={16} color={`${BASE.cocoa}40`} />
                </Pressable>
              ))}
            </Section>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Generic section wrapper
// ---------------------------------------------------------------------------
function Section({
  title, icon, iconSet, color, children, onSpeakSection,
}: {
  title: string;
  icon: string;
  iconSet: 'feather' | 'mci';
  color: string;
  children: React.ReactNode;
  onSpeakSection?: () => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderMain}>
          <View style={[styles.sectionIconWrap, { backgroundColor: `${color}15` }]}>
            {iconSet === 'mci'
              ? <MaterialCommunityIcons name={icon as any} size={16} color={color} />
              : <Feather name={icon as any} size={16} color={color} />}
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {onSpeakSection ? (
          <Pressable onPress={onSpeakSection} style={styles.sectionSpeakBtn}>
            <Feather name="volume-2" size={14} color={color} />
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDFAF5' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26,60,52,0.45)' },
  backBtn: {
    position: 'absolute', top: 16, left: 20,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  oralBtn: {
    position: 'absolute', top: 16, right: 20,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  heroLabel: {
    position: 'absolute', bottom: 20, left: 24, right: 24,
  },
  heroLabelText: { fontSize: 28, fontWeight: '700', color: 'white' },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  content: { padding: 24, gap: 8 },

  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionHeaderMain: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, paddingRight: 10 },
  sectionIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: BASE.deepGreen },
  sectionSpeakBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  listCard: {
    flexDirection: 'row', gap: 14, marginBottom: 12,
    backgroundColor: 'white', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#0F3D2E', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  listCardIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  listCardTitle: { fontSize: 14, fontWeight: '600', color: BASE.deepGreen, marginBottom: 3 },
  listCardDesc: { fontSize: 12, color: `${BASE.cocoa}70`, lineHeight: 18 },

  sportRow: { gap: 12, paddingBottom: 4 },
  sportCard: {
    width: 130, backgroundColor: 'white', borderRadius: 16, padding: 14,
    alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#0F3D2E', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  sportName: { fontSize: 13, fontWeight: '600', color: BASE.deepGreen, textAlign: 'center' },
  sportNote: { fontSize: 10, color: `${BASE.cocoa}60`, textAlign: 'center', lineHeight: 14 },

  mythCard: {
    backgroundColor: 'white', borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
  },
  mythHeader: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  mythText: {
    flex: 1, fontSize: 13, color: BASE.terracotta, fontWeight: '500',
    textDecorationLine: 'line-through', lineHeight: 18,
  },
  truthRow: { flexDirection: 'row', gap: 8, paddingLeft: 4 },
  truthText: { flex: 1, fontSize: 13, color: BASE.deepGreen, lineHeight: 18 },

  tipCard: {
    flexDirection: 'row', gap: 12, marginBottom: 10,
    backgroundColor: 'white', borderRadius: 16, padding: 14,
    borderLeftWidth: 3,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#0F3D2E', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  tipIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  tipTitle: { fontSize: 13, fontWeight: '600', color: BASE.deepGreen, marginBottom: 3 },
  tipDesc: { fontSize: 12, color: `${BASE.cocoa}70`, lineHeight: 18 },

  relatedCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'white', borderRadius: 14, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
  },
  relatedTitle: { fontSize: 13, fontWeight: '500', color: BASE.deepGreen, marginBottom: 4 },
  relatedMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  relatedTime: { fontSize: 10, color: `${BASE.cocoa}60` },
});
