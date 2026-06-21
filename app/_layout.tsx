import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ProfileMockProvider } from '../context/ProfileMockContext';
import { OnboardingProvider } from '../context/OnboardingContext';
import { AppProvider } from '../context/appcontext';
import { RootLayout } from './layouts/rootlayout';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ProfileMockProvider>
          <OnboardingProvider>
            <RootLayout />
          </OnboardingProvider>
        </ProfileMockProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
