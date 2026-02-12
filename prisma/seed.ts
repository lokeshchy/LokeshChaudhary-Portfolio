import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10) // Change this!
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  })
  console.log('Created admin user:', user.email)

  // Create default settings
  const defaultSettings = [
    { key: 'siteName', value: JSON.stringify('Portfolio') },
    { key: 'primaryColor', value: JSON.stringify('#3b82f6') },
    { key: 'accentColor', value: JSON.stringify('#8b5cf6') },
    { key: 'backgroundColor', value: JSON.stringify('#ffffff') },
    { key: 'footerText', value: JSON.stringify('© 2024 Portfolio. All rights reserved.') },
    { key: 'socialLinks', value: JSON.stringify({}) },
  ]

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log('Created default settings')

  // Create home page with hero section
  const homePageContent = {
    sections: [
      {
        id: 'hero',
        type: 'hero',
        enabled: true,
        order: 0,
        data: {
          title: 'Welcome to My Portfolio',
          subtitles: [
            'Geomatics Engineer',
            'Software Engineer',
            'GIS Analyst',
            'Remote Sensing Researcher',
          ],
          ctaText: 'View My Work',
          ctaLink: '/projects',
        },
      },
      {
        id: 'featured-projects',
        type: 'featured-projects',
        enabled: true,
        order: 1,
        data: {},
      },
      {
        id: 'about-preview',
        type: 'about-preview',
        enabled: true,
        order: 2,
        data: {},
      },
      {
        id: 'skills',
        type: 'skills',
        enabled: true,
        order: 3,
        data: {},
      },
      {
        id: 'experience-preview',
        type: 'experience-preview',
        enabled: true,
        order: 4,
        data: {},
      },
      {
        id: 'blogs',
        type: 'blogs',
        enabled: true,
        order: 5,
        data: {},
      },
    ],
  }

  await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Home',
      content: JSON.stringify(homePageContent),
      enabled: true,
      order: 0,
    },
  })
  console.log('Created home page')

  // Create sample experience
  const experience = await prisma.experience.create({
    data: {
      role: 'Software Engineer',
      organization: 'Example Company',
      location: 'Remote',
      startDate: new Date('2023-01-01'),
      description: JSON.stringify([
        'Developed full-stack web applications',
        'Collaborated with cross-functional teams',
        'Implemented best practices and code reviews',
      ]),
      type: 'Work',
      order: 0,
      visible: true,
    },
  })
  console.log('Created sample experience:', experience.role)

  // Create sample project
  const project = await prisma.project.create({
    data: {
      title: 'Sample Project',
      slug: 'sample-project',
      overview: 'This is a sample project to demonstrate the portfolio system.',
      problem: 'A problem that needed solving.',
      solution: 'An elegant solution was implemented.',
      result: 'Great results were achieved.',
      techStack: JSON.stringify(['React', 'Next.js', 'TypeScript']),
      imageGallery: JSON.stringify([]),
      featured: true,
      order: 0,
    },
  })
  console.log('Created sample project:', project.title)

  // Create sample skills
  const skills = [
    { name: 'React', category: 'Frontend', icon: '⚛️', order: 0 },
    { name: 'Next.js', category: 'Frontend', icon: '▲', order: 1 },
    { name: 'TypeScript', category: 'Frontend', icon: '📘', order: 2 },
    { name: 'Node.js', category: 'Backend', icon: '🟢', order: 0 },
    { name: 'PostgreSQL', category: 'Database', icon: '🐘', order: 0 },
  ]

  for (const skill of skills) {
    await prisma.skill.create({
      data: skill,
    })
  }
  console.log('Created sample skills')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
