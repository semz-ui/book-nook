import { cartSelectors, useCartStore } from '@/features/cart/store/cart-store';
import { makeBook } from '@/test-utils/fixtures';

const bookA = makeBook({ id: 'a', price: 10 });
const bookB = makeBook({ id: 'b', price: 5 });

// The store is a plain ViewModel — testable without rendering any React.
beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe('cart store', () => {
  it('adds a new item with quantity 1', () => {
    useCartStore.getState().addItem(bookA);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ book: bookA, quantity: 1 });
  });

  it('increments quantity when adding an existing book', () => {
    useCartStore.getState().addItem(bookA);
    useCartStore.getState().addItem(bookA);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('increments and decrements quantity', () => {
    const { addItem, incrementQty, decrementQty } = useCartStore.getState();
    addItem(bookA);
    incrementQty('a');
    expect(useCartStore.getState().items[0].quantity).toBe(2);
    decrementQty('a');
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('removes the line item when decremented below 1', () => {
    useCartStore.getState().addItem(bookA);
    useCartStore.getState().decrementQty('a');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('removes an item explicitly', () => {
    useCartStore.getState().addItem(bookA);
    useCartStore.getState().addItem(bookB);
    useCartStore.getState().removeItem('a');
    const ids = useCartStore.getState().items.map((i) => i.book.id);
    expect(ids).toEqual(['b']);
  });

  it('clears the cart', () => {
    useCartStore.getState().addItem(bookA);
    useCartStore.getState().clear();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('computes derived totals via selectors', () => {
    useCartStore.getState().addItem(bookA); // 10
    useCartStore.getState().addItem(bookA); // +10
    useCartStore.getState().addItem(bookB); // +5
    const state = useCartStore.getState();
    expect(cartSelectors.totalItems(state)).toBe(3);
    expect(cartSelectors.totalPrice(state)).toBe(25);
  });
});
