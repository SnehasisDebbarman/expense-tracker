import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { FAB, Provider as PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import AddExpenseModal from '../src/components/AddExpenseModal';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [modalVisible, setModalVisible] = React.useState(false);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <AddExpenseModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onExpenseAdded={() => { }}
        />
        <FAB
          icon="plus"
          style={{ position: 'absolute', right: 24, bottom: 90, zIndex: 1000 }}
          onPress={() => setModalVisible(true)}
          label="Add"
        />
      </ThemeProvider>
    </PaperProvider>
  );
}
