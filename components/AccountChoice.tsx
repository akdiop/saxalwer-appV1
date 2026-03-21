
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const COLORS = {
  beige: '#F5F1E6',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  sandBeige: '#E8DCC8',
  gold: '#D4A574',
};

type Props = {
  language: 'fr' | 'wo';
  onCreateAccount: () => void;
  onContinueAsGuest: () => void;
  onBack?: () => void;
};

export function AccountChoice({ language, onCreateAccount, onContinueAsGuest, onBack }: Props) {
  const wo = language === 'wo';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Decorative patterns */}
      <View style={styles.bgDecor1} pointerEvents="none" />
      <View style={styles.bgDecor2} pointerEvents="none" />

      {/* Back button */}
      {onBack && (
        <Pressable
          onPress={onBack}
          style={styles.backBtn}
          android_ripple={{ color: COLORS.cocoa + '15', borderless: true }}
        >
          <Feather name="chevron-left" size={20} color={COLORS.deepGreen} />
        </Pressable>
      )}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Logo & Title Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Feather name="heart" size={36} color={COLORS.terracotta} />
            <View style={styles.logoDashed} />
          </View>
          <Text style={styles.appName}>SaxalWér</Text>
          <Text style={styles.subtitle}>
            {wo ? 'Tëral bu sutura ngir xam sa yaram' : 'Un espace discret pour comprendre ton corps'}
          </Text>
        </View>

        {/* Description Card */}
        <View style={styles.descCard}>
          <View style={styles.descRow}>
            <View style={styles.descIconBox}>
              <Feather name="star" size={20} color={COLORS.deepGreen} />
            </View>
            <Text style={styles.descText}>
              {wo
                ? 'Mën nga sos sa tëral bu boroom walla xool appli bi ci sa jëkk.'
                : 'Tu peux créer un espace personnel ou explorer librement l\'application.'}
            </Text>
          </View>
          <View style={styles.benefitsList}>
            <BenefitItem
              icon="lock"
              text={wo ? 'Sama xam-xam dañu ko sutura' : 'Tes données restent privées'}
              color={COLORS.deepGreen}
            />
            <BenefitItem
              icon="heart"
              text={wo ? 'Ñu def ko ngir yéeneen jigéen' : 'Conçu pour les femmes africaines'}
              color={COLORS.terracotta}
            />
            <BenefitItem
              icon="eye"
              text={wo ? 'Mode sutura amul' : 'Mode discret disponible'}
              color={COLORS.copper}
            />
          </View>
        </View>

        <View style={{ flex: 1, minHeight: 20 }} />

        {/* Buttons */}
        <View style={styles.btnsCol}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={onCreateAccount}
            android_ripple={{ color: COLORS.deepGreen + '35' }}
          >
            <Feather name="user-plus" size={22} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.primaryBtnText}>
              {wo ? 'Sos konte' : 'Créer un compte'}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={onContinueAsGuest}
            android_ripple={{ color: COLORS.copper + '25' }}
          >
            <Feather name="eye-off" size={22} color={COLORS.copper} style={{ marginRight: 10 }} />
            <Text style={styles.secondaryBtnText}>
              {wo ? 'Jàpp ci mode sutura' : 'Continuer en mode discret'}
            </Text>
          </Pressable>
          <Text style={styles.helperText}>
            {wo ? 'Amul lu faral' : 'Aucun compte nécessaire'}
          </Text>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function BenefitItem({ icon, text, color }: { icon: keyof typeof Feather.glyphMap; text: string; color: string }) {
  return (
    <View style={styles.benefitRow}>
      <View style={[styles.benefitIconBox, { backgroundColor: color + '12' }]}> 
        <Feather name={icon} size={14} color={color} />
      </View>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

export default AccountChoice;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.beige,
  },
  bgDecor1: {
    position: 'absolute',
    top: -100, right: -100,
    width: 300, height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.terracotta + '15',
    zIndex: 0,
  },
  bgDecor2: {
    position: 'absolute',
    bottom: -80, left: -80,
    width: 250, height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.deepGreen + '12',
    zIndex: 0,
  },
  scroll: {
    flexGrow: 1,
    flexDirection: 'column',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 32,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
    zIndex: 10,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 32 : 20,
    left: 16,
    zIndex: 1001,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.cocoa + '15',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.terracotta + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
    shadowColor: COLORS.terracotta,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 4,
  },
  logoDashed: {
    position: 'absolute',
    top: -8, left: -8, right: -8, bottom: -8,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: COLORS.copper + '30',
    borderStyle: 'dashed',
  },
  appName: {
    fontFamily: Platform.OS === 'ios' ? 'CormorantGaramond-Bold' : 'serif',
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.deepGreen,
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: COLORS.cocoa + '08',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 17,
    color: COLORS.cocoa,
    fontWeight: '500',
    lineHeight: 22,
    maxWidth: 300,
    textAlign: 'center',
    opacity: 0.85,
    marginBottom: 0,
  },
  descCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 32,
    shadowColor: COLORS.cocoa,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.copper + '10',
  },
  descRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  descIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.deepGreen + '10',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  descText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.cocoa,
    flex: 1,
  },
  benefitsList: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 20,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  benefitText: {
    fontSize: 13,
    color: COLORS.cocoa,
    opacity: 0.85,
    flex: 1,
  },
  btnsCol: {
    flexDirection: 'column',
    gap: 16,
    marginTop: 8,
    marginBottom: 0,
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: COLORS.deepGreen,
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 0,
    shadowColor: COLORS.deepGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 3,
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: COLORS.copper + '25',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 0,
    shadowColor: COLORS.cocoa,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 1,
  },
  secondaryBtnText: {
    color: COLORS.cocoa,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  helperText: {
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.cocoa + '60',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
