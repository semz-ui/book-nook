import { fireEvent, render, screen } from '@testing-library/react-native';

import { CartItemRow } from '@/features/cart/components/cart-item-row';
import type { CartItem } from '@/features/cart/models/cart';
import { makeBook } from '@/test-utils/fixtures';

async function setup() {
  const item: CartItem = { book: makeBook({ id: '1', title: 'Ink and Ember', price: 10 }), quantity: 2 };
  const onIncrement = jest.fn();
  const onDecrement = jest.fn();
  const onRemove = jest.fn();
  await render(
    <CartItemRow item={item} onIncrement={onIncrement} onDecrement={onDecrement} onRemove={onRemove} />,
  );
  return { onIncrement, onDecrement, onRemove };
}

describe('<CartItemRow />', () => {
  it('renders title and quantity', async () => {
    await setup();
    expect(screen.getByText('Ink and Ember')).toBeOnTheScreen();
    expect(screen.getByLabelText('Quantity 2')).toBeOnTheScreen();
  });

  it('calls onIncrement with the book id', async () => {
    const { onIncrement } = await setup();
    fireEvent.press(screen.getByLabelText('Increase quantity of Ink and Ember'));
    expect(onIncrement).toHaveBeenCalledWith('1');
  });

  it('calls onDecrement with the book id', async () => {
    const { onDecrement } = await setup();
    fireEvent.press(screen.getByLabelText('Decrease quantity of Ink and Ember'));
    expect(onDecrement).toHaveBeenCalledWith('1');
  });

  it('calls onRemove with the book id', async () => {
    const { onRemove } = await setup();
    fireEvent.press(screen.getByLabelText('Remove Ink and Ember from cart'));
    expect(onRemove).toHaveBeenCalledWith('1');
  });
});
