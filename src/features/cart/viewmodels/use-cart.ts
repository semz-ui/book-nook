/**
 * VIEWMODEL selector hooks — the View's window into the cart store.
 * Components import these instead of touching the store shape directly.
 */

import { cartSelectors, useCartStore } from '@/features/cart/store/cart-store';

/** Full cart ViewModel: items, derived totals, and all actions. */
export function useCart() {
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore(cartSelectors.totalItems);
  const totalPrice = useCartStore(cartSelectors.totalPrice);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const incrementQty = useCartStore((s) => s.incrementQty);
  const decrementQty = useCartStore((s) => s.decrementQty);
  const clear = useCartStore((s) => s.clear);

  return { items, totalItems, totalPrice, addItem, removeItem, incrementQty, decrementQty, clear };
}

/** Lightweight subscription for the header badge — re-renders only on count change. */
export function useCartCount() {
  return useCartStore(cartSelectors.totalItems);
}
