import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
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
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/useAuthStore';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Menahan splash screen agar tidak hilang otomatis
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  const [loaded] = useFonts({
    Inter: Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'JetBrains Mono': JetBrainsMono_400Regular,
    'JetBrains Mono-Bold': JetBrainsMono_700Bold,
  });

  // Hapus useEffect pertama yang hanya menutup splash screen berdasarkan 'loaded'.
  // Kita satukan logikanya di bawah ini:

  useEffect(() => {
    // Jika font belum dimuat, jangan lakukan apa-apa
    if (!loaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    // Logika pengalihan rute
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }

    // Sembunyikan splash screen SETELAH logika routing selesai diputuskan.
    // Menggunakan setTimeout kecil memberikan waktu bagi router untuk 
    // me-render halaman tujuan sebelum splash screen benar-benar diangkat.
    const hideSplash = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 100);

    return () => clearTimeout(hideSplash);
  }, [isAuthenticated, segments, loaded]);

  if (!loaded) {
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