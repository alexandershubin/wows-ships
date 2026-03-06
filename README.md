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

- **Virtual scrolling** — only visible cards are rendered via a custom hook; handles 1000+ ships without lag
- **Filters** — by nation (flag buttons), ship type (with game icons), and tier (I–★)
- **Search** — debounced text search by ship name
- **Responsive** — sidebar collapsible, grid columns adapt to viewport width via ResizeObserver
- **Error handling** — friendly error screen with retry when the API is unavailable
- **Game-style UI** — dark navy theme matching WoWS aesthetic: color-coded ship types, tier badges, premium/special indicators, nation flags

## Tech Stack

- **React 19** + **TypeScript**
- **Redux Toolkit** — `createSlice`, `createAsyncThunk`, `createSelector` (memoized filtering)
- **Vite** — dev proxy, fast HMR, production bundling
- **CSS Modules** — scoped styles, zero runtime overhead
- **Vitest** + **Testing Library** — 36 unit/component tests

## Architecture

```
src/
├── api.ts              # All 4 API calls in one place, with error handling
├── types.ts            # Shared TypeScript interfaces
├── utils.ts            # Pure helpers: toRoman, getShipType, isPremium, debounce
├── store/
│   ├── dataSlice.ts    # Async data loading (vehicles, nations, types, mediaPath)
│   ├── filtersSlice.ts # Filter state: search, nations, types, levels
│   ├── selectors.ts    # Memoized selectFilteredShips (search + filter + sort)
│   └── index.ts        # Store setup
├── hooks/
│   ├── useVirtualGrid.ts    # Pure virtual grid math (no dependencies)
│   └── useContainerSize.ts  # ResizeObserver → width/height
└── components/
    ├── Header/          # Search bar + sidebar toggle
    ├── FilterPanel/     # Nation / type / tier filters
    ├── ShipGrid/        # Virtual-scrolling grid
    ├── ShipCard/        # Ship card (React.memo)
    ├── LoadingScreen/   # Animated loading state
    └── ErrorBanner/     # Error + retry
```

## Data Sources

| Endpoint | Used for |
|----------|----------|
| `/api/encyclopedia/en/vehicles/` | Ships: name, tier, nation, images, tags |
| `/api/encyclopedia/en/nations/` | Nation flags and localized names |
| `/api/encyclopedia/en/vehicle_types_common/` | Ship type icons and localized names |
| `/api/encyclopedia/en/media_path/` | CDN base URL for all images |
