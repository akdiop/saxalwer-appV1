import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '../../constants/colors';
import { Fonts } from '../../constants/theme';

const LOGO_MARK = require('../../assets/brand/SAXALWER_Logo_fond-transparent.png');

type SaxalPageProps = {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
};

type SaxalPageHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
};

type SaxalHeroCardProps = {
  badge?: string;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  variant?: 'deep' | 'light';
};

export function SaxalPage({
  children,
  contentContainerStyle,
  innerStyle,
  maxWidth = 1180,
}: SaxalPageProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1024;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <View pointerEvents="none" style={styles.watermarkLayer}>
          <Image
            source={LOGO_MARK}
            resizeMode="contain"
            style={[styles.watermark, isWide && styles.watermarkWide]}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        >
          <View style={[styles.inner, { maxWidth }, innerStyle]}>{children}</View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export function SaxalPageHeading({
  eyebrow,
  title,
  subtitle,
  onBack,
  rightSlot,
}: SaxalPageHeadingProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 820;

  return (
    <View style={[styles.header, isCompact && styles.headerCompact]}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.backButton} accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color={colors.deepGreen} />
        </Pressable>
      ) : null}

      <View style={styles.headerTextWrap}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={[styles.headerTitle, isCompact && styles.headerTitleCompact]}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      </View>

      {rightSlot ? (
        <View style={[styles.headerActions, isCompact && styles.headerActionsCompact]}>
          {rightSlot}
        </View>
      ) : null}
    </View>
  );
}

export function SaxalHeroCard({
  badge,
  title,
  description,
  footer,
  variant = 'deep',
}: SaxalHeroCardProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 820;
  const isLight = variant === 'light';

  return (
    <View style={[styles.heroCard, isLight ? styles.heroCardLight : styles.heroCardDeep]}>
      <View style={[styles.heroOrbLarge, isLight && styles.heroOrbLargeLight]} />
      <View style={[styles.heroOrbSmall, isLight && styles.heroOrbSmallLight]} />
      <View style={[styles.heroDot, isLight && styles.heroDotLight]} />

      {badge ? (
        <View style={[styles.heroBadge, isLight && styles.heroBadgeLight]}>
          <Text style={[styles.heroBadgeText, isLight && styles.heroBadgeTextLight]}>{badge}</Text>
        </View>
      ) : null}

      <Text
        style={[
          styles.heroTitle,
          isCompact && styles.heroTitleCompact,
          isLight && styles.heroTitleLight,
        ]}
      >
        {title}
      </Text>

      {description ? (
        <Text style={[styles.heroDescription, isLight && styles.heroDescriptionLight]}>
          {description}
        </Text>
      ) : null}

      {footer ? <View style={styles.heroFooter}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  root: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  watermarkLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermark: {
    width: 360,
    height: 360,
    opacity: 0.018,
  },
  watermarkWide: {
    width: 520,
    height: 520,
    opacity: 0.024,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },
  inner: {
    width: '100%',
    alignSelf: 'center',
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  headerCompact: {
    flexWrap: 'wrap',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
  },
  headerTextWrap: {
    flex: 1,
    gap: 6,
    paddingTop: 2,
    minWidth: 220,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.terracotta,
  },
  headerTitle: {
    color: colors.deepGreen,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '600',
    fontFamily: Fonts.serif,
  },
  headerTitleCompact: {
    fontSize: 32,
    lineHeight: 36,
  },
  headerSubtitle: {
    maxWidth: 700,
    color: 'rgba(74,47,39,0.72)',
    fontSize: 14,
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  headerActionsCompact: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  heroCard: {
    overflow: 'hidden',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderWidth: 1,
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.1,
    shadowRadius: 26,
    elevation: 6,
  },
  heroCardDeep: {
    backgroundColor: colors.deepGreen,
    borderColor: 'rgba(212,175,55,0.14)',
  },
  heroCardLight: {
    backgroundColor: '#FFF9F1',
    borderColor: 'rgba(166,93,64,0.14)',
  },
  heroOrbLarge: {
    position: 'absolute',
    top: -38,
    right: -36,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroOrbLargeLight: {
    borderColor: 'rgba(166,93,64,0.08)',
  },
  heroOrbSmall: {
    position: 'absolute',
    bottom: -24,
    left: -20,
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  heroOrbSmallLight: {
    borderColor: 'rgba(26,60,52,0.06)',
  },
  heroDot: {
    position: 'absolute',
    top: 36,
    right: 42,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroDotLight: {
    backgroundColor: 'rgba(166,93,64,0.05)',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroBadgeLight: {
    backgroundColor: 'rgba(166,93,64,0.08)',
  },
  heroBadgeText: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroBadgeTextLight: {
    color: colors.terracotta,
  },
  heroTitle: {
    maxWidth: 720,
    color: colors.white,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '600',
    fontFamily: Fonts.serif,
  },
  heroTitleCompact: {
    fontSize: 34,
    lineHeight: 39,
  },
  heroTitleLight: {
    color: colors.deepGreen,
  },
  heroDescription: {
    maxWidth: 760,
    marginTop: 10,
    color: 'rgba(255,255,255,0.74)',
    fontSize: 15,
    lineHeight: 25,
  },
  heroDescriptionLight: {
    color: 'rgba(74,47,39,0.72)',
  },
  heroFooter: {
    marginTop: 18,
  },
});
