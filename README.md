# Portfolio CMS

A personal portfolio where **all content is editable from the Admin Panel**—no code changes or redeploy needed to update text, projects, or blog posts.

---

## Quick start

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

- **Your site:** http://localhost:3000  
- **Admin panel:** http://localhost:3000/admin  
- **Login:** `admin@portfolio.com` / `admin123`

---

## How to modify your portfolio

Everything below is done in the **Admin** at http://localhost:3000/admin (after logging in).

### 1. Hero section (home page top)

- Go to **Pages** → leave **Home** selected.
- In **Hero section**:
  - **Title** – Main heading (e.g. “Hi, I’m Lokesh”).
  - **Subtitles** – One per line. These rotate (e.g. “Geomatics Engineer”, “Software Engineer”, “GIS Analyst”).
  - **CTA text** – Button label (e.g. “View My Work”).
  - **CTA link** – Where the button goes (e.g. `/projects`).
- Click **Save changes**.

### 2. Home sections: add, remove, reorder

- **Pages** → **Home**.
- In **Home sections**:
  - **Checkboxes** – Turn each section on or off.
  - **Order** – Change the number to change display order (lower = higher on page).
  - **Delete** – Removes that section from the home page.
  - **Add section** – Pick a type: Featured Projects, About Preview, Skills, Experience Preview, Latest Blogs, CTA, **Image**, **Video**, or **Custom**. For **Image** or **Video**, enter the URL (image URL, or YouTube/Vimeo/direct video URL) and optional caption. For **Custom**, set a title and Markdown content. Click **Add section**, then **Save changes**.
- Click **Save changes**.

### 3. Experience (jobs, research, internships)

- Go to **Experience**.
- **Add entry** – Role, Organization, Location (optional), Start/End date (use “Present” for current), Type (Work / Research / Internship / Volunteer), Description (one bullet per line), and **Visible on site**.
- Use **Edit** / **Delete** on each row to change or remove entries.
- The **Experience** page shows the full timeline (**most recent first**, by start date); the home page can show a short preview (if that section is enabled).

### 4. Projects / case studies

- Go to **Projects** → **Add project**.
- Fill in: **Title**, **Slug** (URL part, e.g. `my-gis-app`), **Overview**, **Problem**, **Process**, **Solution**, **Result** (all optional except overview).
- **Tech stack** – One tech per line.
- **Image gallery** – One image URL per line.
- **Featured** – Check to show on the home “Featured Projects” section.
- **Order** – Use the **↑** and **↓** buttons in the Projects list to choose the order projects appear on the site (top of the list = first on the page).
- **Save**. The project appears at `/projects` and at `/projects/[slug]`.

### 5. Blog posts

- Go to **Blogs** → **New post**.
- **Title**, **Slug** (e.g. `my-first-post`), **Excerpt** (short summary).
- **Content** – Full post in **Markdown** (headers, lists, links, code blocks all work).
- **Featured image URL** – Optional.
- **Tags** – Comma-separated.
- **SEO title** and **SEO description** – Optional, for search engines.
- **Published** – Check to show on the site; leave unchecked for draft.
- **Save**. Published posts appear on `/blog` and at `/blog/[slug]`.

### 6. Skills

- Go to **Skills** → **Add skill**.
- **Name** (e.g. “React”), **Category** (e.g. “Frontend”, “GIS”, “Backend”, “Tools”), **Icon** (name or URL, optional), **Order** (number for sorting).
- Edit or delete from the list. Skills show in the Skills section on the home page and on the About page (grouped by category).

### 7. About page content (bio, education, certifications, CV)

- Go to **Pages** → select **About**.
- **Short bio** – Intro paragraph.
- **Story** – Longer “about me” text.
- **Education** – One per line; use `Degree, Institution (Year)` (e.g. `B.Tech Geomatics, ABC University (2020)`).
- **Certifications** – One per line (e.g. `GIS Professional (GISP)`, `Google Cloud Certified`).
- **CV / Resume URL** – Link to your PDF or document for “Download CV”.
- Set **SEO title** and **SEO description** at the bottom of the page.
- **Save changes**.

### 8. Add or delete entire pages (e.g. Gallery, Certifications)

