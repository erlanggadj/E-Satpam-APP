import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBackgroundSync } from '@/hooks/useBackgroundSync';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSegments } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useBackgroundSync();
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();

  const { isAuthenticated, initAuth } = useAuthStore();
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    initAuth().then(() => setAuthInitialized(true));
  }, []);

  const [loaded] = useFonts({
    Inter: Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'JetBrains Mono': JetBrainsMono_400Regular,
    'JetBrains Mono-Bold': JetBrainsMono_700Bold,
  });

  useEffect(() => {
    if (loaded && authInitialized) {
      SplashScreen.hideAsync();

      const inAuthGroup = segments[0] === '(auth)';
      if (!isAuthenticated && !inAuthGroup) {
        // Redirect to login if not authenticated and trying to access protected routes
        router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
        // Redirect to tabs if authenticated but viewing login screens
        router.replace('/(tabs)');
      }
    }
  }, [loaded, authInitialized, isAuthenticated, segments]);

  if (!loaded || !authInitialized) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
