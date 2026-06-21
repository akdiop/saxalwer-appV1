import React, { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HamburgerMenu from '../../components/HamburgerMenu';
import { HorizontalScroll } from '../../components/HorizontalScroll';
import LifeStagePoster from '../../components/LifeStagePoster';
import SensitiveContent from '../../components/SensitiveContent';
import { useApp, type QuickAccessId } from '../../context/appcontext';
import { GLOSSARY } from '../../data/glossary';
import { ARTICLES } from '../../data/articles';
import { getSituationTheme } from '../../utils/situationAdaptation';
import { getContextualMessage } from '../../utils/situationMessages';

const BASE = {
  beige: '#F5F1E6',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  gold: '#D4AF37',
  card: '#FFFFFF',
  border: '#E6DBCA',
  muted: '#6B5147',
} as const;

type QuickAccessDef = {
  id: QuickAccessId;
  fr: string;
  wo: string;
  route: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const QUICK_ACCESS_CATALOG: QuickAccessDef[] = [
  { id: 'bibliotheque', fr: 'Bibliothèque', wo: 'Kàttan yi', route: '/bibliotheque', icon: 'bookshelf' },
  { id: 'suivi', fr: 'Mon cycle', wo: 'Topptoo', route: '/suivi', icon: 'clipboard-pulse-outline' },
  { id: 'carte', fr: 'Carte locale', wo: 'Kàrt', route: '/carte', icon: 'map-marker-radius-outline' },
  { id: 'about', fr: 'À propos', wo: 'Ci biir', route: '/about', icon: 'information-outline' },
  { id: 'orientation', fr: 'Orientation', wo: 'Jubanti', route: '/orientation', icon: 'compass-outline' },
  { id: 'mon-contexte', fr: 'Mon contexte', wo: 'Sama xaalis', route: '/mon-contexte', icon: 'account-question-outline' },
  { id: 'orientation-sensible', fr: 'Orientation sensible', wo: 'Jubanti bu sell', route: '/orientation-sensible', icon: 'shield-outline' },
  { id: 'chat', fr: 'Chat', wo: 'Wax ak AI', route: '/chat', icon: 'message-processing-outline' },
  { id: 'medecins', fr: 'Médecins', wo: 'Doktoor', route: '/medecins', icon: 'stethoscope' },
  { id: 'journal', fr: 'Journal', wo: 'Téere bés', route: '/journal', icon: 'book-edit-outline' },
  { id: 'faq', fr: 'FAQ', wo: 'Laaj yu bari', route: '/faq', icon: 'help-circle-outline' },
  { id: 'glossaire', fr: 'Glossaire', wo: 'Waxi-kàddu', route: '/glossaire', icon: 'alphabetical-variant' },
  { id: 'urgence', fr: 'Urgence', wo: 'Gaaw', route: '/urgence', icon: 'alert-circle-outline' },
  { id: 'stats-sante', fr: 'Statistiques', wo: 'Limu yaram', route: '/suivi', icon: 'chart-line' },
  { id: 'calendrier', fr: 'Calendrier', wo: 'Kalendriye', route: '/calendrier', icon: 'calendar-month-outline' },
];

const DEFAULT_QUICK_ACCESS: QuickAccessId[] = [
  'bibliotheque',
  'suivi',
  'chat',
  'about',
  'orientation',
  'mon-contexte',
  'carte',
  'urgence',
];

const SUGGESTIONS = [
  {
    title: 'Comprendre mon cycle',
    subtitle: 'Un guide clair pour relier symptômes et périodes du cycle.',
    route: '/bibliotheque/25',
    icon: 'moon-waning-crescent',
    tone: '#E9D4C5',
  },
  {
    title: 'Parler sans gêne en consultation',
    subtitle: 'Prépare tes mots-clés avant de voir un professionnel.',
    route: '/ressources?focus=consultation',
    icon: 'account-voice',
    tone: '#DCE8DF',
  },
  {
    title: 'Suivi rapide aujourd’hui',
    subtitle: 'Enregistre humeur, douleurs et énergie en moins d’une minute.',
    route: '/suivi',
    icon: 'heart-pulse',
    tone: '#F0E8CB',
  },
];

const TESTIMONIALS = [
  {
    context: 'Étudiante, cycles irréguliers et douleurs difficiles à décrire',
    quote: 'Avant, je disais seulement que j’avais mal, sans savoir expliquer quand les douleurs commençaient, combien de temps elles duraient ni ce qui les calmait. Avec les contenus de SaxalWér, j’ai appris à mieux observer mon cycle, à mettre des mots sur mes symptômes et à préparer mes questions avant ma consultation.',
    impact: 'Je me suis sentie plus écoutée, parce que j’arrivais enfin à raconter clairement ce que je vivais.',
    author: 'Aminata, 24 ans',
  },
  {
    context: 'Mère de famille, téléphone souvent utilisé dans des espaces partagés',
    quote: 'Le mode discret m’a beaucoup aidée quand je voulais consulter des sujets sensibles sans attirer l’attention. J’ai pu lire sur la contraception, revenir sur mes notes plus tard et garder un suivi personnel, même lorsque je n’avais que quelques minutes seule pour me renseigner.',
    impact: 'J’ai retrouvé de l’intimité dans ma recherche d’informations et plus de liberté pour avancer à mon rythme.',
    author: 'Fatou, 31 ans',
  },
  {
    context: 'Commerçante, changements hormonaux et questions restées sans réponse',
    quote: 'Je vivais plusieurs changements en même temps, comme des règles différentes, des sautes d’humeur et des troubles du sommeil, sans réussir à faire le lien. Les explications sont restées simples, concrètes et respectueuses, ce qui m’a aidée à comprendre que mes ressentis méritaient d’être pris au sérieux et discutés sereinement.',
    impact: 'Je me sens moins seule, mieux préparée pour demander de l’aide et plus confiante dans mes décisions.',
    author: 'Ndèye, 42 ans',
  },
];

function firstName(fullName: string) {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.split(/\s+/)[0] ?? '';
}

export default function HomeMainScreen() {
    // --- Ajout hooks et logique recherche ---
    const [searchValue, setSearchValue] = useState('');
    const [searchError, setSearchError] = useState('');

    function normalize(str: string) {
      return (
        str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/['’`-]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase()
      );
    }

    function handleSearch() {
      setSearchError('');
      const query = normalize(searchValue);
      if (!query) return;

      // Recherche dans les articles (titre/tags)
      const foundArticle = ARTICLES.find(
        (a) => normalize(a.title).includes(query) || (a.tags && a.tags.some((t) => normalize(t).includes(query)))
      );
      if (foundArticle) {
        router.push(`/article/${foundArticle.id}` as never);
        return;
      }

      // Recherche dans le glossaire (terme)
      const foundTerm = Object.keys(GLOSSARY).find((term) => normalize(term).includes(query));
      if (foundTerm) {
        router.push(`/glossaire?terme=${encodeURIComponent(foundTerm)}` as never);
        return;
      }

      setSearchError('Aucun résultat trouvé.');
    }
  const router = useRouter();
  const {
    userProfile,
    selectedAge,
    lifeSituation,
    language,
    setLanguage,
    unreadCount,
    quickAccessItems,
    setQuickAccessItems,
    oralMode,
    discreteMode,
    toggleOralMode,
    toggleDiscreteMode,
  } = useApp();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingQuickAccess, setEditingQuickAccess] = useState<QuickAccessId[]>(
    quickAccessItems.length ? quickAccessItems : DEFAULT_QUICK_ACCESS,
  );

  const situationTheme = useMemo(
    () => getSituationTheme(lifeSituation, selectedAge),
    [lifeSituation, selectedAge],
  );

  const contextualMessage = useMemo(
    () => getContextualMessage(selectedAge, lifeSituation, language),
    [language, lifeSituation, selectedAge],
  );

  const visibleQuickAccess =
    quickAccessItems.length > 0 ? quickAccessItems : DEFAULT_QUICK_ACCESS;

  const greetingName = firstName(userProfile.name);
  const greetingPrefix =
    language === 'wo'
      ? situationTheme?.greeting.wo ?? 'Nanga def,'
      : situationTheme?.greeting.fr ?? 'Bonjour,';
  const greetingSubtitle =
    language === 'wo'
      ? situationTheme?.subgreeting.wo ?? 'SaxalWér ngi fi ngir sa jàmm.'
      : situationTheme?.subgreeting.fr ?? 'SaxalWér est là pour ton équilibre.';

  const lifeStage = useMemo<'young' | 'pregnant' | 'mature'>(() => {
    if (lifeSituation === 'pregnant' || lifeSituation === 'trying' || lifeSituation === 'postpartum') {
      return 'pregnant';
    }
    if (selectedAge === '50+') {
      return 'mature';
    }
    return 'young';
  }, [lifeSituation, selectedAge]);

  const addQuickAccess = (id: QuickAccessId) => {
    setEditingQuickAccess((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeQuickAccess = (id: QuickAccessId) => {
    setEditingQuickAccess((prev) => prev.filter((item) => item !== id));
  };

  const moveQuickAccess = (id: QuickAccessId, direction: -1 | 1) => {
    setEditingQuickAccess((prev) => {
      const index = prev.indexOf(id);
      if (index < 0) {
        return prev;
      }
      const target = index + direction;
      if (target < 0 || target >= prev.length) {
        return prev;
      }
      const copy = [...prev];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  };

  const saveQuickAccess = () => {
    setQuickAccessItems(editingQuickAccess.slice(0, 8));
    setSettingsOpen(false);
  };

  const unusedQuickAccess = QUICK_ACCESS_CATALOG.filter(
    (item) => !editingQuickAccess.includes(item.id),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerRow}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoMain}>Saxal</Text>
            <Text style={styles.logoAccent}>Wér</Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              onPress={() => setLanguage(language === 'fr' ? 'wo' : 'fr')}
              style={({ pressed }) => [styles.languageButton, pressed && styles.headerPressed]}
              accessibilityRole="button"
              accessibilityLabel={
                language === 'fr'
                  ? 'Passer l application en Wolof'
                  : "Passer l application en Français"
              }
            >
              <MaterialCommunityIcons name="translate" size={16} color={BASE.deepGreen} />
              <Text style={styles.languageButtonText}>
                {language === 'fr' ? 'Français' : 'Wolof'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/notifications' as never)}
              style={({ pressed }) => [styles.headerIconButton, pressed && styles.headerPressed]}
              accessibilityRole="button"
              accessibilityLabel="Ouvrir les notifications"
            >
              <MaterialCommunityIcons name="bell-outline" size={20} color={BASE.deepGreen} />
              {unreadCount > 0 ? (
                <View style={styles.badgeCounter}>
                  <Text style={styles.badgeCounterText}>{Math.min(99, unreadCount)}</Text>
                </View>
              ) : null}
            </Pressable>

            <Pressable
              onPress={() => {
                setEditingQuickAccess(visibleQuickAccess);
                setSettingsOpen(true);
              }}
              style={({ pressed }) => [styles.headerIconButton, pressed && styles.headerPressed]}
              accessibilityRole="button"
              accessibilityLabel="Ouvrir les réglages du tableau de bord"
            >
              <MaterialCommunityIcons name="tune-variant" size={20} color={BASE.deepGreen} />
            </Pressable>

            <Pressable
              onPress={() => setMenuOpen(true)}
              style={({ pressed }) => [styles.headerIconButton, pressed && styles.headerPressed]}
              accessibilityRole="button"
              accessibilityLabel="Ouvrir le menu"
            >
              <MaterialCommunityIcons name="menu" size={22} color={BASE.deepGreen} />
            </Pressable>
          </View>
        </View>

        {oralMode ? (
          <View style={styles.modeBanner}>
            <MaterialCommunityIcons name="volume-high" size={18} color={BASE.deepGreen} />
            <Text style={styles.modeBannerText}>
              {language === 'wo' ? 'Mod oral aktife na.' : 'Mode oral activé pour une lecture guidée.'}
            </Text>
          </View>
        ) : null}

        {discreteMode ? (
          <View style={[styles.modeBanner, styles.modeBannerDiscrete]}>
            <MaterialCommunityIcons name="shield-lock-outline" size={18} color={BASE.cocoa} />
            <Text style={[styles.modeBannerText, { color: BASE.cocoa }]}>
              {language === 'wo'
                ? 'Mode discret aktife na: lim yi fees du leer.'
                : 'Mode discret activé: les contenus sensibles sont atténués.'}
            </Text>
          </View>
        ) : null}

        {contextualMessage?.show ? (
          <SensitiveContent masked={discreteMode} label="Message masqué" style={styles.sensitiveBlock}>
            <View style={styles.contextCard}>
              <MaterialCommunityIcons
                name={contextualMessage.type === 'support' ? 'heart-outline' : 'information-outline'}
                size={18}
                color={BASE.deepGreen}
              />
              <Text style={styles.contextCardText}>{contextualMessage.message}</Text>
            </View>
          </SensitiveContent>
        ) : null}

        <SensitiveContent masked={discreteMode} label="Accueil masqué" style={styles.sensitiveBlock}>
          <View style={styles.greetingBlock}>
            <Text style={styles.greetingTitle}>
              {greetingPrefix} {greetingName}
            </Text>
            <Text style={styles.greetingSubtitle}>{greetingSubtitle}</Text>
            <View style={[styles.badgePill, { borderColor: situationTheme?.accent ?? BASE.terracotta }]}> 
              <MaterialCommunityIcons name="star-outline" size={14} color={situationTheme?.accent ?? BASE.terracotta} />
              <Text style={[styles.badgePillText, { color: situationTheme?.accent ?? BASE.terracotta }]}> 
                {language === 'wo'
                  ? situationTheme?.heroBadge.wo ?? 'Jàmm'
                  : situationTheme?.heroBadge.fr ?? 'Bien-être'}
              </Text>
            </View>
          </View>
        </SensitiveContent>

        <SensitiveContent masked={discreteMode} label="Bannière masquée" style={styles.sensitiveBlock}>
          <View style={styles.culturalBanner}>
            <Text style={styles.culturalTitle}>Le mot du jour</Text>
            <Text style={styles.culturalQuote}>
              &quot;Ku muñ, mujj na am&quot; - En prenant soin de toi pas à pas, tu avances déjà.
            </Text>
          </View>
        </SensitiveContent>

        <Text style={styles.sectionTitle}>Suggestions pour aujourd’hui</Text>
        <HorizontalScroll itemMinWidth={270} gap={14}>
          {SUGGESTIONS.map((item) => (
            <Pressable
              key={item.title}
              onPress={() => router.push(item.route as never)}
              style={({ pressed }) => [
                styles.suggestionCard,
                { backgroundColor: item.tone },
                pressed && styles.cardPressed,
                discreteMode && styles.discreteMask,
              ]}
            >
              <View style={styles.suggestionIconWrap}>
                <MaterialCommunityIcons name={item.icon as never} size={20} color={BASE.deepGreen} />
              </View>
              <Text style={styles.suggestionTitle}>{item.title}</Text>
              <Text style={styles.suggestionSubtitle}>{item.subtitle}</Text>
            </Pressable>
          ))}
        </HorizontalScroll>


        {/* Champ de recherche intelligent */}
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color={BASE.deepGreen} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un sujet: cycle, douleurs, fertilité..."
            placeholderTextColor="#8E766A"
            value={searchValue}
            onChangeText={setSearchValue}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            accessibilityLabel="Champ de recherche de sujet ou terme"
          />
          <Pressable onPress={handleSearch} style={styles.searchButton} accessibilityLabel="Valider la recherche">
            <MaterialCommunityIcons name="arrow-right" size={20} color={BASE.deepGreen} />
          </Pressable>
        </View>
        {searchError ? (
          <Text style={styles.searchError}>{searchError}</Text>
        ) : null}

        <Text style={styles.sectionTitle}>Accès rapide personnalisable</Text>
        <View style={styles.quickGrid}>
          {visibleQuickAccess
            .map((id) => QUICK_ACCESS_CATALOG.find((item) => item.id === id))
            .filter((item): item is QuickAccessDef => Boolean(item))
            .map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(item.route as never)}
                style={({ pressed }) => [
                  styles.quickCard,
                  pressed && styles.cardPressed,
                  (discreteMode && item.id === 'journal') || item.id === 'orientation-sensible'
                    ? styles.discreteMask
                    : null,
                ]}
              >
                <MaterialCommunityIcons name={item.icon} size={22} color={BASE.deepGreen} />
                <Text style={styles.quickCardLabel}>{language === 'wo' ? item.wo : item.fr}</Text>
              </Pressable>
            ))}
        </View>

        <Text style={styles.sectionTitle}>Parcours & ressources</Text>
        <HorizontalScroll itemMinWidth={292} gap={14}>
          <Pressable onPress={() => router.push('/profil' as never)}>
            <LifeStagePoster
              title="Découvrir mon rythme"
              stage={lifeStage}
              accent={situationTheme?.accent ?? BASE.deepGreen}
              showBaobabWatermark
            />
          </Pressable>
          <Pressable onPress={() => router.push('/ressources?focus=consultation' as never)}>
            <LifeStagePoster
              title="Préparer ma consultation"
              stage="young"
              accent={BASE.terracotta}
            />
          </Pressable>
          <Pressable onPress={() => router.push('/ressources-de-faith' as never)}>
            <LifeStagePoster
              title="Corps, foi et équilibre"
              stage="mature"
              accent={BASE.gold}
            />
          </Pressable>
        </HorizontalScroll>

        <Text style={styles.sectionTitle}>Témoignages</Text>
        <HorizontalScroll itemMinWidth={286} gap={14}>
          {TESTIMONIALS.map((item) => (
            <View key={item.author} style={[styles.testimonialCard, discreteMode && styles.discreteMask]}>
              <Text style={styles.testimonialContext}>{item.context}</Text>
              <Text style={styles.testimonialQuote}>&quot;{item.quote}&quot;</Text>
              <Text style={styles.testimonialImpact}>{item.impact}</Text>
              <Text style={styles.testimonialAuthor}>{item.author}</Text>
            </View>
          ))}
        </HorizontalScroll>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal visible={settingsOpen} animationType="slide" transparent onRequestClose={() => setSettingsOpen(false)}>
        <View style={styles.sheetBackdrop}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Réglages du dashboard</Text>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Mode oral</Text>
              <Switch
                value={oralMode}
                onValueChange={toggleOralMode}
                trackColor={{ false: '#D7CBB9', true: '#A7C2B6' }}
                thumbColor={oralMode ? BASE.deepGreen : '#FFFFFF'}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Mode discret</Text>
              <Switch
                value={discreteMode}
                onValueChange={toggleDiscreteMode}
                trackColor={{ false: '#D7CBB9', true: '#D9BBAE' }}
                thumbColor={discreteMode ? BASE.terracotta : '#FFFFFF'}
              />
            </View>

            <Text style={styles.sheetSubTitle}>Ordre des accès rapides</Text>
            <ScrollView style={styles.quickEditList} contentContainerStyle={{ gap: 10 }}>
              {editingQuickAccess.map((id, index) => {
                const item = QUICK_ACCESS_CATALOG.find((entry) => entry.id === id);
                if (!item) {
                  return null;
                }

                return (
                  <View key={id} style={styles.quickEditRow}>
                    <View style={styles.quickEditInfo}>
                      <MaterialCommunityIcons name={item.icon} size={18} color={BASE.deepGreen} />
                      <Text style={styles.quickEditLabel}>{language === 'wo' ? item.wo : item.fr}</Text>
                    </View>

                    <View style={styles.quickEditActions}>
                      <Pressable
                        onPress={() => moveQuickAccess(id, -1)}
                        disabled={index === 0}
                        style={({ pressed }) => [
                          styles.tinyAction,
                          (pressed || index === 0) && styles.tinyActionDisabled,
                        ]}
                      >
                        <MaterialCommunityIcons name="chevron-up" size={18} color={BASE.deepGreen} />
                      </Pressable>
                      <Pressable
                        onPress={() => moveQuickAccess(id, 1)}
                        disabled={index === editingQuickAccess.length - 1}
                        style={({ pressed }) => [
                          styles.tinyAction,
                          (pressed || index === editingQuickAccess.length - 1) && styles.tinyActionDisabled,
                        ]}
                      >
                        <MaterialCommunityIcons name="chevron-down" size={18} color={BASE.deepGreen} />
                      </Pressable>
                      <Pressable
                        onPress={() => removeQuickAccess(id)}
                        style={({ pressed }) => [styles.tinyAction, pressed && styles.tinyActionDanger]}
                      >
                        <MaterialCommunityIcons name="close" size={18} color={BASE.cocoa} />
                      </Pressable>
                    </View>
                  </View>
                );
              })}

              {unusedQuickAccess.length > 0 ? (
                <View style={styles.availableBlock}>
                  <Text style={styles.availableTitle}>Ajouter un accès</Text>
                  <View style={styles.availableWrap}>
                    {unusedQuickAccess.map((item) => (
                      <Pressable key={item.id} onPress={() => addQuickAccess(item.id)} style={styles.availableChip}>
                        <Text style={styles.availableChipText}>+ {language === 'wo' ? item.wo : item.fr}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : null}
            </ScrollView>

            <View style={styles.sheetActions}>
              <Pressable onPress={() => setSettingsOpen(false)} style={styles.sheetSecondaryButton}>
                <Text style={styles.sheetSecondaryText}>Annuler</Text>
              </Pressable>
              <Pressable onPress={saveQuickAccess} style={styles.sheetPrimaryButton}>
                <MaterialCommunityIcons name="content-save-outline" size={22} color={BASE.deepGreen} />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={menuOpen} animationType="fade" transparent onRequestClose={() => setMenuOpen(false)}>
        <HamburgerMenu
          onClose={() => setMenuOpen(false)}
          onNavigate={(route) => {
            setMenuOpen(false);
            router.push(route as never);
          }}
          discreteMode={discreteMode}
          onToggleDiscrete={toggleDiscreteMode}
          oralMode={oralMode}
          onToggleOral={toggleOralMode}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: BASE.deepGreen,
    paddingVertical: 0,
    paddingHorizontal: 6,
    backgroundColor: 'transparent',
  },
  searchButton: {
    padding: 6,
    borderRadius: 16,
  },
  searchError: {
    color: BASE.terracotta,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  safe: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
    gap: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  logoMain: {
    fontSize: 31,
    fontWeight: '700',
    color: BASE.deepGreen,
    letterSpacing: 0.7,
  },
  logoAccent: {
    fontSize: 31,
    fontWeight: '700',
    color: BASE.terracotta,
    letterSpacing: 0.7,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageButton: {
    minHeight: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: BASE.border,
    backgroundColor: '#FFF9F1',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: BASE.deepGreen,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: BASE.border,
    backgroundColor: '#FFF9F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPressed: {
    transform: [{ scale: 0.95 }],
  },
  badgeCounter: {
    position: 'absolute',
    top: -4,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: BASE.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeCounterText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  modeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#C9DED4',
    backgroundColor: '#EBF6F1',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modeBannerDiscrete: {
    borderColor: '#DEC8BA',
    backgroundColor: '#F4E6DD',
  },
  modeBannerText: {
    color: BASE.deepGreen,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  contextCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BASE.border,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    gap: 8,
  },
  contextCardText: {
    flex: 1,
    fontSize: 13,
    color: BASE.cocoa,
    lineHeight: 19,
  },
  sensitiveBlock: {
    position: 'relative',
  },
  greetingBlock: {
    gap: 9,
    padding: 24,
    borderRadius: 30,
    backgroundColor: '#173A32',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 22,
    elevation: 6,
  },
  greetingTitle: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'CormorantGaramond-Bold' : 'serif',
  },
  greetingSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.76)',
    lineHeight: 26,
  },
  badgePill: {
    marginTop: 8,
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  badgePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  culturalBanner: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#FFF8EF',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.12)',
  },
  culturalTitle: {
    color: BASE.copper,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: '800',
  },
  culturalQuote: {
    color: BASE.deepGreen,
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 28,
    color: BASE.deepGreen,
    fontWeight: '700',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'CormorantGaramond-Bold' : 'serif',
  },
  suggestionCard: {
    borderRadius: 24,
    padding: 16,
    minHeight: 164,
    borderWidth: 1,
    borderColor: '#FFFFFF99',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 3,
  },
  suggestionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFFAA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  suggestionTitle: {
    fontSize: 15,
    color: BASE.deepGreen,
    fontWeight: '700',
    marginBottom: 6,
  },
  suggestionSubtitle: {
    fontSize: 13,
    color: BASE.cocoa,
    lineHeight: 18,
  },
  searchBar: {
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BASE.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
    elevation: 3,
  },
  searchPlaceholder: {
    color: '#8E766A',
    flex: 1,
    fontSize: 13,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickCard: {
    width: '48.5%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BASE.border,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 14,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  quickCardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: BASE.deepGreen,
  },
  testimonialCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E3D9CA',
    backgroundColor: '#FFFDF8',
    padding: 18,
    minHeight: 232,
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
    elevation: 3,
  },
  testimonialContext: {
    fontSize: 11,
    lineHeight: 16,
    color: BASE.terracotta,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  testimonialQuote: {
    fontSize: 14,
    lineHeight: 21,
    color: BASE.cocoa,
    fontStyle: 'italic',
  },
  testimonialImpact: {
    fontSize: 13,
    lineHeight: 20,
    color: BASE.muted,
  },
  testimonialAuthor: {
    fontSize: 12,
    color: BASE.deepGreen,
    fontWeight: '700',
    marginTop: 'auto',
  },
  discreteMask: {
    opacity: 0.36,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  bottomSpacer: {
    height: 38,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: '#00000044',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFF9F2',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 26,
    maxHeight: '80%',
  },
  sheetTitle: {
    fontSize: 19,
    color: BASE.deepGreen,
    fontWeight: '700',
    marginBottom: 12,
  },
  sheetSubTitle: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 14,
    color: BASE.cocoa,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: BASE.deepGreen,
    fontWeight: '600',
  },
  quickEditList: {
    maxHeight: 300,
  },
  quickEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BASE.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  quickEditInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  quickEditLabel: {
    color: BASE.deepGreen,
    fontSize: 13,
    fontWeight: '600',
  },
  quickEditActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tinyAction: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7EFE4',
  },
  tinyActionDisabled: {
    opacity: 0.4,
  },
  tinyActionDanger: {
    backgroundColor: '#F5DFD6',
  },
  availableBlock: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E6D8C4',
  },
  availableTitle: {
    fontSize: 13,
    color: BASE.cocoa,
    marginBottom: 8,
    fontWeight: '600',
  },
  availableWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  availableChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D6C8B5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFFDF8',
  },
  availableChipText: {
    color: BASE.deepGreen,
    fontSize: 12,
  },
  sheetActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  sheetSecondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4C4AF',
  },
  sheetSecondaryText: {
    color: BASE.cocoa,
    fontWeight: '600',
  },
  sheetPrimaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: BASE.deepGreen,
  },
  sheetPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: '#00000033',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 72,
    paddingRight: 12,
  },
  menuCard: {
    width: 220,
    backgroundColor: '#FFF9F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3D4C0',
    padding: 10,
    gap: 4,
  },
  menuItem: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  menuItemText: {
    color: BASE.deepGreen,
    fontSize: 14,
    fontWeight: '600',
  },
});
