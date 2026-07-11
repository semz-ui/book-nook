import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ThemedView } from '@/components/themed-view';

describe('ThemedView', () => {
  it('renders its children', () => {
    render(
      <ThemedView>
        <Text>Inside</Text>
      </ThemedView>,
    );
    expect(screen.getByText('Inside')).toBeOnTheScreen();
  });

  it('forwards testID and defaults to the background token', () => {
    render(<ThemedView testID="view" />);
    expect(screen.getByTestId('view').props.className).toContain('bg-background');
  });

  it('maps the type prop to the matching background token', () => {
    render(<ThemedView testID="view" type="backgroundElement" />);
    expect(screen.getByTestId('view').props.className).toContain('bg-element');
  });
});
