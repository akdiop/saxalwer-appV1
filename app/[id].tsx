import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useMemo, useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import ActionPicker from '../components/ActionPicker';
import { GlossaryText } from '../components/article/GlossaryText';
import { LocationFinder } from '../components/article/LocationFinder';
import ConsultationPrep from '../components/ConsultationPrep';
import SavedQuestions from '../components/SavedQuestions';
import UrgencyBadge from '../components/UrgencyBadge';
import type { PersonalizationContext } from '../context/appcontext';
import { useApp } from '../context/appcontext';
import { ARTICLES } from '../data/articles';

const BASE = {
  beige: '#F5F1E6',
  surface: '#FFFCF7',
  deepGreen: '#1A3C34',
  terracotta: '#A65D40',
  copper: '#B5622A',
  cocoa: '#4A2F27',
  line: 'rgba(181,98,42,0.14)',
  softLine: 'rgba(26,60,52,0.08)',
};

function adaptArticleText(
  text: string,
  personalization: PersonalizationContext,
  language: 'fr' | 'wo'
) {
  let adapted = text;
  const wo = language === 'wo';

  if (personalization.socialNorms === 'conservative') {
    const replacements = wo
      ? [
          ['sexualité', 'santé intime'],
          ['rapport sexuel', 'rapport intime'],
          ['rapports sexuels', 'rapports intimes'],
          ['plaisir sexuel', 'bien-etre intime'],
        ]
      : [
          ['sexualité', 'santé intime'],
          ['rapport sexuel', 'rapport intime'],
          ['rapports sexuels', 'rapports intimes'],
          ['plaisir sexuel', 'bien-être intime'],
        ];

    replacements.forEach(([from, to]) => {
      adapted = adapted.replace(new RegExp(from, 'gi'), to);
    });
  }

  if (personalization.educationLevel === 'basic') {
    const replacements = wo
      ? [
          ['dépistage', 'test de controle'],
          ['diagnostic', 'avis medical bu leer'],
          ['fertilité', 'man a am doom'],
          ['ovulation', 'waxtu bi ovule bi di génne'],
        ]
      : [
          ['dépistage', 'test de contrôle'],
          ['diagnostic', 'avis médical précis'],
          ['fertilité', 'capacité à concevoir'],
          ['ovulation', "moment où l'ovule sort"],
        ];

    replacements.forEach(([from, to]) => {
      adapted = adapted.replace(new RegExp(from, 'gi'), to);
    });
  }

  if (personalization.preferredTone === 'formal' && !wo) {
    adapted = adapted
      .replace(/\btu\b/gi, 'vous')
      .replace(/\bton\b/gi, 'votre')
      .replace(/\bta\b/gi, 'votre')
      .replace(/\btes\b/gi, 'vos');
  }

  return adapted;
}

function getSensitivityLabel(personalization: PersonalizationContext, language: 'fr' | 'wo') {
  if (language === 'wo') {
    if (personalization.socialNorms === 'conservative' || personalization.privacyLevel === 'very-high') {
      return 'Wax bu sutura te teey';
    }

    if (personalization.needsSupport) {
      return 'Wax bu lewet ak andale';
    }

    return 'Wax bu leer te yomb';
  }

  if (personalization.socialNorms === 'conservative' || personalization.privacyLevel === 'very-high') {
    return 'Version douce et plus discrete';
  }

  if (personalization.needsSupport) {
    return 'Version plus rassurante';
  }

  return 'Version claire et accessible';
}

