import { render, screen } from '@testing-library/react-native';

import { HintRow } from '@/components/hint-row';

describe('HintRow', () => {
  it('renders the provided title and string hint', () => {
    render(<HintRow title="Try editing" hint="src/app/index.tsx" />);
    expect(screen.getByText('Try editing')).toBeOnTheScreen();
    expect(screen.getByText('src/app/index.tsx')).toBeOnTheScreen();
  });

  it('renders default title and hint when no props are given', () => {
    render(<HintRow />);
    expect(screen.getByText('Try editing')).toBeOnTheScreen();
    expect(screen.getByText('app/index.tsx')).toBeOnTheScreen();
  });
});
