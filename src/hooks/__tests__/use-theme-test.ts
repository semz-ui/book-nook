import { renderHook } from '@testing-library/react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

jest.mock('@/hooks/use-color-scheme', () => ({ useColorScheme: jest.fn() }));

const mockedUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;

describe('useTheme', () => {
  it('returns the dark palette in dark mode', () => {
    mockedUseColorScheme.mockReturnValue('dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe(Colors.dark);
  });

  it('returns the light palette in light mode', () => {
    mockedUseColorScheme.mockReturnValue('light');
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe(Colors.light);
  });

  it('falls back to the light palette when the scheme is unspecified', () => {
    // RN's ColorSchemeName type omits 'unspecified', but the hook handles it explicitly.
    mockedUseColorScheme.mockReturnValue('unspecified' as never);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe(Colors.light);
  });
});
