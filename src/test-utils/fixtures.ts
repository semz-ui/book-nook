/**
 * Shared test fixtures. Not a test file (lives outside __tests__).
 */

import type { Book } from '@/features/books/models/book';

export function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    price: 10,
    coverUrl: 'https://example.com/cover.jpg',
    description: 'A test description.',
    rating: 4.5,
    reviews: [{ id: 'r1', author: 'Reviewer', rating: 5, comment: 'Great!' }],
    ...overrides,
  };
}
