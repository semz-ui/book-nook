/**
 * Semantic color tokens for the light-blue + white design system.
 *
 * This object is the raw-value source of truth for native props that cannot take a
 * className (e.g. NativeTabs backgroundColor, SymbolView tintColor). Styling via
 * className is powered by the SAME palette defined as CSS variables in src/global.css.
 * KEEP THE TWO IN SYNC — every value here must match a --color-* var there.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0B1A2B',
    background: '#FFFFFF',
    backgroundElement: '#EAF3FE',
    backgroundSelected: '#DBEBFD',
    textSecondary: '#5A6B82',
    primary: '#208AEF',
    primaryForeground: '#FFFFFF',
    border: '#D0E2F7',
  },
  dark: {
    text: '#F0F6FF',
    background: '#0A1526',
    backgroundElement: '#12233A',
    backgroundSelected: '#1B3050',
    textSecondary: '#9FB4CE',
    primary: '#5CA8FF',
    primaryForeground: '#08111E',
    border: '#24405F',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
