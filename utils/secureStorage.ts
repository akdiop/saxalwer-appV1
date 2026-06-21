import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Keep chunks well below SecureStore's 2048-byte limit, even for multi-byte characters.
const CHUNK_SIZE = 600;
const SECURE_KEY_PREFIX = 'saxalwer.secure';
const MANIFEST_SUFFIX = '.__manifest__';
const CHUNK_SUFFIX = '.__chunk__.';

type SecureManifest = {
	version: 1;
	chunks: number;
};

const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
	keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

const isNativeSecureStorage = Platform.OS === 'ios' || Platform.OS === 'android';

const sanitizeKey = (key: string) =>
	key.replace(/[^A-Za-z0-9._-]/g, (character) => {
		const codePoint = character.codePointAt(0)?.toString(16) ?? '0';
		return `_x${codePoint}_`;
	});

const getSecureBaseKey = (key: string) => `${SECURE_KEY_PREFIX}.${sanitizeKey(key)}`;
const getManifestKey = (key: string) => `${getSecureBaseKey(key)}${MANIFEST_SUFFIX}`;
const getChunkKey = (key: string, index: number) => `${getSecureBaseKey(key)}${CHUNK_SUFFIX}${index}`;

const splitIntoChunks = (value: string) => {
	if (value.length <= CHUNK_SIZE) {
		return [value];
	}

	const chunks: string[] = [];

	for (let start = 0; start < value.length; start += CHUNK_SIZE) {
		chunks.push(value.slice(start, start + CHUNK_SIZE));
	}

	return chunks;
};

const readManifest = async (key: string): Promise<SecureManifest | null> => {
	const raw = await SecureStore.getItemAsync(getManifestKey(key), SECURE_STORE_OPTIONS);

	if (!raw) {
		return null;
	}

	try {
		const parsed = JSON.parse(raw) as Partial<SecureManifest>;

		if (parsed.version === 1 && typeof parsed.chunks === 'number' && parsed.chunks > 0) {
			return { version: 1, chunks: parsed.chunks };
		}
	} catch {
		// Ignore corrupted metadata and fall back to legacy reads below.
	}

	return null;
};

const removeNativeSecureItem = async (key: string) => {
	const manifest = await readManifest(key);

	await SecureStore.deleteItemAsync(getSecureBaseKey(key), SECURE_STORE_OPTIONS);
	await SecureStore.deleteItemAsync(getManifestKey(key), SECURE_STORE_OPTIONS);

	if (!manifest) {
		return;
	}

	for (let index = 0; index < manifest.chunks; index += 1) {
		await SecureStore.deleteItemAsync(getChunkKey(key, index), SECURE_STORE_OPTIONS);
	}
};

const getNativeSecureItem = async (key: string) => {
	const manifest = await readManifest(key);

	if (!manifest) {
		return SecureStore.getItemAsync(getSecureBaseKey(key), SECURE_STORE_OPTIONS);
	}

	const chunks: string[] = [];

	for (let index = 0; index < manifest.chunks; index += 1) {
		const chunk = await SecureStore.getItemAsync(getChunkKey(key, index), SECURE_STORE_OPTIONS);

		if (chunk == null) {
			return null;
		}

		chunks.push(chunk);
	}

	return chunks.join('');
};

const setNativeSecureItem = async (key: string, value: string) => {
	const previousManifest = await readManifest(key);
	const chunks = splitIntoChunks(value);

	if (chunks.length === 1) {
		await SecureStore.setItemAsync(getSecureBaseKey(key), value, SECURE_STORE_OPTIONS);
		await SecureStore.deleteItemAsync(getManifestKey(key), SECURE_STORE_OPTIONS);

		if (previousManifest) {
			for (let index = 0; index < previousManifest.chunks; index += 1) {
				await SecureStore.deleteItemAsync(getChunkKey(key, index), SECURE_STORE_OPTIONS);
			}
		}
	} else {
		for (let index = 0; index < chunks.length; index += 1) {
			await SecureStore.setItemAsync(getChunkKey(key, index), chunks[index], SECURE_STORE_OPTIONS);
		}

		await SecureStore.setItemAsync(
			getManifestKey(key),
			JSON.stringify({ version: 1, chunks: chunks.length } satisfies SecureManifest),
			SECURE_STORE_OPTIONS
		);
		await SecureStore.deleteItemAsync(getSecureBaseKey(key), SECURE_STORE_OPTIONS);

		if (previousManifest && previousManifest.chunks > chunks.length) {
			for (let index = chunks.length; index < previousManifest.chunks; index += 1) {
				await SecureStore.deleteItemAsync(getChunkKey(key, index), SECURE_STORE_OPTIONS);
			}
		}
	}
};

const migrateLegacyAsyncStorageItem = async (key: string) => {
	const legacyValue = await AsyncStorage.getItem(key);

	if (legacyValue == null) {
		return null;
	}

	await setNativeSecureItem(key, legacyValue);
	await AsyncStorage.removeItem(key);
	return legacyValue;
};

export const secureStorage = {
	async getItem(key: string) {
		if (!isNativeSecureStorage) {
			return AsyncStorage.getItem(key);
		}

		try {
			const secureValue = await getNativeSecureItem(key);

			if (secureValue != null) {
				return secureValue;
			}

			return migrateLegacyAsyncStorageItem(key);
		} catch (error) {
			console.error(`Failed to read secure item "${key}"`, error);
			return AsyncStorage.getItem(key);
		}
	},
	async setItem(key: string, value: string) {
		if (!isNativeSecureStorage) {
			await AsyncStorage.setItem(key, value);
			return;
		}

		try {
			await setNativeSecureItem(key, value);
			await AsyncStorage.removeItem(key);
		} catch (error) {
			console.error(`Failed to save secure item "${key}"`, error);
			await AsyncStorage.setItem(key, value);
		}
	},
	async removeItem(key: string) {
		if (!isNativeSecureStorage) {
			await AsyncStorage.removeItem(key);
			return;
		}

		try {
			await removeNativeSecureItem(key);
		} catch (error) {
			console.error(`Failed to remove secure item "${key}"`, error);
		} finally {
			await AsyncStorage.removeItem(key);
		}
	},
	async getJSON<T>(key: string): Promise<T | null> {
		const raw = await secureStorage.getItem(key);

		if (!raw) {
			return null;
		}

		try {
			return JSON.parse(raw) as T;
		} catch (error) {
			console.error(`Failed to parse secure JSON item "${key}"`, error);
			return null;
		}
	},
	async setJSON(key: string, value: unknown) {
		await secureStorage.setItem(key, JSON.stringify(value));
	},
};

export const secureStorageAdapter = {
	getItem: (key: string) => secureStorage.getItem(key),
	setItem: (key: string, value: string) => secureStorage.setItem(key, value),
	removeItem: (key: string) => secureStorage.removeItem(key),
};
