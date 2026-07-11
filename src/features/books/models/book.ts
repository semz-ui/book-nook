/**
 * MODEL layer — domain entities for the books feature.
 * Pure TypeScript. No React, no view code.
 */

export type Review = {
  id: string;
  author: string;
  rating: number; // 1–5
  comment: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  price: number; // in the store's currency (USD)
  coverUrl: string;
  description: string;
  rating: number; // average rating, 1–5
  reviews: Review[];
};

/** A single page of books returned by the (mock) API. */
export type BooksPage = {
  items: Book[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};
