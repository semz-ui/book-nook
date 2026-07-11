/**
 * VIEWMODEL — Checkout screen.
 *
 * Owns the shipping form, submission lifecycle (idle → submitting →
 * success/error), basic validation, and clears the cart on success.
 * No JSX.
 */

import { useCallback, useMemo, useState } from 'react';

import { useCart } from '@/features/cart/viewmodels/use-cart';
import type { Order, ShippingDetails } from '@/features/checkout/models/order';
import { submitOrder } from '@/features/checkout/services/checkout-api';

export type CheckoutStatus = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY_FORM: ShippingDetails = { fullName: '', email: '', address: '' };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function useCheckout() {
  const { items, totalItems, totalPrice, clear } = useCart();
  const [form, setForm] = useState<ShippingDetails>(EMPTY_FORM);
  const [status, setStatus] = useState<CheckoutStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const setField = useCallback((field: keyof ShippingDetails, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const isFormValid = useMemo(
    () =>
      form.fullName.trim().length > 0 &&
      isValidEmail(form.email.trim()) &&
      form.address.trim().length > 0,
    [form],
  );

  const submit = useCallback(async () => {
    if (!isFormValid || items.length === 0) {
      setError('Please complete all fields before placing your order.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setError(null);

    try {
      const placed = await submitOrder({ items, shipping: form });
      setOrder(placed);
      setStatus('success');
      clear(); // empty the cart once the order is confirmed
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not place your order.');
      setStatus('error');
    }
  }, [isFormValid, items, form, clear]);

  return {
    form,
    setField,
    isFormValid,
    totalItems,
    totalPrice,
    status,
    error,
    order,
    isSubmitting: status === 'submitting',
    isSuccess: status === 'success',
    submit,
  };
}
