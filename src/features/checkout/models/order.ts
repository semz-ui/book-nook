/**
 * MODEL layer — checkout/order domain types. No React.
 */

import type { CartItem } from '@/features/cart/models/cart';

export type ShippingDetails = {
  fullName: string;
  email: string;
  address: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  shipping: ShippingDetails;
  createdAt: string;
};
