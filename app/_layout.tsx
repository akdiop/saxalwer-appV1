import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OnboardingProvider } from '../context/OnboardingContext';
import { AppProvider } from '../context/appcontext';
import RootLayout from './layouts/rootlayout';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <OnboardingProvider>
          <RootLayout />
        </OnboardingProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
