/**
 * VIEW — a single book row in the browse list.
 * Memoized (perf) and uses expo-image for lazy, cached cover loading.
 */

import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RatingPill } from '@/components/ui/rating-pill';
import { BookPrice } from '@/features/books/components/book-price';
import type { Book } from '@/features/books/models/book';
import { useTheme } from '@/hooks/use-theme';

// Tiny blurhash placeholder shown while covers load lazily.
const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

type BookCardProps = { book: Book };

function BookCardComponent({ book }: BookCardProps) {
  const theme = useTheme();

  return (
    <Link href={{ pathname: '/book/[id]', params: { id: book.id } }} asChild>
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center gap-three rounded-four bg-element p-three"
        style={{ boxShadow: '0 2px 10px rgba(11,26,43,0.06)' }}>
        <Image
          source={book.coverUrl}
          placeholder={{ blurhash: BLURHASH }}
          contentFit="cover"
          transition={200}
          recyclingKey={book.id}
          style={{ width: 60, height: 90, borderRadius: 8 }}
        />
        <View className="flex-1 justify-center gap-one">
          <ThemedText type="smallBold" numberOfLines={2}>
            {book.title}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {book.author}
          </ThemedText>
          <View className="mt-one flex-row items-center justify-between">
            <BookPrice value={book.price} type="smallBold" />
            <RatingPill rating={book.rating} />
          </View>
        </View>
        <SymbolView
          tintColor={theme.textSecondary}
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={14}
        />
      </TouchableOpacity>
    </Link>
  );
}

export const BookCard = memo(BookCardComponent);
