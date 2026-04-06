# CineExplorer — Checkit Frontend Assessment

> A production-quality Content Explorer app built with Next.js 15, 
> TypeScript, Tailwind CSS, and deployed to Cloudflare Workers.

## Live URL
https://your-app-name.workers.dev

## Setup (5 commands)

npx create-next-app@latest content-explorer-app \
touch .env.local .env.example (in bash)
npm run dev

Open http://localhost:3000

## Environment Variables

| Variable | Description |
|---|---|
| `TMDB_READ_ACCESS_TOKEN` | TMDB API Read Access Token (Bearer) |
| `NEXT_BASE_URL` | Base URL of the deployed app |

Get a free TMDB token at https://www.themoviedb.org/settings/api

---

## API Choice — TMDB (The Movie Database)

TMDB was chosen because:
- Rich poster and backdrop images served from a fast CDN
- Native support for genre taxonomy, ratings, and discovery filters
- Paginated endpoints with up to 500 pages of results
- Stable, well-documented, and free for non-commercial use

---

## Architecture Decisions

### Folder Structure
No `src/` directory. All code lives at project root under `app/`, 
`components/`, `lib/`, `hooks/`, `types/`, and `__tests__/` — matching 
the structure specified in the assessment brief exactly.

### API Layer (`lib/tmdb.ts`)
All TMDB API calls are abstracted behind `lib/tmdb.ts`. No component 
ever calls `fetch()` directly. This makes the data layer independently 
testable, cacheable, and swappable.

### Cache Semantics — Deliberate Per-Feature Decisions

| Endpoint | Cache Setting | Reason |
|---|---|---|
| Popular movies listing | `revalidate: 3600` | ISR — popularity rankings change hourly at most |
| Movie detail page | `revalidate: 86400` | Movie metadata is essentially immutable |
| Search results | `cache: "no-store"` | Must always reflect real-time data |
| Genre list | `revalidate: 86400` | Genre taxonomy never changes |
| Discover (genre/rating) | `revalidate: 3600` | Filter results are stable within an hour |

### Pagination over Infinite Scroll
Pagination was chosen because:
- Results are shareable via URL (`?page=3`)
- Works correctly without JavaScript
- Simpler to implement correctly with SSR
- Infinite scroll would require a client component for the entire 
  grid, eliminating ISR benefits entirely

### Filter Design
Genre filter uses TMDB's `/?genre=` endpoint — server-side, accurate, and paginated. When a 
search query is active, all genres paramater is applied client-side since TMDB's 
search endpoint does not support that parameter. This is a known 
trade-off documented here intentionally.

### TypeScript Strict Mode
`strict: true` is enabled along with `noUncheckedIndexedAccess` and 
`noImplicitReturns`. All shared types live in `types/tmdb.ts` — no 
inline type definitions for reused shapes anywhere in the codebase.

### State Management
React built-ins only (`useState`, `useEffect`). TanStack Query is 
used for client-side data fetching (search/filter) — it provides 
automatic background refetching, request deduplication, and devtools 
with no additional boilerplate.

### No UI Component Library
All UI is hand-built with Tailwind CSS utility classes. No shadcn, 
MUI, Chakra, or any other component library — per the assessment spec.

---

## Performance Optimizations

| Optimization | Where | Why |
|---|---|---|
| `next/image` with `priority` | MovieCard (first 8 cards) | Preloads above-fold images, prevents LCP delay |
| `next/font` (Inter) | `app/layout.tsx` | Eliminates layout shift from font swap (CLS = 0) |
| ISR `revalidate: 3600` | `fetchPopularMovies` | Static-speed serving with hourly freshness |
| `cache: "no-store"` | `searchMovies` | Guarantees fresh search results always |
| `Cache-Control: immutable` | `next.config.js` headers | Cloudflare caches static assets for 1 year |
| `images.unoptimized: true` | `next.config.js` | Workers runtime lacks Node.js Sharp — TMDB CDN handles optimisation at source |
| `vote_count.gte: 100` | `discoverMovies` | Filters out obscure low-vote films from discovery results |

