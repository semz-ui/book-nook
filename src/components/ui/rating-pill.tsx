/**
 * VIEW — a small star-rating pill. Reused on cards and the details hero.
 */

import { View } from 'react-native';

import { ThemedText, type ThemedTextProps } from '@/components/themed-text';

type RatingPillProps = {
  rating: number;
  /** Optional review count shown after the score. */
  reviewCount?: number;
  size?: ThemedTextProps['type'];
};

export function RatingPill({ rating, reviewCount, size = 'small' }: RatingPillProps) {
  return (
    <View className="flex-row items-center gap-half self-start rounded-full bg-selected px-two py-half">
      <ThemedText type={size} themeColor="primary" className="leading-[16px]">
        ★
      </ThemedText>
      <ThemedText type={size} className="font-semibold leading-[16px]">
        {rating.toFixed(1)}
      </ThemedText>
      {reviewCount !== undefined && (
        <ThemedText type="small" themeColor="textSecondary" className="leading-[16px]">
          ({reviewCount})
        </ThemedText>
      )}
    </View>
  );
}