- **Pages** (top of the page list):
  - **Add page** – Enter a **slug** (e.g. `gallery`, `certifications`) and **Page title**. Click **Add page**. The new page appears in the nav and at `yoursite.com/gallery` (or whatever slug you used). Edit its content in the **Page content (Markdown)** box and **Save changes**.
  - **Delete a page** – Only **custom** pages (ones you added) show a **×** next to the tab. Click **×** to delete that page. System pages (Home, About, Projects, Blog, Experience, Contact) cannot be deleted.
- Custom pages use **Markdown** for the main body and can include **photos and videos**: below the text area, use **+ Add image** or **+ Add video**, enter URL (and optional caption). Use **↑** and **↓** next to each item to set the order they appear on the page. Video URLs can be YouTube, Vimeo, or direct video links. Custom pages appear in the header nav automatically.

### 9. Contact page

- **Pages** → **Contact**.
- Edit **SEO** and any stored form title/description if the app supports it in the UI.
- Social links and “contact” details are best set in **Settings** (see below).

### 10. Global settings (site name, colors, footer, social links)

- Go to **Settings**.
- **General:** Site name, Logo URL, Favicon URL, Footer text.
- **Theme colors:** Primary, Accent, Background (use hex codes or the color picker). These drive the look of the whole site.
- **Social links:** GitHub, LinkedIn, Twitter, Email URLs. These are used in the footer and anywhere else the theme displays them.
- **Default SEO:** Default meta title and description for pages that don’t set their own.
- **Save settings**.

### 11. SEO for a specific page

- **Pages** → choose the page (Home, About, Projects, etc.).
- Set **SEO title** and **SEO description** for that page.
- **Save changes**.

---

## Commands you’ll use

| Command | What it does |
|--------|----------------|
| `npm run dev` | Run the site and admin locally (with correct DB URL). |
| `npm run build` | Build for production. |
| `npm run start` | Run production build locally. |
| `npm run db:push` | Apply Prisma schema to the database (e.g. after schema changes). |
| `npm run db:seed` | Seed admin user and sample content (safe to run multiple times). |
| `npm run db:studio` | Open Prisma Studio to view/edit DB in a UI. |

---

## Environment (optional)

If you want to use a `.env` file (e.g. for production or a custom DB):

- Create `.env` in the project root.
- For **SQLite**, `DATABASE_URL` must start with `file:`:
  ```env
  DATABASE_URL="file:./prisma/dev.db"
  JWT_SECRET="your-secret-at-least-32-chars"
  NEXT_PUBLIC_APP_URL="http://localhost:3000"
  ```
- The `dev` / `build` / `start` scripts already set `DATABASE_URL` for SQLite if you don’t use `.env`.

---

## Where things live in the code (if you want to customize)

| What you want to change | Where to look |
|-------------------------|----------------|
| Home page sections (order, which sections exist) | `src/components/HomeSections.tsx` |
| Hero rotating subtitles (animation, timing) | `src/components/HeroRotatingSubtitle.tsx` |
| About page layout (bio, education, certifications) | `src/app/(public)/about/page.tsx` |
| Experience timeline layout | `src/app/(public)/experience/page.tsx` |
| Projects list and single project layout | `src/app/(public)/projects/page.tsx`, `src/app/(public)/projects/[slug]/page.tsx` |
| Blog list and single post layout | `src/app/(public)/blog/page.tsx`, `src/app/(public)/blog/[slug]/page.tsx` |
| Contact page | `src/app/(public)/contact/page.tsx` |
| Header navigation links | `src/components/PublicHeader.tsx` |
| Footer and social links | `src/components/PublicFooter.tsx` |
| Global styles and theme variables | `src/app/globals.css` |
| Admin sidebar and pages | `src/app/admin/` |

---

## Production checklist

1. Set a strong **`JWT_SECRET`** (at least 32 characters) in your hosting environment.
2. Set **`DATABASE_URL`** to your production database (e.g. PostgreSQL on a host).
3. Set **`NEXT_PUBLIC_APP_URL`** to your live site URL.
4. Run `npm run build` and deploy (e.g. Vercel, or `npm run start` on a server).

After that, you can keep modifying the portfolio entirely from the Admin panel without redeploying.
