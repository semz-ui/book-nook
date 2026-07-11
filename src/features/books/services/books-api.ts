/**
 * SERVICE (part of the Model layer) for the books feature.
 * Turns raw mock data into paged, searchable API responses.
 * ViewModels depend on this; it never imports React.
 */

import type { Book, BooksPage } from '@/features/books/models/book';
import { ApiError, mockRequest, type NetworkOptions } from '@/services/api-client';
import { BOOKS } from '@/services/mock-data/books';

export const DEFAULT_PAGE_SIZE = 10;

export type FetchBooksParams = {
  page?: number;
  pageSize?: number;
  query?: string;
};

/** Fetch a page of books, optionally filtered by a search query. */
export function fetchBooks(
  { page = 1, pageSize = DEFAULT_PAGE_SIZE, query = '' }: FetchBooksParams = {},
  options?: NetworkOptions,
): Promise<BooksPage> {
  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? BOOKS.filter(
        (b) =>
          b.title.toLowerCase().includes(normalized) ||
          b.author.toLowerCase().includes(normalized),
      )
    : BOOKS;

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  const total = filtered.length;

  const result: BooksPage = {
    items,
    page,
    pageSize,
    total,
    hasMore: start + pageSize < total,
  };

  return mockRequest(result, options);
}

/** Fetch a single book by id. Rejects with ApiError if not found. */
export function fetchBookById(id: string, options?: NetworkOptions): Promise<Book> {
  const book = BOOKS.find((b) => b.id === id);

  if (!book && !options?.shouldFail) {
    return Promise.reject(new ApiError(`Book "${id}" was not found.`));
  }

  return mockRequest(book as Book, options);
}
