import { renderHook, waitFor } from '@testing-library/react-native';

import { fetchBookById } from '@/features/books/services/books-api';
import { useBookDetails } from '@/features/books/viewmodels/use-book-details';
import { makeBook } from '@/test-utils/fixtures';

// Unit-test the ViewModel in isolation: the service layer is mocked.
jest.mock('@/features/books/services/books-api', () => ({
  fetchBookById: jest.fn(),
}));

const mockFetch = fetchBookById as jest.MockedFunction<typeof fetchBookById>;

describe('useBookDetails', () => {
  beforeEach(() => mockFetch.mockReset());

  it('starts in a loading state', async () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = await renderHook(() => useBookDetails('1'));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('transitions to success and exposes the book', async () => {
    const book = makeBook({ id: '1', title: 'Loaded' });
    mockFetch.mockResolvedValue(book);

    const { result } = await renderHook(() => useBookDetails('1'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isError).toBe(false);
    expect(result.current.book?.title).toBe('Loaded');
  });

  it('transitions to error when the fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('boom'));

    const { result } = await renderHook(() => useBookDetails('1'));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe('boom');
    expect(result.current.book).toBeNull();
  });

  it('errors immediately when no id is provided', async () => {
    const { result } = await renderHook(() => useBookDetails(undefined));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
