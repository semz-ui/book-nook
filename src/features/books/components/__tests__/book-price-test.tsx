import { render, screen } from '@testing-library/react-native';

import { BookPrice, formatPrice } from '@/features/books/components/book-price';

describe('formatPrice', () => {
  it('formats whole numbers with two decimals', () => {
    expect(formatPrice(12)).toBe('$12.00');
  });

  it('formats fractional prices', () => {
    expect(formatPrice(12.5)).toBe('$12.50');
    expect(formatPrice(8.99)).toBe('$8.99');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
});

describe('<BookPrice />', () => {
  it('renders the formatted price', async () => {
    await render(<BookPrice value={19.9} />);
    expect(screen.getByText('$19.90')).toBeOnTheScreen();
  });
});
