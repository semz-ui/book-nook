/**
 * VIEW — Browse & search screen.
 * Thin: delegates all state/logic to the useBookList ViewModel.
 */

import { useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from '@/components/ui/search-bar';
import { BookListSkeleton } from '@/components/ui/skeleton';
import { BookCard } from '@/features/books/components/book-card';
import type { Book } from '@/features/books/models/book';
import { useBookList } from '@/features/books/viewmodels/use-book-list';
import { useTheme } from '@/hooks/use-theme';

export default function BrowseScreen() {
  const { items, query, setQuery, isLoading, isLoadingMore, isError, error, loadMore, retry } =
    useBookList();
  const theme = useTheme();

  const renderItem = useCallback(({ item }: { item: Book }) => <BookCard book={item} />, []);
  const keyExtractor = useCallback((item: Book) => item.id, []);

  return (
    <ThemedView className="flex-1">
      <SafeAreaView edges={['bottom']} className="flex-1">
        <View className="px-four pb-two pt-three">
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search by title or author" />
        </View>

        {isLoading ? (
          <BookListSkeleton />
        ) : isError ? (
          <View className="flex-1 items-center justify-center gap-three px-four">
            <ThemedText type="subtitle" className="text-[40px]">
              😕
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" className="text-center">
              {error ?? 'Unable to load books.'}
            </ThemedText>
            <Pressable
              onPress={retry}
              className="rounded-full bg-primary px-four py-two active:opacity-70">
              <ThemedText themeColor="primaryForeground" type="smallBold">
                Try again
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerClassName="gap-three px-four pb-six pt-two"
            onEndReached={loadMore}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            // Perf tuning for large lists.
            initialNumToRender={8}
            windowSize={11}
            removeClippedSubviews
            ListEmptyComponent={
              <View className="items-center gap-two pt-six">
                <ThemedText type="subtitle" className="text-[40px]">
                  🔍
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" className="text-center">
                  No books match “{query}”.
                </ThemedText>
              </View>
            }
            ListFooterComponent={
              isLoadingMore ? (
                <View className="py-three">
                  <ActivityIndicator color={theme.primary} />
                </View>
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}
