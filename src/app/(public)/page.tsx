import { HomeSections } from '@/components/HomeSections';
import { getPageBySlug } from '@/lib/data';

export default async function HomePage() {
  const page = await getPageBySlug('home');
  const sections = page?.content?.sections ?? [];
  const hero = page?.content?.hero ?? { title: 'Hi', subtitles: [], ctaText: 'View Work', ctaLink: '/projects' };

  return (
    <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 py-12">
      <HomeSections sections={sections} hero={hero} />
    </div>
  );
}