export default function ArticleDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const {
    language,
    setLanguage,
    oralMode,
    toggleOralMode,
    toggleFavorite,
    isFavorite,
    personalization,
  } = useApp();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const articleId = Number(params.id);
  const article = ARTICLES.find((a) => a.id === articleId);
  const wo = language === 'wo';

  const locationFilterTags = useMemo(() => {
    const cat = article?.category.toLowerCase() || '';
    if (cat.includes('cancer')) return ['Cancer', 'Oncologie', 'Radiotherapie'];
    if (cat.includes('ist')) return ['IST', 'Depistage'];
    if (cat.includes('contraception')) return ['Planning', 'Contraception'];
    if (cat.includes('ménopause') || cat.includes('menopause')) return ['Gynecologie', 'Menopause', 'Endocrinologie'];
    if (cat.includes('grossesse') || cat.includes('post-partum')) return ['Maternite'];
    if (cat.includes('fertilite') || cat.includes('infertilite')) return ['Gynecologie', 'Fertilite'];
    if (cat.includes('maladies chroniques')) return ['Gynecologie', 'Endocrinologie', 'Consultation'];
    if (cat.includes('ssr')) return ['Gynecologie', 'Planning', 'Consultation'];
    if (cat.includes('foi')) return ['Gynecologie', 'Planning', 'Consultation'];
    return [];
  }, [article?.category]);

  if (!article) {
    return (
      <SafeAreaView style={styles.notFoundSafeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>{wo ? 'Article bi amul' : 'Article introuvable'}</Text>
          <Text style={styles.notFoundCopy}>
            {wo
              ? 'Mën na ne jàngale bi dem na walla jublu ci beneen bopp.'
              : "Le contenu demandé n'est pas disponible pour le moment."}
          </Text>
          <Pressable
            onPress={() => router.push('/bibliotheque' as never)}
            style={styles.notFoundButton}
          >
            <Text style={styles.notFoundButtonText}>
              {wo ? 'Dellusi ci bibliotheque bi' : 'Retour à la bibliothèque'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isBookmarked = isFavorite(article.id);
  const displayTitle = language === 'wo' ? article.titleWo : article.title;
  const displayDescription = adaptArticleText(
    language === 'wo' ? article.descriptionWo : article.description,
    personalization,
    language
  );
  const displaySource = '...';
  const verificationStatus = wo ? 'Vérification en cours' : 'Vérification en cours';
  const displayCategory = language === 'wo' ? article.categoryWo : article.category;
  const displaySensitivity = getSensitivityLabel(personalization, language);

  const handleAudioToggle = () => {
    if (isAudioPlaying) {
      Speech.stop();
      setIsAudioPlaying(false);
      return;
    }

    const fullText = article.content
      .map((section) => {
        const baseText = language === 'wo' ? section.wo || section.content : section.fr || section.content;
        const items = language === 'wo' ? section.itemsWo || section.items : section.itemsFr || section.items;
        const adaptedText = baseText ? adaptArticleText(baseText, personalization, language) : '';
        const adaptedItems = (items || []).map((item) =>
          adaptArticleText(item, personalization, language)
        );
        return [adaptedText, ...adaptedItems].filter(Boolean).join('. ');
      })
      .join('. ');

    setIsAudioPlaying(true);
    Speech.stop();
    Speech.speak(`${displayTitle}. ${fullText}`, {
      language: language === 'wo' ? 'fr-SN' : 'fr-FR',
      rate: 0.85,
      onDone: () => setIsAudioPlaying(false),
      onStopped: () => setIsAudioPlaying(false),
      onError: () => setIsAudioPlaying(false),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageHeader}>
          <Pressable onPress={() => router.back()} style={styles.textButton}>
            <Text style={styles.textButtonLabel}>{wo ? 'Retour' : 'Retour'}</Text>
          </Pressable>

          <View style={styles.headerActions}>
            <Pressable
              onPress={() => setLanguage(wo ? 'fr' : 'wo')}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>{wo ? 'Français' : 'Wolof'}</Text>
            </Pressable>
            <Pressable onPress={handleAudioToggle} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                {isAudioPlaying ? (wo ? 'Stop' : 'Stop') : wo ? 'Audio' : 'Audio'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => toggleFavorite(article.id)}
              style={[styles.secondaryButton, isBookmarked && styles.secondaryButtonActive]}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  isBookmarked && styles.secondaryButtonTextActive,
                ]}
              >
                {wo ? 'Bëgg' : 'Sauver'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.introBlock}>
          <View style={styles.metaTopRow}>
            <Text style={styles.categoryPill}>{displayCategory}</Text>
            <Text style={styles.metaInline}>{article.readTime}</Text>
            <Text style={styles.metaDivider}>•</Text>
            <Text style={styles.metaInline}>
              {article.readers.toLocaleString()} {wo ? 'lectrices' : 'lectrices'}
            </Text>
          </View>

          <Text style={styles.authorLine}>{displaySource}</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{displayTitle}</Text>
            <View style={styles.verificationPill}>
              <Text style={styles.verificationPillText}>{verificationStatus}</Text>
            </View>
            {article.urgencyLevel && <UrgencyBadge urgencyLevel={article.urgencyLevel} size="small" />}
          </View>
          <Text style={styles.description}>{displayDescription}</Text>

          <View style={styles.contextStrip}>
            <Text style={styles.contextLabel}>
              {wo ? 'Melokaanu wax ji' : 'Ton adapte'}
            </Text>
            <Text style={styles.contextValue}>{displaySensitivity}</Text>
          </View>
        </View>

        {(article.audio || oralMode) && (
          <Pressable onPress={handleAudioToggle} style={styles.audioCard}>
            <View style={styles.audioBadge}>
              <Text style={styles.audioBadgeText}>{isAudioPlaying ? '...' : 'Audio'}</Text>
            </View>
            <View style={styles.audioBody}>
              <Text style={styles.audioTitle}>
                {isAudioPlaying
                  ? wo
                    ? 'Dafay jàng leegi'
                    : 'Lecture en cours'
                  : wo
                    ? 'Déglu article bi'
                    : 'Écouter cet article'}
              </Text>
              <Text style={styles.audioSubtitle}>
                {wo ? 'Version audio disponible' : 'Version audio disponible'}
              </Text>
            </View>
          </Pressable>
        )}

        <View style={styles.articleCard}>
          {article.content.map((section, index) => {
            const rawText = language === 'wo' ? section.wo || section.content : section.fr || section.content;
            const items = language === 'wo' ? section.itemsWo || section.items : section.itemsFr || section.items;
            const text = rawText
              ? adaptArticleText(rawText, personalization, language)
              : undefined;
            const adaptedItems = (items || []).map((item) =>
              adaptArticleText(item, personalization, language)
            );

            const isLocationList =
              section.type === 'list' &&
              adaptedItems.some((item) => item.includes('🏥'));

            return (
              <View key={index} style={styles.sectionBlock}>
                {section.type === 'heading' && !!text && (
                  <Text style={[styles.headingText, index > 0 && styles.headingSpaced]}>{text}</Text>
                )}

                {section.type === 'text' && !!text && (
                  <GlossaryText text={text} language={language} style={styles.paragraphText} />
                )}

                {section.type === 'list' && adaptedItems.length > 0 && (
                  <View>
                    <View style={styles.listWrap}>
                      {adaptedItems.map((item, i) => (
                        <View key={i} style={styles.listItemRow}>
                          <Text style={styles.listBullet}>•</Text>
                          <GlossaryText text={item} language={language} style={styles.listItemText} />
                        </View>
                      ))}
                    </View>

                    {isLocationList && (
                      <LocationFinder language={language} filterTags={locationFilterTags} />
                    )}
                  </View>
                )}

                {section.type === 'quote' && !!text && (
                  <View style={styles.quoteCard}>
                    <GlossaryText text={text} language={language} style={styles.quoteText} />
                  </View>
                )}

                {section.type === 'warning' && !!text && (
                  <View style={styles.noteCard}>
                    <Text style={styles.noteLabel}>{wo ? 'A retenir' : 'A retenir'}</Text>
                    <GlossaryText text={text} language={language} style={styles.noteText} />
                  </View>
                )}

                {section.type === 'tip' && !!text && (
                  <View style={styles.tipCard}>
                    <Text style={styles.tipLabel}>{wo ? 'Conseil pratique' : 'Conseil pratique'}</Text>
                    <GlossaryText text={text} language={language} style={styles.tipText} />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <LocationFinder
          language={language}
          filterTags={locationFilterTags}
          headline={
            wo
              ? 'Trouver un centre ou une professionnelle'
              : 'Trouver un centre ou une professionnelle'
          }
        />

        <ActionPicker
          articleId={article.id}
          articleTitle={article.title}
        />

        <SavedQuestions
          topicId={article.id}
          topicTitle={article.title}
        />

        <ConsultationPrep
          articleTitle={article.title}
          articleId={article.id}
        />

        {article.tags.length > 0 && (
          <View style={styles.tagsWrap}>
            <Text style={styles.tagsHeader}>
              {language === 'wo' ? 'Sujets yi tekki' : 'Sujets liés'}
            </Text>

            <View style={styles.tagsRow}>
              {(language === 'wo' ? article.tagsWo : article.tags).map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => router.push(`/bibliotheque?tag=${encodeURIComponent(tag)}` as never)}
                  style={styles.tagButton}
                >
                  <Text style={styles.tagButtonText}>{tag}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View style={styles.relatedCtaWrap}>
          <Pressable onPress={toggleOralMode} style={styles.helperButton}>
            <Text style={styles.helperButtonText}>
              {oralMode
                ? wo
                  ? 'Audio activé'
                  : 'Audio activé'
                : wo
                  ? 'Activer audio'
                  : "Activer l'audio"}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push('/bibliotheque' as never)} style={styles.relatedCtaButton}>
            <Text style={styles.relatedCtaText}>
              {wo ? 'Seet yeneen articles' : "Explorer plus d'articles"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  notFoundSafeArea: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  notFoundTitle: {
    fontSize: 28,
    lineHeight: 34,
    color: BASE.deepGreen,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  notFoundCopy: {
    fontSize: 14,
    lineHeight: 22,
    color: BASE.cocoa,
    opacity: 0.72,
    textAlign: 'center',
  },
  notFoundButton: {
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: BASE.deepGreen,
  },
  notFoundButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  safeArea: {
    flex: 1,
    backgroundColor: BASE.beige,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 110,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  textButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: BASE.surface,
    borderWidth: 1,
    borderColor: BASE.softLine,
  },
  textButtonLabel: {
    color: BASE.deepGreen,
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: BASE.surface,
    borderWidth: 1,
    borderColor: BASE.softLine,
  },
  secondaryButtonActive: {
    backgroundColor: 'rgba(181,98,42,0.12)',
    borderColor: 'rgba(181,98,42,0.22)',
  },
  secondaryButtonText: {
    color: BASE.cocoa,
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryButtonTextActive: {
    color: BASE.copper,
  },
  introBlock: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BASE.line,
    paddingTop: 12,
    paddingBottom: 16,
    marginBottom: 14,
  },
  metaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BASE.line,
    backgroundColor: 'rgba(255,252,247,0.9)',
    fontSize: 11,
    fontWeight: '700',
    color: BASE.terracotta,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metaInline: {
    fontSize: 12,
    color: BASE.cocoa,
    opacity: 0.7,
  },
  metaDivider: {
    fontSize: 12,
    color: BASE.cocoa,
    opacity: 0.4,
  },
  authorLine: {
    fontSize: 14,
    color: BASE.cocoa,
    opacity: 0.72,
    marginBottom: 14,
  },
  verificationPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.28)',
    backgroundColor: 'rgba(181,98,42,0.12)',
  },
  verificationPillText: {
    color: BASE.copper,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 27,
    color: BASE.cocoa,
    marginBottom: 18,
  },
  contextStrip: {
    borderRadius: 18,
    backgroundColor: 'rgba(181,98,42,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.14)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  contextLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: BASE.copper,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  contextValue: {
    fontSize: 13,
    lineHeight: 20,
    color: BASE.cocoa,
  },
  audioCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.2)',
    backgroundColor: 'rgba(255,252,247,0.88)',
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  audioBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: BASE.copper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  audioBody: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BASE.copper,
    marginBottom: 4,
  },
  audioSubtitle: {
    fontSize: 13,
    color: BASE.cocoa,
    opacity: 0.68,
  },
  articleCard: {
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: BASE.line,
    shadowColor: '#0F3D2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 2,
  },
  sectionBlock: {
    marginBottom: 22,
  },
  headingText: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '700',
    color: BASE.deepGreen,
    marginBottom: 12,
  },
  headingSpaced: {
    marginTop: 18,
  },
  paragraphText: {
    fontSize: 16,
    lineHeight: 28,
    color: BASE.cocoa,
  },
  listWrap: {
    gap: 12,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  listBullet: {
    color: BASE.copper,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 27,
    color: BASE.cocoa,
  },
  quoteCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(181,98,42,0.18)',
    backgroundColor: 'rgba(181,98,42,0.05)',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 27,
    color: BASE.cocoa,
    fontStyle: 'italic',
  },
  noteCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(166,93,64,0.16)',
    backgroundColor: 'rgba(166,93,64,0.05)',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: BASE.terracotta,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 15,
    lineHeight: 25,
    color: BASE.cocoa,
  },
  tipCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(26,60,52,0.12)',
    backgroundColor: 'rgba(26,60,52,0.04)',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  tipLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: BASE.deepGreen,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 25,
    color: BASE.cocoa,
  },
  tagsWrap: {
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BASE.line,
    backgroundColor: 'rgba(255,252,247,0.75)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  tagsHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: BASE.cocoa,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BASE.line,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tagButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: BASE.copper,
  },
  relatedCtaWrap: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  helperButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BASE.softLine,
    backgroundColor: BASE.surface,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  helperButtonText: {
    color: BASE.deepGreen,
    fontSize: 13,
    fontWeight: '600',
  },
  relatedCtaButton: {
    borderRadius: 999,
    backgroundColor: BASE.deepGreen,
    paddingHorizontal: 26,
    paddingVertical: 14,
  },
  relatedCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
