import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'SaxalWér',
  slug: 'saxalwer-app-v1',
  version: '1.0.0',
  sdkVersion: '56.0.0',
  orientation: 'portrait',
  icon: './app/assets/images/icon.png',
  scheme: 'saxalwer',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#F5F1E6',
      foregroundImage: './app/assets/images/adaptive-icon.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'single',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-splash-screen',
      {
        image: './app/assets/images/splash.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#F5F1E6',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
