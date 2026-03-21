import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    CommunityMessage,
    CommunityProfile,
    DEFAULT_COMMUNITY_PROFILE,
    THEMATIC_ROOMS,
} from '../data/community';

const COMMUNITY_PROFILE_KEY = 'saxalwer_community_profile';
const COMMUNITY_USER_ID_KEY = 'saxalwer_community_user_id';
const COMMUNITY_MESSAGES_KEY = 'saxalwer_community_messages';

const projectId = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID;
const publicAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLIC_ANON_KEY;
const hasRemoteApi = Boolean(projectId && publicAnonKey);

type MessageStore = Record<string, CommunityMessage[]>;

type SendMessageInput = {
  roomId: string;
  userId: string;
  userName: string;
  text: string;
  isAnonymous: boolean;
};

const buildApiUrl = (path: string) => {
  return `https://${projectId}.supabase.co/functions/v1/make-server-1aeea177${path}`;
};

const makeId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const getSeedMessages = (): MessageStore => {
  const now = Date.now();

  return {
    endometriose: [
      {
        id: makeId(),
        roomId: 'endometriose',
        userId: 'seed_1',
        userName: 'Awa',
        text: "Je gere mieux les douleurs avec des pauses et une bouillotte. Et vous ?",
        timestamp: now - 3600000,
        isAnonymous: false,
      },
    ],
    contraception: [
      {
        id: makeId(),
        roomId: 'contraception',
        userId: 'seed_2',
        userName: 'Anonyme',
        text: 'J hesite entre implant et pilule, vos retours m aideraient.',
        timestamp: now - 2200000,
        isAnonymous: true,
      },
    ],
    maternite: [],
    menopause: [],
    intimite: [],
    soutien: [],
  };
};

const ensureMessageStore = async (): Promise<MessageStore> => {
  const raw = await AsyncStorage.getItem(COMMUNITY_MESSAGES_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as MessageStore;
      return parsed;
    } catch {
      await AsyncStorage.removeItem(COMMUNITY_MESSAGES_KEY);
    }
  }

  const seeded = getSeedMessages();
  await AsyncStorage.setItem(COMMUNITY_MESSAGES_KEY, JSON.stringify(seeded));
  return seeded;
};

const saveMessageStore = async (store: MessageStore) => {
  await AsyncStorage.setItem(COMMUNITY_MESSAGES_KEY, JSON.stringify(store));
};

export const getCommunityProfile = async (): Promise<CommunityProfile> => {
  const raw = await AsyncStorage.getItem(COMMUNITY_PROFILE_KEY);
  if (!raw) {
    return DEFAULT_COMMUNITY_PROFILE;
  }

  try {
    return {
      ...DEFAULT_COMMUNITY_PROFILE,
      ...(JSON.parse(raw) as Partial<CommunityProfile>),
    };
  } catch {
    return DEFAULT_COMMUNITY_PROFILE;
  }
};

export const saveCommunityProfile = async (profile: CommunityProfile) => {
  await AsyncStorage.setItem(COMMUNITY_PROFILE_KEY, JSON.stringify(profile));
};

export const getCommunityUserId = async (fallbackName: string) => {
  const raw = await AsyncStorage.getItem(COMMUNITY_USER_ID_KEY);
  if (raw) {
    return raw;
  }

  const generated = `${fallbackName || 'user'}_${Math.random().toString(36).slice(2, 11)}`;
  await AsyncStorage.setItem(COMMUNITY_USER_ID_KEY, generated);
  return generated;
};

export const loadRoomMessages = async (roomId: string): Promise<CommunityMessage[]> => {
  if (hasRemoteApi) {
    try {
      const response = await fetch(buildApiUrl(`/rooms/${roomId}/messages`), {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });

      if (response.ok) {
        const data = (await response.json()) as { messages?: CommunityMessage[] };
        return data.messages ?? [];
      }
    } catch {
      // Fall back to local storage when network calls fail.
    }
  }

  const store = await ensureMessageStore();
  return [...(store[roomId] ?? [])].sort((a, b) => a.timestamp - b.timestamp);
};

export const joinCommunityRoom = async (roomId: string, userId: string, userName: string) => {
  if (!hasRemoteApi) {
    return;
  }

  try {
    await fetch(buildApiUrl('/rooms/join'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ roomId, userId, userName }),
    });
  } catch {
    // Silent fail to preserve chat usability in local mode.
  }
};

export const sendRoomMessage = async (input: SendMessageInput): Promise<CommunityMessage | null> => {
  if (hasRemoteApi) {
    try {
      const response = await fetch(buildApiUrl(`/rooms/${input.roomId}/messages`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          userId: input.userId,
          userName: input.userName,
          text: input.text,
          isAnonymous: input.isAnonymous,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as { message?: CommunityMessage };
        return data.message ?? null;
      }
    } catch {
      // Fall back to local storage when network calls fail.
    }
  }

  const store = await ensureMessageStore();
  const nextMessage: CommunityMessage = {
    id: makeId(),
    roomId: input.roomId,
    userId: input.userId,
    userName: input.userName,
    text: input.text,
    isAnonymous: input.isAnonymous,
    timestamp: Date.now(),
  };

  const previous = store[input.roomId] ?? [];
  const nextStore = {
    ...store,
    [input.roomId]: [...previous, nextMessage],
  };
  await saveMessageStore(nextStore);

  return nextMessage;
};

export const reportMessage = async (messageId: string, userId: string) => {
  if (hasRemoteApi) {
    try {
      await fetch(buildApiUrl(`/messages/${messageId}/report`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          userId,
          reason: 'inappropriate',
        }),
      });
      return;
    } catch {
      // Keep local fallback path below.
    }
  }

  const key = `saxalwer_reported_${messageId}`;
  await AsyncStorage.setItem(key, JSON.stringify({ reportedAt: Date.now(), userId }));
};

export const roomById = (roomId: string) => THEMATIC_ROOMS.find((room) => room.id === roomId);
