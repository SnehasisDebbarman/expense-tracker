import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function BlurTabBarBackground() {
  const theme = useTheme();
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.surface }]}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
