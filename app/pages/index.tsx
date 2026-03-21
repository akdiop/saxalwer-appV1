import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useApp } from '../../context/appcontext';

const VALUE_CARDS = [
  {
    icon: '•',
    title: 'Confidentialité absolue',
  },
  {
    icon: '•',
    title: 'Accompagnement bienveillant',
  },
  {
    icon: '•',
    title: 'Informations fiables',
  },
];

export default function IndexScreen() {
  const router = useRouter();
  const { setConsent, setHasSeenWelcome, setLanguage } = useApp();
  const [selectedLanguage, setSelectedLanguage] = useState<'FRANCAIS' | 'WOLOF'>('FRANCAIS');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <Text style={styles.languagePrompt}>
            Choisis la langue dans laquelle tu es la plus à l&apos;aise.
          </Text>

          <View style={styles.languageRow}>
            <Pressable
              style={({ pressed }) => [
                styles.languageButton,
                selectedLanguage === 'FRANCAIS' && styles.languageButtonActive,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                setSelectedLanguage('FRANCAIS');
                setLanguage('fr');
              }}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.languageButtonText,
                  selectedLanguage === 'FRANCAIS' && styles.languageButtonTextActive,
                ]}
              >
                FRANÇAIS
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.languageButton,
                selectedLanguage === 'WOLOF' && styles.languageButtonActive,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                setSelectedLanguage('WOLOF');
                setLanguage('wo');
              }}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.languageButtonText,
                  selectedLanguage === 'WOLOF' && styles.languageButtonTextActive,
                ]}
              >
                WOLOF
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.logoCard}>
          <Image
            source={require('../assets/images/logo-saxalwer.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.heroTextBlock}>
          <Text style={styles.title}>SAXALWER</Text>
          <Text style={styles.subtitle}>Ton espace securise de sante reproductive</Text>
        </View>

        <View style={styles.privacyCard}>
          <Text style={styles.cardTitle}>Confidentialite et protection des donnees</Text>
          <Text style={styles.cardText}>
            Tes informations sont utilisees uniquement pour personnaliser les contenus de l&apos;application. Elles ne sont jamais partagees sans ton consentement.
          </Text>

          <Pressable
            style={({ pressed }) => [styles.checkboxRow, pressed && styles.pressed]}
            onPress={() => setAcceptedPrivacy((current) => !current)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: acceptedPrivacy }}
          >
            <View style={[styles.checkbox, acceptedPrivacy && styles.checkboxChecked]}>
              {acceptedPrivacy ? <View style={styles.checkboxInner} /> : null}
            </View>
            <Text style={styles.checkboxText}>J&apos;accepte les conditions de confidentialite</Text>
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Cette application fournit des informations generales sur la sante intime. Elle ne remplace pas une consultation medicale.
          </Text>
        </View>

        <View style={styles.valuesSection}>
          {VALUE_CARDS.map((item) => (
            <Pressable
              key={item.title}
              style={({ pressed }) => [styles.valueCard, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <View style={styles.valueIconWrap}>
                <Text style={styles.valueIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.valueTitle}>{item.title}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            !acceptedPrivacy && styles.primaryButtonDisabled,
            pressed && acceptedPrivacy && styles.pressed,
          ]}
          onPress={() => {
            if (acceptedPrivacy) {
              setConsent(true);
              setHasSeenWelcome();
              router.replace('/tutoriel' as any);
            }
          }}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>ENTRER DANS L&apos;ESPACE SAXALWER</Text>
        </Pressable>

        <Text style={styles.footerText}>Tu merites un espace qui te protege et s&apos;adapte à ta sensibilite</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F1E6',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 40,
    gap: 22,
  },
  topSection: {
    gap: 14,
  },
  languagePrompt: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4A2F27',
    textAlign: 'center',
  },
  languageRow: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#1A3C34',
    paddingVertical: 14,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#1A3C34',
  },
  languageButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A3C34',
    letterSpacing: 1,
  },
  languageButtonTextActive: {
    color: '#F5F1E6',
  },
  logoCard: {
    width: 144,
    height: 144,
    alignSelf: 'center',
    borderRadius: 72,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A3C34',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  logo: {
    width: 120,
    height: 120,
  },
  heroTextBlock: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: '#1A3C34',
    letterSpacing: 3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4A2F27',
    textAlign: 'center',
    maxWidth: 290,
  },
  privacyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    gap: 14,
    shadowColor: '#1A3C34',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A3C34',
    lineHeight: 24,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4A2F27',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#1A3C34',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#1A3C34',
  },
  checkboxInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5F1E6',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#4A2F27',
  },
  infoCard: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: '#FFF8F1',
    borderWidth: 1,
    borderColor: '#A65D4025',
  },
  infoText: {
    fontSize: 13,
    lineHeight: 21,
    color: '#4A2F27',
    textAlign: 'center',
  },
  valuesSection: {
    gap: 12,
  },
  valueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#E9DFCF',
  },
  valueIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F5F1E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueIcon: {
    fontSize: 20,
    lineHeight: 20,
    color: '#A65D40',
  },
  valueTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A3C34',
  },
  primaryButton: {
    marginTop: 4,
    borderRadius: 22,
    backgroundColor: '#1A3C34',
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#1A3C34',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 5,
  },
  primaryButtonDisabled: {
    backgroundColor: '#9BA6A2',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#F5F1E6',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#4A2F27',
    opacity: 0.55,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
