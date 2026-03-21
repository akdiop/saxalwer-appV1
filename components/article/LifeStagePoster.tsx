import { StyleSheet, Text, View } from 'react-native';

export type ArticleStage = 'young' | 'pregnant' | 'mature';

type LifeStagePosterProps = {
  title?: string;
  stage: ArticleStage;
  height?: number;
};

const STAGE_COLORS: Record<ArticleStage, { bg: string; accent: string }> = {
  young: { bg: '#1A3C34', accent: '#D4AF37' },
  pregnant: { bg: '#A65D40', accent: '#F2C66D' },
  mature: { bg: '#4A2F27', accent: '#D4AF37' },
};

const STAGE_LABEL: Record<ArticleStage, string> = {
  young: 'Jeune femme',
  pregnant: 'Maternité',
  mature: 'Ménopause',
};

export function LifeStagePoster({ title, stage, height = 280 }: LifeStagePosterProps) {
  const theme = STAGE_COLORS[stage];

  return (
    <View style={[styles.container, { height, backgroundColor: theme.bg }]}> 
      <View style={[styles.circleOne, { borderColor: `${theme.accent}66` }]} />
      <View style={[styles.circleTwo, { borderColor: `${theme.accent}55` }]} />
      <View style={[styles.blob, { backgroundColor: `${theme.accent}55` }]} />

      <View style={styles.content}>
        <Text style={styles.stageText}>{STAGE_LABEL[stage]}</Text>
        {!!title && <Text style={styles.titleText}>{title}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  circleOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    right: -40,
    top: -30,
    borderWidth: 2,
  },
  circleTwo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    left: -30,
    bottom: -25,
    borderWidth: 2,
  },
  blob: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    right: 40,
    bottom: 30,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  stageText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  titleText: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    maxWidth: '75%',
  },
});

export default LifeStagePoster;
