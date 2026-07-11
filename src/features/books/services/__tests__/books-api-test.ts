import { DEFAULT_PAGE_SIZE, fetchBookById, fetchBooks } from '@/features/books/services/books-api';
import { ApiError } from '@/services/api-client';

const fast = { delayMs: 0 };

describe('fetchBooks', () => {
  it('returns the first page with the default page size', async () => {
    const page = await fetchBooks({ page: 1 }, fast);
    expect(page.items).toHaveLength(DEFAULT_PAGE_SIZE);
    expect(page.page).toBe(1);
    expect(page.hasMore).toBe(true);
    expect(page.total).toBeGreaterThan(DEFAULT_PAGE_SIZE);
  });

  it('paginates — page 2 returns different items', async () => {
    const [p1, p2] = await Promise.all([
      fetchBooks({ page: 1 }, fast),
      fetchBooks({ page: 2 }, fast),
    ]);
    const p1Ids = p1.items.map((b) => b.id);
    const p2Ids = p2.items.map((b) => b.id);
    expect(p1Ids).not.toEqual(p2Ids);
    expect(p1Ids.some((id) => p2Ids.includes(id))).toBe(false);
  });

  it('sets hasMore false on the last page', async () => {
    const first = await fetchBooks({ page: 1 }, fast);
    const lastPage = Math.ceil(first.total / DEFAULT_PAGE_SIZE);
    const last = await fetchBooks({ page: lastPage }, fast);
    expect(last.hasMore).toBe(false);
  });

  it('filters by search query', async () => {
    const page = await fetchBooks({ query: 'Silent' }, fast);
    expect(page.items.length).toBeGreaterThan(0);
    expect(
      page.items.every(
        (b) => b.title.toLowerCase().includes('silent') || b.author.toLowerCase().includes('silent'),
      ),
    ).toBe(true);
  });

  it('returns an empty page for a non-matching query', async () => {
    const page = await fetchBooks({ query: 'zzzzz-no-match' }, fast);
    expect(page.items).toHaveLength(0);
    expect(page.hasMore).toBe(false);
  });
});

describe('fetchBookById', () => {
  it('returns the matching book', async () => {
    const book = await fetchBookById('1', fast);
    expect(book.id).toBe('1');
  });

  it('rejects with ApiError for an unknown id', async () => {
    await expect(fetchBookById('does-not-exist', fast)).rejects.toBeInstanceOf(ApiError);
  });
});
