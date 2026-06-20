import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  CommunityMessage,
  CommunityProfile,
  DEFAULT_COMMUNITY_PROFILE,
  THEMATIC_ROOMS,
} from '../data/community';
import { supabaseConfig } from '../lib/supabase';

const COMMUNITY_PROFILE_KEY = 'saxalwer_community_profile';
const COMMUNITY_USER_ID_KEY = 'saxalwer_community_user_id';
const COMMUNITY_MESSAGES_KEY = 'saxalwer_community_messages';
const COMMUNITY_QUEUE_KEY = 'saxalwer_community_message_queue';

const publicAnonKey = supabaseConfig.publicKey;
const functionsBaseUrl = supabaseConfig.functionsBaseUrl;

export const communityHasRemoteApi = Boolean(functionsBaseUrl && publicAnonKey);

type MessageStore = Record<string, CommunityMessage[]>;

type SendMessageInput = {
  roomId: string;
  userId: string;
  userName: string;
  text: string;
  isAnonymous: boolean;
};

type CommunityApiOptions = {
  offline?: boolean;
};

type QueuedMessage = SendMessageInput & {
  localId: string;
  queuedAt: number;
};

const buildApiUrl = (path: string) => {
  return `${functionsBaseUrl}/make-server-1aeea177${path}`;
};

const makeId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const normalizeRemoteMessage = (message: CommunityMessage): CommunityMessage => ({
  ...message,
  syncStatus: 'synced',
});

const sortMessages = (messages: CommunityMessage[]) => {
  return [...messages].sort((a, b) => a.timestamp - b.timestamp);
};

const mergeMessages = (...groups: CommunityMessage[][]) => {
  const byId = new Map<string, CommunityMessage>();

  for (const group of groups) {
    for (const message of group) {
      byId.set(message.id, message);
    }
  }

  return sortMessages([...byId.values()]);
};

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
        syncStatus: 'synced',
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
        syncStatus: 'synced',
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

const getQueuedMessages = async (): Promise<QueuedMessage[]> => {
  const raw = await AsyncStorage.getItem(COMMUNITY_QUEUE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as QueuedMessage[];
  } catch {
    await AsyncStorage.removeItem(COMMUNITY_QUEUE_KEY);
    return [];
  }
};

const saveQueuedMessages = async (queue: QueuedMessage[]) => {
  await AsyncStorage.setItem(COMMUNITY_QUEUE_KEY, JSON.stringify(queue));
};

const upsertRoomMessages = async (roomId: string, nextMessages: CommunityMessage[]) => {
  const store = await ensureMessageStore();
  const nextStore = {
    ...store,
    [roomId]: sortMessages(nextMessages),
  };

  await saveMessageStore(nextStore);
  return nextStore[roomId];
};

const getRoomMessagesFromStore = async (roomId: string) => {
  const store = await ensureMessageStore();
  return sortMessages(store[roomId] ?? []);
};

const queueLocalMessage = async (message: CommunityMessage) => {
  const queue = await getQueuedMessages();

  await saveQueuedMessages([
    ...queue,
    {
      localId: message.id,
      queuedAt: Date.now(),
      roomId: message.roomId,
      userId: message.userId,
      userName: message.userName,
      text: message.text,
      isAnonymous: message.isAnonymous,
    },
  ]);
};

const replaceQueuedMessage = async (
  roomId: string,
  localId: string,
  nextMessage: CommunityMessage
) => {
  const currentMessages = await getRoomMessagesFromStore(roomId);
  const withoutLocal = currentMessages.filter((message) => message.id !== localId);
  await upsertRoomMessages(roomId, mergeMessages(withoutLocal, [nextMessage]));
};

const sendRemoteMessage = async (input: SendMessageInput) => {
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

  if (!response.ok) {
    throw new Error('Unable to send room message');
  }

  const data = (await response.json()) as { message?: CommunityMessage };
  return data.message ? normalizeRemoteMessage(data.message) : null;
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

export const loadRoomMessages = async (
  roomId: string,
  options: CommunityApiOptions = {}
): Promise<CommunityMessage[]> => {
  const localMessages = await getRoomMessagesFromStore(roomId);

  if (!communityHasRemoteApi || options.offline) {
    return localMessages;
  }

  try {
    const response = await fetch(buildApiUrl(`/rooms/${roomId}/messages`), {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });

    if (response.ok) {
      const data = (await response.json()) as { messages?: CommunityMessage[] };
      const remoteMessages = (data.messages ?? []).map(normalizeRemoteMessage);
      const unsyncedLocalMessages = localMessages.filter(
        (message) => message.syncStatus === 'pending' || message.syncStatus === 'local-only'
      );
      const merged = mergeMessages(remoteMessages, unsyncedLocalMessages);

      await upsertRoomMessages(roomId, merged);
      return merged;
    }
  } catch {
    // Fall back to local storage when network calls fail.
  }

  return localMessages;
};

export const joinCommunityRoom = async (
  roomId: string,
  userId: string,
  userName: string,
  options: CommunityApiOptions = {}
) => {
  if (!communityHasRemoteApi || options.offline) {
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

export const sendRoomMessage = async (
  input: SendMessageInput,
  options: CommunityApiOptions = {}
): Promise<CommunityMessage | null> => {
  if (communityHasRemoteApi && !options.offline) {
    try {
      const nextMessage = await sendRemoteMessage(input);

      if (nextMessage) {
        const roomMessages = await getRoomMessagesFromStore(input.roomId);
        await upsertRoomMessages(input.roomId, mergeMessages(roomMessages, [nextMessage]));
      }

      return nextMessage;
    } catch {
      // Fall back to local queue below.
    }
  }

  const syncStatus = communityHasRemoteApi ? 'pending' : 'local-only';
  const nextMessage: CommunityMessage = {
    id: makeId(),
    roomId: input.roomId,
    userId: input.userId,
    userName: input.userName,
    text: input.text,
    isAnonymous: input.isAnonymous,
    timestamp: Date.now(),
    syncStatus,
  };

  const roomMessages = await getRoomMessagesFromStore(input.roomId);
  await upsertRoomMessages(input.roomId, mergeMessages(roomMessages, [nextMessage]));

  if (syncStatus === 'pending') {
    await queueLocalMessage(nextMessage);
  }

  return nextMessage;
};

export const syncQueuedRoomMessages = async () => {
  if (!communityHasRemoteApi) {
    return;
  }

  const queue = await getQueuedMessages();

  if (queue.length === 0) {
    return;
  }

  const remaining: QueuedMessage[] = [];

  for (const queuedMessage of queue) {
    try {
      const syncedMessage = await sendRemoteMessage(queuedMessage);

      if (syncedMessage) {
        await replaceQueuedMessage(queuedMessage.roomId, queuedMessage.localId, syncedMessage);
        continue;
      }
    } catch {
      // Keep the message in queue for the next sync cycle.
    }

    remaining.push(queuedMessage);
  }

  await saveQueuedMessages(remaining);
};

export const reportMessage = async (
  messageId: string,
  userId: string,
  options: CommunityApiOptions = {}
) => {
  if (communityHasRemoteApi && !options.offline) {
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
