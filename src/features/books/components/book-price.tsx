/**
 * VIEW — renders a book price. Pure presentational + a formatting helper.
 * The helper is exported so it can be unit-tested without rendering.
 */

import { ThemedText, type ThemedTextProps } from '@/components/themed-text';

/** Format a number as a USD price string, e.g. 12.5 -> "$12.50". */
export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

type BookPriceProps = {
  value: number;
  type?: ThemedTextProps['type'];
  className?: string;
};

export function BookPrice({ value, type = 'default', className }: BookPriceProps) {
  return (
    <ThemedText type={type} themeColor="primary" className={className} accessibilityLabel={`Price ${formatPrice(value)}`}>
      {formatPrice(value)}
    </ThemedText>
  );
}
