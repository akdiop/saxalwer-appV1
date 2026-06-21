// @ts-nocheck

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type ChatAssistantRequest = {
  message?: string;
  language?: 'fr' | 'wo';
  lifeStage?:
    | 'adolescent'
    | 'contraception'
    | 'pregnancy'
    | 'postpartum'
    | 'menopause'
    | 'general';
  discreteMode?: boolean;
  recentMessages?: Array<{ role: 'user' | 'assistant'; text: string }>;
  articleCandidates?: Array<{
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
  personalization?: Record<string, unknown>;
  userProfile?: Record<string, unknown>;
  sensitiveOrientation?: Record<string, unknown>;
};

type ChatAssistantReply = {
  answer: string;
  topic: 'symptom' | 'orientation' | 'definition' | 'fallback';
  severity: 'normal' | 'urgent';
  articleIds: number[];
  locationTags: string[];
  referToProfessional: boolean;
  followUpOptions: { fr: string; wo: string }[];
};

const DEFAULT_REPLY: ChatAssistantReply = {
  answer:
    "Je suis là pour t'aider avec des informations générales. Si tu veux, décris-moi ce qui t'inquiète, ou demande-moi une explication simple.",
  topic: 'fallback',
  severity: 'normal',
  articleIds: [],
  locationTags: [],
  referToProfessional: false,
  followUpOptions: [
    {
      fr: 'Explique-moi simplement',
      wo: 'Leeral ma ko bu yomb',
    },
    {
      fr: 'Trouver un centre de santé',
      wo: 'Seet ker wu jamm',
    },
  ],
};

const buildDeveloperPrompt = () => `
You are SaxalWer's reproductive health assistant for users in West Africa.

Your job:
- Answer with empathy, clarity, and cultural sensitivity.
- Give educational information only, never a diagnosis.
- Keep answers practical, short-to-medium length, and easy to understand.
- Respect privacy concerns and use discreet wording when appropriate.
- If the situation sounds urgent or potentially dangerous, mark severity as "urgent" and set referToProfessional to true.
- Prefer the user's target language for the answer field.
- Follow-up options must always include both French and Wolof short labels.
- Only use articleIds that exist in the provided articleCandidates.
- Only use locationTags when a care location would genuinely help.

Safety rules:
- Never claim certainty about a diagnosis.
- Never tell the user to ignore serious symptoms.
- Escalate for heavy bleeding, severe pain, fever with concerning symptoms, fainting, assault/violence, breathing trouble, or worsening symptoms.
- If the user is asking about an image, remind them that an image alone is not enough for diagnosis.

Output rules:
- Return valid JSON matching the schema exactly.
- "answer" should be the user-facing answer body only, without JSON markdown fencing.
- Keep followUpOptions to 2 to 4 items.
`.trim();

const normalizeReply = (
  raw: unknown,
  allowedArticleIds: Set<number>
): ChatAssistantReply => {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_REPLY;
  }

  const candidate = raw as Record<string, unknown>;
  const topic =
    candidate.topic === 'symptom' ||
    candidate.topic === 'orientation' ||
    candidate.topic === 'definition' ||
    candidate.topic === 'fallback'
      ? candidate.topic
      : DEFAULT_REPLY.topic;
  const severity =
    candidate.severity === 'urgent' || candidate.severity === 'normal'
      ? candidate.severity
      : DEFAULT_REPLY.severity;
  const answer = typeof candidate.answer === 'string' ? candidate.answer.trim() : '';
  const articleIds = Array.isArray(candidate.articleIds)
    ? candidate.articleIds
        .filter((value): value is number => typeof value === 'number' && allowedArticleIds.has(value))
        .slice(0, 3)
    : [];
  const locationTags = Array.isArray(candidate.locationTags)
    ? candidate.locationTags
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .map((value) => value.trim())
        .slice(0, 4)
    : [];
  const followUpOptions = Array.isArray(candidate.followUpOptions)
    ? candidate.followUpOptions
        .filter((value): value is { fr: string; wo: string } => {
          if (!value || typeof value !== 'object') {
            return false;
          }

          const option = value as Record<string, unknown>;
          return typeof option.fr === 'string' && typeof option.wo === 'string';
        })
        .map((option) => ({
          fr: option.fr.trim(),
          wo: option.wo.trim(),
        }))
        .filter((option) => option.fr.length > 0 && option.wo.length > 0)
        .slice(0, 4)
    : [];

  if (!answer) {
    return DEFAULT_REPLY;
  }

  return {
    answer,
    topic,
    severity,
    articleIds,
    locationTags,
    referToProfessional: Boolean(candidate.referToProfessional) || severity === 'urgent',
    followUpOptions:
      followUpOptions.length > 0 ? followUpOptions : DEFAULT_REPLY.followUpOptions,
  };
};

const buildUserPayload = (payload: ChatAssistantRequest) =>
  JSON.stringify(
    {
      language: payload.language ?? 'fr',
      lifeStage: payload.lifeStage ?? 'general',
      discreteMode: Boolean(payload.discreteMode),
      message: payload.message ?? '',
      recentMessages: payload.recentMessages ?? [],
      personalization: payload.personalization ?? {},
      userProfile: payload.userProfile ?? {},
      sensitiveOrientation: payload.sensitiveOrientation ?? {},
      articleCandidates: payload.articleCandidates ?? [],
    },
    null,
    2
  );

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const payload = (await request.json()) as ChatAssistantRequest;
    const message = payload.message?.trim();
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    const model = Deno.env.get('OPENAI_MODEL')?.trim() || 'gpt-5.5';

    if (!message) {
      return new Response(JSON.stringify({ error: 'Missing message' }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    if (!openAiApiKey) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY is not configured' }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    const articleIds = new Set((payload.articleCandidates ?? []).map((article) => article.id));

    const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model,
        reasoning: { effort: 'low' },
        input: [
          {
            role: 'developer',
            content: buildDeveloperPrompt(),
          },
          {
            role: 'user',
            content: buildUserPayload(payload),
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'chat_assistant_response',
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                answer: { type: 'string' },
                topic: {
                  type: 'string',
                  enum: ['symptom', 'orientation', 'definition', 'fallback'],
                },
                severity: {
                  type: 'string',
                  enum: ['normal', 'urgent'],
                },
                articleIds: {
                  type: 'array',
                  items: { type: 'number' },
                },
                locationTags: {
                  type: 'array',
                  items: { type: 'string' },
                },
                referToProfessional: { type: 'boolean' },
                followUpOptions: {
                  type: 'array',
                  minItems: 0,
                  maxItems: 4,
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      fr: { type: 'string' },
                      wo: { type: 'string' },
                    },
                    required: ['fr', 'wo'],
                  },
                },
              },
              required: [
                'answer',
                'topic',
                'severity',
                'articleIds',
                'locationTags',
                'referToProfessional',
                'followUpOptions',
              ],
            },
            strict: true,
          },
        },
      }),
    });

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text();
      return new Response(JSON.stringify({ error: 'OpenAI request failed', details: errorText }), {
        status: 502,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    const result = (await openAiResponse.json()) as { output_text?: string };
    const parsed = result.output_text ? JSON.parse(result.output_text) : DEFAULT_REPLY;
    const reply = normalizeReply(parsed, articleIds);

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Unexpected server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
