import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Platform } from "react-native";
import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons';

const BRAND_COLORS = {
  background: '#23423B',
  active: '#EEF6A2',
  inactive: '#6E827B',
};

export default function TabLayout() {
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
          title: 'Upload',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              name={focused ? "cloud-upload" : "cloud-upload-outline"}
              color={focused ? BRAND_COLORS.active : BRAND_COLORS.inactive}
            />
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
  }
});