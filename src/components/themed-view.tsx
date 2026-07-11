import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  type?: ThemeColor;
  className?: string;
};

const bgClasses: Record<ThemeColor, string> = {
  text: 'bg-foreground',
  background: 'bg-background',
  backgroundElement: 'bg-element',
  backgroundSelected: 'bg-selected',
  textSecondary: 'bg-secondary',
  primary: 'bg-primary',
  primaryForeground: 'bg-primary-foreground',
  border: 'bg-border',
};

export function ThemedView({ className, type, ...otherProps }: ThemedViewProps) {
  return (
    <View className={[bgClasses[type ?? 'background'], className].filter(Boolean).join(' ')} {...otherProps} />
  );
}
