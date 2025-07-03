/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { MD3DarkTheme as PaperDarkTheme } from 'react-native-paper';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const HackerTheme = {
  ...PaperDarkTheme,
  dark: true,
  colors: {
    ...PaperDarkTheme.colors,
    background: '#0a0a0a',
    surface: '#181818',
    primary: '#39ff14',
    accent: '#00fff7',
    text: '#39ff14',
    placeholder: '#00fff7',
    border: '#39ff14',
    card: '#181818',
    error: '#ff0055',
    notification: '#00fff7',
    disabled: '#222',
    onSurface: '#fff',
    outline: '#39ff14',
  },
  fonts: {
    ...PaperDarkTheme.fonts,
    regular: { fontFamily: 'SpaceMono', fontWeight: '400' as const },
    medium: { fontFamily: 'SpaceMono', fontWeight: '500' as const },
    light: { fontFamily: 'SpaceMono', fontWeight: '300' as const },
    thin: { fontFamily: 'SpaceMono', fontWeight: '200' as const },
    bold: { fontFamily: 'SpaceMono', fontWeight: '700' as const },
    heavy: { fontFamily: 'SpaceMono', fontWeight: '900' as const },
    titleLarge: { fontFamily: 'SpaceMono', fontWeight: '700' as const },
    bodyMedium: { fontFamily: 'SpaceMono', fontWeight: '400' as const },
  },
};
