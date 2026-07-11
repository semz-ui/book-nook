/**
 * VIEWMODEL — Book Details screen.
 *
 * Demonstrates the component-lifecycle requirement: fetches on mount via
 * useEffect, tracks loading/error/success, guards against setting state after
 * unmount, and exposes a `retry` action. No JSX here.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Book } from '@/features/books/models/book';
import { fetchBookById } from '@/features/books/services/books-api';

export type DetailsStatus = 'loading' | 'error' | 'success';

export function useBookDetails(id: string | undefined) {
  const [book, setBook] = useState<Book | null>(null);
  const [status, setStatus] = useState<DetailsStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  // Prevents state updates after the screen unmounts (avoids RN warnings/leaks).
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!id) {
      setStatus('error');
      setError('No book was specified.');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const result = await fetchBookById(id);
      if (!isMountedRef.current) return;
      setBook(result);
      setStatus('success');
    } catch (e) {
      if (!isMountedRef.current) return;
      setError(e instanceof Error ? e.message : 'Failed to load this book.');
      setStatus('error');
    }
  }, [id]);

  // Fetch on mount and whenever the id changes. This is a genuine data-fetch
  // side effect that must surface a loading state — the exact case where
  // setState inside an effect is appropriate (React Compiler's rule can't tell).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return {
    book,
    isLoading: status === 'loading',
    isError: status === 'error',
    error,
    retry: load,
  };
}
