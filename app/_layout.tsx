import { Onboarding } from "@/components";
import ErrorBoundary from "@/components/ErrorBoundary";
import { toastConfig } from "@/components/toastConfig";
import { AlarmContext, AlarmProvider } from "@/context/Alarm";
import { NetworkProvider } from "@/context/Netwrok";
import { OnboardingContext, OnboardingProvider } from "@/context/Onboarding";
import { RecentSearchProvider } from "@/context/RecentSearch";
import { UserNameProvider } from "@/context/UserName";
import { migrateDbIfNeeded } from "@/db/database";
import { registerForNotifications } from "@/utils/notifications";
import { useFonts } from "expo-font";
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
  const router = useRouter();
  const { OnChangeIsAlarmActive } = useContext(AlarmContext);
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

  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then((response) => {
      const data = response?.notification.request.content.data;
      if (data?.reminderId) {
        router.push(`/AlertDetails/${data.reminderId}`);
      }
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.reminderId) {
          router.push(`/AlertDetails/${data.reminderId}`);
        }
      }
    );

    return () => subscription.remove();
  }, [router]);

  if (!IsonboardingComplete) {
    return <Onboarding />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
        <Stack.Screen
          name="Chat"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: false,
            gestureEnabled: true,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
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
    <ErrorBoundary>
      <SQLiteProvider
        databaseName="my-database.db"
        onInit={migrateDbIfNeeded}
      ><NetworkProvider>
          <RecentSearchProvider>
            <OnboardingProvider>
              <KeyboardProvider>
                <AlarmProvider>
                  <UserNameProvider>
                    <RootLayoutContent />
                    <Toast
                      config={toastConfig}
                    />
                    <StatusBar style="auto" />
                  </UserNameProvider>
                </AlarmProvider>
              </KeyboardProvider>
            </OnboardingProvider>
          </RecentSearchProvider>
        </NetworkProvider>
      </SQLiteProvider>
    </ErrorBoundary>
  );
}
