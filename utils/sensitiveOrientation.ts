import type {
  Language,
  SensitiveOrientationSession,
} from '../context/appcontext';
import type { HealthCenter } from '../data/healthcenters';

export type SensitiveFollowUpOption = {
  fr: string;
  wo: string;
};

export type SensitiveChatIntent =
  | 'neutral-words'
  | 'prepare-consultation'
  | 'decision-support'
  | 'discreet-location'
  | 'accessible-location'
  | 'nearby-location'
  | 'step-by-step';

export type SensitiveMapPreset = {
  id: 'discreet' | 'accessible' | 'nearby' | 'prepare';
  labelFr: string;
  labelWo: string;
  hintFr: string;
  hintWo: string;
  type: HealthCenter['type'] | null;
  tags: string[];
};

type SensitiveSignals = {
  active: boolean;
  prefersDiscretion: boolean;
  needsNeutralWords: boolean;
  needsConsultationPrep: boolean;
  needsRightsInfo: boolean;
  needsAffordableCare: boolean;
  needsNearbyCare: boolean;
  needsReassurance: boolean;
  isPriority: boolean;
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function uniqueStrings(values: string[]) {
  return [...new Set(values)];
}

function uniqueOptions(values: SensitiveFollowUpOption[]) {
  return values.filter(
    (option, index, array) =>
      array.findIndex(
        (candidate) => candidate.fr === option.fr && candidate.wo === option.wo
      ) === index
  );
}

function hasAnswer(
  session: SensitiveOrientationSession | null | undefined,
  key: string,
  values: string[]
) {
  const answer = session?.answers[key];
  return typeof answer === 'string' && values.includes(answer);
}

export function hasSensitiveOrientation(
  session: SensitiveOrientationSession | null | undefined
) {
  return Boolean(session?.completedAt);
}

export function getSensitiveSignals(
  session: SensitiveOrientationSession | null | undefined
): SensitiveSignals {
  const active = hasSensitiveOrientation(session);

  return {
    active,
    prefersDiscretion:
      active &&
      (Boolean(session?.privacyRisk) ||
        hasAnswer(session, 'access', ['discreet-chat']) ||
        hasAnswer(session, 'taboos', [
          'very-taboo',
          'judged',
          'cannot-name',
          'religious-pressure',
        ])),
    needsNeutralWords: active && hasAnswer(session, 'access', ['neutral-words']),
    needsConsultationPrep:
      active && hasAnswer(session, 'access', ['prepare-consultation']),
    needsRightsInfo:
      active &&
      (hasAnswer(session, 'access', ['know-rights']) ||
        hasAnswer(session, 'decision', ['decision-shared', 'needs-permission'])),
    needsAffordableCare:
      active && hasAnswer(session, 'money', ['money-shared', 'money-control']),
    needsNearbyCare:
      active &&
      hasAnswer(session, 'mobility', ['mobility-supported', 'mobility-limit']),
    needsReassurance:
      active &&
      hasAnswer(session, 'mood', ['anxious', 'ashamed', 'isolated']),
    isPriority: active && session?.level === 'priority',
  };
}

export function getSensitiveChatSupportLines(
  session: SensitiveOrientationSession | null | undefined,
  language: Language,
  topic:
    | 'welcome'
    | 'symptom'
    | 'orientation'
    | 'fallback'
    | 'image'
    | 'definition' = 'orientation'
) {
  const signals = getSensitiveSignals(session);

  if (!signals.active || topic === 'definition') {
    return [];
  }

  const fr = language === 'fr';
  const lines: string[] = [];

  if (
    topic === 'symptom' ||
    topic === 'fallback' ||
    topic === 'image' ||
    topic === 'welcome'
  ) {
    if (signals.prefersDiscretion) {
      lines.push(
        fr
          ? "On peut rester tres discrete ici, sans tout nommer frontalement."
          : 'Man nanu des ci sutura fii te waxu ko ci lu tar.'
      );
    }
    if (signals.needsNeutralWords) {
      lines.push(
        fr
          ? 'Tu peux utiliser des mots neutres ou tres simples, je comprendrai.'
          : 'Men nga jefandikoo ay wax yu dal walla yu yomb, dinaa la degg.'
      );
    }
    if (signals.needsReassurance) {
      lines.push(
        fr
          ? 'On peut avancer pas a pas, a ton rythme.'
          : 'Man nanu dem ndank ndank, ci sa rythme.'
      );
    }
  }

  if (topic === 'orientation' || topic === 'welcome') {
    if (signals.needsConsultationPrep) {
      lines.push(
        fr
          ? 'Si tu veux, je peux aussi t aider a preparer une phrase simple pour une consultation.'
          : 'Soo ko bëggee, man naa la dimbali nga waajal benn kadu bu yomb ngir consultation.'
      );
    }
    if (signals.needsRightsInfo) {
      lines.push(
        fr
          ? 'Je peux aussi t aider a clarifier tes marges de decision, sans te brusquer.'
          : 'Man naa it dimbali la ci xam sa marges de decision, ndank ndank.'
      );
    }
    if (signals.needsAffordableCare || signals.needsNearbyCare) {
      lines.push(
        fr
          ? 'Je peux privilegier des options plus proches ou souvent plus accessibles.'
          : 'Man naa tannal it options yu gëna jege walla yu gëna yomb.'
      );
    }
  }

  return uniqueStrings(lines).slice(0, 2);
}

export function getSensitiveChatFollowUpOptions(
  session: SensitiveOrientationSession | null | undefined
) {
  const signals = getSensitiveSignals(session);

  if (!signals.active) {
    return [];
  }

  const options: SensitiveFollowUpOption[] = [];

  if (signals.needsNeutralWords || signals.prefersDiscretion) {
    options.push({
      fr: 'Je prefere des mots neutres',
      wo: 'Begg naa wax yu dal',
    });
  }

  if (signals.needsConsultationPrep) {
    options.push({
      fr: 'Preparer ce que je peux dire',
      wo: 'Waajal li ma men a wax',
    });
  }

  if (signals.needsRightsInfo) {
    options.push({
      fr: 'Comprendre mes marges de decision',
      wo: 'Xam sama marges de decision',
    });
  }

  if (signals.needsAffordableCare) {
    options.push({
      fr: 'Chercher un lieu plus accessible',
      wo: 'Seet berab bu gëna yomb',
    });
  } else if (signals.needsNearbyCare) {
    options.push({
      fr: 'Chercher un lieu plus proche',
      wo: 'Seet berab bu gëna jege',
    });
  } else if (signals.prefersDiscretion) {
    options.push({
      fr: 'Chercher un lieu discret',
      wo: 'Seet berab bu sutura',
    });
  }

  if (signals.needsReassurance) {
    options.push({
      fr: 'Avancer pas a pas',
      wo: 'Dem ndank ndank',
    });
  }

  return uniqueOptions(options).slice(0, 4);
}

export function detectSensitiveChatIntent(text: string): SensitiveChatIntent | null {
  const normalized = normalizeText(text);

  const intents: [SensitiveChatIntent, string[]][] = [
    [
      'neutral-words',
      [
        'je prefere des mots neutres',
        'mots neutres',
        'begg naa wax yu dal',
      ],
    ],
    [
      'prepare-consultation',
      [
        'preparer ce que je peux dire',
        'waajal li ma men a wax',
      ],
    ],
    [
      'decision-support',
      [
        'comprendre mes marges de decision',
        'xam sama marges de decision',
      ],
    ],
    [
      'discreet-location',
      [
        'chercher un lieu discret',
        'seet berab bu sutura',
      ],
    ],
    [
      'accessible-location',
      [
        'chercher un lieu plus accessible',
        'seet berab bu gena yomb',
      ],
    ],
    [
      'nearby-location',
      [
        'chercher un lieu plus proche',
        'seet berab bu gena jege',
      ],
    ],
    [
      'step-by-step',
      [
        'avancer pas a pas',
        'dem ndank ndank',
      ],
    ],
  ];

  for (const [intent, patterns] of intents) {
    if (patterns.some((pattern) => normalized.includes(pattern))) {
      return intent;
    }
  }

  return null;
}

export function getSensitiveLocationTags(
  session: SensitiveOrientationSession | null | undefined,
  baseTags: string[] = []
) {
  const signals = getSensitiveSignals(session);
  const tags = [...baseTags];

  if (!signals.active) {
    return uniqueStrings(tags);
  }

  if (signals.prefersDiscretion || signals.needsRightsInfo || signals.needsReassurance) {
    tags.push('Conseils');
  }

  if (signals.needsConsultationPrep || signals.needsAffordableCare) {
    tags.push('Planning familial');
  }

  if (signals.needsNearbyCare) {
    tags.push('Consultations');
  }

  return uniqueStrings(tags);
}

export function getSensitiveMapPresets(
  session: SensitiveOrientationSession | null | undefined
) {
  const signals = getSensitiveSignals(session);

  if (!signals.active) {
    return [];
  }

  const presets: SensitiveMapPreset[] = [];

  if (signals.prefersDiscretion) {
    presets.push({
      id: 'discreet',
      labelFr: 'Plus discret',
      labelWo: 'Gëna sutura',
      hintFr: 'Conseils et planning familial avec moins d exposition.',
      hintWo: 'Conseils ak planning familial yu gëna sutura.',
      type: 'ong',
      tags: ['Conseils', 'Planning familial'],
    });
  }

  if (signals.needsAffordableCare) {
    presets.push({
      id: 'accessible',
      labelFr: 'Plus accessible',
      labelWo: 'Gëna yomb',
      hintFr: 'Centres publics ou de premier recours a privilegier.',
      hintWo: 'Centres publics walla premier recours yu nga man a jox solo.',
      type: 'public',
      tags: ['Planning familial'],
    });
  }

  if (signals.needsNearbyCare) {
    presets.push({
      id: 'nearby',
      labelFr: 'Plus proche',
      labelWo: 'Gëna jege',
      hintFr: 'Lieux de proximite pour limiter le deplacement.',
      hintWo: 'Berab yu jege ngir yombal deplacement bi.',
      type: 'poste',
      tags: ['Consultations'],
    });
  }

  if (signals.needsConsultationPrep && presets.length < 3) {
    presets.push({
      id: 'prepare',
      labelFr: 'Premier echange',
      labelWo: 'Wax ju njëkk',
      hintFr: 'Consultations simples pour preparer une suite.',
      hintWo: 'Consultations yu yomb ngir waajal laata beneen yoon.',
      type: null,
      tags: ['Consultations', 'Planning familial'],
    });
  }

  return presets.slice(0, 3);
}

export function getSensitiveMapSummary(
  session: SensitiveOrientationSession | null | undefined,
  language: Language
) {
  const signals = getSensitiveSignals(session);

  if (!signals.active) {
    return null;
  }

  const fr = language === 'fr';
  const parts: string[] = [];

  if (signals.prefersDiscretion) {
    parts.push(
      fr
        ? 'Les lieux axes conseil et discretion remontent davantage.'
        : 'Berab yu jëm ci conseils ak sutura yi dees leen yëkkati.'
    );
  }

  if (signals.needsAffordableCare) {
    parts.push(
      fr
        ? 'Les options publiques ou de premier recours sont aussi privilegiees.'
        : 'Options publiques walla premier recours yi dees leen jox solo it.'
    );
  }

  if (signals.needsNearbyCare) {
    parts.push(
      fr
        ? 'Les structures de proximite sont mises en avant.'
        : 'Structures yu jege yi dees leen jox solo.'
    );
  }

  if (parts.length === 0) {
    parts.push(
      fr
        ? 'Les suggestions tiennent compte de ton dernier contexte sensible.'
        : 'Suggestions yi jàpp nañu sa contexte sensible bu mujj bi.'
    );
  }

  return parts.join(' ');
}

export function scoreHealthCenterForSensitiveOrientation(
  center: HealthCenter,
  session: SensitiveOrientationSession | null | undefined
) {
  const signals = getSensitiveSignals(session);

  if (!signals.active) {
    return 0;
  }

  const tags = center.tags.map((tag) => normalizeText(tag));
  let score = 0;

  if (signals.prefersDiscretion) {
    if (center.type === 'ong') score += 12;
    if (tags.includes('conseils')) score += 8;
    if (tags.includes('planning familial')) score += 4;
  }

  if (signals.needsAffordableCare) {
    if (center.type === 'poste') score += 10;
    if (center.type === 'public') score += 8;
    if (tags.includes('planning familial')) score += 4;
    if (tags.includes('consultations')) score += 3;
  }

  if (signals.needsNearbyCare) {
    if (center.type === 'poste') score += 8;
    if (center.type === 'public') score += 4;
    if (tags.includes('consultations')) score += 5;
  }

  if (signals.needsConsultationPrep) {
    if (tags.includes('consultations')) score += 5;
    if (tags.includes('planning familial')) score += 3;
    if (tags.includes('gynécologie') || tags.includes('gynecologie')) score += 2;
  }

  if (signals.needsRightsInfo) {
    if (tags.includes('conseils')) score += 4;
    if (tags.includes('planning familial')) score += 3;
  }

  if (signals.needsReassurance) {
    if (tags.includes('conseils')) score += 4;
    if (tags.includes('planning familial')) score += 2;
  }

  if (signals.isPriority) {
    if (center.type === 'hopital') score += 2;
    if (tags.includes('urgences')) score += 2;
  }

  return score;
}
