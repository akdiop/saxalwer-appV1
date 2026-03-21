import { Feather } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/appcontext';

const BASE = {
  beige: '#F5F1E6',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
};

export default function NotFoundScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useApp();
  const wo = language === 'wo';

  React.useEffect(() => {
    const path = (pathname || '').toLowerCase();
    if (path.includes('onbording')) {
      router.replace('/onboarding' as any);
      return;
    }
    if (path.includes('accueil')) {
      router.replace('/' as any);
    }
  }, [pathname, router]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Feather name="alert-circle" size={52} color="white" />
        </View>

        <Text style={styles.title}>{wo ? 'Bereb bii amul' : 'Page introuvable'}</Text>
        <Text style={styles.desc}>
          {wo
            ? 'Bereb bii nga seet amul walla yoonewul.'
            : "La page que tu cherches n'existe pas ou a été déplacée."}
        </Text>

        <View style={styles.pathBox}>
          <Text style={styles.pathText}>{pathname || '/'}</Text>
        </View>

        <Text style={styles.hint}>
          {wo ? 'Seetlu ci ker gi walla dellu ci page bu njekk bi.' : "Retourne à l'accueil ou à la page précédente."}
        </Text>

        <View style={styles.actions}>
          <Pressable onPress={() => router.replace('/' as any)} style={styles.primaryBtn}>
            <Feather name="home" size={18} color="white" />
            <Text style={styles.primaryText}>{wo ? 'Dellu ci ker gi' : "Retour à l'accueil"}</Text>
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.secondaryBtn}>
            <Feather name="search" size={18} color={BASE.deepGreen} />
            <Text style={styles.secondaryText}>{wo ? 'Dellu ci njekk bi' : 'Page précédente'}</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          {wo ? 'Su jafe bi doole, jox leen ci ndimbalante bi' : 'Si le problème persiste, contacte le support'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BASE.beige },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  badge: {
    width: 116,
    height: 116,
    borderRadius: 32,
    backgroundColor: BASE.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#1A3C34',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
    color: BASE.deepGreen,
    textAlign: 'center',
    marginBottom: 10,
  },
  desc: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(74,47,39,0.82)',
    textAlign: 'center',
    marginBottom: 16,
  },
  pathBox: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: 'rgba(166,93,64,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.28)',
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  pathText: {
    color: BASE.copper,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  hint: {
    color: 'rgba(74,47,39,0.72)',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  actions: { width: '100%', gap: 10 },
  primaryBtn: {
    borderRadius: 16,
    backgroundColor: BASE.deepGreen,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryText: { color: 'white', fontWeight: '700', fontSize: 15 },
  secondaryBtn: {
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'rgba(181,98,42,0.35)',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryText: { color: BASE.deepGreen, fontWeight: '700', fontSize: 15 },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    textAlign: 'center',
    color: 'rgba(74,47,39,0.5)',
    fontSize: 12,
  },
});
