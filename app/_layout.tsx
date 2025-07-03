import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { FAB, Provider as PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { ColorSchemeProvider, useColorScheme } from '@/hooks/useColorScheme';
import { Colors, HackerTheme } from '../constants/Colors';

function AppContent() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? HackerTheme : { ...HackerTheme, dark: false, colors: { ...Colors.light, ...HackerTheme.colors } };

  const handleAddExpense = () => {
    router.push('/add-expense');
  };

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <FAB
          icon="plus"
          style={{ position: 'absolute', right: 24, bottom: 90, zIndex: 1000, backgroundColor: '#181818', borderColor: '#39ff14', borderWidth: 2 }}
          onPress={handleAddExpense}
          label="Add"
          color="#39ff14"
        />
      </ThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ColorSchemeProvider>
      <AppContent />
    </ColorSchemeProvider>
  );
}
