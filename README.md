# Personal Portfolio CMS

A production-grade, fully dynamic personal portfolio website with an Admin CMS built with Next.js, TypeScript, and Prisma.

## Features

- 🎨 **Fully Dynamic Content** - Every piece of content is editable from the admin panel
- 🚀 **Modern Tech Stack** - Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- 📝 **CMS Admin Panel** - Complete content management system
- 🎭 **Hero with Rotating Subtitles** - Animated hero section with typewriter effect
- 💼 **Experience Timeline** - Beautiful vertical timeline for work experience
- 📚 **Blog System** - Full blog with markdown support
- 🎯 **Projects/Case Studies** - Detailed project showcase
- 🛠️ **Skills Management** - Categorized skills with icons
- ⚙️ **Global Settings** - Theme colors, SEO, social links all configurable
- 🔒 **Protected Admin Routes** - Secure authentication system
- 📱 **Responsive Design** - Mobile-first, modern UI

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with CSS Variables
- **Database**: SQLite (Prisma ORM) - easily switchable to PostgreSQL
- **Authentication**: Session-based (simple implementation)
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Lokesh-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

- **URL**: `/admin`
- **Default Email**: `admin@example.com`
- **Default Password**: `admin123`

**⚠️ IMPORTANT**: Change the default password immediately after first login!

## Project Structure

```
├── app/
│   ├── admin/          # Admin panel pages
│   ├── api/            # API routes
│   ├── about/          # Public pages
│   ├── blog/
│   ├── contact/
│   ├── experience/
│   ├── projects/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # Reusable components
├── lib/               # Utilities and helpers
├── prisma/            # Database schema and migrations
├── types/             # TypeScript type definitions
└── middleware.ts      # Route protection
```

## Admin Panel Features

### Dashboard
- Overview statistics
- Quick access to all sections

### Pages Management
- Edit home page content
- Configure hero section with rotating subtitles
- Enable/disable sections
- Reorder sections

### Experience Management
- Add/edit/delete experience entries
- Support for Work, Research, Internship, Volunteer types
- Timeline ordering
- Visibility toggle

### Projects Management
- Full case study support (Problem, Process, Solution, Result)
- Tech stack management
- Image gallery
- Featured projects
- SEO optimization

### Blog Management
- Markdown content editor
- Draft/Published status
- Tags and categories
- Featured images
- SEO metadata

### Skills Management
- Categorized skills
- Icon support
- Custom ordering

### Settings
- Site name and branding
- Theme colors (Primary, Accent, Background)
- Social media links
- Footer text
- Default SEO settings

## Customization

### Colors

Colors are managed via CSS variables and can be changed in the Admin Panel under Settings. The variables are:

- `--color-primary`: Primary brand color
- `--color-accent`: Accent color
- `--color-background`: Background color
- `--color-foreground`: Text color
- `--color-muted`: Muted text color
- `--color-border`: Border color

### Hero Subtitles

The hero section supports multiple subtitles that rotate automatically. Configure them in Admin → Pages → Edit Home Page → Hero Section.

## Database

The project uses SQLite by default for simplicity. To switch to PostgreSQL:

1. Update `DATABASE_URL` in `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
```

2. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Run migrations:
```bash
npx prisma migrate dev
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Environment Variables for Production

- Set `NODE_ENV=production`
- Use a strong `JWT_SECRET`
- Use a production database (PostgreSQL recommended)
- Configure proper CORS settings if needed

## API Routes

All API routes are RESTful and follow this pattern:

- `GET /api/{resource}` - List all
- `GET /api/{resource}/:id` - Get one
- `POST /api/{resource}` - Create
- `PUT /api/{resource}/:id` - Update
- `DELETE /api/{resource}/:id` - Delete

Protected routes require authentication via session cookie.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this for your own portfolio!

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and TypeScript
