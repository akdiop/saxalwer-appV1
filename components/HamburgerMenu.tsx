import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

type HamburgerMenuProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (route: string) => void;
  discreteMode?: boolean;
  onToggleDiscrete?: () => void;
  oralMode?: boolean;
  onToggleOral?: () => void;
};

const C = {
  deepGreen: '#0F3D2E',
  beige: '#F5F1E6',
  terracotta: '#C26A3D',
  white: '#FDFAF5',
  cocoa: '#4A2F27',
  gold: '#D4AF37',
  copper: '#B5622A',
  muted: '#A7A7A7',
  red: '#C0392B',
  sage: '#7A8C5A',
};

const menuSections = [
  {
    title: 'PRINCIPAL',
    items: [
      { icon: <Feather name="home" size={22} color={C.deepGreen} />, label: 'Accueil', subtitle: 'Tableau de bord', route: '/' },
      { icon: <Feather name="message-square" size={22} color={C.deepGreen} />, label: 'Assistant IA', subtitle: 'Pose tes questions', route: '/chat' },
      { icon: <Feather name="bell" size={22} color={C.terracotta} />, label: 'Notifications', subtitle: 'Centre de notifications', route: '/notifications' },
      { icon: <Feather name="book-open" size={22} color={C.copper} />, label: 'Tutoriel', subtitle: 'Découvre comment utiliser l\'app', route: '/tutoriel' },
      { icon: <Feather name="headphones" size={22} color={C.copper} />, label: 'Écouter (audio)', subtitle: 'Contenus audio éducatifs', route: '/audio' },
    ],
  },
  {
    title: 'MON CYCLE & SANTÉ',
    items: [
      { icon: <Feather name="activity" size={22} color={C.terracotta} />, label: 'Suivi du Cycle', subtitle: 'Calendrier, phases & journal', route: '/suivi' },
      { icon: <Feather name="target" size={22} color={C.gold} />, label: 'Orientation Santé', subtitle: '14 questions, bilan personnalisé', route: '/orientation' },
      { icon: <Feather name="shield" size={22} color={C.sage} />, label: 'Orientation Sensible', subtitle: 'Évaluation confidentielle', route: '/orientation-sensible' },
      { icon: <Feather name="alert-triangle" size={22} color={C.red} />, label: "Numéros d'urgence", subtitle: 'Aide immédiate', route: '/urgence' },
    ],
  },
  {
    title: "TROUVER DE L'AIDE",
    items: [
      { icon: <Feather name="map-pin" size={22} color={C.copper} />, label: 'Centres de santé', subtitle: 'Centres au Sénégal', route: '/carte' },
      {
        icon: <MaterialCommunityIcons name="stethoscope" size={22} color={C.cocoa} />,
        label: 'Répertoire médecins',
        subtitle: 'Annuaire de professionnels',
        route: '/medecins',
      },
      {
        icon: <Feather name="list" size={22} color={C.deepGreen} />,
        label: 'Annuaire (à vérifier)',
        subtitle: 'Psychologue, soutien VBG, femme',
        route: '/annuaire',
      },
      {
        icon: <Feather name="heart" size={22} color={C.terracotta} />,
        label: 'Soutien & écoute',
        subtitle: 'VBG et santé mentale',
        route: '/soutien',
      },
    ],
  },
  {
    title: 'COMMUNAUTÉ',
    items: [
      { icon: <Feather name="users" size={22} color={C.copper} />, label: 'Espace discussion', subtitle: "Connecte-toi avec d'autres femmes", route: '/communaute' },
    ],
  },
  {
    title: 'MON ESPACE',
    items: [
      { icon: <Feather name="user" size={22} color={C.deepGreen} />, label: 'Mon Parcours', subtitle: 'Profil, favoris & paramètres', route: '/profil' },
      { icon: <Feather name="edit-3" size={22} color={C.cocoa} />, label: 'Journal intime', subtitle: 'Exprime-toi en toute sécurité', route: '/journal' },
      { icon: <Feather name="settings" size={22} color={C.cocoa} />, label: 'Modifier mon profil', subtitle: '', route: '/edit-profile' },
      { icon: <Feather name="heart" size={22} color={C.terracotta} />, label: 'Donner un avis', subtitle: '', route: '/feedback' },
      { icon: <Feather name="info" size={22} color={C.deepGreen} />, label: 'À propos', subtitle: '', route: '/about' },
      { icon: <Feather name="sliders" size={22} color={C.cocoa} />, label: 'Préférences', subtitle: 'Mode guidé/complet, discret', route: '/preferences' },
      { icon: <Feather name="bar-chart-2" size={22} color={C.terracotta} />, label: 'Profil numérique', subtitle: 'Autonomie & contexte', route: '/profil-numerique' },
    ],
  },
];

