/**
 * MODEL layer — cart domain types and pure helpers.
 * No React. The math here is unit-tested directly.
 */

import type { Book } from '@/features/books/models/book';

export type CartItem = {
  book: Book;
  quantity: number;
};

/** Total number of individual books in the cart. */
export function selectTotalItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/** Total price of everything in the cart. */
export function selectTotalPrice(items: CartItem[]): number {
  const total = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  // Guard against floating-point drift (e.g. 0.1 + 0.2).
  return Math.round(total * 100) / 100;
}
