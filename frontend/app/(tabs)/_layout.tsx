import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Platform, View, TouchableOpacity } from "react-native";
import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const BRAND_COLORS = {
  background: '#23423B',
  active: '#EEF6A2',
  inactive: '#6E827B',
  uploadBg: '#EEF6A2',
  uploadIcon: '#23423B',
};

function UploadTabButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.uploadWrapper}
    >
      <View style={styles.uploadButton}>
        <Ionicons name="add" size={30} color={BRAND_COLORS.uploadIcon} />
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: BRAND_COLORS.active,
        tabBarInactiveTintColor: BRAND_COLORS.inactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              name={focused ? "home" : "home-outline"}
              color={focused ? BRAND_COLORS.active : BRAND_COLORS.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              name={focused ? "search" : "search-outline"}
              color={focused ? BRAND_COLORS.active : BRAND_COLORS.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Upload"
        options={{
          title: '',
          tabBarIcon: () => null,
          tabBarLabel: () => null,
          tabBarButton: () => (
            <UploadTabButton onPress={() => router.push('/Upload')} />
          ),
        }}
      />

      <Tabs.Screen
        name="Alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              name={focused ? "notifications" : "notifications-outline"}
              color={focused ? BRAND_COLORS.active : BRAND_COLORS.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              name={focused ? "person" : "person-outline"}
              color={focused ? BRAND_COLORS.active : BRAND_COLORS.inactive}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const BUTTON_SIZE = 46;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: BRAND_COLORS.background,
    borderTopWidth: 1,
    borderTopColor: '#2D534A',
    height: Platform.OS === 'ios' ? 88 : 72,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarLabel: {
    fontFamily: "Aeonik-Regular",
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },

  uploadWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -(BUTTON_SIZE / 2),
  },
  uploadButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: BRAND_COLORS.uploadBg,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for lift effect
    shadowColor: '#EEF6A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
});