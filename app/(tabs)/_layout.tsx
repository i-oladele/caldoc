import BookmarkFilled from '@/assets/svg/Bookmark_filled.svg';
import Home from '@/assets/svg/Home.svg';
import { Tabs, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type TabBarIconProps = {
  color: string;
  size: number;
};

export default function TabLayout() {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#3D50B5',
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: {
            borderTopColor: 'rgba(0, 0, 0, 0.1)',
            height: Platform.OS === 'ios' ? 88 : 60,
            paddingBottom: Platform.OS === 'ios' ? 28 : 8,
            paddingTop: 8,
          },
          // Enable swipe gestures for navigation
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }: TabBarIconProps) => (
              <Home width={24} height={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color }: TabBarIconProps) => (
              <BookmarkFilled width={24} height={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