export default function HamburgerMenu({ isOpen = true, onClose, onNavigate, discreteMode, onToggleDiscrete, oralMode, onToggleOral }: HamburgerMenuProps) {
  if (!isOpen) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.panel}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuLogo}><Text style={{ color: C.deepGreen }}>Saxal</Text><Text style={{ color: C.terracotta }}>Wér</Text></Text>
          <Text style={styles.menuSlogan}>Ta santé, ta force</Text>
          <Pressable style={styles.menuCloseBtn} onPress={onClose}>
            <Feather name="x" size={22} color={C.cocoa} />
          </Pressable>
        </View>

        <View style={styles.switchBlock}>
          <View style={styles.switchRow}>
            <MaterialCommunityIcons name="weather-night" size={20} color={C.cocoa} style={{ marginRight: 8 }} />
            <Text style={styles.switchLabel}>Mode discret</Text>
            <View style={{ flex: 1 }} />
            <Switch value={!!discreteMode} onValueChange={onToggleDiscrete} trackColor={{ false: '#E6DED6', true: '#B5622A' }} thumbColor={discreteMode ? C.terracotta : '#FFF'} />
          </View>
          <View style={styles.switchRow}>
            <MaterialCommunityIcons name="headphones" size={20} color={C.cocoa} style={{ marginRight: 8 }} />
            <Text style={styles.switchLabel}>Mode écouter</Text>
            <View style={{ flex: 1 }} />
            <Switch value={!!oralMode} onValueChange={onToggleOral} trackColor={{ false: '#E6DED6', true: '#A7C2B6' }} thumbColor={oralMode ? C.deepGreen : '#FFF'} />
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          {menuSections.map((section) => (
            <View key={section.title} style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>{section.title}</Text>
              <View style={styles.menuCard}>
                {section.items.map((item) => (
                  <Pressable
                    key={item.label}
                    style={styles.menuItem}
                    onPress={() => {
                      onClose?.();
                      onNavigate?.(item.route);
                    }}
                  >
                    <View style={styles.menuIconWrap}>{item.icon}</View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.menuItemLabel}>{item.label}</Text>
                      {!!item.subtitle && <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>}
                    </View>
                    <Feather name="chevron-right" size={18} color={C.muted} />
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 60,
    justifyContent: 'flex-start',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 61, 46, 0.18)',
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    minHeight: '100%',
    backgroundColor: C.beige,
    paddingTop: Platform.OS === 'ios' ? 38 : 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  menuHeader: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E6DED6',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  menuLogo: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
    flex: 1,
  },
  menuSlogan: {
    position: 'absolute',
    left: 24,
    top: 36,
    fontSize: 14,
    color: C.cocoa,
    opacity: 0.6,
  },
  menuCloseBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F1E6',
    marginLeft: 8,
  },
  switchBlock: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: '#F5F1E6',
    gap: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F1E6',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 4,
  },
  switchLabel: {
    fontSize: 16,
    color: C.cocoa,
    fontWeight: '600',
  },
  menuSection: {
    marginTop: 18,
    paddingHorizontal: 18,
  },
  menuSectionTitle: {
    fontSize: 13,
    color: C.muted,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  menuCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    paddingVertical: 2,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F1E6',
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F5F1E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemLabel: {
    fontSize: 16,
    color: C.deepGreen,
    fontWeight: '700',
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: C.muted,
    fontWeight: '400',
    marginTop: 2,
  },
});
