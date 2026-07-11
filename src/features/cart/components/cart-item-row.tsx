/**
 * VIEW — one line item in the cart: cover, title, price, quantity stepper, remove.
 * Stateless; drives everything through the cart ViewModel actions passed in.
 */

import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BookPrice } from '@/features/books/components/book-price';
import type { CartItem } from '@/features/cart/models/cart';

type CartItemRowProps = {
  item: CartItem;
  onIncrement: (bookId: string) => void;
  onDecrement: (bookId: string) => void;
  onRemove: (bookId: string) => void;
};

function StepperButton({
  label,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="h-7 w-7 items-center justify-center rounded-full bg-element active:opacity-60">
      <ThemedText type="smallBold">{label}</ThemedText>
    </Pressable>
  );
}

export function CartItemRow({ item, onIncrement, onDecrement, onRemove }: CartItemRowProps) {
  const { book, quantity } = item;

  return (
    <View
      className="flex-row gap-three rounded-four bg-element p-three"
      style={{ boxShadow: '0 2px 10px rgba(11,26,43,0.06)' }}>
      <Image
        source={book.coverUrl}
        contentFit="cover"
        transition={150}
        recyclingKey={book.id}
        style={{ width: 48, height: 72, borderRadius: 6 }}
      />
      <View className="flex-1 gap-one">
        <ThemedText type="smallBold" numberOfLines={2}>
          {book.title}
        </ThemedText>
        <BookPrice value={book.price} type="small" />

        <View className="mt-one flex-row items-center gap-three">
          <View className="flex-row items-center gap-one rounded-full bg-background p-half">
            <StepperButton
              label="−"
              onPress={() => onDecrement(book.id)}
              accessibilityLabel={`Decrease quantity of ${book.title}`}
            />
            <ThemedText
              type="smallBold"
              className="min-w-[20px] text-center"
              accessibilityLabel={`Quantity ${quantity}`}>
              {quantity}
            </ThemedText>
            <StepperButton
              label="+"
              onPress={() => onIncrement(book.id)}
              accessibilityLabel={`Increase quantity of ${book.title}`}
            />
          </View>

          <Pressable
            onPress={() => onRemove(book.id)}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${book.title} from cart`}
            className="ml-auto active:opacity-60">
            <ThemedText type="small" themeColor="textSecondary">
              Remove
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <View className="justify-center">
        <BookPrice value={Math.round(book.price * quantity * 100) / 100} type="smallBold" />
      </View>
    </View>
  );
}
