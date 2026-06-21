import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ActionTrackingProvider } from '../context/ActionTrackingContext';
import { AppProvider } from '../context/appcontext';
import { ModesProvider } from '../context/ModesContext';
import { OnboardingProvider } from '../context/OnboardingContext';
import { ProfileMockProvider } from '../context/ProfileMockContext';
import { RootLayout } from './layouts/rootlayout';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ProfileMockProvider>
          <OnboardingProvider>
            <ModesProvider>
              <ActionTrackingProvider>
                <RootLayout />
              </ActionTrackingProvider>
            </ModesProvider>
          </OnboardingProvider>
        </ProfileMockProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
