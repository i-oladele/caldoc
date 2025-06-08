import { useFavorites } from '@/context/FavoritesContext';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Platform, TouchableOpacity } from 'react-native';
import Bookmark from '../../assets/svg/Bookmark.svg';
import BookmarkFilled from '../../assets/svg/Bookmark_filled.svg';

export default function CalculatorLayout() {
  const { id } = useLocalSearchParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const isBookmarked = isFavorite(id as string);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#3D50B5',
        headerTitleStyle: {
          fontFamily: 'DMSans_600SemiBold',
          fontSize: 17,
        },
        headerShadowVisible: false,
        ...Platform.select({
          ios: {
            headerLargeTitle: true,
            headerLargeTitleStyle: {
              fontFamily: 'DMSans_700Bold',
            },
          },
        }),
      }}>
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Calculator',
          presentation: 'card',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => toggleFavorite(id as string)}
              style={{ marginRight: 16 }}
            >
              {isBookmarked ? (
                <BookmarkFilled width={24} height={24} color="#3D50B5" />
              ) : (
                <Bookmark width={24} height={24} color="#3D50B5" />
              )}
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
} 