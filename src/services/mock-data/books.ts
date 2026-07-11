/**
 * Seed dataset for the mock API. Generated deterministically so the catalog is
 * large enough to exercise pagination and lazy image loading.
 */

import type { Book, Review } from '@/features/books/models/book';

const TITLES = [
  'The Silent Library', 'Ink and Ember', 'A Map of Small Things', 'The Last Bookshop',
  'Paper Moons', 'Where the River Bends', 'The Cartographer’s Daughter', 'Salt and Starlight',
  'The Midnight Ledger', 'Glasshouse', 'The Weight of Feathers', 'A Season of Storms',
  'The Lantern Keeper', 'Threadbare', 'The Hummingbird Effect', 'North of Nowhere',
  'The Clockwork Orchard', 'Quiet as Snow', 'The Borrowed House', 'Fable & Bone',
  'The Coral Notebook', 'Every Little Light', 'The Tin Forest', 'Under a Copper Sky',
  'The Wandering Page', 'Marrow', 'The Kite Museum', 'A Handful of Dust',
  'The Velvet Almanac', 'Rivers of London Road', 'The Paper Menagerie Redux', 'Small Gods, Big City',
];

const AUTHORS = [
  'Mara Ellison', 'Idris Okoye', 'Lena Fairbanks', 'Tomas Reyes', 'Aisha Bello',
  'Grant Whitmore', 'Nadia Sokolov', 'Elias Vance', 'Priya Nair', 'Otto Lindqvist',
  'Camille Dubois', 'Hiroshi Tanaka', 'Zoe Ashworth', 'Marcus Bright', 'Farah Haddad',
  'Declan Moore',
];

const REVIEW_SNIPPETS = [
  'Couldn’t put it down — read it in one sitting.',
  'Beautifully written, though the middle drags a little.',
  'A quiet, moving story about family and memory.',
  'The world-building is incredible. Highly recommend.',
  'Not my usual genre but I loved every page.',
  'The ending wrecked me (in the best way).',
];

function seededRandom(seed: number) {
  // Small deterministic PRNG so data is stable across reloads.
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function buildReviews(rand: () => number, count: number): Review[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `r${i}`,
    author: AUTHORS[Math.floor(rand() * AUTHORS.length)],
    rating: 3 + Math.floor(rand() * 3), // 3–5
    comment: REVIEW_SNIPPETS[Math.floor(rand() * REVIEW_SNIPPETS.length)],
  }));
}

/** 64 deterministically-generated books. */
export const BOOKS: Book[] = Array.from({ length: 64 }, (_, i) => {
  const rand = seededRandom(i + 1);
  const title = TITLES[i % TITLES.length] + (i >= TITLES.length ? ` (Vol. ${Math.floor(i / TITLES.length) + 1})` : '');
  const reviewCount = 1 + Math.floor(rand() * 5);
  const reviews = buildReviews(rand, reviewCount);
  const rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return {
    id: String(i + 1),
    title,
    author: AUTHORS[i % AUTHORS.length],
    price: Math.round((8 + rand() * 24) * 100) / 100, // $8–$32
    // Deterministic placeholder cover — stable per book id.
    coverUrl: `https://picsum.photos/seed/booknook-${i + 1}/300/450`,
    description:
      'A richly imagined tale that lingers long after the final page. ' +
      'Our bookseller’s pick this month — perfect for readers who love ' +
      'atmosphere, memorable characters, and a story with real heart.',
    rating: Math.round(rating * 10) / 10,
    reviews,
  };
});
