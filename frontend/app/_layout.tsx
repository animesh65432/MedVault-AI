import { useEffect, useContext } from 'react';
import Login from '@/components/login';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { Onboarding } from "@/components";
import { DocumentsProvider } from "@/context/Documents"
import { OnboardingContext, OnboardingProvider } from "@/context/Onboarding";
import { UserProvider, User } from "@/context/User";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { token } = useContext(User);
  const isAuthenticated = !!token;
  const { IsonboardingComplete } = useContext(OnboardingContext);

  if (!IsonboardingComplete) {
    return (
      <Onboarding />
    );
  }

  if (!isAuthenticated) {
    return (
      <Login />
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Aeonik-Thin': require('../assets/fonts/aeonik/Aeonik-Thin.ttf'),
    'Aeonik-Light': require('../assets/fonts/aeonik/Aeonik-Light.ttf'),
    'Aeonik-Regular': require('../assets/fonts/aeonik/Aeonik-Regular.ttf'),
    'Aeonik-Medium': require('../assets/fonts/aeonik/Aeonik-Medium.ttf'),
    'Aeonik-Bold': require('../assets/fonts/aeonik/Aeonik-Bold.ttf'),
    'Aeonik-Black': require('../assets/fonts/aeonik/Aeonik-Black.ttf'),
  });


  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <OnboardingProvider>
      <UserProvider>
        <DocumentsProvider  >
          <RootLayoutContent />
          <StatusBar style="auto" />
        </DocumentsProvider>
      </UserProvider>
    </OnboardingProvider>
  );
}
