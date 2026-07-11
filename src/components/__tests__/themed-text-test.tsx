import { render, screen } from '@testing-library/react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';

describe('ThemedText', () => {
  it('renders its children', () => {
    render(<ThemedText>Hello world</ThemedText>);
    expect(screen.getByText('Hello world')).toBeOnTheScreen();
  });

  it('applies the mono font family for the code type', () => {
    render(<ThemedText type="code">npm run test</ThemedText>);
    expect(screen.getByText('npm run test')).toHaveStyle({ fontFamily: Fonts.mono });
  });

  it('uses the primary color token for linkPrimary', () => {
    render(<ThemedText type="linkPrimary">Learn more</ThemedText>);
    expect(screen.getByText('Learn more').props.className).toContain('text-primary');
  });

  it('maps themeColor to the matching text token', () => {
    render(<ThemedText themeColor="textSecondary">Subtitle</ThemedText>);
    expect(screen.getByText('Subtitle').props.className).toContain('text-secondary');
  });
});
