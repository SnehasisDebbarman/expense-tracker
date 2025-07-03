import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

// Types for color scheme
export type ColorScheme = 'light' | 'dark' | 'system';

interface ColorSchemeContextProps {
    colorScheme: 'light' | 'dark';
    mode: ColorScheme;
    setMode: (mode: ColorScheme) => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextProps | undefined>(undefined);

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
    const systemColorScheme = useSystemColorScheme() ?? 'light';
    const [mode, setMode] = useState<ColorScheme>('system');

    const colorScheme = mode === 'system' ? systemColorScheme : mode;

    return (
        <ColorSchemeContext.Provider value={{ colorScheme, mode, setMode }}>
            {children}
        </ColorSchemeContext.Provider>
    );
}

export function useColorScheme() {
    const ctx = useContext(ColorSchemeContext);
    if (!ctx) {
        // fallback to system if not wrapped in provider
        return useSystemColorScheme() ?? 'light';
    }
    return ctx.colorScheme;
}

export function useColorSchemeMode() {
    const ctx = useContext(ColorSchemeContext);
    if (!ctx) {
        return {
            mode: 'system' as ColorScheme,
            setMode: () => { },
        };
    }
    return { mode: ctx.mode, setMode: ctx.setMode };
} 