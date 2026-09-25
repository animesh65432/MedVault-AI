import { HapticTab } from '@/components/haptic-tab';
import { scale } from '@/utils/scale';
import { vScale } from '@/utils/vScale';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  background: '#23423B',
  border: '#2D534A',
  active: '#EEF6A2',
  inactive: '#6E827B',
  uploadBg: '#EEF6A2',
  uploadIcon: '#23423B',
};

const BUTTON_SIZE = vScale(60);

function UploadTabButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.uploadButton}
    >
      <Ionicons
        name="add"
        size={scale(30)}
        color={COLORS.uploadIcon}
      />
    </TouchableOpacity>
  );
}

function TabIcon({
  focused,
  iconName,
  label,
}: {
  focused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={[styles.tabIconWrap, focused && styles.focusedTabIconWrap]}>
      <Ionicons
        name={iconName}
        size={scale(22)}
        color={focused ? COLORS.active : COLORS.inactive}
      />
      {focused && (
        <Text style={styles.tabIconLabel}>{label}</Text>
      )}
    </View>
  );
}


export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName={focused ? 'home' : 'home-outline'}
              label="Home"
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
            <UploadTabButton onPress={() => router.push('/UploadModal')} />
          ),
        }}
      />

      <Tabs.Screen
        name="Documents"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconName={focused ? 'folder' : 'folder-open'}
              label="Documents"
            />
          ),
        }}
      />

      <Tabs.Screen name="Alerts" options={{ href: null }} />
      <Tabs.Screen name="Profile" options={{ href: null }} />
      <Tabs.Screen name="Medicines" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: vScale(75),
    paddingTop: vScale(10),
    paddingBottom: vScale(10),
    width: '80%',
    bottom: vScale(80),
    alignSelf: 'center',
    borderRadius: scale(50),
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    elevation: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarLabel: {
    fontFamily: 'Aeonik-Regular',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  uploadButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: COLORS.uploadBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EEF6A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  tabIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    width: '100%',
  },
  tabIconLabel: {
    fontFamily: 'Aeonik-Medium',
    fontSize: scale(12),
    color: COLORS.active,
  },
  focusedTabIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    gap: scale(6),
    width: scale(100),
  },
});