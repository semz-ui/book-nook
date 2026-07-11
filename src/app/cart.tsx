/**
 * VIEW — Cart screen. Thin over the cart ViewModel.
 */

import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CartItemRow } from '@/features/cart/components/cart-item-row';
import { CartSummary } from '@/features/cart/components/cart-summary';
import type { CartItem } from '@/features/cart/models/cart';
import { useCart } from '@/features/cart/viewmodels/use-cart';
import { useTheme } from '@/hooks/use-theme';

export default function CartScreen() {
  const { items, totalItems, totalPrice, incrementQty, decrementQty, removeItem } = useCart();
  const theme = useTheme();

  if (items.length === 0) {
    return (
      <ThemedView className="flex-1 items-center justify-center gap-three px-four">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-element">
          <SymbolView
            tintColor={theme.textSecondary}
            name={{ ios: 'cart', android: 'shopping_cart', web: 'shopping_cart' }}
            size={36}
          />
        </View>
        <View className="items-center gap-one">
          <ThemedText type="subtitle" className="text-[22px]">
            Your cart is empty
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Find your next great read.
          </ThemedText>
        </View>
        <Link href="/" asChild>
          <Pressable className="rounded-full bg-primary px-four py-two active:opacity-70">
            <ThemedText themeColor="primaryForeground" type="smallBold">
              Browse books
            </ThemedText>
          </Pressable>
        </Link>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <FlatList
        data={items}
        keyExtractor={(item: CartItem) => item.book.id}
        contentContainerClassName="gap-three p-four"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onIncrement={incrementQty}
            onDecrement={decrementQty}
            onRemove={removeItem}
          />
        )}
      />

      <View
        className="border-t border-border bg-background"
        style={{ boxShadow: '0 -4px 16px rgba(11,26,43,0.06)' }}>
        <SafeAreaView edges={['bottom']}>
          <View className="gap-three p-four">
            <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
            <Link href="/checkout" asChild>
              <Pressable
                className="flex-row items-center justify-center gap-two rounded-full bg-primary py-three active:opacity-70"
                style={{ boxShadow: '0 6px 16px rgba(32,138,239,0.35)' }}
                accessibilityRole="button"
                accessibilityLabel="Proceed to checkout">
                <ThemedText themeColor="primaryForeground" type="smallBold">
                  Checkout
                </ThemedText>
                <SymbolView
                  tintColor={theme.primaryForeground}
                  name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
                  size={16}
                />
              </Pressable>
            </Link>
          </View>
        </SafeAreaView>
      </View>
    </ThemedView>
  );
}
