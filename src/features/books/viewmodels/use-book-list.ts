/**
 * VIEWMODEL — the browse/search screen.
 *
 * Owns list state (items, query, pagination, loading/error) and exposes
 * `search` and `loadMore` actions. Contains no JSX. The View (index.tsx)
 * renders whatever this returns.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Book } from '@/features/books/models/book';
import { DEFAULT_PAGE_SIZE, fetchBooks } from '@/features/books/services/books-api';

type Status = 'idle' | 'loading' | 'loadingMore' | 'error' | 'success';

const SEARCH_DEBOUNCE_MS = 300;

export function useBookList() {
  const [items, setItems] = useState<Book[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);

  // Track the latest request so stale (out-of-order) responses are ignored.
  const requestIdRef = useRef(0);

  const load = useCallback(async (nextPage: number, searchQuery: string, append: boolean) => {
    const requestId = ++requestIdRef.current;
    setStatus(append ? 'loadingMore' : 'loading');
    setError(null);

    try {
      const result = await fetchBooks({ page: nextPage, pageSize: DEFAULT_PAGE_SIZE, query: searchQuery });
      if (requestId !== requestIdRef.current) return; // superseded

      setItems((prev) => (append ? [...prev, ...result.items] : result.items));
      setPage(result.page);
      setHasMore(result.hasMore);
      setStatus('success');
    } catch (e) {
      if (requestId !== requestIdRef.current) return;
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setStatus('error');
    }
  }, []);

  // Debounced search: reload page 1 whenever the query changes.
  useEffect(() => {
    const handle = setTimeout(() => {
      load(1, query, false);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [query, load]);

  const loadMore = useCallback(() => {
    if (status === 'loading' || status === 'loadingMore' || !hasMore) return;
    load(page + 1, query, true);
  }, [status, hasMore, page, query, load]);

  const retry = useCallback(() => {
    load(1, query, false);
  }, [load, query]);

  return {
    items,
    query,
    setQuery,
    hasMore,
    isLoading: status === 'loading',
    isLoadingMore: status === 'loadingMore',
    isError: status === 'error',
    error,
    loadMore,
    retry,
  };
}
