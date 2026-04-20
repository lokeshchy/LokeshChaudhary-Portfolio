import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const defaultSettings = {
  siteName: 'Lokesh Chaudhary | Portfolio',
  logo: '',
  favicon: '',
  primaryColor: '#4f46e5',
  accentColor: '#f59e0b',
  backgroundColor: '#f8fafc',
  footerText: '© 2026 Lokesh Chaudhary. Built with Next.js.',
  socialLinks: {
    github: 'https://github.com/lokeshchy',
    linkedin: 'https://www.linkedin.com/in/lokeshchy/',
    twitter: '',
    email: 'mailto:lokeshchaudhary.dev@gmail.com',
    phone: '+9779808672026',
  },
  defaultSeoTitle: 'Lokesh Chaudhary | Jr. Software Engineer & Geomatics Engineer',
  defaultSeoDesc:
    'Jr. Software Engineer at T.E.J. Center. Geomatics engineer and full stack developer focused on distributed backends, GIS, remote sensing, and modern web systems.',
};

const homePageContent = {
  sections: [
    { id: 'hero', type: 'hero', enabled: true, order: 0, data: {} },
    { id: 'featured', type: 'featured-projects', enabled: true, order: 1, data: {} },
    { id: 'about-preview', type: 'about-preview', enabled: true, order: 2, data: {} },
    { id: 'skills', type: 'skills-snapshot', enabled: true, order: 3, data: {} },
    { id: 'exp-preview', type: 'experience-preview', enabled: true, order: 4, data: {} },
    { id: 'blogs', type: 'latest-blogs', enabled: true, order: 5, data: {} },
    { id: 'cta', type: 'cta', enabled: true, order: 6, data: {} },
  ],
  hero: {
    title: "Hi, I'm Lokesh",
    subtitles: [
      'Jr. Software Engineer',
      'Geomatics Engineer',
      'Full Stack Developer',
      'GIS & Remote Sensing',
    ],
    ctaText: 'View My Work',
    ctaLink: '/projects',
  },
};

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@portfolio.com' },
    update: {},
    create: {
      email: 'admin@portfolio.com',
      password: hashedPassword,
      name: 'Admin',
    },
  });

  await prisma.setting.upsert({
    where: { key: 'global' },
    update: { value: JSON.stringify(defaultSettings) },
    create: { key: 'global', value: JSON.stringify(defaultSettings) },
  });

  const pages = [
    {
      slug: 'home',
      title: 'Home',
      content: JSON.stringify(homePageContent),
      seoTitle: 'Lokesh Chaudhary | Home',
      seoDesc: 'Portfolio of Lokesh Chaudhary.',
    },
    {
      slug: 'about',
      title: 'About',
      content: JSON.stringify({
        sections: [],
        bio: 'Jr. Software Engineer at T.E.J. Center and Geomatics Engineer (B.E.) building scalable backends, GIS workflows, and full stack products.',
        story:
          'I combine geospatial analysis with modern software engineering—distributed systems with Node.js, full stack apps with React and TypeScript, and GIS/ML work from LULC mapping to multi-criteria suitability modeling. I care about performance, maintainability, and shipping reliable production systems.',
        education: [
          {
            name: 'Full Stack Open (Certificate), University of Helsinki · Finland',
            year: 'Jul 2025 – Dec 2025',
          },
          {
            name: "Bachelor's Degree in Geomatics Engineering, Institute of Engineering, Pashchimanchal Campus · Pokhara",
            year: '2021 – 2025',
          },
          {
            name: '+2 Science (Computer Major), Kathmandu Model Secondary School · Lalitpur',
            year: '2018 – 2020',
          },
        ],
        certifications: [
          {
            title: "MCP's 1st Birthday Hackathon 2025",
            issuer: 'United Latino Students Association',
            issued: 'Dec 2025',
          },
          {
            title: 'Python Programming',
            issuer: 'Great Learning',
            issued: 'Jan 2024',
            credentialId: 'ZRRPLUKS',
          },
          {
            title: 'Microsoft Excel for Beginners',
            issuer: 'Great Learning',
            issued: 'Jan 2023',
            credentialId: 'VMLDQXUA',
          },
          {
            title: 'Identification of Misinformation',
            issuer: 'US Embassy Youth Councils Inc.',
            issued: 'Jan 2022',
            skills: 'Public Relations, Civic Engagement, +3 skills',
          },
          'OSM Hackfest 2023',
          'Training on DGPS and Terrestrial LiDAR Scanner',
        ],
        cvUrl: '',
      }),
      seoTitle: 'About | Lokesh Chaudhary',
      seoDesc: 'About Lokesh Chaudhary: Jr. Software Engineer, geomatics background, education, and certifications.',
    },
    { slug: 'projects', title: 'Projects', content: JSON.stringify({ sections: [] }), seoTitle: 'Projects | Lokesh Chaudhary', seoDesc: 'Selected software and GIS projects.' },
    { slug: 'blog', title: 'Blog', content: JSON.stringify({ sections: [] }), seoTitle: 'Blog | Lokesh Chaudhary', seoDesc: 'Articles on software, GIS, and learning.' },
    { slug: 'experience', title: 'Experience', content: JSON.stringify({ sections: [] }), seoTitle: 'Experience | Lokesh Chaudhary', seoDesc: 'Professional and fellowship experience.' },
    {
      slug: 'contact',
      title: 'Contact',
      content: JSON.stringify({
        sections: [],
        formTitle: 'Get in Touch',
        formDesc:
          'Open to collaboration on backend systems, full stack products, GIS and remote sensing work, and research-oriented builds.',
      }),
      seoTitle: 'Contact | Lokesh Chaudhary',
      seoDesc: 'Contact Lokesh Chaudhary by email, phone, or social links.',
    },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        content: p.content,
        seoTitle: p.seoTitle,
        seoDesc: p.seoDesc,
      },
      create: p,
    });
  }

  await prisma.experience.deleteMany({});
  await prisma.experience.createMany({
    data: [
      {
        role: 'Jr. Software Engineer',
        organization: 'T.E.J. Center Pvt. Ltd.',
        location: 'Nepal',
        startDate: '2026-01',
        endDate: 'Present',
        description: JSON.stringify([
          'Designed and contributed to scalable distributed backend systems using Node.js and modern web technologies.',
          'Participated in system design discussions and implemented backend services improving performance and maintainability.',
          'Worked on deployment workflows and improved reliability of production systems.',
        ]),
        type: 'Work',
        order: 0,
        visible: true,
      },
      {
        role: 'TEJ Fellow – 2025 Cohort',
        organization: 'TEJ Fellowship',
        location: 'Kupandol, Lalitpur',
        startDate: '2025-07',
        endDate: '2025-12',
        description: JSON.stringify([
          'Created dynamic applications, designed responsive UI/UX components, maintained backend databases and APIs for smooth full stack functionality.',
        ]),
        type: 'Internship',
        order: 1,
        visible: true,
      },
      {
        role: 'Campus Director',
        organization: 'Hult Prize (IOE), Paschimanchal Campus (Certificate)',
        location: 'Pokhara',
        startDate: '2022-01',
        endDate: '2023-12',
        description: JSON.stringify([
          'Oversaw university-level entrepreneurship initiatives by coordinating cross-functional teams, managing strategic partnerships, and mentoring student entrepreneurs to build impactful social ventures.',
        ]),
        type: 'Volunteer',
        order: 2,
        visible: true,
      },
    ],
  });

  await prisma.skill.deleteMany({});
  await prisma.skill.createMany({
    data: [
      { name: 'TypeScript', category: 'Language', icon: 'typescript', order: 0 },
      { name: 'JavaScript', category: 'Language', icon: 'javascript', order: 1 },
      { name: 'C', category: 'Language', icon: 'c', order: 2 },
      { name: 'C++', category: 'Language', icon: 'cplusplus', order: 3 },
      { name: 'Python', category: 'Language', icon: 'python', order: 4 },
      { name: 'HTML', category: 'Language', icon: 'html', order: 5 },
      { name: 'CSS', category: 'Language', icon: 'css', order: 6 },
      { name: 'Node.js', category: 'Language', icon: 'nodejs', order: 7 },
      { name: 'React', category: 'Frontend', icon: 'react', order: 10 },
      { name: 'Tailwind CSS', category: 'Frontend', icon: 'tailwindcss', order: 11 },
      { name: 'Express', category: 'Backend', icon: 'express', order: 20 },
      { name: 'REST APIs', category: 'Backend', icon: 'api', order: 21 },
      { name: 'PostgreSQL', category: 'Database', icon: 'postgresql', order: 30 },
      { name: 'MongoDB', category: 'Database', icon: 'mongodb', order: 31 },
      { name: 'Redis', category: 'Tools', icon: 'redis', order: 40 },
      { name: 'Docker', category: 'Tools', icon: 'docker', order: 41 },
      { name: 'Kafka', category: 'Tools', icon: 'kafka', order: 42 },
      { name: 'Git', category: 'Tools', icon: 'git', order: 43 },
      { name: 'GitHub', category: 'Tools', icon: 'github', order: 44 },
      { name: 'Figma', category: 'Tools', icon: 'figma', order: 45 },
      { name: 'Postman', category: 'Tools', icon: 'postman', order: 46 },
      { name: 'LangChain', category: 'Tools', icon: 'langchain', order: 47 },
      { name: 'MCP', category: 'Tools', icon: 'mcp', order: 48 },
      { name: 'Cloudflare CDN', category: 'Tools', icon: 'cloudflare', order: 49 },
      { name: 'WebGIS', category: 'GIS', icon: 'webgis', order: 50 },
      { name: 'ArcGIS', category: 'GIS', icon: 'arcgis', order: 51 },
      { name: 'QGIS', category: 'GIS', icon: 'qgis', order: 52 },
      { name: 'Remote Sensing', category: 'GIS & ML', icon: 'remote-sensing', order: 60 },
      { name: 'Machine Learning', category: 'GIS & ML', icon: 'ml', order: 61 },
      { name: 'Sentinel-2', category: 'GIS & ML', icon: 'sentinel', order: 62 },
      { name: 'Leaflet.js', category: 'GIS & ML', icon: 'leaflet', order: 63 },
      { name: 'Teamwork', category: 'Soft Skills', icon: '', order: 70 },
      { name: 'Problem-solving', category: 'Soft Skills', icon: '', order: 71 },
      { name: 'Decision-making', category: 'Soft Skills', icon: '', order: 72 },
      { name: 'Communication', category: 'Soft Skills', icon: '', order: 73 },
    ],
  });

  await prisma.blog.upsert({
    where: { slug: 'journey-from-geomatics-to-full-stack' },
    update: {
      title: 'Journey from Geomatics to Full Stack Engineering',
      content:
        '## Why this transition matters\n\nMy background in geomatics trained me to think in systems, data quality, and spatial context. Full stack engineering gives me the tools to turn those insights into products people can actually use.\n\n## What I focus on\n\n- Building reliable backend services\n- Designing map-driven and data-heavy interfaces\n- Combining geospatial analysis with modern web stacks',
      excerpt: 'How geomatics engineering and full stack development complement each other.',
      tags: JSON.stringify(['career', 'full-stack', 'gis']),
      published: true,
      publishedAt: new Date(),
    },
    create: {
      title: 'Journey from Geomatics to Full Stack Engineering',
      slug: 'journey-from-geomatics-to-full-stack',
      content:
        '## Why this transition matters\n\nMy background in geomatics trained me to think in systems, data quality, and spatial context. Full stack engineering gives me the tools to turn those insights into products people can actually use.\n\n## What I focus on\n\n- Building reliable backend services\n- Designing map-driven and data-heavy interfaces\n- Combining geospatial analysis with modern web stacks',
      excerpt: 'How geomatics engineering and full stack development complement each other.',
      tags: JSON.stringify(['career', 'full-stack', 'gis']),
      published: true,
      publishedAt: new Date(),
    },
  });

  const projects = [
    {
      title: 'Achievement Education and Visa Services',
      slug: 'achievement-education-visa-services',
      overview: 'A CMS-driven education consultancy platform with dynamic content sections and SEO-friendly routing.',
      problem: 'The consultancy needed a scalable website where non-technical users could update service content without code changes.',
      process: 'Built a Strapi-backed architecture, modeled reusable content blocks, and integrated API data into a modern frontend.',
      solution: 'Implemented dynamic page rendering for sections like Hero, Services, and Testimonials with REST API integration.',
      result: 'Delivered a maintainable full stack platform that improved content management speed and SEO readiness.',
      techStack: JSON.stringify(['Strapi', 'PostgreSQL', 'TypeScript', 'React', 'Tailwind CSS']),
      imageGallery: JSON.stringify([]),
      featured: true,
      order: 0,
    },
    {
      title: 'High-Accuracy LULC Mapping of Bhanu Municipality',
      slug: 'high-accuracy-lulc-mapping-bhanu',
      overview: 'Land Use/Land Cover mapping project using Sentinel-2 imagery and supervised Random Forest classification.',
      problem: 'Decision makers required an accurate and validated LULC map for planning and analysis.',
      process: 'Prepared remote sensing data, trained and validated a Random Forest model, and evaluated output with Kappa statistics.',
      solution: 'Produced a high-accuracy LULC map in ArcGIS workflow with repeatable supervised classification methodology.',
      result:
        'Validated the map with Kappa coefficient and presented the work to the President of Nepal.',
      techStack: JSON.stringify(['ArcGIS', 'Sentinel-2', 'Python', 'Random Forest', 'Remote Sensing']),
      imageGallery: JSON.stringify([]),
      featured: true,
      order: 1,
    },
    {
      title: 'Ghumantay - AI-Powered Travel and Route Planner',
      slug: 'ghumantay-ai-route-planner',
      overview: 'An interactive travel dashboard with real-time map routing and AI-generated itinerary suggestions.',
      problem: 'Travelers needed a single interface for route visualization and contextual planning suggestions.',
      process: 'Integrated map rendering, routing interactions, and AI prompts while optimizing UI for usability.',
      solution: 'Built a React + Leaflet dashboard using OpenStreetMap data and Gemini-powered trip assistance.',
      result: 'Created a practical prototype for smarter route planning with improved user engagement.',
      techStack: JSON.stringify(['React', 'Leaflet.js', 'OpenStreetMap', 'Tailwind CSS', 'Gemini API']),
      imageGallery: JSON.stringify([]),
      featured: true,
      order: 2,
    },
    {
      title: 'GIS-Based AHP for Solar Plant Site Selection',
      slug: 'gis-ahp-solar-site-selection-bagmati',
      overview: 'Spatial suitability analysis for solar plant siting in Bagmati Province using GIS-AHP methods.',
      problem: 'Needed an evidence-based framework to identify highly suitable solar development zones.',
      process: 'Processed and weighted eight spatial criteria in ArcGIS/QGIS and automated analysis steps with Python.',
      solution: 'Developed a GIS-AHP model to generate and validate suitability maps.',
      result: 'Identified the top 10% most suitable areas for solar plant development.',
      techStack: JSON.stringify(['ArcGIS', 'QGIS', 'Python', 'AHP Model', 'GIS']),
      imageGallery: JSON.stringify([]),
      featured: false,
      order: 3,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
