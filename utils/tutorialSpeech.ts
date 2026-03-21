import * as Speech from 'expo-speech';

export function speakTutorialStep(enabled: boolean, title: string, description: string) {
  if (!enabled) {
    return;
  }

  Speech.stop();
  Speech.speak(`${title}. ${description}`, {
    language: 'fr-FR',
    pitch: 1,
    rate: 0.95,
  });
}

export function stopTutorialSpeech() {
  Speech.stop();
}
