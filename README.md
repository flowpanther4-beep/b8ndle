```markdown
# Brand Space™ — MVP

Retro-2000s-inspired marketplace wall (The Million Dollar Homepage — modernized).
This repo is a Next.js + TypeScript MVP meant to be deployed to Vercel/Netlify.

Highlights
- 1000×1000 virtual grid (unit = 10px), pan + zoom, center controls
- Blocks: available / reserved / paid / approved / rejected
- Search, filters and directory synchronized with wall
- Reservation modal + mock checkout API
- Mock endpoints (in-memory) for blocks, availability, quote, checkout, stripe-webhook
- Anti-overlap utility isOverlapping() included (front + server)
- Accessible controls & ARIA labels
- Tailwind CSS for styling (minimal config)

Quick start (local)
1. Install
   npm install

2. Run dev
   npm run dev
   Open http://localhost:3000

Deploy to Vercel
- Push to a GitHub repo and import in Vercel (default Next.js settings).
- Environment vars for production (when replacing mocks):
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - STRIPE_SECRET_KEY
  - STRIPE_WEBHOOK_SECRET

Where to replace mocks / connect real services
- pages/api/*.ts — these are mock serverless APIs. Replace with calls to Supabase and Stripe.
  - See comments in each API route explaining where to integrate.
- lib/blocksData.ts — in-memory seeded data. Replace by reading from DB (Supabase) or API.
- components/TopBanner.tsx — markup for the yellow banner and menu.
- utils/geom.ts — contains isOverlapping(a,b) used by frontend and server mocks.

Configuration (changeable sites)
- Palette: tailwind.config.js and styles/globals.css
- Available messages and texts: components/AvailabilityLayer + lib/blocksData.ts
- Presets for size: components/WallControls -> presets array
- Price formula: pages/api/quote.ts (mock) — price = base * w * h * zoneMultiplier

Testing the mock checkout flow
1. Click an available block and "Reserve this space".
2. The frontend calls /api/checkout with a draft; server returns a mock URL.
3. To simulate webhook marking paid -> approved, POST the same draft to /api/stripe-webhook (mock) or flip moderation toggle in UI (there's a developer "moderate" switch in top-right of the page).

Accessibility
- Buttons have ARIA labels and keyboard focus styles.
- Contrast targets AA for banner and main texts. Use dev tools to audit.

Files of interest (quick)
- pages/index.tsx: main wall + search + directory
- pages/b/[id].tsx: public block page (OG tags)
- components/WallCanvas.tsx: pan/zoom logic and rendering
- components/Block.tsx: block rendering (img/text, available visuals)
- components/SearchPanel.tsx: live search + filters + directory list
- components/BlockModal.tsx: block details + reserve form
- utils/geom.ts: isOverlapping(a,b) — anti-solape AABB
- pages/api/*: mock API endpoints

Notes / Limitations
- This is an MVP; the "10000px" virtual canvas is simulated via transforms — no WebGL.
- Avoid heavy libraries intentionally for portability.
- Seed data is pseudo-random deterministic to create many blocks (approx 190).
- The "zone" is determined by Y coordinate (top/center/rest) in quote API.

If you want, I can:
- Wire Supabase for persistent storage and real queries
- Add Stripe Checkout integration and server-side verification
- Add admin UI for moderation and approving reservations

Enjoy Brand Space™ — style it and wire it to payments/DB as needed!
```