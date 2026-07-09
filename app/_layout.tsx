import { Onboarding } from "@/components";
import { toastConfig } from "@/components/toastConfig";
import { OnboardingContext, OnboardingProvider } from "@/context/Onboarding";
import { migrateDbIfNeeded } from "@/db/database";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import Toast from "react-native-toast-message";

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { IsonboardingComplete } = useContext(OnboardingContext);

  if (!IsonboardingComplete) {
    return <Onboarding />;
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
    <SQLiteProvider
      databaseName="my-database.db"
      onInit={migrateDbIfNeeded}
    >
      <OnboardingProvider>
        <KeyboardProvider>
          <RootLayoutContent />
          <Toast
            config={toastConfig}
          />
          <StatusBar style="auto" />
        </KeyboardProvider>
      </OnboardingProvider>
    </SQLiteProvider>
  );
}
