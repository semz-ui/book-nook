import { Platform, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
  className?: string;
};

const typeClasses: Record<NonNullable<ThemedTextProps['type']>, string> = {
  default: 'text-[16px] leading-[24px] font-medium',
  title: 'text-[48px] leading-[52px] font-semibold',
  small: 'text-[14px] leading-[20px] font-medium',
  smallBold: 'text-[14px] leading-[20px] font-bold',
  subtitle: 'text-[32px] leading-[44px] font-semibold',
  link: 'text-[14px] leading-[30px]',
  linkPrimary: 'text-[14px] leading-[30px] text-primary',
  code: 'text-[12px]',
};

const colorClasses: Record<ThemeColor, string> = {
  text: 'text-foreground',
  background: 'text-background',
  backgroundElement: 'text-element',
  backgroundSelected: 'text-selected',
  textSecondary: 'text-secondary',
  primary: 'text-primary',
  primaryForeground: 'text-primary-foreground',
  border: 'text-border',
};

export function ThemedText({
  className,
  style,
  type = 'default',
  themeColor,
  ...rest
}: ThemedTextProps) {
  // linkPrimary carries its own color; otherwise fall back to the requested theme color / foreground.
  const colorClass = type === 'linkPrimary' && !themeColor ? '' : colorClasses[themeColor ?? 'text'];

  return (
    <Text
      className={[colorClass, typeClasses[type], className].filter(Boolean).join(' ')}
      // Mono font family can't be expressed as a CSS-var className on native.
      style={[
        type === 'code' && {
          fontFamily: Fonts.mono,
          fontWeight: Platform.select({ android: '700' as const }) ?? ('500' as const),
        },
        style,
      ]}
      {...rest}
    />
  );
}
