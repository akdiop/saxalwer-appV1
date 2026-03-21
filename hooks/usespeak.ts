import * as Speech from 'expo-speech';
import { useCallback, useRef } from 'react';

import { useApp } from '../context/appcontext';

/**
 * useSpeak - TTS hook for oral mode using expo-speech.
 */
export function useSpeak() {
	const { oralMode, language } = useApp();
	const speakingRef = useRef(false);

	const speak = useCallback(
		(text: string) => {
			if (!oralMode) return;

			Speech.stop();
			speakingRef.current = true;

			Speech.speak(text, {
				language: language === 'wo' ? 'fr-FR' : 'fr-FR',
				rate: 0.85,
				pitch: 1.0,
				onDone: () => {
					speakingRef.current = false;
				},
				onStopped: () => {
					speakingRef.current = false;
				},
				onError: () => {
					speakingRef.current = false;
				},
			});
		},
		[oralMode, language]
	);

	const stop = useCallback(() => {
		Speech.stop();
		speakingRef.current = false;
	}, []);

	const speakAndDo = useCallback(
		(text: string, action: () => void, delay = 600) => {
			if (!oralMode) {
				action();
				return;
			}

			speak(text);
			setTimeout(action, delay);
		},
		[oralMode, speak]
	);

	return { speak, stop, speakAndDo, isSpeaking: speakingRef };
}
