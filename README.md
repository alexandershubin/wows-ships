# World of Warships

A responsive ship browser for World of Warships built with React, TypeScript, and Redux Toolkit.

## Setup

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (e.g. http://localhost:5174).

> **Note:** The Vite dev server proxies `/wows-api/*` → `https://vortex.worldofwarships.eu/*` to bypass CORS. No additional configuration is required — just `npm install && npm run dev`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build (proxy also active) |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Features

- **Virtual scrolling** — only visible cards are rendered via a custom `useVirtualGrid` hook; handles 1000+ ships without lag
- **IndexedDB cache** — vehicles cached in IndexedDB with stale-while-revalidate; instant UI on repeat visits while fresh data loads in the background
- **Streaming JSON parser** — ~18MB vehicles response is parsed incrementally, rendering ships as they arrive
- **Filters** — by nation (flag buttons), ship type (with game icons), and tier (I–★)
- **Search** — text search by ship name with `useTransition` for non-blocking updates
- **Ship modal** — detailed ship view with lazy loading (`React.lazy` + `Suspense`) and focus trap for accessibility
- **Responsive** — sidebar collapsible, grid columns adapt to viewport width via ResizeObserver
- **Error handling** — friendly error banner with retry when the API is unavailable
- **Accessibility** — focus trap in modal, `aria-pressed` on filter buttons, keyboard-navigable backdrop
- **Game-style UI** — dark navy theme matching WoWS aesthetic: color-coded ship types, tier badges, premium/special indicators, nation flags

## Tech Stack

- **React 19** + **TypeScript**
- **Redux Toolkit** — `createSlice`, `createAsyncThunk`, `createSelector` (memoized filtering)
- **Vite** — dev proxy, fast HMR, production bundling
- **CSS Modules** — scoped styles with CSS custom properties, zero runtime overhead
- **IndexedDB** — client-side cache for offline-ready repeat visits
- **Vitest** + **Testing Library** — 102 unit/component tests

## Architecture

```
src/
├── api.ts                # Streaming JSON parser + 3 simple fetches
├── types.ts              # Shared TypeScript interfaces
├── images.ts             # Image URL builders
├── utils/
│   ├── helpers.ts        # Pure helpers: toRoman, getShipType, isPremium, isSpecial
│   └── filters.ts        # Shared filterVehicles function
├── cache/
│   └── vehicleCache.ts   # IndexedDB wrapper: get/set cached vehicles
├── store/
│   ├── dataSlice.ts      # Async data loading with cache-first strategy
│   ├── filtersSlice.ts   # Filter state: search, nations, types, levels
│   ├── selectors.ts      # Memoized selectFilteredShips
│   ├── vehicleStream.ts  # External mutable store for streaming data
│   └── index.ts          # Store setup
├── hooks/
│   ├── useVirtualGrid.ts    # Pure virtual grid math
│   ├── useContainerSize.ts  # ResizeObserver → width/height
│   ├── useFilteredShips.ts  # Real-time filtering during stream
│   └── useShipData.ts       # Derived ship display data
└── components/
    ├── Header/           # Search bar + sidebar toggle
    ├── FilterPanel/      # Nation / type / tier filters
    ├── ShipGrid/         # Virtual-scrolling grid
    ├── ShipCard/         # Ship card (React.memo) + SkeletonCard
    ├── ShipModal/        # Detail modal (lazy-loaded, focus trap)
    ├── LoadingScreen/    # Animated loading state
    ├── ErrorBanner/      # Error + retry
    └── ErrorBoundary/    # React error boundary
```

## Data Sources

| Endpoint | Used for |
|----------|----------|
| `/api/encyclopedia/en/vehicles/` | Ships: name, tier, nation, images, tags |
| `/api/encyclopedia/en/nations/` | Nation flags and localized names |
| `/api/encyclopedia/en/vehicle_types_common/` | Ship type icons and localized names |
| `/api/encyclopedia/en/media_path/` | CDN base URL for all images |
