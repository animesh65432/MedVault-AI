import { Onboarding } from "@/components";
import { DocumentsProvider } from "@/context/Documents";
import DowLoadProvidder, { DownloadContext } from "@/context/DownloadModel";
import { OnboardingContext, OnboardingProvider } from "@/context/Onboarding";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useFonts } from "expo-font";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';
import Download from "./Dowload";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient()

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { IsDownload } = useContext(DownloadContext);
  const { IsonboardingComplete } = useContext(OnboardingContext);

  if (!IsonboardingComplete) {
    return (
      <Onboarding />
    );
  }

  if (!IsDownload) {
    return <Download />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="UploadModal"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
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
    <QueryClientProvider client={queryClient}>
      <DowLoadProvidder>
        <OnboardingProvider>
          <DocumentsProvider  >
            <RootLayoutContent />
            <StatusBar style="auto" />
          </DocumentsProvider>
        </OnboardingProvider>
      </DowLoadProvidder>
    </QueryClientProvider >
  );
}
