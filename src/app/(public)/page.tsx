import { HomeSections } from '@/components/HomeSections';
import { getPageBySlug } from '@/lib/data';

export default async function HomePage() {
  const page = await getPageBySlug('home');
  const sections = page?.content?.sections ?? [];
  const hero = page?.content?.hero ?? { title: 'Hi', subtitles: [], ctaText: 'View Work', ctaLink: '/projects' };

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <HomeSections sections={sections} hero={hero} />
    </div>
  );
}
