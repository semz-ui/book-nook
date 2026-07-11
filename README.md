# 📚 The Book Nook App

A React Native (Expo) app for a small independent bookstore. Customers can browse
and search the catalog, view book details, manage a shopping cart, and check out —
all backed by a **mock API** with simulated latency and failures.

Built for the Bumpa Mobile Engineer assessment. See [`plan.md`](./plan.md) for the
phased build breakdown.

---

## Features

| Flow | What it does |
| --- | --- |
| **Browse & search** | Paginated, infinitely-scrolling catalog with debounced title/author search. |
| **Book details** | Fetches a book on screen load with proper loading / error (retry) / success states. |
| **Shopping cart** | Add/remove books, adjust quantities, live item count + total price. |
| **Fly-to-cart animation** | A book cover "flies" from the Add button to the header cart icon, which bumps. |
| **Checkout** | Shipping form with validation, simulated secure order submission, success/error states, cart cleared on success. |

---

## Architecture — MVVM

The app follows **Model–View–ViewModel**, adapted to React Native + Expo Router.

| Layer | Responsibility | Where |
| --- | --- | --- |
| **Model** | Domain types + data access. No React. | `features/*/models`, `features/*/services`, `services/` (mock API client + seed data) |
| **ViewModel** | UI state + business logic exposed to views. No JSX. | `features/*/viewmodels` (hooks) + `features/cart/store` (Zustand global store) |
| **View** | Rendering + input only. | `src/app/**` route screens (thin) + `features/*/components` |

**Boundaries that keep it clean:**

- Views never call the API directly — only ViewModels do.
- ViewModels never import view components — they return plain state + actions.
- Models never import React.

This makes ViewModels and the store **unit-testable without rendering**, and keeps
screens dumb and declarative.

### Folder structure

```
src/
  app/                       # VIEWS — expo-router routes (thin)
    _layout.tsx              #   Stack nav + providers + header cart button
    index.tsx                #   Browse / search
    book/[id].tsx            #   Book details
    cart.tsx                 #   Cart
    checkout.tsx             #   Checkout
  features/
    books/
      models/                #   Book, Review, BooksPage types
      services/books-api.ts  #   fetchBooks (paged/searchable), fetchBookById
      viewmodels/            #   use-book-list, use-book-details
      components/            #   book-card, book-price, review-item
    cart/
      models/cart.ts         #   CartItem + total selectors (pure)
      store/cart-store.ts    #   Zustand store (global ViewModel)
      viewmodels/use-cart.ts #   selector hooks
      components/            #   cart-item-row, cart-summary, cart-button,
                             #   add-to-cart-button, fly-to-cart (animation)
    checkout/
      models/order.ts
      services/checkout-api.ts
      viewmodels/use-checkout.ts
  services/
    api-client.ts            # mock network: latency + injectable failures
    mock-data/books.ts       # 64-book deterministic seed dataset
  test-utils/                # shared test fixtures
```

---

## Technical choices

- **State management — Zustand for the cart.** The cart is shared across the list,
  details, header badge, and checkout, and is expected to grow. A Zustand store acts
  as a **global ViewModel**: state + actions in one place, minimal re-renders via
  selectors, and testable as plain JS. Per-screen concerns (details fetch, checkout)
  stay in local hook ViewModels where local state is enough.

- **Component lifecycle.** `use-book-details` fetches inside `useEffect` on mount,
  tracks `loading | error | success`, guards against setting state after unmount, and
  exposes a `retry` action.

- **Animation — Reanimated.** `fly-to-cart` runs entirely on the UI thread. The Add
  button measures its on-screen position and a root overlay animates a cover ghost
  toward the header cart icon; the badge bumps on arrival.

- **Optimization.**
  - **Pagination:** `FlatList` `onEndReached` + `hasMore` for infinite scroll.
  - **Lazy images:** `expo-image` with a blurhash placeholder, fade transition, and
    `recyclingKey` for recycled rows.
  - **Render efficiency:** memoized `BookCard`, stable `keyExtractor`/`renderItem`,
    and `FlatList` windowing (`initialNumToRender`, `windowSize`, `removeClippedSubviews`).
  - The mock API returns **paged** responses so large datasets are never loaded at once.

- **Styling:** NativeWind (Tailwind).

---

## Getting started

Requires Node 18+ and the Expo toolchain.

```bash
# 1. Install dependencies
yarn install

# 2. Start the dev server
yarn start        # then press i (iOS), a (Android), or w (web)
# or directly:
yarn ios
yarn android
yarn web
```

## Testing

Tests use **Jest** + **React Native Testing Library**.

```bash
yarn test          # run once
yarn test:watch    # watch mode
```

> **One-time setup note:** RNTL 14 requires the `test-renderer` peer dependency
> (the React 19 replacement for the deprecated `react-test-renderer`). If it isn't
> already installed, run:
> ```bash
> yarn add -D test-renderer@^1.2.0
> ```

**What's covered** (MVVM makes each layer testable in isolation):

- `BookPrice` — price formatting + rendering
- `CartItemRow` — add/remove/quantity interactions
- `cart-store` & cart selectors — all mutations + derived totals
- `api-client` & `books-api` — fetch success, pagination, search, error paths
- `use-book-details` — loading → error → success lifecycle (service mocked)
- `use-checkout` — validation, submit success (cart cleared), submit failure
