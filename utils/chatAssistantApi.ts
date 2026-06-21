import type {
  PersonalizationContext,
  SensitiveOrientationSession,
  UserProfile,
} from '../context/appcontext';
import type { Article } from '../data/articles';
import { supabaseConfig } from '../lib/supabase';

export type ChatAssistantTopic = 'symptom' | 'orientation' | 'definition' | 'fallback';
export type ChatAssistantSeverity = 'normal' | 'urgent';
export type ChatAssistantLanguage = 'fr' | 'wo';
export type ChatAssistantLifeStage =
  | 'adolescent'
  | 'contraception'
  | 'pregnancy'
  | 'postpartum'
  | 'menopause'
  | 'general';

export type ChatAssistantReply = {
  answer: string;
  topic: ChatAssistantTopic;
  severity: ChatAssistantSeverity;
  articleIds: number[];
  locationTags: string[];
  referToProfessional: boolean;
  followUpOptions: { fr: string; wo: string }[];
};

type ChatAssistantRequest = {
  message: string;
  language: ChatAssistantLanguage;
  lifeStage: ChatAssistantLifeStage;
  discreteMode: boolean;
  recentMessages: { role: 'user' | 'assistant'; text: string }[];
  articleCandidates: Array<{
    id: number;
    title: string;
    titleWo: string;
    description: string;
    descriptionWo: string;
    category: string;
    categoryWo: string;
    tags: string[];
    tagsWo: string[];
  }>;
  personalization: Pick<
    PersonalizationContext,
    | 'ageRange'
    | 'privacyLevel'
    | 'socialNorms'
    | 'educationLevel'
    | 'preferredTone'
    | 'needsSupport'
    | 'audioPreference'
  >;
  userProfile: Pick<
    UserProfile,
    | 'pregnancyStatus'
    | 'pregnancyWeeks'
    | 'pregnancyDueDate'
    | 'contraceptionActive'
    | 'contraceptionMethod'
    | 'healthConditions'
    | 'educationLevel'
  >;
  sensitiveOrientation: Pick<
    SensitiveOrientationSession,
    'privacyRisk' | 'riskDimensions' | 'level'
  >;
};

const CHAT_ASSISTANT_FUNCTION_NAME = 'chat-assistant';
const VALID_TOPICS: ChatAssistantTopic[] = ['symptom', 'orientation', 'definition', 'fallback'];
const VALID_SEVERITIES: ChatAssistantSeverity[] = ['normal', 'urgent'];

export const chatAssistantHasRemoteApi = Boolean(
  supabaseConfig.functionsBaseUrl && supabaseConfig.publicKey
);

const buildFunctionUrl = () => {
  if (!supabaseConfig.functionsBaseUrl) {
    return null;
  }

  return `${supabaseConfig.functionsBaseUrl}/${CHAT_ASSISTANT_FUNCTION_NAME}`;
};

const sanitizeArticleCandidates = (articles: Article[]) =>
  articles.slice(0, 3).map((article) => ({
    id: article.id,
    title: article.title,
    titleWo: article.titleWo,
    description: article.description,
    descriptionWo: article.descriptionWo,
    category: article.category,
    categoryWo: article.categoryWo,
    tags: article.tags.slice(0, 6),
    tagsWo: article.tagsWo.slice(0, 6),
  }));

const sanitizeRecentMessages = (
  messages: { role: 'user' | 'assistant'; text: string }[]
) =>
  messages
    .map((message) => ({
      role: message.role,
      text: message.text.trim().slice(0, 800),
    }))
    .filter((message) => message.text.length > 0)
    .slice(-6);

const isFollowUpOption = (value: unknown): value is { fr: string; wo: string } => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.fr === 'string' && typeof candidate.wo === 'string';
};

const normalizeReply = (raw: unknown): ChatAssistantReply | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const candidate = raw as Record<string, unknown>;
  const answer = typeof candidate.answer === 'string' ? candidate.answer.trim() : '';
  const topic = VALID_TOPICS.includes(candidate.topic as ChatAssistantTopic)
    ? (candidate.topic as ChatAssistantTopic)
    : 'fallback';
  const severity = VALID_SEVERITIES.includes(candidate.severity as ChatAssistantSeverity)
    ? (candidate.severity as ChatAssistantSeverity)
    : 'normal';
  const articleIds = Array.isArray(candidate.articleIds)
    ? candidate.articleIds
        .filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
        .slice(0, 3)
    : [];
  const locationTags = Array.isArray(candidate.locationTags)
    ? candidate.locationTags
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .map((value) => value.trim())
        .slice(0, 4)
    : [];
  const followUpOptions = Array.isArray(candidate.followUpOptions)
    ? candidate.followUpOptions.filter(isFollowUpOption).slice(0, 4)
    : [];

  if (!answer) {
    return null;
  }

  return {
    answer,
    topic,
    severity,
    articleIds,
    locationTags,
    referToProfessional: Boolean(candidate.referToProfessional),
    followUpOptions,
  };
};

export async function requestChatAssistantReply(input: {
  message: string;
  language: ChatAssistantLanguage;
  lifeStage: ChatAssistantLifeStage;
  discreteMode: boolean;
  recentMessages: { role: 'user' | 'assistant'; text: string }[];
  articleCandidates: Article[];
  personalization: PersonalizationContext;
  userProfile: UserProfile;
  sensitiveOrientation: SensitiveOrientationSession;
}): Promise<ChatAssistantReply | null> {
  if (!chatAssistantHasRemoteApi) {
    return null;
  }

  const functionUrl = buildFunctionUrl();

  if (!functionUrl || !supabaseConfig.publicKey) {
    return null;
  }

  const payload: ChatAssistantRequest = {
    message: input.message.trim(),
    language: input.language,
    lifeStage: input.lifeStage,
    discreteMode: input.discreteMode,
    recentMessages: sanitizeRecentMessages(input.recentMessages),
    articleCandidates: sanitizeArticleCandidates(input.articleCandidates),
    personalization: {
      ageRange: input.personalization.ageRange,
      privacyLevel: input.personalization.privacyLevel,
      socialNorms: input.personalization.socialNorms,
      educationLevel: input.personalization.educationLevel,
      preferredTone: input.personalization.preferredTone,
      needsSupport: input.personalization.needsSupport,
      audioPreference: input.personalization.audioPreference,
    },
    userProfile: {
      pregnancyStatus: input.userProfile.pregnancyStatus,
      pregnancyWeeks: input.userProfile.pregnancyWeeks,
      pregnancyDueDate: input.userProfile.pregnancyDueDate,
      contraceptionActive: input.userProfile.contraceptionActive,
      contraceptionMethod: input.userProfile.contraceptionMethod,
      healthConditions: input.userProfile.healthConditions.slice(0, 6),
      educationLevel: input.userProfile.educationLevel,
    },
    sensitiveOrientation: {
      privacyRisk: input.sensitiveOrientation.privacyRisk,
      riskDimensions: input.sensitiveOrientation.riskDimensions.slice(0, 6),
      level: input.sensitiveOrientation.level,
    },
  };

  if (!payload.message) {
    return null;
  }

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseConfig.publicKey}`,
      apikey: supabaseConfig.publicKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Chat assistant request failed with status ${response.status}`);
  }

  const data = (await response.json()) as { reply?: unknown };
  return normalizeReply(data.reply);
}
