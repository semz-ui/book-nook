import { selectTotalItems, selectTotalPrice, type CartItem } from '@/features/cart/models/cart';
import { makeBook } from '@/test-utils/fixtures';

const items: CartItem[] = [
  { book: makeBook({ id: '1', price: 10 }), quantity: 2 },
  { book: makeBook({ id: '2', price: 5.5 }), quantity: 1 },
];

describe('cart selectors', () => {
  it('sums total item quantity', () => {
    expect(selectTotalItems(items)).toBe(3);
    expect(selectTotalItems([])).toBe(0);
  });

  it('sums total price', () => {
    expect(selectTotalPrice(items)).toBe(25.5);
    expect(selectTotalPrice([])).toBe(0);
  });

  it('avoids floating point drift', () => {
    const drift: CartItem[] = [{ book: makeBook({ price: 0.1 }), quantity: 3 }];
    expect(selectTotalPrice(drift)).toBe(0.3);
  });
});
