/**
 * VIEW — "Add to Cart" button that adds the book AND launches the fly-to-cart
 * animation from the button's on-screen position.
 */

import { SymbolView } from 'expo-symbols';
import { useRef } from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Book } from '@/features/books/models/book';
import { useFlyToCart } from '@/features/cart/components/fly-to-cart';
import { useCart } from '@/features/cart/viewmodels/use-cart';
import { useTheme } from '@/hooks/use-theme';

export function AddToCartButton({ book }: { book: Book }) {
  const { addItem } = useCart();
  const { flyToCart } = useFlyToCart();
  const theme = useTheme();
  const ref = useRef<View>(null);

  const handlePress = () => {
    // Measure where the button is, then launch the ghost from there.
    ref.current?.measureInWindow((x, y, w) => {
      flyToCart({ coverUrl: book.coverUrl, startX: x + w / 2 - 24, startY: y });
    });
    addItem(book);
  };

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
      className="flex-row items-center justify-center gap-two rounded-full bg-primary py-three active:opacity-70"
      style={{ boxShadow: '0 6px 16px rgba(32,138,239,0.35)' }}
      accessibilityRole="button"
      accessibilityLabel={`Add ${book.title} to cart`}>
      <SymbolView
        tintColor={theme.primaryForeground}
        name={{ ios: 'cart.badge.plus', android: 'add_shopping_cart', web: 'add_shopping_cart' }}
        size={18}
      />
      <ThemedText themeColor="primaryForeground" type="smallBold">
        Add to Cart
      </ThemedText>
    </Pressable>
  );
}
