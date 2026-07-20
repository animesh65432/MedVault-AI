import { Onboarding } from "@/components";
import { toastConfig } from "@/components/toastConfig";
import { AlarmContext, AlarmProvider } from "@/context/Alarm";
import { OnboardingContext, OnboardingProvider } from "@/context/Onboarding";
import { RecentSearchProvider } from "@/context/RecentSearch";
import { migrateDbIfNeeded } from "@/db/database";
import { registerForNotifications } from "@/utils/notifications";
import { useFonts } from "expo-font";
import * as Notifications from 'expo-notifications';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import Toast from "react-native-toast-message";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { IsAlarmActive, OnChangeIsAlarmActive } = useContext(AlarmContext);
  const { IsonboardingComplete } = useContext(OnboardingContext);

  async function CheckNotifications() {
    try {
      const permissionGranted = await registerForNotifications();
      OnChangeIsAlarmActive(permissionGranted)
    } catch (error) {
      console.error('Error registering for notifications:', error);
    }
  }

  useEffect(() => {
    if (IsonboardingComplete) {
      CheckNotifications();
    }
  }, [IsonboardingComplete]);

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
    ><RecentSearchProvider>
        <OnboardingProvider>
          <KeyboardProvider>
            <AlarmProvider>
              <RootLayoutContent />
              <Toast
                config={toastConfig}
              />
              <StatusBar style="auto" />
            </AlarmProvider>
          </KeyboardProvider>
        </OnboardingProvider>
      </RecentSearchProvider>
    </SQLiteProvider>
  );
}