---

## Trade-offs & Known Limitations

- **TMDB caps pagination at page 500** — Pagination component clamps 
  `totalPages` to 500 to prevent dead pages
- **Search + genre filter** — Genre is applied client-side when a query 
  is active. Results may show fewer than 20 items per page when 
  filtered this way
- **Image optimization disabled** — Cloudflare Workers runtime does 
  not support the Node.js Sharp module Next.js uses for image 
  processing. TMDB images are already CDN-optimised at source via 
  `image.tmdb.org`. With more time I would configure a Cloudflare 
  Image Resizing worker as a replacement
- **Dynamic imports removed** — `dynamic()` with `ssr: false` caused 
  a chunk loading incompatibility with the Cloudflare Workers runtime. 
  FilterPanel is imported statically instead. With more time I would 
  investigate OpenNext's recommended code-splitting patterns for Workers
- **Search and genre filters are mutually exclusive** — selecting a 
  genre clears the search query and vice versa. A more complex 
  implementation would allow combining both simultaneously

### What I Would Do With 2 More Hours
- Add optimistic UI for pagination transitions
- Add E2E tests with Playwright for the search and filter flows
- Investigate Cloudflare Image Resizing as a replacement for 
  next/image optimization
- Add a "Back to top" button on the listing page for long scroll sessions
- Implement proper OpenNext-compatible code splitting for FilterPanel

---

## Bonus Tasks

### B-1 — Cloudflare Workers Edge Caching (+4 pts)

Listing page responses include a `Cache-Control` header set via 
`src/middleware.ts`:
OpenNext maps Next.js `revalidate: 3600` to Cloudflare's Cache API 
TTL. On a cache MISS the Worker fetches from origin and stores the 
response. On a HIT it serves from the edge with zero origin latency.

**Verify with curl:**
```bash
curl -I https://movie-explorer.workers.dev/
# Look for: x-cache-status header
```

### B-2 — React 18 Streaming with Suspense (+3 pts)

The "You Might Also Like" section on every movie detail page 
(`/movies/[id]`) is wrapped in a `<Suspense>` boundary with a 
skeleton fallback. This section fetches similar movies as a separate 
slow request — streaming means the rest of the detail page renders 
immediately while this section loads independently.

**Verify:** Visit any movie detail page and observe the similar movies 
section loading after the main content.

### B-3 — Accessibility Audit (+3 pts)

**Tool:** Chrome Lighthouse (built-in DevTools)  
**Score:** 100 / 100 (Desktop), 100 / 100 (Mobile)

**Issues found and fixed:**
- Multiple text elements using `text-gray-400` and `text-gray-500` 
  on dark backgrounds failed WCAG contrast ratio requirements (4.5:1 
  minimum) — bumped all body text to `text-gray-300` minimum across 
  MovieCard, Pagination, Breadcrumb, EmptyState, Error, and NotFound 
  components
- All interactive elements have `aria-label` attributes
- All form controls have associated `<label>` elements via `htmlFor`
- Semantic HTML throughout — correct heading hierarchy (h1 → h2), 
  nav landmarks, main element on every page

**Known remaining issues:** None. All automated checks pass.

**Verify:**
Open Chrome DevTools → Lighthouse tab → tick Accessibility only → 
Analyze page load on the live URL.

---

## Testing
```bash
npm run test:run        # run all tests
npm run test:coverage   # run with coverage report
```

Two components tested with 100% coverage:
- `useDebounce` hook — tests initial value, pre-delay behaviour, 
  and post-delay update
- `MovieCard` component — tests title render, year render, 
  rating badge, and correct href

---

## Deployment

Deployed to **Cloudflare Workers** via the OpenNext adapter 
(`@opennextjs/cloudflare`).
```bash
npx opennextjs-cloudflare build
npx wrangler deploy
```

Cloudflare Workers was chosen over Vercel as it matches the 
assessment's preferred hosting and demonstrates awareness of 
edge runtime constraints (no Node.js Sharp, no `ssr: false` 
dynamic imports).