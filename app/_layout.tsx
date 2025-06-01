import { CustomSplash } from '@/components/CustomSplash';
import { FavoritesProvider } from '@/context/FavoritesContext';
import {
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    useFonts
} from '@expo-google-fonts/dm-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  const [isCustomSplashVisible, setIsCustomSplashVisible] = useState(true);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the native splash screen
      SplashScreen.hideAsync();
      // Set a timeout to hide the custom splash after 2 seconds
      const timer = setTimeout(() => {
        setIsCustomSplashVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError]);

  // Don't render anything until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <FavoritesProvider>
      <View style={styles.container}>
        <StatusBar style={isCustomSplashVisible ? "light" : "dark"} />
        {isCustomSplashVisible ? (
          <CustomSplash />
        ) : (
          <View style={styles.contentContainer}>
            <Stack screenOptions={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(calculator)" options={{ headerShown: false }} />
            </Stack>
          </View>
        )}
      </View>
    </FavoritesProvider>
  );
}
