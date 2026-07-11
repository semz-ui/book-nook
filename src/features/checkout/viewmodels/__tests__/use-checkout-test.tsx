import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useCartStore } from '@/features/cart/store/cart-store';
import { submitOrder } from '@/features/checkout/services/checkout-api';
import { useCheckout } from '@/features/checkout/viewmodels/use-checkout';
import { makeBook } from '@/test-utils/fixtures';

jest.mock('@/features/checkout/services/checkout-api', () => ({
  submitOrder: jest.fn(),
}));

const mockSubmit = submitOrder as jest.MockedFunction<typeof submitOrder>;

function fillValidForm(result: { current: ReturnType<typeof useCheckout> }) {
  act(() => {
    result.current.setField('fullName', 'Ada Lovelace');
    result.current.setField('email', 'ada@example.com');
    result.current.setField('address', '123 Book St');
  });
}

beforeEach(() => {
  mockSubmit.mockReset();
  useCartStore.setState({ items: [{ book: makeBook({ id: '1', price: 10 }), quantity: 2 }] });
});

describe('useCheckout', () => {
  it('validates the form', async () => {
    const { result } = await renderHook(() => useCheckout());
    expect(result.current.isFormValid).toBe(false);
    fillValidForm(result);
    expect(result.current.isFormValid).toBe(true);
  });

  it('rejects an invalid email', async () => {
    const { result } = await renderHook(() => useCheckout());
    act(() => {
      result.current.setField('fullName', 'Ada');
      result.current.setField('email', 'not-an-email');
      result.current.setField('address', '123 Book St');
    });
    expect(result.current.isFormValid).toBe(false);
  });

  it('submits successfully and clears the cart', async () => {
    mockSubmit.mockResolvedValue({
      id: 'ORD-1',
      items: [],
      total: 20,
      shipping: { fullName: 'Ada Lovelace', email: 'ada@example.com', address: '123 Book St' },
      createdAt: 'now',
    });

    const { result } = await renderHook(() => useCheckout());
    fillValidForm(result);

    await act(async () => {
      await result.current.submit();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.order?.id).toBe('ORD-1');
    expect(useCartStore.getState().items).toHaveLength(0); // cart cleared
  });

  it('surfaces an error when submission fails', async () => {
    mockSubmit.mockRejectedValue(new Error('Payment declined'));

    const { result } = await renderHook(() => useCheckout());
    fillValidForm(result);

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Payment declined');
    expect(useCartStore.getState().items).toHaveLength(1); // cart preserved
  });

  it('does not submit an invalid form', async () => {
    const { result } = await renderHook(() => useCheckout());
    await act(async () => {
      await result.current.submit();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(result.current.status).toBe('error');
  });
});
