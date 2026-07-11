/**
 * VIEWMODEL (global) — the shopping cart store, implemented with Zustand.
 *
 * Holds cart state + all mutating actions. Because it's a plain store, its
 * logic is unit-testable without rendering any React (see Phase 7 tests).
 * Views subscribe via the `use-cart` selector hooks.
 */

import { create } from 'zustand';

import type { Book } from '@/features/books/models/book';
import { type CartItem, selectTotalItems, selectTotalPrice } from '@/features/cart/models/cart';

type CartState = {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: string) => void;
  incrementQty: (bookId: string) => void;
  decrementQty: (bookId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addItem: (book) =>
    set((state) => {
      const existing = state.items.find((item) => item.book.id === book.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }
      return { items: [...state.items, { book, quantity: 1 }] };
    }),

  removeItem: (bookId) =>
    set((state) => ({ items: state.items.filter((item) => item.book.id !== bookId) })),

  incrementQty: (bookId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.book.id === bookId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    })),

  // Decrementing below 1 removes the line item entirely.
  decrementQty: (bookId) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.book.id === bookId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    })),

  clear: () => set({ items: [] }),
}));

/** Derived selectors — kept as standalone functions so they're reusable + testable. */
export const cartSelectors = {
  totalItems: (state: CartState) => selectTotalItems(state.items),
  totalPrice: (state: CartState) => selectTotalPrice(state.items),
};
