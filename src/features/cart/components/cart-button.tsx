/**
 * VIEW — header cart button with a live item-count badge.
 * The badge "bumps" (scales up then back) each time the count increases,
 * landing right as the fly-to-cart ghost arrives.
 */

import { SymbolView } from 'expo-symbols';
import { Link } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { useCartCount } from '@/features/cart/viewmodels/use-cart';
import { useTheme } from '@/hooks/use-theme';

export function CartButton() {
  const count = useCartCount();
  const theme = useTheme();
  const scale = useSharedValue(1);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      scale.value = withSequence(
        withTiming(1.4, { duration: 150 }),
        withTiming(1, { duration: 150 }),
      );
    }
    prevCount.current = count;
  }, [count, scale]);

  const badgeStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Link href="/cart" asChild>
      <Pressable
        className="mr-three px-one py-one active:opacity-60"
        accessibilityRole="button"
        accessibilityLabel={`Cart, ${count} items`}>
        <SymbolView
          tintColor={theme.text}
          name={{ ios: 'cart', android: 'shopping_cart', web: 'shopping_cart' }}
          size={24}
        />
        {count > 0 && (
          <Animated.View
            style={badgeStyle}
            className="absolute -right-1 -top-1 min-w-[18px] items-center justify-center rounded-full bg-primary px-1">
            <ThemedText themeColor="primaryForeground" className="text-[11px] font-bold leading-[16px]">
              {count > 99 ? '99+' : count}
            </ThemedText>
          </Animated.View>
        )}
      </Pressable>
    </Link>
  );
}
