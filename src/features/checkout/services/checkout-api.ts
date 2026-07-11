/**
 * SERVICE — checkout submission (mock). Simulates placing a secure order.
 * ViewModels call this; it never imports React.
 */

import type { CartItem } from '@/features/cart/models/cart';
import { selectTotalPrice } from '@/features/cart/models/cart';
import type { Order, ShippingDetails } from '@/features/checkout/models/order';
import { mockRequest, type NetworkOptions } from '@/services/api-client';

export type SubmitOrderInput = {
  items: CartItem[];
  shipping: ShippingDetails;
};

/** Submit an order; resolves with a confirmed Order or rejects on failure. */
export function submitOrder(
  { items, shipping }: SubmitOrderInput,
  options?: NetworkOptions,
): Promise<Order> {
  const order: Order = {
    id: `ORD-${Date.now()}`,
    items,
    total: selectTotalPrice(items),
    shipping,
    createdAt: new Date().toISOString(),
  };

  return mockRequest(order, options);
}
