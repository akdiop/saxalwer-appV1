import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'saxalwer-expo-clean',
  slug: 'saxalwer-expo-clean',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './app/assets/images/icon.png',
  scheme: 'saxalwerexpoclean',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#F5F1E6',
      foregroundImage: './app/assets/images/adaptive-icon.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    'expo-router',
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
