# Quick Setup Guide

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Environment File**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="your-random-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Login: admin@example.com / admin123

## First Steps After Setup

1. **Change Admin Password**
   - Currently, you need to do this manually in the database or create a new user
   - The default password is `admin123` - change it immediately!

2. **Configure Home Page**
   - Go to Admin → Pages
   - Edit the Home page
   - Configure hero section with your rotating subtitles
   - Enable/disable sections as needed

3. **Update Settings**
   - Go to Admin → Settings
   - Update site name, colors, social links
   - Configure SEO defaults

4. **Add Your Content**
   - Add your experience entries
   - Create projects/case studies
   - Write blog posts
   - Add skills

## Database Management

- **View Database**: `npm run db:studio`
- **Reset Database**: Delete `prisma/dev.db` and run `npx prisma db push && npm run db:seed`
- **Create Migration**: `npx prisma migrate dev --name migration-name`

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Consider using PostgreSQL instead of SQLite
4. Run `npm run build` and `npm start`

## Troubleshooting

- **Database errors**: Make sure you've run `npx prisma generate` and `npx prisma db push`
- **Import errors**: Run `npm install` again
- **Build errors**: Check that all environment variables are set
