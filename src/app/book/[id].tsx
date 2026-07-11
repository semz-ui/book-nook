/**
 * VIEW — Book Details screen.
 * Thin: renders whatever useBookDetails (the ViewModel) reports —
 * skeleton (loading) → error message (+ retry) → book content.
 */

import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RatingPill } from '@/components/ui/rating-pill';
import { Skeleton } from '@/components/ui/skeleton';
import { BookPrice } from '@/features/books/components/book-price';
import { ReviewItem } from '@/features/books/components/review-item';
import { useBookDetails } from '@/features/books/viewmodels/use-book-details';
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button';

const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

function DetailsSkeleton() {
  return (
    <View className="flex-1 items-center gap-three p-four pt-five">
      <Skeleton width={150} height={225} radius={12} />
      <Skeleton width="70%" height={22} />
      <Skeleton width="40%" height={14} />
      <Skeleton width={80} height={24} radius={999} />
      <View className="mt-three w-full gap-two">
        <Skeleton width="100%" height={12} />
        <Skeleton width="90%" height={12} />
        <Skeleton width="95%" height={12} />
      </View>
    </View>
  );
}

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { book, isLoading, isError, error, retry } = useBookDetails(id);

  if (isLoading) {
    return (
      <ThemedView className="flex-1">
        <DetailsSkeleton />
      </ThemedView>
    );
  }

  if (isError || !book) {
    return (
      <ThemedView className="flex-1 items-center justify-center gap-three px-four">
        <ThemedText type="subtitle" className="text-[40px]">
          😕
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" className="text-center">
          {error ?? 'This book could not be loaded.'}
        </ThemedText>
        <Pressable onPress={retry} className="rounded-full bg-primary px-four py-two active:opacity-70">
          <ThemedText themeColor="primaryForeground" type="smallBold">
            Try again
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <ScrollView contentContainerClassName="gap-four p-four pb-six" showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View className="items-center gap-three pt-two">
          <View style={{ borderRadius: 12, boxShadow: '0 12px 28px rgba(11,26,43,0.28)' }}>
            <Image
              source={book.coverUrl}
              placeholder={{ blurhash: BLURHASH }}
              contentFit="cover"
              transition={200}
              style={{ width: 150, height: 225, borderRadius: 12 }}
            />
          </View>
          <View className="items-center gap-one">
            <ThemedText type="subtitle" className="text-center text-[26px] leading-[32px]">
              {book.title}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              by {book.author}
            </ThemedText>
          </View>
          <RatingPill rating={book.rating} reviewCount={book.reviews.length} />
        </View>

        {/* Description */}
        <View className="gap-two border-t border-border pt-four">
          <ThemedText type="smallBold">Description</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" className="leading-[22px]">
            {book.description}
          </ThemedText>
        </View>

        {/* Reviews */}
        <View className="gap-two border-t border-border pt-four">
          <ThemedText type="smallBold">Reviews ({book.reviews.length})</ThemedText>
          <View className="gap-two">
            {book.reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky add-to-cart bar */}
      <View
        className="border-t border-border bg-background"
        style={{ boxShadow: '0 -4px 16px rgba(11,26,43,0.06)' }}>
        <SafeAreaView edges={['bottom']}>
          <View className="flex-row items-center gap-four p-four">
            <View className="gap-half">
              <ThemedText type="small" themeColor="textSecondary" className="leading-[14px]">
                Price
              </ThemedText>
              <BookPrice value={book.price} type="subtitle" className="text-[24px] leading-[28px]" />
            </View>
            <View className="flex-1">
              <AddToCartButton book={book} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </ThemedView>
  );
}
