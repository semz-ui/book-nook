/**
 * VIEW — cart totals row. Presentational.
 */

import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BookPrice } from '@/features/books/components/book-price';

type CartSummaryProps = {
  totalItems: number;
  totalPrice: number;
};

export function CartSummary({ totalItems, totalPrice }: CartSummaryProps) {
  return (
    <View className="flex-row items-center justify-between">
      <ThemedText type="small" themeColor="textSecondary">
        {totalItems} {totalItems === 1 ? 'item' : 'items'}
      </ThemedText>
      <View className="flex-row items-center gap-two">
        <ThemedText type="smallBold">Total</ThemedText>
        <BookPrice value={totalPrice} type="subtitle" className="text-[22px] leading-[26px]" />
      </View>
    </View>
  );
}
