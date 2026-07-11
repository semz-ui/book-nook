/**
 * VIEW — a single customer review.
 */

import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Review } from '@/features/books/models/book';

export function ReviewItem({ review }: { review: Review }) {
  return (
    <View className="gap-two rounded-four bg-element p-three">
      <View className="flex-row items-center gap-two">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-selected">
          <ThemedText type="smallBold" themeColor="primary">
            {review.author.charAt(0)}
          </ThemedText>
        </View>
        <View className="flex-1">
          <ThemedText type="smallBold">{review.author}</ThemedText>
          <ThemedText type="small" className="leading-[14px]">
            <ThemedText type="small" themeColor="primary">
              {'★'.repeat(review.rating)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {'★'.repeat(5 - review.rating)}
            </ThemedText>
          </ThemedText>
        </View>
      </View>
      <ThemedText type="small" themeColor="textSecondary" className="leading-[20px]">
        {review.comment}
      </ThemedText>
    </View>
  );
}
