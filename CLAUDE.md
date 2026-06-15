# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # prisma migrate deploy + next build
npm run start            # Run production build
npm run lint             # ESLint via next lint

npm run db:push          # Sync Prisma schema to DB without migrations
npm run db:migrate:dev   # Create & apply a new migration (dev only)
npm run db:migrate:deploy # Apply pending migrations (production)
npm run db:seed          # Seed admin user + sample content (idempotent)
npm run db:studio        # Open Prisma Studio GUI
npm run db:generate      # Regenerate Prisma client after schema changes
```

Default local admin credentials (after seed): `admin@portfolio.com` / `admin123`

## Environment Variables

Required in `.env` for local dev:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."       # Needed for Prisma with connection poolers (e.g. Neon)
JWT_SECRET="<32+ chars>"
OTP_SECRET="<32+ chars>"
OTP_LOGIN_EMAIL="<admin email>"
SMTP_HOST=...
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=...
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

`src/lib/env.server.ts` validates and exports all env vars — it throws at startup if any required variable is missing or too short.

## Architecture

This is a **Next.js 16 App Router** project with a built-in headless CMS backed by **PostgreSQL via Prisma**.

### Route structure

- `src/app/(public)/` — Public-facing portfolio pages (Home, About, Projects, Blog, Experience, Certification, plus dynamic `[slug]` for custom pages)
- `src/app/admin/` — Password-protected CMS admin panel (sidebar nav, CRUD for all content types)
- `src/app/api/` — REST API routes consumed by the admin panel

Route notes:
- `/experience` redirects to `/about#experience`
- `/certifications` redirects to `/about#certifications`
- `/certification` is a separate legacy page

### Authentication

JWT-based, stored in an `httpOnly` cookie (`portfolio_admin_token`). Middleware at `src/middleware.ts` guards all `/admin/*` routes except `/admin/login`, `/admin/forgot-password`, and `/admin/reset-password`. API routes call `requireAuth()` from `src/lib/api-auth.ts`. OTP-based login email flow is implemented in `src/lib/login-otp.ts`.

### Data layer

All content is stored in PostgreSQL via Prisma. The schema (`prisma/schema.prisma`) defines: `User`, `Page`, `Experience`, `Project`, `Blog`, `Skill`, `Setting`, `PasswordResetToken`.

Several fields store JSON as strings: `Page.content`, `Experience.description`, `Project.techStack`, `Project.imageGallery`, `Blog.tags`, `Setting.value`. `src/lib/data.ts` wraps all DB reads, parses JSON, and calls `noStore()` to disable Next.js caching on every query.

### Page content model

The `Page` model stores a JSON blob in `content`. For the home page, this blob has `{ sections: PageSection[], hero: HeroContent }`. `PageSection` has a `type` (one of the `SectionType` union in `src/types/index.ts`), an `enabled` flag, `order`, and a `data` bag. `HomeSections.tsx` renders sections by type.

### Experience

The `Experience` model has a `workMode` field (Onsite | Hybrid | Remote). Allowed values for the CMS dropdowns — `EXPERIENCE_TYPES` and `WORK_MODES` — live in `src/lib/experience-constants.ts`; extend those arrays to add options. Use `parseWorkMode()` to normalize stored values. `ExperienceCarousel` renders the timeline on the public side.

### Settings

Global site settings (colors, social links, SEO defaults, logo) live in a single `Setting` row with `key = 'global'`. The value is a JSON-serialized `GlobalSettings` object (see `src/types/index.ts`). Theme colors from settings are injected as CSS variables at runtime via `src/components/ThemeSync.tsx`.

### Certifications

Certifications are stored inside the About `Page.content` blob. They can be either plain strings or structured `CertificationEntry` objects. `src/lib/certifications.ts` handles normalization and serialization between the two formats. Certificate images are external URLs proxied through `/api/cert-image` to avoid CORS issues.

The About page renders certifications via `CertificationFlipCards` — a client component with 3D flip animation. Front face shows metadata; back face shows the image. Clicking an image opens a fullscreen overlay.

### Design system

All visual tokens live in `src/app/globals.css` as CSS custom properties:

```css
--color-background: #070c18     /* deep navy */
--color-primary: #2dd4bf        /* teal-cyan — headings, active states, hover borders */
--color-secondary: #8b5cf6      /* violet — tags, badges, type labels */
--color-surface: #0c1525
--color-surface-raised: #111e34
--color-foreground: #e2e8f0
--color-muted: #64748b
```

Component classes defined in `globals.css` `@layer components`: `.card-glass`, `.card-project`, `.btn-cta`, `.btn-outline`, `.tag-tech`, `.tag-category`, `.skill-chip`, `.timeline-dot`, `.section-divider-glow`, `.text-gradient-primary`. Use these instead of ad-hoc Tailwind gradient combinations.

**Do not use `flashCardTone()` or `skillCardTone()`** — these hash-based random gradient functions create visual inconsistency and were removed from all public pages. The one remaining usage is inside `CertificationFlipCards.tsx` (client component) and is legacy.

Tailwind opacity utilities (e.g. `bg-primary/10`) don't work cleanly with hex CSS variable colors. Use `rgba()` directly in `style={}` or in CSS component classes instead.

### Animation system

Motion (`motion` v12, imported from `motion/react`) drives scroll and interaction animations. Reusable client primitives live in `src/components/motion/`:

- `Reveal` — scroll-triggered reveal with spring physics; supports `direction`, `stagger`, and `Reveal.Item` children. This is the preferred replacement for the legacy CSS `[data-animate]` system (still driven by `HomeAnimator.tsx` on the home page).
- `Tilt3D` / `MagneticLink` — pointer-reactive 3D tilt and magnetic hover effects.
- `AnimatedCounter` — counts up to a target when scrolled into view.

All motion primitives respect `useReducedMotion()`. Other animated client components: `AuroraBackground`, `ScrollProgress`, `HeroIntro`, `HeroPortrait3D`, `ExperienceCarousel`.

### Skill icons

`src/lib/skill-icons.tsx` exports `getSkillLogoUrl(name)` (returns a CDN URL or `null`) and `HomeSkillIcon` (a React component). Use these for rendering skill brand icons consistently across pages and components. The About page's inline `SkillIcon` function duplicates this logic for server-component contexts.

### Key reusable components

- `SkillsMarquee` — horizontally auto-scrolling skill chip strip. Props: `skills`, `ariaLabel`, `reverse` (alternate direction per row), `compact` (smaller chips). Used in the About sidebar.
- `CertificationFlipCards` — 3D-flip card grid for certifications. Client component; renders front metadata and back image.
- `HeroRotatingSubtitle` — cycles through subtitle strings with fade animation.
- `PublicHeader` — scroll-aware glass navbar with active nav highlight. Nav merges a fixed `SYSTEM_NAV` (Resume/Projects/Blog) with custom CMS pages, excluding reserved slugs in `SYSTEM_SLUGS`.

### Key path aliases

`@/` maps to `src/` (configured in `tsconfig.json`).
